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
const typedtextjsVersionId = "0.1.33:122022";
const defaultOptions = {
    elementSentenceId: "sentence",
    elementCursorId: "cursor",
    cursor: "|",
    cursorColor: "black",
    textColor: "black",
    permaBlink: false,
    staticCursor: false,
    blinkSpeed: 0.6,
    content: [
        {
            text: "This is Typedtext.js!",
            color: "black",
            cursor: "|",
            cursorColor: "blue",
            timeout: 2000
        },
    ],
    delay: 100,
    delayAfter: 1500,
    deleteSpeed: 100,
    printConfig: false,
    varSpeed: false,
    varSpeedP: 50,
    underline: false,
};
const contentObj = {
    text: "default",
    color: "black",
    cursor: "|",
    cursorColor: "blue",
    timeout: 2000
};
class Typedtext {
    constructor(options = {}) {
        this.running = false;
        const config = Object.assign(Object.assign({}, defaultOptions), options);
        if (config.printConfig === true) {
            this._printConfig(config);
        }
        if (config.permaBlink && config.staticCursor) {
            throw "Typedtext.js: Cannot set both {permaBlink: true, staticCursor: true}. Select one.";
        }
        this.elmSent = document.getElementById(config.elementSentenceId);
        this.elmCurs = document.getElementById(config.elementCursorId);
        this.cursor = config.cursor;
        this.cursorColor = config.cursorColor;
        this.textColor = config.textColor;
        this.permaBlink = config.permaBlink;
        this.staticCursor = config.staticCursor;
        this.content = config.content;
        this.delay = config.delay;
        this.delayAfter = config.delayAfter;
        this.deleteSpeed = config.deleteSpeed;
        this.varSpeed = config.varSpeed;
        this.varSpeedP = config.varSpeedP;
        this.underline = config.underline;
        this.blink = `blink ${config.blinkSpeed}s linear infinite alternate`;
        this._setupElements(config);
    }
    static getVersion() {
        return typedtextjsVersionId;
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.running = true;
            let i = 0;
            while (this.running) {
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
    stop() {
        this.running = false;
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
                this._stopBlink();
            }
            for (let i = 0; i < text.length; i++) {
                if (this.varSpeed) {
                    let variance = this.varSpeedP / 100;
                    let randGen = getRandInt(this.delay * (1 - (variance / 2)), this.delay * (1 + variance));
                    yield waitForMs((randGen < 10) ? 10 : randGen);
                }
                else {
                    yield waitForMs(this.delay);
                }
                this.elmSent.append(text[i]);
            }
            if (!this.staticCursor) {
                this._startBlink();
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
                this._stopBlink();
            }
            while (letters.length > 0) {
                yield waitForMs(this.deleteSpeed);
                letters.pop();
                this.elmSent.innerHTML = letters.join("");
            }
            if (!this.staticCursor) {
                this._startBlink();
            }
            this._resetStyles();
        });
    }
    _printConfig(config) {
        console.log(`- Typedtext.js ${typedtextjsVersionId} -\n\nconfig:`, config);
    }
    _setupElements(config) {
        if (!this.elmSent || !this.elmCurs) {
            throw `Typedtext.js: target element(s) not found;
                sentence: ${this.elmSent},
                cursor: ${this.elmCurs}`;
        }
        this.elmSent.style.display = "inline-block";
        this.elmSent.style.color = config.textColor;
        if (this.underline) {
            this.elmSent.style.textDecoration = "underline";
        }
        this.elmCurs.style.display = "inline-block";
        this.elmCurs.style.color = config.cursorColor;
        this.elmCurs.style.animation = this.blink;
        this.elmCurs.innerHTML = this.cursor;
    }
    _startBlink() {
        this.elmCurs.style.animation = this.blink;
    }
    _stopBlink() {
        this.elmCurs.style.animation = "";
    }
    _resetStyles() {
        this.elmSent.style.color = this.textColor;
        this.elmCurs.innerHTML = this.cursor;
        this.elmCurs.style.color = this.cursorColor;
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
let cssStyle = document.createElement('style');
cssStyle.innerHTML = "@keyframes blink {0% {opacity: 1;} 40% {opacity: 1;} 60% {opacity: 0;} 100% {opacity: 0;}}";
document.head.appendChild(cssStyle);
//# sourceMappingURL=typedtext.js.map