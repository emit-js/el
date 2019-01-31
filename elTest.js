/* global document */
/* eslint-env jest */

var dot = require("dot-event")(),
  JSDOM = require("jsdom").JSDOM

var window = new JSDOM().window

require("./")(dot)

var el = dot.el

global.document = window.document

test("element - nodeType", function() {
  expect(el("div").nodeType).toBe(1)
  expect(el("p").nodeType).toBe(1)
  expect(el(document.createElement("p")).nodeType).toBe(1)
})

test("element - properties", function() {
  expect(el("div").attributes.length).toBe(0)
  expect(el("div", { id: "id" }).id).toBe("id")
  expect(
    el("div", { className: "className" }).className
  ).toBe("className")
  expect(el("input", { value: "value" }).value).toBe(
    "value"
  )
  expect(
    el("p", { textContent: "textContent" }).textContent
  ).toBe("textContent")
})

test("element - attributes", function() {
  expect(el("div").attributes.length).toBe(0)
  expect(
    el("div", { class: "class" }).attributes.length
  ).toBe(1)
  expect(
    el("div", { style: "style" }).attributes.length
  ).toBe(1)
  expect(
    el("div", { "data-set": "data-set" }).attributes.length
  ).toBe(1)
  expect(
    el("div", { value: "value" }).attributes.length
  ).toBe(0)
})

test("element - mixed children", function() {
  expect(
    el("p", [0, el("p"), el("p"), el("p")]).childNodes
      .length
  ).toBe(4)
  expect(
    el("p", el("p"), [], el("p"), [el("p"), 0]).childNodes
      .length
  ).toBe(4)
  expect(
    el("p", [el("p"), 0, [el("p"), el("p")]]).childNodes
      .length
  ).toBe(3)
})

test("el - event", function() {
  var kin = el("h1", {
    onclick: function(e) {
      this.textContent += e.target.tagName
    },
  })
  kin.dispatchEvent(
    new window.Event("click", { bubbles: true })
  )
  expect(kin.textContent).toBe("H1")
})

test("el - synthetic event", function() {
  var h2 = el("h2")
  var h1 = el(
    "h1",
    {
      onClick: function(e) {
        this.textContent = e.target.tagName
      },
    },
    h2
  )
  document.body.appendChild(h1)
  h1.dispatchEvent(
    new window.Event("click", { bubbles: false })
  )
  expect(h1.textContent).toBe("")
  h2.dispatchEvent(
    new window.Event("click", { bubbles: true })
  )
  expect(h1.textContent).toBe("H2")
  h1.dispatchEvent(
    new window.Event("click", { bubbles: true })
  )
  expect(h1.textContent).toBe("H1")
})

test("element - update", function() {
  var kin = el("span", "b", {
    update: function(v) {
      this.textContent = v.toUpperCase()
    },
  })
  expect(kin.textContent).toBe("b")

  kin.update("abc")
  expect(kin.textContent).toBe("ABC")
})

test("element - nested reference", function() {
  var kid = el("span", "b"),
    kin = el("h1", el("h2", el("h3", el("h4", kid))), {
      __kid: kid,
      update: function(v) {
        this.__kid.textContent = v
      },
    })

  expect(kid.textContent).toBe("b")

  kin.update("B")
  expect(kid.textContent).toBe("B")
})

test("element list", function() {
  dot.get = function() {
    return { 1: true, 2: true }
  }
  var main = el("div", { id: "test" }, [
    el("div", { id: "test.1" }),
    el("div", { id: "test.3" }),
  ])
  document.body.appendChild(main)
  dot.elList("test")
  expect(main.childNodes.length).toBe(1)
  expect(main.childNodes[0].id).toBe("test.1")
})
