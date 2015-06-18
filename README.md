# Importing CSS Breakpoints Into JavaScript

How do you trigger JavaScript based on the current CSS media query breakpoint? This remains a barrier in responsive design as JavaScript doesn't have access to CSS breakpoints. Many solutions involve declaring your breakpoints in both CSS and JavaScript, or require IE10+. The problem with those solutions is that when you change a breakpoint value you have to change it twice.

### A Simpler Solution

A quick and easy solution to this problem is to have your JavaScript import the breakpoints directly from the CSS values in the DOM.

### Declare Your Breakpoints

For simplicity, this code is straight CSS and can easily be abstracted to Sass or Less.

```css
/**
* These values will not show up in content, but can be 
* queried by JavaScript to know which breakpoint is active.
* Add or remove as many breakpoints as you like.
*/
body:before {
  content: "smartphone";
  display: none; /* prevent from displaying */
}
@media (min-width: 700px) {
  body:before {
    content: "tablet";
  }
}
@media (min-width: 1100px) {
  body:before {
    content: "desktop";
  }
}
```

Note that the `::before` pseudo-element is hidden so it doesn't show to the user.

### Importing the Breakpoints Into JavaScript

This is the magic that queries the property for the current breakpoint. This combination of JavaScript and jQuery uses an object to store the breakpoint value.

```
javascript
var breakpoint = {};
breakpoint.refreshValue = function () {
  this.value = window.getComputedStyle(
    document.querySelector('body'),
    ':before'
  ).getPropertyValue('content').replace(/\"/g, '');
};
```

There are a couple of things going on here. We're querying the content property on the `::before` pseudo-element. We can't attach the content property directly to the body tag, because IE9 will return a value of "normal" when querying. IE10 and IE11 work fine. 

Firefox and IE return the value with double quotes ("), while other browsers don't. To get consistent values we're using `replace()` with regex to strip out double quotes.

### Trigger on Resize and Page Load

Breakpoints change based on your browser's viewport width, so we need to update the value when the browser is resized. We also trigger a resize event on the initial page load to get the first value.

```javascript
$(window).resize(function () {
  breakpoint.refreshValue();
}).resize();
```

### In Use

This is a simple if-else statement that queries the current breakpoint, and runs code based on the result.

```javascript
if (breakpoint.value == 'tablet') {
  console.log('Tablet breakpoint');
} else {
  console.log('Some other breakpoint');
}
```

### Use Case

Below is a simplified example of how to handle this.

#### 1. Get the current breakpoint

```javascript
/**
* Global: Get current CSS breakpoint
*/
var breakpoint = {};
breakpoint.refreshValue = function () {
  this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/"/g, '');
};
```

#### 2. Function to pass the number of columns to leaderboardMoveHelper()

```javascript
/**
* Pass the number of columns to leaderboardMoveHelper() to do all the work
*/
var leaderboardMove = function () {
  if (breakpoint.value == 'tablet_narrow') {
    leaderboardMoveHelper(2);
  }
  if ((breakpoint.value == 'tablet_wide') || (breakpoint.value == 'normal')) {
    leaderboardMoveHelper(3);
  }
  if (breakpoint.value == 'wide') {
    leaderboardMoveHelper(4);
  }
};
```

### 3. Helper function to move the leaderboard to the appropriate location within the DOM

```javascript
/**
* Move the leaderboard to the second row
*/
var leaderboardMoveHelper = function (columns) {
  var $tileView = $('.tile-container', context),
    $leaderboard = $('.ad-leaderboard.processed', $tileView),
    // Move the leaderboard
    $('.tile:nth-child(' + (columns + 1) + ')', $tileView).after($leaderboard);
    // Indicate it's moved
  $leaderboard.addClass('js-leaderboard-processed');
  $tileView.addClass('js-leaderboard-processed');
};
```

#### 4. Run the JS on browser resize and page load

```javascript
/**
* Execute
*/
$(window).resize(function () {
  breakpoint.refreshValue();
  leaderboardMove();
}).resize();
```
