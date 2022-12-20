![Typedtextjs_logo](https://user-images.githubusercontent.com/86114549/208562376-057fad3c-73de-4c4d-b4e2-059d44401ec8.png)

# A JS library for typing animations.

### :heavy_check_mark: Simple interface

Getting started is as easy as:
```javascript
new Typedtext({
    content: [
        {
            text: "This is Typedtext.js!"
        }
    ],
    autoRun: true
});
```

### :heavy_check_mark: Highly customizable

Config options:
```javascript
{
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
     * @property {boolean} true: cursor does not blink at any time
     */
    staticCursor: false,

    /**
     * @property {number} time interval cursor blinking in seconds
     */
    blinkSpeed: 0.6,

    /**
     * @property {array} array containing typeof contentObj (sse below) with content to be typed and the respective options
     */
    content: [
        {
            text: "This is Typedtext.js!", // required
            color: "black", // optional: font color
            cursor: "|", // optional: cursor for individual word
            cursorColor: "blue", // optional: cursor color for word
            timeout: 2000 // optional: (additional to delayAfter) timeout after word has been typed
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
     * @property {number} delete speed of single chars in ms
     */
    deleteSpeed: 100,

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
}
```

### :heavy_check_mark: Lightweight (4kb minified)

### :heavy_check_mark: Dependency-free
