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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Typedtext_running;
const typedtextjsVersionId = "0.1.34:122022";
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
    varSpeedPercentage: 0.5,
    typos: false,
    typosProb: 0.1,
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
        _Typedtext_running.set(this, false);
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
        this.varSpeedPercentage = config.varSpeedPercentage;
        this.typos = config.typos;
        this.typosProb = config.typosProb;
        this.underline = config.underline;
        this.blink = `blink ${config.blinkSpeed}s linear infinite alternate`;
        this._setupElements(config);
    }
    static getVersion() {
        return typedtextjsVersionId;
    }
    isRunning() {
        return __classPrivateFieldGet(this, _Typedtext_running, "f");
    }
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldSet(this, _Typedtext_running, true, "f");
            let i = 0;
            while (__classPrivateFieldGet(this, _Typedtext_running, "f")) {
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
        __classPrivateFieldSet(this, _Typedtext_running, false, "f");
    }
    type(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = content.text;
            if (text == "undefined" || text == "") {
                throw "text has to be defined and cannot be empty";
            }
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
                    yield waitForVarMs(this.delay, this.varSpeedPercentage);
                }
                else {
                    yield waitForMs(this.delay);
                }
                if (this.typos) {
                    if (Math.random() <= this.typosProb) {
                        this.elmSent.append(getRandChar());
                        if (this.varSpeed) {
                            yield waitForVarMs(this.delay, this.varSpeedPercentage);
                        }
                        else {
                            yield waitForMs(this.delay);
                        }
                        this.elmSent.innerHTML = this.elmSent.innerHTML.slice(0, -1);
                        if (this.varSpeed) {
                            yield waitForVarMs(this.delay, this.varSpeedPercentage);
                        }
                        else {
                            yield waitForMs(this.delay);
                        }
                        this.elmSent.append(text[i]);
                    }
                    else {
                        this.elmSent.append(text[i]);
                    }
                }
                else {
                    this.elmSent.append(text[i]);
                }
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
_Typedtext_running = new WeakMap();
function waitForMs(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function waitForVarMs(ms, variance) {
    let _var = variance / 100;
    let randNum = getRandInt(ms * (1 - (_var / 2)), ms * (1 + _var));
    let msWait = (randNum < 10) ? 10 : randNum;
    return new Promise(resolve => setTimeout(resolve, msWait));
}
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandChar() {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    if (Math.random() < 0.5) {
        return alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase();
    }
    else {
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    }
}
let cssStyle = document.createElement('style');
cssStyle.innerHTML = "@keyframes blink {0% {opacity: 1;} 40% {opacity: 1;} 60% {opacity: 0;} 100% {opacity: 0;}}";
document.head.appendChild(cssStyle);
//# sourceMappingURL=typedtext.js.map