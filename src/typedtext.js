"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const version = "0.1.1:122022";
const defaultOptions = {
    elementSentenceId: "sentence",
    elementCursorId: "cursor",
    cursor: "|",
    cursorColor: "black",
    textColor: "black",
    permaBlink: false,
    blinkSpeed: 0.6,
    content: [
        {
            text: "This is the default text!",
            color: "black",
            cursor: ";",
            cursorColor: "black",
            timeout: 2000
        }
    ],
    delay: 100,
    delayAfter: 1500,
    printConfig: false,
    autoRun: false,
    varSpeed: false,
    underline: false,
};
const contentObj = {
    text: "default",
    color: "black",
    cursor: "|",
    corsorColor: "black",
    timeout: 1000,
};
class Typedtext {
    constructor(options = {}) {
        this.config = Object.assign(Object.assign({}, defaultOptions), options);
        if (this.config.printConfig === true) {
            this.printConfig();
        }
        this.elmSent = document.getElementById(this.config.elementSentenceId);
        this.elmCurs = document.getElementById(this.config.elementCursorId);
        this.cursor = this.config.cursor;
        this.permaBlink = this.config.permaBlink;
        this.blink = `blink ${this.config.blinkSpeed}s linear infinite alternate`;
        this.styleElements();
        this.elmCurs.innerHTML = this.cursor;
        this.content = this.config.content;
        this.delay = this.config.delay;
        this.delayAfter = this.config.delayAfter;
        this.varSpeed = this.config.varSpeed;
        if (this.config.autoRun) {
            this.run();
        }
    }
    styleElements() {
        if (!this.elmSent || !this.elmCurs) {
            throw `Typerscript element(s) not found:
                sentence: ${this.elmSent},
                cursor: ${this.elmCurs}`;
        }
        this.elmSent.style.display = "inline-block";
        this.elmSent.style.color = this.config.textColor;
        if (this.config.underline) {
            this.elmSent.style.textDecoration = "underline";
        }
        this.elmCurs.style.display = "inline-block";
        this.elmCurs.style.color = this.config.textColor;
        this.elmCurs.style.backgroundColor = "white";
        this.elmCurs.style.animation = this.blink;
    }
    type(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = content.text;
            if ("color" in content) {
                this.elmSent.style.color = content.color;
            }
            if ("cursor" in content) {
                this.elmCurs.innerHTML = content.cursor;
            }
            if ("cursorColor" in content) {
                this.elmCurs.style.color = content.cursorColor;
            }
            if (!this.permaBlink) {
                this.stopBlink();
            }
            for (let i = 0; i < text.length; i++) {
                if (this.varSpeed) {
                    let variance = 100;
                    yield waitForMs(getRandInt(this.delay - variance, this.delay + variance));
                }
                else {
                    yield waitForMs(this.delay);
                }
                this.elmSent.append(text[i]);
            }
            if (!this.permaBlink) {
                this.startBlink();
            }
            if ("timeout" in content) {
                yield waitForMs(content.timeout);
            }
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const sentence = this.elmSent.innerHTML;
            const letters = sentence.split("");
            if (!this.permaBlink) {
                this.stopBlink();
            }
            while (letters.length > 0) {
                yield waitForMs(this.delay);
                letters.pop();
                this.elmSent.innerHTML = letters.join("");
            }
            if (!this.permaBlink) {
                this.startBlink();
            }
            this.resetStyles();
        });
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            let i = 0;
            while (true) {
                yield this.type(this.content[i]);
                yield waitForMs(this.delayAfter);
                yield this.delete();
                yield waitForMs(this.delayAfter);
                i++;
                if (i >= this.content.length) {
                    i = 0;
                }
            }
        });
    }
    printConfig() {
        console.log(`- Typedtext.js ${version} -\n\nconfig:`, this.config);
    }
    startBlink() {
        this.elmCurs.style.animation = this.blink;
    }
    stopBlink() {
        this.elmCurs.style.animation = "";
    }
    resetStyles() {
        this.elmSent.style.color = this.config.textColor;
        this.elmCurs.innerHTML = this.cursor;
        this.elmCurs.style.color = this.config.cursorColor;
    }
}
function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
