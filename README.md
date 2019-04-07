# @emit-js/el

[emit](https://github.com/emit-js/emit#readme) dom elements

![element](element.gif)

## What is it?

This library allows you to write JSX to define [pure DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element) and manage element lists.

✅ SSR &nbsp; 🚫 No virtual dom!

## Install

```js
npm install @emit-js/emit @emit-js/el
```

## Setup

```js
const emit = require("@emit-js/emit")
require("@emit-js/el")(emit)
```

## Usage

The `emit.el` API works well with JSX and [view components](https://github.com/emit-js/view):

```js
/** @jsx emit.el */

module.exports = function(emit) {
  emit.view("myView", { render })
}

function render(arg, prop, emit) {
  return <div id={prop} />
}
```

Then use it:

```js
require("./myView")(emit)
emit.myView("myId") // `render` element to #myId
```

## List helper

A common pattern is to set an array of objects in the [store](https://github.com/emit-js/store):

```js
emit.set("myId", [{id: 1}, {id: 2}])
```

And create a list of elements using a particular [view component](https://github.com/emit-js/view):

```js
emit.elList("myId", { event: "myView" })
```

The `emit.elList` helper works with SSR elements, removing, updating, and inserting where necessary.

## Related composers

| Library    | Description    | URL                                     |
| ---------- | -------------- | --------------------------------------- |
| controller | DOM controller | https://github.com/emit-js/controller#readme |
| render     | Server side render     | https://github.com/emit-js/render#readme     |
| view       | DOM view       | https://github.com/emit-js/view#readme       |

## Credit

This library borrows heavily from [attodom](https://github.com/hville/attodom).
