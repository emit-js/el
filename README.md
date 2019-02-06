# @dot-event/el

dot-event dom elements

![element](element.gif)

## What is it?

This library allows you to write JSX to define [pure DOM elements](https://developer.mozilla.org/en-US/docs/Web/API/Element).

🚫 virtual dom!

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

The `dot.el` API works well with [@dot-event/view](https://github.com/dot-event/view) and JSX:

```js
/** @jsx dot.el */

export default function(dot) {
  if (dot.myView) {
    return
  }
  dot.view("myView", { render, update })
}

function render(prop, arg, dot) {
  return <div id={prop} />
}
```

Then use it:

```js
require("./myView").default(dot)
const el = dot.myView("myId") // replaces #myId with element from render
```

## Credit

This library borrows heavily from [attodom](https://github.com/hville/attodom).
