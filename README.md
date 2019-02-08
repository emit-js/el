# @dot-event/el

[dot-event](https://github.com/dot-event/dot-event#readme) dom elements

![element](element.gif)

## What is it?

This library allows you to write JSX to define [pure DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element) and manage element lists.

✅ SSR &nbsp; 🚫 No virtual dom!

## Install

```js
npm install dot-event @dot-event/el
```

## Setup

```js
const dot = require("dot-event")
require("@dot-event/el")(dot)
```

## Usage

The `dot.el` API works well with JSX and [view components](https://github.com/dot-event/view):

```js
/** @jsx dot.el */

export default function(dot) {
  if (dot.myView) {
    return
  }
  dot.view("myView", { render })
}

function render(prop, arg, dot) {
  return <div id={prop} />
}
```

Then use it:

```js
require("./myView").default(dot)
dot.myView("myId") // `render` element to #myId
```

## List helper

A common pattern is to set an array of objects in the [store](https://github.com/dot-event/store):

```js
dot.set("myId", [{id: 1}, {id: 2}])
```

And create a list of elements using a particular [view component](https://github.com/dot-event/view):

```js
dot.elList("myId", { event: "myView" })
```

The `dot.elList` helper works with SSR elements, removing, updating, and inserting where necessary.

## Related composers

| Library    | Description    | URL                                     |
| ---------- | -------------- | --------------------------------------- |
| controller | DOM controller | https://github.com/dot-event/controller#readme |
| render     | Server side render     | https://github.com/dot-event/render#readme     |
| view       | DOM view       | https://github.com/dot-event/view#readme       |

## Credit

This library borrows heavily from [attodom](https://github.com/hville/attodom).
