/*global document*/
var htmlProps = {
  className: true,
  id: true,
  innerHTML: true,
  nodeValue: true,
  tabIndex: true,
  textContent: true,
  value: true,
}

module.exports = function(dot) {
  var state = dot.state

  if (state.el) {
    return
  }

  state.el = { events: {} }
  dot.el = el.bind(state.el)

  dot("logLevel", "elFind", { info: "debug" })

  dot.any("elFind", elFind)
  dot.any("elList", elList)
}

function el(tagName) {
  var node =
    tagName.nodeType === 1
      ? tagName
      : document.createElement(tagName)

  for (var i = 1; i < arguments.length; ++i) {
    var arg = arguments[i]
    if (arg != null) {
      if (!arg.constructor || arg.constructor === Object) {
        for (
          var j = 0, ks = Object.keys(arg);
          j < ks.length;
          ++j
        ) {
          var key = ks[j],
            val = arg[key]
          if (key === "style") {
            node.style.cssText = val
          } else if (
            typeof val !== "string" ||
            htmlProps[key]
          ) {
            node[key] = val
            if (key === "id" && Array.isArray(val)) {
              node[key] = val.join(".")
            }
            //set synthetic events for onUpperCaseName
            if (
              key[0] === "o" &&
              key[1] === "n" &&
              key.charCodeAt(2) < 91 &&
              key.charCodeAt(2) > 64 &&
              !this.events[key]
            ) {
              document.addEventListener(
                key.slice(2).toLowerCase(),
                function(e) {
                  var tgt = e.target
                  do {
                    if (tgt[key]) {
                      return tgt[key](e)
                    }
                  } while ((tgt = tgt.parentNode))
                }
              )
              this.events[key] = true
            }
          } else {
            node.setAttribute(key, val)
          }
        }
      } else {
        if (Array.isArray(arg)) {
          for (var k = 0; k < arg.length; ++k) {
            node.appendChild(
              arg[k].nodeType
                ? arg[k]
                : document.createTextNode(arg[k])
            )
          }
        } else {
          node.appendChild(
            arg.nodeType
              ? arg
              : document.createTextNode(arg)
          )
        }
      }
    }
  }
  return node
}

function elFind(prop, arg) {
  var p = prop.slice()

  if (typeof arg === "number") {
    p.splice(arg, p.length + arg)
  } else if (Array.isArray(arg)) {
    p.splice(arg[0], arg[1])
  }

  return document.getElementById(p.join("."))
}

function elList(prop, arg, dot) {
  var propStr = prop.join("."),
    v = dot.get(prop)

  var el = document.getElementById(propStr)

  if (!el || !v) {
    return
  }

  var ids = v.map(function(d) {
    return d.id.toString()
  })

  var propIds = ids.map(function(id) {
    return propStr + "." + id
  })

  var nodes = collectNodes(el, propIds)

  var after = false,
    lastNode = nodes[0]

  for (var i = 0; i < propIds.length; i++) {
    var id = propIds[i]

    if (!lastNode || id !== lastNode.id) {
      var newNode = dot[arg.event](prop, ids[i])

      if (lastNode) {
        lastNode[after ? "after" : "before"](newNode)

        if (after) {
          lastNode = newNode
        }
      } else {
        el.appendChild(newNode)
      }
    } else {
      dot[arg.event](prop, ids[i], { element: lastNode })

      if (lastNode && lastNode.nextSibling) {
        lastNode = lastNode.nextSibling
      } else {
        after = true
      }
    }
  }

  return propIds
}

function collectNodes(el, propIds) {
  var node = el.childNodes[0],
    nodes = []

  while (node) {
    if (propIds.indexOf(node.id) > -1) {
      nodes.push(node)
      node = node.nextSibling
    } else {
      var old = node
      node = node.nextSibling
      old.remove()
    }
  }

  return nodes
}
