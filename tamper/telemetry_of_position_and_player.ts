// ==UserScript==
// @name         Hordes.io Player Data to Local WebSocket
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Send Hordes.io game data to a local WebSocket server
// @match        https://hordes.io/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    // ============================================================
    // SETTINGS
    // ============================================================

    const socketUrl = 'ws://localhost:7072';

    const dataCheckInterval = 15;

    const reconnectInterval = 1000;

    const useConsoleDebug = true;


    // ============================================================
    // VARIABLES
    // ============================================================

    let socket = null;

    let connectionInProgress = false;

    let isConnectionValid = false;

    let previousData = '';


    // ============================================================
    // DEBUG
    // ============================================================

    function debugLog(message) {

        if (useConsoleDebug) {
            console.log('[Hordes.io WS] ' + message);
        }
    }


    // ============================================================
    // WEBSOCKET
    // ============================================================

    function reconnectIfOffline() {

        if (
            socket &&
            socket.readyState === WebSocket.OPEN
        ) {
            isConnectionValid = true;
            return;
        }


        if (connectionInProgress) {
            return;
        }


        connectionInProgress = true;
        isConnectionValid = false;


        debugLog(
            'Connecting to ' + socketUrl
        );


        try {

            socket = new WebSocket(socketUrl);


            socket.addEventListener(
                'open',
                function() {

                    connectionInProgress = false;
                    isConnectionValid = true;

                    console.log(
                        '[Hordes.io WS] Connected to ' +
                        socketUrl
                    );
                }
            );


            socket.addEventListener(
                'message',
                function(event) {

                    debugLog(
                        'Server message: ' +
                        event.data
                    );
                }
            );


            socket.addEventListener(
                'close',
                function() {

                    connectionInProgress = false;
                    isConnectionValid = false;

                    debugLog(
                        'WebSocket connection closed'
                    );
                }
            );


            socket.addEventListener(
                'error',
                function(error) {

                    connectionInProgress = false;
                    isConnectionValid = false;

                    console.error(
                        '[Hordes.io WS] WebSocket error:',
                        error
                    );
                }
            );

        } catch (error) {

            connectionInProgress = false;
            isConnectionValid = false;

            console.error(
                '[Hordes.io WS] Connection error:',
                error
            );
        }
    }


    // ============================================================
    // NUMBER
    // ============================================================

    function parseNumber(text) {

        if (
            text === null ||
            text === undefined
        ) {
            return null;
        }


        const cleaned =
            String(text)
                .replace(/,/g, '')
                .trim();


        if (cleaned === '') {
            return null;
        }


        const value = Number(cleaned);


        if (Number.isNaN(value)) {
            return null;
        }


        return value;
    }


    // ============================================================
    // RESOURCE
    // ============================================================

    function parseResource(text) {

        if (!text) {

            return {
                current: null,
                max: null
            };
        }


        const cleaned =
            text.replace(/\s/g, '');


        const parts =
            cleaned.split('/');


        if (parts.length !== 2) {

            return {
                current: null,
                max: null
            };
        }


        return {

            current:
                parseNumber(parts[0]),

            max:
                parseNumber(parts[1])
        };
    }


    // ============================================================
    // POSITION
    // ============================================================

    function getPosition() {

        const elements =
            document.querySelectorAll('.textyellow');


        for (
            let i = 0;
            i < elements.length;
            i++
        ) {

            const text =
                elements[i].textContent.trim();


            if (!text) {
                continue;
            }


            const match = text.match(
                /^(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)$/
            );


            if (!match) {
                continue;
            }


            return {

                x: Number(match[1]),

                y: Number(match[2]),

                z: Number(match[3])
            };
        }


        return null;
    }


    // ============================================================
    // PLAYER / TARGET
    // ============================================================

    function getUnitData(id) {

        const unit =
            document.getElementById(id);


        if (!unit) {

            return {

                name: '',
                level: null,
                life: null,
                life_max: null,
                mana: null,
                mana_max: null
            };
        }


        const healthBar =
            unit.querySelector(
                '.progressBar.bghealth, .progressBar.bgenemy'
            );


        let name = '';

        let life = null;

        let lifeMax = null;


        if (healthBar) {

            const nameElement =
                healthBar.querySelector('.left');


            if (nameElement) {

                name =
                    nameElement.textContent.trim();
            }


            const lifeElement =
                healthBar.querySelector('.right');


            if (lifeElement) {

                const lifeData =
                    parseResource(
                        lifeElement.textContent
                    );


                life =
                    lifeData.current;

                lifeMax =
                    lifeData.max;
            }
        }


        const manaBar =
            unit.querySelector(
                '.progressBar.bgmana'
            );


        let level = null;

        let mana = null;

        let manaMax = null;


        if (manaBar) {

            const levelElement =
                manaBar.querySelector('.left');


            if (levelElement) {

                const levelMatch =
                    levelElement.textContent.match(
                        /Lv\.\s*(\d+)/
                    );


                if (levelMatch) {

                    level =
                        Number(levelMatch[1]);
                }
            }


            const manaElement =
                manaBar.querySelector('.right');


            if (manaElement) {

                const manaData =
                    parseResource(
                        manaElement.textContent
                    );


                mana =
                    manaData.current;

                manaMax =
                    manaData.max;
            }
        }


        return {

            name: name,

            level: level,

            life: life,

            life_max: lifeMax,

            mana: mana,

            mana_max: manaMax
        };
    }


    // ============================================================
    // CHARACTER WINDOW
    // ============================================================

    function getCharacterData() {

        const windows =
            document.querySelectorAll(
                '.window.panel-black'
            );


        let characterWindow = null;


        for (
            let i = 0;
            i < windows.length;
            i++
        ) {

            const text =
                windows[i].textContent;


            if (
                text &&
                text.includes('Character') &&
                text.includes('Strength') &&
                text.includes('Dexterity')
            ) {

                characterWindow =
                    windows[i];

                break;
            }
        }


        if (!characterWindow) {

            return null;
        }


        // --------------------------------------------------------
        // Find value belonging to a label
        // --------------------------------------------------------

        function getValue(label) {

            const spans =
                characterWindow.querySelectorAll(
                    'span'
                );


            for (
                let i = 0;
                i < spans.length;
                i++
            ) {

                const span =
                    spans[i];


                if (
                    span.children.length === 0 &&
                    span.textContent.trim() === label
                ) {

                    const next =
                        span.nextElementSibling;


                    if (next) {

                        return next.textContent
                            .trim();
                    }
                }
            }


            return null;
        }


        // --------------------------------------------------------
        // BASIC
        // --------------------------------------------------------

        const name =
            getValue('Name');


        const level =
            getValue('Level');


        const characterClass =
            getValue('Class');


        const faction =
            getValue('Faction');


        const prestigeText =
            getValue('Prestige');


        const rating =
            getValue('Rating');


        const medals =
            getValue('Medals');


        // --------------------------------------------------------
        // PRESTIGE
        // --------------------------------------------------------

        let prestige = null;

        let prestigeMax = null;

        let prestigeRank = null;

        let prestigeRankMax = null;


        if (prestigeText) {

            const match =
                prestigeText.match(
                    /([\d,]+)\s*\/\s*([\d,]+)\s*\(Rank\s*(\d+)\s*\/\s*(\d+)\)/
                );


            if (match) {

                prestige =
                    parseNumber(match[1]);

                prestigeMax =
                    parseNumber(match[2]);

                prestigeRank =
                    Number(match[3]);

                prestigeRankMax =
                    Number(match[4]);
            }
        }


        // --------------------------------------------------------
        // ATTRIBUTES
        // --------------------------------------------------------

        const strength =
            getValue('Strength');

        const stamina =
            getValue('Stamina');

        const dexterity =
            getValue('Dexterity');

        const intelligence =
            getValue('Intelligence');

        const wisdom =
            getValue('Wisdom');

        const luck =
            getValue('Luck');

        const statPoints =
            getValue('Stat Points');


        // --------------------------------------------------------
        // COMBAT
        // --------------------------------------------------------

        const hp =
            getValue('HP');

        const hpRegen =
            getValue('HP Reg./5s');

        const mp =
            getValue('MP');

        const mpRegen =
            getValue('MP Reg./5s');

        const defense =
            getValue('Defense');

        const block =
            getValue('Block');

        const minDamage =
            getValue('Min Dmg.');

        const maxDamage =
            getValue('Max Dmg.');

        const attackSpeed =
            getValue('Attack Spd.');

        const critical =
            getValue('Critical');

        const haste =
            getValue('Haste');

        const moveSpeed =
            getValue('Move Spd.');

        const bagSlots =
            getValue('Bag Slots');

        const itemFind =
            getValue('Item Find');

        const gearScore =
            getValue('Gear Score');

        const pvpLevel =
            getValue('PvP Level');


        // --------------------------------------------------------
        // EQUIPMENT
        // --------------------------------------------------------

        const equipment = [];


        const equipmentContainer =
            characterWindow.querySelector(
                '#equipslots'
            );


        if (equipmentContainer) {

            const slots =
                equipmentContainer.querySelectorAll(
                    '.slot'
                );


            for (
                let i = 0;
                i < slots.length;
                i++
            ) {

                const image =
                    slots[i].querySelector(
                        'img.icon'
                    );


                if (image) {

                    const src =
                        image.getAttribute(
                            'src'
                        );


                    if (src) {

                        equipment.push(src);
                    }
                }
            }
        }


        // --------------------------------------------------------
        // RETURN
        // --------------------------------------------------------

        return {

            name:
                name || '',

            level:
                parseNumber(level),

            class:
                characterClass || '',

            faction:
                faction || '',

            prestige:
                prestige,

            prestige_max:
                prestigeMax,

            prestige_rank:
                prestigeRank,

            prestige_rank_max:
                prestigeRankMax,

            rating:
                parseNumber(rating),

            medals:
                parseNumber(medals),


            strength:
                parseNumber(strength),

            stamina:
                parseNumber(stamina),

            dexterity:
                parseNumber(dexterity),

            intelligence:
                parseNumber(intelligence),

            wisdom:
                parseNumber(wisdom),

            luck:
                parseNumber(luck),

            stat_points:
                parseNumber(statPoints),


            hp:
                parseNumber(hp),

            hp_regen:
                parseNumber(hpRegen),

            mp:
                parseNumber(mp),

            mp_regen:
                parseNumber(mpRegen),

            defense:
                parseNumber(defense),

            block:
                block,

            min_damage:
                parseNumber(minDamage),

            max_damage:
                parseNumber(maxDamage),

            attack_speed:
                parseNumber(attackSpeed),

            critical:
                critical,

            haste:
                haste,

            move_speed:
                parseNumber(moveSpeed),

            bag_slots:
                parseNumber(bagSlots),

            item_find:
                itemFind,

            gear_score:
                parseNumber(gearScore),

            pvp_level:
                parseNumber(pvpLevel),

            equipment:
                equipment
        };
    }


    // ============================================================
    // INVENTORY
    // ============================================================

    function getInventoryData() {

        /*
         * Find the Inventory window.
         *
         * We deliberately don't use the generated Svelte
         * class names because they can change.
         */

        const windows =
            document.querySelectorAll(
                '.window.panel-black'
            );


        let inventoryWindow = null;


        for (
            let i = 0;
            i < windows.length;
            i++
        ) {

            const text =
                windows[i].textContent;


            if (
                text &&
                text.includes('Inventory') &&
                windows[i].querySelector(
                    '[id^="bag"]'
                )
            ) {

                inventoryWindow =
                    windows[i];

                break;
            }
        }


        if (!inventoryWindow) {

            return null;
        }


        // ========================================================
        // BAG
        // ========================================================

        const items = [];


        const bagSlots =
            inventoryWindow.querySelectorAll(
                '[id^="bag"]'
            );


        for (
            let i = 0;
            i < bagSlots.length;
            i++
        ) {

            const slot =
                bagSlots[i];


            const id =
                slot.id;


            /*
             * Get the item image.
             *
             * Empty slots use:
             *
             * /data/ui/slotbg/bg.avif
             *
             * Therefore we ignore those.
             */

            const image =
                slot.querySelector(
                    'img.icon'
                );


            if (!image) {
                continue;
            }


            const src =
                image.getAttribute('src');


            if (!src) {
                continue;
            }


            if (
                src.includes(
                    '/data/ui/slotbg/'
                )
            ) {
                continue;
            }


            // ----------------------------------------------------
            // SLOT NUMBER
            // ----------------------------------------------------

            const slotMatch =
                id.match(/^bag(\d+)$/);


            if (!slotMatch) {
                continue;
            }


            const slotNumber =
                Number(slotMatch[1]);


            // ----------------------------------------------------
            // STACK AMOUNT
            // ----------------------------------------------------

            const stackElement =
                slot.querySelector(
                    '.slottext.stacks'
                );


            let amount = 1;


            if (stackElement) {

                const stackText =
                    stackElement.textContent.trim();


                /*
                 * Keep +1 exactly as displayed for equipment
                 * enhancement-style values.
                 *
                 * Normal stacks such as "38" become 38.
                 */

                const parsed =
                    parseNumber(stackText);


                if (parsed !== null) {

                    amount = parsed;

                } else {

                    amount = stackText;
                }
            }


            items.push({

                slot:
                    slotNumber,

                id:
                    src,

                amount:
                    amount
            });
        }


        // ========================================================
        // GOLD / SILVER / COPPER / GEMS
        // ========================================================

        let gold = null;

        let silver = null;

        let copper = null;

        let gems = null;


        /*
         * The currency panel has classes:
         *
         * .gold
         *
         * and contains the colored text spans.
         */

        const currencyPanel =
            inventoryWindow.querySelector(
                '.panel-black.gold'
            );


        if (currencyPanel) {

            const text =
                currencyPanel.textContent
                    .replace(/\s+/g, ' ')
                    .trim();


            /*
             * Example:
             *
             * 17 64 68
             */

            const numbers =
                text.match(
                    /\d[\d,]*/g
                );


            if (numbers && numbers.length >= 3) {

                gold =
                    parseNumber(numbers[0]);

                silver =
                    parseNumber(numbers[1]);

                copper =
                    parseNumber(numbers[2]);
            }
        }


        /*
         * Gems are in a second .gold panel.
         *
         * It contains:
         *
         * gem icon + 130
         */

        const goldPanels =
            inventoryWindow.querySelectorAll(
                '.panel-black.gold'
            );


        for (
            let i = 0;
            i < goldPanels.length;
            i++
        ) {

            const panel =
                goldPanels[i];


            if (
                panel.querySelector(
                    'img[src*="/icons/gem"]'
                )
            ) {

                const gemText =
                    panel.textContent.trim();


                const gemNumber =
                    gemText.match(
                        /\d[\d,]*/
                    );


                if (gemNumber) {

                    gems =
                        parseNumber(
                            gemNumber[0]
                        );
                }
            }
        }


        // ========================================================
        // RETURN
        // ========================================================

        return {

            items:
                items,

            gold:
                gold,

            silver:
                silver,

            copper:
                copper,

            gems:
                gems
        };
    }


    // ============================================================
    // ALL DATA
    // ============================================================

    function extractData() {

        return {

            position:
                getPosition(),

            player:
                getUnitData('ufplayer'),

            target:
                getUnitData('uftarget'),

            character:
                getCharacterData(),

            inventory:
                getInventoryData()
        };
    }


    // ============================================================
    // KEY:VALUE MESSAGE
    // ============================================================

    function createMessage(data) {

        const lines = [];


        // ========================================================
        // POSITION
        // ========================================================

        if (data.position) {

            lines.push(
                'position_x:' +
                data.position.x
            );

            lines.push(
                'position_y:' +
                data.position.y
            );

            lines.push(
                'position_z:' +
                data.position.z
            );
        }


        // ========================================================
        // PLAYER
        // ========================================================

        if (data.player) {

            lines.push(
                'player_name:' +
                data.player.name
            );

            lines.push(
                'player_level:' +
                data.player.level
            );

            lines.push(
                'player_life:' +
                data.player.life
            );

            lines.push(
                'player_life_max:' +
                data.player.life_max
            );

            lines.push(
                'player_mana:' +
                data.player.mana
            );

            lines.push(
                'player_mana_max:' +
                data.player.mana_max
            );
        }


        // ========================================================
        // TARGET
        // ========================================================

        if (data.target) {

            lines.push(
                'target_name:' +
                data.target.name
            );

            lines.push(
                'target_level:' +
                data.target.level
            );

            lines.push(
                'target_life:' +
                data.target.life
            );

            lines.push(
                'target_life_max:' +
                data.target.life_max
            );

            lines.push(
                'target_mana:' +
                data.target.mana
            );

            lines.push(
                'target_mana_max:' +
                data.target.mana_max
            );
        }


        // ========================================================
        // CHARACTER
        // ========================================================

        if (data.character) {

            const c =
                data.character;


            lines.push(
                'character_name:' +
                c.name
            );

            lines.push(
                'character_level:' +
                c.level
            );

            lines.push(
                'character_class:' +
                c.class
            );

            lines.push(
                'character_faction:' +
                c.faction
            );


            lines.push(
                'character_prestige:' +
                c.prestige
            );

            lines.push(
                'character_prestige_max:' +
                c.prestige_max
            );

            lines.push(
                'character_prestige_rank:' +
                c.prestige_rank
            );

            lines.push(
                'character_prestige_rank_max:' +
                c.prestige_rank_max
            );


            lines.push(
                'character_rating:' +
                c.rating
            );

            lines.push(
                'character_medals:' +
                c.medals
            );


            lines.push(
                'character_strength:' +
                c.strength
            );

            lines.push(
                'character_stamina:' +
                c.stamina
            );

            lines.push(
                'character_dexterity:' +
                c.dexterity
            );

            lines.push(
                'character_intelligence:' +
                c.intelligence
            );

            lines.push(
                'character_wisdom:' +
                c.wisdom
            );

            lines.push(
                'character_luck:' +
                c.luck
            );

            lines.push(
                'character_stat_points:' +
                c.stat_points
            );


            lines.push(
                'character_hp:' +
                c.hp
            );

            lines.push(
                'character_hp_regen:' +
                c.hp_regen
            );

            lines.push(
                'character_mp:' +
                c.mp
            );

            lines.push(
                'character_mp_regen:' +
                c.mp_regen
            );

            lines.push(
                'character_defense:' +
                c.defense
            );

            lines.push(
                'character_block:' +
                c.block
            );

            lines.push(
                'character_min_damage:' +
                c.min_damage
            );

            lines.push(
                'character_max_damage:' +
                c.max_damage
            );

            lines.push(
                'character_attack_speed:' +
                c.attack_speed
            );

            lines.push(
                'character_critical:' +
                c.critical
            );

            lines.push(
                'character_haste:' +
                c.haste
            );

            lines.push(
                'character_move_speed:' +
                c.move_speed
            );

            lines.push(
                'character_bag_slots:' +
                c.bag_slots
            );

            lines.push(
                'character_item_find:' +
                c.item_find
            );

            lines.push(
                'character_gear_score:' +
                c.gear_score
            );

            lines.push(
                'character_pvp_level:' +
                c.pvp_level
            );


            // ----------------------------------------------------
            // EQUIPMENT
            // ----------------------------------------------------

            for (
                let i = 0;
                i < c.equipment.length;
                i++
            ) {

                lines.push(
                    'equipment_' +
                    (i + 1) +
                    ':' +
                    c.equipment[i]
                );
            }
        }


        // ========================================================
        // INVENTORY
        // ========================================================

        if (data.inventory) {

            const inv =
                data.inventory;


            // ----------------------------------------------------
            // CURRENCIES
            // ----------------------------------------------------

            lines.push(
                'gold:' +
                inv.gold
            );

            lines.push(
                'silver:' +
                inv.silver
            );

            lines.push(
                'copper:' +
                inv.copper
            );

            lines.push(
                'gems:' +
                inv.gems
            );


            // ----------------------------------------------------
            // BAG ITEMS
            // ----------------------------------------------------

            for (
                let i = 0;
                i < inv.items.length;
                i++
            ) {

                const item =
                    inv.items[i];


                lines.push(
                    'bag_' +
                    item.slot +
                    '_id:' +
                    item.id
                );


                lines.push(
                    'bag_' +
                    item.slot +
                    '_amount:' +
                    item.amount
                );
            }
        }


        // ========================================================
        // END MESSAGE
        // ========================================================

        return lines.join('\n') + '\n';
    }


    // ============================================================
    // EXTRACT + SEND
    // ============================================================

    function extractAndSendData() {

        if (
            !socket ||
            socket.readyState !==
            WebSocket.OPEN
        ) {
            return;
        }


        const data =
            extractData();


        const message =
            createMessage(data);


        /*
         * Only transmit if something changed.
         */

        if (
            message ===
            previousData
        ) {
            return;
        }


        previousData =
            message;


        socket.send(message);


        debugLog(
            'Data sent:\n' +
            message
        );
    }


    // ============================================================
    // START
    // ============================================================

    console.log(
        '[Hordes.io WS] Script started'
    );


    console.log(
        '[Hordes.io WS] Server: ' +
        socketUrl
    );


    reconnectIfOffline();


    setInterval(
        reconnectIfOffline,
        reconnectInterval
    );


    setInterval(
        extractAndSendData,
        dataCheckInterval
    );

})();
