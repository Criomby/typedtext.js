/*
Typedtext.js

JS module for typewriter animations.

Copyright (C) Philippe Braum (www.pbr.plus)

Available under the MIT license
*/

const typedtextjsVersionId = "0.1.31:122022";

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
     * @property {boolean} autoRun: starts animation at object creation
     */
    autoRun: false,

    /**
     * @property {boolean} varSpeed: varies typing speed between chars by +-60ms so typing looks more natural instead of linear speed
     */
    varSpeed: false,

    /**
     * @property {number} varSpeedP: 0% - 100% by how much typing speed varies (how much "delay" varies)
     */
    varSpeedP: 50,

    /**
     * @property {boolean} underline typed text
     */
    underline: false,
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
    readonly elmSent: HTMLSpanElement;
    readonly elmCurs: HTMLSpanElement;
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
    readonly varSpeedP: number;
    readonly underline: boolean;

    private running: boolean = false; // save object state

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
        this.varSpeedP = config.varSpeedP;
        // always underline text
        this.underline = config.underline;

        // set blink animation style
        this.blink = `blink ${config.blinkSpeed}s linear infinite alternate`;

        // add css & content (e.g. cursor) to elements
        // TODO autostyle on/off feature
        this._setupElements(config);

        // autoRun
        if (config.autoRun) {
            this.run();
        }
    }

    static getVersion() {
        return typedtextjsVersionId;
    }

    protected async run() {
        // run in endless loop until obj state is manually changed
        this.running = true;

        let i = 0;
        while (this.running) {
            await this.type(this.content[i]);
            await waitForMs(this.delayAfter);
            await this.delete();
            await waitForMs(this.delayAfter);
            i++;
            if (i >= this.content.length) {
                i = 0;
            }
        }
    }

    protected async type(content: typeof contentObj) {
        const text = content.text;
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
                // convert number to percentage
                let variance = this.varSpeedP / 100;
                let randGen = getRandInt(this.delay * (1 - (variance / 2) ), this.delay * (1 + variance));
                // lowest time between keystrokes: 10ms
                await waitForMs((randGen < 10) ? 10 : randGen);
            }
            else {
                await waitForMs(this.delay);
            }
            // append letter for letter
            this.elmSent.append(text[i]);
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

    protected stop() {
        // stop animation
        this.running = false;
    }

    private _printConfig(config: typeof defaultOptions) {
        console.log(`- Typedtext.js ${typedtextjsVersionId} -\n\nconfig:`, config);
    }

    protected _setupElements(config: typeof defaultOptions): void {
        if (!this.elmSent || !this.elmCurs) {
            throw `Typedtext.js: target element(s) not found;
                sentence: ${this.elmSent},
                cursor: ${this.elmCurs}`;
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

// get a random number between min & max, both inclusive
function getRandInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// define css blink animation globally on site when script is run
let cssStyle = document.createElement('style');
cssStyle.innerHTML = "@keyframes blink {0% {opacity: 1;} 40% {opacity: 1;} 60% {opacity: 0;} 100% {opacity: 0;}}";
document.head.appendChild(cssStyle);