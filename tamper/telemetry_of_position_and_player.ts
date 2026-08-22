// ==UserScript==
// @name         Hordes.io Chat -> Local WebSocket
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Export Hordes.io game chat to a local WebSocket server
// @author       You
// @match        https://hordes.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("[Hordes.io WS] Chat exporter starting...");


    // ============================================================
    // CONFIGURATION
    // ============================================================

    const socketUrl = "ws://localhost:7072";

    const SCAN_INTERVAL = 250;


    // ============================================================
    // WEBSOCKET
    // ============================================================

    let socket = null;
    let isConnected = false;


    function connectWebSocket() {

        if (
            socket &&
            (
                socket.readyState === WebSocket.OPEN ||
                socket.readyState === WebSocket.CONNECTING
            )
        ) {
            return;
        }

        console.log(
            "[Hordes.io WS] Connecting to " + socketUrl
        );

        try {

            socket = new WebSocket(socketUrl);


            socket.addEventListener("open", function () {

                isConnected = true;

                console.log(
                    "[Hordes.io WS] Connected to " + socketUrl
                );
            });


            socket.addEventListener("close", function () {

                isConnected = false;

                console.log(
                    "[Hordes.io WS] Connection closed. Retrying..."
                );
            });


            socket.addEventListener("error", function (error) {

                isConnected = false;

                console.error(
                    "[Hordes.io WS] WebSocket error:",
                    error
                );
            });


            socket.addEventListener("message", function (event) {

                console.log(
                    "[Hordes.io WS] Server:",
                    event.data
                );
            });

        }
        catch (error) {

            isConnected = false;

            console.error(
                "[Hordes.io WS] Connection exception:",
                error
            );
        }
    }


    setInterval(
        connectWebSocket,
        1000
    );

    connectWebSocket();


    // ============================================================
    // SEND TEXT TO SERVER
    // ============================================================

    function sendToServer(data) {

        if (
            !socket ||
            socket.readyState !== WebSocket.OPEN
        ) {
            console.log(
                "[Hordes.io WS] Server not connected. Message skipped."
            );

            return;
        }


        /*
         * Example:
         *
         * type:chat
         * time:21.59
         * channel:faction
         * level:45
         * class_icon:1
         * sender:gurok
         * message:2k too low sry
         *
         */

        const lines = [];


        for (const key in data) {

            if (
                data[key] !== undefined &&
                data[key] !== null
            ) {

                lines.push(
                    key +
                    ":" +
                    String(data[key])
                        .replace(/\r?\n/g, " ")
                );
            }
        }


        /*
         * Empty line separates messages.
         */

        const message =
            lines.join("\n") +
            "\n\n";


        socket.send(message);


        console.log(
            "[Hordes.io WS] Chat sent:\n" +
            message
        );
    }


    // ============================================================
    // GET CLASS ICON ID
    // ============================================================

    function getClassIconId(senderElement) {

        if (!senderElement) {
            return "";
        }


        /*
         * Look specifically for:
         *
         * /data/ui/classes/0.avif
         * /data/ui/classes/1.avif
         * /data/ui/classes/2.avif
         * etc.
         *
         * This intentionally does NOT match:
         *
         * /data/ui/icons/gem.svg
         */


        const images =
            senderElement.querySelectorAll("img");


        for (const img of images) {

            const src =
                img.getAttribute("src") || "";


            const match =
                src.match(
                    /\/data\/ui\/classes\/(\d+)\.avif/
                );


            if (match) {

                return parseInt(
                    match[1],
                    10
                );
            }
        }


        return "";
    }


    // ============================================================
    // PARSE CHAT ARTICLE
    // ============================================================

    function parseChatArticle(article) {

        if (!article) {
            return null;
        }


        // --------------------------------------------------------
        // TIME
        // --------------------------------------------------------

        const timeElement =
            article.querySelector(".time");


        const time =
            timeElement
                ? timeElement.textContent.trim()
                : "";


        // --------------------------------------------------------
        // CHANNEL
        // --------------------------------------------------------

        const channelElement =
            article.querySelector(".channel");


        const channel =
            channelElement
                ? channelElement.textContent.trim()
                : "";


        // --------------------------------------------------------
        // SENDER
        // --------------------------------------------------------

        const senderElement =
            article.querySelector(".sender");


        let sender = "";
        let level = "";
        let classIcon = "";


        if (senderElement) {

            // ----------------------------------------------------
            // NAME
            // ----------------------------------------------------

            const nameElement =
                senderElement.querySelector(".name");


            if (nameElement) {

                sender =
                    nameElement.textContent.trim();
            }


            // ----------------------------------------------------
            // LEVEL
            // ----------------------------------------------------

            const textWhite =
                senderElement.querySelector(
                    ".textwhite"
                );


            if (textWhite) {

                const text =
                    textWhite.textContent.trim();


                const match =
                    text.match(/(\d+)/);


                if (match) {

                    level =
                        parseInt(
                            match[1],
                            10
                        );
                }
            }


            // ----------------------------------------------------
            // CLASS ICON
            // ----------------------------------------------------

            classIcon =
                getClassIconId(
                    senderElement
                );
        }


        // --------------------------------------------------------
        // MESSAGE
        // --------------------------------------------------------

        let message = "";


        const lineWrap =
            article.querySelector(
                ".linewrap"
            );


        if (lineWrap) {

            const spans =
                lineWrap.querySelectorAll(
                    "span"
                );


            for (const span of spans) {

                /*
                 * Ignore metadata.
                 */

                if (
                    span.classList.contains("time") ||
                    span.classList.contains("content") ||
                    span.classList.contains("sender") ||
                    span.classList.contains("channel") ||
                    span.classList.contains("name") ||
                    span.classList.contains("textwhite")
                ) {
                    continue;
                }


                /*
                 * Ignore anything inside sender.
                 */

                if (span.closest(".sender")) {
                    continue;
                }


                const text =
                    span.textContent.trim();


                if (text) {

                    message = text;

                    break;
                }
            }
        }


        // --------------------------------------------------------
        // GM / SYSTEM MESSAGE
        // --------------------------------------------------------

        if (!message) {

            const gmElement =
                article.querySelector(
                    ".textGM:not(.content)"
                );


            if (gmElement) {

                message =
                    gmElement.textContent.trim();
            }
        }


        // --------------------------------------------------------
        // VALIDATION
        // --------------------------------------------------------

        if (!message) {
            return null;
        }


        // --------------------------------------------------------
        // RESULT
        // --------------------------------------------------------

        const result = {

            type: "chat",

            time: time,

            channel: channel,

            level: level,

            class_icon: classIcon,

            sender: sender,

            message: message
        };


        return result;
    }


    // ============================================================
    // DUPLICATE DETECTION
    // ============================================================

    const seenMessages =
        new Set();


    function getFingerprint(data) {

        return [

            data.time,

            data.channel,

            data.level,

            data.class_icon,

            data.sender,

            data.message

        ].join("|");
    }


    function processArticle(article) {

        if (
            !article ||
            !article.matches("article.line")
        ) {
            return;
        }


        const data =
            parseChatArticle(article);


        if (!data) {
            return;
        }


        const fingerprint =
            getFingerprint(data);


        if (seenMessages.has(fingerprint)) {
            return;
        }


        seenMessages.add(
            fingerprint
        );


        /*
         * Prevent unlimited memory usage.
         */

        if (seenMessages.size > 2000) {

            const first =
                seenMessages.values()
                    .next()
                    .value;


            seenMessages.delete(
                first
            );
        }


        sendToServer(data);
    }


    // ============================================================
    // SCAN EXISTING CHAT
    // ============================================================

    function scanChat() {

        const articles =
            document.querySelectorAll(
                "article.line"
            );


        for (const article of articles) {

            processArticle(
                article
            );
        }
    }


    // ============================================================
    // MUTATION OBSERVER
    // ============================================================

    const observer =
        new MutationObserver(
            function (mutations) {

                for (const mutation of mutations) {

                    for (
                        const node
                        of mutation.addedNodes
                    ) {

                        if (
                            node.nodeType !==
                            Node.ELEMENT_NODE
                        ) {
                            continue;
                        }


                        // Direct article

                        if (
                            node.matches &&
                            node.matches(
                                "article.line"
                            )
                        ) {

                            processArticle(
                                node
                            );
                        }


                        // Article inside added element

                        if (
                            node.querySelectorAll
                        ) {

                            const articles =
                                node.querySelectorAll(
                                    "article.line"
                                );


                            for (
                                const article
                                of articles
                            ) {

                                processArticle(
                                    article
                                );
                            }
                        }
                    }
                }
            }
        );


    observer.observe(
        document.body,
        {
            childList: true,
            subtree: true
        }
    );


    // ============================================================
    // FALLBACK SCANNER
    // ============================================================

    setInterval(
        scanChat,
        SCAN_INTERVAL
    );


    // ============================================================
    // START
    // ============================================================

    console.log(
        "[Hordes.io WS] Chat observer started."
    );

})();
