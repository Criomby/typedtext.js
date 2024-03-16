<div align="center">
    <img src="https://user-images.githubusercontent.com/86114549/209543520-834f6b64-246f-4768-b74d-280520c53dc9.gif" alt="typedtextjs_animation" width="700px">
    <h1>A JS module for typing animations.</h1>
</div>

### :heavy_check_mark: Simple interface

### :heavy_check_mark: Highly customizable

### :heavy_check_mark: Lightweight (6kb min)

### :heavy_check_mark: Dependency-free

<br>

## Live Demo

For a production demo see my website: <a href="https://pbr.plus"><b>www.pbr.plus</b></a>

<br>

## Getting started is as easy as:

```javascript
// in your *.js file
new Typedtext({
    content: [{text: "This is Typedtext.js!"}]
})
.run();
```

```html
<!-- in your *.html -->
<div>
  <span id="sentence"></span><span id="cursor"></span>
  <!-- element id's can optionally be changed in config -->
</div>
```

![TypedtextJS_basic_demo](https://user-images.githubusercontent.com/86114549/208748750-23fa6227-e90a-4fdb-b9f3-feb298fc4e92.gif)

<br>

### This is also Typedtext.js: 

![typedtextjs_handwriting_demo](https://user-images.githubusercontent.com/86114549/209695401-cd4d9702-38cc-4ed7-9826-0ffcf9140cf1.gif)

<br>
<br>

## Integration

### Download the latest Typedtext.js file from the Releases section here: https://github.com/Criomby/typedtext.js/releases

<br>
In your .html file:

```html
<script src="typedtext.js"></script>
```

<br>

# Documentation

## "How-to" Examples

### :white_small_square: basic setup

Basic custom configuration setup example
```javascript
new Typedtext({
    elementSentenceId: "your-sentence-element",
    elementCursorId: "your-cursor-element",
    content: [{text: "This runs infinitely at creation."}],
    textColor: "red"
})
.run();
```
<br>

### :white_small_square: manual start/stop

Start / stop the animation *loop* manually (e.g. using a button click event)
```javascript
var tt1 = new Typedtext({
    elementSentenceId: "your-sentence-element",
    elementCursorId: "your-cursor-element",
    content: [{text: "If you see this the animation runs."}],
    textColor: "green"
})
// currently shows blinking cursor only

// start animation loop
tt1.run();

// stop animation (completes current typing-delete cycle and stops after delete)
tt1.stop();

// blinkig cursor...
```
<br>

### :white_small_square: type, delete (one time)

Type / delete content just once
```javascript
// config
var tt2 = new Typedtext({
    elementSentenceId: "your-sentence-element-2",
    elementCursorId: "your-cursor-element-2",
    textColor: "green"
})

// type text
tt2.type({
    text: "I am going to sit here."
});
// shows text permanently now

// delete text
tt2.delete();

// blinkig cursor...

// repeat as necessary
tt2.type({
    text: "New text typed."
});

// ... 
// tt2.delete(); 
// you get the idea
```
<br>

### :white_small_square: Get object status

See if animation is running currently on an object
```javascript
var running = tt1.isRunning(); // returns boolean value
```
```running``` is either `**true** or **false** depending on whether .run() has been called yet (or has been stopped w/ .stop())<br>
<br><br>

### :white_small_square: configure all possible <a href="https://github.com/Criomby/typedtext.js/edit/main/README.md#config-options-docu">options</a>

Create your ultimate custom config
```javascript
// Ultimate Custom Config of Typedtext (ucctt)
var ucctt = new Typedtext({
    elementSentenceId: "sentElm",
    elementCursorId: "cursElm",
    cursor: "█",
    cursorColor: "black",
    textColor: "black",
    permaBlink: false,
    staticCursor: true,
    blinkSpeed: 0.5,
    content: [
        {
            text: "This is Typedtext.js!",
            color: "#ADA2FF",
            cursor: ";",
            cursorColor: "purple",
            timeout: 2000
        },
        {
            text: "Keep it running...",
            color: "black",
            cursor: "X",
            cursorColor: "#82AAE3",
            timeout: 2000
        },
        {
            text: "Another one...",
            color: "#DC0000",
            cursor: "I",
            cursorColor: "#850000",
            timeout: 2000
        }
    ],
    delay: 150,
    delayAfter: 2000,
    deleteSpeed: 50,
    printConfig: true,
    varSpeed: true,
    varSpeedPercentage: 0.6,
    typos: true,
    typosProb: 0.15,
    typosDelayMultiplier: 4,
    underline: false,
    selectable: false
});

// ucctt.run();
```
<br>

## Config Options Docu:

(The values seen here are the default values if not overwritten by user config)

```javascript
{
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
}
```

<br>

# Support

### If you use this project in production, please consider supporting the development.

<a href="https://www.buymeacoffee.com/philippebraum" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>
