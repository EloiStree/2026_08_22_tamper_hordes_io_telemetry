// ==UserScript==
// @name         Hordes.io Chat -> Local WebSocket Player
// @namespace    http://tampermonkey.net/
// @version      0.1
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

    // How often we check for new chat messages.
    // MutationObserver is used primarily, but this can also help
    // if the game replaces DOM elements in unusual ways.
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

        console.log("[Hordes.io WS] Connecting to " + socketUrl);

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

        } catch (error) {

            isConnected = false;

            console.error(
                "[Hordes.io WS] Connection exception:",
                error
            );
        }
    }


    setInterval(connectWebSocket, 1000);

    connectWebSocket();


    // ============================================================
    // SEND TEXT TO SERVER
    // ============================================================

    function sendToServer(data) {

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.log(
                "[Hordes.io WS] Server not connected. Message skipped."
            );

            return;
        }

        /*
         * Protocol:
         *
         * type:chat
         * time:21.59
         * channel:faction
         * level:45
         * sender:TankyManky
         * message:im 2k
         *
         */

        const lines = [];

        for (const key in data) {

            if (
                data[key] !== undefined &&
                data[key] !== null
            ) {
                lines.push(
                    key + ":" + String(data[key]).replace(/\r?\n/g, " ")
                );
            }
        }

        // Empty line terminates one message.
        const message = lines.join("\n") + "\n\n";

        socket.send(message);

        console.log(
            "[Hordes.io WS] Chat sent:\n" + message
        );
    }


    // ============================================================
    // CHAT PARSING
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


        if (senderElement) {

            const nameElement =
                senderElement.querySelector(".name");

            if (nameElement) {
                sender = nameElement.textContent.trim();
            }

            /*
             * Example:
             *
             * <span class="textwhite">
             *     <img ...>
             *     45
             * </span>
             *
             */

            const textWhite =
                senderElement.querySelector(".textwhite");

            if (textWhite) {

                const text =
                    textWhite.textContent.trim();

                const match =
                    text.match(/(\d+)/);

                if (match) {
                    level = parseInt(match[1], 10);
                }
            }
        }


        // --------------------------------------------------------
        // MESSAGE
        // --------------------------------------------------------

        /*
         * Normal player message:
         *
         * <span class="textfaction ...">
         *     im 2k
         * </span>
         *
         * GM/system message is slightly different:
         *
         * <span class="textGM ...">
         *     <span>
         *         Gloomfury will disappear soon!
         *     </span>
         * </span>
         */

        let message = "";

        const lineWrap =
            article.querySelector(".linewrap");

        if (lineWrap) {

            /*
             * Prefer the message span that is NOT:
             * - .content
             * - .sender
             */

            const spans =
                lineWrap.querySelectorAll("span");

            for (const span of spans) {

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
                 * Ignore spans containing the sender.
                 */
                if (span.closest(".sender")) {
                    continue;
                }

                const text =
                    span.textContent.trim();

                if (text) {

                    message = text;

                    /*
                     * For a normal message, the first suitable
                     * span will generally be the message.
                     */
                    break;
                }
            }
        }


        // --------------------------------------------------------
        // GM / SYSTEM MESSAGE FALLBACK
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

        return {
            type: "chat",
            time: time,
            channel: channel,
            level: level,
            sender: sender,
            message: message
        };
    }


    // ============================================================
    // DUPLICATE DETECTION
    // ============================================================

    /*
     * Hordes can rerender parts of the chat.
     *
     * We therefore create a fingerprint for every message.
     */

    const seenMessages = new Set();

    function getFingerprint(data) {

        return [
            data.time,
            data.channel,
            data.level,
            data.sender,
            data.message
        ].join("|");
    }


    function processArticle(article) {

        if (!article.matches("article.line")) {
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

        seenMessages.add(fingerprint);

        // Keep memory under control.
        if (seenMessages.size > 2000) {

            const first =
                seenMessages.values().next().value;

            seenMessages.delete(first);
        }

        sendToServer(data);
    }


    // ============================================================
    // FIND CHAT CONTAINER
    // ============================================================

    function scanChat() {

        const articles =
            document.querySelectorAll(
                "article.line"
            );

        for (const article of articles) {

            processArticle(article);
        }
    }


    // ============================================================
    // MUTATION OBSERVER
    // ============================================================

    const observer =
        new MutationObserver(function (mutations) {

            for (const mutation of mutations) {

                for (const node of mutation.addedNodes) {

                    if (node.nodeType !== Node.ELEMENT_NODE) {
                        continue;
                    }

                    // New article directly added.
                    if (
                        node.matches &&
                        node.matches("article.line")
                    ) {
                        processArticle(node);
                    }

                    // Or an element containing articles.
                    if (node.querySelectorAll) {

                        const articles =
                            node.querySelectorAll(
                                "article.line"
                            );

                        for (const article of articles) {
                            processArticle(article);
                        }
                    }
                }
            }
        });


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
    // STARTUP
    // ============================================================

    console.log(
        "[Hordes.io WS] Chat observer started."
    );

})();
