/*
Typedtext.js

JS module for typewriter animations

Copyright (C) Philippe Braum (www.pbr.plus)

Available under the Apache 2.0 license
*/

const version = "0.1.1:122022";

const defaultOptions = {
    /**
     * @property {string} ID of element where content will be typed
     */
    elementSentenceId: "sentence",

    /**
     * @property {string} ID of element where cursor will be shown
     */
    elementCursorId: "cursor",

    /**
     * @property {string} (character) used as cursor
     */
    cursor: "|",

    /**
     * @property {string} default cursor color
     */
    cursorColor: "black",

    /**
     * @property {string} set global text color for content
     */
    textColor: "black",

    /**
     * @property {boolean} true: cursor blinks even when typing
     */
    permaBlink: false,

    /**
     * @property {number} time interval cursor blinking in seconds
     */
    blinkSpeed: 0.6,

    /**
     * @property {array} array containing dict(s) with content to be typed in sequence and the respective options
     */
    content: [
        {
            text: "This is the default text!", // required
            color: "black", // optional: font color
            cursor: ";", // optional: cursor for individual word
            cursorColor: "black", // optional: cursor color for word
            timeout: 2000 // optional: timeout after word has been typed
        }
    ],

    /**
     * @property {number} delay in ms between chars typed
     */
    delay: 100,

    /**
     * @property {number} delay in ms after a content object has been typed / deleted and before it is deleted / the next is typed
     */
    delayAfter: 1500,

    /**
     * @property {boolean} prints config to console
     */
    printConfig: false,

    /**
     * @property {boolean} starts animation at object creation
     */
    autoRun: false,

    /**
     * @property {boolean} varies typing speed between chars by +-60ms so typing looks more natural instead of linear speed
     */
    varSpeed: false,

    /**
     * @property {boolean} underline typed text
     */
    underline: false,
};

// content object prototype
const contentObj = {
    text: "default", // required
    // ...optionalArgs
    color: "black",
    cursor: "|",
    corsorColor: "black",
    timeout: 1000,
    // ...
};

class Typedtext {
    public config: any;

    readonly elmSent: HTMLSpanElement;
    readonly elmCurs: HTMLSpanElement;
    readonly cursor: string;
    readonly permaBlink: boolean;
    readonly blink: string;
    readonly content: any[];
    readonly delay: number;
    readonly delayAfter: number;
    readonly varSpeed: boolean;

    constructor(
            options = {} // optional configurations passed in as dictionary
        ) {
        this.config = {...defaultOptions, ...options};

        if (this.config.printConfig === true) {
            this.printConfig();
        }

        // sentence element
        this.elmSent = <HTMLSpanElement>document.getElementById(this.config.elementSentenceId);
        // cursor element
        this.elmCurs = <HTMLSpanElement>document.getElementById(this.config.elementCursorId);
        // cursor symbol
        this.cursor = this.config.cursor;
        this.permaBlink = this.config.permaBlink;
        this.blink = `blink ${this.config.blinkSpeed}s linear infinite alternate`;
        // add css to elements
        this.styleElements();
        // set global cursor
        this.elmCurs.innerHTML = this.cursor;
        // word(s)/sentence(s) to type optionally incl. indiv. config
        this.content = this.config.content;
        // delay between chars in ms
        this.delay = this.config.delay;
        // delay before deletion animation starts
        this.delayAfter = this.config.delayAfter;
        // varying typing speed
        this.varSpeed = this.config.varSpeed;

        // autoRun
        if (this.config.autoRun) {
            this.run();
        }
    }

    protected styleElements(): void {
        if (!this.elmSent || !this.elmCurs) {
            throw `Typerscript element(s) not found:
                sentence: ${this.elmSent},
                cursor: ${this.elmCurs}`;
        }

        // sentence element
        this.elmSent.style.display = "inline-block";
        //this.elmSent.style.justifyContent = "center";
        //this.elmSent.style.alignItems = "center";
        //this.elmSent.style.height = "2rem"
        this.elmSent.style.color = this.config.textColor;
        if (this.config.underline) {
            this.elmSent.style.textDecoration = "underline";
        }

        // cursor element
        this.elmCurs.style.display = "inline-block";
        //this.elmCurs.style.justifyContent = "center";
        //this.elmCurs.style.alignItems = "center";
        //this.elmCurs.style.width = "2px";
        //this.elmCurs.style.height = "2rem"
        this.elmCurs.style.color = this.config.textColor;
        this.elmCurs.style.backgroundColor = "white";
        //this.elmCurs.style.marginLeft = "8px";
        this.elmCurs.style.animation = this.blink;
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
            this.elmCurs.style.color = <string>content.cursorColor;
        }

        if (!this.permaBlink) {
            this.stopBlink();
        }
        for (let i = 0; i < text.length; i++) {
            // delay
            if (this.varSpeed) {
                // var typing speed randomly by up to +-100ms
                let variance = 100;
                await waitForMs(getRandInt(this.delay-variance, this.delay+variance));
            }
            else {
                await waitForMs(this.delay);
            }
            // append letter for letter
            this.elmSent.append(text[i]);
        }
        if (!this.permaBlink) {
            this.startBlink();
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
            this.stopBlink();
        }
        while (letters.length > 0) {
            // delay
            await waitForMs(this.delay);
            // remove last letter
            letters.pop();
            // update element
            this.elmSent.innerHTML = letters.join("");
        }
        if (!this.permaBlink) {
            this.startBlink();
        }
        // reset content styles to object instance config
        this.resetStyles();
    }

    protected async run() {
        // run in endless loop
        let i = 0;
        while (true) {
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

    private printConfig() {
        console.log(`- Typedtext.js ${version} -\n\nconfig:`, this.config);
    }

    protected startBlink(): void {
        // css "blink" (has to be) defined in stylesheet
        this.elmCurs.style.animation = this.blink;
    }

    protected stopBlink(): void {
        this.elmCurs.style.animation = "";
    }

    protected resetStyles() {
        // reset text color
        this.elmSent.style.color = this.config.textColor;
        // reset cursor
        this.elmCurs.innerHTML = this.cursor;
        // reset cursor color
        this.elmCurs.style.color = this.config.cursorColor;
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