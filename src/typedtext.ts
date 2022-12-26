// UMD
(function (global, factory) {
    //@ts-ignore
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    //@ts-ignore
    typeof define === 'function' && define.amd ? define('Typedtext', factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
        //@ts-ignore
        var current = global.Typedtext;
        //@ts-ignore
        var exports = global.Typedtext = factory();
        //@ts-ignore
        exports.noConflict = function () { global.Typedtext = current; return exports; };
    }()));
}(this, (function () {
    /*
    Typedtext.js

    JS module for typewriter animations.

    Copyright (C) Philippe Braum (www.pbr.plus)

    Available under the MIT license
    */

    const VERSION = "0.2.2:122022";

    const defaultOptions = {
        /**
         * @property {string} elementSentenceId: ID of element where the content will be typed
         */
        elementSentenceId: "sentence",

        /**
         * @property {string} elementCursorId: ID of element where the cursor will be shown
         */
        elementCursorId: "cursor",

        /**
         * @property {string} cursor: character used as cursor
         */
        cursor: "|",

        /**
         * @property {string} cursorColor: default cursor color
         */
        cursorColor: "black",

        /**
         * @property {string} textColor: set global text color for content
         */
        textColor: "black",

        /**
         * @property {boolean} permaBlink: true: cursor blinks, even when typing
         */
        permaBlink: false,

        /**
         * @property {boolean} staticCursor: true: cursor does not blink at any time
         */
        staticCursor: false,

        /**
         * @property {number} blinkSpeed: time interval cursor blinking in seconds
         */
        blinkSpeed: 0.6,

        /**
         * @property {array} content: array containing typeof contentObj (see below) with content to be typed and the respective options
         */
        content: [
            {
                text: "This is Typedtext.js!", // required
                color: "black", // optional: font color
                cursor: "|", // optional: cursor for individual word
                cursorColor: "blue", // optional: cursor color for word
                timeout: 2000 // optional: (additional to delayAfter) timeout after word has been typed
            },
            // add as many more as you like!
        ],

        /**
         * @property {number} delay in ms between chars typed
         */
        delay: 100,

        /**
         * @property {number} delayAfter: delay in ms after a content object has been typed / deleted and before it is deleted / the next is typed
         */
        delayAfter: 1500,

        /**
         * @property {number} deleteSpeed: delete speed of single chars in ms
         */
        deleteSpeed: 100,

        /**
         * @property {boolean} printConfig: prints config to console
         */
        printConfig: false,

        /**
         * @property {boolean} varSpeed: varies typing speed between chars by +-60ms so typing looks more natural instead of linear speed
         */
        varSpeed: false,

        /**
         * @property {number} varSpeedPercentage: 0% - 100% by how much typing speed varies (how much "delay" varies)
         */
        varSpeedPercentage: 0.5,

        /**
         * @property {boolean} typos: makes typos while typing as per the defined probability
         */
        typos: false,

        /**
         * @property {number} typosProb: Probability in percent for a typo per char
         */
        typosProb: 0.1,

        /**
         * @property {number} typosDelayMultiplier: How much larger the delay is after the typo has been made and until it gets corected
         */
        typosDelayMultiplier: 3.5,

        /**
         * @property {boolean} underline typed text
         */
        underline: false,

        /**
         * @property {boolean} selectable: target html elements are text selectable / highlightable
         */
        selectable: true
    };

    // content object prototype
    const contentObj = {
        text: "default", // required
        // ...optionalArgs
        color: "black", // optional: font color
        cursor: "|", // optional: cursor for individual word
        cursorColor: "blue", // optional: cursor color for word
        timeout: 2000 // optional: (additional to delayAfter) timeout after word has been typed
    };

    class Typedtext {
        public elmSent: HTMLSpanElement;
        public elmCurs: HTMLSpanElement;
        readonly cursor: string;
        readonly cursorColor: string;
        readonly textColor: string;
        readonly permaBlink: boolean;
        readonly staticCursor: boolean;
        readonly blink: string;
        readonly content: any[];
        readonly delay: number;
        readonly delayAfter: number;
        readonly deleteSpeed: number;
        readonly varSpeed: boolean;
        readonly varSpeedPercentage: number;
        readonly typos: boolean;
        readonly typosProb: number;
        readonly typosDelayMultiplier: number;
        readonly underline: boolean;
        readonly selectable: boolean;

        #running: boolean = false; // save object state
        //#stopped: boolean = false;

        constructor(
                options = {} // optional configurations passed in as dictionary
            ) {
            
            const config = {...defaultOptions, ...options};

            if (config.printConfig === true) {
                this._printConfig(config);
            }

            // check that only one option of permaBlink or staticCursor is set
            if (config.permaBlink && config.staticCursor) {
                throw "Typedtext.js: Cannot set both {permaBlink: true, staticCursor: true}. Select one.";
            }

            // sentence element
            this.elmSent = <HTMLSpanElement>document.getElementById(config.elementSentenceId);
            // cursor element
            this.elmCurs = <HTMLSpanElement>document.getElementById(config.elementCursorId);
            // cursor symbol
            this.cursor = config.cursor;
            this.cursorColor = config.cursorColor;
            this.textColor = config.textColor;
            this.permaBlink = config.permaBlink;
            this.staticCursor = config.staticCursor;
            // word(s)/sentence(s) to type optionally incl. indiv. config
            this.content = config.content;
            // delay between chars in ms
            this.delay = config.delay;
            // delay before deletion animation starts
            this.delayAfter = config.delayAfter;
            this.deleteSpeed = config.deleteSpeed;
            // varying typing speed
            this.varSpeed = config.varSpeed;
            // variance of typing speed if varSpeed == true
            this.varSpeedPercentage = config.varSpeedPercentage;
            // typos feature
            this.typos = config.typos;
            this.typosProb = config.typosProb;
            this.typosDelayMultiplier = config.typosDelayMultiplier;
            // always underline text
            this.underline = config.underline;
            // selectable text field
            this.selectable = config.selectable;

            // set blink animation style
            this.blink = `blink ${config.blinkSpeed}s linear infinite alternate`;

            // add css & content (e.g. cursor) to elements
            // TODO autostyle on/off feature
            this._setupElements(config);
        }

        static getVersion() {
            return VERSION;
        }

        protected isRunning() {
            // get status of object animation
            return this.#running;
        }

        protected async run() {
            // run in endless loop until obj state is manually changed
            this.#running = true;

            let i = 0;
            while (this.#running) {
                //this.#stopped = false;

                await this.type(this.content[i]);
                await waitForMs(this.delayAfter);
                await this.delete();
                await waitForMs(this.delayAfter);
                i++;
                if (i >= this.content.length) {
                    i = 0;
                }

                // check if stop() is pressed
                //this.#stopped = true;
            }
        }

        protected stop() {
            // stop animation
            this.#running = false;
        }

        protected async type(content: typeof contentObj) {
            const text = content.text;

            // check for undefined key "text" in content object
            if (text == "undefined" || text == "") {
                throw "text has to be defined and cannot be empty";
            }


            // check for optional content settings
            if ("color" in content) {
                // set text color
                this.elmSent.style.color = content.color;
            }
            if ("cursor" in content) {
                // set cursor for text
                this.elmCurs.innerHTML = content.cursor;
            }
            if ("cursorColor" in content) {
                this.elmCurs.style.color = content.cursorColor;
            }

            if (!this.permaBlink) {
                this._stopBlink();
            }

            for (let i = 0; i < text.length; i++) {
                // delay
                if (this.varSpeed) {
                    // var typing speed randomly between -varSpeedP/2% and +varSpeedP%
                    await waitForVarMs(this.delay, this.varSpeedPercentage);
                }
                else {
                    await waitForMs(this.delay);
                }

                if (this.typos) {
                    // check if typo will be made
                    if (Math.random() <= this.typosProb) {
                        // generate typo
                        this.elmSent.append(getRandChar());
                        // increased delay after typo
                        if (this.varSpeed) {
                            await waitForVarMs(this.delay * this.typosDelayMultiplier, this.varSpeedPercentage);
                        }
                        else {
                            await waitForMs(this.delay * this.typosDelayMultiplier);
                        }
                        // delete last inserted char
                        let currentText: string = this.elmSent.innerHTML;
                        let sliced: string = currentText.slice(0, -1);
                        this.elmSent.innerHTML = sliced;
                        // delay
                        if (this.varSpeed) {
                            await waitForVarMs(this.delay, this.varSpeedPercentage);
                        }
                        else {
                            await waitForMs(this.delay);
                        }
                        // insert right char
                        this.elmSent.append(text[i]);
                    }
                    else {
                        this.elmSent.append(text[i]);
                    }
                }
                else {
                    // append letter for letter
                    this.elmSent.append(text[i]);
                }
            }

            if (!this.staticCursor) {
                this._startBlink();
            }

            // check if add. timeout for content text has been set
            if ("timeout" in content) {
                await waitForMs(<number>content.timeout);
            }
        }

        protected async delete() {
            const sentence = this.elmSent.innerHTML;
            const letters = sentence.split("");

            if (!this.permaBlink) {
                this._stopBlink();
            }

            while (letters.length > 0) {
                // delay
                await waitForMs(this.deleteSpeed);
                // remove last letter
                letters.pop();
                // update element
                this.elmSent.innerHTML = letters.join("");
            }

            if (!this.staticCursor) {
                this._startBlink();
            }

            // reset content styles to object instance config
            this._resetStyles();
        }

        private _printConfig(config: typeof defaultOptions) {
            console.log(`- Typedtext.js ${VERSION} -\n\nconfig:`, config);
        }

        protected _setupElements(config: typeof defaultOptions): void {
            if (!this.elmSent || !this.elmCurs) {
                throw "Typedtext.js: target element(s) not found:\nsentence: ${this.elmSent}\ncursor: ${this.elmCurs}";
            }

            // sentence element
            this.elmSent.style.display = "inline-block";
            //this.elmSent.style.justifyContent = "center";
            //this.elmSent.style.alignItems = "center";
            //this.elmSent.style.height = "2rem"
            this.elmSent.style.color = config.textColor;
            if (this.underline) {
                this.elmSent.style.textDecoration = "underline";
            }

            // cursor element
            this.elmCurs.style.display = "inline-block";
            //this.elmCurs.style.justifyContent = "center";
            //this.elmCurs.style.alignItems = "center";
            //this.elmCurs.style.width = "2px";
            //this.elmCurs.style.height = "2rem"
            this.elmCurs.style.color = config.cursorColor;
            //this.elmCurs.style.backgroundColor = "white";
            //this.elmCurs.style.marginLeft = "8px";
            this.elmCurs.style.animation = this.blink;

            // set global cursor
            this.elmCurs.innerHTML = this.cursor;

            if (!this.selectable) {
                // make both elements unselectable
                this.elmSent.classList.add("unselectable");
                this.elmCurs.classList.add("unselectable");
            }
        }

        protected _startBlink(): void {
            // css "blink" (has to be) defined in stylesheet
            this.elmCurs.style.animation = this.blink;
        }

        protected _stopBlink(): void {
            this.elmCurs.style.animation = "";
        }

        protected _resetStyles() {
            // reset styles to global object config settings
            // reset text color
            this.elmSent.style.color = this.textColor;
            // reset cursor
            this.elmCurs.innerHTML = this.cursor;
            // reset cursor color
            this.elmCurs.style.color = this.cursorColor;
        }
    }

    // function which pauses script for x ms
    function waitForMs(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    // wait for ms around baseline wait time
    function waitForVarMs(ms: number, variance: number) {
        let _var = variance / 100; // convert percentage value from int (XXX) to float (X.XX)
        let randNum = getRandInt(ms * (1 - (_var / 2) ), ms * (1 + _var));
        // lowest time between keystrokes: 10ms
        let msWait = (randNum < 10) ? 10 : randNum;
        return new Promise(resolve => setTimeout(resolve, msWait));
    }

    // get a random number between min & max, both inclusive
    function getRandInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // returns a random char, uppercase or lowercase
    function getRandChar(): string {
        let alphabet = "abcdefghijklmnopqrstuvwxyz";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    // export typedtext object
    return Typedtext;

})));

// add global site css
let cssStyle = document.createElement('style');
// define css blink animation 
let blink = "@keyframes blink {0% {opacity: 1;} 40% {opacity: 1;} 60% {opacity: 0;} 100% {opacity: 0;}} ";
// define css class "unselectable"
let unselectable = ".unselectable {-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;} ";
cssStyle.innerHTML = blink + unselectable;
// add css to document head
document.head.appendChild(cssStyle);