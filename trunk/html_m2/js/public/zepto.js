var Zepto = function() {
    function d(a) {
        return null == a ? "" + a: I[Q.call(a)] || "object"
    }
    function h(a) {
        return "function" == d(a)
    }
    function u(a) {
        return null != a && a == a.window
    }
    function i(a) {
        return null != a && a.nodeType == a.DOCUMENT_NODE
    }
    function o(a) {
        return "object" == d(a)
    }
    function q(a) {
        return o(a) && !u(a) && Object.getPrototypeOf(a) == Object.prototype
    }
    function A(a) {
        return c.call(a,
        function(a) {
            return null != a
        })
    }
    function v(a) {
        return a.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase()
    }
    function y(a) {
        return a in J ? J[a] : J[a] = RegExp("(^|\\s)" + a + "(\\s|$)")
    }
    function B(a) {
        return "children" in a ? b.call(a.children) : e.map(a.childNodes,
        function(a) {
            return 1 == a.nodeType ? a: void 0
        })
    }
    function D(a, p, b) {
        for (k in p) b && (q(p[k]) || G(p[k])) ? (q(p[k]) && !q(a[k]) && (a[k] = {}), G(p[k]) && !G(a[k]) && (a[k] = []), D(a[k], p[k], b)) : p[k] !== m && (a[k] = p[k])
    }
    function w(a, p) {
        return null == p ? e(a) : e(a).filter(p)
    }
    function r(a, p, b, c) {
        return h(p) ? p.call(a, b, c) : p
    }
    function x(a, p, b) {
        null == b ? a.removeAttribute(p) : a.setAttribute(p, b)
    }
    function n(a, p) {
        var b = a.className,
        c = b && b.baseVal !== m;
        return p === m ? c ? b.baseVal: b: void(c ? b.baseVal = p: a.className = p)
    }
    function E(a) {
        var p;
        try {
            return a ? "true" == a || ("false" == a ? !1 : "null" == a ? null: /^0/.test(a) || isNaN(p = Number(a)) ? /^[\[\{]/.test(a) ? e.parseJSON(a) : a: p) : a
        } catch(b) {
            return a
        }
    }
    function z(a, p) {
        p(a);
        for (var b in a.childNodes) z(a.childNodes[b], p)
    }
    var m, k, e, t, F, g, f = [],
    b = f.slice,
    c = f.filter,
    l = window.document,
    C = {},
    J = {},
    H = {
        "column-count": 1,
        columns: 1,
        "font-weight": 1,
        "line-height": 1,
        opacity: 1,
        "z-index": 1,
        zoom: 1
    },
    K = /^\s*<(\w+|!)[^>]*>/,
    R = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    j = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    M = /^(?:body|html)$/i,
    S = /([A-Z])/g,
    T = "val css html text data width height offset".split(" "),
    L = l.createElement("table"),
    N = l.createElement("tr"),
    O = {
        tr: l.createElement("tbody"),
        tbody: L,
        thead: L,
        tfoot: L,
        td: N,
        th: N,
        "*": l.createElement("div")
    },
    U = /complete|loaded|interactive/,
    V = /^[\w-]*$/,
    I = {},
    Q = I.toString,
    s = {},
    P = l.createElement("div"),
    W = {
        tabindex: "tabIndex",
        readonly: "readOnly",
        "for": "htmlFor",
        "class": "className",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        cellpadding: "cellPadding",
        rowspan: "rowSpan",
        colspan: "colSpan",
        usemap: "useMap",
        frameborder: "frameBorder",
        contenteditable: "contentEditable"
    },
    G = Array.isArray ||
    function(a) {
        return a instanceof Array
    };
    return s.matches = function(a, b) {
        if (!b || !a || 1 !== a.nodeType) return ! 1;
        var c = a.webkitMatchesSelector || a.mozMatchesSelector || a.oMatchesSelector || a.matchesSelector;
        if (c) return c.call(a, b);
        var d, c = a.parentNode,
        g = !c;
        return g && (c = P).appendChild(a),
        d = ~s.qsa(c, b).indexOf(a),
        g && P.removeChild(a),
        d
    },
    F = function(a) {
        return a.replace(/-+(.)?/g,
        function(a, b) {
            return b ? b.toUpperCase() : ""
        })
    },
    g = function(a) {
        return c.call(a,
        function(b, c) {
            return a.indexOf(b) == c
        })
    },
    s.fragment = function(a, p, c) {
        var d, g, f;
        return R.test(a) && (d = e(l.createElement(RegExp.$1))),
        d || (a.replace && (a = a.replace(j, "<$1></$2>")), p === m && (p = K.test(a) && RegExp.$1), p in O || (p = "*"), f = O[p], f.innerHTML = "" + a, d = e.each(b.call(f.childNodes),
        function() {
            f.removeChild(this)
        })),
        q(c) && (g = e(d), e.each(c,
        function(a, b) { - 1 < T.indexOf(a) ? g[a](b) : g.attr(a, b)
        })),
        d
    },
    s.Z = function(a, b) {
        return a = a || [],
        a.__proto__ = e.fn,
        a.selector = b || "",
        a
    },
    s.isZ = function(a) {
        return a instanceof s.Z
    },
    s.init = function(a, b) {
        var c;
        if (!a) return s.Z();
        if ("string" == typeof a) if (a = a.trim(), "<" == a[0] && K.test(a)) c = s.fragment(a, RegExp.$1, b),
        a = null;
        else {
            if (b !== m) return e(b).find(a);
            c = s.qsa(l, a)
        } else {
            if (h(a)) return e(l).ready(a);
            if (s.isZ(a)) return a;
            if (G(a)) c = A(a);
            else if (o(a)) c = [a],
            a = null;
            else if (K.test(a)) c = s.fragment(a.trim(), RegExp.$1, b),
            a = null;
            else {
                if (b !== m) return e(b).find(a);
                c = s.qsa(l, a)
            }
        }
        return s.Z(c, a)
    },
    e = function(a, b) {
        return s.init(a, b)
    },
    e.extend = function(a) {
        var c, d = b.call(arguments, 1);
        return "boolean" == typeof a && (c = a, a = d.shift()),
        d.forEach(function(b) {
            D(a, b, c)
        }),
        a
    },
    s.qsa = function(a, c) {
        var d, g = "#" == c[0],
        e = !g && "." == c[0],
        f = g || e ? c.slice(1) : c,
        l = V.test(f);
        return i(a) && l && g ? (d = a.getElementById(f)) ? [d] : [] : 1 !== a.nodeType && 9 !== a.nodeType ? [] : b.call(l && !g ? e ? a.getElementsByClassName(f) : a.getElementsByTagName(c) : a.querySelectorAll(c))
    },
    e.contains = function(a, b) {
        return a !== b && a.contains(b)
    },
    e.type = d,
    e.isFunction = h,
    e.isWindow = u,
    e.isArray = G,
    e.isPlainObject = q,
    e.isEmptyObject = function(a) {
        for (var b in a) return ! 1;
        return ! 0
    },
    e.inArray = function(a, b, c) {
        return f.indexOf.call(b, a, c)
    },
    e.camelCase = F,
    e.trim = function(a) {
        return null == a ? "": String.prototype.trim.call(a)
    },
    e.uuid = 0,
    e.support = {},
    e.expr = {},
    e.map = function(a, b) {
        var c, d, g = [];
        if ("number" == typeof a.length) for (d = 0; d < a.length; d++) c = b(a[d], d),
        null != c && g.push(c);
        else for (d in a) c = b(a[d], d),
        null != c && g.push(c);
        return 0 < g.length ? e.fn.concat.apply([], g) : g
    },
    e.each = function(a, b) {
        var c;
        if ("number" == typeof a.length) for (c = 0; c < a.length && !1 !== b.call(a[c], c, a[c]); c++);
        else for (c in a) if (!1 === b.call(a[c], c, a[c])) break;
        return a
    },
    e.grep = function(a, b) {
        return c.call(a, b)
    },
    window.JSON && (e.parseJSON = JSON.parse),
    e.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),
    function(a, b) {
        I["[object " + b + "]"] = b.toLowerCase()
    }),
    e.fn = {
        forEach: f.forEach,
        reduce: f.reduce,
        push: f.push,
        sort: f.sort,
        indexOf: f.indexOf,
        concat: f.concat,
        map: function(a) {
            return e(e.map(this,
            function(b, c) {
                return a.call(b, c, b)
            }))
        },
        slice: function() {
            return e(b.apply(this, arguments))
        },
        ready: function(a) {
            return U.test(l.readyState) && l.body ? a(e) : l.addEventListener("DOMContentLoaded",
            function() {
                a(e)
            },
            !1),
            this
        },
        get: function(a) {
            return a === m ? b.call(this) : this[0 <= a ? a: a + this.length]
        },
        toArray: function() {
            return this.get()
        },
        size: function() {
            return this.length
        },
        remove: function() {
            return this.each(function() {
                null != this.parentNode && this.parentNode.removeChild(this)
            })
        },
        each: function(a) {
            return f.every.call(this,
            function(b, c) {
                return ! 1 !== a.call(b, c, b)
            }),
            this
        },
        filter: function(a) {
            return h(a) ? this.not(this.not(a)) : e(c.call(this,
            function(b) {
                return s.matches(b, a)
            }))
        },
        add: function(a, b) {
            return e(g(this.concat(e(a, b))))
        },
        is: function(a) {
            return 0 < this.length && s.matches(this[0], a)
        },
        not: function(a) {
            var c = [];
            if (h(a) && a.call !== m) this.each(function(b) {
                a.call(this, b) || c.push(this)
            });
            else {
                var d = "string" == typeof a ? this.filter(a) : "number" == typeof a.length && h(a.item) ? b.call(a) : e(a);
                this.forEach(function(a) {
                    0 > d.indexOf(a) && c.push(a)
                })
            }
            return e(c)
        },
        has: function(a) {
            return this.filter(function() {
                return o(a) ? e.contains(this, a) : e(this).find(a).size()
            })
        },
        eq: function(a) {
            return - 1 === a ? this.slice(a) : this.slice(a, +a + 1)
        },
        first: function() {
            var a = this[0];
            return a && !o(a) ? a: e(a)
        },
        last: function() {
            var a = this[this.length - 1];
            return a && !o(a) ? a: e(a)
        },
        find: function(a) {
            var b = this;
            return "object" == typeof a ? e(a).filter(function() {
                var a = this;
                return f.some.call(b,
                function(b) {
                    return e.contains(b, a)
                })
            }) : 1 == this.length ? e(s.qsa(this[0], a)) : this.map(function() {
                return s.qsa(this, a)
            })
        },
        closest: function(a, b) {
            var c = this[0],
            d = !1;
            for ("object" == typeof a && (d = e(a)); c && !(d ? 0 <= d.indexOf(c) : s.matches(c, a));) c = c !== b && !i(c) && c.parentNode;
            return e(c)
        },
        parents: function(a) {
            for (var b = [], c = this; 0 < c.length;) c = e.map(c,
            function(a) {
                return (a = a.parentNode) && !i(a) && 0 > b.indexOf(a) ? (b.push(a), a) : void 0
            });
            return w(b, a)
        },
        parent: function(a) {
            return w(g(this.pluck("parentNode")), a)
        },
        children: function(a) {
            return w(this.map(function() {
                return B(this)
            }), a)
        },
        contents: function() {
            return this.map(function() {
                return b.call(this.childNodes)
            })
        },
        siblings: function(a) {
            return w(this.map(function(a, b) {
                return c.call(B(b.parentNode),
                function(a) {
                    return a !== b
                })
            }), a)
        },
        empty: function() {
            return this.each(function() {
                this.innerHTML = ""
            })
        },
        pluck: function(a) {
            return e.map(this,
            function(b) {
                return b[a]
            })
        },
        show: function() {
            return this.each(function() {
                "none" == this.style.display && (this.style.display = "");
                if ("none" == getComputedStyle(this, "").getPropertyValue("display")) {
                    var a = this.style,
                    b;
                    b = this.nodeName;
                    var c, d;
                    b = (C[b] || (c = l.createElement(b), l.body.appendChild(c), d = getComputedStyle(c, "").getPropertyValue("display"), c.parentNode.removeChild(c), "none" == d && (d = "block"), C[b] = d), C[b]);
                    a.display = b
                }
            })
        },
        replaceWith: function(a) {
            return this.before(a).remove()
        },
        wrap: function(a) {
            var b = h(a);
            if (this[0] && !b) var c = e(a).get(0),
            d = c.parentNode || 1 < this.length;
            return this.each(function(g) {
                e(this).wrapAll(b ? a.call(this, g) : d ? c.cloneNode(!0) : c)
            })
        },
        wrapAll: function(a) {
            if (this[0]) {
                e(this[0]).before(a = e(a));
                for (var b; (b = a.children()).length;) a = b.first();
                e(a).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            var b = h(a);
            return this.each(function(c) {
                var d = e(this),
                g = d.contents(),
                c = b ? a.call(this, c) : a;
                g.length ? g.wrapAll(c) : d.append(c)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                e(this).replaceWith(e(this).children())
            }),
            this
        },
        clone: function() {
            return this.map(function() {
                return this.cloneNode(!0)
            })
        },
        hide: function() {
            return this.css("display", "none")
        },
        toggle: function(a) {
            return this.each(function() {
                var b = e(this); (a === m ? "none" == b.css("display") : a) ? b.show() : b.hide()
            })
        },
        prev: function(a) {
            return e(this.pluck("previousElementSibling")).filter(a || "*")
        },
        next: function(a) {
            return e(this.pluck("nextElementSibling")).filter(a || "*")
        },
        html: function(a) {
            return 0 === arguments.length ? 0 < this.length ? this[0].innerHTML: null: this.each(function(b) {
                var c = this.innerHTML;
                e(this).empty().append(r(this, a, b, c))
            })
        },
        text: function(a) {
            return 0 === arguments.length ? 0 < this.length ? this[0].textContent: null: this.each(function() {
                this.textContent = a === m ? "": "" + a
            })
        },
        attr: function(a, b) {
            var c;
            return "string" == typeof a && b === m ? 0 == this.length || 1 !== this[0].nodeType ? m: "value" == a && "INPUT" == this[0].nodeName ? this.val() : !(c = this[0].getAttribute(a)) && a in this[0] ? this[0][a] : c: this.each(function(c) {
                if (1 === this.nodeType) if (o(a)) for (k in a) x(this, k, a[k]);
                else x(this, a, r(this, b, c, this.getAttribute(a)))
            })
        },
        removeAttr: function(a) {
            return this.each(function() {
                1 === this.nodeType && x(this, a)
            })
        },
        prop: function(a, b) {
            return a = W[a] || a,
            b === m ? this[0] && this[0][a] : this.each(function(c) {
                this[a] = r(this, b, c, this[a])
            })
        },
        data: function(a, b) {
            var c = this.attr("data-" + a.replace(S, "-$1").toLowerCase(), b);
            return null !== c ? E(c) : m
        },
        val: function(a) {
            return 0 === arguments.length ? this[0] && (this[0].multiple ? e(this[0]).find("option").filter(function() {
                return this.selected
            }).pluck("value") : this[0].value) : this.each(function(b) {
                this.value = r(this, a, b, this.value)
            })
        },
        offset: function(a) {
            if (a) return this.each(function(b) {
                var c = e(this),
                b = r(this, a, b, c.offset()),
                d = c.offsetParent().offset(),
                b = {
                    top: b.top - d.top,
                    left: b.left - d.left
                };
                "static" == c.css("position") && (b.position = "relative");
                c.css(b)
            });
            if (0 == this.length) return null;
            var b = this[0].getBoundingClientRect();
            return {
                left: b.left + window.pageXOffset,
                top: b.top + window.pageYOffset,
                width: Math.round(b.width),
                height: Math.round(b.height)
            }
        },
        css: function(a, b) {
            if (2 > arguments.length) {
                var c = this[0],
                g = getComputedStyle(c, "");
                if (!c) return;
                if ("string" == typeof a) return c.style[F(a)] || g.getPropertyValue(a);
                if (G(a)) {
                    var f = {};
                    return e.each(G(a) ? a: [a],
                    function(a, b) {
                        f[b] = c.style[F(b)] || g.getPropertyValue(b)
                    }),
                    f
                }
            }
            var l = "";
            if ("string" == d(a)) b || 0 === b ? l = v(a) + ":" + ("number" != typeof b || H[v(a)] ? b: b + "px") : this.each(function() {
                this.style.removeProperty(v(a))
            });
            else for (k in a) a[k] || 0 === a[k] ? l += v(k) + ":" + ("number" != typeof a[k] || H[v(k)] ? a[k] : a[k] + "px") + ";": this.each(function() {
                this.style.removeProperty(v(k))
            });
            return this.each(function() {
                this.style.cssText += ";" + l
            })
        },
        index: function(a) {
            return a ? this.indexOf(e(a)[0]) : this.parent().children().indexOf(this[0])
        },
        hasClass: function(a) {
            return a ? f.some.call(this,
            function(a) {
                return this.test(n(a))
            },
            y(a)) : !1
        },
        addClass: function(a) {
            return a ? this.each(function(b) {
                t = [];
                var c = n(this);
                r(this, a, b, c).split(/\s+/g).forEach(function(a) {
                    e(this).hasClass(a) || t.push(a)
                },
                this);
                t.length && n(this, c + (c ? " ": "") + t.join(" "))
            }) : this
        },
        removeClass: function(a) {
            return this.each(function(b) {
                return a === m ? n(this, "") : (t = n(this), r(this, a, b, t).split(/\s+/g).forEach(function(a) {
                    t = t.replace(y(a), " ")
                }), void n(this, t.trim()))
            })
        },
        toggleClass: function(a, b) {
            return a ? this.each(function(c) {
                var d = e(this);
                r(this, a, c, n(this)).split(/\s+/g).forEach(function(a) { (b === m ? !d.hasClass(a) : b) ? d.addClass(a) : d.removeClass(a)
                })
            }) : this
        },
        scrollTop: function(a) {
            if (this.length) {
                var b = "scrollTop" in this[0];
                return a === m ? b ? this[0].scrollTop: this[0].pageYOffset: this.each(b ?
                function() {
                    this.scrollTop = a
                }: function() {
                    this.scrollTo(this.scrollX, a)
                })
            }
        },
        scrollLeft: function(a) {
            if (this.length) {
                var b = "scrollLeft" in this[0];
                return a === m ? b ? this[0].scrollLeft: this[0].pageXOffset: this.each(b ?
                function() {
                    this.scrollLeft = a
                }: function() {
                    this.scrollTo(a, this.scrollY)
                })
            }
        },
        position: function() {
            if (this.length) {
                var a = this[0],
                b = this.offsetParent(),
                c = this.offset(),
                d = M.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                }: b.offset();
                return c.top -= parseFloat(e(a).css("margin-top")) || 0,
                c.left -= parseFloat(e(a).css("margin-left")) || 0,
                d.top += parseFloat(e(b[0]).css("border-top-width")) || 0,
                d.left += parseFloat(e(b[0]).css("border-left-width")) || 0,
                {
                    top: c.top - d.top,
                    left: c.left - d.left
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || l.body; a && !M.test(a.nodeName) && "static" == e(a).css("position");) a = a.offsetParent;
                return a
            })
        }
    },
    e.fn.detach = e.fn.remove,
    ["width", "height"].forEach(function(a) {
        var b = a.replace(/./,
        function(a) {
            return a[0].toUpperCase()
        });
        e.fn[a] = function(c) {
            var d, g = this[0];
            return c === m ? u(g) ? g["inner" + b] : i(g) ? g.documentElement["scroll" + b] : (d = this.offset()) && d[a] : this.each(function(b) {
                g = e(this);
                g.css(a, r(this, c, b, g[a]()))
            })
        }
    }),
    ["after", "prepend", "before", "append"].forEach(function(a, b) {
        var c = b % 2;
        e.fn[a] = function() {
            var a, g, f = e.map(arguments,
            function(b) {
                return a = d(b),
                "object" == a || "array" == a || null == b ? b: s.fragment(b)
            }),
            l = 1 < this.length;
            return 1 > f.length ? this: this.each(function(a, d) {
                g = c ? d: d.parentNode;
                d = 0 == b ? d.nextSibling: 1 == b ? d.firstChild: 2 == b ? d: null;
                f.forEach(function(a) {
                    if (l) a = a.cloneNode(!0);
                    else if (!g) return e(a).remove();
                    z(g.insertBefore(a, d),
                    function(a) {
                        null == a.nodeName || "SCRIPT" !== a.nodeName.toUpperCase() || a.type && "text/javascript" !== a.type || a.src || window.eval.call(window, a.innerHTML)
                    })
                })
            })
        };
        e.fn[c ? a + "To": "insert" + (b ? "Before": "After")] = function(b) {
            return e(b)[a](this),
            this
        }
    }),
    s.Z.prototype = e.fn,
    s.uniq = g,
    s.deserializeValue = E,
    e.zepto = s,
    e
} ();
window.Zepto = Zepto;
void 0 === window.$ && (window.$ = Zepto); (function(d) {
    function h(d) {
        return d._zid || (d._zid = B++)
    }
    function u(d, f, b, c) {
        if (f = i(f), f.ns) var l = RegExp("(?:^| )" + f.ns.replace(" ", " .* ?") + "(?: |$)");
        return (x[h(d)] || []).filter(function(d) {
            return ! (!d || f.e && d.e != f.e || f.ns && !l.test(d.ns) || b && h(d.fn) !== h(b) || c && d.sel != c)
        })
    }
    function i(d) {
        d = ("" + d).split(".");
        return {
            e: d[0],
            ns: d.slice(1).sort().join(" ")
        }
    }
    function o(g, f, b, c, l, e, k) {
        var H = h(g),
        n = x[H] || (x[H] = []);
        f.split(/\s/).forEach(function(f) {
            if ("ready" == f) return d(document).ready(b);
            var j = i(f);
            j.fn = b;
            j.sel = l;
            j.e in m && (b = function(b) {
                var c = b.relatedTarget;
                return ! c || c !== this && !d.contains(this, c) ? j.fn.apply(this, arguments) : void 0
            });
            var h = (j.del = e) || b;
            j.proxy = function(b) {
                if (b = A(b), !b.isImmediatePropagationStopped()) {
                    b.data = c;
                    var d = h.apply(g, b._args == y ? [b] : [b].concat(b._args));
                    return ! 1 === d && (b.preventDefault(), b.stopPropagation()),
                    d
                }
            };
            j.i = n.length;
            n.push(j);
            "addEventListener" in g && g.addEventListener(m[j.e] || E && z[j.e] || j.e, j.proxy, j.del && !E && j.e in z || !!k)
        })
    }
    function q(d, f, b, c, l) {
        var e = h(d); (f || "").split(/\s/).forEach(function(f) {
            u(d, f, b, c).forEach(function(b) {
                delete x[e][b.i];
                "removeEventListener" in d && d.removeEventListener(m[b.e] || E && z[b.e] || b.e, b.proxy, b.del && !E && b.e in z || !!l)
            })
        })
    }
    function A(g, f) {
        return (f || !g.isDefaultPrevented) && (f || (f = g), d.each(F,
        function(b, c) {
            var d = f[b];
            g[b] = function() {
                return this[c] = k,
                d && d.apply(f, arguments)
            };
            g[c] = e
        }), (f.defaultPrevented !== y ? f.defaultPrevented: "returnValue" in f ? !1 === f.returnValue: f.getPreventDefault && f.getPreventDefault()) && (g.isDefaultPrevented = k)),
        g
    }
    function v(d) {
        var f, b = {
            originalEvent: d
        };
        for (f in d) t.test(f) || d[f] === y || (b[f] = d[f]);
        return A(b, d)
    }
    var y, B = 1,
    D = Array.prototype.slice,
    w = d.isFunction,
    r = function(d) {
        return "string" == typeof d
    },
    x = {},
    n = {},
    E = "onfocusin" in window,
    z = {
        focus: "focusin",
        blur: "focusout"
    },
    m = {
        mouseenter: "mouseover",
        mouseleave: "mouseout"
    };
    n.click = n.mousedown = n.mouseup = n.mousemove = "MouseEvents";
    d.event = {
        add: o,
        remove: q
    };
    d.proxy = function(g, f) {
        if (w(g)) {
            var b = function() {
                return g.apply(f, arguments)
            };
            return b._zid = h(g),
            b
        }
        if (r(f)) return d.proxy(g[f], g);
        throw new TypeError("expected function")
    };
    d.fn.bind = function(d, f, b) {
        return this.on(d, f, b)
    };
    d.fn.unbind = function(d, f) {
        return this.off(d, f)
    };
    d.fn.one = function(d, f, b, c) {
        return this.on(d, f, b, c, 1)
    };
    var k = function() {
        return ! 0
    },
    e = function() {
        return ! 1
    },
    t = /^([A-Z]|returnValue$|layer[XY]$)/,
    F = {
        preventDefault: "isDefaultPrevented",
        stopImmediatePropagation: "isImmediatePropagationStopped",
        stopPropagation: "isPropagationStopped"
    };
    d.fn.delegate = function(d, f, b) {
        return this.on(f, d, b)
    };
    d.fn.undelegate = function(d, f, b) {
        return this.off(f, d, b)
    };
    d.fn.live = function(e, f) {
        return d(document.body).delegate(this.selector, e, f),
        this
    };
    d.fn.die = function(e, f) {
        return d(document.body).undelegate(this.selector, e, f),
        this
    };
    d.fn.on = function(g, f, b, c, l) {
        var C, h, i = this;
        return g && !r(g) ? (d.each(g,
        function(c, d) {
            i.on(c, f, b, d, l)
        }), i) : (r(f) || w(c) || !1 === c || (c = b, b = f, f = y), (w(b) || !1 === b) && (c = b, b = y), !1 === c && (c = e), i.each(function(e, i) {
            l && (C = function(b) {
                return q(i, b.type, c),
                c.apply(this, arguments)
            });
            f && (h = function(b) {
                var e, l = d(b.target).closest(f, i).get(0);
                return l && l !== i ? (e = d.extend(v(b), {
                    currentTarget: l,
                    liveFired: i
                }), (C || c).apply(l, [e].concat(D.call(arguments, 1)))) : void 0
            });
            o(i, g, c, b, f, h || C)
        }))
    };
    d.fn.off = function(g, f, b) {
        var c = this;
        return g && !r(g) ? (d.each(g,
        function(b, d) {
            c.off(b, f, d)
        }), c) : (r(f) || w(b) || !1 === b || (b = f, f = y), !1 === b && (b = e), c.each(function() {
            q(this, g, b, f)
        }))
    };
    d.fn.trigger = function(e, f) {
        return e = r(e) || d.isPlainObject(e) ? d.Event(e) : A(e),
        e._args = f,
        this.each(function() {
            "dispatchEvent" in this ? this.dispatchEvent(e) : d(this).triggerHandler(e, f)
        })
    };
    d.fn.triggerHandler = function(e, f) {
        var b, c;
        return this.each(function(l, C) {
            b = v(r(e) ? d.Event(e) : e);
            b._args = f;
            b.target = C;
            d.each(u(C, e.type || e),
            function(d, e) {
                return c = e.proxy(b),
                b.isImmediatePropagationStopped() ? !1 : void 0
            })
        }),
        c
    };
    "focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e) {
        d.fn[e] = function(d) {
            return d ? this.bind(e, d) : this.trigger(e)
        }
    }); ["focus", "blur"].forEach(function(e) {
        d.fn[e] = function(d) {
            return d ? this.bind(e, d) : this.each(function() {
                try {
                    this[e]()
                } catch(b) {}
            }),
            this
        }
    });
    d.Event = function(d, e) {
        r(d) || (e = d, d = e.type);
        var b = document.createEvent(n[d] || "Events"),
        c = !0;
        if (e) for (var l in e)"bubbles" == l ? c = !!e[l] : b[l] = e[l];
        return b.initEvent(d, c, !0),
        A(b)
    }
})(Zepto); (function(d) {
    function h(b, c, e, f) {
        b.global ? (b = c || z, e = d.Event(e), f = (d(b).trigger(e, f), !e.isDefaultPrevented())) : f = void 0;
        return f
    }
    function u(b) {
        b.global && 0 === d.active++&&h(b, null, "ajaxStart")
    }
    function i(b, c) {
        var d = c.context;
        return ! 1 === c.beforeSend.call(d, b, c) || !1 === h(c, d, "ajaxBeforeSend", [b, c]) ? !1 : void h(c, d, "ajaxSend", [b, c])
    }
    function o(b, c, d, e) {
        var f = d.context;
        d.success.call(f, b, "success", c);
        e && e.resolveWith(f, [b, "success", c]);
        h(d, f, "ajaxSuccess", [c, d, b]);
        A("success", c, d)
    }
    function q(b, c, d, e, f) {
        var g = e.context;
        e.error.call(g, d, c, b);
        f && f.rejectWith(g, [d, c, b]);
        h(e, g, "ajaxError", [d, e, b || c]);
        A(c, d, e)
    }
    function A(b, c, e) {
        var f = e.context;
        e.complete.call(f, c, b);
        h(e, f, "ajaxComplete", [c, e]);
        e.global && !--d.active && h(e, null, "ajaxStop")
    }
    function v() {}
    function y(b) {
        return b && (b = b.split(";", 2)[0]),
        b && (b == F ? "html": b == t ? "json": k.test(b) ? "script": e.test(b) && "xml") || "text"
    }
    function B(b, c) {
        return "" == c ? b: (b + "&" + c).replace(/[&?]{1,2}/, "?")
    }
    function D(b) {
        b.processData && b.data && "string" != d.type(b.data) && (b.data = d.param(b.data, b.traditional)); ! b.data || b.type && "GET" != b.type.toUpperCase() || (b.url = B(b.url, b.data), b.data = void 0)
    }
    function w(b, c, e, f) {
        return d.isFunction(c) && (f = e, e = c, c = void 0),
        d.isFunction(e) || (f = e, e = void 0),
        {
            url: b,
            data: c,
            success: e,
            dataType: f
        }
    }
    function r(b, c, e, f) {
        var g, h = d.isArray(c),
        i = d.isPlainObject(c);
        d.each(c,
        function(c, j) {
            g = d.type(j);
            f && (c = e ? f: f + "[" + (i || "object" == g || "array" == g ? c: "") + "]"); ! f && h ? b.add(j.name, j.value) : "array" == g || !e && "object" == g ? r(b, j, e, c) : b.add(c, j)
        })
    }
    var x, n, E = 0,
    z = window.document,
    m = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    k = /^(?:text|application)\/javascript/i,
    e = /^(?:text|application)\/xml/i,
    t = "application/json",
    F = "text/html",
    g = /^\s*$/;
    d.active = 0;
    d.ajaxJSONP = function(b, c) {
        if (! ("type" in b)) return d.ajax(b);
        var e, f, g = b.jsonpCallback,
        h = (d.isFunction(g) ? g() : g) || "jsonp" + ++E,
        k = z.createElement("script"),
        n = window[h],
        j = function(b) {
            d(k).triggerHandler("error", b || "abort")
        },
        m = {
            abort: j
        };
        return c && c.promise(m),
        d(k).on("load error",
        function(g, j) {
            clearTimeout(f);
            d(k).off().remove();
            "error" != g.type && e ? o(e[0], m, b, c) : q(null, j || "error", m, b, c);
            window[h] = n;
            e && d.isFunction(n) && n(e[0]);
            n = e = void 0
        }),
        !1 === i(m, b) ? (j("abort"), m) : (window[h] = function() {
            e = arguments
        },
        k.src = b.url.replace(/\?(.+)=\?/, "?$1=" + h), z.head.appendChild(k), 0 < b.timeout && (f = setTimeout(function() {
            j("timeout")
        },
        b.timeout)), m)
    };
    d.ajaxSettings = {
        type: "GET",
        beforeSend: v,
        success: v,
        error: v,
        complete: v,
        context: null,
        global: !0,
        xhr: function() {
            return new window.XMLHttpRequest
        },
        accepts: {
            script: "text/javascript, application/javascript, application/x-javascript",
            json: t,
            xml: "application/xml, text/xml",
            html: F,
            text: "text/plain"
        },
        crossDomain: !1,
        timeout: 0,
        processData: !0,
        cache: !0
    };
    d.ajax = function(b) {
        var c = d.extend({},
        b || {}),
        e = d.Deferred && d.Deferred();
        for (x in d.ajaxSettings) void 0 === c[x] && (c[x] = d.ajaxSettings[x]);
        u(c);
        c.crossDomain || (c.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(c.url) && RegExp.$2 != window.location.host);
        c.url || (c.url = window.location.toString());
        D(c); ! 1 === c.cache && (c.url = B(c.url, "_=" + Date.now()));
        var f = c.dataType,
        b = /\?.+=\?/.test(c.url);
        if ("jsonp" == f || b) return b || (c.url = B(c.url, c.jsonp ? c.jsonp + "=?": !1 === c.jsonp ? "": "callback=?")),
        d.ajaxJSONP(c, e);
        var h, b = c.accepts[f],
        k = {},
        m = function(b, c) {
            k[b.toLowerCase()] = [b, c]
        },
        z = /^([\w-]+:)\/\//.test(c.url) ? RegExp.$1: window.location.protocol,
        j = c.xhr(),
        r = j.setRequestHeader;
        if (e && e.promise(j), c.crossDomain || m("X-Requested-With", "XMLHttpRequest"), m("Accept", b || "*/*"), (b = c.mimeType || b) && ( - 1 < b.indexOf(",") && (b = b.split(",", 2)[0]), j.overrideMimeType && j.overrideMimeType(b)), (c.contentType || !1 !== c.contentType && c.data && "GET" != c.type.toUpperCase()) && m("Content-Type", c.contentType || "application/x-www-form-urlencoded"), c.headers) for (n in c.headers) m(n, c.headers[n]);
        if (j.setRequestHeader = m, j.onreadystatechange = function() {
            if (4 == j.readyState) {
                j.onreadystatechange = v;
                clearTimeout(h);
                var b, i = !1;
                if (200 <= j.status && 300 > j.status || 304 == j.status || 0 == j.status && "file:" == z) {
                    f = f || y(c.mimeType || j.getResponseHeader("content-type"));
                    b = j.responseText;
                    try {
                        "script" == f ? (0, eval)(b) : "xml" == f ? b = j.responseXML: "json" == f && (b = g.test(b) ? null: d.parseJSON(b))
                    } catch(k) {
                        i = k
                    }
                    i ? q(i, "parsererror", j, c, e) : o(b, j, c, e)
                } else q(j.statusText || null, j.status ? "error": "abort", j, c, e)
            }
        },
        !1 === i(j, c)) return j.abort(),
        q(null, "abort", j, c, e),
        j;
        if (c.xhrFields) for (n in c.xhrFields) j[n] = c.xhrFields[n];
        j.open(c.type, c.url, "async" in c ? c.async: !0, c.username, c.password);
        for (n in k) r.apply(j, k[n]);
        return 0 < c.timeout && (h = setTimeout(function() {
            j.onreadystatechange = v;
            j.abort();
            q(null, "timeout", j, c, e)
        },
        c.timeout)),
        j.send(c.data ? c.data: null),
        j
    };
    d.get = function() {
        return d.ajax(w.apply(null, arguments))
    };
    d.post = function() {
        var b = w.apply(null, arguments);
        return b.type = "POST",
        d.ajax(b)
    };
    d.getJSON = function() {
        var b = w.apply(null, arguments);
        return b.dataType = "json",
        d.ajax(b)
    };
    d.fn.load = function(b, c, e) {
        if (!this.length) return this;
        var f, g = this,
        h = b.split(/\s/),
        b = w(b, c, e),
        i = b.success;
        return 1 < h.length && (b.url = h[0], f = h[1]),
        b.success = function(b) {
            g.html(f ? d("<div>").html(b.replace(m, "")).find(f) : b);
            i && i.apply(g, arguments)
        },
        d.ajax(b),
        this
    };
    var f = encodeURIComponent;
    d.param = function(b, c) {
        var d = [];
        return d.add = function(b, c) {
            this.push(f(b) + "=" + f(c))
        },
        r(d, b, c),
        d.join("&").replace(/%20/g, "+")
    }
})(Zepto); (function(d) {
    d.fn.serializeArray = function() {
        var h, u = [];
        return d([].slice.call(this.get(0).elements)).each(function() {
            h = d(this);
            var i = h.attr("type");
            "fieldset" != this.nodeName.toLowerCase() && !this.disabled && "submit" != i && "reset" != i && "button" != i && ("radio" != i && "checkbox" != i || this.checked) && u.push({
                name: h.attr("name"),
                value: h.val()
            })
        }),
        u
    };
    d.fn.serialize = function() {
        var d = [];
        return this.serializeArray().forEach(function(u) {
            d.push(encodeURIComponent(u.name) + "=" + encodeURIComponent(u.value))
        }),
        d.join("&")
    };
    d.fn.submit = function(h) {
        h ? this.bind("submit", h) : this.length && (h = d.Event("submit"), this.eq(0).trigger(h), h.isDefaultPrevented() || this.get(0).submit());
        return this
    }
})(Zepto); (function(d) {
    "__proto__" in {} || d.extend(d.zepto, {
        Z: function(h, o) {
            return h = h || [],
            d.extend(h, d.fn),
            h.selector = o || "",
            h.__Z = !0,
            h
        },
        isZ: function(h) {
            return "array" === d.type(h) && "__Z" in h
        }
    });
    try {
        getComputedStyle(void 0)
    } catch(h) {
        var u = getComputedStyle;
        window.getComputedStyle = function(d) {
            try {
                return u(d)
            } catch(h) {
                return null
            }
        }
    }
})(Zepto); (function(d) {
    d.getScript = function(h, u, i) {
        var o = document.createElement("script"),
        q = d(o);
        o.src = h;
        d("head").append(o);
        q.bind("load", u);
        q.bind("error", i)
    }
})(Zepto); (function(d, h) {
    function u(d) {
        return d.toLowerCase()
    }
    var i = "",
    o, q = window.document.createElement("div"),
    A = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
    v,
    y,
    B,
    D,
    w,
    r,
    x,
    n = {};
    d.each({
        Webkit: "webkit",
        Moz: "",
        O: "o",
        ms: "MS"
    },
    function(d, n) {
        if (q.style[d + "TransitionProperty"] !== h) return i = "-" + u(d) + "-",
        o = n,
        !1
    });
    v = i + "transform";
    n[y = i + "transition-property"] = n[B = i + "transition-duration"] = n[D = i + "transition-timing-function"] = n[w = i + "animation-name"] = n[r = i + "animation-duration"] = n[x = i + "animation-timing-function"] = "";
    d.fx = {
        off: o === h && q.style.transitionProperty === h,
        speeds: {
            _default: 400,
            fast: 200,
            slow: 600
        },
        cssPrefix: i,
        transitionEnd: o ? o + "TransitionEnd": u("TransitionEnd"),
        animationEnd: o ? o + "AnimationEnd": u("AnimationEnd")
    };
    d.fn.animate = function(h, i, m, k) {
        return d.isPlainObject(i) && (m = i.easing, k = i.complete, i = i.duration),
        i && (i = ("number" == typeof i ? i: d.fx.speeds[i] || d.fx.speeds._default) / 1e3),
        this.anim(h, i, m, k)
    };
    d.fn.anim = function(i, o, m, k) {
        var e, t = {},
        q, g = "",
        f = this,
        b, c = d.fx.transitionEnd;
        o === h && (o = .4);
        d.fx.off && (o = 0);
        if ("string" == typeof i) t[w] = i,
        t[r] = o + "s",
        t[x] = m || "linear",
        c = d.fx.animationEnd;
        else {
            q = [];
            for (e in i) A.test(e) ? g += e + "(" + i[e] + ") ": (t[e] = i[e], q.push(u(e.replace(/([a-z])([A-Z])/, "$1-$2"))));
            g && (t[v] = g, q.push(v));
            0 < o && "object" == typeof i && (t[y] = q.join(", "), t[B] = o + "s", t[D] = m || "linear")
        }
        return b = function(e) {
            if ("undefined" != typeof e) {
                if (e.target !== e.currentTarget) return;
                d(e.target).unbind(c, b)
            }
            d(this).css(n);
            k && k.call(this)
        },
        0 < o && this.bind(c, b),
        this.size() && this.get(0),
        this.css(t),
        0 >= o && setTimeout(function() {
            f.each(function() {
                b.call(this)
            })
        },
        0),
        this
    };
    q = null
})(Zepto);
String.prototype.getParam = function(n) {
    var r = new RegExp("[?&]" + n + "=([^&?]*)(\\s||$)", "gi");
    var r1 = new RegExp(n + "=", "gi");
    var m = this.match(r);
    if (m == null) {
        return ""
    } else {
        return typeof m[0].split(r1)[1] == "undefined" ? "": decodeURIComponent(m[0].split(r1)[1])
    }
};