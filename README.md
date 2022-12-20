<div align="center">
    <img src="https://user-images.githubusercontent.com/86114549/208748667-f39546eb-fcac-4121-a9b9-6de99688f498.gif" alt="typedtextjs_animation" width="700px">  
</div>

# A JS library for typing animations.

### :heavy_check_mark: Simple interface

### :heavy_check_mark: Highly customizable

### :heavy_check_mark: Lightweight (4kb min)

### :heavy_check_mark: Dependency-free

###  :heavy_check_mark: written in TS
<br>

#### Getting started is as easy as:
```javascript
// in your *.js file
new Typedtext({
    content: [{text: "This is Typedtext.js!"}],
    autoRun: true
});
```

```html
<!-- in your *.html -->
<div>
  <span id="sentence"></span><span id="cursor"></span>
  <!-- element id's can optionally be changed in config -->
</div>
```

![TypedtextJS_basic_demo](https://user-images.githubusercontent.com/86114549/208748750-23fa6227-e90a-4fdb-b9f3-feb298fc4e92.gif)

<hr>

#### Config options:
(The values seen here are the default values if not overwritten by user config)

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
            // if options for content obj are omitted, object instance configs (default or user config if set) are used
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
