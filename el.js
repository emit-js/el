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
  if (dot.state.el) {
    return
  }

  dot.state.el = { events: {} }
  dot.el = el.bind(dot.state.el)
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
