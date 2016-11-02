"use strict";

!(function e(t, n, r) {
  function s(i, u) {
    if (!n[i]) {
      if (!t[i]) {
        var c = "function" == typeof require && require;if (!u && c) return c(i, !0);if (o) return o(i, !0);var a = new Error("Cannot find module '" + i + "'");throw (a.code = "MODULE_NOT_FOUND", a);
      }var f = n[i] = { exports: {} };t[i][0].call(f.exports, function (n) {
        var e = t[i][1][n];return s(e ? e : n);
      }, f, f.exports, e, t, n, r);
    }return n[i].exports;
  }for (var o = "function" == typeof require && require, i = 0; i < r.length; i++) s(r[i]);return s;
})({ 1: [function (t, n, e) {
    (function (n) {
      "use strict";if ((t(189), t(2), n._babelPolyfill)) throw new Error("only one instance of babel-polyfill is allowed");n._babelPolyfill = !0;
    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, { 189: 189, 2: 2 }], 2: [function (t, n, e) {
    n.exports = t(190);
  }, { 190: 190 }], 3: [function (t, n, e) {
    n.exports = function (t) {
      if ("function" != typeof t) throw TypeError(t + " is not a function!");return t;
    };
  }, {}], 4: [function (t, n, e) {
    var r = t(84)("unscopables"),
        o = Array.prototype;void 0 == o[r] && t(32)(o, r, {}), n.exports = function (t) {
      o[r][t] = !0;
    };
  }, { 32: 32, 84: 84 }], 5: [function (t, n, e) {
    var r = t(39);n.exports = function (t) {
      if (!r(t)) throw TypeError(t + " is not an object!");return t;
    };
  }, { 39: 39 }], 6: [function (t, n, e) {
    "use strict";var r = t(81),
        o = t(77),
        i = t(80);n.exports = [].copyWithin || function copyWithin(t, n) {
      var e = r(this),
          u = i(e.length),
          c = o(t, u),
          a = o(n, u),
          s = arguments,
          f = s.length > 2 ? s[2] : void 0,
          l = Math.min((void 0 === f ? u : o(f, u)) - a, u - c),
          h = 1;for (c > a && a + l > c && (h = -1, a += l - 1, c += l - 1); l-- > 0;) a in e ? e[c] = e[a] : delete e[c], c += h, a += h;return e;
    };
  }, { 77: 77, 80: 80, 81: 81 }], 7: [function (t, n, e) {
    "use strict";var r = t(81),
        o = t(77),
        i = t(80);n.exports = [].fill || function fill(t) {
      for (var n = r(this, !0), e = i(n.length), u = arguments, c = u.length, a = o(c > 1 ? u[1] : void 0, e), s = c > 2 ? u[2] : void 0, f = void 0 === s ? e : o(s, e); f > a;) n[a++] = t;return n;
    };
  }, { 77: 77, 80: 80, 81: 81 }], 8: [function (t, n, e) {
    var r = t(79),
        o = t(80),
        i = t(77);n.exports = function (t) {
      return function (n, e, u) {
        var c,
            a = r(n),
            s = o(a.length),
            f = i(u, s);if (t && e != e) {
          for (; s > f;) if ((c = a[f++], c != c)) return !0;
        } else for (; s > f; f++) if ((t || f in a) && a[f] === e) return t || f;return !t && -1;
      };
    };
  }, { 77: 77, 79: 79, 80: 80 }], 9: [function (t, n, e) {
    var r = t(18),
        o = t(35),
        i = t(81),
        u = t(80),
        c = t(10);n.exports = function (t) {
      var n = 1 == t,
          e = 2 == t,
          a = 3 == t,
          s = 4 == t,
          f = 6 == t,
          l = 5 == t || f;return function (h, p, v) {
        for (var g, y, d = i(h), m = o(d), x = r(p, v, 3), S = u(m.length), b = 0, w = n ? c(h, S) : e ? c(h, 0) : void 0; S > b; b++) if ((l || b in m) && (g = m[b], y = x(g, b, d), t)) if (n) w[b] = y;else if (y) switch (t) {case 3:
            return !0;case 5:
            return g;case 6:
            return b;case 2:
            w.push(g);} else if (s) return !1;return f ? -1 : a || s ? s : w;
      };
    };
  }, { 10: 10, 18: 18, 35: 35, 80: 80, 81: 81 }], 10: [function (t, n, e) {
    var r = t(39),
        o = t(37),
        i = t(84)("species");n.exports = function (t, n) {
      var e;return o(t) && (e = t.constructor, "function" != typeof e || e !== Array && !o(e.prototype) || (e = void 0), r(e) && (e = e[i], null === e && (e = void 0))), new (void 0 === e ? Array : e)(n);
    };
  }, { 37: 37, 39: 39, 84: 84 }], 11: [function (t, n, e) {
    var r = t(12),
        o = t(84)("toStringTag"),
        i = "Arguments" == r((function () {
      return arguments;
    })());n.exports = function (t) {
      var n, e, u;return void 0 === t ? "Undefined" : null === t ? "Null" : "string" == typeof (e = (n = Object(t))[o]) ? e : i ? r(n) : "Object" == (u = r(n)) && "function" == typeof n.callee ? "Arguments" : u;
    };
  }, { 12: 12, 84: 84 }], 12: [function (t, n, e) {
    var r = ({}).toString;n.exports = function (t) {
      return r.call(t).slice(8, -1);
    };
  }, {}], 13: [function (t, n, e) {
    "use strict";var r = t(47),
        o = t(32),
        i = t(54),
        u = t(18),
        c = t(70),
        a = t(20),
        s = t(28),
        f = t(43),
        l = t(45),
        h = t(83)("id"),
        p = t(31),
        v = t(39),
        g = t(66),
        y = t(21),
        d = Object.isExtensible || v,
        m = y ? "_s" : "size",
        x = 0,
        S = function S(t, n) {
      if (!v(t)) return "symbol" == typeof t ? t : ("string" == typeof t ? "S" : "P") + t;if (!p(t, h)) {
        if (!d(t)) return "F";if (!n) return "E";o(t, h, ++x);
      }return "O" + t[h];
    },
        b = function b(t, n) {
      var e,
          r = S(n);if ("F" !== r) return t._i[r];for (e = t._f; e; e = e.n) if (e.k == n) return e;
    };n.exports = { getConstructor: function getConstructor(t, n, e, o) {
        var f = t(function (t, i) {
          c(t, f, n), t._i = r.create(null), t._f = void 0, t._l = void 0, t[m] = 0, void 0 != i && s(i, e, t[o], t);
        });return i(f.prototype, { clear: function clear() {
            for (var t = this, n = t._i, e = t._f; e; e = e.n) e.r = !0, e.p && (e.p = e.p.n = void 0), delete n[e.i];t._f = t._l = void 0, t[m] = 0;
          }, "delete": function _delete(t) {
            var n = this,
                e = b(n, t);if (e) {
              var r = e.n,
                  o = e.p;delete n._i[e.i], e.r = !0, o && (o.n = r), r && (r.p = o), n._f == e && (n._f = r), n._l == e && (n._l = o), n[m]--;
            }return !!e;
          }, forEach: function forEach(t) {
            for (var n, e = u(t, arguments.length > 1 ? arguments[1] : void 0, 3); n = n ? n.n : this._f;) for (e(n.v, n.k, this); n && n.r;) n = n.p;
          }, has: function has(t) {
            return !!b(this, t);
          } }), y && r.setDesc(f.prototype, "size", { get: function get() {
            return a(this[m]);
          } }), f;
      }, def: function def(t, n, e) {
        var r,
            o,
            i = b(t, n);return i ? i.v = e : (t._l = i = { i: o = S(n, !0), k: n, v: e, p: r = t._l, n: void 0, r: !1 }, t._f || (t._f = i), r && (r.n = i), t[m]++, "F" !== o && (t._i[o] = i)), t;
      }, getEntry: b, setStrong: function setStrong(t, n, e) {
        f(t, n, function (t, n) {
          this._t = t, this._k = n, this._l = void 0;
        }, function () {
          for (var t = this, n = t._k, e = t._l; e && e.r;) e = e.p;return t._t && (t._l = e = e ? e.n : t._t._f) ? "keys" == n ? l(0, e.k) : "values" == n ? l(0, e.v) : l(0, [e.k, e.v]) : (t._t = void 0, l(1));
        }, e ? "entries" : "values", !e, !0), g(n);
      } };
  }, { 18: 18, 20: 20, 21: 21, 28: 28, 31: 31, 32: 32, 39: 39, 43: 43, 45: 45, 47: 47, 54: 54, 66: 66, 70: 70, 83: 83 }], 14: [function (t, n, e) {
    var r = t(28),
        o = t(11);n.exports = function (t) {
      return function toJSON() {
        if (o(this) != t) throw TypeError(t + "#toJSON isn't generic");var n = [];return r(this, !1, n.push, n), n;
      };
    };
  }, { 11: 11, 28: 28 }], 15: [function (t, n, e) {
    "use strict";var r = t(32),
        o = t(54),
        i = t(5),
        u = t(70),
        c = t(28),
        a = t(9),
        s = t(83)("weak"),
        f = t(39),
        l = t(31),
        h = Object.isExtensible || f,
        p = a(5),
        v = a(6),
        g = 0,
        y = function y(t) {
      return t._l || (t._l = new d());
    },
        d = function d() {
      this.a = [];
    },
        m = function m(t, n) {
      return p(t.a, function (t) {
        return t[0] === n;
      });
    };d.prototype = { get: function get(t) {
        var n = m(this, t);return n ? n[1] : void 0;
      }, has: function has(t) {
        return !!m(this, t);
      }, set: function set(t, n) {
        var e = m(this, t);e ? e[1] = n : this.a.push([t, n]);
      }, "delete": function _delete(t) {
        var n = v(this.a, function (n) {
          return n[0] === t;
        });return ~n && this.a.splice(n, 1), !! ~n;
      } }, n.exports = { getConstructor: function getConstructor(t, n, e, r) {
        var i = t(function (t, o) {
          u(t, i, n), t._i = g++, t._l = void 0, void 0 != o && c(o, e, t[r], t);
        });return o(i.prototype, { "delete": function _delete(t) {
            return f(t) ? h(t) ? l(t, s) && l(t[s], this._i) && delete t[s][this._i] : y(this)["delete"](t) : !1;
          }, has: function has(t) {
            return f(t) ? h(t) ? l(t, s) && l(t[s], this._i) : y(this).has(t) : !1;
          } }), i;
      }, def: function def(t, n, e) {
        return h(i(n)) ? (l(n, s) || r(n, s, {}), n[s][t._i] = e) : y(t).set(n, e), t;
      }, frozenStore: y, WEAK: s };
  }, { 28: 28, 31: 31, 32: 32, 39: 39, 5: 5, 54: 54, 70: 70, 83: 83, 9: 9 }], 16: [function (t, n, e) {
    "use strict";var r = t(30),
        o = t(19),
        i = t(62),
        u = t(54),
        c = t(28),
        a = t(70),
        s = t(39),
        f = t(25),
        l = t(44),
        h = t(67);n.exports = function (t, n, e, p, v, g) {
      var y = r[t],
          d = y,
          m = v ? "set" : "add",
          x = d && d.prototype,
          S = {},
          b = function b(t) {
        var n = x[t];i(x, t, "delete" == t ? function (t) {
          return g && !s(t) ? !1 : n.call(this, 0 === t ? 0 : t);
        } : "has" == t ? function has(t) {
          return g && !s(t) ? !1 : n.call(this, 0 === t ? 0 : t);
        } : "get" == t ? function get(t) {
          return g && !s(t) ? void 0 : n.call(this, 0 === t ? 0 : t);
        } : "add" == t ? function add(t) {
          return n.call(this, 0 === t ? 0 : t), this;
        } : function set(t, e) {
          return n.call(this, 0 === t ? 0 : t, e), this;
        });
      };if ("function" == typeof d && (g || x.forEach && !f(function () {
        new d().entries().next();
      }))) {
        var w,
            E = new d(),
            O = E[m](g ? {} : -0, 1) != E,
            P = f(function () {
          E.has(1);
        }),
            _ = l(function (t) {
          new d(t);
        });_ || (d = n(function (n, e) {
          a(n, d, t);var r = new y();return void 0 != e && c(e, v, r[m], r), r;
        }), d.prototype = x, x.constructor = d), g || E.forEach(function (t, n) {
          w = 1 / n === -(1 / 0);
        }), (P || w) && (b("delete"), b("has"), v && b("get")), (w || O) && b(m), g && x.clear && delete x.clear;
      } else d = p.getConstructor(n, t, v, m), u(d.prototype, e);return h(d, t), S[t] = d, o(o.G + o.W + o.F * (d != y), S), g || p.setStrong(d, t, v), d;
    };
  }, { 19: 19, 25: 25, 28: 28, 30: 30, 39: 39, 44: 44, 54: 54, 62: 62, 67: 67, 70: 70 }], 17: [function (t, n, e) {
    var r = n.exports = { version: "1.2.5" };"number" == typeof __e && (__e = r);
  }, {}], 18: [function (t, n, e) {
    var r = t(3);n.exports = function (t, n, e) {
      if ((r(t), void 0 === n)) return t;switch (e) {case 1:
          return function (e) {
            return t.call(n, e);
          };case 2:
          return function (e, r) {
            return t.call(n, e, r);
          };case 3:
          return function (e, r, o) {
            return t.call(n, e, r, o);
          };}return function () {
        return t.apply(n, arguments);
      };
    };
  }, { 3: 3 }], 19: [function (t, n, e) {
    var r = t(30),
        o = t(17),
        i = t(32),
        u = t(62),
        c = "prototype",
        a = function a(t, n) {
      return function () {
        return t.apply(n, arguments);
      };
    },
        s = function s(t, n, e) {
      var f,
          l,
          h,
          p,
          v = t & s.G,
          g = t & s.P,
          y = v ? r : t & s.S ? r[n] || (r[n] = {}) : (r[n] || {})[c],
          d = v ? o : o[n] || (o[n] = {});v && (e = n);for (f in e) l = !(t & s.F) && y && f in y, h = (l ? y : e)[f], p = t & s.B && l ? a(h, r) : g && "function" == typeof h ? a(Function.call, h) : h, y && !l && u(y, f, h), d[f] != h && i(d, f, p), g && ((d[c] || (d[c] = {}))[f] = h);
    };r.core = o, s.F = 1, s.G = 2, s.S = 4, s.P = 8, s.B = 16, s.W = 32, n.exports = s;
  }, { 17: 17, 30: 30, 32: 32, 62: 62 }], 20: [function (t, n, e) {
    n.exports = function (t) {
      if (void 0 == t) throw TypeError("Can't call method on  " + t);return t;
    };
  }, {}], 21: [function (t, n, e) {
    n.exports = !t(25)(function () {
      return 7 != Object.defineProperty({}, "a", { get: function get() {
          return 7;
        } }).a;
    });
  }, { 25: 25 }], 22: [function (t, n, e) {
    var r = t(39),
        o = t(30).document,
        i = r(o) && r(o.createElement);n.exports = function (t) {
      return i ? o.createElement(t) : {};
    };
  }, { 30: 30, 39: 39 }], 23: [function (t, n, e) {
    var r = t(47);n.exports = function (t) {
      var n = r.getKeys(t),
          e = r.getSymbols;if (e) for (var o, i = e(t), u = r.isEnum, c = 0; i.length > c;) u.call(t, o = i[c++]) && n.push(o);return n;
    };
  }, { 47: 47 }], 24: [function (t, n, e) {
    var r = t(84)("match");n.exports = function (t) {
      var n = /./;try {
        "/./"[t](n);
      } catch (e) {
        try {
          return n[r] = !1, !"/./"[t](n);
        } catch (o) {}
      }return !0;
    };
  }, { 84: 84 }], 25: [function (t, n, e) {
    n.exports = function (t) {
      try {
        return !!t();
      } catch (n) {
        return !0;
      }
    };
  }, {}], 26: [function (t, n, e) {
    "use strict";var r = t(32),
        o = t(62),
        i = t(25),
        u = t(20),
        c = t(84);n.exports = function (t, n, e) {
      var a = c(t),
          s = ""[t];i(function () {
        var n = {};return n[a] = function () {
          return 7;
        }, 7 != ""[t](n);
      }) && (o(String.prototype, t, e(u, a, s)), r(RegExp.prototype, a, 2 == n ? function (t, n) {
        return s.call(t, this, n);
      } : function (t) {
        return s.call(t, this);
      }));
    };
  }, { 20: 20, 25: 25, 32: 32, 62: 62, 84: 84 }], 27: [function (t, n, e) {
    "use strict";var r = t(5);n.exports = function () {
      var t = r(this),
          n = "";return t.global && (n += "g"), t.ignoreCase && (n += "i"), t.multiline && (n += "m"), t.unicode && (n += "u"), t.sticky && (n += "y"), n;
    };
  }, { 5: 5 }], 28: [function (t, n, e) {
    var r = t(18),
        o = t(41),
        i = t(36),
        u = t(5),
        c = t(80),
        a = t(85);n.exports = function (t, n, e, s) {
      var f,
          l,
          h,
          p = a(t),
          v = r(e, s, n ? 2 : 1),
          g = 0;if ("function" != typeof p) throw TypeError(t + " is not iterable!");if (i(p)) for (f = c(t.length); f > g; g++) n ? v(u(l = t[g])[0], l[1]) : v(t[g]);else for (h = p.call(t); !(l = h.next()).done;) o(h, v, l.value, n);
    };
  }, { 18: 18, 36: 36, 41: 41, 5: 5, 80: 80, 85: 85 }], 29: [function (t, n, e) {
    var r = ({}).toString,
        o = t(79),
        i = t(47).getNames,
        u = "object" == typeof window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [],
        c = function c(t) {
      try {
        return i(t);
      } catch (n) {
        return u.slice();
      }
    };n.exports.get = function getOwnPropertyNames(t) {
      return u && "[object Window]" == r.call(t) ? c(t) : i(o(t));
    };
  }, { 47: 47, 79: 79 }], 30: [function (t, n, e) {
    var r = n.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();"number" == typeof __g && (__g = r);
  }, {}], 31: [function (t, n, e) {
    var r = ({}).hasOwnProperty;n.exports = function (t, n) {
      return r.call(t, n);
    };
  }, {}], 32: [function (t, n, e) {
    var r = t(47),
        o = t(61);n.exports = t(21) ? function (t, n, e) {
      return r.setDesc(t, n, o(1, e));
    } : function (t, n, e) {
      return t[n] = e, t;
    };
  }, { 21: 21, 47: 47, 61: 61 }], 33: [function (t, n, e) {
    n.exports = t(30).document && document.documentElement;
  }, { 30: 30 }], 34: [function (t, n, e) {
    n.exports = function (t, n, e) {
      var r = void 0 === e;switch (n.length) {case 0:
          return r ? t() : t.call(e);case 1:
          return r ? t(n[0]) : t.call(e, n[0]);case 2:
          return r ? t(n[0], n[1]) : t.call(e, n[0], n[1]);case 3:
          return r ? t(n[0], n[1], n[2]) : t.call(e, n[0], n[1], n[2]);case 4:
          return r ? t(n[0], n[1], n[2], n[3]) : t.call(e, n[0], n[1], n[2], n[3]);}return t.apply(e, n);
    };
  }, {}], 35: [function (t, n, e) {
    var r = t(12);n.exports = Object("z").propertyIsEnumerable(0) ? Object : function (t) {
      return "String" == r(t) ? t.split("") : Object(t);
    };
  }, { 12: 12 }], 36: [function (t, n, e) {
    var r = t(46),
        o = t(84)("iterator"),
        i = Array.prototype;n.exports = function (t) {
      return (r.Array || i[o]) === t;
    };
  }, { 46: 46, 84: 84 }], 37: [function (t, n, e) {
    var r = t(12);n.exports = Array.isArray || function (t) {
      return "Array" == r(t);
    };
  }, { 12: 12 }], 38: [function (t, n, e) {
    var r = t(39),
        o = Math.floor;n.exports = function isInteger(t) {
      return !r(t) && isFinite(t) && o(t) === t;
    };
  }, { 39: 39 }], 39: [function (t, n, e) {
    n.exports = function (t) {
      return "object" == typeof t ? null !== t : "function" == typeof t;
    };
  }, {}], 40: [function (t, n, e) {
    var r = t(39),
        o = t(12),
        i = t(84)("match");n.exports = function (t) {
      var n;return r(t) && (void 0 !== (n = t[i]) ? !!n : "RegExp" == o(t));
    };
  }, { 12: 12, 39: 39, 84: 84 }], 41: [function (t, n, e) {
    var r = t(5);n.exports = function (t, n, e, o) {
      try {
        return o ? n(r(e)[0], e[1]) : n(e);
      } catch (i) {
        var u = t["return"];throw (void 0 !== u && r(u.call(t)), i);
      }
    };
  }, { 5: 5 }], 42: [function (t, n, e) {
    "use strict";var r = t(47),
        o = t(61),
        i = t(67),
        u = {};t(32)(u, t(84)("iterator"), function () {
      return this;
    }), n.exports = function (t, n, e) {
      t.prototype = r.create(u, { next: o(1, e) }), i(t, n + " Iterator");
    };
  }, { 32: 32, 47: 47, 61: 61, 67: 67, 84: 84 }], 43: [function (t, n, e) {
    "use strict";var r = t(49),
        o = t(19),
        i = t(62),
        u = t(32),
        c = t(31),
        a = t(84)("iterator"),
        s = t(46),
        f = t(42),
        l = t(67),
        h = t(47).getProto,
        p = !([].keys && "next" in [].keys()),
        v = "@@iterator",
        g = "keys",
        y = "values",
        d = function d() {
      return this;
    };n.exports = function (t, n, e, m, x, S, b) {
      f(e, n, m);var w,
          E,
          O = function O(t) {
        if (!p && t in _) return _[t];switch (t) {case g:
            return function keys() {
              return new e(this, t);
            };case y:
            return function values() {
              return new e(this, t);
            };}return function entries() {
          return new e(this, t);
        };
      },
          P = n + " Iterator",
          _ = t.prototype,
          M = _[a] || _[v] || x && _[x],
          F = M || O(x);if (M) {
        var A = h(F.call(new t()));l(A, P, !0), !r && c(_, v) && u(A, a, d);
      }if ((r && !b || !p && a in _ || u(_, a, F), s[n] = F, s[P] = d, x)) if ((w = { values: x == y ? F : O(y), keys: S ? F : O(g), entries: x != y ? F : O("entries") }, b)) for (E in w) E in _ || i(_, E, w[E]);else o(o.P + o.F * p, n, w);return w;
    };
  }, { 19: 19, 31: 31, 32: 32, 42: 42, 46: 46, 47: 47, 49: 49, 62: 62, 67: 67, 84: 84 }], 44: [function (t, n, e) {
    var r = t(84)("iterator"),
        o = !1;try {
      var i = [7][r]();i["return"] = function () {
        o = !0;
      }, Array.from(i, function () {
        throw 2;
      });
    } catch (u) {}n.exports = function (t, n) {
      if (!n && !o) return !1;var e = !1;try {
        var i = [7],
            u = i[r]();u.next = function () {
          e = !0;
        }, i[r] = function () {
          return u;
        }, t(i);
      } catch (c) {}return e;
    };
  }, { 84: 84 }], 45: [function (t, n, e) {
    n.exports = function (t, n) {
      return { value: n, done: !!t };
    };
  }, {}], 46: [function (t, n, e) {
    n.exports = {};
  }, {}], 47: [function (t, n, e) {
    var r = Object;n.exports = { create: r.create, getProto: r.getPrototypeOf, isEnum: ({}).propertyIsEnumerable, getDesc: r.getOwnPropertyDescriptor, setDesc: r.defineProperty, setDescs: r.defineProperties, getKeys: r.keys, getNames: r.getOwnPropertyNames, getSymbols: r.getOwnPropertySymbols, each: [].forEach };
  }, {}], 48: [function (t, n, e) {
    var r = t(47),
        o = t(79);n.exports = function (t, n) {
      for (var e, i = o(t), u = r.getKeys(i), c = u.length, a = 0; c > a;) if (i[e = u[a++]] === n) return e;
    };
  }, { 47: 47, 79: 79 }], 49: [function (t, n, e) {
    n.exports = !1;
  }, {}], 50: [function (t, n, e) {
    n.exports = Math.expm1 || function expm1(t) {
      return 0 == (t = +t) ? t : t > -1e-6 && 1e-6 > t ? t + t * t / 2 : Math.exp(t) - 1;
    };
  }, {}], 51: [function (t, n, e) {
    n.exports = Math.log1p || function log1p(t) {
      return (t = +t) > -1e-8 && 1e-8 > t ? t - t * t / 2 : Math.log(1 + t);
    };
  }, {}], 52: [function (t, n, e) {
    n.exports = Math.sign || function sign(t) {
      return 0 == (t = +t) || t != t ? t : 0 > t ? -1 : 1;
    };
  }, {}], 53: [function (t, n, e) {
    var r,
        o,
        i,
        u = t(30),
        c = t(76).set,
        a = u.MutationObserver || u.WebKitMutationObserver,
        s = u.process,
        f = "process" == t(12)(s),
        l = function l() {
      var t, n;for (f && (t = s.domain) && (s.domain = null, t.exit()); r;) n = r.domain, n && n.enter(), r.fn.call(), n && n.exit(), r = r.next;o = void 0, t && t.enter();
    };if (f) i = function () {
      s.nextTick(l);
    };else if (a) {
      var h = 1,
          p = document.createTextNode("");new a(l).observe(p, { characterData: !0 }), i = function () {
        p.data = h = -h;
      };
    } else i = function () {
      c.call(u, l);
    };n.exports = function asap(t) {
      var n = { fn: t, next: void 0, domain: f && s.domain };o && (o.next = n), r || (r = n, i()), o = n;
    };
  }, { 12: 12, 30: 30, 76: 76 }], 54: [function (t, n, e) {
    var r = t(62);n.exports = function (t, n) {
      for (var e in n) r(t, e, n[e]);return t;
    };
  }, { 62: 62 }], 55: [function (t, n, e) {
    var r = t(47),
        o = t(81),
        i = t(35);n.exports = t(25)(function () {
      var t = Object.assign,
          n = {},
          e = {},
          r = Symbol(),
          o = "abcdefghijklmnopqrst";return n[r] = 7, o.split("").forEach(function (t) {
        e[t] = t;
      }), 7 != t({}, n)[r] || Object.keys(t({}, e)).join("") != o;
    }) ? function assign(t, n) {
      for (var e = o(t), u = arguments, c = u.length, a = 1, s = r.getKeys, f = r.getSymbols, l = r.isEnum; c > a;) for (var h, p = i(u[a++]), v = f ? s(p).concat(f(p)) : s(p), g = v.length, y = 0; g > y;) l.call(p, h = v[y++]) && (e[h] = p[h]);return e;
    } : Object.assign;
  }, { 25: 25, 35: 35, 47: 47, 81: 81 }], 56: [function (t, n, e) {
    var r = (t(19), t(17)),
        o = t(25);n.exports = function (n, e) {
      var i = t(19),
          u = (r.Object || {})[n] || Object[n],
          c = {};c[n] = e(u), i(i.S + i.F * o(function () {
        u(1);
      }), "Object", c);
    };
  }, { 17: 17, 19: 19, 25: 25 }], 57: [function (t, n, e) {
    var r = t(47),
        o = t(79),
        i = r.isEnum;n.exports = function (t) {
      return function (n) {
        for (var e, u = o(n), c = r.getKeys(u), a = c.length, s = 0, f = []; a > s;) i.call(u, e = c[s++]) && f.push(t ? [e, u[e]] : u[e]);return f;
      };
    };
  }, { 47: 47, 79: 79 }], 58: [function (t, n, e) {
    var r = t(47),
        o = t(5),
        i = t(30).Reflect;n.exports = i && i.ownKeys || function ownKeys(t) {
      var n = r.getNames(o(t)),
          e = r.getSymbols;return e ? n.concat(e(t)) : n;
    };
  }, { 30: 30, 47: 47, 5: 5 }], 59: [function (t, n, e) {
    "use strict";var r = t(60),
        o = t(34),
        i = t(3);n.exports = function () {
      for (var t = i(this), n = arguments.length, e = Array(n), u = 0, c = r._, a = !1; n > u;) (e[u] = arguments[u++]) === c && (a = !0);return function () {
        var r,
            i = this,
            u = arguments,
            s = u.length,
            f = 0,
            l = 0;if (!a && !s) return o(t, e, i);if ((r = e.slice(), a)) for (; n > f; f++) r[f] === c && (r[f] = u[l++]);for (; s > l;) r.push(u[l++]);return o(t, r, i);
      };
    };
  }, { 3: 3, 34: 34, 60: 60 }], 60: [function (t, n, e) {
    n.exports = t(30);
  }, { 30: 30 }], 61: [function (t, n, e) {
    n.exports = function (t, n) {
      return { enumerable: !(1 & t), configurable: !(2 & t), writable: !(4 & t), value: n };
    };
  }, {}], 62: [function (t, n, e) {
    var r = t(30),
        o = t(32),
        i = t(83)("src"),
        u = "toString",
        c = Function[u],
        a = ("" + c).split(u);t(17).inspectSource = function (t) {
      return c.call(t);
    }, (n.exports = function (t, n, e, u) {
      "function" == typeof e && (e.hasOwnProperty(i) || o(e, i, t[n] ? "" + t[n] : a.join(String(n))), e.hasOwnProperty("name") || o(e, "name", n)), t === r ? t[n] = e : (u || delete t[n], o(t, n, e));
    })(Function.prototype, u, function toString() {
      return "function" == typeof this && this[i] || c.call(this);
    });
  }, { 17: 17, 30: 30, 32: 32, 83: 83 }], 63: [function (t, n, e) {
    n.exports = function (t, n) {
      var e = n === Object(n) ? function (t) {
        return n[t];
      } : n;return function (n) {
        return String(n).replace(t, e);
      };
    };
  }, {}], 64: [function (t, n, e) {
    n.exports = Object.is || function is(t, n) {
      return t === n ? 0 !== t || 1 / t === 1 / n : t != t && n != n;
    };
  }, {}], 65: [function (t, n, e) {
    var r = t(47).getDesc,
        o = t(39),
        i = t(5),
        u = function u(t, n) {
      if ((i(t), !o(n) && null !== n)) throw TypeError(n + ": can't set as prototype!");
    };n.exports = { set: Object.setPrototypeOf || ("__proto__" in {} ? (function (n, e, o) {
        try {
          o = t(18)(Function.call, r(Object.prototype, "__proto__").set, 2), o(n, []), e = !(n instanceof Array);
        } catch (i) {
          e = !0;
        }return function setPrototypeOf(t, n) {
          return u(t, n), e ? t.__proto__ = n : o(t, n), t;
        };
      })({}, !1) : void 0), check: u };
  }, { 18: 18, 39: 39, 47: 47, 5: 5 }], 66: [function (t, n, e) {
    "use strict";var r = t(30),
        o = t(47),
        i = t(21),
        u = t(84)("species");n.exports = function (t) {
      var n = r[t];i && n && !n[u] && o.setDesc(n, u, { configurable: !0, get: function get() {
          return this;
        } });
    };
  }, { 21: 21, 30: 30, 47: 47, 84: 84 }], 67: [function (t, n, e) {
    var r = t(47).setDesc,
        o = t(31),
        i = t(84)("toStringTag");n.exports = function (t, n, e) {
      t && !o(t = e ? t : t.prototype, i) && r(t, i, { configurable: !0, value: n });
    };
  }, { 31: 31, 47: 47, 84: 84 }], 68: [function (t, n, e) {
    var r = t(30),
        o = "__core-js_shared__",
        i = r[o] || (r[o] = {});n.exports = function (t) {
      return i[t] || (i[t] = {});
    };
  }, { 30: 30 }], 69: [function (t, n, e) {
    var r = t(5),
        o = t(3),
        i = t(84)("species");n.exports = function (t, n) {
      var e,
          u = r(t).constructor;return void 0 === u || void 0 == (e = r(u)[i]) ? n : o(e);
    };
  }, { 3: 3, 5: 5, 84: 84 }], 70: [function (t, n, e) {
    n.exports = function (t, n, e) {
      if (!(t instanceof n)) throw TypeError(e + ": use the 'new' operator!");return t;
    };
  }, {}], 71: [function (t, n, e) {
    var r = t(78),
        o = t(20);n.exports = function (t) {
      return function (n, e) {
        var i,
            u,
            c = String(o(n)),
            a = r(e),
            s = c.length;return 0 > a || a >= s ? t ? "" : void 0 : (i = c.charCodeAt(a), 55296 > i || i > 56319 || a + 1 === s || (u = c.charCodeAt(a + 1)) < 56320 || u > 57343 ? t ? c.charAt(a) : i : t ? c.slice(a, a + 2) : (i - 55296 << 10) + (u - 56320) + 65536);
      };
    };
  }, { 20: 20, 78: 78 }], 72: [function (t, n, e) {
    var r = t(40),
        o = t(20);n.exports = function (t, n, e) {
      if (r(n)) throw TypeError("String#" + e + " doesn't accept regex!");return String(o(t));
    };
  }, { 20: 20, 40: 40 }], 73: [function (t, n, e) {
    var r = t(80),
        o = t(74),
        i = t(20);n.exports = function (t, n, e, u) {
      var c = String(i(t)),
          a = c.length,
          s = void 0 === e ? " " : String(e),
          f = r(n);if (a >= f) return c;"" == s && (s = " ");var l = f - a,
          h = o.call(s, Math.ceil(l / s.length));return h.length > l && (h = h.slice(0, l)), u ? h + c : c + h;
    };
  }, { 20: 20, 74: 74, 80: 80 }], 74: [function (t, n, e) {
    "use strict";var r = t(78),
        o = t(20);n.exports = function repeat(t) {
      var n = String(o(this)),
          e = "",
          i = r(t);if (0 > i || i == 1 / 0) throw RangeError("Count can't be negative");for (; i > 0; (i >>>= 1) && (n += n)) 1 & i && (e += n);return e;
    };
  }, { 20: 20, 78: 78 }], 75: [function (t, n, e) {
    var r = t(19),
        o = t(20),
        i = t(25),
        u = "\t\n\u000b\f\r   ᠎             　\u2028\u2029﻿",
        c = "[" + u + "]",
        a = "​",
        s = RegExp("^" + c + c + "*"),
        f = RegExp(c + c + "*$"),
        l = function l(t, n) {
      var e = {};e[t] = n(h), r(r.P + r.F * i(function () {
        return !!u[t]() || a[t]() != a;
      }), "String", e);
    },
        h = l.trim = function (t, n) {
      return t = String(o(t)), 1 & n && (t = t.replace(s, "")), 2 & n && (t = t.replace(f, "")), t;
    };n.exports = l;
  }, { 19: 19, 20: 20, 25: 25 }], 76: [function (t, n, e) {
    "use strict";var r,
        o,
        i,
        u = t(18),
        c = t(34),
        a = t(33),
        s = t(22),
        f = t(30),
        l = f.process,
        h = f.setImmediate,
        p = f.clearImmediate,
        v = f.MessageChannel,
        g = 0,
        y = {},
        d = "onreadystatechange",
        m = function m() {
      var t = +this;if (y.hasOwnProperty(t)) {
        var n = y[t];delete y[t], n();
      }
    },
        x = function x(t) {
      m.call(t.data);
    };h && p || (h = function setImmediate(t) {
      for (var n = [], e = 1; arguments.length > e;) n.push(arguments[e++]);return y[++g] = function () {
        c("function" == typeof t ? t : Function(t), n);
      }, r(g), g;
    }, p = function clearImmediate(t) {
      delete y[t];
    }, "process" == t(12)(l) ? r = function (t) {
      l.nextTick(u(m, t, 1));
    } : v ? (o = new v(), i = o.port2, o.port1.onmessage = x, r = u(i.postMessage, i, 1)) : f.addEventListener && "function" == typeof postMessage && !f.importScripts ? (r = function (t) {
      f.postMessage(t + "", "*");
    }, f.addEventListener("message", x, !1)) : r = d in s("script") ? function (t) {
      a.appendChild(s("script"))[d] = function () {
        a.removeChild(this), m.call(t);
      };
    } : function (t) {
      setTimeout(u(m, t, 1), 0);
    }), n.exports = { set: h, clear: p };
  }, { 12: 12, 18: 18, 22: 22, 30: 30, 33: 33, 34: 34 }], 77: [function (t, n, e) {
    var r = t(78),
        o = Math.max,
        i = Math.min;n.exports = function (t, n) {
      return t = r(t), 0 > t ? o(t + n, 0) : i(t, n);
    };
  }, { 78: 78 }], 78: [function (t, n, e) {
    var r = Math.ceil,
        o = Math.floor;n.exports = function (t) {
      return isNaN(t = +t) ? 0 : (t > 0 ? o : r)(t);
    };
  }, {}], 79: [function (t, n, e) {
    var r = t(35),
        o = t(20);n.exports = function (t) {
      return r(o(t));
    };
  }, { 20: 20, 35: 35 }], 80: [function (t, n, e) {
    var r = t(78),
        o = Math.min;n.exports = function (t) {
      return t > 0 ? o(r(t), 9007199254740991) : 0;
    };
  }, { 78: 78 }], 81: [function (t, n, e) {
    var r = t(20);n.exports = function (t) {
      return Object(r(t));
    };
  }, { 20: 20 }], 82: [function (t, n, e) {
    var r = t(39);n.exports = function (t, n) {
      if (!r(t)) return t;var e, o;if (n && "function" == typeof (e = t.toString) && !r(o = e.call(t))) return o;if ("function" == typeof (e = t.valueOf) && !r(o = e.call(t))) return o;if (!n && "function" == typeof (e = t.toString) && !r(o = e.call(t))) return o;throw TypeError("Can't convert object to primitive value");
    };
  }, { 39: 39 }], 83: [function (t, n, e) {
    var r = 0,
        o = Math.random();n.exports = function (t) {
      return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++r + o).toString(36));
    };
  }, {}], 84: [function (t, n, e) {
    var r = t(68)("wks"),
        o = t(83),
        i = t(30).Symbol;n.exports = function (t) {
      return r[t] || (r[t] = i && i[t] || (i || o)("Symbol." + t));
    };
  }, { 30: 30, 68: 68, 83: 83 }], 85: [function (t, n, e) {
    var r = t(11),
        o = t(84)("iterator"),
        i = t(46);n.exports = t(17).getIteratorMethod = function (t) {
      return void 0 != t ? t[o] || t["@@iterator"] || i[r(t)] : void 0;
    };
  }, { 11: 11, 17: 17, 46: 46, 84: 84 }], 86: [function (t, n, e) {
    "use strict";var r,
        o = t(47),
        i = t(21),
        u = t(61),
        c = t(33),
        a = t(22),
        s = t(31),
        f = t(12),
        l = t(19),
        h = t(34),
        p = t(9),
        v = t(83)("__proto__"),
        g = t(39),
        y = t(5),
        d = t(3),
        m = t(81),
        x = t(79),
        S = t(78),
        b = t(77),
        w = t(80),
        E = t(35),
        O = t(25),
        P = Object.prototype,
        _ = [],
        M = _.slice,
        F = _.join,
        A = o.setDesc,
        j = o.getDesc,
        N = o.setDescs,
        I = t(8)(!1),
        k = {};i || (r = !O(function () {
      return 7 != A(a("div"), "a", { get: function get() {
          return 7;
        } }).a;
    }), o.setDesc = function (t, n, e) {
      if (r) try {
        return A(t, n, e);
      } catch (o) {}if ("get" in e || "set" in e) throw TypeError("Accessors not supported!");return "value" in e && (y(t)[n] = e.value), t;
    }, o.getDesc = function (t, n) {
      if (r) try {
        return j(t, n);
      } catch (e) {}return s(t, n) ? u(!P.propertyIsEnumerable.call(t, n), t[n]) : void 0;
    }, o.setDescs = N = function (t, n) {
      y(t);for (var e, r = o.getKeys(n), i = r.length, u = 0; i > u;) o.setDesc(t, e = r[u++], n[e]);return t;
    }), l(l.S + l.F * !i, "Object", { getOwnPropertyDescriptor: o.getDesc, defineProperty: o.setDesc, defineProperties: N });var D = "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),
        T = D.concat("length", "prototype"),
        L = D.length,
        _R = function R() {
      var t,
          n = a("iframe"),
          e = L,
          r = ">";for (n.style.display = "none", c.appendChild(n), n.src = "javascript:", t = n.contentWindow.document, t.open(), t.write("<script>document.F=Object</script" + r), t.close(), _R = t.F; e--;) delete _R.prototype[D[e]];return _R();
    },
        C = function C(t, n) {
      return function (e) {
        var r,
            o = x(e),
            i = 0,
            u = [];for (r in o) r != v && s(o, r) && u.push(r);for (; n > i;) s(o, r = t[i++]) && (~I(u, r) || u.push(r));return u;
      };
    },
        G = function G() {};l(l.S, "Object", { getPrototypeOf: o.getProto = o.getProto || function (t) {
        return t = m(t), s(t, v) ? t[v] : "function" == typeof t.constructor && t instanceof t.constructor ? t.constructor.prototype : t instanceof Object ? P : null;
      }, getOwnPropertyNames: o.getNames = o.getNames || C(T, T.length, !0), create: o.create = o.create || function (t, n) {
        var e;return null !== t ? (G.prototype = y(t), e = new G(), G.prototype = null, e[v] = t) : e = _R(), void 0 === n ? e : N(e, n);
      }, keys: o.getKeys = o.getKeys || C(D, L, !1) });var W = function W(t, n, e) {
      if (!(n in k)) {
        for (var r = [], o = 0; n > o; o++) r[o] = "a[" + o + "]";k[n] = Function("F,a", "return new F(" + r.join(",") + ")");
      }return k[n](t, e);
    };l(l.P, "Function", { bind: function bind(t) {
        var n = d(this),
            e = M.call(arguments, 1),
            r = function r() {
          var o = e.concat(M.call(arguments));return this instanceof r ? W(n, o.length, o) : h(n, o, t);
        };return g(n.prototype) && (r.prototype = n.prototype), r;
      } });var z = O(function () {
      c && M.call(c);
    });l(l.P + l.F * z, "Array", { slice: function slice(t, n) {
        var e = w(this.length),
            r = f(this);if ((n = void 0 === n ? e : n, "Array" == r)) return M.call(this, t, n);for (var o = b(t, e), i = b(n, e), u = w(i - o), c = Array(u), a = 0; u > a; a++) c[a] = "String" == r ? this.charAt(o + a) : this[o + a];return c;
      } }), l(l.P + l.F * (E != Object), "Array", { join: function join() {
        return F.apply(E(this), arguments);
      } }), l(l.S, "Array", { isArray: t(37) });var K = function K(t) {
      return function (n, e) {
        d(n);var r = E(this),
            o = w(r.length),
            i = t ? o - 1 : 0,
            u = t ? -1 : 1;if (arguments.length < 2) for (;;) {
          if (i in r) {
            e = r[i], i += u;break;
          }if ((i += u, t ? 0 > i : i >= o)) throw TypeError("Reduce of empty array with no initial value");
        }for (; t ? i >= 0 : o > i; i += u) i in r && (e = n(e, r[i], i, this));return e;
      };
    },
        U = function U(t) {
      return function (n) {
        return t(this, n, arguments[1]);
      };
    };l(l.P, "Array", { forEach: o.each = o.each || U(p(0)), map: U(p(1)), filter: U(p(2)), some: U(p(3)), every: U(p(4)), reduce: K(!1), reduceRight: K(!0), indexOf: U(I), lastIndexOf: function lastIndexOf(t, n) {
        var e = x(this),
            r = w(e.length),
            o = r - 1;for (arguments.length > 1 && (o = Math.min(o, S(n))), 0 > o && (o = w(r + o)); o >= 0; o--) if (o in e && e[o] === t) return o;return -1;
      } }), l(l.S, "Date", { now: function now() {
        return +new Date();
      } });var q = function q(t) {
      return t > 9 ? t : "0" + t;
    },
        J = new Date(-5e13 - 1),
        B = !(J.toISOString && "0385-07-25T07:06:39.999Z" == J.toISOString() && O(function () {
      new Date(NaN).toISOString();
    }));l(l.P + l.F * B, "Date", { toISOString: function toISOString() {
        if (!isFinite(this)) throw RangeError("Invalid time value");var t = this,
            n = t.getUTCFullYear(),
            e = t.getUTCMilliseconds(),
            r = 0 > n ? "-" : n > 9999 ? "+" : "";return r + ("00000" + Math.abs(n)).slice(r ? -6 : -4) + "-" + q(t.getUTCMonth() + 1) + "-" + q(t.getUTCDate()) + "T" + q(t.getUTCHours()) + ":" + q(t.getUTCMinutes()) + ":" + q(t.getUTCSeconds()) + "." + (e > 99 ? e : "0" + q(e)) + "Z";
      } });
  }, { 12: 12, 19: 19, 21: 21, 22: 22, 25: 25, 3: 3, 31: 31, 33: 33, 34: 34, 35: 35, 37: 37, 39: 39, 47: 47, 5: 5, 61: 61, 77: 77, 78: 78, 79: 79, 8: 8, 80: 80, 81: 81, 83: 83, 9: 9 }], 87: [function (t, n, e) {
    "use strict";var r = t(19);r(r.P, "Array", { copyWithin: t(6) }), t(4)("copyWithin");
  }, { 19: 19, 4: 4, 6: 6 }], 88: [function (t, n, e) {
    var r = t(19);r(r.P, "Array", { fill: t(7) }), t(4)("fill");
  }, { 19: 19, 4: 4, 7: 7 }], 89: [function (t, n, e) {
    "use strict";var r = "findIndex",
        o = t(19),
        i = !0,
        u = t(9)(6);r in [] && Array(1)[r](function () {
      i = !1;
    }), o(o.P + o.F * i, "Array", { findIndex: function findIndex(t) {
        return u(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), t(4)(r);
  }, { 19: 19, 4: 4, 9: 9 }], 90: [function (t, n, e) {
    "use strict";var r = "find",
        o = t(19),
        i = !0,
        u = t(9)(5);r in [] && Array(1)[r](function () {
      i = !1;
    }), o(o.P + o.F * i, "Array", { find: function find(t) {
        return u(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), t(4)(r);
  }, { 19: 19, 4: 4, 9: 9 }], 91: [function (t, n, e) {
    "use strict";var r = t(18),
        o = t(19),
        i = t(81),
        u = t(41),
        c = t(36),
        a = t(80),
        s = t(85);o(o.S + o.F * !t(44)(function (t) {
      Array.from(t);
    }), "Array", { from: function from(t) {
        var n,
            e,
            o,
            f,
            l = i(t),
            h = "function" == typeof this ? this : Array,
            p = arguments,
            v = p.length,
            g = v > 1 ? p[1] : void 0,
            y = void 0 !== g,
            d = 0,
            m = s(l);if ((y && (g = r(g, v > 2 ? p[2] : void 0, 2)), void 0 == m || h == Array && c(m))) for (n = a(l.length), e = new h(n); n > d; d++) e[d] = y ? g(l[d], d) : l[d];else for (f = m.call(l), e = new h(); !(o = f.next()).done; d++) e[d] = y ? u(f, g, [o.value, d], !0) : o.value;return e.length = d, e;
      } });
  }, { 18: 18, 19: 19, 36: 36, 41: 41, 44: 44, 80: 80, 81: 81, 85: 85 }], 92: [function (t, n, e) {
    "use strict";var r = t(4),
        o = t(45),
        i = t(46),
        u = t(79);n.exports = t(43)(Array, "Array", function (t, n) {
      this._t = u(t), this._i = 0, this._k = n;
    }, function () {
      var t = this._t,
          n = this._k,
          e = this._i++;return !t || e >= t.length ? (this._t = void 0, o(1)) : "keys" == n ? o(0, e) : "values" == n ? o(0, t[e]) : o(0, [e, t[e]]);
    }, "values"), i.Arguments = i.Array, r("keys"), r("values"), r("entries");
  }, { 4: 4, 43: 43, 45: 45, 46: 46, 79: 79 }], 93: [function (t, n, e) {
    "use strict";var r = t(19);r(r.S + r.F * t(25)(function () {
      function F() {}return !(Array.of.call(F) instanceof F);
    }), "Array", { of: function of() {
        for (var t = 0, n = arguments, e = n.length, r = new ("function" == typeof this ? this : Array)(e); e > t;) r[t] = n[t++];return r.length = e, r;
      } });
  }, { 19: 19, 25: 25 }], 94: [function (t, n, e) {
    t(66)("Array");
  }, { 66: 66 }], 95: [function (t, n, e) {
    "use strict";var r = t(47),
        o = t(39),
        i = t(84)("hasInstance"),
        u = Function.prototype;i in u || r.setDesc(u, i, { value: function value(t) {
        if ("function" != typeof this || !o(t)) return !1;if (!o(this.prototype)) return t instanceof this;for (; t = r.getProto(t);) if (this.prototype === t) return !0;return !1;
      } });
  }, { 39: 39, 47: 47, 84: 84 }], 96: [function (t, n, e) {
    var r = t(47).setDesc,
        o = t(61),
        i = t(31),
        u = Function.prototype,
        c = /^\s*function ([^ (]*)/,
        a = "name";a in u || t(21) && r(u, a, { configurable: !0, get: function get() {
        var t = ("" + this).match(c),
            n = t ? t[1] : "";return i(this, a) || r(this, a, o(5, n)), n;
      } });
  }, { 21: 21, 31: 31, 47: 47, 61: 61 }], 97: [function (t, n, e) {
    "use strict";var r = t(13);t(16)("Map", function (t) {
      return function Map() {
        return t(this, arguments.length > 0 ? arguments[0] : void 0);
      };
    }, { get: function get(t) {
        var n = r.getEntry(this, t);return n && n.v;
      }, set: function set(t, n) {
        return r.def(this, 0 === t ? 0 : t, n);
      } }, r, !0);
  }, { 13: 13, 16: 16 }], 98: [function (t, n, e) {
    var r = t(19),
        o = t(51),
        i = Math.sqrt,
        u = Math.acosh;r(r.S + r.F * !(u && 710 == Math.floor(u(Number.MAX_VALUE))), "Math", { acosh: function acosh(t) {
        return (t = +t) < 1 ? NaN : t > 94906265.62425156 ? Math.log(t) + Math.LN2 : o(t - 1 + i(t - 1) * i(t + 1));
      } });
  }, { 19: 19, 51: 51 }], 99: [function (t, n, e) {
    function asinh(t) {
      return isFinite(t = +t) && 0 != t ? 0 > t ? -asinh(-t) : Math.log(t + Math.sqrt(t * t + 1)) : t;
    }var r = t(19);r(r.S, "Math", { asinh: asinh });
  }, { 19: 19 }], 100: [function (t, n, e) {
    var r = t(19);r(r.S, "Math", { atanh: function atanh(t) {
        return 0 == (t = +t) ? t : Math.log((1 + t) / (1 - t)) / 2;
      } });
  }, { 19: 19 }], 101: [function (t, n, e) {
    var r = t(19),
        o = t(52);r(r.S, "Math", { cbrt: function cbrt(t) {
        return o(t = +t) * Math.pow(Math.abs(t), 1 / 3);
      } });
  }, { 19: 19, 52: 52 }], 102: [function (t, n, e) {
    var r = t(19);r(r.S, "Math", { clz32: function clz32(t) {
        return (t >>>= 0) ? 31 - Math.floor(Math.log(t + .5) * Math.LOG2E) : 32;
      } });
  }, { 19: 19 }], 103: [function (t, n, e) {
    var r = t(19),
        o = Math.exp;r(r.S, "Math", { cosh: function cosh(t) {
        return (o(t = +t) + o(-t)) / 2;
      } });
  }, { 19: 19 }], 104: [function (t, n, e) {
    var r = t(19);r(r.S, "Math", { expm1: t(50) });
  }, { 19: 19, 50: 50 }], 105: [function (t, n, e) {
    var r = t(19),
        o = t(52),
        i = Math.pow,
        u = i(2, -52),
        c = i(2, -23),
        a = i(2, 127) * (2 - c),
        s = i(2, -126),
        f = function f(t) {
      return t + 1 / u - 1 / u;
    };r(r.S, "Math", { fround: function fround(t) {
        var n,
            e,
            r = Math.abs(t),
            i = o(t);return s > r ? i * f(r / s / c) * s * c : (n = (1 + c / u) * r, e = n - (n - r), e > a || e != e ? i * (1 / 0) : i * e);
      } });
  }, { 19: 19, 52: 52 }], 106: [function (t, n, e) {
    var r = t(19),
        o = Math.abs;r(r.S, "Math", { hypot: function hypot(t, n) {
        for (var e, r, i = 0, u = 0, c = arguments, a = c.length, s = 0; a > u;) e = o(c[u++]), e > s ? (r = s / e, i = i * r * r + 1, s = e) : e > 0 ? (r = e / s, i += r * r) : i += e;return s === 1 / 0 ? 1 / 0 : s * Math.sqrt(i);
      } });
  }, { 19: 19 }], 107: [function (t, n, e) {
    var r = t(19),
        o = Math.imul;r(r.S + r.F * t(25)(function () {
      return -5 != o(4294967295, 5) || 2 != o.length;
    }), "Math", { imul: function imul(t, n) {
        var e = 65535,
            r = +t,
            o = +n,
            i = e & r,
            u = e & o;return 0 | i * u + ((e & r >>> 16) * u + i * (e & o >>> 16) << 16 >>> 0);
      } });
  }, { 19: 19, 25: 25 }], 108: [function (t, n, e) {
    var r = t(19);r(r.S, "Math", { log10: function log10(t) {
        return Math.log(t) / Math.LN10;
      } });
  }, { 19: 19 }], 109: [function (t, n, e) {
    var r = t(19);r(r.S, "Math", { log1p: t(51) });
  }, { 19: 19, 51: 51 }], 110: [function (t, n, e) {
    var r = t(19);r(r.S, "Math", { log2: function log2(t) {
        return Math.log(t) / Math.LN2;
      } });
  }, { 19: 19 }], 111: [function (t, n, e) {
    var r = t(19);r(r.S, "Math", { sign: t(52) });
  }, { 19: 19, 52: 52 }], 112: [function (t, n, e) {
    var r = t(19),
        o = t(50),
        i = Math.exp;r(r.S + r.F * t(25)(function () {
      return -2e-17 != !Math.sinh(-2e-17);
    }), "Math", { sinh: function sinh(t) {
        return Math.abs(t = +t) < 1 ? (o(t) - o(-t)) / 2 : (i(t - 1) - i(-t - 1)) * (Math.E / 2);
      } });
  }, { 19: 19, 25: 25, 50: 50 }], 113: [function (t, n, e) {
    var r = t(19),
        o = t(50),
        i = Math.exp;r(r.S, "Math", { tanh: function tanh(t) {
        var n = o(t = +t),
            e = o(-t);return n == 1 / 0 ? 1 : e == 1 / 0 ? -1 : (n - e) / (i(t) + i(-t));
      } });
  }, { 19: 19, 50: 50 }], 114: [function (t, n, e) {
    var r = t(19);r(r.S, "Math", { trunc: function trunc(t) {
        return (t > 0 ? Math.floor : Math.ceil)(t);
      } });
  }, { 19: 19 }], 115: [function (t, n, e) {
    "use strict";var r = t(47),
        o = t(30),
        i = t(31),
        u = t(12),
        c = t(82),
        a = t(25),
        s = t(75).trim,
        f = "Number",
        l = o[f],
        h = l,
        p = l.prototype,
        v = u(r.create(p)) == f,
        g = ("trim" in String.prototype),
        y = function y(t) {
      var n = c(t, !1);if ("string" == typeof n && n.length > 2) {
        n = g ? n.trim() : s(n, 3);var e,
            r,
            o,
            i = n.charCodeAt(0);if (43 === i || 45 === i) {
          if ((e = n.charCodeAt(2), 88 === e || 120 === e)) return NaN;
        } else if (48 === i) {
          switch (n.charCodeAt(1)) {case 66:case 98:
              r = 2, o = 49;break;case 79:case 111:
              r = 8, o = 55;break;default:
              return +n;}for (var u, a = n.slice(2), f = 0, l = a.length; l > f; f++) if ((u = a.charCodeAt(f), 48 > u || u > o)) return NaN;return parseInt(a, r);
        }
      }return +n;
    };l(" 0o1") && l("0b1") && !l("+0x1") || (l = function Number(t) {
      var n = arguments.length < 1 ? 0 : t,
          e = this;return e instanceof l && (v ? a(function () {
        p.valueOf.call(e);
      }) : u(e) != f) ? new h(y(n)) : y(n);
    }, r.each.call(t(21) ? r.getNames(h) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","), function (t) {
      i(h, t) && !i(l, t) && r.setDesc(l, t, r.getDesc(h, t));
    }), l.prototype = p, p.constructor = l, t(62)(o, f, l));
  }, { 12: 12, 21: 21, 25: 25, 30: 30, 31: 31, 47: 47, 62: 62, 75: 75, 82: 82 }], 116: [function (t, n, e) {
    var r = t(19);r(r.S, "Number", { EPSILON: Math.pow(2, -52) });
  }, { 19: 19 }], 117: [function (t, n, e) {
    var r = t(19),
        o = t(30).isFinite;r(r.S, "Number", { isFinite: function isFinite(t) {
        return "number" == typeof t && o(t);
      } });
  }, { 19: 19, 30: 30 }], 118: [function (t, n, e) {
    var r = t(19);r(r.S, "Number", { isInteger: t(38) });
  }, { 19: 19, 38: 38 }], 119: [function (t, n, e) {
    var r = t(19);r(r.S, "Number", { isNaN: function isNaN(t) {
        return t != t;
      } });
  }, { 19: 19 }], 120: [function (t, n, e) {
    var r = t(19),
        o = t(38),
        i = Math.abs;r(r.S, "Number", { isSafeInteger: function isSafeInteger(t) {
        return o(t) && i(t) <= 9007199254740991;
      } });
  }, { 19: 19, 38: 38 }], 121: [function (t, n, e) {
    var r = t(19);r(r.S, "Number", { MAX_SAFE_INTEGER: 9007199254740991 });
  }, { 19: 19 }], 122: [function (t, n, e) {
    var r = t(19);r(r.S, "Number", { MIN_SAFE_INTEGER: -9007199254740991 });
  }, { 19: 19 }], 123: [function (t, n, e) {
    var r = t(19);r(r.S, "Number", { parseFloat: parseFloat });
  }, { 19: 19 }], 124: [function (t, n, e) {
    var r = t(19);r(r.S, "Number", { parseInt: parseInt });
  }, { 19: 19 }], 125: [function (t, n, e) {
    var r = t(19);r(r.S + r.F, "Object", { assign: t(55) });
  }, { 19: 19, 55: 55 }], 126: [function (t, n, e) {
    var r = t(39);t(56)("freeze", function (t) {
      return function freeze(n) {
        return t && r(n) ? t(n) : n;
      };
    });
  }, { 39: 39, 56: 56 }], 127: [function (t, n, e) {
    var r = t(79);t(56)("getOwnPropertyDescriptor", function (t) {
      return function getOwnPropertyDescriptor(n, e) {
        return t(r(n), e);
      };
    });
  }, { 56: 56, 79: 79 }], 128: [function (t, n, e) {
    t(56)("getOwnPropertyNames", function () {
      return t(29).get;
    });
  }, { 29: 29, 56: 56 }], 129: [function (t, n, e) {
    var r = t(81);t(56)("getPrototypeOf", function (t) {
      return function getPrototypeOf(n) {
        return t(r(n));
      };
    });
  }, { 56: 56, 81: 81 }], 130: [function (t, n, e) {
    var r = t(39);t(56)("isExtensible", function (t) {
      return function isExtensible(n) {
        return r(n) ? t ? t(n) : !0 : !1;
      };
    });
  }, { 39: 39, 56: 56 }], 131: [function (t, n, e) {
    var r = t(39);t(56)("isFrozen", function (t) {
      return function isFrozen(n) {
        return r(n) ? t ? t(n) : !1 : !0;
      };
    });
  }, { 39: 39, 56: 56 }], 132: [function (t, n, e) {
    var r = t(39);t(56)("isSealed", function (t) {
      return function isSealed(n) {
        return r(n) ? t ? t(n) : !1 : !0;
      };
    });
  }, { 39: 39, 56: 56 }], 133: [function (t, n, e) {
    var r = t(19);r(r.S, "Object", { is: t(64) });
  }, { 19: 19, 64: 64 }], 134: [function (t, n, e) {
    var r = t(81);t(56)("keys", function (t) {
      return function keys(n) {
        return t(r(n));
      };
    });
  }, { 56: 56, 81: 81 }], 135: [function (t, n, e) {
    var r = t(39);t(56)("preventExtensions", function (t) {
      return function preventExtensions(n) {
        return t && r(n) ? t(n) : n;
      };
    });
  }, { 39: 39, 56: 56 }], 136: [function (t, n, e) {
    var r = t(39);t(56)("seal", function (t) {
      return function seal(n) {
        return t && r(n) ? t(n) : n;
      };
    });
  }, { 39: 39, 56: 56 }], 137: [function (t, n, e) {
    var r = t(19);r(r.S, "Object", { setPrototypeOf: t(65).set });
  }, { 19: 19, 65: 65 }], 138: [function (t, n, e) {
    "use strict";var r = t(11),
        o = {};o[t(84)("toStringTag")] = "z", o + "" != "[object z]" && t(62)(Object.prototype, "toString", function toString() {
      return "[object " + r(this) + "]";
    }, !0);
  }, { 11: 11, 62: 62, 84: 84 }], 139: [function (t, n, e) {
    "use strict";var r,
        o = t(47),
        i = t(49),
        u = t(30),
        c = t(18),
        a = t(11),
        s = t(19),
        f = t(39),
        l = t(5),
        h = t(3),
        p = t(70),
        v = t(28),
        g = t(65).set,
        y = t(64),
        d = t(84)("species"),
        m = t(69),
        x = t(83)("record"),
        S = t(53),
        b = "Promise",
        w = u.process,
        E = "process" == a(w),
        O = u[b],
        P = function P(t) {
      var n = new O(function () {});return t && (n.constructor = Object), O.resolve(n) === n;
    },
        _ = (function () {
      function P2(t) {
        var n = new O(t);return g(n, P2.prototype), n;
      }var n = !1;try {
        if ((n = O && O.resolve && P(), g(P2, O), P2.prototype = o.create(O.prototype, { constructor: { value: P2 } }), P2.resolve(5).then(function () {}) instanceof P2 || (n = !1), n && t(21))) {
          var e = !1;O.resolve(o.setDesc({}, "then", { get: function get() {
              e = !0;
            } })), n = e;
        }
      } catch (r) {
        n = !1;
      }return n;
    })(),
        M = function M(t) {
      return f(t) && (_ ? "Promise" == a(t) : x in t);
    },
        F = function F(t, n) {
      return i && t === O && n === r ? !0 : y(t, n);
    },
        A = function A(t) {
      var n = l(t)[d];return void 0 != n ? n : t;
    },
        j = function j(t) {
      var n;return f(t) && "function" == typeof (n = t.then) ? n : !1;
    },
        N = function N(t, n) {
      if (!t.n) {
        t.n = !0;var e = t.c;S(function () {
          for (var r = t.v, o = 1 == t.s, i = 0, c = function c(n) {
            var e,
                i,
                u = o ? n.ok : n.fail;try {
              u ? (o || (t.h = !0), e = u === !0 ? r : u(r), e === n.P ? n.rej(TypeError("Promise-chain cycle")) : (i = j(e)) ? i.call(e, n.res, n.rej) : n.res(e)) : n.rej(r);
            } catch (c) {
              n.rej(c);
            }
          }; e.length > i;) c(e[i++]);e.length = 0, t.n = !1, n && setTimeout(function () {
            var n,
                e,
                o = t.p;I(o) && (E ? w.emit("unhandledRejection", r, o) : (n = u.onunhandledrejection) ? n({ promise: o, reason: r }) : (e = u.console) && e.error && e.error("Unhandled promise rejection", r)), t.a = void 0;
          }, 1);
        });
      }
    },
        I = function I(t) {
      var n,
          e = t[x],
          r = e.a || e.c,
          o = 0;if (e.h) return !1;for (; r.length > o;) if ((n = r[o++], n.fail || !I(n.P))) return !1;return !0;
    },
        k = function k(t) {
      var n = this;n.d || (n.d = !0, n = n.r || n, n.v = t, n.s = 2, n.a = n.c.slice(), N(n, !0));
    },
        D = function D(t) {
      var n,
          e = this;if (!e.d) {
        e.d = !0, e = e.r || e;try {
          (n = j(t)) ? S(function () {
            var r = { r: e, d: !1 };try {
              n.call(t, c(D, r, 1), c(k, r, 1));
            } catch (o) {
              k.call(r, o);
            }
          }) : (e.v = t, e.s = 1, N(e, !1));
        } catch (r) {
          k.call({ r: e, d: !1 }, r);
        }
      }
    };_ || (O = function Promise(t) {
      h(t);var n = { p: p(this, O, b), c: [], a: void 0, s: 0, d: !1, v: void 0, h: !1, n: !1 };this[x] = n;try {
        t(c(D, n, 1), c(k, n, 1));
      } catch (e) {
        k.call(n, e);
      }
    }, t(54)(O.prototype, { then: function then(t, n) {
        var e = { ok: "function" == typeof t ? t : !0, fail: "function" == typeof n ? n : !1 },
            r = e.P = new (m(this, O))(function (t, n) {
          e.res = t, e.rej = n;
        });h(e.res), h(e.rej);var o = this[x];return o.c.push(e), o.a && o.a.push(e), o.s && N(o, !1), r;
      }, "catch": function _catch(t) {
        return this.then(void 0, t);
      } })), s(s.G + s.W + s.F * !_, { Promise: O }), t(67)(O, b), t(66)(b), r = t(17)[b], s(s.S + s.F * !_, b, { reject: function reject(t) {
        return new this(function (n, e) {
          e(t);
        });
      } }), s(s.S + s.F * (!_ || P(!0)), b, { resolve: function resolve(t) {
        return M(t) && F(t.constructor, this) ? t : new this(function (n) {
          n(t);
        });
      } }), s(s.S + s.F * !(_ && t(44)(function (t) {
      O.all(t)["catch"](function () {});
    })), b, { all: function all(t) {
        var n = A(this),
            e = [];return new n(function (r, i) {
          v(t, !1, e.push, e);var u = e.length,
              c = Array(u);u ? o.each.call(e, function (t, e) {
            n.resolve(t).then(function (t) {
              c[e] = t, --u || r(c);
            }, i);
          }) : r(c);
        });
      }, race: function race(t) {
        var n = A(this);return new n(function (e, r) {
          v(t, !1, function (t) {
            n.resolve(t).then(e, r);
          });
        });
      } });
  }, { 11: 11, 17: 17, 18: 18, 19: 19, 21: 21, 28: 28, 3: 3, 30: 30, 39: 39, 44: 44, 47: 47, 49: 49, 5: 5, 53: 53, 54: 54, 64: 64, 65: 65, 66: 66, 67: 67, 69: 69, 70: 70, 83: 83, 84: 84 }], 140: [function (t, n, e) {
    var r = t(19),
        o = Function.apply;r(r.S, "Reflect", { apply: function apply(t, n, e) {
        return o.call(t, n, e);
      } });
  }, { 19: 19 }], 141: [function (t, n, e) {
    var r = t(47),
        o = t(19),
        i = t(3),
        u = t(5),
        c = t(39),
        a = Function.bind || t(17).Function.prototype.bind;o(o.S + o.F * t(25)(function () {
      function F() {}return !(Reflect.construct(function () {}, [], F) instanceof F);
    }), "Reflect", { construct: function construct(t, n) {
        i(t);var e = arguments.length < 3 ? t : i(arguments[2]);if (t == e) {
          if (void 0 != n) switch (u(n).length) {case 0:
              return new t();case 1:
              return new t(n[0]);case 2:
              return new t(n[0], n[1]);case 3:
              return new t(n[0], n[1], n[2]);case 4:
              return new t(n[0], n[1], n[2], n[3]);}var o = [null];return o.push.apply(o, n), new (a.apply(t, o))();
        }var s = e.prototype,
            f = r.create(c(s) ? s : Object.prototype),
            l = Function.apply.call(t, f, n);return c(l) ? l : f;
      } });
  }, { 17: 17, 19: 19, 25: 25, 3: 3, 39: 39, 47: 47, 5: 5 }], 142: [function (t, n, e) {
    var r = t(47),
        o = t(19),
        i = t(5);o(o.S + o.F * t(25)(function () {
      Reflect.defineProperty(r.setDesc({}, 1, { value: 1 }), 1, { value: 2 });
    }), "Reflect", { defineProperty: function defineProperty(t, n, e) {
        i(t);try {
          return r.setDesc(t, n, e), !0;
        } catch (o) {
          return !1;
        }
      } });
  }, { 19: 19, 25: 25, 47: 47, 5: 5 }], 143: [function (t, n, e) {
    var r = t(19),
        o = t(47).getDesc,
        i = t(5);r(r.S, "Reflect", { deleteProperty: function deleteProperty(t, n) {
        var e = o(i(t), n);return e && !e.configurable ? !1 : delete t[n];
      } });
  }, { 19: 19, 47: 47, 5: 5 }], 144: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(5),
        i = function i(t) {
      this._t = o(t), this._i = 0;var n,
          e = this._k = [];for (n in t) e.push(n);
    };t(42)(i, "Object", function () {
      var t,
          n = this,
          e = n._k;do if (n._i >= e.length) return { value: void 0, done: !0 }; while (!((t = e[n._i++]) in n._t));return { value: t, done: !1 };
    }), r(r.S, "Reflect", { enumerate: function enumerate(t) {
        return new i(t);
      } });
  }, { 19: 19, 42: 42, 5: 5 }], 145: [function (t, n, e) {
    var r = t(47),
        o = t(19),
        i = t(5);o(o.S, "Reflect", { getOwnPropertyDescriptor: function getOwnPropertyDescriptor(t, n) {
        return r.getDesc(i(t), n);
      } });
  }, { 19: 19, 47: 47, 5: 5 }], 146: [function (t, n, e) {
    var r = t(19),
        o = t(47).getProto,
        i = t(5);r(r.S, "Reflect", { getPrototypeOf: function getPrototypeOf(t) {
        return o(i(t));
      } });
  }, { 19: 19, 47: 47, 5: 5 }], 147: [function (t, n, e) {
    function get(_x, _x2) {
      var _arguments = arguments;
      var _again = true;

      _function: while (_again) {
        var t = _x,
            n = _x2;
        _again = false;
        var e,
            i,
            a = _arguments.length < 3 ? t : _arguments[2];if (c(t) === a) {
          return t[n];
        } else {
          if (e = r.getDesc(t, n)) {
            return o(e, "value") ? e.value : void 0 !== e.get ? e.get.call(a) : void 0;
          } else {
            if (u(i = r.getProto(t))) {
              _arguments = [_x = i, _x2 = n, a];
              _again = true;
              e = i = a = undefined;
              continue _function;
            } else {
              return void 0;
            }
          }
        }
      }
    }var r = t(47),
        o = t(31),
        i = t(19),
        u = t(39),
        c = t(5);i(i.S, "Reflect", { get: get });
  }, { 19: 19, 31: 31, 39: 39, 47: 47, 5: 5 }], 148: [function (t, n, e) {
    var r = t(19);r(r.S, "Reflect", { has: function has(t, n) {
        return n in t;
      } });
  }, { 19: 19 }], 149: [function (t, n, e) {
    var r = t(19),
        o = t(5),
        i = Object.isExtensible;r(r.S, "Reflect", { isExtensible: function isExtensible(t) {
        return o(t), i ? i(t) : !0;
      } });
  }, { 19: 19, 5: 5 }], 150: [function (t, n, e) {
    var r = t(19);r(r.S, "Reflect", { ownKeys: t(58) });
  }, { 19: 19, 58: 58 }], 151: [function (t, n, e) {
    var r = t(19),
        o = t(5),
        i = Object.preventExtensions;r(r.S, "Reflect", { preventExtensions: function preventExtensions(t) {
        o(t);try {
          return i && i(t), !0;
        } catch (n) {
          return !1;
        }
      } });
  }, { 19: 19, 5: 5 }], 152: [function (t, n, e) {
    var r = t(19),
        o = t(65);o && r(r.S, "Reflect", { setPrototypeOf: function setPrototypeOf(t, n) {
        o.check(t, n);try {
          return o.set(t, n), !0;
        } catch (e) {
          return !1;
        }
      } });
  }, { 19: 19, 65: 65 }], 153: [function (t, n, e) {
    function set(_x3, _x4, _x5) {
      var _arguments2 = arguments;
      var _again2 = true;

      _function2: while (_again2) {
        var t = _x3,
            n = _x4,
            e = _x5;
        _again2 = false;
        var i,
            s,
            f = _arguments2.length < 4 ? t : _arguments2[3],
            l = r.getDesc(c(t), n);if (!l) {
          if (a(s = r.getProto(t))) {
            _arguments2 = [_x3 = s, _x4 = n, _x5 = e, f];
            _again2 = true;
            i = s = f = l = undefined;
            continue _function2;
          }l = u(0);
        }return o(l, "value") ? l.writable !== !1 && a(f) ? (i = r.getDesc(f, n) || u(0), i.value = e, r.setDesc(f, n, i), !0) : !1 : void 0 === l.set ? !1 : (l.set.call(f, e), !0);
      }
    }var r = t(47),
        o = t(31),
        i = t(19),
        u = t(61),
        c = t(5),
        a = t(39);i(i.S, "Reflect", { set: set });
  }, { 19: 19, 31: 31, 39: 39, 47: 47, 5: 5, 61: 61 }], 154: [function (t, n, e) {
    var r = t(47),
        o = t(30),
        i = t(40),
        u = t(27),
        c = o.RegExp,
        a = c,
        s = c.prototype,
        f = /a/g,
        l = /a/g,
        h = new c(f) !== f;!t(21) || h && !t(25)(function () {
      return l[t(84)("match")] = !1, c(f) != f || c(l) == l || "/a/i" != c(f, "i");
    }) || (c = function RegExp(t, n) {
      var e = i(t),
          r = void 0 === n;return this instanceof c || !e || t.constructor !== c || !r ? h ? new a(e && !r ? t.source : t, n) : a((e = t instanceof c) ? t.source : t, e && r ? u.call(t) : n) : t;
    }, r.each.call(r.getNames(a), function (t) {
      t in c || r.setDesc(c, t, { configurable: !0, get: function get() {
          return a[t];
        }, set: function set(n) {
          a[t] = n;
        } });
    }), s.constructor = c, c.prototype = s, t(62)(o, "RegExp", c)), t(66)("RegExp");
  }, { 21: 21, 25: 25, 27: 27, 30: 30, 40: 40, 47: 47, 62: 62, 66: 66, 84: 84 }], 155: [function (t, n, e) {
    var r = t(47);t(21) && "g" != /./g.flags && r.setDesc(RegExp.prototype, "flags", { configurable: !0, get: t(27) });
  }, { 21: 21, 27: 27, 47: 47 }], 156: [function (t, n, e) {
    t(26)("match", 1, function (t, n) {
      return function match(e) {
        "use strict";var r = t(this),
            o = void 0 == e ? void 0 : e[n];return void 0 !== o ? o.call(e, r) : new RegExp(e)[n](String(r));
      };
    });
  }, { 26: 26 }], 157: [function (t, n, e) {
    t(26)("replace", 2, function (t, n, e) {
      return function replace(r, o) {
        "use strict";var i = t(this),
            u = void 0 == r ? void 0 : r[n];return void 0 !== u ? u.call(r, i, o) : e.call(String(i), r, o);
      };
    });
  }, { 26: 26 }], 158: [function (t, n, e) {
    t(26)("search", 1, function (t, n) {
      return function search(e) {
        "use strict";var r = t(this),
            o = void 0 == e ? void 0 : e[n];return void 0 !== o ? o.call(e, r) : new RegExp(e)[n](String(r));
      };
    });
  }, { 26: 26 }], 159: [function (t, n, e) {
    t(26)("split", 2, function (t, n, e) {
      return function split(r, o) {
        "use strict";var i = t(this),
            u = void 0 == r ? void 0 : r[n];return void 0 !== u ? u.call(r, i, o) : e.call(String(i), r, o);
      };
    });
  }, { 26: 26 }], 160: [function (t, n, e) {
    "use strict";var r = t(13);t(16)("Set", function (t) {
      return function Set() {
        return t(this, arguments.length > 0 ? arguments[0] : void 0);
      };
    }, { add: function add(t) {
        return r.def(this, t = 0 === t ? 0 : t, t);
      } }, r);
  }, { 13: 13, 16: 16 }], 161: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(71)(!1);r(r.P, "String", { codePointAt: function codePointAt(t) {
        return o(this, t);
      } });
  }, { 19: 19, 71: 71 }], 162: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(80),
        i = t(72),
        u = "endsWith",
        c = ""[u];r(r.P + r.F * t(24)(u), "String", { endsWith: function endsWith(t) {
        var n = i(this, t, u),
            e = arguments,
            r = e.length > 1 ? e[1] : void 0,
            a = o(n.length),
            s = void 0 === r ? a : Math.min(o(r), a),
            f = String(t);return c ? c.call(n, f, s) : n.slice(s - f.length, s) === f;
      } });
  }, { 19: 19, 24: 24, 72: 72, 80: 80 }], 163: [function (t, n, e) {
    var r = t(19),
        o = t(77),
        i = String.fromCharCode,
        u = String.fromCodePoint;r(r.S + r.F * (!!u && 1 != u.length), "String", { fromCodePoint: function fromCodePoint(t) {
        for (var n, e = [], r = arguments, u = r.length, c = 0; u > c;) {
          if ((n = +r[c++], o(n, 1114111) !== n)) throw RangeError(n + " is not a valid code point");e.push(65536 > n ? i(n) : i(((n -= 65536) >> 10) + 55296, n % 1024 + 56320));
        }return e.join("");
      } });
  }, { 19: 19, 77: 77 }], 164: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(72),
        i = "includes";r(r.P + r.F * t(24)(i), "String", { includes: function includes(t) {
        return !! ~o(this, t, i).indexOf(t, arguments.length > 1 ? arguments[1] : void 0);
      } });
  }, { 19: 19, 24: 24, 72: 72 }], 165: [function (t, n, e) {
    "use strict";var r = t(71)(!0);t(43)(String, "String", function (t) {
      this._t = String(t), this._i = 0;
    }, function () {
      var t,
          n = this._t,
          e = this._i;return e >= n.length ? { value: void 0, done: !0 } : (t = r(n, e), this._i += t.length, { value: t, done: !1 });
    });
  }, { 43: 43, 71: 71 }], 166: [function (t, n, e) {
    var r = t(19),
        o = t(79),
        i = t(80);r(r.S, "String", { raw: function raw(t) {
        for (var n = o(t.raw), e = i(n.length), r = arguments, u = r.length, c = [], a = 0; e > a;) c.push(String(n[a++])), u > a && c.push(String(r[a]));return c.join("");
      } });
  }, { 19: 19, 79: 79, 80: 80 }], 167: [function (t, n, e) {
    var r = t(19);r(r.P, "String", { repeat: t(74) });
  }, { 19: 19, 74: 74 }], 168: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(80),
        i = t(72),
        u = "startsWith",
        c = ""[u];r(r.P + r.F * t(24)(u), "String", { startsWith: function startsWith(t) {
        var n = i(this, t, u),
            e = arguments,
            r = o(Math.min(e.length > 1 ? e[1] : void 0, n.length)),
            a = String(t);return c ? c.call(n, a, r) : n.slice(r, r + a.length) === a;
      } });
  }, { 19: 19, 24: 24, 72: 72, 80: 80 }], 169: [function (t, n, e) {
    "use strict";t(75)("trim", function (t) {
      return function trim() {
        return t(this, 3);
      };
    });
  }, { 75: 75 }], 170: [function (t, n, e) {
    "use strict";var r = t(47),
        o = t(30),
        i = t(31),
        u = t(21),
        c = t(19),
        a = t(62),
        s = t(25),
        f = t(68),
        l = t(67),
        h = t(83),
        p = t(84),
        v = t(48),
        g = t(29),
        y = t(23),
        d = t(37),
        m = t(5),
        x = t(79),
        S = t(61),
        b = r.getDesc,
        w = r.setDesc,
        E = r.create,
        O = g.get,
        P = o.Symbol,
        _ = o.JSON,
        M = _ && _.stringify,
        F = !1,
        A = p("_hidden"),
        j = r.isEnum,
        N = f("symbol-registry"),
        I = f("symbols"),
        k = "function" == typeof P,
        D = Object.prototype,
        T = u && s(function () {
      return 7 != E(w({}, "a", { get: function get() {
          return w(this, "a", { value: 7 }).a;
        } })).a;
    }) ? function (t, n, e) {
      var r = b(D, n);r && delete D[n], w(t, n, e), r && t !== D && w(D, n, r);
    } : w,
        L = function L(t) {
      var n = I[t] = E(P.prototype);return n._k = t, u && F && T(D, t, { configurable: !0, set: function set(n) {
          i(this, A) && i(this[A], t) && (this[A][t] = !1), T(this, t, S(1, n));
        } }), n;
    },
        R = function R(t) {
      return "symbol" == typeof t;
    },
        C = function defineProperty(t, n, e) {
      return e && i(I, n) ? (e.enumerable ? (i(t, A) && t[A][n] && (t[A][n] = !1), e = E(e, { enumerable: S(0, !1) })) : (i(t, A) || w(t, A, S(1, {})), t[A][n] = !0), T(t, n, e)) : w(t, n, e);
    },
        G = function defineProperties(t, n) {
      m(t);for (var e, r = y(n = x(n)), o = 0, i = r.length; i > o;) C(t, e = r[o++], n[e]);return t;
    },
        W = function create(t, n) {
      return void 0 === n ? E(t) : G(E(t), n);
    },
        z = function propertyIsEnumerable(t) {
      var n = j.call(this, t);return n || !i(this, t) || !i(I, t) || i(this, A) && this[A][t] ? n : !0;
    },
        K = function getOwnPropertyDescriptor(t, n) {
      var e = b(t = x(t), n);return !e || !i(I, n) || i(t, A) && t[A][n] || (e.enumerable = !0), e;
    },
        U = function getOwnPropertyNames(t) {
      for (var n, e = O(x(t)), r = [], o = 0; e.length > o;) i(I, n = e[o++]) || n == A || r.push(n);return r;
    },
        q = function getOwnPropertySymbols(t) {
      for (var n, e = O(x(t)), r = [], o = 0; e.length > o;) i(I, n = e[o++]) && r.push(I[n]);return r;
    },
        J = function stringify(t) {
      if (void 0 !== t && !R(t)) {
        for (var n, e, r = [t], o = 1, i = arguments; i.length > o;) r.push(i[o++]);return n = r[1], "function" == typeof n && (e = n), (e || !d(n)) && (n = function (t, n) {
          return e && (n = e.call(this, t, n)), R(n) ? void 0 : n;
        }), r[1] = n, M.apply(_, r);
      }
    },
        B = s(function () {
      var t = P();return "[null]" != M([t]) || "{}" != M({ a: t }) || "{}" != M(Object(t));
    });k || (P = function Symbol() {
      if (R(this)) throw TypeError("Symbol is not a constructor");return L(h(arguments.length > 0 ? arguments[0] : void 0));
    }, a(P.prototype, "toString", function toString() {
      return this._k;
    }), R = function (t) {
      return t instanceof P;
    }, r.create = W, r.isEnum = z, r.getDesc = K, r.setDesc = C, r.setDescs = G, r.getNames = g.get = U, r.getSymbols = q, u && !t(49) && a(D, "propertyIsEnumerable", z, !0));var V = { "for": function _for(t) {
        return i(N, t += "") ? N[t] : N[t] = P(t);
      }, keyFor: function keyFor(t) {
        return v(N, t);
      }, useSetter: function useSetter() {
        F = !0;
      }, useSimple: function useSimple() {
        F = !1;
      } };r.each.call("hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","), function (t) {
      var n = p(t);V[t] = k ? n : L(n);
    }), F = !0, c(c.G + c.W, { Symbol: P }), c(c.S, "Symbol", V), c(c.S + c.F * !k, "Object", { create: W, defineProperty: C, defineProperties: G, getOwnPropertyDescriptor: K, getOwnPropertyNames: U, getOwnPropertySymbols: q }), _ && c(c.S + c.F * (!k || B), "JSON", { stringify: J }), l(P, "Symbol"), l(Math, "Math", !0), l(o.JSON, "JSON", !0);
  }, { 19: 19, 21: 21, 23: 23, 25: 25, 29: 29, 30: 30, 31: 31, 37: 37, 47: 47, 48: 48, 49: 49, 5: 5, 61: 61, 62: 62, 67: 67, 68: 68, 79: 79, 83: 83, 84: 84 }], 171: [function (t, n, e) {
    "use strict";var r = t(47),
        o = t(62),
        i = t(15),
        u = t(39),
        c = t(31),
        a = i.frozenStore,
        s = i.WEAK,
        f = Object.isExtensible || u,
        l = {},
        h = t(16)("WeakMap", function (t) {
      return function WeakMap() {
        return t(this, arguments.length > 0 ? arguments[0] : void 0);
      };
    }, { get: function get(t) {
        if (u(t)) {
          if (!f(t)) return a(this).get(t);if (c(t, s)) return t[s][this._i];
        }
      }, set: function set(t, n) {
        return i.def(this, t, n);
      } }, i, !0, !0);7 != new h().set((Object.freeze || Object)(l), 7).get(l) && r.each.call(["delete", "has", "get", "set"], function (t) {
      var n = h.prototype,
          e = n[t];o(n, t, function (n, r) {
        if (u(n) && !f(n)) {
          var o = a(this)[t](n, r);return "set" == t ? this : o;
        }return e.call(this, n, r);
      });
    });
  }, { 15: 15, 16: 16, 31: 31, 39: 39, 47: 47, 62: 62 }], 172: [function (t, n, e) {
    "use strict";var r = t(15);t(16)("WeakSet", function (t) {
      return function WeakSet() {
        return t(this, arguments.length > 0 ? arguments[0] : void 0);
      };
    }, { add: function add(t) {
        return r.def(this, t, !0);
      } }, r, !1, !0);
  }, { 15: 15, 16: 16 }], 173: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(8)(!0);r(r.P, "Array", { includes: function includes(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : void 0);
      } }), t(4)("includes");
  }, { 19: 19, 4: 4, 8: 8 }], 174: [function (t, n, e) {
    var r = t(19);r(r.P, "Map", { toJSON: t(14)("Map") });
  }, { 14: 14, 19: 19 }], 175: [function (t, n, e) {
    var r = t(19),
        o = t(57)(!0);r(r.S, "Object", { entries: function entries(t) {
        return o(t);
      } });
  }, { 19: 19, 57: 57 }], 176: [function (t, n, e) {
    var r = t(47),
        o = t(19),
        i = t(58),
        u = t(79),
        c = t(61);o(o.S, "Object", { getOwnPropertyDescriptors: function getOwnPropertyDescriptors(t) {
        for (var n, e, o = u(t), a = r.setDesc, s = r.getDesc, f = i(o), l = {}, h = 0; f.length > h;) e = s(o, n = f[h++]), n in l ? a(l, n, c(0, e)) : l[n] = e;return l;
      } });
  }, { 19: 19, 47: 47, 58: 58, 61: 61, 79: 79 }], 177: [function (t, n, e) {
    var r = t(19),
        o = t(57)(!1);r(r.S, "Object", { values: function values(t) {
        return o(t);
      } });
  }, { 19: 19, 57: 57 }], 178: [function (t, n, e) {
    var r = t(19),
        o = t(63)(/[\\^$*+?.()|[\]{}]/g, "\\$&");r(r.S, "RegExp", { escape: function escape(t) {
        return o(t);
      } });
  }, { 19: 19, 63: 63 }], 179: [function (t, n, e) {
    var r = t(19);r(r.P, "Set", { toJSON: t(14)("Set") });
  }, { 14: 14, 19: 19 }], 180: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(71)(!0);r(r.P, "String", { at: function at(t) {
        return o(this, t);
      } });
  }, { 19: 19, 71: 71 }], 181: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(73);r(r.P, "String", { padLeft: function padLeft(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : void 0, !0);
      } });
  }, { 19: 19, 73: 73 }], 182: [function (t, n, e) {
    "use strict";var r = t(19),
        o = t(73);r(r.P, "String", { padRight: function padRight(t) {
        return o(this, t, arguments.length > 1 ? arguments[1] : void 0, !1);
      } });
  }, { 19: 19, 73: 73 }], 183: [function (t, n, e) {
    "use strict";t(75)("trimLeft", function (t) {
      return function trimLeft() {
        return t(this, 1);
      };
    });
  }, { 75: 75 }], 184: [function (t, n, e) {
    "use strict";t(75)("trimRight", function (t) {
      return function trimRight() {
        return t(this, 2);
      };
    });
  }, { 75: 75 }], 185: [function (t, n, e) {
    var r = t(47),
        o = t(19),
        i = t(18),
        u = t(17).Array || Array,
        c = {},
        a = function a(t, n) {
      r.each.call(t.split(","), function (t) {
        void 0 == n && t in u ? c[t] = u[t] : t in [] && (c[t] = i(Function.call, [][t], n));
      });
    };a("pop,reverse,shift,keys,values,entries", 1), a("indexOf,every,some,forEach,map,filter,find,findIndex,includes", 3), a("join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill"), o(o.S, "Array", c);
  }, { 17: 17, 18: 18, 19: 19, 47: 47 }], 186: [function (t, n, e) {
    t(92);var r = t(30),
        o = t(32),
        i = t(46),
        u = t(84)("iterator"),
        c = r.NodeList,
        a = r.HTMLCollection,
        s = c && c.prototype,
        f = a && a.prototype,
        l = i.NodeList = i.HTMLCollection = i.Array;!c || u in s || o(s, u, l), !a || u in f || o(f, u, l);
  }, { 30: 30, 32: 32, 46: 46, 84: 84, 92: 92 }], 187: [function (t, n, e) {
    var r = t(19),
        o = t(76);r(r.G + r.B, { setImmediate: o.set, clearImmediate: o.clear });
  }, { 19: 19, 76: 76 }], 188: [function (t, n, e) {
    var r = t(30),
        o = t(19),
        i = t(34),
        u = t(59),
        c = r.navigator,
        a = !!c && /MSIE .\./.test(c.userAgent),
        s = function s(t) {
      return a ? function (n, e) {
        return t(i(u, [].slice.call(arguments, 2), "function" == typeof n ? n : Function(n)), e);
      } : t;
    };o(o.G + o.B + o.F * a, { setTimeout: s(r.setTimeout), setInterval: s(r.setInterval) });
  }, { 19: 19, 30: 30, 34: 34, 59: 59 }], 189: [function (t, n, e) {
    t(86), t(170), t(125), t(133), t(137), t(138), t(126), t(136), t(135), t(131), t(132), t(130), t(127), t(129), t(134), t(128), t(96), t(95), t(115), t(116), t(117), t(118), t(119), t(120), t(121), t(122), t(123), t(124), t(98), t(99), t(100), t(101), t(102), t(103), t(104), t(105), t(106), t(107), t(108), t(109), t(110), t(111), t(112), t(113), t(114), t(163), t(166), t(169), t(165), t(161), t(162), t(164), t(167), t(168), t(91), t(93), t(92), t(94), t(87), t(88), t(90), t(89), t(154), t(155), t(156), t(157), t(158), t(159), t(139), t(97), t(160), t(171), t(172), t(140), t(141), t(142), t(143), t(144), t(147), t(145), t(146), t(148), t(149), t(150), t(151), t(153), t(152), t(173), t(180), t(181), t(182), t(183), t(184), t(178), t(176), t(177), t(175), t(174), t(179), t(185), t(188), t(187), t(186), n.exports = t(17);
  }, { 100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 128: 128, 129: 129, 130: 130, 131: 131, 132: 132, 133: 133, 134: 134, 135: 135, 136: 136, 137: 137, 138: 138, 139: 139, 140: 140, 141: 141, 142: 142, 143: 143, 144: 144, 145: 145, 146: 146, 147: 147, 148: 148, 149: 149, 150: 150, 151: 151, 152: 152, 153: 153, 154: 154, 155: 155, 156: 156, 157: 157, 158: 158, 159: 159, 160: 160, 161: 161, 162: 162, 163: 163, 164: 164, 165: 165, 166: 166, 167: 167, 168: 168, 169: 169, 17: 17, 170: 170, 171: 171, 172: 172, 173: 173, 174: 174, 175: 175, 176: 176, 177: 177, 178: 178, 179: 179, 180: 180, 181: 181, 182: 182, 183: 183, 184: 184, 185: 185, 186: 186, 187: 187, 188: 188, 86: 86, 87: 87, 88: 88, 89: 89, 90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99 }], 190: [function (t, n, e) {
    (function (t) {
      !(function (t) {
        "use strict";function wrap(t, n, e, r) {
          var o = Object.create((n || Generator).prototype),
              i = new Context(r || []);return o._invoke = makeInvokeMethod(t, e, i), o;
        }function tryCatch(t, n, e) {
          try {
            return { type: "normal", arg: t.call(n, e) };
          } catch (r) {
            return { type: "throw", arg: r };
          }
        }function Generator() {}function GeneratorFunction() {}function GeneratorFunctionPrototype() {}function defineIteratorMethods(t) {
          ["next", "throw", "return"].forEach(function (n) {
            t[n] = function (t) {
              return this._invoke(n, t);
            };
          });
        }function AwaitArgument(t) {
          this.arg = t;
        }function AsyncIterator(t) {
          function invoke(n, o) {
            var i = t[n](o),
                u = i.value;return u instanceof AwaitArgument ? Promise.resolve(u.arg).then(e, r) : Promise.resolve(u).then(function (t) {
              return i.value = t, i;
            });
          }function enqueue(t, e) {
            function callInvokeWithMethodAndArg() {
              return invoke(t, e);
            }return n = n ? n.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : new Promise(function (t) {
              t(callInvokeWithMethodAndArg());
            });
          }"object" == typeof process && process.domain && (invoke = process.domain.bind(invoke));var n,
              e = invoke.bind(t, "next"),
              r = invoke.bind(t, "throw");invoke.bind(t, "return");this._invoke = enqueue;
        }function makeInvokeMethod(t, n, r) {
          var o = c;return function invoke(i, u) {
            if (o === s) throw new Error("Generator is already running");if (o === f) {
              if ("throw" === i) throw u;return doneResult();
            }for (;;) {
              var h = r.delegate;if (h) {
                if ("return" === i || "throw" === i && h.iterator[i] === e) {
                  r.delegate = null;var p = h.iterator["return"];if (p) {
                    var v = tryCatch(p, h.iterator, u);if ("throw" === v.type) {
                      i = "throw", u = v.arg;continue;
                    }
                  }if ("return" === i) continue;
                }var v = tryCatch(h.iterator[i], h.iterator, u);if ("throw" === v.type) {
                  r.delegate = null, i = "throw", u = v.arg;continue;
                }i = "next", u = e;var g = v.arg;if (!g.done) return o = a, g;r[h.resultName] = g.value, r.next = h.nextLoc, r.delegate = null;
              }if ("next" === i) r._sent = u, o === a ? r.sent = u : r.sent = e;else if ("throw" === i) {
                if (o === c) throw (o = f, u);r.dispatchException(u) && (i = "next", u = e);
              } else "return" === i && r.abrupt("return", u);o = s;var v = tryCatch(t, n, r);if ("normal" === v.type) {
                o = r.done ? f : a;var g = { value: v.arg, done: r.done };if (v.arg !== l) return g;r.delegate && "next" === i && (u = e);
              } else "throw" === v.type && (o = f, i = "throw", u = v.arg);
            }
          };
        }function pushTryEntry(t) {
          var n = { tryLoc: t[0] };1 in t && (n.catchLoc = t[1]), 2 in t && (n.finallyLoc = t[2], n.afterLoc = t[3]), this.tryEntries.push(n);
        }function resetTryEntry(t) {
          var n = t.completion || {};n.type = "normal", delete n.arg, t.completion = n;
        }function Context(t) {
          this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0);
        }function values(t) {
          if (t) {
            var n = t[o];if (n) return n.call(t);if ("function" == typeof t.next) return t;if (!isNaN(t.length)) {
              var i = -1,
                  u = function next() {
                for (; ++i < t.length;) if (r.call(t, i)) return next.value = t[i], next.done = !1, next;return next.value = e, next.done = !0, next;
              };return u.next = u;
            }
          }return { next: doneResult };
        }function doneResult() {
          return { value: e, done: !0 };
        }var e,
            r = Object.prototype.hasOwnProperty,
            o = "function" == typeof Symbol && Symbol.iterator || "@@iterator",
            i = "object" == typeof n,
            u = t.regeneratorRuntime;if (u) return void (i && (n.exports = u));u = t.regeneratorRuntime = i ? n.exports : {}, u.wrap = wrap;var c = "suspendedStart",
            a = "suspendedYield",
            s = "executing",
            f = "completed",
            l = {},
            h = GeneratorFunctionPrototype.prototype = Generator.prototype;GeneratorFunction.prototype = h.constructor = GeneratorFunctionPrototype, GeneratorFunctionPrototype.constructor = GeneratorFunction, GeneratorFunction.displayName = "GeneratorFunction", u.isGeneratorFunction = function (t) {
          var n = "function" == typeof t && t.constructor;return n ? n === GeneratorFunction || "GeneratorFunction" === (n.displayName || n.name) : !1;
        }, u.mark = function (t) {
          return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : t.__proto__ = GeneratorFunctionPrototype, t.prototype = Object.create(h), t;
        }, u.awrap = function (t) {
          return new AwaitArgument(t);
        }, defineIteratorMethods(AsyncIterator.prototype), u.async = function (t, n, e, r) {
          var o = new AsyncIterator(wrap(t, n, e, r));return u.isGeneratorFunction(n) ? o : o.next().then(function (t) {
            return t.done ? t.value : o.next();
          });
        }, defineIteratorMethods(h), h[o] = function () {
          return this;
        }, h.toString = function () {
          return "[object Generator]";
        }, u.keys = function (t) {
          var n = [];for (var e in t) n.push(e);return n.reverse(), function next() {
            for (; n.length;) {
              var e = n.pop();if (e in t) return next.value = e, next.done = !1, next;
            }return next.done = !0, next;
          };
        }, u.values = values, Context.prototype = { constructor: Context, reset: function reset(t) {
            if ((this.prev = 0, this.next = 0, this.sent = e, this.done = !1, this.delegate = null, this.tryEntries.forEach(resetTryEntry), !t)) for (var n in this) "t" === n.charAt(0) && r.call(this, n) && !isNaN(+n.slice(1)) && (this[n] = e);
          }, stop: function stop() {
            this.done = !0;var t = this.tryEntries[0],
                n = t.completion;if ("throw" === n.type) throw n.arg;return this.rval;
          }, dispatchException: function dispatchException(t) {
            function handle(e, r) {
              return i.type = "throw", i.arg = t, n.next = e, !!r;
            }if (this.done) throw t;for (var n = this, e = this.tryEntries.length - 1; e >= 0; --e) {
              var o = this.tryEntries[e],
                  i = o.completion;if ("root" === o.tryLoc) return handle("end");if (o.tryLoc <= this.prev) {
                var u = r.call(o, "catchLoc"),
                    c = r.call(o, "finallyLoc");if (u && c) {
                  if (this.prev < o.catchLoc) return handle(o.catchLoc, !0);if (this.prev < o.finallyLoc) return handle(o.finallyLoc);
                } else if (u) {
                  if (this.prev < o.catchLoc) return handle(o.catchLoc, !0);
                } else {
                  if (!c) throw new Error("try statement without catch or finally");if (this.prev < o.finallyLoc) return handle(o.finallyLoc);
                }
              }
            }
          }, abrupt: function abrupt(t, n) {
            for (var e = this.tryEntries.length - 1; e >= 0; --e) {
              var o = this.tryEntries[e];if (o.tryLoc <= this.prev && r.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                var i = o;break;
              }
            }i && ("break" === t || "continue" === t) && i.tryLoc <= n && n <= i.finallyLoc && (i = null);var u = i ? i.completion : {};return u.type = t, u.arg = n, i ? this.next = i.finallyLoc : this.complete(u), l;
          }, complete: function complete(t, n) {
            if ("throw" === t.type) throw t.arg;"break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = t.arg, this.next = "end") : "normal" === t.type && n && (this.next = n);
          }, finish: function finish(t) {
            for (var n = this.tryEntries.length - 1; n >= 0; --n) {
              var e = this.tryEntries[n];if (e.finallyLoc === t) return this.complete(e.completion, e.afterLoc), resetTryEntry(e), l;
            }
          }, "catch": function _catch(t) {
            for (var n = this.tryEntries.length - 1; n >= 0; --n) {
              var e = this.tryEntries[n];if (e.tryLoc === t) {
                var r = e.completion;if ("throw" === r.type) {
                  var o = r.arg;resetTryEntry(e);
                }return o;
              }
            }throw new Error("illegal catch attempt");
          }, delegateYield: function delegateYield(t, n, e) {
            return this.delegate = { iterator: values(t), resultName: n, nextLoc: e }, l;
          } };
      })("object" == typeof t ? t : "object" == typeof window ? window : "object" == typeof self ? self : this);
    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
  }, {}] }, {}, [1]);
'use strict';

angular.module('shiptApp', ['ionic',
// 'ionic.service.core',
// 'ionic.service.deploy',
'ngCordova', 'cgBusy', 'common', 'ionic.rating', 'ionicLazyLoad', 'ui.utils.masks', 'ngIOS9UIWebViewPatch', 'uiGmapgoogle-maps', 'ngAria', 'app.shipt.search', 'shiptApp.config', 'shiptApp.constants']).run(['$ionicPlatform', '$ionicScrollDelegate', '$timeout', 'AppAnalytics', '$rootScope', function ($ionicPlatform, $ionicScrollDelegate, $timeout, AppAnalytics, $rootScope) {
    $ionicPlatform.ready(function () {
        AppAnalytics.initSegment();
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(true);
            $timeout(function () {
                navigator.splashscreen.hide();
            }, 500);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        if (window.cordova && ionic.Platform.isIOS()) {
            window.addEventListener("statusTap", function () {
                $ionicScrollDelegate.scrollTop(true);
            });
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        AppAnalytics.page(event, toState, toParams, fromState, fromParams);
    });
}]);
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('AppController', ['$scope', '$ionicModal', '$log', 'common', 'AuthService', 'ShoppingCartService', '$cordovaPush', '$ionicPlatform', 'UIUtil', 'LogService', '$state', '$ionicHistory', 'AccountService', '$rootScope', '$timeout', 'UserOrderService', '$q', 'ShareModalProvider', 'IntroModalProvider', 'Geolocator', 'FeatureService', 'AppAnalytics', 'ordersModalProvider', 'chooseStoreModal', '$ionicSideMenuDelegate', 'OpenUrlService', 'CommonConfig', AppController]);

    function AppController($scope, $ionicModal, $log, common, AuthService, ShoppingCartService, $cordovaPush, $ionicPlatform, UIUtil, LogService, $state, $ionicHistory, AccountService, $rootScope, $timeout, UserOrderService, $q, ShareModalProvider, IntroModalProvider, Geolocator, FeatureService, AppAnalytics, ordersModalProvider, chooseStoreModal, $ionicSideMenuDelegate, OpenUrlService, CommonConfig) {

        var registerModal, introModal, lastOrderRatingModal, orderDetailModal;
        var checkingToOpenLastOrderModal = false;

        if (webVersion) {
            $scope.hideShareButton = true;
        }

        $scope.webVersion = webVersion && nonMobileWebApp;

        $scope.$on('user.loggedin', function (event, data) {
            common.loadConfiguration(CommonConfig.groceriesContext);
            common.userLoggedIn();
            showLastOrderModal();
            configurePushNotificationServices();
            if (!webVersion) {
                showIntro();
            }
            ShoppingCartService.loadServerCart();
            AccountService.refreshCustomerInfo();
            getGeolocation();
            AppAnalytics.login();
            AppAnalytics.identify();
            if (IntroModalProvider.hasIntroModalBeenShown()) {
                showChooseStoreModal();
            }
        });

        $scope.signoutClick = function () {
            common.logoutCurrentUser();
        };

        $scope.$on('show-register-page', function (event, data) {
            common.userLoggedIn();
            var registerPageUrl = 'app/groceries/register/registerNewUser.html';
            if (webVersion && nonMobileWebApp) {
                registerPageUrl = 'app/groceries/register/webRegisterNewUser.html';
            }
            $ionicModal.fromTemplateUrl(registerPageUrl, {
                scope: $scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false,
                focusFirstInput: true,
                animation: 'asdfasdf'
            }).then(function (modal) {
                registerModal = modal;
                registerModal.show();
            });
        });

        $scope.$on('cancel-register', function (event, data) {
            registerModal.hide();
            showWelcome();
            common.configureRollBarUserInfo();
        });

        $scope.$on('user.registered', function (event, data) {
            common.loadConfiguration(CommonConfig.groceriesContext);
            common.userLoggedIn();
            registerModal.hide();
            common.configureRollBarUserInfo();
            configurePushNotificationServices();
            showIntro();
            getGeolocation();
            AppAnalytics.signup();
            AppAnalytics.identify();
        });

        function showIntro() {
            if (AuthService.isAuthenticated()) {
                IntroModalProvider.showIntroModal($scope);
            }
        }

        function showWelcome() {
            if (!AuthService.isAuthenticated()) {
                IntroModalProvider.showWelcomModal($scope);
            }
        }

        function showChooseStoreModal() {
            if (AuthService.isAuthenticated()) {
                $ionicPlatform.ready(function () {
                    chooseStoreModal.showIfNeeded($scope);
                });
            }
        }

        function configurePushNotificationServices() {
            if (AuthService.getCustomerInfo() != null) {
                $ionicPlatform.ready(function () {
                    var pushConfig = null;
                    var isIOS = ionic.Platform.isIOS();
                    var isAndroid = ionic.Platform.isAndroid();
                    var deviceType = "";
                    if (isIOS) {
                        pushConfig = {
                            "badge": true,
                            "sound": true,
                            "alert": true
                        };
                    } else if (isAndroid) {
                        pushConfig = {
                            "senderID": "897704621141"
                        };
                    }
                    if (isIOS || isAndroid) {
                        try {
                            var push = PushNotification.init({
                                "android": {
                                    "senderID": "897704621141"
                                },
                                "ios": {
                                    "badge": true,
                                    "sound": true,
                                    "alert": true
                                }
                            });
                            push.on('registration', function (data) {
                                AccountService.registerUserForPush(data.registrationId).success(function (data) {
                                    LogService.info('Success Registering user for push ' + JSON.stringify(data));
                                }).error(function (error) {
                                    LogService.error('Error Registering user for push ' + JSON.stringify(error));
                                });
                            });
                            push.on('notification', function (data) {
                                if (ionic.Platform.isIOS()) {
                                    handleIOSNotification(data);
                                } else {
                                    handleAndroidNotification(data);
                                }
                            });
                            push.on('error', function (e) {
                                LogService.error('push error ' + JSON.stringify(e));
                            });
                            push.setApplicationIconBadgeNumber(function () {}, function () {}, 0);
                        } catch (exception) {}
                    }
                });
            }
        }

        function rateOrderPush(notification) {
            try {
                if (!checkingToOpenLastOrderModal && !lastOrderRatingModalIsShown()) {
                    if (notification.additionalData.order_id && notification.additionalData.driver_id) {
                        $ionicHistory.nextViewOptions({ disableBack: true });
                        $state.go('app.ordersRate', {
                            order: angular.toJson({
                                driver_id: notification.additionalData.driver_id,
                                order_id: notification.additionalData.order_id,
                                status: notification.additionalData.order_status
                            })
                        });
                        return true;
                    } else if (notification.additionalData.order_id && notification.additionalData.driver_id) {
                        $ionicHistory.nextViewOptions({ disableBack: true });
                        $state.go('app.ordersRate', {
                            order: angular.toJson({
                                driver_id: notification.additionalData.driver_id,
                                order_id: notification.additionalData.order_id,
                                status: notification.additionalData.order_status
                            })
                        });
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (exception) {
                LogService.error(exception);
                return false;
            }
        }

        function handleIOSNotification(notification) {
            try {
                if (notification.message) {
                    if (rateOrderPush(notification)) {
                        //dont show the push if its a rate push
                        //we will just open the modal if needed
                    } else {
                            var alert = notification.message;
                            navigator.notification.alert(notification.message);
                        }
                }
                if (notification.sound) {
                    try {
                        var snd = new Media(event.sound);
                        snd.play();
                    } catch (exception) {
                        $log.error('error playing sound', exception);
                    }
                }
            } catch (exception) {
                LogService.error(exception);
            }
        }

        function handleAndroidNotification(notification) {
            var message = notification.message;
            if (rateOrderPush(notification)) {
                //dont show the push if its a rate push
                //we will just open the modal if needed
            } else {
                    navigator.notification.alert(notification.message);
                }
        }

        $ionicPlatform.on("resume", function (event) {
            showLastOrderModal();
            ShoppingCartService.loadServerCart();
            //refresh local users info
            AccountService.refreshCustomerInfo();
            getGeolocation();
            configurePushNotificationServices();
            showChooseStoreModal();
        });

        $scope.showRecipeButton = function () {
            return FeatureService.mealKits();
        };

        $scope.showFavorites = function () {
            return FeatureService.favorites();
        };

        function lastOrderRatingModalIsShown() {
            //safety method to wrap the isShown() method
            if (lastOrderRatingModal) {
                return lastOrderRatingModal.isShown();
            } else {
                return false;
            }
        }

        function orderDetailModalIsShown() {
            //safety method to wrap the isShown() method
            if (orderDetailModal) {
                return orderDetailModal.isShown();
            } else {
                return false;
            }
        }

        function showLastOrderModal() {
            ordersModalProvider.currentOrderModal($scope);
        }

        function showOrderDetailForCurrentOpenOrder(order) {
            $scope.orderDetailOrder = order;
            getOrderDetailModal().then(function (modal) {
                orderDetailModal = modal;
                if (!orderDetailModalIsShown()) {
                    orderDetailModal.show();
                }
                checkingToOpenLastOrderModal = false;
            });
        }

        function showLastOrderRateModal(order) {
            $scope.rateOrder = order;
            getLastOrderModal().then(function (modal) {
                lastOrderRatingModal = modal;
                if (!lastOrderRatingModalIsShown()) {
                    $scope.$broadcast('last.order.rating.load', $scope.rateOrder);
                    lastOrderRatingModal.show();
                }
                checkingToOpenLastOrderModal = false;
            });
        }

        function getOrderDetailModal() {
            var defer = $q.defer();
            if (!orderDetailModal) {
                $scope.closeOrderDetailModel = function () {
                    orderDetailModal.hide();
                };
                return $ionicModal.fromTemplateUrl('app/groceries/account/orders/OrderHistoryDetailModal.html', {
                    scope: $scope,
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                });
            } else {
                defer.resolve(orderDetailModal);
            }
            return defer.promise;
        }

        function getLastOrderModal() {
            var defer = $q.defer();
            if (!lastOrderRatingModal) {
                if (webVersion) {
                    return $ionicModal.fromTemplateUrl('app/groceries/account/ratings/webLastOrderRatingModal.html', {
                        scope: $scope,
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    });
                } else {
                    return $ionicModal.fromTemplateUrl('app/groceries/account/ratings/lastOrderRatingModal.html', {
                        scope: $scope,
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    });
                }
            } else {
                defer.resolve(lastOrderRatingModal);
            }
            return defer.promise;
        }

        $rootScope.$on('hide.order.rating', function (event, notification) {
            if (lastOrderRatingModal) {
                lastOrderRatingModal.hide();
            }
        });

        function showShareModal() {
            ShareModalProvider.showModal($scope, 'side_menu_item');
        }

        $scope.shareFriendsClick = function () {
            showShareModal();
        };

        function getGeolocation() {
            $ionicPlatform.ready(function () {
                if (AuthService.isAuthenticated()) {
                    Geolocator.getCurrentPosition();
                }
            });
        }

        $scope.homeClick = function () {
            $scope.$broadcast('nav.home-menu-item-click', $scope.rateOrder);
        };

        common.loadConfiguration(CommonConfig.groceriesContext);
        showWelcome();
        showLastOrderModal();
        common.configureRollBarUserInfo();
        configurePushNotificationServices();
        //refresh local users info
        AccountService.refreshCustomerInfo();
        getGeolocation();
        ShoppingCartService.loadServerCart();
        showChooseStoreModal();
        AppAnalytics.identify();

        //this is the part that will handle the quick launch stuff for iphones
        $ionicPlatform.ready(function () {
            try {
                ThreeDeeTouch.onHomeIconPressed = function (payload) {
                    if (payload.type == 'shoppingCart') {
                        $state.go('app.shoppingCart');
                    } else if (payload.type == 'yourOrders') {
                        $ionicHistory.nextViewOptions({ disableBack: true });
                        $state.go('app.orders');
                    } else if (payload.type == 'account') {
                        $ionicHistory.nextViewOptions({ disableBack: true });
                        $state.go('app.account');
                    }
                };
            } catch (e) {}
        });

        $scope.$watch(function () {
            return $ionicSideMenuDelegate.isOpen();
        }, function (isOpen) {
            if (isOpen) {
                AppAnalytics.track('sideMenuOpened');
            }
        });
    }
})();
'use strict';

angular.module('shiptApp').factory('$exceptionHandler', ['$injector', function ($injector) {
    return function (exception, cause) {
        try {
            var LogService = $injector.get("LogService");
            LogService.error(exception);
        } catch (exception) {
            //rollbar was not defined or something.
        }
    };
}]);

angular.module('shiptApp').config(['$compileProvider', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', 'IonicAppConfig', function ($compileProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, IonicAppConfig) {

    if (document.location.hostname != "localhost") {}
    // $compileProvider.debugInfoEnabled(false);

    //
    // $ionicAppProvider.identify({
    //     // The App ID (from apps.ionic.io) for the server
    //     app_id: IonicAppConfig.ionic_app_id,
    //     // The public API key all services will use for this app
    //     api_key: IonicAppConfig.ionic_api_key,
    // });

    if (webVersion && nonMobileWebApp) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }

    var mq = window.matchMedia('all and (max-width: 800px)');
    if (mq.matches) {
        //$ionicConfigProvider.views.transition('none');
    } else {
            $ionicConfigProvider.views.transition('none');
        }

    mq.addListener(function (changed) {
        if (changed.matches) {
            // the width of browser is more then 700px
        } else {
                // the width of browser is less then 700px
            }
    });

    $stateProvider.state('app', {
        url: "/app",
        abstract: true,
        templateUrl: webVersion && nonMobileWebApp ? "app/groceries/menu/webMenu.html" : "app/groceries/menu/menu.html",
        controller: 'AppController'
    }).state('app.shoppingCart', {
        url: "/shoppingCart",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/shop/shoppingCart/webShoppingCart.html" : "app/groceries/shop/shoppingCart/shoppingCart.html",
                controller: "ShoppingCartController"
            }
        }
    }).state('app.products', {
        url: "/products/:category",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/shop/shopping/webProducts.html" : "app/groceries/shop/shopping/products.html",
                controller: "ProductsController"
            }
        }
    }).state('app.recentProducts', {
        url: "/recentProducts/",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/shop/shopping/webProducts.html" : "app/groceries/shop/shopping/products.html",
                controller: "ProductsController"
            }
        }
    }).state('app.recentSpecialRequests', {
        url: "/recentSpecialRequests/",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/shop/shopping/webProducts.html" : "app/groceries/shop/shopping/products.html",
                controller: "ProductsController"
            }
        }
    }).state('app.favoriteItems', {
        url: "/favorites",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/shop/shopping/favoriteItems.html",
                controller: "FavoriteItemsController"
            }
        }
    }).state('app.account', {
        url: "/account",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/account/webAccount.html" : "app/groceries/account/account.html",
                controller: "accountController as vm"
            }
        }
    }).state('app.editAccount', {
        url: "/editAccount/:account",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/account/editAccount.html"
            }
        }
    }).state('app.searchProducts', {
        url: "/searchProducts",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/shop/search/productSearch.html"
            }
        }
    }).state('app.addressList', {
        url: "/addressList",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/account/address/webAddressList.html" : "app/groceries/account/address/addressList.html",
                controller: "AddressListController"
            }
        }
    }).state('app.addEditAddress', {
        url: "/addEditAddress/:address/:fromSearch?/:fromCheckout?",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/account/address/webAddEditAddress.html" : "app/groceries/account/address/addEditAddress.html",
                controller: "EditAddressController"
            }
        }
    }).state('app.addEditAddressMap', {
        url: "/addEditAddressMap/:fromCheckout?",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/account/address/addressSearch/webAddressSearch.html" : "app/groceries/account/address/addressSearch/addressSearch.html"
            }
        }
    }).state('app.cardList', {
        url: "/cardList",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/account/payment/webCardList.html" : "app/groceries/account/payment/cardList.html",
                controller: "CardListController"
            }
        }
    }).state('app.addEditCard', {
        url: "/addEditCard/:card",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/account/payment/cardCreate.html",
                controller: "CardCreateController"
            }
        }
    }).state('app.orders', {
        url: "/orders",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/account/orders/webOrders.html" : "app/groceries/account/orders/orders.html"
            }
        }
    }).state('app.ordersRate', {
        url: "/ordersRate/:order",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/account/orders/orders.html"
            }
        }
    }).state('app.subcategories', {
        url: "/subcategories/:parentCat",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/shop/shopping/subCategories.html",
                controller: 'SubCategoriesController'
            }
        }
    }).state('app.categories', {
        url: "/categories",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/shop/shopping/categories.html"
            }
        }
    }).state('app.checkout', {
        url: "/checkout",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/shop/checkOut/webCheckout.html" : "app/groceries/shop/checkOut/checkOut.html",
                controller: 'CheckoutController as viewModel'
            }
        }
    }).state('app.existingCardDetails', {
        url: "/existingCardDetails:card",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/account/payment/existingCardDetails.html",
                controller: 'ExistingCardDetailsController'
            }
        }
    }).state('app.help', {
        url: "/help",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/help/help.html"
            }
        }
    }).state('app.faq', {
        url: "/faq/:category",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/help/faq/faq.html"
            }
        }
    }).state('app.contactUs', {
        url: "/contactUs",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/help/ContactUs.html"
            }
        }
    }).state('app.home', {
        url: "/home",
        views: {
            'menuContent': {
                templateUrl: webVersion && nonMobileWebApp ? "app/groceries/home/webHome.html" : "app/groceries/home/home.html"
            }
        }
    }).state('app.faqArticle', {
        url: "/faqArticle/:q",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/help/faq/article.html"
            }
        }
    }).state('app.mealKitsList', {
        url: "/mealKitsList",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/shop/mealKits/mealKitsList.html"
            }
        }
    }).state('app.mealKitDetail', {
        url: "/mealKitDetail/:mealKit",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/shop/mealKits/mealKitDetail/mealKitDetail.html"
            }
        }
    }).state('app.recipes', {
        url: "/recipes",
        views: {
            'menuContent': {
                templateUrl: "app/groceries/shop/mealKits/recipes/recipes.html"
            }
        }
    });
    $urlRouterProvider.otherwise('/app/home');
}]);
"use strict";

angular.module("shiptApp.config", []).constant("ApiEndpoint", {
	"authurl": "https://app.shipt.com/api/v1/sessions.json",
	"apiurl": "https://app.shipt.com/",
	"photoUploadUrl": "https://admin.shipt.com/api/v1/photos.json"
}).constant("IonicAppConfig", {
	"ionic_app_id": "49144f00",
	"ionic_api_key": "d574e86313439ce2c24052615b794181b08b0149971493ed"
});
'use strict';

angular.module('app.shipt.search', ['common']);
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('accountController', ['$scope', '$rootScope', '$state', 'UIUtil', '$log', 'AccountService', 'common', 'Subscription', 'ErrorHandler', 'planProvider', 'FeatureService', accountController]);

    function accountController($scope, $rootScope, $state, UIUtil, $log, AccountService, common, Subscription, ErrorHandler, planProvider, FeatureService) {
        var vm = this;
        $scope.loadingIndicator = false;

        $scope.customerInfo = {
            phone: null,
            email: null,
            name: null,
            metro_id: null
        };

        $scope.editAccount = function () {
            if ($scope.loadingIndicator) return;
            var account = {
                name: $scope.customerInfo.name,
                email: $scope.customerInfo.email,
                phone: $scope.customerInfo.phone,
                metro_id: $scope.customerInfo.metro_id
            };
            $state.go('app.editAccount', { account: angular.toJson(account) });
        };

        $scope.showSubscribeButton = function () {
            if (webVersion && $scope.customerInfo.guest_account) {
                return true;
            }
            return false;
        };

        $scope.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        vm.planPrice = function (plan) {
            var amount = plan.amount / 100;
            return amount;
        };

        vm.subscriptionClick = function () {
            $log.info('subscriptionClick');
            planProvider.showModal($scope, vm.plan).then(function () {
                loadData();
            }, function () {});
        };

        function loadData() {
            try {
                showLoading();
                if (FeatureService.subscription()) {
                    $scope.planPromise = Subscription.edit();
                    $scope.planPromise.then(function (data) {
                        vm.plan = data;
                        vm.planLoaded = true;
                    }, function (error) {
                        $log.error('error loading plan', error);
                    });
                } else {
                    vm.plan = undefined;
                    vm.planLoaded = true;
                }

                AccountService.refreshCustomerInfoShort().then(function (data) {
                    $scope.customerInfo = data;
                    hideLoading();
                }, function (error) {
                    hideLoading();
                });
            } catch (exception) {
                UIUtil.hideLoading();
                $log.error(exception);
            }
        }

        function showLoading() {
            $scope.loadingIndicator = true;
        }

        function hideLoading() {
            $scope.loadingIndicator = false;
        }

        $scope.$on('$ionicView.beforeEnter', function () {
            loadData();
        });

        $scope.signoutClick = function () {
            common.logoutCurrentUser();
        };

        $scope.$on('user.loggedin', function (event, data) {
            $log.info('user.loggedin');
            loadData();
        });

        $rootScope.$on('refresh.user-data', function (event, data) {
            $log.info('refresh.user-data');
            loadData();
        });

        $scope.$on('user.registered', function (event, data) {
            $log.info('user.registered');
            loadData();
        });
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('EditAccountController', ['$scope', '$log', '$rootScope', '$ionicHistory', '$stateParams', 'AccountService', 'UIUtil', 'LogService', 'AuthService', 'ShoppingCartService', 'AppAnalytics', 'ErrorHandler', EditAccountController]);

    function EditAccountController($scope, $log, $rootScope, $ionicHistory, $stateParams, AccountService, UIUtil, LogService, AuthService, ShoppingCartService, AppAnalytics, ErrorHandler) {

        var viewModel = this;

        $scope.$on('$ionicView.beforeEnter', function () {
            $log.info('beforeEnter, state params: ', $stateParams.account);
            viewModel.account = angular.fromJson($stateParams.account);
        });

        function clearStuffForMetroChange() {
            try {
                ShoppingCartService.clearCart();
                localStorage.removeItem('localCategories');
            } catch (e) {}
        }

        viewModel.saveAccount = function () {
            var resetCache = false;
            UIUtil.showLoading();
            saveUpdatedAccount();
        };

        function saveUpdatedAccount() {
            AccountService.updateAccountInfo(viewModel.account).success(function (data) {
                $rootScope.$broadcast('refresh.user-data');
                UIUtil.hideLoading();
                $ionicHistory.goBack();
                AppAnalytics.updateUser();
            }).error(function (error) {
                UIUtil.hideLoading();
                LogService.error(error);
                ErrorHandler.displayShiptAPIError(error);
            });
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('chooseStoreModal', chooseStoreModal);

    chooseStoreModal.$inject = ['$rootScope', '$ionicModal', '$q', '$log', 'IN_APP_MESSAGE', 'AuthService', 'FeatureService'];

    function chooseStoreModal($rootScope, $ionicModal, $q, $log, IN_APP_MESSAGE, AuthService, FeatureService) {

        var modal = null;
        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/chooseStore/address/chooseStoreModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (_modal) {
                defer.resolve(_modal);
            });
            return defer.promise;
        }

        var init = function init($scope, zip, store, editShoppingAddressMode, source, addressToSelectFor) {
            if (editShoppingAddressMode === undefined) editShoppingAddressMode = false;
            if (source === undefined) source = 'homeScreen';

            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            var customer = AuthService.getCustomerInfo();
            if (!store) {
                store = customer.store;
            }
            if (!zip) {
                zip = customer.shopping_zip_code;
            }
            $scope.addressToSelectFor = addressToSelectFor;
            var address = null;
            if (customer.customer_addresses) {
                address = customer.customer_addresses.find(function (a) {
                    return a.id == customer.default_shopping_address_id;
                });
            }
            $scope.store = store;
            $scope.zip = zip;
            $scope.address = address;
            $scope.editShoppingAddressMode = editShoppingAddressMode;
            $scope.source = source;

            getModal($scope).then(function (_modal) {
                modal = _modal;
                modal.show().then(function () {
                    $log.info("showing modal again");
                    $('.delivering-to').focus(); // for accessiblity (voice reader)
                });
            });

            $scope.saveModal = function (store) {
                defer.resolve(store);
                modal.hide();
                modal.remove();
                modal = null;
            };
            $scope.cancelModal = function () {
                defer.reject();
                modal.hide();
                modal.remove();
                modal = null;
            };
            $scope.$on('$destroy', function () {
                if (modal) modal.remove();
            });
            $scope.$watch('vm.editShoppingAddressMode', function (isEditMode) {
                $log.info('editShoppingAddressMode started');
                if (isEditMode) {
                    $log.info('editShoppingAddressMode isEditMode');
                    $('.delivery-address-header').focus();
                }
            });

            return defer.promise;
        };

        function isChooseStoreModalShown() {
            if (modal) {
                return modal.isShown();
            } else {
                return false;
            }
        }

        function showIfNeededForAddress($scope) {
            if (FeatureService.chooseStoreInApp()) {
                var customer = AuthService.getCustomerInfo();
                if (!customer.store || !customer.default_shopping_address_id && !isChooseStoreModalShown()) {
                    init($scope, null, null, false, 'becauseCustomerHasNotChoosenYet');
                }
            }
        };

        var service = {
            showModal: init,
            showIfNeeded: showIfNeededForAddress
        };

        $rootScope.$on('handleOpenUrl.action.openChooseStoreModal', function () {
            service.showModal();
        });

        // This particular event is fired from the common module
        $rootScope.$on(IN_APP_MESSAGE.EVENTS.OPEN_CHOOSE_STORE_MODAL, function () {
            service.showModal();
        });

        return service;
    }
})();
'use strict';

(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name shiptApp.constants
   * @description Defines the module and dependencies for constants in the groceries app.
   */
  angular.module('shiptApp.constants', []);
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp.constants')

    /**
     * @ngdoc constant
     * @name FEATURE_TOGGLES
     * @description Defines the key constants for the feature toggles.
     */
    .constant('FEATURE_TOGGLES', {
        CHANGE_STORE_VARIANT: 'use_change_store_variant'
    });
})();
'use strict';

angular.module('shiptApp').directive('cartButton', ['$timeout', '$state', 'ShoppingCartService', cartButton]);

function cartButton($timeout, $state, ShoppingCartService) {
    var guestAccount = false;
    var directive = {
        restrict: 'EA',
        template: '<button class="button button-icon icon ion-ios-cart-outline" ng-click="goToCart()" role="button" aria-label="Cart, {{cartCount()}} items.">\n            <span aria-hidden="true" ng-if="cartCount() > 0" class="badge badge-assertive magictime cart-count {{animatedClass}}">{{cartCount()}}</span>\n        </button>',
        link: function link(scope, element, attrs) {
            scope.goToCart = function () {
                $state.go('app.shoppingCart');
            };
            scope.cartCount = function () {
                return ShoppingCartService.getCartItemCount();
            };
            scope.$watch(function () {
                return scope.cartCount();
            }, function (newValue, oldValue) {
                if (oldValue) {
                    if (oldValue < newValue) {
                        scope.animatedClass = 'puffIn';
                    } else {
                        scope.animatedClass = 'puffOut';
                    }
                    $timeout(function () {
                        scope.animatedClass = '';
                    }, 200);
                }
            });
        },
        scope: { value: '=' }
    };
    return directive;
}
'use strict';

angular.module('shiptApp').directive('favHeartButton', ['UIUtil', 'choosePlan', 'Subscription', 'ErrorHandler', '$rootScope', 'FavoriteItem', 'FeatureService', favHeartButton]);

function favHeartButton(UIUtil, choosePlan, Subscription, ErrorHandler, $rootScope, FavoriteItem, FeatureService) {
    var guestAccount = false;

    var directive = {
        restrict: 'EA',
        template: '<button ng-if="showFavButton" class="button button-clear button-assertive fav-button" ng-click="clickFavorite(productDetailProduct)" aria-label="add to favorites icon in top left">' + '<i class="icon text-assertive" ng-class="favClass()"></i>' + '</button>',
        link: function link(scope, element, attrs) {
            var favoriteIds = [];
            loadFavIds();

            function loadFavIds() {
                FavoriteItem.listIds().then(function (fav_ids) {
                    favoriteIds = fav_ids;
                });
            }

            function removeFromParent() {
                try {
                    scope.$parent.productUnFavoritedRemove(scope.productDetailProduct);
                } catch (e) {}
            }

            scope.showFavButton = FeatureService.favorites();

            scope.clickFavorite = function (product) {
                if (product.favorite) {
                    FavoriteItem.removeProduct(product);
                    //set it to not be a favorite and remove it from the local copy of the fav item ids
                    scope.productDetailProduct.favorite = false;
                    favoriteIds = favoriteIds.filter(function (item) {
                        return item.id != scope.productDetailProduct.id;
                    });
                    removeFromParent();
                } else {
                    FavoriteItem.addProduct(product);
                    //set it to be a favorite and add it to the local copy of the fav item ids
                    favoriteIds.push({ id: product.id });
                    scope.productDetailProduct.favorite = true;
                    loadFavIds();
                }
            };

            scope.favClass = function () {
                try {
                    if (scope.productDetailProduct.product_type == "custom") {
                        return '';
                    }
                    var foundFav = favoriteIds.find(function (item) {
                        return item.id == scope.productDetailProduct.id;
                    });
                    if (foundFav) {
                        scope.productDetailProduct.favorite = true;
                        return 'ion-ios-heart';
                    } else {
                        return scope.productDetailProduct.favorite ? 'ion-ios-heart' : 'ion-ios-heart-outline';
                    }
                } catch (e) {
                    return 'ion-ios-heart-outline';
                }
            };
        },
        scope: { productDetailProduct: "=" }
    };
    return directive;
}
'use strict';

angular.module('shiptApp').directive('guestAccountCallout', ['UIUtil', 'choosePlan', 'Subscription', 'ErrorHandler', '$rootScope', 'FeatureService', 'AppAnalytics', guestAccountCallout]);

function guestAccountCallout(UIUtil, choosePlan, Subscription, ErrorHandler, $rootScope, FeatureService, AppAnalytics) {
    var guestAccount = false;
    var directive = {
        restrict: 'EA',
        template: '' + '<button\n            ng-click="guestAccountCalloutClick()"\n            class="guest-account-callout button-positive button-full button"\n            aria-label="You\'re currently a guest. Get started!">\n            Get Started!\n        </div>',
        link: function link(scope, element, attrs) {
            scope.guestAccountCalloutClick = function () {
                AppAnalytics.track('guestAccountCalloutBannerClick');
                if (FeatureService.subscription()) {
                    choosePlan.showModal(scope).then(function (selectedPlan) {
                        UIUtil.showLoading('Saving Plan...');
                        selectedPlan.plan_id = selectedPlan.id;
                        Subscription.create(selectedPlan).then(function (data) {
                            UIUtil.hideLoading();
                            UIUtil.showAlert('Plan Created', 'You have been subscribed to the ' + data.plan.name + ' plan.');
                            $rootScope.$broadcast('refresh.user-data');
                        }, function (error) {
                            UIUtil.hideLoading();
                            ErrorHandler.displayShiptAPIError(error);
                        });
                    });
                } else {
                    UIUtil.showAlert("Thank you for creating an account with Shipt!", "A plan is required to place an order. Visit shipt.com/join to become a member.  We can't wait to deliver to you soon!");
                }
            };
        },
        scope: { value: '=' }
    };
    return directive;
}
'use strict';

angular.module('shiptApp').directive('webCartButton', ['UIUtil', '$ionicHistory', '$state', 'ErrorHandler', '$rootScope', 'ShoppingCartService', webCartButton]);

function webCartButton(UIUtil, $ionicHistory, $state, ErrorHandler, $rootScope, ShoppingCartService) {
    var guestAccount = false;
    var directive = {
        restrict: 'EA',
        template: '<button class="button button-icon icon ion-ios-cart" ng-click="cartClick()"\n            aria-label="Cart balance, {{cartAmount() | number:0}} dollars. Click to open cart">\n            {{cartAmount() | currency}}\n        </button>',
        link: function link(scope, element, attrs) {

            scope.cartClick = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.shoppingCart');
            };

            scope.cartAmount = function () {
                try {
                    var total = ShoppingCartService.getCartTotal();
                    return total;
                } catch (exception) {}
            };
        },
        scope: { value: '=' }
    };
    return directive;
}
'use strict';

angular.module('shiptApp').directive('webHomeLogoButton', ['UIUtil', '$ionicHistory', '$state', 'ErrorHandler', '$rootScope', 'FeatureService', webHomeLogoButton]);

function webHomeLogoButton(UIUtil, $ionicHistory, $state, ErrorHandler, $rootScope, FeatureService) {
    var guestAccount = false;
    var directive = {
        restrict: 'EA',
        template: '\n            <button href="#/home" ng-click="homeClick()" class="button button-icon icon shipt-logo-button" aria-label="shipped home button">\n                <img src="img/logo.png" alt="" aria-hidden="true">\n            </button>',
        link: function link(scope, element, attrs) {
            scope.homeClick = function () {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                // Go back to home
                $state.go('app.home');
                $rootScope.$broadcast('nav.home-menu-item-click');
            };
        },
        scope: { value: '=' }
    };
    return directive;
}
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('homeController', ['$scope', '$log', 'AccountService', '$state', 'ShoppingService', 'LogService', '$rootScope', 'PromoFeaturesService', '$ionicModal', 'ProductService', '$ionicScrollDelegate', '$timeout', '$ionicSlideBoxDelegate', '$cordovaKeyboard', '$filter', 'AppAnalytics', 'shopCategoriesProvider', 'chooseStoreModal', 'ShoppingCartService', 'FeatureService', 'FEATURE_TOGGLES', 'COMMON_FEATURE_TOGGLES', homeController]);

    function homeController($scope, $log, AccountService, $state, ShoppingService, LogService, $rootScope, PromoFeaturesService, $ionicModal, ProductService, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate, $cordovaKeyboard, $filter, AppAnalytics, shopCategoriesProvider, chooseStoreModal, ShoppingCartService, FeatureService, FEATURE_TOGGLES, COMMON_FEATURE_TOGGLES) {

        var viewModel = this;

        var defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
        var mq = window.matchMedia('all and (max-width: 700px)');
        if (mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }
        $scope.getItemWidth = function () {
            return $scope.itemWidth;
        };

        viewModel.goToSearch = function () {
            $state.go('app.searchProducts');
        };

        viewModel.changeLocationStoreClick = function () {
            if (AccountService.checkFeature("chooseStoreInApp")) {
                chooseStoreModal.showModal($scope, null, viewModel.store).then(function (store) {
                    viewModel.store = store;
                });
            }
        };

        $scope.showSearch = false;
        var current_page = 0;
        var total_pages = null;
        var lastSearchText = "";
        $scope.search = { searchQuery: null };
        $scope.searchResults = [];
        $scope.searching = false;
        var searchFocused = false;
        $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
            scope: $scope,
            focusFirstInput: true,
            animation: 'scale-in'
        }).then(function (modal) {
            $scope.noteModal = modal;
        });

        var searchButtonIonItem = {
            addButton: true
        };

        var loadingMoreButton = {
            loadingMore: true
        };

        viewModel.shopCategories = function ($event) {
            shopCategoriesProvider.show($scope, $event, viewModel.categories);
        };

        viewModel.inCartText = function (product, count) {
            if (count > 1) {
                return product.description_label[product.description_label.length - 1];
            } else {
                return product.description_label[0];
            }
        };

        viewModel.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        viewModel.goToCart = function () {
            $state.go('app.shoppingCart');
        };

        viewModel.cartCount = function () {
            return ShoppingService.getCartItemCount();
        };

        function loadNextAvailableDelivery() {
            AccountService.getNextAvailability().then(function (nextAvailable) {
                viewModel.nextAvailability = nextAvailable;
                viewModel.nextAvailableErrorHappened = false;
            }, function (error) {
                viewModel.nextAvailableErrorHappened = true;
                LogService.critical([error, 'Error loading next availablity.']);
            });
        }

        function loadCategoriesFromServer() {
            ShoppingService.getCategories(true).then(function (data) {
                viewModel.categories = data;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (error) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        viewModel.startShoppingClick = function () {
            $state.go('app.categories');
        };

        viewModel.accountClick = function () {
            $state.go('app.account');
        };

        function getSaleCategory() {
            var saleCat = viewModel.categories.find(function (x) {
                return x.name == 'On Sale';
            });
            return saleCat;
        }

        viewModel.saleCategoryClick = function () {
            try {
                var parentCat = getSaleCategory();
                if (parentCat.category_count < 1) {
                    $state.go('app.products', { category: angular.toJson(parentCat) });
                } else {
                    $state.go('app.subcategories', { parentCat: angular.toJson(parentCat) });
                }
            } catch (e) {
                LogService.error(e);
                $state.go('app.subcategories', { parentCat: angular.toJson(parentCat) });
            }
        };

        viewModel.yourRecentItemsClick = function () {
            $state.go('app.recentProducts');
        };

        viewModel.webFeatureClick = function (feature) {
            $state.go('app.products', { category: angular.toJson(feature.category) });
        };

        viewModel.categoryClick = function (category) {
            $state.go('app.products', { category: angular.toJson(category) });
        };

        viewModel.featureClick = function (feature) {
            try {
                if (feature.category.category_count < 1) {
                    $state.go('app.products', { category: angular.toJson(feature.category) });
                } else {
                    $state.go('app.subcategories', { parentCat: angular.toJson(feature.category) });
                }
            } catch (e) {
                LogService.error(e);
                $state.go('app.subcategories', { parentCat: angular.toJson(feature.category) });
            }
        };

        viewModel.refreshData = function () {
            $rootScope.$broadcast('refresh.user-data');
        };

        viewModel.loadData = loadData;
        function loadData() {
            loadFeatures();
            loadFeatureToggles();
            loadNextAvailableDelivery();
            loadCategoriesFromServer();
            loadStore();
            setDefaultShoppingAddressText();
            defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
        }

        $rootScope.$on('refreshed.user-data', function () {
            loadData();
        });

        function loadStore() {
            try {
                viewModel.store = AccountService.getCustomerStore();
                viewModel.chooseStoreEnabled = AccountService.checkFeature("chooseStoreInApp");
            } catch (e) {
                viewModel.store = null;
            }
        }

        function loadFeatures() {
            PromoFeaturesService.getPromoFeatures().then(function (data) {
                viewModel.errorGettingFeatures = false;
                viewModel.featurePromos = data;
            }, function (error) {
                viewModel.errorGettingFeatures = true;
            });
        }

        function loadFeatureToggles() {
            viewModel.featureToggles = {};
            viewModel.featureToggles.isChangeStoreVariant = FeatureService.getFeatureToggle(FEATURE_TOGGLES.CHANGE_STORE_VARIANT);
            viewModel.featureToggles.isInstantSearchEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_INSTANT_SEARCH_ENABLED);
        }

        $scope.$on('$ionicView.beforeEnter', function () {
            loadData();
        });

        $scope.$on('user.loggedin', function (event, data) {
            $log.info('home screen user.loggedin');
            loadData();
        });

        $rootScope.$on('refresh.user-data', function (event, data) {
            loadData();
            ShoppingCartService.loadServerCart().then(function () {
                refreshCartItems();
            });
        });

        $scope.$on('user.registered', function (event, data) {
            $log.info('home screen user.registered');
            loadData();
        });

        $scope.$on('nav.home-menu-item-click', function (event, data) {
            $log.info('home screen nav.home-menu-item-click');
            $scope.clearSearch();
        });

        $rootScope.$on('nav.home-menu-item-click', function (event, data) {
            $log.info('home screen nav.home-menu-item-click');
            $scope.clearSearch();
        });

        loadData();

        $scope.searchSubmit = function (value) {
            var val = $scope.search.searchQuery;
            if (!val || val == "" || val == 'undefined') {
                $scope.searching = false;
                lastSearchText = "";
            } else {
                $scope.searching = true;
                $scope.filterText = val;
                searchForProducts($scope.filterText);
                $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            }
        };

        $scope.$watch('search.searchQuery', function (val) {
            var val = $scope.search.searchQuery;
            if (!val || val == "" || val == 'undefined') {
                $scope.searching = false;
                lastSearchText = "";
            } else if (viewModel.featureToggles.isInstantSearchEnabled) {
                $scope.searchSubmit();
            }
        });

        function addMoreLoadingThing() {
            $scope.searchResults.push(loadingMoreButton);
        }

        function removeLoadingThing() {
            var index = $scope.searchResults.map(function (el) {
                return el.loadingMore;
            }).indexOf(loadingMoreButton.loadingMore);
            if (index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function removeAddSpecialButton() {
            var index = $scope.searchResults.map(function (el) {
                return el.addButton;
            }).indexOf(searchButtonIonItem.addButton);
            if (index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function searchForProducts(text) {
            if (!text || text == "") return;
            if (text != lastSearchText) {
                //reset search params if the search is different
                AppAnalytics.productSearch(text);
                $scope.searchResults = null;
                current_page = 0;
                lastSearchText = text;
            } else if (total_pages != null && total_pages <= current_page) {
                //this will catch searches that were not supposed to happen
                return false;
            }
            var searchPromise = ProductService.searchForGroceryProducts(text, current_page).then(function (results) {
                current_page = results.current_page;
                total_pages = results.total_pages;
                if ($scope.searchResults && $scope.searchResults.length > 1) {
                    //add items to the end of the array
                    angular.forEach(results.products, function (item) {
                        $scope.searchResults.push(item);
                    });
                } else {
                    $scope.searchResults = results.products;
                }
                if (current_page == total_pages || total_pages == 0) {
                    if (!$scope.searchResults) $scope.searchResults = [];
                    $scope.searchResults.push(searchButtonIonItem);
                } else {
                    removeAddSpecialButton();
                    removeLoadingThing();
                    if ($scope.searchResults.length > 0) {
                        $scope.searchResults.push(searchButtonIonItem);
                    }

                    if (current_page == total_pages) {
                        removeLoadingThing();
                    } else {
                        addMoreLoadingThing();
                        removeAddSpecialButton();
                    }
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            }, function (error) {
                LogService.error({
                    message: 'Error Searching For Product',
                    error: error
                });
            });
        }

        $scope.clearSearch = function () {
            $scope.searching = false;
            $scope.search.searchQuery = null;
            $scope.searchResults = [];
            $ionicScrollDelegate.$getByHandle('homeScroll').scrollTop(true);
            $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            // $timeout(function () {
            //      $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            // }, 100);
        };

        angular.element('#clearSearchTextHome').on('touchstart', function () {
            $timeout(function () {
                $scope.search.searchQuery = '';
            }, 1);
        });

        angular.element('#homeIonContent').on('touchstart', function () {
            $log.info('#homeIonContent touchstart');
            $timeout(function () {
                $log.info('#homeIonContent timeout');
                if (window.cordova) {
                    $log.info('#homeIonContent window.cordova');
                    if ($cordovaKeyboard.isVisible()) {
                        $log.info('#homeIonContent cordovaKeyboard.close');
                        $cordovaKeyboard.close();
                    }
                }
            }, 1);
        });

        $scope.searchFocus = function () {
            $ionicScrollDelegate.$getByHandle('homeScroll').scrollTop(true);
            searchFocused = true;
            $scope.showCancelSearch = true;
        };

        $scope.searchUnFocus = function () {
            searchFocused = false;
            if ($scope.searching) {
                $scope.showCancelSearch = true;
            } else {
                $scope.showCancelSearch = false;
            }
            if (window.cordova && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
        };

        $scope.addItem = function (product) {
            if (canClickInList()) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                refreshCartItems();
                AppAnalytics.addProductToCart(product, 'search');
            }
        };

        $scope.removeItemFromCart = function (product) {
            if (canClickInList()) {
                ShoppingService.removeOneProductFromCart(product);
                refreshCartItems();
            }
        };

        $scope.cartItemCountForProduct = function (product, includeZero) {
            if (product) {
                var found = $scope.cartItems().find(function (x) {
                    return x.product.id == product.id;
                });
                if (found) {
                    if (product.product_type != "by weight") {
                        return parseInt(found.qty);
                    } else if (product.has_custom_label) {
                        return parseInt(found.qty * 100 / (product.unit_weight * 100));
                    } else {
                        return parseFloat(found.qty);
                    }
                } else if (includeZero) {
                    return 0;
                }
            }
        };

        $scope.removeCartItemForProductFromCartCompletely = function (product) {
            if (canClickInList()) {
                ShoppingService.removeProductsCartItemFromCart(product);
                refreshCartItems();
            }
        };

        $scope.productInCart = function (product) {
            if (!product) {
                return false;
            }
            var index = $scope.cartItems().map(function (el) {
                return el.product.id;
            }).indexOf(product.id);
            return index > -1;
        };

        $ionicModal.fromTemplateUrl('app/groceries/shop/productDetail/productDetailModal.html', { scope: $scope }).then(function (modal) {
            $scope.productDetailModal = modal;
        });

        $scope.productDetail = function (product) {
            if (canClickInList()) {
                if (product.addButton) {
                    $scope.addCustomProduct();
                    return;
                }
                $scope.productDetailProduct = product;
                $scope.productDetailModal.show();
                AppAnalytics.viewProduct(product, 'search');
            }
        };

        $scope.closeProductDetail = function () {
            $scope.productDetailModal.hide();
            $scope.productDetailProduct = null;
        };

        $scope.getItemClass = function (product) {
            if (!product) return '';
            if (product.addButton) {
                return 'item-stable item-no-border';
            } else if (product.loadingMore) {
                return 'item-loading-more';
            }
        };

        $scope.addCustomProduct = function () {
            $ionicModal.fromTemplateUrl('app/groceries/shop/customProduct/addCustomProductModal.html', {
                scope: $scope,
                focusFirstInput: true
            }).then(function (modal) {
                $scope.addCustomProductModal = modal;
                $scope.addCustomProductModal.show();
            });
        };

        $scope.$on('close.addCustomProduct', function () {
            $scope.addCustomProductModal.hide();
            refreshCartItems();
        });

        $scope.cartItems = function () {
            return ShoppingService.getCartItems();
        };

        $scope.cartCount = function () {
            return ShoppingService.getCartItemCount();
        };

        $scope.addNoteForProduct = function (product) {
            if (product) {
                var index = $scope.cartItems().map(function (el) {
                    return el.product.id;
                }).indexOf(product.id);

                if (index > -1) {
                    $scope.notePopoverItem = $scope.cartItems()[index];
                    $scope.noteModal.show();
                    $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
                }
            }
        };

        $scope.$on('close.productNotes', function (event, data) {
            $scope.notePopoverItem.note = data;
            ShoppingService.updateNoteOnItem($scope.notePopoverItem);
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
            refreshCartItems();
        });

        $scope.$on('cancel.productNotes', function () {
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.moreDataCanBeLoadedSearch = function () {
            if (!$scope.searching || total_pages == 0) {
                return false;
            }
            if (total_pages) {
                if ($scope.searchResults.length > 1) {
                    if (total_pages > current_page) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        };

        $scope.loadMoreSearchItems = function () {
            searchForProducts($scope.search.searchQuery);
        };

        $scope.moreDataCanBeLoaded = function () {
            if ($scope.dataLoaded) {
                return false;
            } else {
                return true;
            }
        };

        var imageModal = null;
        $scope.imageModalImageUrl = '';
        $scope.openImageModal = function (product) {
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                imageModal = modal;
                var url = '';
                try {
                    if (product.images.length > 0 && product.images[0].original_size_url) {
                        url = product.images[0].original_size_url;
                    }
                } catch (exception) {
                    LogService.error(exception);
                }
                $scope.imageModalImageUrl = url;
                $ionicSlideBoxDelegate.slide(0);
                imageModal.show();
            });
        };

        $scope.closeImageModal = function () {
            imageModal.hide();
        };

        $scope.imageSlideChanged = function () {
            imageModal.hide();
        };

        function refreshCartItems() {
            $scope.cartItems();
            $scope.cartCount();
        }

        function canClickInList() {
            return true;
        }

        function setDefaultShoppingAddressText() {
            try {
                var address = AccountService.getCustomerDefaultShoppingAddress();
                if (address) {
                    viewModel.defaultShoppingAddressText = address.street1;
                }
            } catch (e) {
                $log.error(e);
            }
        };

        viewModel.searchButtonText = function () {
            if (viewModel.store && defaultShoppingAddress) {
                return "Search " + viewModel.store.name + ", " + defaultShoppingAddress.zip_code;
            } else {
                return "Search All Products";
            }
        };

        viewModel.clickEditShoppingAddressButton = function () {
            if (AccountService.checkFeature("chooseStoreInApp")) {
                //open up the choose store modal in address mode
                chooseStoreModal.showModal($scope, null, viewModel.store, true).then(function (store) {
                    viewModel.store = store;
                });
            }
        };

        viewModel.nextAvailableDeliveryMessage = function () {
            if (viewModel.nextAvailability) {
                return viewModel.nextAvailability.message + " " + viewModel.nextAvailability.window;
            } else {
                return "Next Delivery: Loading...";
            }
        };

        viewModel.getPrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                    var unit_of_measure = "lb";
                } else {
                    var unit_of_measure = product.unit_of_measure;
                }

                return $filter('currency')(product.price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.price);
            }
        };

        viewModel.getSalePrice = function (product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                var unit_of_measure = "lb";
            } else {
                var unit_of_measure = product.unit_of_measure;
            }

            if (product.product_type == 'by weight') {
                return $filter('currency')(product.sale_price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.sale_price);
            }
        };
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('IntroModalProvider', ['$rootScope', '$ionicModal', '$ionicSlideBoxDelegate', 'common', 'chooseStoreModal', 'AuthService', 'AppAnalytics', IntroModalProvider]);

    function IntroModalProvider($rootScope, $ionicModal, $ionicSlideBoxDelegate, common, chooseStoreModal, AuthService, AppAnalytics) {

        var introModal,
            welcomeModal = null;

        var initIntroModal = function initIntroModal($scope) {
            var promise;
            var tpl = 'app/groceries/intro/intro.html';
            $scope = $scope || $rootScope.$new();
            if (!introModal) {
                $ionicModal.fromTemplateUrl(tpl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    introModal = modal;
                    if (!hasIntroModalBeenShown()) {
                        AppAnalytics.track('introModalShown');
                        modal.show();
                    }
                });
            } else {
                if (!hasIntroModalBeenShown()) {
                    introModal.show();
                }
            }
            $scope.closeIntro = function () {
                if ($scope.slideIndex != 3) {
                    $scope.next();
                } else {
                    setIntroModalShown();
                    introModal.hide();
                    chooseStoreModal.showIfNeeded();
                }
            };
            $scope.slideChanged = function (index) {
                $scope.slideIndex = index;
            };
            $scope.next = function () {
                $ionicSlideBoxDelegate.next();
            };
            $scope.previous = function () {
                $ionicSlideBoxDelegate.previous();
            };
        };

        var initWelcomeModal = function initWelcomeModal($scope) {
            var promise;
            var tpl = 'app/groceries/intro/welcome.html';
            $scope = $scope || $rootScope.$new();
            if (!welcomeModal && !webVersion) {
                $ionicModal.fromTemplateUrl(tpl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    welcomeModal = modal;
                    welcomeModal.show();
                    AppAnalytics.track('splashScreenShown');
                });
            } else if (webVersion) {
                common.checkLogin();
            } else {
                welcomeModal.show();
            }
            $scope.closeWelcomeIntro = function (screenToShow) {
                if (screenToShow == 'login') {
                    common.checkLogin();
                } else {
                    $rootScope.$broadcast('show-register-page');
                }
                welcomeModal.hide();
            };
        };

        function setIntroModalShown() {
            localStorage.setItem("intro-modal-shown", JSON.stringify({ shown: true, customer_id: AuthService.getUserInfo().id }));
        }

        function hasIntroModalBeenShown() {
            try {
                var shown = JSON.parse(localStorage.getItem("intro-modal-shown"));
                return shown.shown == true && shown.customer_id == AuthService.getUserInfo().id;
            } catch (e) {
                return false;
            }
        }

        return {
            showIntroModal: initIntroModal,
            showWelcomModal: initWelcomeModal,
            hasIntroModalBeenShown: hasIntroModalBeenShown
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('ContactUsController', ['$scope', '$rootScope', '$state', 'UIUtil', '$log', 'LogService', '$cordovaEmailComposer', ContactUsController]);

    function ContactUsController($scope, $rootScope, $state, UIUtil, $log, LogService, $cordovaEmailComposer) {

        var viewModel = this;

        viewModel.emailClick = function () {
            try {
                if ('cordova' in window) {
                    $cordovaEmailComposer.isAvailable().then(function () {
                        var email = {
                            to: 'support@shipt.com',
                            subject: 'In-App Support',
                            body: '',
                            isHtml: true
                        };
                        $cordovaEmailComposer.open(email).then(null, function () {
                            // user cancelled email
                        });
                    }, function () {
                        window.open('mailto:support@shipt.com', '_system', 'location=yes');return false;
                    });
                } else {
                    window.open('mailto:support@shipt.com', '_system', 'location=yes');return false;
                }
            } catch (exception) {
                LogService.error(['viewModel.emailClick', exception]);
            }
        };

        viewModel.callClick = function () {
            window.open('tel:205-502-2500', '_system', 'location=yes');return false;
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('HelpController', ['$scope', '$rootScope', '$state', 'UIUtil', '$log', 'VersionProvider', 'HelpService', '$filter', HelpController]);

    function HelpController($scope, $rootScope, $state, UIUtil, $log, VersionProvider, HelpService, $filter) {

        var viewModel = this;

        viewModel.navToFaq = function () {
            $state.go('app.faq');
        };

        viewModel.contactClick = function () {
            $state.go('app.contactUs');
        };

        viewModel.showFaq = function () {
            if (webVersion) {
                return false;
            } else {
                return true;
            }
        };

        function loadVersion() {
            try {
                VersionProvider.getVersionObject().then(function (version) {
                    viewModel.version = version;
                });
            } catch (exception) {
                $log.error(exception);
            }
        }

        viewModel.searchArticles = [];
        viewModel.searchQuery = "";
        viewModel.showSearch = false;

        function loadFaq() {
            viewModel.loadingSpinner = true;
            HelpService.getFaqs().then(function (data) {
                viewModel.articles = data;
                viewModel.loadingSpinner = false;
            }, function (error) {
                viewModel.errorHappened = true;
                viewModel.loadingSpinner = false;
            });
        }

        viewModel.clearSearch = function () {
            viewModel.searchQuery = '';
        };

        viewModel.showList = function () {
            if (!viewModel.articles) return false;
            if (viewModel.articles.length < 1) return false;
            return true;
        };

        viewModel.articleClick = function (category) {
            $state.go('app.faq', { category: angular.toJson(category) });
        };

        loadFaq();

        loadVersion();
    }
})();
/**
 * Created by patrick on 3/3/15.
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('RegisterController', ['$scope', '$log', '$rootScope', 'UIUtil', 'AuthService', 'LogService', 'ErrorHandler', 'AppAnalytics', 'Registration', RegisterController]);

    function RegisterController($scope, $log, $rootScope, UIUtil, AuthService, LogService, ErrorHandler, AppAnalytics, Registration) {

        $log.info('LoginController loaded');

        AppAnalytics.track('registerModalStart');
        $scope.invalidLogin = false;
        $scope.login = {
            username: null,
            password: null
        };

        $scope.invalidRegisterMessage = "Registration Invalid";
        $scope.errorRegisterMessage = "There was an error.";

        $scope.registerSubmit = function (registerData) {
            var validationErrors = Registration.validate(registerData);
            if (validationErrors.length === 0) {
                // Validation passed
                UIUtil.showLoading();
                var newUserData = angular.copy(registerData);
                var builtRegistrationData = Registration.build(newUserData);
                AuthService.registerUser(builtRegistrationData).then(function (data) {
                    registerData = null;
                    $scope.register = null;
                    $scope.loginError = false;
                    $scope.invalidLogin = false;
                    //fire off the event telling the app that there has been a successful login
                    $rootScope.$broadcast('user.registered', data);
                }, function (error) {
                    if (error.errors && error.errors.zip_code) {
                        //handle custom messaging for zip code errors.
                        ErrorHandler.displayShiptAPIError(null, 'Oh no!', error.errors.zip_code[0]);
                    } else {
                        ErrorHandler.displayShiptAPIError(error);
                    }
                    if (error) {
                        $scope.invalidLogin = true;
                        $scope.loginError = false;
                    } else {
                        $scope.loginError = true;
                        $scope.invalidLogin = false;
                    }
                    AppAnalytics.track('registration_error', {
                        errors: error.errors,
                        zip_code: builtRegistrationData.zip_code,
                        email: builtRegistrationData.email
                    });
                })['finally'](function () {
                    UIUtil.hideLoading();
                });
            } else {
                // Validation errors
                UIUtil.showMultiErrorAlert(validationErrors);
            }
        };

        $scope.signUp = function () {
            $log.info('signup');
        };

        $scope.cancelRegister = function () {
            $rootScope.$broadcast('cancel-register');
        };
    }
})();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('shiptApp').factory('Registration', [Register]);

    function Register() {

        /**
         * Represents the mapping of a registration object to the API.
         */

        var RegisterEntity = function RegisterEntity(data) {
            _classCallCheck(this, RegisterEntity);

            this.email = data.email;
            this.name = data.name;
            this.password = data.password;
            this.phone = data.phone;
            this.zip_code = data.zip.toString();
        };

        return {
            build: buildRegistrationEntity,
            validate: getValidationErrors
        };

        /**
         * @ngdoc function
         * @name buildRegistrationEntity
         * @description Builds a UI registration object to be persisted through the API.
         *
         * @param registerData The registration data.
         * @returns {RegisterEntity} The registration object ready for persistence.
         */
        function buildRegistrationEntity(registerData) {
            return new RegisterEntity(registerData);
        }

        /**
         * @ngdoc function
         * @name getValidationErrors
         * @description Validates registration data.
         *
         * @param registerData The registration data to validate.
         * @returns {Array} The list of validation errors. Empty if none.
         */
        function getValidationErrors(registerData) {
            var validationErrors = [];

            // Validate password
            var passwordMinLength = 6;
            if (registerData.password.length < passwordMinLength) {
                validationErrors.push('Password must be at least ' + passwordMinLength + ' characters long.');
            }

            // Validates zip code
            if (!registerData.zip || !Number(registerData.zip)) {
                validationErrors.push('Please enter a valid zip code.');
            }

            return validationErrors;
        }
    }
})();
/**
 * Created by patrick on 2/24/15.
 */

'use strict';

(function () {
    'use strict';

    var serviceId = 'AccountService';

    var needsCustomerInfoRefresh = false;

    angular.module('shiptApp').factory(serviceId, ['$http', '$q', 'LogService', '$log', 'AuthService', 'ApiEndpoint', '$rootScope', '$timeout', 'VersionProvider', 'DefaultHeaders', 'FeatureService', AccountService]);

    function AccountService($http, $q, LogService, $log, AuthService, ApiEndpoint, $rootScope, $timeout, VersionProvider, DefaultHeaders, FeatureService) {

        var service = {
            getCustomerInfo: getCustomerInfo,
            isCustomerGuest: isCustomerGuest,
            customerAddressObject: customerAddressObject,
            creditCartObject: creditCartObject,
            customerObject: customerObject,
            updateAddress: updateAddress,
            addAddress: addAddress,
            updateCard: updateCard,
            saveNewCard: saveNewCard,
            deleteCard: deleteCard,
            getOrders: getOrders,
            deleteAddress: deleteAddress,
            refreshCustomerInfo: refreshCustomerInfoShort,
            registerUserForPush: registerUserForPush,
            updateAccountInfo: updateAccountInfo,
            cancelOrder: cancelOrder,
            getOrder: getOrder,
            getNextAvailability: getNextAvailability,
            refreshCustomerInfoShort: refreshCustomerInfoShort,
            getOrdersFromServer: getOrdersFromServer,
            getAddressesFromServer: getAddressesFromServer,
            getCardsFromServer: getCardsFromServer,
            getCustomerStore: getCustomerStore,
            checkFeature: checkFeature,
            getAddress: getAddress,
            getCustomerDefaultShoppingAddress: getCustomerDefaultShoppingAddress
        };

        DefaultHeaders.customer();

        $rootScope.$on('refresh.user-data', function (event, data) {
            needsCustomerInfoRefresh = true;
            refreshCustomerInfo();
        });

        return service;

        function addDefaultHeaders() {
            DefaultHeaders.customer();
        }

        function isCustomerGuest() {
            try {
                var customerInfo = AuthService.getCustomerInfo();
                if (customerInfo && typeof customerInfo.guest_account != 'undefined') {
                    return customerInfo.guest_account;
                } else {
                    return true;
                }
            } catch (exception) {
                LogService.error(['isCustomerGuest', exception]);
            }
        }

        function cancelOrder(order) {
            addDefaultHeaders();
            var rootUrl = ApiEndpoint.apiurl;
            var orderId = order.id;
            LogService.info([orderId + ' :: User Canceling Order', order]);
            var serviceUrl = rootUrl + '/api/v1/orders/' + orderId + '/cancel.json';
            return $http({
                url: serviceUrl,
                method: "PATCH"
            });
        }

        function getNextAvailability() {
            var defer = $q.defer();
            if (!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return defer.promise;
            }
            var platform = VersionProvider.getPlatformName();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customers/next_delivery_availablity.json',
                method: "GET",
                params: { device_type: platform }
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function registerUserForPush(deviceToken) {
            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();
            var customerId = AuthService.getCustomerInfo().id;
            var deviceType;
            if (isIOS) {
                deviceType = 'ios';
            } else if (isAndroid) {
                deviceType = 'android';
            }

            addDefaultHeaders();

            var rootUrl = ApiEndpoint.apiurl;
            var serviceUrl = rootUrl + '/api/v1/customers/' + customerId + '.json';

            //PATCH

            return $http({
                url: serviceUrl,
                method: "PATCH",
                data: {
                    device_token: deviceToken,
                    device_type: deviceType
                }
            });
        }

        function updateAccountInfo(accountInfo) {
            addDefaultHeaders();
            var rootUrl = ApiEndpoint.apiurl;
            var customerId = AuthService.getCustomerInfo().id;
            var serviceUrl = rootUrl + '/api/v1/customers/' + customerId + '.json';
            return $http({
                url: serviceUrl,
                method: "PATCH",
                data: accountInfo
            });
        }

        function getCustomerStore() {
            if (FeatureService.chooseStoreInApp()) {
                var store = AuthService.getCustomerInfo().store;
                return store;
            } else {
                return {
                    image: "img/shipt_text_white.png",
                    name: "Shipt",
                    background_color: "#61A43D"
                };
            }
        }

        function getCustomerDefaultShoppingAddress() {
            try {
                var customer = AuthService.getCustomerInfo();
                var currentDefaultAddress = customer.customer_addresses.find(function (a) {
                    return a.id == customer.default_shopping_address_id;
                });
                return currentDefaultAddress;
            } catch (e) {
                $log.error(e);
            }
        }

        function checkFeature(featureFunction) {
            return FeatureService[featureFunction]();
        }

        function getCustomerInfo(force) {
            if (force === true) {
                return AuthService.getCustomerInfo();
            }
            var defer = $q.defer();

            if (needsCustomerInfoRefresh) {
                return refreshCustomerInfo();
            } else {
                var custInfo = AuthService.getCustomerInfo();
                if (custInfo) {
                    defer.resolve(custInfo);
                } else {
                    defer.reject(null);
                }
            }

            return defer.promise;
        }

        function refreshCustomerInfoShort() {
            var custId = AuthService.getCustomerId();
            var defer = $q.defer();
            if (!custId) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            var custInfo = AuthService.getCustomerInfo();
            $http({
                url: ApiEndpoint.apiurl + custInfo.short_version_url,
                method: "GET"
            }).success(function (data) {
                AuthService.saveAuthToken(data);
                needsCustomerInfoRefresh = false;
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function refreshCustomerInfo() {
            var custId = AuthService.getCustomerId();
            var defer = $q.defer();
            if (!custId) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            $log.info('refreshCustomerInfo');
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customers/' + custId + '.json',
                method: "GET"
            }).success(function (data) {
                AuthService.saveAuthToken(data);
                needsCustomerInfoRefresh = false;
                $rootScope.$broadcast('refreshed.user-data');
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function deleteAddress(deleteAddress) {
            var defer = $q.defer();
            $log.info('getCustomerData');
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_addresses' + "/" + deleteAddress.id,
                method: "DELETE"
            }).success(function (data) {
                $log.info('success', data);
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function updateAddress(updatedAddress) {
            var defer = $q.defer();
            $log.info('getCustomerData');
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_addresses' + '/' + updatedAddress.id,
                method: "PATCH",
                data: updatedAddress
            }).success(function (data) {
                $log.info('success', data);
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function addAddress(newAddress) {
            var defer = $q.defer();
            $log.info('addAddress requesting', newAddress);
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + AuthService.getCustomerInfo().create_customer_address_url,
                method: "POST",
                data: newAddress
            }).success(function (data) {
                $log.info('success', data);
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function getAddress(id) {
            var defer = $q.defer();
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_addresses/' + id + '.json',
                method: "GET"
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function getAddressesFromServer() {
            var custInfo = AuthService.getCustomerInfo();
            var defer = $q.defer();
            if (!custInfo) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_addresses.json',
                method: "GET"
            }).success(function (data) {
                defer.resolve(data);
                custInfo.customer_addresses = data.customer_addresses;
                AuthService.saveAuthToken(custInfo);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function getCardsFromServer() {
            var custInfo = AuthService.getCustomerInfo();
            var defer = $q.defer();
            if (!custInfo) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/credit_cards.json',
                method: "GET"
            }).success(function (data) {
                defer.resolve(data);
                custInfo.credit_cards = data.credit_cards;
                AuthService.saveAuthToken(custInfo);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function updateCard(updateCard) {
            $log.info('updateCard service', updateCard);
        }

        function deleteCard(card) {
            var defer = $q.defer();
            $log.info('deleteCard service', card);
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/credit_cards/' + card.id,
                method: "DELETE"
            }).success(function (data) {
                $log.info('success', data);
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function saveNewCard(newCard) {
            // format exp date for stripe
            if (newCard.exp_date) {
                newCard.exp = newCard.exp_date.slice(0, 2) + "/" + newCard.exp_date.slice(2, 4);
            }

            $log.info('saveNewCard service', newCard);

            var defer = $q.defer();
            setStripePublishableKey();
            Stripe.card.createToken(newCard, function (status, response) {
                if (response.error) {
                    $log.error('Stripe tokenization error', response.error);
                    defer.reject(response.error.message);
                } else {
                    $log.info('Stripe tokenization success', response);
                    var token = { card_token: response.id };
                    saveStripeCardToken(token, defer); // send to shipt servers
                }
            });
            return defer.promise;
        }

        function saveStripeCardToken(token, defer) {
            $http({
                url: ApiEndpoint.apiurl + AuthService.getCustomerInfo().create_credit_cards_url,
                method: "POST",
                data: token
            }).success(function (data) {
                $log.info('Credit Card Saved', data);
                defer.resolve(data);
            }).error(function (error) {
                $log.error('saveCardStripeToken error', error);
                defer.reject(error);
            });
        }

        function setStripePublishableKey() {
            var stripe_key = AuthService.getCustomerInfo().config.stripe_api_public_key;
            Stripe.setPublishableKey(stripe_key);
        }

        function getOrders() {
            var custInfo = AuthService.getCustomerInfo();
            return custInfo ? custInfo.orders : [];
        }

        function getOrdersFromServer() {
            var custInfo = AuthService.getCustomerInfo();
            var defer = $q.defer();
            if (!custInfo) {
                defer.resolve(null);
                return defer.promise;
            }
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customers/orders.json',
                method: "GET"
            }).success(function (data) {
                defer.resolve(data);
                custInfo.orders = data.orders;
                AuthService.saveAuthToken(custInfo);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function getOrder(id) {
            addDefaultHeaders();
            return $http({
                url: ApiEndpoint.apiurl + "/api/v1/orders/" + id + ".json",
                method: "GET"
            });
        }

        //TODO these need to be moved out to the common.model and re worked to match everything on the server side
        function customerAddressObject() {
            this.id = 0;
            this.street1 = "";
            this.street2 = "";
            this.city = "";
            this.zip_code = "";
            this.metro_id = 0;
            this.state = "";
            this.created_at = null;
            this.updated_at = null;
        }

        function creditCartObject() {
            this.id = 0;
            this.cutomer_id = 0;
            this.last_4_digits = "";
            this.exp_date = null;
            this.created_at = null;
            this.updated_at = null;
            this.stripe_id = 0;
        }

        function customerObject() {
            this.id = 0;
            this.name = "";
            this.email = "";
            this.phone = "";
            this.password = "";
            this.created_at = "";
            this.updated_at = "";
            this.stripe_subscription_id = "";
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').service('FavoriteItem', FavoriteItem);

    FavoriteItem.$inject = ['$log', '$q', '$http', 'LogService', 'DefaultHeaders', 'ApiEndpoint', 'AppAnalytics'];

    function FavoriteItem($log, $q, $http, LogService, DefaultHeaders, ApiEndpoint, AppAnalytics) {

        this.list = function (page) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/favorite_items.json",
                params: {
                    page: page
                }
            };
            DefaultHeaders.customer();
            $http(req).success(function (data) {
                $log.debug('getFavoritedItems from server success', data);
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        };

        this.listIds = function () {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/favorite_items/list_ids.json"
            };
            DefaultHeaders.customer();
            $http(req).success(function (data) {
                $log.debug('favorite_items/list_ids from server success', data);
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        };

        this.addProduct = function (item) {
            $log.info('FavoriteItem.addItem', item);
            item.favorite = true;
            var defer = $q.defer();
            var req = {
                method: 'POST',
                url: ApiEndpoint.apiurl + "/api/v1/favorite_items.json",
                data: {
                    favoritable_id: item.id,
                    favoritable_type: "Product"
                }
            };
            DefaultHeaders.customer();
            AppAnalytics.track('favoriteProduct', item);
            $http(req).success(function (data) {
                $log.debug('added favorite_items', data);
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        };

        this.removeProduct = function (item) {
            $log.info('FavoriteItem.removeProduct', item);
            item.favorite = false;
            var defer = $q.defer();
            var req = {
                method: 'POST',
                url: ApiEndpoint.apiurl + "/api/v1/favorite_items/remove_favorite_item.json",
                params: {
                    favoritable_type: "Product",
                    id: item.id
                }
            };
            DefaultHeaders.customer();
            AppAnalytics.track('unFavoriteProduct', item);
            $http(req).success(function (data) {
                $log.debug('DELETE favorite_items', data);
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('MealKits', ['$http', '$log', '$q', '$timeout', 'LogService', 'AuthService', 'ApiEndpoint', 'DefaultHeaders', 'ShoppingCartService', MealKits]);

    function MealKits($http, $log, $q, $timeout, LogService, AuthService, ApiEndpoint, DefaultHeaders, ShoppingCartService) {

        var service = {
            getMealKits: getMealKits,
            addMealKitToCart: addMealKitToCart
        };

        function addMealKitToCart(mealKit) {
            ShoppingCartService.addProductToCart(mealKit);
        }

        function getMealKits() {
            try {
                var defer = $q.defer();
                $timeout(function () {
                    var mealKits = [{
                        title: 'One Pot Vegetarian',
                        sub_title: 'One pot is all you need to create these satisfying and comforting meatless meals, all packed with hearty ingredients.',
                        title_image: 'http://cms.matchmakefood.com/media/1529/ingredient-landscape.jpg?preset=L',
                        serves_text: '14 Ingredients • 3 recipes for 2 to 10 people',
                        servings: [{
                            id: 3,
                            description: "3 Meals for 2 People",
                            per_meal: "$20 per meal",
                            price: 37.19
                        }, {
                            id: 534,
                            description: "5 Meals for 2 People",
                            per_meal: "$20 per meal",
                            price: 57.19
                        }, {
                            id: 333,
                            description: "9 Meals for 2 People",
                            per_meal: "$20 per meal",
                            price: 97.19
                        }]
                    }, {
                        title: 'Miso and Soy',
                        sub_title: 'Who says you need to go out for Japanese food? Take a culinary tour of Japan from your kitchen with these popular dishes.',
                        title_image: 'http://cms.matchmakefood.com/media/1475/ingredients-landscape.jpg?preset=L',
                        serves_text: '20 Ingredients • 3 recipes for 2 to 10 people',
                        servings: [{
                            id: 666,
                            description: "3 Meals for 2 People",
                            per_meal: "$20 per meal",
                            price: 657.19
                        }, {
                            id: 55,
                            description: "5 Meals for 2 People",
                            per_meal: "$20 per meal",
                            price: 1657.19
                        }]
                    }, {
                        title: 'Elegant Weeknight',
                        sub_title: 'Make 3 elegant, restaurant-worthy dinners at home - with ingredients like cod, steak, and polenta.',
                        title_image: 'http://cms.matchmakefood.com/media/1486/ingredients-landscape.jpg?preset=L',
                        serves_text: '14 Ingredients • 3 recipes for 2 to 10 people',
                        servings: [{
                            id: 88,
                            description: "3 Meals for 2 People",
                            per_meal: "$20 per meal",
                            price: 257.19
                        }, {
                            id: 9,
                            description: "5 Meals for 2 People",
                            per_meal: "$20 per meal",
                            price: 1257.19
                        }]
                    }];
                    defer.resolve(mealKits);
                }, 1);
                return defer.promise;
            } catch (e) {}
        }

        return service;
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('OrderRating', ['$http', 'AuthService', 'ApiEndpoint', 'DefaultHeaders', 'AppAnalytics', OrderRatingModel]);

    function OrderRatingModel($http, AuthService, ApiEndpoint, DefaultHeaders, AppAnalytics) {

        function addDefaultHeaders() {
            DefaultHeaders.customer();
        }

        var OrderRating = function OrderRating(rating) {
            this.id = null;
            this.rating = null;
            this.comments = null;
            this.order_id = null;
            this.driver_id = null;
            this.wrong_items = false;
            this.missing_items = false;
            this.damaged_items = false;
            this.late_delivery = false;
            this.poor_replacements = false;
            this.unfriendly_driver = false;

            this.went_above_and_beyond = false;
            this.good_communication = false;
            this.friendly_driver = false;

            if (rating) {
                this.id = rating.id;
                this.rating = rating.rating;
                this.comments = rating.comments;
                this.wrong_items = rating.wrong_items;
                this.missing_items = rating.missing_items;
                this.damaged_items = rating.damaged_items;
                this.late_delivery = rating.late_delivery;
                this.poor_replacements = rating.poor_replacements;
                this.unfriendly_driver = rating.unfriendly_driver;

                this.went_above_and_beyond = rating.went_above_and_beyond;
                this.good_communication = rating.good_communication;
                this.friendly_driver = rating.friendly_driver;
            }
        };

        OrderRating.prototype.hasItemIssues = function () {
            if (this.wrong_items || this.missing_items || this.damaged_items || this.poor_replacements) {
                return true;
            } else {
                return false;
            }
        };

        OrderRating.prototype.save = function () {
            var self = this;
            if (self.isValid()) {
                addDefaultHeaders();
                AppAnalytics.rateShopper(self);
                if (!self.id) {
                    return $http({
                        url: ApiEndpoint.apiurl + '/api/v1/ratings.json',
                        method: "POST",
                        data: self
                    });
                } else {
                    return $http({
                        url: ApiEndpoint.apiurl + 'api/v1/ratings/' + self.id + '.json',
                        method: "PATCH",
                        data: self
                    });
                }
            }
        };

        OrderRating.prototype.isValid = function () {
            var self = this;
            console.log('is valid prototype method.');
            if (self.order_id && self.order_id && self.rating) {
                if (self.rating <= 5 && self.rating >= 1) {
                    return true;
                }
            }
            return false;
        };

        return OrderRating;
    }
})();
'use strict';

(function () {
    'use strict';

    var serviceId = 'PromoFeaturesService';

    angular.module('shiptApp').factory(serviceId, ['$http', '$q', 'LogService', '$log', 'AuthService', 'ApiEndpoint', '$rootScope', '$timeout', 'DefaultHeaders', PromoFeaturesService]);

    function PromoFeaturesService($http, $q, LogService, $log, AuthService, ApiEndpoint, $rootScope, $timeout, DefaultHeaders) {

        var service = {
            getPromoFeatures: getPromoFeatures
        };

        return service;

        function getPromoFeatures() {
            var deferred = $q.defer();
            var url = ApiEndpoint.apiurl + '/api/v1/feature_promotions.json';
            DefaultHeaders.customer();
            $http({
                url: url,
                method: "GET"
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    var serviceId = 'ShoppingCartService';

    angular.module('shiptApp').factory(serviceId, ['$http', '$rootScope', '$filter', 'LogService', '$q', '$timeout', 'ApiEndpoint', 'common', 'AuthService', '$log', 'DefaultHeaders', 'AppAnalytics', ShoppingCartService]);

    var keyLocalCartItems = 'localCartItems';

    function ShoppingCartService($http, $rootScope, $filter, LogService, $q, $timeout, ApiEndpoint, common, AuthService, $log, DefaultHeaders, AppAnalytics) {

        var service = {
            getCartTotal: getCartTotal,
            loadServerCart: getServerCart,
            getCartItems: getCartItems,
            getCartItemCount: getCartItemCount,
            updateNoteOnItem: updateNoteOnItem,
            addProductToCart: addProductToCart,
            addCustomProductToCart: addCustomProductToCart,
            removeOneProductFromCart: removeOneProductFromCart,
            removeProductsCartItemFromCart: removeProductsCartItemFromCart,
            clearCart: clearCart
        };

        var _cartItems = [];
        var lastRequest = null;
        var lastGetServerAddRequest = null;
        var lastGetServerSubtractRequest = null;
        var byWeightProductType = 'by weight';
        var bogoAmount = 2;

        //setting the auth token header for all requests from here.
        DefaultHeaders.customer();

        $rootScope.$on('cart.data.changed', function (event, data) {
            var cartItems = data ? data : getLocalCartItems();
            createServerCart(cartItems);
        });

        $rootScope.$on('get.cart.data.from.server', function () {
            getServerCart();
        });

        return service;

        var cartBaseApiUrl = null;
        var customer = null;

        $rootScope.$on('refresh.user-data', function (event, data) {
            cartBaseApiUrl = null;
        });

        function getShoppingCartBaseUrl() {
            try {
                //use the cart api url that is passed on the user but if not there use the regular api
                if (cartBaseApiUrl != null) {
                    return cartBaseApiUrl;
                } else {
                    var user = customer == null ? AuthService.getUserInfo() : customer;
                    if (user.shopping_cart_base_url) {
                        cartBaseApiUrl = user.shopping_cart_base_url;
                        return user.shopping_cart_base_url;
                    } else {
                        return ApiEndpoint.apiurl;
                    }
                }
            } catch (e) {}
        };

        function createServerCart(cartItems) {
            try {
                addDefaultHeaders();
                LogService.info(['createServerCart', cartItems]);
                _.each(cartItems, function (element, index, list) {
                    if (element.product) {
                        if (element.product.isCustom) {
                            element.product = _.pick(element.product, 'name');
                        } else {
                            element.product = _.pick(element.product, 'id');
                        }
                    }
                });

                if (lastRequest) lastRequest.cancel();
                var canceller = $q.defer();

                var cancel = function cancel() {
                    canceller.resolve('User Canceled Request');
                };

                var promise = $http.post(getShoppingCartBaseUrl() + '/api/shopping_cart/create.json', { items: cartItems }, { timeout: canceller.promise }).success(function (data) {
                    LogService.info(['createServerCart', data]);
                    saveServerCartToLocal(data);
                }).error(function (data, status, headers, config) {
                    if (status != 0) {
                        LogService.critical(['Error createServerCart', data, status, headers, config]);
                    }
                });

                //so we save only the last request. With the most up to date data...
                lastRequest = {
                    promise: promise,
                    cancel: cancel
                };
            } catch (exception) {
                LogService.critical(['saveCartToServer', exception]);
            }
        }

        function getServerCart() {
            try {
                var deferred = $q.defer();
                if (!AuthService.shouldMakeShiptApiCall()) {
                    deferred.resolve(null);
                    return;
                }
                addDefaultHeaders();
                $http({
                    method: 'GET',
                    url: getShoppingCartBaseUrl() + '/api/shopping_cart.json'
                }).success(function (data) {
                    if (data.length >= 0) {
                        saveServerCartToLocal(data);
                    }
                    deferred.resolve();
                }).error(function (data) {
                    LogService.critical(['getServerCart', data]);
                    deferred.reject();
                });

                return deferred.promise;
            } catch (exception) {
                LogService.critical(['getServerCart', exception]);
            }
        }

        function emptyServerCart() {
            var deferred = $q.defer();
            addDefaultHeaders();

            var promise = $http({
                method: "DELETE",
                url: getShoppingCartBaseUrl() + '/api/shopping_cart/empty.json'
            }).success(function (server_cart) {
                deferred.resolve(server_cart);
            }).error(function (error) {
                deferred.reject(error);
                LogService.error(['Error callServerAddForProduct', error]);
            });

            return deferred.promise;
        }

        function saveServerCartToLocal(serverCart) {
            try {
                var cartItems = mergeCart(serverCart);
                writeLocalCartItemsToLocalStorage(cartItems, true);
            } catch (exception) {
                LogService.critical(['saveServerCartToLocal', exception]);
            }
        }

        function mergeCart(data) {
            try {
                _.each(data, function (element, index, list) {
                    element = new common.GroceryCartItem(element);
                });
                return data;
            } catch (exception) {
                LogService.critical(['mergeCart', exception]);
            }
        }

        function broadcastCartItemsChanged(cartItems) {
            $rootScope.$broadcast('cart.data.changed', cartItems);
        }

        function addDefaultHeaders() {
            DefaultHeaders.customer();
        }

        function callServerSaveForCartItemNotes(cartItem) {
            var deferred = $q.defer();
            performRetryCartActions();
            addDefaultHeaders();
            cartItem = angular.copy(cartItem);
            if (cartItem.product.isCustom) {
                cartItem.product = _.pick(cartItem.product, 'name', 'description');
            } else {
                cartItem.product = _.pick(cartItem.product, 'id');
            }
            cartItem = _.pick(cartItem, 'note', 'product', 'qty');
            cartItem.qty = 0;
            // if(lastGetServerAddRequest) lastGetServerAddRequest.cancel();
            var promise = $http({
                method: "POST",
                url: getShoppingCartBaseUrl() + '/api/shopping_cart/add.json',
                data: cartItem
            }).success(function (server_cart) {
                if (lastGetServerAddRequest && cartItem.id == lastGetServerAddRequest.cartItem.id) {
                    saveServerCartToLocal(server_cart);
                }
                deferred.resolve(server_cart);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
                if (status != 0) {
                    LogService.error(['Error callServerAddForProduct', data, status, headers, config]);
                } else {
                    offlineCartItemTriedToAdd('add', cartItem);
                }
            });
            lastGetServerAddRequest = {
                cartItem: cartItem
            };
            return deferred.promise;
        }

        function callServerAddForCartItem(cartItem, addingCustomFirstTime) {
            var deferred = $q.defer();
            performRetryCartActions();
            addDefaultHeaders();
            cartItem = angular.copy(cartItem);
            var unitWeight = getUnitWeightForProduct(cartItem.product);
            var itemByWeight = cartItem.product.product_type == byWeightProductType;
            var itemBogo = cartItem.product.bogo;
            var customProduct = cartItem.product.isCustom;
            if (cartItem.product.isCustom) {
                cartItem.product = _.pick(cartItem.product, 'name', 'description');
            } else {
                cartItem.product = _.pick(cartItem.product, 'id');
            }
            if (itemByWeight) {
                //move up by product's unit_weight. Defaults to .5 on server
                cartItem = _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = unitWeight;
            } else if (itemBogo) {
                //move up by 2
                cartItem = _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = bogoAmount;
            } else if (addingCustomFirstTime && customProduct) {
                //move up by 2
                cartItem = _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = cartItem.qty;
            } else {
                //if not by weight system will default to plus 1
                cartItem = _.pick(cartItem, 'note', 'product');
            }
            var promise = $http({
                method: "POST",
                url: getShoppingCartBaseUrl() + '/api/shopping_cart/add.json',
                data: cartItem
            }).success(function (server_cart) {
                if (lastGetServerAddRequest && cartItem.id != lastGetServerAddRequest.cartItem.id) {
                    saveServerCartToLocal(server_cart);
                }
                lastGetServerAddRequest = {
                    cartItem: cartItem
                };
                deferred.resolve(server_cart);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
                if (status != 0) {
                    LogService.error(['Error callServerAddForProduct', data, status, headers, config]);
                } else {
                    offlineCartItemTriedToAdd('add', cartItem);
                }
            });
            return deferred.promise;
        }

        function callServerSubtractForCartItem(cartItem) {
            var deferred = $q.defer();
            performRetryCartActions();
            addDefaultHeaders();
            cartItem = angular.copy(cartItem);
            var unitWeight = getUnitWeightForProduct(cartItem.product);
            var itemByWeight = cartItem.product.product_type == byWeightProductType;
            var itemBogo = cartItem.product.bogo;
            if (cartItem.product.isCustom) {
                cartItem.product = _.pick(cartItem.product, 'name', 'description');
            } else {
                cartItem.product = _.pick(cartItem.product, 'id');
            }
            if (itemByWeight) {
                //move down by unit_weight on by weight items
                cartItem = _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = unitWeight;
            } else if (itemBogo) {
                //move down by 2
                cartItem = _.pick(cartItem, 'note', 'product', 'qty');
                cartItem.qty = bogoAmount;
            } else {
                //if not by weight system will default to minus 1
                cartItem = _.pick(cartItem, 'note', 'product');
            }
            var promise = $http({
                method: "DELETE",
                url: getShoppingCartBaseUrl() + '/api/shopping_cart/substract.json',
                data: cartItem,
                headers: { "Content-Type": "application/json;charset=utf-8" }
            }).success(function (server_cart) {
                if (lastGetServerSubtractRequest && cartItem.id != lastGetServerSubtractRequest.cartItem.id) {
                    saveServerCartToLocal(server_cart);
                }
                lastGetServerSubtractRequest = {
                    cartItem: cartItem
                };
                deferred.resolve(server_cart);
            }).error(function (data, status, headers, config) {
                deferred.reject(data);
                if (status != 0) {
                    LogService.error(['Error callServerSubtractForCartItem', data, status, headers, config]);
                } else {
                    offlineCartItemTriedToAdd('subtract', cartItem);
                }
            });

            return deferred.promise;
        }

        function offlineCartItemTriedToAdd(action, cartItem) {
            try {
                addActionRetryCartActions({ action: action, cartItem: cartItem });
            } catch (e) {
                LogService.error(e);
            }
        }

        function performRetryCartActions() {
            try {
                var actions = getRetryCartActions();
                //clear out actions, they will just get re added if they fail.
                actions = angular.copy(actions);
                saveCartActions([]);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = actions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var action = _step.value;

                        if (action.action == 'add') {
                            callServerAddForCartItem(action.cartItem);
                        } else if (action.action == 'subtract') {
                            callServerSubtractForCartItem(action.cartItem);
                        } else if (action.action == 'note') {
                            callServerSaveForCartItemNotes(action.cartItem);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } catch (e) {
                LogService.error(e);
            }
        }

        function getRetryCartActions() {
            try {
                var string = localStorage.getItem('actionRetryCartItems');
                var actions = angular.fromJson(string);
                actions = actions ? actions : [];
                return actions;
            } catch (e) {
                LogService.error(e);
                return [];
            }
        }

        function addActionRetryCartActions(action) {
            try {
                var newAction = _.clone(action);
                var actions = getRetryCartActions();
                actions.push(newAction);
                saveCartActions(actions);
            } catch (e) {
                LogService.error(e);
            }
        }

        function saveCartActions(actions) {
            try {
                localStorage.setItem('actionRetryCartItems', angular.toJson(actions));
            } catch (e) {
                LogService.error(e);
            }
        }

        function getCartTotal() {
            var total = 0;
            angular.forEach(getLocalCartItems(), function (cartItem, key) {
                if (cartItem.product.on_sale) {
                    total = total + cartItem.product.sale_price * cartItem.qty;
                } else {
                    total = total + cartItem.product.price * cartItem.qty;
                }
            });
            return total;
        }

        function removeProductsCartItemFromCart(product, skipCallToServer) {
            if (!product) {
                return;
            }
            removeCartItemForProduct(product, getLocalCartItems(), true);
            AppAnalytics.track('removeProductFromCart', product);
        }

        function removeCartItemForProduct(product, cartItemsArray, skipCallToServer) {
            var index;
            if (product.isCustom) {

                index = cartItemsArray.map(function (el) {
                    return el.product.name;
                }).indexOf(product.name);
            } else {
                index = cartItemsArray.map(function (el) {
                    return el.product.id;
                }).indexOf(product.id);
            }

            if (index > -1) {
                removeCartItemFromCart(cartItemsArray[index], skipCallToServer);
            }
        }

        function removeCartItemFromCart(cartItem, skipCallToServer) {
            var cartItemsArray = getLocalCartItems();
            var index;
            if (cartItem.product.isCustom) {
                index = cartItemsArray.map(function (el) {
                    return el.product.name;
                }).indexOf(cartItem.product.name);
            } else {
                index = cartItemsArray.map(function (el) {
                    return el.product.id;
                }).indexOf(cartItem.product.id);
            }
            if (index > -1) {
                callServerSubtractForCartItem(cartItemsArray[index], 0);
                cartItemsArray.splice(index, 1);
            }
            writeLocalCartItemsToLocalStorage(cartItemsArray, skipCallToServer);
        }

        function addCustomProductToCart(customProductToAdd) {
            addCustomProductToCartItems(customProductToAdd, getLocalCartItems(), true);
        }

        function addCustomProductToCartItems(customProductToAdd, cartItems, skipCallToServer) {
            var i;
            var foundItemInCart = false;
            for (i = 0; i < cartItems.length; i++) {
                var cartItem = cartItems[i];
                if (cartItem.product.name == customProductToAdd.name) {
                    //found the product was already in the cart so just add to the count of that item :)
                    foundItemInCart = true;
                    cartItem.qty += 1;
                    callServerAddForCartItem(cartItem);
                    break;
                }
            }
            if (!foundItemInCart) {
                var itemToAdd = new common.GroceryCartItem();
                itemToAdd.product = customProductToAdd;
                itemToAdd.qty = customProductToAdd.qty;
                callServerAddForCartItem(itemToAdd, true);
                cartItems.push(itemToAdd);
            }
            writeLocalCartItemsToLocalStorage(cartItems, skipCallToServer);
        }

        function addProductToCart(productToAdd) {
            if (productToAdd.isCustom) {
                var customProduct = {
                    name: productToAdd.name,
                    isCustom: true,
                    price: 0,
                    qty: productToAdd.qty ? productToAdd.qty : 1
                };
                addCustomProductToCart(customProduct);
                AppAnalytics.addSpecialRequest(productToAdd);
            } else {
                var localCartItems = getLocalCartItems();
                addProductToCartItems(productToAdd, localCartItems, true);
            }
        }

        function getUnitWeightForProduct(product) {
            try {
                if (product.product_type == byWeightProductType) {
                    if (product.unit_weight) {
                        return product.unit_weight;
                    } else {
                        return .5;
                    }
                } else {
                    return 1;
                }
            } catch (e) {
                return 1;
            }
        }

        function addProductToCartItems(productToAdd, localCartItems, skipCallToServer) {
            //check if this product exists in the cart items
            //if so then add to the count of that item
            //if not add a new cart item
            var i;
            var foundItemInCart = false;
            for (i = 0; i < localCartItems.length; i++) {
                var cartItem = localCartItems[i];
                if (cartItem.product.id == productToAdd.id) {
                    //found the product was already in the cart so just add to the count of that item :)
                    foundItemInCart = true;
                    if (productToAdd.product_type == byWeightProductType) {
                        cartItem.qty = $filter('number')(parseFloat(cartItem.qty) + parseFloat(getUnitWeightForProduct(productToAdd)), 2);
                        callServerAddForCartItem(cartItem);
                        break;
                    } else if (productToAdd.bogo) {
                        cartItem.qty = parseFloat(cartItem.qty) + bogoAmount;
                        callServerAddForCartItem(cartItem);
                        break;
                    }
                    cartItem.qty++;
                    callServerAddForCartItem(cartItem);
                    break;
                }
            }
            if (!foundItemInCart) {
                var itemToAdd = new common.GroceryCartItem();
                itemToAdd.product = productToAdd;
                if (productToAdd.qty) {
                    itemToAdd.qty = productToAdd.qty;
                }
                if (productToAdd.product_type == byWeightProductType) {
                    itemToAdd.qty = (parseFloat(itemToAdd.qty) * 100 + parseFloat(getUnitWeightForProduct(productToAdd)) * 100) / 100;
                } else if (productToAdd.bogo) {
                    itemToAdd.qty = parseFloat(itemToAdd.qty) + bogoAmount;
                } else {
                    itemToAdd.qty = 1;
                }
                callServerAddForCartItem(itemToAdd);
                localCartItems.push(itemToAdd);
            }
            writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
        }

        function removeOneProductFromCartItems(productToRemove, localCartItems, skipCallToServer) {
            var i;
            //im gonna assume that the product is in the cart...
            if (productToRemove.isCustom) {
                for (i = 0; i < localCartItems.length; i++) {
                    var cartItem = localCartItems[i];
                    if (cartItem.product.name == productToRemove.name) {
                        //we will not go negative, its like a friendly political campaign
                        if (cartItem.qty > 0) {
                            if (productToRemove.product_type == byWeightProductType) {
                                cartItem.qty = (parseFloat(cartItem.qty * 100) - parseFloat(getUnitWeightForProduct(productToRemove) * 100)) / 100;
                                if (cartItem.qty == 0) {
                                    removeProductsCartItemFromCart(productToRemove);
                                    return;
                                }
                                callServerSubtractForCartItem(cartItem);
                                writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
                                return;
                            } else if (productToRemove.bogo) {
                                cartItem.qty = parseFloat(cartItem.qty) - bogoAmount;
                                if (cartItem.qty == 0) {
                                    removeProductsCartItemFromCart(productToRemove);
                                    return;
                                }
                                callServerSubtractForCartItem(cartItem);
                                writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
                                return;
                            }
                            cartItem.qty--;
                            if (cartItem.qty == 0) {
                                removeProductsCartItemFromCart(productToRemove);
                                return;
                            }
                            callServerSubtractForCartItem(cartItem);
                        }

                        break;
                    }
                }
            } else {
                for (i = 0; i < localCartItems.length; i++) {
                    var cartItem = localCartItems[i];
                    if (cartItem.product.id == productToRemove.id) {
                        //we will not go negative, its like a friendly political campaign
                        if (cartItem.qty > 0) {
                            if (productToRemove.product_type == byWeightProductType) {
                                cartItem.qty = (parseFloat(cartItem.qty) * 100 - parseFloat(getUnitWeightForProduct(productToRemove)) * 100) / 100;
                                if (parseFloat(cartItem.qty) <= 0) {
                                    removeProductsCartItemFromCart(productToRemove);
                                    return;
                                }
                                callServerSubtractForCartItem(cartItem);
                                writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
                                return;
                            } else if (productToRemove.bogo) {
                                cartItem.qty = parseFloat(cartItem.qty) - bogoAmount;
                                if (cartItem.qty == 0) {
                                    removeProductsCartItemFromCart(productToRemove);
                                    return;
                                }
                                callServerSubtractForCartItem(cartItem);
                                writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
                                return;
                            }
                            cartItem.qty--;
                            if (cartItem.qty == 0) {
                                removeProductsCartItemFromCart(productToRemove, skipCallToServer);
                                return;
                            }
                            callServerSubtractForCartItem(cartItem);
                        }
                        break;
                    }
                }
            }
            writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
        }

        function removeOneProductFromCart(productToRemove) {
            var localCartItems = getLocalCartItems();
            removeOneProductFromCartItems(productToRemove, localCartItems, true);
        }

        function updateNoteOnItem(itemToUpdateWithNotes) {
            var localCartItems = getLocalCartItems();
            updateNoteOnItemInCartItems(itemToUpdateWithNotes, localCartItems, true);
        }

        function updateNoteOnItemInCartItems(itemToUpdateWithNotes, localCartItems, skipCallToServer) {
            var i;
            var cartItem;
            //need to use custom because they are id'd by name not id
            if (itemToUpdateWithNotes.product.isCustom) {
                for (i = 0; i < localCartItems.length; i++) {
                    cartItem = localCartItems[i];
                    if (cartItem.product.name == itemToUpdateWithNotes.product.name) {
                        cartItem.note = itemToUpdateWithNotes.note;
                        callServerSaveForCartItemNotes(cartItem);
                        break;
                    }
                }
            } else {
                for (i = 0; i < localCartItems.length; i++) {
                    cartItem = localCartItems[i];
                    if (cartItem.product.id == itemToUpdateWithNotes.product.id) {
                        cartItem.note = itemToUpdateWithNotes.note;
                        callServerSaveForCartItemNotes(cartItem);
                        break;
                    }
                }
            }
            writeLocalCartItemsToLocalStorage(localCartItems, skipCallToServer);
        }

        function clearCart() {
            var cartItems = [];
            emptyServerCart();
            writeLocalCartItemsToLocalStorage(cartItems, true);
        }

        function getCartItemCount() {
            var count = 0;
            angular.forEach(getLocalCartItems(), function (cartItem, key) {
                if (cartItem.product.product_type != "by weight") {
                    if (parseFloat(cartItem.qty) % 1 != 0) {
                        count += Math.ceil(parseFloat(cartItem.qty));
                    } else {
                        count += parseFloat(cartItem.qty);
                    }
                } else {
                    var unit_weight = getUnitWeightForProduct(cartItem.product);
                    var toAdd = parseFloat(cartItem.qty) * 100 / (unit_weight * 100);
                    if (cartItem.product.has_custom_label) {
                        count += parseInt($filter('number')(toAdd, 0));
                    } else {
                        if (parseFloat(cartItem.qty) % 1 != 0) {
                            count += Math.ceil(parseFloat(cartItem.qty));
                        } else {
                            count += parseFloat(cartItem.qty);
                        }
                    }
                }
            });
            return count;
        }

        function getLocalCartItems() {
            var localCartItems = null;
            var cartString = window.localStorage[keyLocalCartItems];
            if (cartString) {
                localCartItems = angular.fromJson(cartString);
            } else {
                return [];
            }
            _cartItems = localCartItems;
            return localCartItems;
        }

        function getCartItems() {
            return _cartItems;
        }

        function writeLocalCartItemsToLocalStorage(localCartItems, skipCallToSync) {
            try {
                window.localStorage[keyLocalCartItems] = angular.toJson(localCartItems);
                _cartItems = localCartItems;
                $rootScope.$broadcast('cart.items.saved.refresh');
            } catch (exception) {
                LogService.critical(exception);
            }

            try {
                if (!skipCallToSync) {
                    broadcastCartItemsChanged(localCartItems);
                }
            } catch (exception) {
                LogService.critical(exception);
            }
        }
    }
})();
/**
 * Created by SHIPT
 */

'use strict';

(function () {
    'use strict';

    var serviceId = 'ShoppingService';

    angular.module('shiptApp').factory(serviceId, ['$http', '$q', '$log', 'ApiEndpoint', 'common', 'LogService', 'AuthService', 'ShoppingCartService', 'DefaultHeaders', ShoppingService]);

    var keyLocalCartItems = 'localCartItems';
    var keyLocalCategories = 'localCategories';
    var keyLocalSubCategories = 'localSubCategories';
    var keyLocalProducts = 'localProducts';

    function ShoppingService($http, $q, $log, ApiEndpoint, common, LogService, AuthService, ShoppingCartService, DefaultHeaders) {

        var service = {
            getCartItems: ShoppingCartService.getCartItems,
            getCartItemCount: ShoppingCartService.getCartItemCount,
            getProducts: getProducts,
            getCategories: getCategories,
            getCachedCategories: getCachedCategories,
            getSubCategories: getSubCategories,
            clearCart: ShoppingCartService.clearCart,
            updateNoteOnItem: ShoppingCartService.updateNoteOnItem,
            addProductToCart: ShoppingCartService.addProductToCart,
            addCustomProductToCart: ShoppingCartService.addCustomProductToCart,
            removeOneProductFromCart: ShoppingCartService.removeOneProductFromCart,
            getCartTotal: ShoppingCartService.getCartTotal,
            removeProductsCartItemFromCart: ShoppingCartService.removeProductsCartItemFromCart,
            getRecentlyPurchasedProducts: getRecentlyPurchasedProducts,
            getRecentlyPurchasedSpecialRequests: getRecentlyPurchasedSpecialRequests
        };

        //setting the auth token header for all requests from here.
        DefaultHeaders.customer();

        return service;

        function addDefaultHeaders() {
            DefaultHeaders.customer();
        }

        /* Products */
        function getProducts(subCategory, fromServer, page, searching) {
            return getProductsFromServer(subCategory, page, searching);
        }

        function getProductsFromServer(subCategory, page, searching) {
            var defer = $q.defer();
            if (!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return;
            }
            var req = null;
            if (searching) {
                req = {
                    params: {
                        "searching": 'true',
                        "page": page
                    }
                };
            } else {
                req = {
                    params: {
                        page: page
                    }
                };
            }
            addDefaultHeaders();
            $http.get(ApiEndpoint.apiurl + subCategory.products.url, req).success(function (data) {
                //success
                defer.resolve(data);
            }).error(function (error) {
                LogService.error(error);
                //error
                defer.reject(error);
            });
            return defer.promise;
        }

        /* CATEGORIES */
        function getCachedCategories() {
            var cats = getCategoriesFromCache();
            return cats;
        }

        function getCategories(fromServer) {
            var defer = $q.defer();
            if (!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return defer.promise;
            }
            fromServer = fromServer || false;
            if (fromServer) {
                return getCategoriesFromServer();
            } else {
                var cats = getCategoriesFromCache();
                if (cats.length > 0) {
                    defer.resolve(cats);
                } else {
                    return getCategoriesFromServer();
                }
            }
            return defer.promise;
        }

        function getRecentlyPurchasedProducts(page) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/customers/products.json",
                params: {
                    page: page
                }
            };
            addDefaultHeaders();
            $http(req).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        }

        function getRecentlyPurchasedSpecialRequests() {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/customers/custom_products.json"
            };
            addDefaultHeaders();
            $http(req).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        }

        function getCategoriesFromServer() {
            var defer = $q.defer();
            if (!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return;
            }
            var categories = null;
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/categories.json"
            };
            addDefaultHeaders();
            $http(req).success(function (data) {
                saveCategoriesToCache(data);
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error', error);
                //error
                defer.reject(error);
            });
            return defer.promise;
        }

        function saveCategoriesToCache(categories) {
            window.localStorage[keyLocalCategories] = angular.toJson(categories);
        }

        function getCategoriesFromCache() {
            var local = null;
            var localString = window.localStorage[keyLocalCategories];
            if (localString) {
                local = angular.fromJson(localString);
            } else {
                return [];
            }
            return local;
        }

        /* SUB-CATEGORIES */
        function getSubCategories(parentCat, fromServer) {
            return getSubCategoriesFromServer(parentCat);
        }

        function getSubCategoriesFromServer(parentCat) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + parentCat.url
            };
            addDefaultHeaders();
            $http(req).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').service('StoreService', StoreService);

    StoreService.$inject = ['$log', '$q', '$http', 'LogService', 'DefaultHeaders', 'ApiEndpoint', '$timeout', 'AccountService', 'AuthService', 'AppAnalytics'];

    function StoreService($log, $q, $http, LogService, DefaultHeaders, ApiEndpoint, $timeout, AccountService, AuthService, AppAnalytics) {

        this.selectStore = function (store, zip) {
            var defer = $q.defer();
            var customer = AccountService.getCustomerInfo(true);
            customer.shopping_zip_code = zip;
            customer.store_id = store.id;
            customer.store = store;
            AccountService.updateAccountInfo(customer).success(function () {
                AuthService.saveAccountData(customer);
                defer.resolve();
            }).error(function (error) {
                defer.reject(error);
            });
            return defer.promise;
        };

        this.selectStoreIdWithAddress = function (storeId, address) {
            var defer = $q.defer();
            var customer = AccountService.getCustomerInfo(true);
            customer.store_id = storeId;
            if (!address.id) {
                AppAnalytics.track('addCard', { fromLocation: "account" });
                AccountService.addAddress(address).then(function (newAddress) {
                    customer.default_shopping_address_id = newAddress.id;
                    AccountService.updateAccountInfo(customer).success(function () {
                        customer.customer_addresses.push(newAddress);
                        AuthService.saveAccountData(customer);
                        defer.resolve();
                    }).error(function (error) {
                        defer.reject(error);
                    });
                }, function (error) {
                    defer.reject(error);
                });
            } else {
                customer.default_shopping_address_id = address.id;
                AccountService.updateAccountInfo(customer).success(function () {
                    AuthService.saveAccountData(customer);
                    defer.resolve();
                }).error(function (error) {
                    defer.reject(error);
                });
            }

            return defer.promise;
        };

        this.selectStoreWithAddress = function (store, address) {
            var defer = $q.defer();
            var customer = AccountService.getCustomerInfo(true);
            customer.store = store;
            customer.store_id = store.id;
            if (!address.id) {
                AppAnalytics.track('addCard', { fromLocation: "account" });
                AccountService.addAddress(address).then(function (newAddress) {
                    customer.default_shopping_address_id = newAddress.id;
                    AccountService.updateAccountInfo(customer).success(function () {
                        customer.customer_addresses.push(newAddress);
                        AuthService.saveAccountData(customer);
                        defer.resolve();
                    }).error(function (error) {
                        defer.reject(error);
                    });
                }, function (error) {
                    defer.reject(error);
                });
            } else {
                customer.default_shopping_address_id = address.id;
                AccountService.updateAccountInfo(customer).success(function () {
                    AuthService.saveAccountData(customer);
                    defer.resolve();
                }).error(function (error) {
                    defer.reject(error);
                });
            }

            return defer.promise;
        };

        this.listForAddress = function (address) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/zip_codes/" + address.zip_code + "/available_stores.json",
                params: {
                    zip: address.zip_code
                }
            };
            DefaultHeaders.customer();
            $http(req).success(function (data) {
                $log.debug('success', data.stores);
                defer.resolve(data.stores);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        };

        this.listForZip = function (zip) {
            var defer = $q.defer();
            var req = {
                method: 'GET',
                url: ApiEndpoint.apiurl + "/api/v1/zip_codes/" + zip + "/available_stores.json",
                params: {
                    zip: zip
                }
            };
            DefaultHeaders.customer();
            $http(req).success(function (data) {
                $log.debug('success', data.stores);
                defer.resolve(data.stores);
            }).error(function (error) {
                LogService.error('error', error);
                defer.reject(error);
            });
            return defer.promise;
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').service('Subscription', Subscription);

    Subscription.$inject = ['$log', '$q', '$http', 'LogService', 'DefaultHeaders', 'ApiEndpoint', 'AppAnalytics'];

    function Subscription($log, $q, $http, LogService, DefaultHeaders, ApiEndpoint, AppAnalytics) {

        this.list = function () {
            var defer = $q.defer();
            DefaultHeaders.customer();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions/list_available.json',
                method: "GET"
            }).success(function (data) {
                $log.info('subscriptions/list_available.json', data);
                defer.resolve(data);
            }).error(function (error) {
                $log.error('subscriptions/list_available.json', error);
                defer.reject(error);
            });

            return defer.promise;
        };

        this.update = function (subscription) {
            var defer = $q.defer();
            DefaultHeaders.customer();
            delete subscription['status'];
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions.json',
                method: "PUT",
                data: subscription
            }).success(function (data) {
                AppAnalytics.track('changeSubscriptionPlan', subscription);
                $log.info('subscriptions/update.json', data);
                defer.resolve(data);
            }).error(function (error) {
                $log.error('subscriptions/update.json', error);
                defer.reject(error);
            });

            return defer.promise;
        };

        this.create = function (subscription) {
            var defer = $q.defer();
            DefaultHeaders.customer();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions.json',
                method: "POST",
                data: subscription
            }).success(function (data) {
                AppAnalytics.membershipPurchase(data);
                $log.info('subscriptions create.json', data);
                defer.resolve(data);
            }).error(function (error) {
                $log.error('subscriptions create.json', error);
                defer.reject(error);
            });

            return defer.promise;
        };

        this.edit = function () {
            var defer = $q.defer();
            DefaultHeaders.customer();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions/edit.json',
                method: "GET"
            }).success(function (data) {
                $log.info('subscriptions/edit.json', data);
                defer.resolve(data);
            }).error(function (error) {
                $log.error('subscriptions/edit.json', error);
                defer.reject(error);
            });

            return defer.promise;
        };

        this.cancel = function () {
            var defer = $q.defer();
            DefaultHeaders.customer();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/subscriptions/delete.json',
                method: "DELETE"
            }).success(function (data) {
                AppAnalytics.track('cancelSubscriptionPlan');
                $log.info('subscriptions/delete.json', data);
                defer.resolve(data);
            }).error(function (error) {
                $log.error('subscriptions/delete.json', error);
                defer.reject(error);
            });

            return defer.promise;
        };

        this.get = function () {};

        this.save = function () {};
    }
})();
'use strict';

(function () {
    'use strict';

    var serviceId = 'UserOrderService';

    angular.module('shiptApp').factory(serviceId, ['$http', '$q', '$log', 'ApiEndpoint', 'AuthService', 'AccountService', 'common', 'LogService', 'UIUtil', 'DefaultHeaders', 'AppAnalytics', UserOrderService]);

    function UserOrderService($http, $q, $log, ApiEndpoint, AuthService, AccountService, common, LogService, UIUtil, DefaultHeaders, AppAnalytics) {

        var service = {
            getNewOrderForCustomer: getNewOrderForCustomer,
            postNewOrder: postNewOrder,
            updateOrder: updateOrder,
            getLastOrderForCustomer: getLastOrderForCustomer,
            tipOrder: tipOrder,
            saveItemReconcileInfo: saveItemReconcileInfo,
            getCheckoutScreenMessageForOrder: getCheckoutScreenMessageForOrder
        };

        return service;

        function addDefaultHeaders() {
            DefaultHeaders.customer();
        }

        function getCheckoutScreenMessageForOrder(order) {
            if (order && order.checkout_screen_message) {
                return order.checkout_screen_message;
            } else {
                return 'Special requests and substitutions will affect your order total. A receipt will be emailed after delivery.';
            }
        };

        function saveItemReconcileInfo(order_line, reason, comments) {
            var defer = $q.defer();
            addDefaultHeaders();
            var data = {
                order_line_id: order_line.id,
                reason: reason,
                comments: comments
            };
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/customer_order_line_feedback.json',
                method: "post",
                data: data
            }).success(function (data) {
                LogService.info('success saveItemReconcileInfo', data);
                defer.resolve(data);
            }).error(function (error) {
                LogService.error('error saveItemReconcileInfo', error);
                defer.reject(order_line);
            });

            return defer.promise;
        }

        function getLastOrderForCustomer() {
            var defer = $q.defer();
            addDefaultHeaders();
            if (!AuthService.shouldMakeShiptApiCall()) {
                defer.resolve(null);
                return defer.promise;
            }
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/orders/last.json',
                method: "GET"
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function getNewOrderForCustomer(order) {
            var defer = $q.defer();
            var orderReq = order;
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + AuthService.getCustomerInfo().new_order_url,
                method: "POST",
                data: orderReq
            }).success(function (data) {
                $log.info('success getNewOrderForCustomer');
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function postNewOrder(order) {
            var defer = $q.defer();
            $log.info('postNewOrder', order);
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/orders.json',
                method: "POST",
                data: order
            }).success(function (data) {
                $log.info('success postNewOrder', data);
                AccountService.refreshCustomerInfo();
                defer.resolve(data);
            }).error(function (error) {
                defer.reject(error);
            });

            return defer.promise;
        }

        function tipOrder(order) {
            LogService.info(['start tipOrder', order]);
            var defer = $q.defer();
            addDefaultHeaders();
            $http({
                url: ApiEndpoint.apiurl + '/api/v1/orders/' + order.id + '/tip.json',
                method: "PUT",
                data: { tip: order.tip }
            }).success(function (data) {
                LogService.info(['success tipOrder', data]);
                AccountService.refreshCustomerInfo();
                AppAnalytics.tipShopper(order.tip);
                defer.resolve(data);
            }).error(function (error) {
                LogService.error(['error tipOrder', error]);
                UIUtil.showAlert('Not Able To Save Tip', 'There was an issue saving the tip you added. \n\n' + getTipErrorString(error));
                defer.reject(error);
            });

            return defer.promise;
        }

        function getTipErrorString(error) {
            if (error.errors) {
                return JSON.stringify(error.errors);
            } else {
                return 'Please contact us if you continue to have this issue.';
            }
        }

        function updateOrder(orderToUpdate) {
            var i;
            var order = angular.copy(orderToUpdate);
            for (i = 0; i < order.order_lines.length; i++) {
                var order_line = order.order_lines[i];
                if (order_line.requested_product.isCustom) {
                    var orderLine = new common.CustomOrderLine();
                    orderLine.requested_qty = order_line.requested_qty;
                    orderLine.requested_product_attributes.description = order_line.requested_product.description;
                    orderLine.notes = order_line.notes;
                    order.order_lines[i] = orderLine;
                } else {
                    var orderLine = new common.OrderLine();
                    orderLine.requested_product_id = order_line.requested_product.id;
                    orderLine.requested_qty = order_line.requested_qty;
                    orderLine.notes = order_line.notes;
                    order.order_lines[i] = orderLine;
                }
            }
            LogService.info([orderToUpdate.id + ' :: User Editing Order', order]);
            addDefaultHeaders();
            return $http({
                url: ApiEndpoint.apiurl + '/api/v1/orders/' + order.id + '.json',
                method: "PATCH",
                data: order
            });
        }
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('ShareModalController', ['$scope', '$log', '$rootScope', 'UIUtil', 'SharingService', 'LogService', 'ShiptLogItemsService', 'ReferralService', 'KahunaService', '$timeout', 'AppAnalytics', ShareModalController]);

    function ShareModalController($scope, $log, $rootScope, UIUtil, SharingService, LogService, ShiptLogItemsService, ReferralService, KahunaService, $timeout, AppAnalytics) {
        var viewModel = this;

        viewModel.cancelShare = function () {
            $log.info('cancel share');
            $rootScope.$broadcast('hide.share.modal');
        };

        viewModel.shareOrder = function () {
            AppAnalytics.track('clickShareReferralButton', { source: $scope.source });
            ShiptLogItemsService.incrementLogItem('analytics', 'customer_app_share_referral_link_location', $scope.source);
            SharingService.shareNativeShareSheet(viewModel.code.urls[0].share_message, viewModel.code.urls[0].share_subject, null, viewModel.code.urls[0].url);
            KahunaService.inviteFriend();
        };

        viewModel.loadCode = function () {
            ReferralService.getCustomerCodes().then(function (codes) {
                viewModel.code = codes[0];
            });
        };

        AppAnalytics.track('viewReferralShareModal', { source: $scope.source });
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
  'use strict';

  angular.module('shiptApp').factory('ShareModalProvider', ['$rootScope', '$ionicModal', ShareModalProvider]);

  function ShareModalProvider($rootScope, $ionicModal) {
    var init = function init($scope, source) {
      var promise;
      var tpl = 'app/groceries/share/shareModal.html';
      $scope = $scope || $rootScope.$new();
      $scope.source = source;
      promise = $ionicModal.fromTemplateUrl(tpl, {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        modal.show();
      });

      $scope.openModal = function () {
        $scope.modal.show();
      };
      $scope.closeModal = function () {
        $scope.modal.hide();
      };
      $rootScope.$on('hide.share.modal', function () {
        $scope.modal.hide();
      });
      $scope.$on('$destroy', function () {
        $scope.modal.remove();
      });

      return promise;
    };

    return {
      showModal: init
    };
  }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('TippingModalController', ['$scope', 'UserOrderService', 'LogService', TippingModalController]);

    function TippingModalController($scope, UserOrderService, LogService) {
        var viewModel = this;

        viewModel.tipOptions = [{ amount: 0, text: 'No Tip' }, { amount: 5, text: '$5' }, { amount: 10, text: '$10' }, { amount: 15, text: '$15' }];
        viewModel.otherTipAmount = null;

        viewModel.closeModal = function () {
            $scope.closeModal(viewModel.order);
        };

        viewModel.saveOtherAmount = function () {
            viewModel.order.tip = viewModel.otherTipAmount;
            viewModel.closeModal();
            UserOrderService.tipOrder(viewModel.order);
        };

        viewModel.selectTipOption = function (tipOption) {
            viewModel.otherTipAmount = null;
            viewModel.otherAmount = false;
            viewModel.tipOption = tipOption;
            viewModel.order.tip = tipOption.amount;
            viewModel.closeModal();
            UserOrderService.tipOrder(viewModel.order);
        };

        $scope.$watch('viewModel.otherTipAmount', function () {
            if (viewModel.otherTipAmount != null && viewModel.otherTipAmount != "") {
                viewModel.tipOption = null;
                viewModel.otherAmount = true;
            } else {
                viewModel.otherAmount = false;
            }
        });

        viewModel.tipUntilTimeString = function () {
            if (viewModel.order.tippable) {
                var formatString = moment(viewModel.order.tippable_until).format('MMMM Do YYYY, h:mm:ss a');
                return formatString;
            } else {
                return 'n/a';
            }
        };

        function init() {
            try {
                viewModel.order = $scope.order;
                viewModel.tipOption = null;
                if (!viewModel.order.tip || viewModel.order.tip == 0) {
                    viewModel.tipOption = viewModel.tipOptions[0];
                } else {
                    for (var i = 0; i < viewModel.tipOptions.length; i++) {
                        var to = viewModel.tipOptions[i];
                        if (viewModel.order.tip == to.amount) {
                            viewModel.tipOption = to;
                            break;
                        }
                    }
                    if (viewModel.tipOption == null) {
                        viewModel.otherAmount = true;
                        viewModel.otherTipAmount = viewModel.order.tip;
                    }
                }
            } catch (exception) {
                LogService.error(['error in TippingModalController.init', exception]);
            }
        }

        init();
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('TippingModalProvider', ['$rootScope', '$ionicModal', '$q', TippingModalProvider]);

    function TippingModalProvider($rootScope, $ionicModal, $q) {

        var tippingModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            var tpl = 'app/groceries/tipping/tippingModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope
            }).then(function (modal) {
                tippingModal = modal;
                defer.resolve(tippingModal);
            });
            return defer.promise;
        }

        var init = function init($scope, order) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.order = null;
            $scope.order = order;

            getModal($scope).then(function (modal) {
                modal.show();
            });

            $scope.closeModal = function (order) {
                defer.resolve(order);
                tippingModal.hide();
                tippingModal.remove();
                tippingModal = null;
            };

            $scope.$on('$destroy', function () {
                if (tippingModal) tippingModal.remove();
                tippingModal = null;
            });

            return defer.promise;
        };

        return {
            showModal: init
        };
    }
})();
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    var AlgoliaProduct = function AlgoliaProduct(algoliaHit) {
        _classCallCheck(this, AlgoliaProduct);

        this.id = algoliaHit.product_id;
        this.name = algoliaHit.name;
        this.brand_name = algoliaHit.brand_name;
        this.upc = algoliaHit.upc;
        this.description = algoliaHit.description;
        this.placement = algoliaHit.placement;
        this.images = [algoliaHit.image];
        this.bogo = algoliaHit.bogo;
        this.categories = algoliaHit.categories;
        this.unit_of_measure = algoliaHit.unit_of_measure;
        this.unit_weight = algoliaHit.unit_weight;
        this.product_type = algoliaHit.product_type;
        this.size = algoliaHit.size;
        this.on_sale = algoliaHit.on_sale;
        this.price = algoliaHit.price;
        this.sale_price = algoliaHit.sale_price;
        this.description_label = algoliaHit.description_label;
        this.bullet_points = algoliaHit.bullet_points;
        this.has_custom_label = algoliaHit.has_custom_label;
    };

    angular.module('app.shipt.search').service('AlgoliaProductProvider', AlgoliaProductProvider);

    function AlgoliaProductProvider() {
        this.getNew = function (algoliaHit) {
            return new AlgoliaProduct(algoliaHit);
        };
    }
})();
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    var AlgoliaFinder = (function () {

        /**
         * @ngdoc function
         * @name constructor
         */

        function AlgoliaFinder($rootScope, $log, $q, AuthService, AlgoliaProductProvider, ConfigService, CommonConfig) {
            var _this = this;

            _classCallCheck(this, AlgoliaFinder);

            this.$log = $log;
            this.$q = $q;
            this.searchPromise = null;
            this.client = null;
            this.index = null;
            this.user = null;
            this.AuthService = AuthService;
            this.AlgoliaProductProvider = AlgoliaProductProvider;
            this.ConfigService = ConfigService;
            this.CommonConfig = CommonConfig;
            this.populateConfigData();
            $rootScope.$on('config.data.changed', function () {
                return _this.populateConfigData();
            });
        }

        _createClass(AlgoliaFinder, [{
            key: 'populateConfigData',
            value: function populateConfigData() {
                var _this2 = this;

                this.ConfigService.getConfig(this.CommonConfig.groceriesContext).then(function (config) {
                    return _this2.initializeFinderService(config);
                });
            }

            /**
             * @ngdoc function
             * @name initializeAlgoliaClientIndex
             * @description creates the index to search for algolia
             *
             * @param config object
             * @param indexName The name of the index that will be initialized for the next search.
             */
        }, {
            key: 'initializeFinderService',
            value: function initializeFinderService(config) {
                var indexName = arguments.length <= 1 || arguments[1] === undefined ? config.algolia_search_index_name : arguments[1];
                return (function () {
                    if (config) {
                        this.client = algoliasearch(config.algolia_application_id, config.algolia_search_api_key);
                        this.index = this.client.initIndex(indexName);
                    }
                    this.user = this.AuthService.getUserInfo();
                }).apply(this, arguments);
            }

            /**
             * @ngdoc function
             * @name searchTerm
             * @description call to search a term
             *
             * @param searchTerm text that is to be searched
             * @param currentPage thea page to be searched, algolia will return results for the next page i think
             * @param facetFilters The facetFilters to be sent along with the search request.
             * @param indexName The algolia index that will be targeted in this search.
             *
             * @returns {Promise} promise that resolves with the results.
             */
        }, {
            key: 'searchTerm',
            value: function searchTerm(_searchTerm, currentPage, facetFilters, indexName) {
                if (currentPage === undefined) currentPage = null;

                var _this3 = this;

                if (facetFilters === undefined) facetFilters = [];

                this.searchTermText = _searchTerm;
                this.searchPromise = this.$q.defer();
                try {
                    currentPage = _.isNull(currentPage) ? 0 : currentPage + 1;

                    if (indexName) {
                        this.initializeFinderService(this.ConfigService.getLocalConfig(), indexName);
                    } else if (!this.index) {
                        this.initializeFinderService(this.ConfigService.getLocalConfig());
                    }

                    this.index.search(_searchTerm, {
                        page: currentPage,
                        tags: this.tags(),
                        facets: '*',
                        facetFilters: facetFilters
                    }, function (err, content) {
                        return _this3.handleSearchResults(err, content);
                    });

                    return this.searchPromise.promise;
                } catch (e) {
                    this.searchPromise.reject(e);
                    return this.searchPromise.promise;
                }
            }

            /**
             * @ngdoc function
             * @name tags
             * @description gets the tags for algolia search to display the correct results
             *
             * @returns {array} an array with the tags as strings
             */
        }, {
            key: 'tags',
            value: function tags() {
                this.user = this.AuthService.getUserInfo();
                var tags = ['metro_' + this.user.metro_id, 'store_' + this.user.store_id];
                if (this.user.features.product_settings_by_store_location === true) {
                    tags.push('store_location_' + this.user.store_location_id);
                } else {
                    tags.push('store_location_');
                }
                return tags;
            }

            /**
             * @ngdoc function
             * @name handleSearchResults
             * @description this is the callback function that handles the results from algolia
             *
             *
             */
        }, {
            key: 'handleSearchResults',
            value: function handleSearchResults(err, content) {
                try {
                    if (err) {
                        this.searchPromise.reject(err);
                    } else {
                        var hits = content.hits;
                        var products = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = hits[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var hit = _step.value;

                                products.push(new this.AlgoliaProductProvider.getNew(hit));
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator['return']) {
                                    _iterator['return']();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        var result = {
                            products: products || [],
                            current_page: content.page,
                            total_pages: content.nbPages,
                            facets: content.facets,
                            nbHits: content.nbHits
                        };
                        this.searchPromise.resolve(result);
                    }
                } catch (e) {
                    this.$log.error(e);
                }
            }
        }]);

        return AlgoliaFinder;
    })();

    angular.module('app.shipt.search').service('AlgoliaFinder', AlgoliaFinder);
    AlgoliaFinder.$inject = ['$rootScope', '$log', '$q', 'AuthService', 'AlgoliaProductProvider', 'ConfigService', 'CommonConfig'];
})();
'use strict';

var _get = function get(_x9, _x10, _x11) { var _again = true; _function: while (_again) { var object = _x9, property = _x10, receiver = _x11; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x9 = parent; _x10 = property; _x11 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {
    'use strict';

    angular.module('app.shipt.search').service('filterSortOptions', filterSortOptions);

    filterSortOptions.$inject = ['$rootScope', '$log', 'AlgoliaFinder', 'FILTER_SORT', 'ConfigService', 'CommonConfig', '$q', '$timeout', '$ionicScrollDelegate'];

    /* @ngInject */
    function filterSortOptions($rootScope, $log, AlgoliaFinder, FILTER_SORT, ConfigService, CommonConfig, $q, $timeout, $ionicScrollDelegate) {

        // This extras object holds all dependencies that may be needed in the class definitions for FilterSort
        var extras = {
            AlgoliaFinder: AlgoliaFinder,
            $rootScope: $rootScope,
            FILTER_SORT: FILTER_SORT,
            ConfigService: ConfigService,
            CommonConfig: CommonConfig,
            $q: $q,
            $log: $log,
            $timeout: $timeout,
            $ionicScrollDelegate: $ionicScrollDelegate
        };

        this.init = function (categories, brands) {
            return new FilterSort(categories, brands, extras);
        };
    }

    /**
     * @ngdoc class
     * @name FilterSort
     * @description Represents the primary model and functionality for filtering and sorting.
     *
     * @param categories The categories that will be built for this filter sort.
     * @param brands The brands that will be built for this filter sort.
     * @param extras {Object} Containing the additional dependencies that will be used in various child classes.
     */

    var FilterSort = (function () {
        function FilterSort(categories, brands, extras) {
            _classCallCheck(this, FilterSort);

            this.sort = new SortOptions(extras);
            this.categories = new CategoriesFilter(this.getArrayForFacet(categories), extras);
            this.brands = new BrandsFilter(this.getArrayForFacet(brands), extras);
            this.extras = extras;
            this.filterCount = 0;
            this.setCurrentFacets(categories, brands);
        }

        /**
         * @ngdoc class
         * @name Filter
         * @description Super class for the various common filtering functionality.
         */

        _createClass(FilterSort, [{
            key: 'getArrayForFacet',
            value: function getArrayForFacet(facet) {
                //because the facets come in with the values as the properties... weird
                var values = [];
                for (var property in facet) {
                    values.push(property);
                }
                return values;
            }
        }, {
            key: 'selectOption',
            value: function selectOption(option) {
                var singleSelect = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

                if (singleSelect) {
                    this.sort.isNewSortApplied = true;
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = this.sort.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var op = _step.value;

                            op.selected = false;
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator['return']) {
                                _iterator['return']();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    option.selected = true;
                } else {
                    if (!option.isCurrentFacet) {
                        // Prevent selection of facets having 0 results
                        return;
                    }

                    option.selected = !option.selected;
                    if (option.selected) {
                        this.filterCount++;
                    } else {
                        this.filterCount--;
                    }
                }

                this.updateFilterSortSearchResults();
            }
        }, {
            key: 'updateFilterSortSearchResults',
            value: function updateFilterSortSearchResults() {
                var searchTerm = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

                this.extras.$rootScope.$broadcast(this.extras.FILTER_SORT.EVENTS.APPLY_FILTER, this._getFilterSortModelForSearch(searchTerm));
            }
        }, {
            key: 'getFacetFiltersForSearch',
            value: function getFacetFiltersForSearch() {
                var facetFilters = [];
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.categories.options[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var category = _step2.value;

                        if (category.selected) {
                            facetFilters.push(this.categories.facetFilterValue + ':' + category.displayName);
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                            _iterator2['return']();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = this.brands.options[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var brand = _step3.value;

                        if (brand.selected) {
                            facetFilters.push(this.brands.facetFilterValue + ':' + brand.displayName);
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                            _iterator3['return']();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                return facetFilters;
            }
        }, {
            key: 'isFilterSortActive',
            value: function isFilterSortActive() {
                return this.sort.isNewSortApplied || this.filterCount > 0;
            }
        }, {
            key: 'toggleExpandSection',
            value: function toggleExpandSection(section) {
                var _this = this;

                section.displayExpanded = !section.displayExpanded;
                this.extras.$timeout(function () {
                    _this.extras.$ionicScrollDelegate.resize();
                });
            }
        }, {
            key: 'setCurrentFacets',
            value: function setCurrentFacets(categoryFacets, brandFacets) {
                var currentCategoryFacets = this.getArrayForFacet(categoryFacets);
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = this.categories.options[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var category = _step4.value;

                        category.isCurrentFacet = _.contains(currentCategoryFacets, category.displayName);
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                            _iterator4['return']();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                var currentBrandFacets = this.getArrayForFacet(brandFacets);
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = this.brands.options[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var brand = _step5.value;

                        brand.isCurrentFacet = _.contains(currentBrandFacets, brand.displayName);
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                            _iterator5['return']();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }
        }, {
            key: '_getFilterSortModelForSearch',
            value: function _getFilterSortModelForSearch() {
                var searchTerm = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

                return {
                    searchTerm: searchTerm || this.extras.AlgoliaFinder.searchTermText,
                    facetFilters: this.getFacetFiltersForSearch(),
                    indexName: this.sort.selectedOption().algoliaIndex
                };
            }
        }]);

        return FilterSort;
    })();

    var Filter = (function () {
        function Filter() {
            _classCallCheck(this, Filter);

            this.options = [];
            this.displayExpanded = false;
        }

        /**
         * @ngdoc class
         * @name FilterSortOption
         * @description Represents a single filter sort option.
         */

        _createClass(Filter, [{
            key: 'populateOptions',
            value: function populateOptions(options) {
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = options[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var option = _step6.value;

                        this.options.push(new FilterSortOption(option));
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                            _iterator6['return']();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }
            }
        }, {
            key: 'selectedOptionsDisplay',
            value: function selectedOptionsDisplay() {
                var display = '';
                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = this.options[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var op = _step7.value;

                        if (op.selected) {
                            display += ' ' + op.displayName + ',';
                        }
                    }
                } catch (err) {
                    _didIteratorError7 = true;
                    _iteratorError7 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                            _iterator7['return']();
                        }
                    } finally {
                        if (_didIteratorError7) {
                            throw _iteratorError7;
                        }
                    }
                }

                display = display === '' ? this.defaultSelection : display.removeTrailingComma();

                return display;
            }
        }]);

        return Filter;
    })();

    var FilterSortOption = function FilterSortOption(name) {
        var selected = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
        var algoliaIndex = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

        _classCallCheck(this, FilterSortOption);

        this.displayName = name;
        this.algoliaIndex = algoliaIndex;
        this.selected = selected;
    }

    /**
     * @ngdoc class
     * @name SortOptions
     * @description Represents sorting functionality.
     *
     * @param extras {Object} Containing the additional dependencies that will be used for support functionality.
     */
    ;

    var SortOptions = (function () {
        function SortOptions() {
            var extras = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            _classCallCheck(this, SortOptions);

            this.displayExpanded = false;
            this.options = [];
            this.defaultSelection = extras.FILTER_SORT.OPTIONS.SORT_POPULARITY;
            this.isNewSortApplied = false;
            this._populateSortOptions(extras);
        }

        /**
         * @ngdoc class
         * @name BrandsFilter
         * @description Represents the filter for brands.
         *
         * @param brandNames The brands names available to filter on.
         * @param extras {Object} Containing the additional dependencies that will be used for support functionality.
         */

        _createClass(SortOptions, [{
            key: 'selectedOption',
            value: function selectedOption() {
                return this.options.find(function (op) {
                    return op.selected;
                });
            }
        }, {
            key: '_populateSortOptions',
            value: function _populateSortOptions(extras) {
                var _this2 = this;

                this._getSortIndexesForEnvironment(extras).then(function (indicies) {
                    var INDEX = indicies;
                    _this2.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_POPULARITY, true));
                    _this2.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_PRICE_LOW_HIGH, false, INDEX.SORT_PRICE_LOW_HIGH));
                    _this2.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_PRICE_HIGH_LOW, false, INDEX.SORT_PRICE_HIGH_LOW));
                    _this2.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_BRAND_A_Z, false, INDEX.SORT_BRAND_A_Z));
                    _this2.options.push(new FilterSortOption(extras.FILTER_SORT.OPTIONS.SORT_BRAND_Z_A, false, INDEX.SORT_BRAND_Z_A));
                });
            }
        }, {
            key: '_getSortIndexesForEnvironment',
            value: function _getSortIndexesForEnvironment(extras) {
                var defaultIndicies = extras.FILTER_SORT.INDEXES.PRODUCTION,
                    deferred = extras.$q.defer();
                extras.ConfigService.getConfig(extras.CommonConfig.groceriesContext).then(function (config) {
                    if (config.environment_name === extras.CommonConfig.stagingEnvironmentName) {
                        deferred.resolve(extras.FILTER_SORT.INDEXES.STAGING);
                    } else {
                        // Resolve the production indexes
                        deferred.resolve(extras.FILTER_SORT.INDEXES.PRODUCTION);
                    }
                }, function (err) {
                    extras.$log.error(err);
                    deferred.resolve(defaultIndicies);
                });

                return deferred.promise;
            }
        }]);

        return SortOptions;
    })();

    var BrandsFilter = (function (_Filter) {
        _inherits(BrandsFilter, _Filter);

        function BrandsFilter(brandNames) {
            var extras = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, BrandsFilter);

            _get(Object.getPrototypeOf(BrandsFilter.prototype), 'constructor', this).call(this);
            this.facetFilterValue = extras.FILTER_SORT.FACETS.BRANDS;
            this.defaultSelection = extras.FILTER_SORT.OPTIONS.DEFAULT_BRANDS;
            this.populateOptions(brandNames);
        }

        /**
         * @ngdoc class
         * @name CategoriesFilter
         * @description Represents the filter for categories.
         *
         * @param categoryNames The category names available to filter on.
         * @param extras {Object} Containing the additional dependencies that will be used for support functionality.
         */
        return BrandsFilter;
    })(Filter);

    var CategoriesFilter = (function (_Filter2) {
        _inherits(CategoriesFilter, _Filter2);

        function CategoriesFilter(categoryNames) {
            var extras = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            _classCallCheck(this, CategoriesFilter);

            _get(Object.getPrototypeOf(CategoriesFilter.prototype), 'constructor', this).call(this);
            this.facetFilterValue = extras.FILTER_SORT.FACETS.CATEGORIES;
            this.defaultSelection = extras.FILTER_SORT.OPTIONS.DEFAULT_CATEGORIES;
            this.populateOptions(categoryNames);
        }

        //TODO: eventually move this to some sort of util class
        return CategoriesFilter;
    })(Filter);

    String.prototype.removeTrailingComma = function () {
        try {
            return this.replace(/,\s*$/, "");
        } catch (e) {
            return this;
        }
    };
})();
/**
 * Created by patrick on 2/24/15.
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('AddressListController', ['$scope', '$state', '$log', 'UIUtil', 'AccountService', 'ErrorHandler', 'AppAnalytics', 'AuthService', 'chooseStoreModal', '$rootScope', 'StoreService', AddressListController]);

    function AddressListController($scope, $state, $log, UIUtil, AccountService, ErrorHandler, AppAnalytics, AuthService, chooseStoreModal, $rootScope, StoreService) {

        $scope.title = "Addresses";

        $scope.data = {
            canDelete: true
        };

        $log.info('AddressListController loaded');

        function loadData() {
            $rootScope.$broadcast('refreshCustomerAddressList');
        }

        function showLoading() {
            $scope.showLoading = true;
        }

        function hideLoading() {
            $scope.showLoading = false;
        }

        $scope.$on('$ionicView.afterEnter', function () {
            loadData();
        });

        $scope.noDefaultAddress = function () {
            chooseStoreModal.showModal($scope, null, null, false, 'accountAddressList').then(function (store) {
                UIUtil.showLoading();
                var address = AccountService.getCustomerDefaultShoppingAddress();
                StoreService.selectStoreIdWithAddress(store.id, address).then(function () {
                    $rootScope.$broadcast('refreshCustomerAddressList');
                    UIUtil.hideLoading();
                }, function () {
                    UIUtil.hideLoading();
                });
            });
        };

        $scope.clickAddress = function (address) {
            var customer = AccountService.getCustomerInfo(true);
            var defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
            if (defaultShoppingAddress.zip_code != address.zip_code) {
                chooseStoreModal.showModal($scope, null, null, false, 'accountAddressList', address).then(function (store) {
                    UIUtil.showLoading();
                    StoreService.selectStoreIdWithAddress(store.id, address).then(function () {
                        $rootScope.$broadcast('refreshCustomerAddressList');
                        UIUtil.hideLoading();
                    }, function () {
                        UIUtil.hideLoading();
                    });
                });
            } else {
                UIUtil.showLoading();
                customer.default_shopping_address_id = address.id;
                AccountService.updateAccountInfo(customer).success(function () {
                    AuthService.saveAccountData(customer);
                    $rootScope.$broadcast('refreshCustomerAddressList');
                    UIUtil.hideLoading();
                }).error(function (error) {
                    UIUtil.hideLoading();
                });
            }
        };

        $scope.deleteAddress = function (address) {
            UIUtil.showConfirm('Delete Address', 'Are you sure you want to delete this address?').then(function (confirmed) {
                if (confirmed) {
                    UIUtil.showLoading();
                    AccountService.deleteAddress(address).then(function (updatedAddress) {
                        UIUtil.hideLoading();
                        loadData();
                    }, function (error) {
                        UIUtil.hideLoading();
                        LogService.error(error);
                        ErrorHandler.displayShiptAPIError(error, 'Error deleting the address');
                    });
                }
            });
        };

        $scope.editAddress = function (address) {
            AppAnalytics.track('editAddress', { fromLocation: "account" });
            $log.info('editAddress click', address);
            $state.go('app.addEditAddress', { address: angular.toJson(address) });
        };

        $scope.addNewAddress = function () {
            AppAnalytics.track('addAddress', { fromLocation: "account" });
            $state.go('app.addEditAddressMap', { address: angular.toJson(null) });
        };
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('EditAddressController', ['$scope', '$log', '$rootScope', '$ionicHistory', '$stateParams', 'AccountService', 'UIUtil', 'LogService', 'PlacesAutocomplete', 'ErrorHandler', 'AppAnalytics', 'StoreService', '$q', '$timeout', 'FeatureService', 'ShiptLogItemsService', EditAddressController]);

    function EditAddressController($scope, $log, $rootScope, $ionicHistory, $stateParams, AccountService, UIUtil, LogService, PlacesAutocomplete, ErrorHandler, AppAnalytics, StoreService, $q, $timeout, FeatureService, ShiptLogItemsService) {

        $scope.title = "Edit Address";
        $log.info('accountController loaded');
        $scope.addingNewAddressMode = false;

        $scope.$on('$ionicView.beforeEnter', function () {
            $log.info('beforeEnter, state params: ', $stateParams.address);
            $scope.address = angular.fromJson($stateParams.address);
            $scope.fromSearch = angular.fromJson($stateParams.fromSearch);
            $scope.fromCheckout = angular.fromJson($stateParams.fromCheckout);
            $scope.redirectedFromMap = $scope.address && $scope.address.id == undefined || $scope.fromSearch;
            if ($scope.address == null || $scope.redirectedFromMap) {
                $scope.title = "Add Address";
                $scope.addingNewAddressMode = true;
            } else {
                $scope.title = "Edit Address";
                $scope.addingNewAddressMode = false;
            }
        });

        $scope.streetInputChanged = function () {
            try {
                if ($scope.address.street1) {
                    PlacesAutocomplete.searchText($scope.address.street1).then(function (results) {
                        $log.info('RESULTS: ', results);
                    }, function (error) {
                        $log.info('ERROR: ', error);
                    });
                }
            } catch (e) {
                $log.error(e);
            }
        };

        function handleFromCheckout(newAddress) {
            AccountService.refreshCustomerInfo().then(function (customer) {
                getAddressWithStoreDataPopulated(newAddress.id).then(function (address) {
                    UIUtil.hideLoading();
                    newAddress = address;
                    var currentDefaultAddress = customer.customer_addresses.find(function (a) {
                        return a.id == customer.default_shopping_address_id;
                    });
                    if (!currentDefaultAddress) {
                        $ionicHistory.goBack(-2);
                    }
                    if (currentDefaultAddress.store_location_id == newAddress.store_location_id) {
                        StoreService.selectStoreIdWithAddress(newAddress.store_id, newAddress).then(function () {
                            UIUtil.hideLoading();
                            $ionicHistory.goBack(-2);
                        }, function (error) {
                            UIUtil.hideLoading();
                        });
                    } else if (currentDefaultAddress.store_id == newAddress.store_id) {
                        UIUtil.showYesNoConfirm('This address is serviced by a different store.', "We can update your cart however: Some items may have changed price. Sales may not be applicable. Some items may be unavailable. Want us to update your cart?", "Yes", "No").then(function (shouldChangeStoreAndStuff) {
                            if (shouldChangeStoreAndStuff) {
                                AppAnalytics.track('customerCheckoutChangeStoreLocationWarned', { customerChangedAddress: true });
                                ShiptLogItemsService.logInfo('analytics', 'customerCheckoutChangeStoreLocationWarned', { customerChangedAddress: true });
                                StoreService.selectStoreIdWithAddress(newAddress.store_id, newAddress).then(function () {
                                    UIUtil.hideLoading();
                                    $ionicHistory.goBack(-3);
                                }, function (error) {
                                    UIUtil.hideLoading();
                                });
                            } else {
                                AppAnalytics.track('customerCheckoutChangeStoreLocationWarned', { customerChangedAddress: false });
                                ShiptLogItemsService.logInfo('analytics', 'customerCheckoutChangeStoreLocationWarned', { customerChangedAddress: false });
                                UIUtil.hideLoading();
                                $ionicHistory.goBack(-2);
                            }
                        });
                    } else if (currentDefaultAddress.store_id != newAddress.store_id) {
                        AppAnalytics.track('customerCheckoutChangeStoreBlocked');
                        ShiptLogItemsService.logInfo('analytics', 'customerCheckoutChangeStoreBlocked');
                        UIUtil.hideLoading();
                        UIUtil.showAlert('This address is not in your selected store\'s service area.', "To change where you are shopping please change your location on the home screen of the app.");
                        $ionicHistory.goBack(-2);
                    }
                }, function (error) {
                    UIUtil.hideLoading();
                });
            });
        };

        function getAddressWithStoreDataPopulated(addressId, defer) {
            if (!defer) {
                defer = $q.defer();
            }
            //poll for address until the data is there
            AccountService.getAddress(addressId).then(function (address) {
                if (address.store_id && address.store_location_id) {
                    defer.resolve(address);
                } else {
                    $timeout(function () {
                        return getAddressWithStoreDataPopulated(addressId, defer);
                    }, 2000);
                }
            }, function (error) {
                ErrorHandler.displayShiptAPIError(error);
                defer.reject(error);
            });

            return defer.promise;
        }

        $scope.saveAddress = function (address) {
            //do the save of the address
            UIUtil.showLoading();
            $log.info('saveAddress click', address);
            if ($scope.addingNewAddressMode) {
                AccountService.addAddress(address).then(function (newAddress) {
                    $rootScope.$broadcast('refresh.user-data');
                    if ($scope.fromCheckout && FeatureService.chooseStoreInApp()) {
                        handleFromCheckout(newAddress);
                    } else if ($scope.redirectedFromMap) {
                        UIUtil.hideLoading();
                        $ionicHistory.goBack(-2);
                    } else {
                        UIUtil.hideLoading();
                        $ionicHistory.goBack();
                    }
                    AppAnalytics.addAddress(newAddress);
                }, function (error) {
                    UIUtil.hideLoading();
                    LogService.info({
                        error: error,
                        message: 'addAddress Error',
                        address: address
                    });
                    ErrorHandler.displayShiptAPIError(error, 'Error Creating Address');
                });
            } else {
                AccountService.updateAddress(address).then(function (updatedAddress) {
                    $rootScope.$broadcast('refresh.user-data');
                    UIUtil.hideLoading();
                    $ionicHistory.goBack();
                }, function (error) {
                    UIUtil.hideLoading();
                    LogService.info({
                        error: error,
                        message: 'updateAddress Error',
                        address: address
                    });
                    AppAnalytics.track('addressSaveError', error);
                    ErrorHandler.displayShiptAPIError(error, 'Error Updating Address');
                });
            }
        };

        $scope.deleteAddress = function (deleteAddress) {
            UIUtil.showConfirm('Delete Address', 'Are you sure you want to delete this address?').then(function (confirmed) {
                if (confirmed) {
                    UIUtil.showLoading();
                    AccountService.deleteAddress($scope.address).then(function (updatedAddress) {
                        $rootScope.$broadcast('refresh.user-data');
                        UIUtil.hideLoading();
                        $ionicHistory.goBack();
                    }, function (error) {
                        UIUtil.hideLoading();
                        LogService.error(error);
                        ErrorHandler.displayShiptAPIError(error, 'Error deleting the address.');
                    });
                }
            });
        };
    }
})();
/**
 * Created by Shipt
 */

'use strict';

angular.module('shiptApp').controller('EditAddressMapController', ['$scope', '$state', 'UIUtil', 'LogService', EditAddressMapController]);

function EditAddressMapController($scope, $state, UIUtil, LogService) {

    $scope.$on('$ionicView.afterEnter', function () {
        getLocation();
    });

    $scope.title = "Edit Address";
    $scope.map = {
        zoom: 14
    };

    $scope.options = {
        scrollwheel: false,
        mapTypeControl: false,
        zoomControl: false,
        streetViewControl: false
    };

    $scope.marker = {
        id: 0,
        options: { draggable: false }
    };

    var events = {
        places_changed: function places_changed(searchBox) {
            var place = searchBox.getPlaces();
            $scope.place = place;

            // todo: need to check for place
            $scope.map.center = { latitude: place[0].geometry.location.lat(), longitude: place[0].geometry.location.lng() };
            $scope.marker.coords = { latitude: place[0].geometry.location.lat(), longitude: place[0].geometry.location.lng() };
        }
    };

    $scope.searchbox = {
        template: 'searchbox.tpl.html',
        events: events,
        position: "TOP_CENTER"
    };

    $scope.saveMapLocation = function () {

        if ($scope.place) {
            var address = parsePlace();
            confirmAddress(address);
        } else {
            LogService.info({
                message: 'saveMapLocation Error',
                address: address
            });
            var errorMessage = 'Please find an address on the map';
            UIUtil.showErrorAlert(errorMessage);
        }
    };

    function confirmAddress(address) {
        $state.go('app.addEditAddress', { address: angular.toJson(address) });
    }

    function getLocation() {

        UIUtil.showLoading("Loading Map");
        navigator.geolocation.getCurrentPosition(function (pos) {
            $scope.map.center = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
            $scope.marker.coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
            UIUtil.hideLoading();
        });
    }

    function parsePlace() {
        var address = {};
        var ourAddress = {};
        var addressForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            administrative_area_level_1: 'long_name',
            postal_code: 'short_name'
        };

        var thePlace = $scope.place[0];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = thePlace.address_components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var i = _step.value;

                var addressType = i.types[0];
                if (addressForm[addressType]) {
                    var val = i[addressForm[addressType]];
                    address[addressType] = val;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator['return']) {
                    _iterator['return']();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        ourAddress.street1 = address.street_number + ' ' + address.route;
        ourAddress.city = address.locality;
        ourAddress.state = address.administrative_area_level_1;
        ourAddress.zip_code = address.postal_code;
        return ourAddress;
    }
};
/**
 * Created by Shipt.
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('AccountOrdersController', ['$scope', '$rootScope', 'AccountService', 'UIUtil', '$ionicModal', '$stateParams', '$state', 'AuthService', 'ordersModalProvider', AccountOrdersController]);

    function AccountOrdersController($scope, $rootScope, AccountService, UIUtil, $ionicModal, $stateParams, $state, AuthService, ordersModalProvider) {

        var viewModel = this;
        viewModel.title = "Your Orders";
        var ratingModal = null;
        var orderDetailModal = null;

        var loadOrders = function loadOrders() {
            return AccountService.getOrdersFromServer().then(function (data) {
                var customerInfo = data;
                viewModel.orders = customerInfo.orders;
                hideLoading();
                $scope.$broadcast('scroll.refreshComplete');
            }, function (error) {
                hideLoading();
                var account = AuthService.getCustomerInfo();
                viewModel.orders = account.orders;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        viewModel.getDisplayDate = function (dateString) {
            return moment(dateString).format("MMM Do YYYY, h:mm a");
        };

        viewModel.showRating = function (order) {
            return order.status == "delivered" && order.rating;
        };

        viewModel.doRefresh = function () {
            $rootScope.$broadcast('refresh.user-data');
            loadOrders();
        };

        viewModel.rateOrderClick = function (order) {
            $scope.rateOrder = order;
            $ionicModal.fromTemplateUrl('app/groceries/account/ratings/addRatingModal.html', { scope: $scope }).then(function (modal) {
                ratingModal = modal;
                ratingModal.show();
            });
        };

        viewModel.clickOrder = function (order) {
            if (order.status == 'cancelled') {
                UIUtil.showAlert('Cancelled Order', 'This order has been cancelled.');
                return false;
            }
            $scope.orderDetailOrder = order;
            ordersModalProvider.orderHistoryModal($scope);
        };

        $scope.closeOrderDetailModel = function () {
            orderDetailModal.hide();
            $scope.orderDetailOrder = null;
        };

        $rootScope.$on('hide.add.rating', function () {
            if (ratingModal) ratingModal.hide();
        });

        $rootScope.$on('rating.saved.refresh', function (event, args) {
            if ($scope.rateOrder) $scope.rateOrder.rating = args;
            if ($scope.orderDetailOrder) $scope.orderDetailOrder.rating = args;
        });

        $rootScope.$on('order.saved.refresh', function (event, order) {
            $rootScope.$broadcast('refresh.user-data');
            loadOrders();
        });

        function showRateOrderModal() {
            var passedInOrder = $stateParams.order ? angular.fromJson($stateParams.order) : null;
            if (passedInOrder) {
                var order_id = passedInOrder.order_id;
                var driver_id = passedInOrder.driver_id;
                var order = { id: order_id, driver_id: driver_id, status: passedInOrder.status };
                if (passedInOrder.status) {
                    if (order.status != "delivered") {
                        viewModel.clickOrder(order);
                        return;
                    }
                }
                if (order_id && driver_id) {
                    viewModel.clickOrder(order);
                    viewModel.rateOrderClick(order);
                }
            }
        }

        $scope.$on('$ionicView.afterEnter', function () {
            if ($state.current.name != 'app.orders') {
                showRateOrderModal();
            }
            $rootScope.$broadcast('refresh.user-data');
            showLoading();
            loadOrders();
        });

        function showLoading() {
            viewModel.loadingSpinner = true;
        }
        function hideLoading() {
            viewModel.loadingSpinner = false;
        }
    }
})();
//ordersModalProvider

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('ordersModalProvider', ordersModalProvider);

    ordersModalProvider.$inject = ['$rootScope', '$ionicModal', '$q', 'UserOrderService'];

    /* @ngInject */
    function ordersModalProvider($rootScope, $ionicModal, $q, UserOrderService) {

        var orderDetailUrl = 'app/groceries/account/orders/orderDetail/OrderHistoryDetailModal.html';
        if (webVersion) {
            orderDetailUrl = 'app/groceries/account/orders/orderDetail/webOrderHistoryDetailModal.html';
        }

        function orderHistoryModal($scope, order, rating) {
            if (orderDetailModalIsShown()) {
                return;
            }
            var orderDetailModal = null;
            $scope = $scope || $rootScope.$new();
            if (order) {
                $scope.orderDetailOrder = order;
                $scope.orderDetailOrder.order_lines = [];
            }
            $scope.rating = rating;
            $ionicModal.fromTemplateUrl(orderDetailUrl, {
                scope: $scope,
                backdropClickToClose: false,
                hardwareBackButtonClose: false
            }).then(function (modal) {
                orderDetailModal = modal;
                orderDetailModal.show();
            });
            $scope.closeOrderDetailModel = function () {
                orderDetailModal.hide();
                $scope.orderDetailOrder = null;
            };
        }

        var checkingToOpenLastOrderModal = false;
        var orderDetailModal = null;
        var lastOrderRatingModal = null;
        var $scope = null;

        function currentOrderModal(scope) {
            $scope = scope;
            //set a flag saying that this is checking for an order.
            //this will prevent the push notification from also opening a modal if it has been received as well.
            checkingToOpenLastOrderModal = true;
            UserOrderService.getLastOrderForCustomer().then(function (order) {
                if (!order) {
                    return;
                }
                if (order.status == "delivered" && !order.rating) {
                    showLastOrderRateModal(order);
                } else if (order.status != "delivered" && order.status != "cancelled") {
                    showOrderDetailForCurrentOpenOrder(order);
                } else {
                    checkingToOpenLastOrderModal = false;
                }
            });
        }

        function getOrderDetailModal() {
            var defer = $q.defer();
            if (!orderDetailModal) {
                $scope.closeOrderDetailModel = function () {
                    orderDetailModal.hide();
                };
                return $ionicModal.fromTemplateUrl(orderDetailUrl, {
                    scope: $scope,
                    backdropClickToClose: false,
                    hardwareBackButtonClose: false
                });
            } else {
                defer.resolve(orderDetailModal);
            }
            return defer.promise;
        }

        function showOrderDetailForCurrentOpenOrder(order) {
            $scope.orderDetailOrder = order;
            getOrderDetailModal().then(function (modal) {
                orderDetailModal = modal;
                if (!orderDetailModalIsShown()) {
                    orderDetailModal.show();
                }
                checkingToOpenLastOrderModal = false;
            });
        }

        function orderDetailModalIsShown() {
            //safety method to wrap the isShown() method
            if (orderDetailModal) {
                return orderDetailModal.isShown();
            } else {
                return false;
            }
        }

        function showLastOrderRateModal(order) {
            $scope.rateOrder = order;
            getLastOrderModal().then(function (modal) {
                lastOrderRatingModal = modal;
                if (!lastOrderRatingModalIsShown()) {
                    $scope.$broadcast('last.order.rating.load', $scope.rateOrder);
                    lastOrderRatingModal.show();
                }
                checkingToOpenLastOrderModal = false;
            });
        }

        function lastOrderRatingModalIsShown() {
            //safety method to wrap the isShown() method
            if (lastOrderRatingModal) {
                return lastOrderRatingModal.isShown();
            } else {
                return false;
            }
        }

        function getLastOrderModal(scope) {
            var defer = $q.defer();
            if (scope) {
                $scope = scope;
            }
            if (!lastOrderRatingModal) {
                if (webVersion) {
                    return $ionicModal.fromTemplateUrl('app/groceries/account/ratings/webLastOrderRatingModal.html', {
                        scope: $scope,
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    });
                } else {
                    return $ionicModal.fromTemplateUrl('app/groceries/account/ratings/lastOrderRatingModal.html', {
                        scope: $scope,
                        backdropClickToClose: false,
                        hardwareBackButtonClose: false
                    });
                }
            } else {
                defer.resolve(lastOrderRatingModal);
            }
            return defer.promise;
        }

        $rootScope.$on('hide.order.rating', function (event, notification) {
            if (lastOrderRatingModal) {
                lastOrderRatingModal.hide();
                lastOrderRatingModal = null;
            }
        });

        function showOrderRatingModalForOrder(scope, order) {
            try {
                $scope = scope;
                $scope.rateOrder = order;
                $scope.showingForOrderDetail = true;
                $scope.forceRatingMode = true;
                getLastOrderModal(scope).then(function (modal) {
                    lastOrderRatingModal = modal;
                    if (!lastOrderRatingModalIsShown()) {
                        $scope.$broadcast('last.order.rating.load', $scope.rateOrder);
                        lastOrderRatingModal.show();
                    }
                });
            } catch (e) {}
        }

        var service = {
            orderHistoryModal: orderHistoryModal,
            currentOrderModal: currentOrderModal,
            showOrderRatingModalForOrder: showOrderRatingModalForOrder
        };

        return service;
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('CardCreateController', ['$scope', '$log', '$ionicHistory', '$stateParams', 'AccountService', 'UIUtil', '$rootScope', 'LogService', 'ErrorHandler', 'AppAnalytics', CardCreateController]);

    function CardCreateController($scope, $log, $ionicHistory, $stateParams, AccountService, UIUtil, $rootScope, LogService, ErrorHandler, AppAnalytics) {

        $log.info('CardDetailController loaded');
        var addingNewCardMode = false;

        $scope.$on('$ionicView.beforeEnter', function () {
            $log.info('beforeEnter, state params: ', $stateParams.card);
            $scope.card = angular.fromJson($stateParams.card);
            if ($scope.card == null) {
                $scope.title = "Add Card";
                addingNewCardMode = true;
            } else {
                $scope.title = "Edit Card";
                addingNewCardMode = false;
            }
        });

        $scope.saveCard = function (card) {
            UIUtil.showLoading();
            $log.info('saveCard click', card);
            AccountService.saveNewCard(card).then(function (card) {
                AppAnalytics.addCard();
                $log.info('success');
                $rootScope.$broadcast('refresh.user-data');
                $ionicHistory.goBack();
                UIUtil.hideLoading();
            }, function (error) {
                LogService.error(error);
                $rootScope.$broadcast('refresh.user-data');
                ErrorHandler.displayStripeError(error, "Couldn't Save Card");
                UIUtil.hideLoading();
            });
        };
    };
})();
/**
 * Created by patrick on 2/24/15.
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('CardListController', ['$scope', '$state', '$log', 'AccountService', 'UIUtil', 'ErrorHandler', 'createPaymentMethodModal', CardListController]);

    function CardListController($scope, $state, $log, AccountService, UIUtil, ErrorHandler, createPaymentMethodModal) {

        $scope.title = "Cards";
        $log.info('CardListController loaded');

        function loadData() {
            showLoading();
            AccountService.getCardsFromServer().then(function (data) {
                var customerInfo = data;
                $scope.cards = customerInfo.credit_cards;
                hideLoading();
            }, function (error) {
                hideLoading();
            });
        }

        function showLoading() {
            $scope.showLoading = true;
        }

        function hideLoading() {
            $scope.showLoading = false;
        }

        $scope.$on('$ionicView.afterEnter', function () {
            loadData();
        });

        $scope.editCard = function (card) {
            $log.info('editCard click', card);
            $state.go('app.existingCardDetails', { card: angular.toJson(card) });
        };

        $scope.addNewCard = function () {
            $log.info('addNewCard click');
            // $state.go('app.addEditCard', {card: angular.toJson(null)});
            createPaymentMethodModal.showModal($scope).then(function (newCard) {
                loadData();
            }, function (error) {
                //canceled the payment modal
            });
        };

        $scope.deleteCard = function (card) {
            UIUtil.showConfirm('Delete Credit Card', 'Are you sure you want to delete this credit card?').then(function (confirmed) {
                if (confirmed) {
                    UIUtil.showLoading();
                    $log.info('deleteCard click', card);
                    AccountService.deleteCard(card).then(function (card) {
                        $log.info('success');
                        UIUtil.hideLoading();
                        loadData();
                    }, function (error) {
                        $log.error('error');
                        ErrorHandler.displayShiptAPIError(error, 'There was an error deleting the card.');
                        UIUtil.hideLoading();
                    });
                }
            });
        };
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('ExistingCardDetailsController', ['$scope', '$log', '$ionicHistory', '$stateParams', 'AccountService', 'UIUtil', '$rootScope', 'ErrorHandler', ExistingCardDetailsController]);

    function ExistingCardDetailsController($scope, $log, $ionicHistory, $stateParams, AccountService, UIUtil, $rootScope, ErrorHandler) {

        $scope.$on('$ionicView.beforeEnter', function () {
            $log.info('beforeEnter, state params: ', $stateParams.card);
            $scope.card = angular.fromJson($stateParams.card);
        });

        $scope.deleteCard = function (card) {
            UIUtil.showConfirm('Delete Credit Card', 'Are you sure you want to delete this credit card?').then(function (confirmed) {
                if (confirmed) {
                    UIUtil.showLoading();
                    $log.info('deleteCard click', card);
                    AccountService.deleteCard(card).then(function (card) {
                        $log.info('success');
                        $rootScope.$broadcast('refresh.user-data');
                        UIUtil.hideLoading();
                        $ionicHistory.goBack();
                    }, function (error) {
                        $log.error('error');
                        ErrorHandler.displayShiptAPIError(error, 'There was an error');
                        $rootScope.$broadcast('refresh.user-data');
                        $ionicHistory.goBack();
                        UIUtil.hideLoading();
                    });
                }
            });
        };
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('AddRatingController', ['$scope', '$log', '$rootScope', 'UIUtil', 'OrderRating', 'LogService', 'ShareModalProvider', AddRatingController]);

    function AddRatingController($scope, $log, $rootScope, UIUtil, OrderRating, LogService, ShareModalProvider) {

        $log.info('LoginController loaded');

        var viewModel = this;
        viewModel.rating = null;
        viewModel.ratingSaved = false;
        viewModel.savingRatingInProgress = false;

        viewModel.init = function (rateOrder) {
            if (rateOrder.rating) {
                viewModel.rating = new OrderRating(rateOrder.rating);
            } else {
                viewModel.rating = new OrderRating();
            }
            viewModel.rating.order_id = rateOrder.id;
            viewModel.rating.driver_id = rateOrder.driver_id;

            loadViewData();
        };

        $scope.$watch('viewModel.rating.rating', function () {
            if (viewModel.rating && viewModel.rating.isValid()) {
                viewModel.saveRating();
            }
        });

        viewModel.shareOrder = function () {
            ShareModalProvider.showModal($scope, 'rating_edit_add_modal_from_order_detail');
        };

        viewModel.showShareButton = function () {
            if (webVersion) {
                return false;
            } else {
                return true;
            }
        };

        viewModel.saveRating = function () {
            if (viewModel.rating.isValid) {
                viewModel.savingRatingInProgress = true;
                viewModel.ratingSaved = false;
                viewModel.rating.save().success(function (data) {
                    viewModel.rating.id = data.id;
                    viewModel.ratingSaved = true;
                    viewModel.savingRatingInProgress = false;
                    loadViewData();
                    $rootScope.$broadcast('rating.saved.refresh', viewModel.rating);
                }).error(function (error) {
                    viewModel.savingRatingInProgress = false;
                    viewModel.ratingSaved = false;
                    $log.error('error', error);
                    LogService.error(error);
                    UIUtil.showErrorAlert(JSON.stringify(error));
                });
            }
        };

        viewModel.cancelRating = function () {
            viewModel.rating.save();
            $rootScope.$broadcast('hide.add.rating');
        };

        viewModel.clickReason = function (reason) {
            reason.value = !reason.value;
            viewModel.rating[reason.property] = reason.value;
        };

        function loadViewData() {
            viewModel.badRatingReasons = [{
                name: "Wrong Items",
                names: ["Wrong", "Items"],
                property: "wrong_items",
                value: viewModel.rating.wrong_items
            }, {
                name: "Missing Items",
                names: ["Missing", "Items"],
                property: "missing_items",
                value: viewModel.rating.missing_items
            }, {
                name: "Damaged Items",
                names: ["Damaged", "Items"],
                property: "damaged_items",
                value: viewModel.rating.damaged_items
            }, {
                name: "Late Delivery",
                names: ["Late", "Delivery"],
                property: "late_delivery",
                value: viewModel.rating.late_delivery
            }, {
                name: "Poor Substitutions",
                names: ["Poor", "Substitutions"],
                property: "poor_replacements",
                value: viewModel.rating.poor_replacements
            }, {
                name: "Unfriendly Shopper",
                names: ["Unfriendly", "Shopper"],
                property: "unfriendly_driver",
                value: viewModel.rating.unfriendly_driver
            }];
        }
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('LastOrderRatingModalController', ['$scope', '$log', '$rootScope', 'UIUtil', 'OrderRating', 'LogService', '$ionicModal', 'ShareModalProvider', '$filter', 'TippingModalProvider', 'FeatureService', 'UserOrderService', 'ordersModalProvider', LastOrderRatingModalController]);

    function LastOrderRatingModalController($scope, $log, $rootScope, UIUtil, OrderRating, LogService, $ionicModal, ShareModalProvider, $filter, TippingModalProvider, FeatureService, UserOrderService, ordersModalProvider) {

        var viewModel = this;
        viewModel.rating = null;
        viewModel.ratingSaved = false;
        viewModel.savingRatingInProgress = false;
        viewModel.tipMode = true;
        viewModel.rateMode = $scope.forceRatingMode ? true : false;

        var orderDetailModal = null;
        viewModel.init = function (rateOrder) {
            var rateOrder = $scope.rateOrder;
            viewModel.order = rateOrder;
            if (rateOrder.rating) {
                viewModel.rating = new OrderRating(rateOrder.rating);
            } else {
                viewModel.rating = new OrderRating();
            }
            viewModel.rating.order_id = rateOrder.id;
            viewModel.rating.driver_id = rateOrder.driver_id;
            loadViewData();
        };

        viewModel.showTipping = function () {
            if (FeatureService.showTipping() && viewModel.tipMode) {
                return true;
            } else {
                return false;
            }
        };

        $scope.$on('last.order.rating.load', function (event, data) {
            $scope.rateOrder = data;
            viewModel.init($scope.rateOrder);
            initTip();
        });

        viewModel.getTipString = function () {
            if (viewModel.order.tip && viewModel.order.tip > 0) {
                return $filter('currency')(viewModel.order.tip);
            } else {
                return 'No Tip';
            }
        };

        viewModel.tipClick = function () {
            if (!viewModel.order.tippable) {
                UIUtil.showAlert('Tipping Not Available', 'Sorry, but tipping is not available anymore for this order.');
                return;
            }
            TippingModalProvider.showModal($scope, viewModel.order).then(function (order) {
                viewModel.order = order;
            });
        };

        viewModel.viewOrderClick = function () {
            if ($scope.showingForOrderDetail) {
                viewModel.closeRating();
                return;
            }
            $scope.orderDetailOrder = $scope.rateOrder;
            $scope.orderDetailFromRateOrder = true;
            $scope.closeOrderDetailModel = function () {
                if (orderDetailModal) orderDetailModal.hide();
            };
            ordersModalProvider.orderHistoryModal($scope);
        };

        $scope.$watch('viewModel.rating.rating', function () {
            if (viewModel.rating && viewModel.rating.isValid()) {
                viewModel.changesToSave = true;
            } else {
                viewModel.changesToSave = false;
            }
        });

        viewModel.saveChanges = function () {
            if (viewModel.tipMode) {
                viewModel.rateMode = true;
                viewModel.tipMode = false;
                return;
            }
            UIUtil.showLoading('Saving Feedback...');
            if (viewModel.rating.isValid) {
                if (viewModel.otherAmount) {
                    viewModel.saveOtherTipAmount();
                }
                viewModel.savingRatingInProgress = true;
                viewModel.ratingSaved = false;

                if (viewModel.orderItemsMode && !$scope.showingForOrderDetail) {
                    $scope.orderDetailOrder = $scope.rateOrder;
                    $scope.orderDetailFromRateOrder = true;
                    $scope.closeOrderDetailModel = function () {
                        if (orderDetailModal) orderDetailModal.hide();
                    };
                    ordersModalProvider.orderHistoryModal($scope, null, viewModel.rating);
                }

                // UIUtil.hideLoading();
                // return;
                viewModel.rating.save().success(function (data) {
                    viewModel.rating.id = data.id;
                    viewModel.ratingSaved = true;
                    viewModel.savingRatingInProgress = false;
                    viewModel.closeRating();
                    UIUtil.hideLoading();
                    if (viewModel.rating.rating == 5) {
                        ShareModalProvider.showModal($scope, 'rate_last_order_modal');
                    }
                    $rootScope.$broadcast('rating.saved.refresh', viewModel.rating);
                }).error(function (error) {
                    viewModel.savingRatingInProgress = false;
                    viewModel.ratingSaved = false;
                    viewModel.closeRating();
                    UIUtil.hideLoading();
                    $log.error('error', error);
                    LogService.error(error);
                    UIUtil.showErrorAlert(JSON.stringify(error));
                });
            }
        };

        viewModel.getRatingTextTitle = function () {
            var name = "<strong>" + $filter('driverNameFilter')(viewModel.order.driver.name) + "</strong>";
            if (viewModel.tipMode) {
                return name + " has completed your order.";
            }
            var message = "";
            switch (viewModel.rating.rating) {
                case 1:
                    message = name + " was a complete disaster.";
                    break;
                case 2:
                    message = name + " was not good.";
                    break;
                case 3:
                    message = name + " was so-so.";
                    break;
                case 4:
                    message = name + " did ok, could be better.";
                    break;
                case 5:
                    message = name + " is the best of the best!";
                    break;
                default:
                    message = "Rate " + name + " for this order.";
            }
            return message;
        };

        viewModel.tipUntilTimeString = function () {
            if (viewModel.order.tippable) {
                var formatString = moment(viewModel.order.tippable_until).format('MMMM Do YYYY, h:mm a');
                return formatString;
            } else {
                return 'n/a';
            }
        };

        viewModel.tipOptions = [{
            amount: 0,
            text: 'No Tip'
        }, {
            amount: 5,
            text: '$5'
        }, {
            amount: 10,
            text: '$10'
        }, {
            amount: 15,
            text: '$15'
        }, {
            amount: 0,
            text: 'Other'
        }];
        viewModel.otherTipAmount = null;

        $scope.$watch('viewModel.otherTipAmount', function () {
            if (viewModel.otherTipAmount != null && viewModel.otherTipAmount != "") {
                viewModel.tipOption = null;
                viewModel.otherAmount = true;
            } else {
                viewModel.otherAmount = false;
            }
        });

        viewModel.selectTipOption = function (tipOption) {
            if (tipOption.text == "Other") {
                viewModel.otherAmount = true;
                viewModel.tipOption = tipOption;
                return;
            }
            viewModel.otherTipAmount = null;
            viewModel.otherAmount = false;
            viewModel.tipOption = tipOption;
            viewModel.order.tip = tipOption.amount;
            UserOrderService.tipOrder(viewModel.order);
        };

        viewModel.saveOtherTipAmount = function () {
            viewModel.order.tip = viewModel.otherTipAmount;
            UserOrderService.tipOrder(viewModel.order);
        };

        viewModel.closeRating = function () {
            $rootScope.$broadcast('hide.order.rating');
        };

        viewModel.clickReason = function (reason) {
            reason.value = !reason.value;
            viewModel.rating[reason.property] = reason.value;
            if (reason.triggerItemFlow) {
                viewModel.orderItemsMode = true;
            }
        };

        function initTip() {
            try {
                viewModel.tipOption = null;
                if (!viewModel.order.tip || viewModel.order.tip == 0) {
                    //leave the selections blank if they have not chosen anything yet
                } else {
                        for (var i = 0; i < viewModel.tipOptions.length; i++) {
                            var to = viewModel.tipOptions[i];
                            if (viewModel.order.tip == to.amount) {
                                viewModel.tipOption = to;
                                break;
                            }
                        }
                        if (viewModel.tipOption == null) {
                            viewModel.otherAmount = true;
                            viewModel.otherTipAmount = viewModel.order.tip;
                        }
                        viewModel.tipMode = false;
                        viewModel.rateMode = true;
                    }
                if ($scope.forceRatingMode) {
                    viewModel.tipMode = false;
                    viewModel.rateMode = true;
                }
            } catch (exception) {
                LogService.error(['error in initTip', exception]);
            }
        }

        viewModel.getBadRatingReasons = function () {
            if (viewModel.rating.rating && viewModel.rating.rating == 5) {
                return viewModel.fiveStarBadRatingReasons;
            } else {
                return viewModel.badRatingReasons;
            }
        };

        function loadViewData() {
            viewModel.fiveStarBadRatingReasons = [{
                name: "Went Above and Beyond",
                property: "went_above_and_beyond",
                value: viewModel.rating.went_above_and_beyond,
                triggerItemFlow: false
            }, {
                name: "Good Communicator",
                property: "good_communication",
                value: viewModel.rating.good_communication,
                triggerItemFlow: true
            }, {
                name: "Friendly",
                property: "friendly_driver",
                value: viewModel.rating.unfriendly_driver,
                triggerItemFlow: false
            }, {
                name: "Wrong Items",
                property: "wrong_items",
                value: viewModel.rating.wrong_items,
                triggerItemFlow: true
            }, {
                name: "Missing Items",
                property: "missing_items",
                value: viewModel.rating.missing_items,
                triggerItemFlow: true
            }, {
                name: "Damaged Items",
                property: "damaged_items",
                value: viewModel.rating.damaged_items,
                triggerItemFlow: true
            }];

            viewModel.badRatingReasons = [{
                name: "Wrong Items",
                property: "wrong_items",
                value: viewModel.rating.wrong_items,
                triggerItemFlow: true
            }, {
                name: "Missing Items",
                property: "missing_items",
                value: viewModel.rating.missing_items,
                triggerItemFlow: true
            }, {
                name: "Damaged Items",
                property: "damaged_items",
                value: viewModel.rating.damaged_items,
                triggerItemFlow: true
            }, {
                name: "Late Delivery",
                property: "late_delivery",
                value: viewModel.rating.late_delivery,
                triggerItemFlow: false
            }, {
                name: "Poor Substitutions",
                property: "poor_replacements",
                value: viewModel.rating.poor_replacements,
                triggerItemFlow: true
            }, {
                name: "Unfriendly Shopper",
                property: "unfriendly_driver",
                value: viewModel.rating.unfriendly_driver,
                triggerItemFlow: false
            }];
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('planController', planController);

    planController.$inject = ['$scope', '$log', 'Subscription', 'selectPaymentMethod', 'UIUtil', 'choosePlan', 'ErrorHandler', '$rootScope', 'createPaymentMethodModal', 'FeatureService'];

    function planController($scope, $log, Subscription, selectPaymentMethod, UIUtil, choosePlan, ErrorHandler, $rootScope, createPaymentMethodModal, FeatureService) {

        var vm = this;
        vm.planLoaded = false;

        activate();

        function activate() {
            vm.plan = $scope.plan;
            loadPlans();
            if (!vm.plan) {
                if ($scope.planPromise) {
                    $scope.planPromise.then(function (data) {
                        vm.plan = data;
                        $log.info("vm.plan", vm.plan);
                        vm.planLoaded = true;
                        $scope.planPromise = null;
                    });
                } else {
                    vm.populatePlan();
                }
            } else {
                vm.planLoaded = true;
            }
        }

        function loadPlans() {
            Subscription.list().then(function (data) {
                vm.availablePlans = data;
            }, function (error) {
                $log.error(error);
            });
        }

        vm.addPaymentMethod = function () {
            createPaymentMethodModal.showModal($scope).then(function (cardAdded) {
                vm.populatePlan();
            }, function (error) {
                //no card added
            });
        };

        vm.changePlan = function () {
            choosePlan.showModal($scope, vm.availablePlans, vm.plan.plan).then(function (selectedPlan) {
                if (selectedPlan.id != vm.plan.plan.id) {
                    UIUtil.showLoading('Saving Plan...');
                    vm.plan.plan_id = selectedPlan.id;
                    Subscription.update(vm.plan).then(function (data) {
                        UIUtil.hideLoading();
                        UIUtil.showAlert('Plan Updated', 'Your plan has been updated to the ' + data.plan.name + ' plan.');
                        $rootScope.$broadcast('refresh.user-data');
                        vm.plan = data;
                    }, function (error) {
                        UIUtil.hideLoading();
                    });
                }
            }, function () {
                //modal was canceled
            });
        };

        vm.choosePlan = function () {
            choosePlan.showModal($scope, vm.availablePlans, null).then(function (selectedPlan) {
                $scope.saveModal();
                UIUtil.showLoading('Saving Plan...');
                selectedPlan.plan_id = selectedPlan.id;
                Subscription.create(selectedPlan).then(function (data) {
                    UIUtil.hideLoading();
                    UIUtil.showAlert('Plan Created', 'You have been subscribed to the ' + data.plan.name + ' plan.');
                    $rootScope.$broadcast('refresh.user-data');
                    vm.plan = data;
                }, function (error) {
                    UIUtil.hideLoading();
                });
            }, function () {
                $scope.cancelModal();
                //modal was canceled
            });
        };

        vm.planPrice = function (plan) {
            var amount = plan.amount / 100;
            return amount;
        };

        vm.populatePlan = function () {
            Subscription.edit().then(function (data) {
                vm.plan = data;
                $log.info("vm.plan", vm.plan);
                vm.planLoaded = true;
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        vm.trialEnding = function () {
            var trialEnding = moment(vm.plan.trial_end, "YYYY-MM-DD HH:mm:SS Z").format("MMMM Do");
            return trialEnding;
        };

        vm.defaultCard = function () {
            var card = vm.plan.sources.find(function (x) {
                return x.default_source;
            });
            return card;
        };

        vm.currentPeriod = function () {
            var start = moment(vm.plan.current_period_start, "YYYY-MM-DD HH:mm:SS Z").format("MMM Do YYYY");
            var end = moment(vm.plan.current_period_end, "YYYY-MM-DD HH:mm:SS Z").format("MMM Do YYYY");
            var formatted = start + ' to ' + end;
            return formatted;
        };

        vm.cancelPlan = function () {
            UIUtil.showYesNoConfirm('Cancel Plan', 'Are you sure you want to cancel your plan?').then(function (confirmed) {
                if (confirmed) {
                    UIUtil.showLoading('Cancelling...');
                    performCancelSubscription();
                }
            });
        };

        function performCancelSubscription() {
            Subscription.cancel().then(function (result) {
                UIUtil.hideLoading();
                UIUtil.showAlert('Plan Cancelled', '').then(function () {
                    $rootScope.$broadcast('refresh.user-data');
                    vm.cancel();
                });
            }, function (error) {
                UIUtil.hideLoading();
                showCancelSubscriptionError(error);
            });
        }

        function showCancelSubscriptionError(error) {
            ErrorHandler.displayShiptAPIError(error, 'Error', 'We\'re sorry, there was a problem cancelling your subscription.\n Please contact us for help.');
        }

        vm.cancel = function () {
            $scope.cancelModal();
        };

        vm.showCancelPlan = function () {
            return FeatureService.subscriptionCancellation();
        };

        vm.addEditCardForPlan = function () {
            selectPaymentMethod.showModal($scope, vm.plan.sources, vm.defaultCard()).then(function (selectedCard) {
                if (selectedCard && selectedCard.id != vm.defaultCard().id) {
                    $log.info('selected new card');
                    vm.plan.default_card = selectedCard.id;
                    vm.plan.default_source = selectedCard.id;
                    UIUtil.showLoading('Updating Payment...');
                    Subscription.update(vm.plan).then(function (data) {
                        UIUtil.hideLoading();
                        $rootScope.$broadcast('refresh.user-data');
                        vm.plan = data;
                    }, function (error) {
                        UIUtil.hideLoading();
                    });
                }
            });
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('planProvider', planProvider);

    planProvider.$inject = ['$rootScope', '$ionicModal', '$q'];

    /* @ngInject */
    function planProvider($rootScope, $ionicModal, $q) {

        var modal = null;
        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/plan/plan.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                focusFirstInput: true
            }).then(function (_modal) {
                defer.resolve(_modal);
            });
            return defer.promise;
        }

        var init = function init($scope, plan) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.plan = plan;
            getModal($scope).then(function (_modal) {
                modal = _modal;
                modal.show();
            });

            $scope.saveModal = function () {
                defer.resolve();
                modal.hide();
                modal.remove();
                modal = null;
            };
            $scope.cancelModal = function () {
                defer.reject();
                modal.hide();
                modal.remove();
                modal = null;
            };
            $scope.$on('$destroy', function () {
                if (modal) modal.remove();
            });

            return defer.promise;
        };

        var service = {
            showModal: init
        };

        return service;
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('chooseStoreModalAddressController', chooseStoreModalAddressController);

    chooseStoreModalAddressController.$inject = ['$scope', '$log', 'Subscription', 'selectPaymentMethod', 'UIUtil', 'AuthService', 'ErrorHandler', '$rootScope', 'createPaymentMethodModal', 'FeatureService', '$timeout', 'Geolocator', 'PlacesAutocomplete', 'StoreService', 'ShiptLogItemsService', '$cordovaKeyboard', 'AppAnalytics', '$ionicScrollDelegate'];

    function chooseStoreModalAddressController($scope, $log, Subscription, selectPaymentMethod, UIUtil, AuthService, ErrorHandler, $rootScope, createPaymentMethodModal, FeatureService, $timeout, Geolocator, PlacesAutocomplete, StoreService, ShiptLogItemsService, $cordovaKeyboard, AppAnalytics, $ionicScrollDelegate) {

        var vm = this;

        vm.requireZip = false;
        vm.addressPlaceholder = "Enter Address";
        vm.suggestButtonText = "New Store Request";
        vm.changeAddressText = 'Change<br>Address';

        init();

        function init() {
            hideSpinner();
            getCurrentLocationAddress();
            loadCustomerAddresses();
            vm.selectedAddress = $scope.address;
            vm.editShoppingAddressMode = $scope.editShoppingAddressMode;
            if ($scope.addressToSelectFor) {
                vm.selectedAddress = $scope.addressToSelectFor;
            }
            AppAnalytics.track('chooseStoreModal.show', { addressPassedIn: vm.selectedAddress, source: $scope.source });
            if (!vm.selectedAddress) {
                vm.requireZip = true;
                selectZipInput();
            } else {
                loadStoresForAddress();
            }
            if ($scope.store) {
                vm.selectedStore = $scope.store;
            }
        };

        function selectZipInput() {
            $timeout(function () {
                var element1 = angular.element("#chooseStoreAddressInput");
                element1.select();
            }, 300);
        }

        vm.cancel = function (store) {
            if (store) {
                $scope.saveModal(store);
            } else {
                $scope.cancelModal();
            }
        };

        vm.clickAddress = function (address) {
            try {
                vm.selectedAddress = address;
                AppAnalytics.track('chooseStoreModal.clickAddress', { address: vm.selectedAddress });
                loadStoresForAddress();
                vm.editShoppingAddressMode = false;
                $ionicScrollDelegate.scrollTop();
            } catch (e) {
                $log.error(e);
            }
        };

        vm.addAddress = function () {
            vm.selectedAddress = null;
            vm.editShoppingAddressMode = false;
            selectZipInput();
            AppAnalytics.track('chooseStoreModal.addAddressClick');
        };

        vm.changeAddress = function () {
            if (vm.requireZip) {
                vm.selectedAddress = null;
                selectZipInput();
                AppAnalytics.track('chooseStoreModal.changeAddressClick');
            } else {
                $log.info('changeAddressClicked');
                $('.delivering-to').focus();
                vm.editShoppingAddressMode = true;
            }
            $ionicScrollDelegate.scrollTop();
        };

        vm.clickStore = function (store) {
            try {
                UIUtil.showLoading('Saving Store...');
                AppAnalytics.track('chooseStoreModal.clickOnStore', { store: store });
                vm.selectedStore = store;
                StoreService.selectStoreWithAddress(store, vm.selectedAddress).then(function () {
                    UIUtil.hideLoading();
                    vm.cancel(store);
                    $rootScope.$broadcast('refresh.user-data');
                }, function (error) {
                    ErrorHandler.displayShiptAPIError(error);
                    UIUtil.hideLoading();
                });
            } catch (e) {
                UIUtil.hideLoading();
            }
        };

        vm.getAddressString = function (address) {
            var string = "";
            string += address.street1 + ", ";
            if (address.street2) {
                string += address.street2 + ", ";
            }
            string += address.city + ", ";
            string += address.state + " ";
            string += address.zip_code;
            return string;
        };

        $scope.$watch('vm.addressText', function (val) {
            if (!vm.addressText || vm.addressText == "" || vm.addressText.length < 4) {
                vm.addressResults = null;
            } else {
                vm.searchForAddress();
            }
        });

        vm.searchForAddress = function () {
            try {
                if (vm.addressText && vm.addressText != "") {
                    PlacesAutocomplete.searchText(vm.addressText).then(function (results) {
                        vm.addressResults = [];
                        for (var i = 0; i < results.predictions.length; i++) {
                            PlacesAutocomplete.getPlaceDetails(results.predictions[i]).then(function (address) {
                                try {
                                    var thePlace = address;
                                    if (!thePlace.result) {
                                        thePlace = {
                                            result: address
                                        };
                                    }
                                    var res = PlacesAutocomplete.parseResult(thePlace.result);
                                    if (res) {
                                        vm.addressResults.push(res);
                                    }
                                } catch (e) {}
                            });
                        }
                    }, function (error) {
                        vm.addressResults = [];
                        $log.info('ERROR: ', error);
                    });
                }
            } catch (e) {
                vm.addressResults = [];
            }
        };

        vm.suggestStore = function () {
            //get store name
            var storeName = "";
            UIUtil.promptForInput('Where Next?', 'Let us know a store brand you would like us to offer in the future.', 'Submit').then(function (name) {
                if (name && name != "") {
                    vm.suggestButtonText = "Saving...";
                    AppAnalytics.track('chooseStoreModal.requestNewStore', { storeRequest: name });
                    ShiptLogItemsService.logInfo('customer_request_store', 'request', { zip: vm.zip, store_name: storeName }).then(function () {
                        vm.suggestButtonText = "Saved!";
                    }, function () {
                        vm.suggestButtonText = "Error";
                    });
                }
            }, function () {
                vm.suggestButtonText = "New Store Request";
            });
            $cordovaKeyboard.show();
        };

        function loadCustomerAddresses() {
            try {
                var user = AuthService.getUserInfo();
                vm.customer_addresses = user.customer_addresses;
            } catch (e) {}
        }

        function getCurrentLocationAddress() {
            Geolocator.getCurrentPosition(true).then(function () {
                var lat = Geolocator.latitude();
                var long = Geolocator.longitude();
                PlacesAutocomplete.getReverseGeoAddress(lat, long).then(function (data) {
                    vm.currentLocationAddress = data;
                }, function (error) {
                    UIUtil.showAlert('Error Getting Current Address', '');
                });
            });
        };

        $scope.$watch('vm.zipCode', function () {
            var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(vm.zipCode);
            if (isValidZip) {
                //search for stores if valid zip
                loadStoresForAddress();
            } else {
                //let them keep typing
                hideSpinner();
            }
        });

        function loadStoresForAddress() {
            try {
                showSpinner();
                vm.stores = null;
                StoreService.listForAddress(vm.selectedAddress).then(function (stores) {
                    vm.stores = sortStores(stores);
                    $('.edit-address-button').focus();
                    AppAnalytics.track('chooseStoreModal.storesDisplayedForAddress', { stores: vm.stores, address: vm.selectedAddress });
                    hideSpinner();
                }, function (error) {
                    ErrorHandler.displayShiptAPIError(error, 'Error Getting Stores For Zip');
                    hideSpinner();
                });
            } catch (e) {}
        }

        function sortStores(stores) {
            return _.sortBy(stores, function (store) {
                // Pull new stores to the top
                if (store.new_store) {
                    return store;
                }
            });
        }

        function showSpinner() {
            vm.showSpinner = true;
        }

        function hideSpinner() {
            vm.showSpinner = false;
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('ArticleController', ['$scope', '$stateParams', '$state', 'UIUtil', '$log', 'AccountService', 'HelpService', ArticleController]);

    function ArticleController($scope, $stateParams, $state, UIUtil, $log, AccountService, HelpService) {

        var viewModel = this;
        viewModel.question = undefined;
        viewModel.q = angular.fromJson($stateParams.q);

        function loadAnswer() {
            HelpService.getFaq(viewModel.q.id).then(function (data) {
                viewModel.question = data;
            });
        }

        loadAnswer();
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('FaqController', ['$state', '$filter', 'HelpService', '$stateParams', FaqController]);

    function FaqController($state, $filter, HelpService, $stateParams) {

        var viewModel = this;
        viewModel.searchArticles = [];
        viewModel.searchQuery = "";
        viewModel.showSearch = false;

        viewModel.category = angular.fromJson($stateParams.category);

        function loadFaq() {
            viewModel.loadingSpinner = true;
            HelpService.getFaqsForCategory(viewModel.category.id).then(function (data) {
                viewModel.articles = data;
                viewModel.loadingSpinner = false;
            }, function (error) {
                viewModel.errorHappened = true;
                viewModel.loadingSpinner = false;
            });
        }

        viewModel.clearSearch = function () {
            viewModel.searchQuery = '';
        };

        viewModel.showList = function () {
            if (!viewModel.articles) return false;
            if (viewModel.articles.length < 1) return false;
            if ($filter('filter')(viewModel.articles, viewModel.searchQuery).length < 1) return false;
            return true;
        };

        viewModel.articleClick = function (article) {
            $state.go('app.faqArticle', { q: angular.toJson(article) });
        };

        loadFaq();
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('CartProductNotesController', ['$scope', '$rootScope', CartProductNotesController]);

    function CartProductNotesController($scope, $rootScope) {
        var viewModel = this;

        viewModel.orderNotes = false;
        viewModel.placeholder = "Instructions from you to the shopper about this product.";
        viewModel.noteCartItem = {
            note: ""
        };

        viewModel.cancelNotes = function () {
            if (viewModel.orderNotes) {
                $rootScope.$broadcast('cancel.orderNotes');
            } else {
                $rootScope.$broadcast('cancel.productNotes');
            }
        };

        viewModel.saveNotes = function () {
            if (viewModel.orderNotes) {
                $rootScope.$broadcast('close.orderNotes', viewModel.noteCartItem.note);
            } else {
                $rootScope.$broadcast('close.productNotes', viewModel.noteCartItem.note);
            }
        };

        viewModel.addToCustomItemCount = function () {
            viewModel.customProduct.qty = viewModel.customProduct.qty + 1;
        };

        $scope.$on('data.productNotes', function (event, data) {
            if (data && (data.title || data.notes)) {
                viewModel.title = data.title;
                viewModel.noteCartItem.note = data.notes;
                viewModel.orderNotes = true;
                viewModel.placeholder = "Instructions from you to the shopper.";
            } else {
                viewModel.title = "Product Notes";
                viewModel.noteCartItem.note = data;
            }
        });
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('CheckoutController', ['$scope', '$rootScope', '$ionicModal', 'ShoppingService', 'UserOrderService', '$log', '$state', 'UIUtil', 'common', 'LogService', '$ionicPopover', 'AccountService', 'ShareModalProvider', 'DeliveryWindowSelectorProvider', 'SubstitutionOptionsModalProvider', 'ErrorHandler', 'AppAnalytics', 'createPaymentMethodModal', 'selectAddressModal', '$q', '$ionicHistory', 'StoreService', 'FeatureService', 'ShiptLogItemsService', 'ordersModalProvider', CheckoutController]);

    function CheckoutController($scope, $rootScope, $ionicModal, ShoppingService, UserOrderService, $log, $state, UIUtil, common, LogService, $ionicPopover, AccountService, ShareModalProvider, DeliveryWindowSelectorProvider, SubstitutionOptionsModalProvider, ErrorHandler, AppAnalytics, createPaymentMethodModal, selectAddressModal, $q, $ionicHistory, StoreService, FeatureService, ShiptLogItemsService, ordersModalProvider) {

        var viewModel = this;
        $log.info('CheckoutController Start');
        var resetAddress = true;
        var resetCard = true;
        var needsRefresh = true;
        viewModel.title = "Checkout";

        viewModel.substitutionOptions = common.getCustomerOrderSubstitutionPreferenceOptions();

        viewModel.selectedSubstitutionOption = viewModel.substitutionOptions[0];
        var order = new common.Order();

        viewModel.checkout = {
            selectedAddress: null,
            deliveryWindow: null,
            selectedCard: null
        };

        $scope.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        var buildUpOrderObject = function buildUpOrderObject() {
            order = new common.Order();
            if (viewModel.checkout.selectedAddress) {
                order.customer_address_id = viewModel.checkout.selectedAddress.id;
            }
            if (viewModel.checkout.deliveryWindow) {
                order.time_slot_id = viewModel.checkout.deliveryWindow.time_slot_id;
            }
            if (viewModel.checkout.selectedCard) {
                order.credit_card_id = viewModel.checkout.selectedCard.id;
            }
            order.notes = viewModel.notes;
            order.alcohol_terms_accepted = $rootScope.alcohol_terms_accepted;
            order.substitution_preference = viewModel.selectedSubstitutionOption.value;
            addOrderLinesToOrderObject();
        };

        var addOrderLinesToOrderObject = function addOrderLinesToOrderObject() {
            var i;
            order.order_lines = [];
            for (i = 0; i < viewModel.cart.length; i++) {
                var cartItem = viewModel.cart[i];
                if (cartItem.product.isCustom) {
                    var orderLine = new common.CustomOrderLine();
                    orderLine.requested_qty = cartItem.qty;
                    orderLine.requested_product_attributes.description = cartItem.product.name;
                    orderLine.notes = cartItem.note;
                    order.order_lines.push(orderLine);
                } else {
                    var orderLine = new common.OrderLine();
                    orderLine.requested_product_id = cartItem.product.id;
                    orderLine.product = cartItem.product;
                    orderLine.requested_qty = cartItem.qty;
                    orderLine.notes = cartItem.note;
                    order.order_lines.push(orderLine);
                }
            }
        };

        viewModel.showDeliveryWindowSelector = function () {
            var windows = viewModel.newOrder.time_slots;
            var selectedWindow = viewModel.checkout.deliveryWindow;
            DeliveryWindowSelectorProvider.showSelectDeliveryWindowModal($scope, windows, selectedWindow).then(function (newSelectedWindow) {
                viewModel.checkout.deliveryWindow = newSelectedWindow;
                AppAnalytics.track('checkoutDeliveryWindowSelected', newSelectedWindow);
            });
            AppAnalytics.track('checkoutChangeDeliveryWindowClicked');
        };

        viewModel.showSubstitutionOptionsModal = function () {
            var selectedWindow = viewModel.checkout.deliveryWindow;
            SubstitutionOptionsModalProvider.showSubstitutionOptionsModal($scope, viewModel.substitutionOptions, viewModel.selectedSubstitutionOption).then(function (newselectedSubstitutionOption) {
                viewModel.selectedSubstitutionOption = newselectedSubstitutionOption;
                AppAnalytics.track('checkoutSubstitutionOptionSelected', newselectedSubstitutionOption);
            });
            AppAnalytics.track('checkoutSubstitutionOptionsClicked');
        };

        viewModel.checkOrder = function () {
            if (!viewModel.checkout) {
                return false;
            }
            if (!viewModel.checkout.selectedAddress) {
                UIUtil.showAlert('Address Required', 'Please select an address.');
                return false;
            }
            if (!viewModel.checkout.deliveryWindow) {
                UIUtil.showAlert('Delivery Window Required', 'Please select a delivery window.');
                return false;
            }
            if (!viewModel.checkout.selectedCard) {
                UIUtil.showAlert('Payment Method Required', 'Please select payment method.');
                return false;
            }
            return true;
        };

        function removeSelectedTimeSlotFromArrayThatIsNotAvailable() {
            try {

                var indexToRemove = viewModel.newOrder.time_slots.indexOf(viewModel.checkout.deliveryWindow);
                if (indexToRemove > -1) {
                    viewModel.newOrder.time_slots[indexToRemove].available = false;
                }
                if (viewModel.checkout.deliveryWindow) {
                    viewModel.checkout.deliveryWindow = null;
                }
            } catch (exception) {
                LogService.error('removeSelectedTimeSlotFromArrayThatIsNotAvailable' + exception);
            }
        }

        viewModel.submitOrder = function () {
            if (viewModel.checkOrder()) {
                UIUtil.showLoading();
                buildUpOrderObject();
                AppAnalytics.checkoutButtonClicked();
                $log.info("submitOrder", order);
                UserOrderService.postNewOrder(order).then(function (createdOrder) {
                    viewModel.createdOrder = createdOrder;
                    showOrderDetailAfterPurchaseComplete(createdOrder);
                    ShoppingService.clearCart();
                    UIUtil.hideLoading();
                    AppAnalytics.checkoutComplete(createdOrder, order.order_lines, viewModel.checkout.selectedAddress);
                }, function (error) {
                    AppAnalytics.checkoutButtonClickedError();
                    LogService.error(['submitOrder error ', error, order]);
                    var message = ErrorHandler.displayShiptAPIError(error, 'Problem Submitting Order', 'Not able to submit your order at this time.');
                    if (message.includes("should be available_for_delivery")) {
                        removeSelectedTimeSlotFromArrayThatIsNotAvailable();
                    }
                    UIUtil.hideLoading();
                });
            }
        };

        viewModel.addressChanged = function () {
            if (!viewModel.checkout.selectedAddress) {
                resetAddress = true;
                viewModel.addAddress();
            }
        };

        function addressIsChoosableBasedOnCurrentStoreAndStuff(newAddress) {
            var deferred = $q.defer();
            if (!FeatureService.chooseStoreInApp()) {
                deferred.resolve();
                return deferred.promise;
            }
            var currentDefaultAddress = viewModel.newOrder.available_customer_addresses.find(function (a) {
                return a.id == viewModel.customer.default_shopping_address_id;
            });
            if (!currentDefaultAddress) {
                deferred.resolve();
                return deferred.promise;
            }
            if (currentDefaultAddress.store_location_id == newAddress.store_location_id) {
                StoreService.selectStoreIdWithAddress(newAddress.store_id, newAddress);
                deferred.resolve();
            } else if (currentDefaultAddress.store_id == newAddress.store_id) {
                UIUtil.showYesNoConfirm('This address is serviced by a different store.', "We can update your cart however: Some items may have changed price. Sales may not be applicable. Some items may be unavailable. Want us to update your cart?", "Yes", "No").then(function (shouldChangeStoreAndStuff) {
                    if (shouldChangeStoreAndStuff) {
                        AppAnalytics.track('customerCheckoutChangeStoreLocationWarned', { customerChangedAddress: true });
                        ShiptLogItemsService.logInfo('analytics', 'customerCheckoutChangeStoreLocationWarned', { customerChangedAddress: true });
                        deferred.reject();
                        $ionicHistory.goBack();
                        StoreService.selectStoreIdWithAddress(newAddress.store_id, newAddress);
                    } else {
                        deferred.reject();
                        AppAnalytics.track('customerCheckoutChangeStoreLocationWarned', { customerChangedAddress: false });
                        ShiptLogItemsService.logInfo('analytics', 'customerCheckoutChangeStoreLocationWarned', { customerChangedAddress: false });
                    }
                });
                // if store is same but location is different then
                // log it and tell the customer that some item availability may change and send back to cart
            } else if (currentDefaultAddress.store_id != newAddress.store_id) {
                    // if store is differnt say NA BITCH
                    AppAnalytics.track('customerCheckoutChangeStoreBlocked');
                    ShiptLogItemsService.logInfo('analytics', 'customerCheckoutChangeStoreBlocked');
                    UIUtil.showAlert('This address is not in your selected store\'s service area.', "To change where you are shopping please change your location on the home screen of the app.");
                    deferred.reject();
                }
            return deferred.promise;
        };

        viewModel.selectAddress = function () {
            selectAddressModal.showModal($scope, viewModel.newOrder.available_customer_addresses, viewModel.checkout.selectedAddress, viewModel.addAddress).then(function (selectedAddress) {
                if (selectedAddress) {
                    AppAnalytics.track('checkoutNewAddressSelected');
                    addressIsChoosableBasedOnCurrentStoreAndStuff(selectedAddress).then(function () {
                        viewModel.checkout.selectedAddress = selectedAddress;
                    }, function () {});
                }
            }, function () {});
            AppAnalytics.track('checkoutSelectAddressClicked');
        };

        viewModel.cardChanged = function () {
            if (!viewModel.checkout.selectedCard) {
                resetCard = true;
                viewModel.addCard();
            }
            AppAnalytics.track('checkoutCardChanged');
        };

        viewModel.getOrderMessage = function () {
            return UserOrderService.getCheckoutScreenMessageForOrder(viewModel.newOrder);
        };

        function showOrderDetailAfterPurchaseComplete(createdOrder) {
            ordersModalProvider.orderHistoryModal(null, createdOrder);
            if (!webVersion) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
            }
            // Go back to home
            $state.go('app.home');
        }

        function selectFirstItemsForOrder() {
            if (viewModel.newOrder) {
                viewModel.checkout.selectedCard = viewModel.newOrder.available_credit_cards[0];
                viewModel.checkout.selectedAddress = viewModel.newOrder.available_customer_addresses.find(function (a) {
                    return a.id == viewModel.customer.default_shopping_address_id;
                });
                if (!viewModel.checkout.selectedAddress) {
                    viewModel.checkout.selectedAddress = viewModel.newOrder.available_customer_addresses[0];
                }
            }
        }

        function loadData() {
            try {
                $log.info('loadData() Start');
                viewModel.customer = AccountService.getCustomerInfo(true);
                UIUtil.showLoading();
                viewModel.cart = ShoppingService.getCartItems();
                $log.info('cart items passed to checkout:', viewModel.cart);
                viewModel.subtotal = ShoppingService.getCartTotal();
                addOrderLinesToOrderObject();
                order.alcohol_terms_accepted = $rootScope.alcohol_terms_accepted;
                UserOrderService.getNewOrderForCustomer(order).then(function (data) {
                    viewModel.newOrder = data;
                    $log.info('new order', data);
                    selectFirstItemsForOrder();
                    UIUtil.hideLoading();
                }, function (error, status) {
                    if (isSubscriptionError(error)) {
                        //continue to checkout screen
                        viewModel.subscriptionErrorDontAllowCheckout = true;
                        viewModel.subscriptionErrorMessage = '';
                        viewModel.newOrder = error;
                        selectFirstItemsForOrder();
                        if (error.errors.subscription) {
                            for (var i = 0; i < error.errors.subscription.length; i++) {
                                viewModel.subscriptionErrorMessage += ' \n';
                                viewModel.subscriptionErrorMessage += error.errors.subscription[i];
                            }
                        }
                        UIUtil.hideLoading();
                    }
                    if (isLaunchError(error)) {
                        viewModel.launchErrorDontAllowCheckout = true;
                        viewModel.launchErrorMessage = '';
                        viewModel.newOrder = error;
                        selectFirstItemsForOrder();
                        if (error.errors.launch) {
                            for (var i = 0; i < error.errors.launch.length; i++) {
                                viewModel.launchErrorMessage += ' \n';
                                viewModel.launchErrorMessage += error.errors.launch[i];
                            }
                        }
                        UIUtil.hideLoading();
                    }
                    if (!isSubscriptionError(error) && !isLaunchError(error)) {
                        var logError = {
                            message: 'loadData create new order error',
                            error: error,
                            cart: viewModel.cart,
                            status: status
                        };
                        LogService.error(logError);
                        UIUtil.hideLoading();
                        $log.error('error', error);
                        ErrorHandler.displayShiptAPIError(error);
                        window.history.back();
                    }
                });

                $log.info('loadData() END');
            } catch (e) {
                $log.error('error', e);
            }
        }

        function isLaunchError(error) {
            if (error && error.errors && error.errors.launch) {
                return true;
            }
            return false;
        }
        function isSubscriptionError(error) {
            if (error && error.errors && error.errors.subscription) {
                return true;
            }
            return false;
        }

        function callGetNewOrderForNewAddressSelected() {
            UIUtil.showLoading();
            buildUpOrderObject();
            UserOrderService.getNewOrderForCustomer(order).then(function (data) {
                viewModel.checkout.deliveryWindow = null;
                viewModel.newOrder.total_with_tax = data.total_with_tax;
                viewModel.newOrder.requested_tax = data.requested_tax;
                viewModel.newOrder.delivery_fee = data.delivery_fee;
                viewModel.newOrder.total_with_tax = data.total_with_tax;
                viewModel.newOrder.available_time_slots = data.available_time_slots;
                viewModel.newOrder.time_slots = data.time_slots;
                $log.info('callGetNewOrder new order', data);
                UIUtil.hideLoading();
            }, function (error) {
                if (isSubscriptionError(error)) {
                    //continue to checkout screen
                    viewModel.subscriptionErrorDontAllowCheckout = true;
                    viewModel.subscriptionErrorMessage = '';
                    if (error.errors.subscription) {
                        for (var i = 0; i < error.errors.subscription.length; i++) {
                            viewModel.subscriptionErrorMessage += ' \n';
                            viewModel.subscriptionErrorMessage += error.errors.subscription[i];
                        }
                    }

                    viewModel.checkout.deliveryWindow = null;
                    viewModel.newOrder.total_with_tax = error.total_with_tax;
                    viewModel.newOrder.requested_tax = error.requested_tax;
                    viewModel.newOrder.delivery_fee = error.delivery_fee;
                    viewModel.newOrder.total_with_tax = error.total_with_tax;
                    viewModel.newOrder.available_time_slots = error.available_time_slots;
                    viewModel.newOrder.time_slots = error.time_slots;
                    $log.info('callGetNewOrder new order', error);
                    UIUtil.hideLoading();
                }
                if (isLaunchError(error)) {
                    viewModel.launchErrorDontAllowCheckout = true;
                    viewModel.launchErrorMessage = '';
                    selectFirstItemsForOrder();
                    if (error.errors.launch) {
                        for (var i = 0; i < error.errors.launch.length; i++) {
                            viewModel.launchErrorMessage += ' \n';
                            viewModel.launchErrorMessage += error.errors.launch[i];
                        }
                    }
                    viewModel.checkout.deliveryWindow = null;
                    viewModel.newOrder.total_with_tax = error.total_with_tax;
                    viewModel.newOrder.requested_tax = error.requested_tax;
                    viewModel.newOrder.delivery_fee = error.delivery_fee;
                    viewModel.newOrder.total_with_tax = error.total_with_tax;
                    viewModel.newOrder.available_time_slots = error.available_time_slots;
                    viewModel.newOrder.time_slots = error.time_slots;
                    $log.info('callGetNewOrder new order', error);
                    UIUtil.hideLoading();
                }
                if (!isSubscriptionError(error) && !isLaunchError(error)) {
                    var logError = {
                        message: 'callGetNewOrderForNewAddressSelected create new order error',
                        error: error,
                        cart: viewModel.cart
                    };
                    LogService.error(logError);
                    UIUtil.hideLoading();
                    $log.error('error', error);
                    ErrorHandler.displayShiptAPIError(error);
                    window.history.back();
                }
            });
        }

        viewModel.clickAddressToSelectIt = function (address) {
            addressIsChoosableBasedOnCurrentStoreAndStuff(address).then(function () {
                viewModel.checkout.selectedAddress = address;
            }, function () {
                //dont select it.
            });
        };

        $scope.$watch('viewModel.checkout.selectedAddress', function (newValue, oldValue) {
            if (newValue) {
                callGetNewOrderForNewAddressSelected();
            }
        });

        viewModel.addCard = function () {
            if (webVersion) {
                createPaymentMethodModal.showModal($scope).then(function (newCard) {
                    loadData();
                }, function (error) {
                    //canceled the payment modal
                });
            } else {
                    $state.go('app.addEditCard', { card: angular.toJson(null) });
                }
            AppAnalytics.track('checkouAddCardClicked');
        };

        viewModel.addAddress = function () {
            $state.go('app.addEditAddressMap', { address: angular.toJson(null), fromCheckout: true });
            AppAnalytics.track('checkouAddAddressClicked');
        };

        $rootScope.$on('refresh.user-data', function () {
            needsRefresh = true;
        });

        $scope.$on('$ionicView.beforeEnter', function () {
            if (needsRefresh) {
                needsRefresh = false;
                loadData();
            }
            //only going to reset the address or card if it needs to be changed back from the "add" option.
            if (viewModel.newOrder) {
                if (resetAddress) {
                    viewModel.checkout.selectedAddress = viewModel.newOrder.available_customer_addresses[0];
                    resetAddress = false;
                }
                if (resetCard) {
                    viewModel.checkout.selectedCard = viewModel.newOrder.available_credit_cards[0];
                    resetCard = false;
                }
            }
        });

        AppAnalytics.beginCheckout();

        var previousNotesPopover = null;

        function getOldOrderNotess() {
            var orders = AccountService.getOrders();
            var notes = _.uniq(_.map(orders, function (order) {
                if (order.notes) return order.notes;
            }));
            return notes;
        }

        viewModel.viewPreviousNotes = function ($event) {
            $ionicPopover.fromTemplateUrl('templates/previousNotesPopover.html', {
                scope: $scope
            }).then(function (popover) {
                $scope.oldOrderNotess = getOldOrderNotess();
                previousNotesPopover = popover;
                previousNotesPopover.show($event).then(function () {
                    $('.old-notes-item')[0].focus(); //accessibility
                });
            });
            AppAnalytics.track('checkoutChoosePreviousDeliveryNoteClicked');
        };

        $scope.clickOldOrderNotes = function (notes) {
            if (viewModel.notes && viewModel.notes != '') {
                viewModel.notes += '\n\n' + notes;
            } else {
                viewModel.notes = notes;
            }
            previousNotesPopover.hide();
            AppAnalytics.track('checkoutPreviousDeliveryNoteChoosen');
        };

        $log.info('CheckoutController End');
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('CustomProductController', ['$scope', '$rootScope', 'ShoppingCartService', 'AppAnalytics', CustomProductController]);

    function CustomProductController($scope, $rootScope, ShoppingCartService, AppAnalytics) {
        var viewModel = this;

        viewModel.cancelAddCustomProduct = function () {
            loadViewModelData();
            $rootScope.$broadcast('close.addCustomProduct');
        };

        viewModel.saveCustomProduct = function () {
            ShoppingCartService.addProductToCart(viewModel.customProduct);
            AppAnalytics.createSpecialRequest(viewModel.customProduct);
            loadViewModelData();
            $rootScope.$broadcast('close.addCustomProduct');
        };

        viewModel.subtractFromCustomItemCount = function () {
            if (viewModel.customProduct.qty != 1) {
                viewModel.customProduct.qty = viewModel.customProduct.qty - 1;
            }
        };

        viewModel.addToCustomItemCount = function () {
            viewModel.customProduct.qty = viewModel.customProduct.qty + 1;
        };

        function loadViewModelData() {
            viewModel.customProduct = {
                isCustom: true,
                price: 0,
                qty: 1
            };

            viewModel.title = "Special Request";
        }

        loadViewModelData();
    };
})();

/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('mealKitsController', ['$scope', '$ionicModal', '$state', '$stateParams', 'ShoppingService', '$log', 'UIUtil', '$timeout', '$cordovaKeyboard', 'LogService', '$ionicSlideBoxDelegate', 'AccountService', 'MealKits', '$filter', mealKitsController]);

    function mealKitsController($scope, $ionicModal, $state, $stateParams, ShoppingService, $log, UIUtil, $timeout, $cordovaKeyboard, LogService, $ionicSlideBoxDelegate, AccountService, MealKits, $filter) {

        var vm = this;

        vm.goToCart = function () {
            $state.go('app.shoppingCart');
        };

        vm.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        vm.cartCount = function () {
            return ShoppingService.getCartItemCount();
        };

        vm.loadData = function () {
            var mealKit = angular.fromJson($stateParams.mealKit);
            vm.mealKit = mealKit;
        };

        vm.mealKitClick = function (mealKit) {
            $state.go('app.mealKitDetail', { mealKit: angular.toJson(mealKit) });
        };

        vm.doRefresh = function () {
            vm.loadData();
        };

        vm.loadData = function () {
            MealKits.getMealKits().then(function (mealKits) {
                $log.info('mealKits', mealKits);
                vm.mealKits = mealKits;
            }, function (error) {
                $log.error(error);
            });
        };

        vm.loadData();
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('ProductDetailProvider', ['$rootScope', '$filter', '$ionicModal', '$q', 'ShoppingService', '$ionicSlideBoxDelegate', 'LogService', ProductDetailProvider]);

    function ProductDetailProvider($rootScope, $filter, $ionicModal, $q, ShoppingService, $ionicSlideBoxDelegate, LogService) {

        var productDetailModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            $ionicModal.fromTemplateUrl('app/groceries/shop/productDetail/productDetailModal.html', {
                scope: $scope,
                focusFirstInput: true
            }).then(function (modal) {
                productDetailModal = modal;
                defer.resolve(productDetailModal);
            });

            return defer.promise;
        }

        var init = function init($scope, product) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();

            $scope.productDetailProduct = product;

            getModal($scope).then(function (modal) {
                modal.show().then(function () {
                    $("button[aria-label='add to favorites icon in top left']").first().focus();
                });
            });

            $scope.closeProductDetail = function () {
                defer.resolve();
                productDetailModal.hide();
                productDetailModal.remove();
                productDetailModal = null;
                $scope.productDetailProduct = null;
            };

            $scope.$on('$destroy', function () {
                if (productDetailModal) productDetailModal.remove();
            });

            //this all needs to be factored into a controller for the modal.
            //it'll do here for now.
            //that will take a few hours to re write for all that shtuff
            var imageModal = null;
            $scope.imageModalImageUrl = '';
            var cartItems = function cartItems() {
                return ShoppingService.getCartItems();
            };

            $scope.cartItemCountForProduct = function (product, includeZero) {
                if (product) {
                    var index = cartItems().map(function (el) {
                        return el.product.id;
                    }).indexOf(product.id);
                    if (index > -1) {
                        if (product.product_type != "by weight") {
                            return parseInt(cartItems()[index].qty);
                        } else if (product.has_custom_label) {
                            return $filter('number')(parseFloat(cartItems()[index].qty * 100 / (product.unit_weight * 100)), 0);
                        } else {
                            return parseFloat(cartItems()[index].qty);
                        }
                    } else if (includeZero) {
                        return 0;
                    }
                }
            };

            $scope.removeItemFromCart = function (product) {
                ShoppingService.removeOneProductFromCart(product);
                cartItems();
            };

            $scope.productInCart = function (product) {
                if (!product) {
                    return false;
                }
                var index = cartItems().map(function (el) {
                    return el.product.id;
                }).indexOf(product.id);
                return index > -1;
            };

            $scope.addItem = function (product) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                cartItems();
            };

            $scope.addNoteForProduct = function (product) {
                if (product) {
                    var index = cartItems().map(function (el) {
                        return el.product.id;
                    }).indexOf(product.id);

                    if (index > -1) {
                        $scope.notePopoverItem = cartItems()[index];
                        $scope.noteModal.show();
                        $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
                    }
                }
            };

            $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
                scope: $scope,
                focusFirstInput: true,
                animation: 'scale-in'
            }).then(function (modal) {
                $scope.noteModal = modal;
            });

            $scope.$on('close.productNotes', function (event, data) {
                $scope.notePopoverItem.note = data;
                ShoppingService.updateNoteOnItem($scope.notePopoverItem);
                $scope.notePopoverItem = null;
                $scope.noteModal.hide();
                cartItems();
            });

            $scope.$on('cancel.productNotes', function () {
                $scope.notePopoverItem = null;
                $scope.noteModal.hide();
            });

            $scope.openImageModal = function (product) {
                $ionicModal.fromTemplateUrl('image-modal.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    imageModal = modal;
                    var url = '';
                    try {
                        if (product.images.length > 0 && product.images[0].original_size_url) {
                            url = product.images[0].original_size_url;
                        }
                    } catch (exception) {
                        LogService.error(exception);
                    }
                    $scope.imageModalImageUrl = url;
                    $ionicSlideBoxDelegate.slide(0);
                    imageModal.show();
                });
            };

            $scope.closeImageModal = function () {
                imageModal.hide();
            };

            $scope.imageSlideChanged = function () {
                imageModal.hide();
            };

            return defer.promise;
        };

        return {
            showModal: init
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('productDetailController', ['$scope', '$rootScope', 'ShoppingService', 'ShoppingCartService', '$ionicModal', '$log', '$state', '$filter', 'AccountService', 'ProductDetailProvider', 'UIUtil', '$timeout', productDetailController]);

    function productDetailController($scope, $rootScope, ShoppingService, ShoppingCartService, $ionicModal, $log, $state, $filter, AccountService, ProductDetailProvider, UIUtil, $timeout) {
        var viewModel = this;

        viewModel.inCartText = function (product, count) {
            if (count > 1) {
                return product.description_label[product.description_label.length - 1];
            } else {
                return product.description_label[0];
            }
        };

        viewModel.clickCategory = function (category) {
            $scope.closeProductDetail();
            $timeout(function () {
                $state.go('app.products', { category: angular.toJson(category) });
            }, 100);
        };

        viewModel.getDateString = function (date) {
            if (!date) return '';
            return moment(date).format("MMM Do");
        };

        viewModel.isOnSaleWithDates = function (product) {
            if (product && product.on_sale) {
                if (product.sale_starts_on && product.sale_ends_on) {
                    return true;
                }
                return false;
            }
            return false;
        };

        viewModel.getDetailModalPrice = function (product) {
            try {
                if (product.product_type == 'by weight') {
                    if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                        var unit_of_measure = "lb";
                    } else {
                        var unit_of_measure = product.unit_of_measure;
                    }

                    return $filter('currency')(product.price) + ' per ' + unit_of_measure;
                } else {
                    return $filter('currency')(product.price);
                }
            } catch (e) {
                return null;
            }
        };

        viewModel.getSalePrice = function (product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                var unit_of_measure = "lb";
            } else {
                var unit_of_measure = product.unit_of_measure;
            }

            if (product.product_type == 'by weight') {
                return $filter('currency')(product.sale_price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.sale_price);
            }
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('productSearchController', ['$scope', '$log', '$filter', 'UIUtil', '$state', 'ShoppingService', 'LogService', '$rootScope', 'PromoFeaturesService', '$ionicModal', 'ProductService', '$ionicScrollDelegate', '$timeout', '$ionicSlideBoxDelegate', '$cordovaKeyboard', 'AppAnalytics', 'shopCategoriesProvider', 'chooseStoreModal', 'AccountService', 'filterSortModal', 'filterSortOptions', 'FILTER_SORT', 'FeatureService', 'COMMON_FEATURE_TOGGLES', productSearchController]);

    function productSearchController($scope, $log, $filter, UIUtil, $state, ShoppingService, LogService, $rootScope, PromoFeaturesService, $ionicModal, ProductService, $ionicScrollDelegate, $timeout, $ionicSlideBoxDelegate, $cordovaKeyboard, AppAnalytics, shopCategoriesProvider, chooseStoreModal, AccountService, filterSortModal, filterSortOptions, FILTER_SORT, FeatureService, COMMON_FEATURE_TOGGLES) {

        var viewModel = this;

        $scope.isAlgoliaSearchEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_SEARCH_ENABLED);
        $scope.isFilterSortEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_FILTER_SORT_ENABLED);
        $scope.isIosPlatform = ionic.Platform.isIOS();
        $scope.showFilterBar = false;
        $scope.search = { searchQuery: null };

        /**
         * Ensure that pagination is reset each time a new filter is applied.
         */
        $scope.$on(FILTER_SORT.EVENTS.APPLY_FILTER, function (event, filterSortResults) {
            $scope.showFilterBar = true;
            current_page = null;
            total_pages = null;
            searchForProducts(filterSortResults.searchTerm, filterSortResults);
        });

        /**
         * Re-initialize the model when a search is cleared.
         */
        $scope.$on(FILTER_SORT.EVENTS.CLEAR_FILTER, function (event) {
            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            $scope.showFilterBar = false;
            current_page = null;
            total_pages = null;
            try {
                // Re-initialize the facet filters after they are cleared
                $scope.filterSortOptions = filterSortOptions.init(originalSearchFacets.categories_name, originalSearchFacets.brand_name);
            } catch (e) {
                // If the facet filters cannot be reinitialized, close the modal and init a blank filter model
                filterSortModal.closeModal();
                $scope.filterSortOptions = filterSortOptions.init();
            }

            if (options.refreshSearch) {
                // In the case that a search should be refreshed after clearing the filters
                $scope.searchResults = [];
                searchForProducts(options.searchTerm, null);
            }
        });

        var defaultShoppingAddress = null;
        var mq = window.matchMedia('all and (max-width: 700px)');
        if (mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }
        var current_page = 0;
        var total_pages = null;
        var lastSearchText = "";

        var currentFacets = null;
        var originalSearchFacets = null;
        $scope.filterSortOptions = filterSortOptions.init();

        $scope.search = { searchQuery: null };
        $scope.searchResults = [];
        $scope.searching = false;
        var searchFocused = false;
        $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
            scope: $scope,
            focusFirstInput: true,
            animation: 'scale-in'
        }).then(function (modal) {
            $scope.noteModal = modal;
        });

        var searchButtonIonItem = {
            addButton: true
        };

        var loadingMoreButton = {
            loadingMore: true
        };

        $scope.getItemWidth = function () {
            return $scope.itemWidth;
        };

        $scope.searchSubmit = function (value) {
            var val = $scope.search.searchQuery;
            if (!val || val == "" || val == 'undefined') {
                $scope.searching = false;
                lastSearchText = "";
            } else {
                $scope.searching = true;
                $scope.filterText = val;
                searchForProducts($scope.filterText, $scope.filterSortOptions);
                $ionicScrollDelegate.$getByHandle('homeScroll').resize();
            }
        };

        $scope.$on('$ionicView.afterEnter', function () {
            $('input.productSearchBox').focus();
            $cordovaKeyboard.open();
        });

        $scope.$watch('search.searchQuery', function (val) {
            var val = $scope.search.searchQuery;
            if (!val || val == "" || val == 'undefined') {
                $scope.searching = false;
                lastSearchText = "";
                $scope.showFilterBar = false;
                $scope.$broadcast(FILTER_SORT.EVENTS.RESET);
            }
        });

        function addMoreLoadingThing() {
            $scope.searchResults.push(loadingMoreButton);
        }

        function removeLoadingThing() {
            var index = $scope.searchResults.map(function (el) {
                return el.loadingMore;
            }).indexOf(loadingMoreButton.loadingMore);
            if (index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function loadStoreAddressData() {
            try {
                viewModel.store = AccountService.getCustomerStore();
                defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
                viewModel.chooseStoreEnabled = AccountService.checkFeature("chooseStoreInApp");
            } catch (e) {
                viewModel.store = null;
            }
        }

        viewModel.filterSortClick = function () {
            if (currentFacets && !$scope.filterSortOptions.isFilterSortActive()) {
                $scope.filterSortOptions = filterSortOptions.init(currentFacets.categories_name, currentFacets.brand_name);
            }
            filterSortModal.show($scope);
            AppAnalytics.filterSort();
        };

        viewModel.searchButtonText = function () {
            if (viewModel.store && defaultShoppingAddress) {
                return "Search " + viewModel.store.name + ", " + defaultShoppingAddress.zip_code;
            } else {
                return "Search All Products";
            }
        };

        function removeAddSpecialButton() {
            var index = $scope.searchResults.map(function (el) {
                return el.addButton;
            }).indexOf(searchButtonIonItem.addButton);
            if (index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function searchForProducts(text, filterSortOptions) {
            if (!text || text == "") return;
            if (text != lastSearchText) {
                //reset search params if the search is different
                AppAnalytics.productSearch(text);
                $scope.searchResults = [];
                current_page = null;
                lastSearchText = text;
            } else if (total_pages != null && total_pages <= current_page) {
                //this will catch searches that were not supposed to happen
                removeLoadingThing();
                return false;
            }
            if (useFilterSortSearchApi(filterSortOptions)) {
                ProductService.searchForFilterSortGroceryProducts(text, current_page, filterSortOptions.facetFilters, filterSortOptions.indexName).then(function (results) {
                    processSearchResults(results);
                }, onSearchError);
            } else {
                ProductService.searchForGroceryProducts(text, current_page).then(function (results) {
                    if ($scope.isAlgoliaSearchEnabled) {
                        // Only map facets when using algolia results
                        originalSearchFacets = mapFacets(results.facets);
                    }
                    processSearchResults(results);
                }, onSearchError);
            }
        }

        viewModel.inCartText = function (product) {
            if ($scope.cartItemCountForProduct(product) > 1) {
                return product.description_label[product.description_label.length - 1];
            } else {
                return product.description_label[0];
            }
        };

        viewModel.getPrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                    var unit_of_measure = "lb";
                } else {
                    var unit_of_measure = product.unit_of_measure;
                }

                return $filter('currency')(product.price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.price);
            }
        };

        viewModel.getSalePrice = function (product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                var unit_of_measure = "lb";
            } else {
                var unit_of_measure = product.unit_of_measure;
            }

            if (product.product_type == 'by weight') {
                return $filter('currency')(product.sale_price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.sale_price);
            }
        };

        $scope.cancelSearch = function () {
            $state.go('app.home');
        };

        $scope.clearSearch = function () {
            $scope.searching = false;
            $scope.search.searchQuery = null;
            $scope.searchResults = [];
            $ionicScrollDelegate.$getByHandle('homeScroll').scrollTop(true);
            $ionicScrollDelegate.$getByHandle('homeScroll').resize();
        };

        angular.element('#clearSearchTextHome').on('touchstart', function () {
            $timeout(function () {
                $scope.search.searchQuery = '';
            }, 1);
        });

        angular.element('#searchIonContent').on('touchstart', function () {
            $timeout(function () {
                $log.info('#searchIonContent timeout');
                if (window.cordova) {
                    $log.info('#searchIonContent window.cordova');
                    if ($cordovaKeyboard.isVisible()) {
                        $log.info('#searchIonContent cordovaKeyboard.close');
                        $cordovaKeyboard.close();
                    }
                }
            }, 1);
        });

        $scope.searchFocus = function () {
            $ionicScrollDelegate.$getByHandle('homeScroll').scrollTop(true);
            searchFocused = true;
            $scope.showCancelSearch = true;
        };

        $scope.searchUnFocus = function () {
            searchFocused = false;
            if ($scope.searching) {
                $scope.showCancelSearch = true;
            } else {
                $scope.showCancelSearch = false;
            }
            if (window.cordova && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
        };

        $scope.addItem = function (product, fromDetail) {
            if (canClickInList()) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                AppAnalytics.addProductToCart(product, 'search', fromDetail);
            }
        };

        $scope.removeItemFromCart = function (product) {
            if (canClickInList()) {
                ShoppingService.removeOneProductFromCart(product);
            }
        };

        $scope.cartItemCountForProduct = function (product, includeZero) {
            if (product) {
                var found = $scope.cartItems().find(function (x) {
                    return x.product.id == product.id;
                });
                if (found) {
                    if (product.product_type != "by weight") {
                        return parseInt(found.qty);
                    } else if (product.has_custom_label) {
                        return $filter('number')(parseFloat(found.qty * 100) / (product.unit_weight * 100), 0);
                    } else {
                        return parseFloat(found.qty);
                    }
                } else if (includeZero) {
                    return 0;
                }
            }
        };

        $scope.removeCartItemForProductFromCartCompletely = function (product) {
            if (canClickInList()) {
                ShoppingService.removeProductsCartItemFromCart(product);
            }
        };

        $scope.productInCart = function (product) {
            if (!product) {
                return false;
            }
            var index = $scope.cartItems().map(function (el) {
                return el.product.id;
            }).indexOf(product.id);
            return index > -1;
        };

        $ionicModal.fromTemplateUrl('app/groceries/shop/productDetail/productDetailModal.html', { scope: $scope }).then(function (modal) {
            $scope.productDetailModal = modal;
        });

        $scope.productDetail = function (product) {
            if (canClickInList()) {
                if (product.addButton) {
                    $scope.addCustomProduct();
                    return;
                }
                $scope.productDetailProduct = product;
                $scope.productDetailModal.show();
                AppAnalytics.viewProduct(product, 'search');
            }
        };

        $scope.closeProductDetail = function () {
            $scope.productDetailModal.hide();
            $scope.productDetailProduct = null;
        };

        $scope.getItemClass = function (product) {
            if (!product) return '';
            if (product.addButton) {
                return 'item-stable item-no-border';
            } else if (product.loadingMore) {
                return 'item-loading-more';
            }
        };

        $scope.addCustomProduct = function () {
            $ionicModal.fromTemplateUrl('app/groceries/shop/customProduct/addCustomProductModal.html', {
                scope: $scope,
                focusFirstInput: true
            }).then(function (modal) {
                $scope.addCustomProductModal = modal;
                $scope.addCustomProductModal.show();
            });
        };

        $scope.$on('close.addCustomProduct', function () {
            $scope.addCustomProductModal.hide();
        });

        $scope.cartItems = function () {
            return ShoppingService.getCartItems();
        };

        $scope.cartCount = function () {
            return ShoppingService.getCartItemCount();
        };

        $scope.addNoteForProduct = function (product) {
            if (product) {
                var index = $scope.cartItems().map(function (el) {
                    return el.product.id;
                }).indexOf(product.id);

                if (index > -1) {
                    $scope.notePopoverItem = $scope.cartItems()[index];
                    $scope.noteModal.show();
                    $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
                }
            }
        };

        $scope.$on('close.productNotes', function (event, data) {
            $scope.notePopoverItem.note = data;
            ShoppingService.updateNoteOnItem($scope.notePopoverItem);
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.$on('cancel.productNotes', function () {
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.moreDataCanBeLoadedSearch = function () {
            if (!$scope.searching || total_pages == 0) {
                return false;
            }
            if (total_pages) {
                if ($scope.searchResults.length > 1) {
                    if (total_pages > current_page) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        };

        $scope.loadMoreSearchItems = function () {
            $scope.filterSortOptions.facetFilters = $scope.filterSortOptions.getFacetFiltersForSearch() || null;
            searchForProducts($scope.search.searchQuery, $scope.filterSortOptions);
        };

        $scope.moreDataCanBeLoaded = function () {
            if ($scope.dataLoaded) {
                return false;
            } else {
                return true;
            }
        };

        var imageModal = null;
        $scope.imageModalImageUrl = '';
        $scope.openImageModal = function (product) {
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                imageModal = modal;
                var url = '';
                try {
                    if (product.images.length > 0 && product.images[0].original_size_url) {
                        url = product.images[0].original_size_url;
                    }
                } catch (exception) {
                    LogService.error(exception);
                }
                $scope.imageModalImageUrl = url;
                $ionicSlideBoxDelegate.slide(0);
                imageModal.show();
            });
        };

        $scope.closeImageModal = function () {
            imageModal.hide();
        };

        $scope.imageSlideChanged = function () {
            imageModal.hide();
        };

        function canClickInList() {
            return true;
        }

        function useFilterSortSearchApi(filterSortOptions) {
            filterSortOptions = filterSortOptions || {};
            return filterSortOptions.facetFilters && filterSortOptions.facetFilters.length > 0 || filterSortOptions.indexName;
        }

        function processSearchResults(results) {
            current_page = results.current_page++;
            total_pages = results.total_pages;

            if ($scope.isAlgoliaSearchEnabled) {
                // Handle processing of algolia search results
                $scope.nbHits = results.nbHits;
                currentFacets = mapFacets(results.facets);
                $scope.showFilterBar = results.nbHits > 1;
                $scope.searchResults = results.current_page === 1 ? [] : $scope.searchResults;
                $scope.filterSortOptions.setCurrentFacets(currentFacets.categories_name, currentFacets.brand_name);
            }

            if ($scope.searchResults && $scope.searchResults.length > 1) {
                //add items to the end of the array
                angular.forEach(results.products, function (item) {
                    $scope.searchResults.push(item);
                });
            } else {
                $scope.searchResults = results.products;
            }
            if (current_page == total_pages || total_pages == 0) {
                removeLoadingThing();
                if (!$scope.searchResults) $scope.searchResults = [];
                $scope.searchResults.push(searchButtonIonItem);
            } else {
                removeAddSpecialButton();
                removeLoadingThing();
                if ($scope.searchResults.length > 0) {
                    $scope.searchResults.push(searchButtonIonItem);
                }

                if (current_page == total_pages) {
                    removeLoadingThing();
                } else {
                    addMoreLoadingThing();
                    removeAddSpecialButton();
                }
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
            $ionicScrollDelegate.$getByHandle('homeScroll').resize();
        }

        function mapFacets() {
            var facets = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            return {
                categories_name: facets[FILTER_SORT.FACETS.CATEGORIES],
                brand_name: facets.brand_name
            };
        }

        function onSearchError(error) {
            LogService.error({
                message: 'Error Searching For Product',
                error: error
            });
        }

        loadStoreAddressData();
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('CategoriesController', ['$scope', '$rootScope', '$ionicModal', '$state', 'ShoppingService', 'ProductService', '$timeout', '$ionicScrollDelegate', '$cordovaKeyboard', '$filter', 'LogService', 'AccountService', '$ionicSlideBoxDelegate', 'UIUtil', 'AppAnalytics', CategoriesController]);

    function CategoriesController($scope, $rootScope, $ionicModal, $state, ShoppingService, ProductService, $timeout, $ionicScrollDelegate, $cordovaKeyboard, $filter, LogService, AccountService, $ionicSlideBoxDelegate, UIUtil, AppAnalytics) {

        var mq = window.matchMedia('all and (max-width: 700px)');
        if (mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }
        $scope.getItemWidth = function () {
            return $scope.itemWidth;
        };

        $scope.showSearch = false;
        var current_page = 0;
        var total_pages = null;
        var lastSearchText = "";
        $scope.saleCategory = null;
        $scope.search = { searchQuery: null };
        $scope.searchResults = [];
        $scope.searching = false;
        $scope.filterText = '';
        $scope.addCustomProductModal = null;
        var searchFocused = false;
        $scope.showCancelSearch = false;
        //$scope.recentProducts = [];
        $scope.showRecentProducts = false;
        var lastScrolling = Date.now();
        $scope.dataLoaded = false;
        $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
            scope: $scope,
            focusFirstInput: true,
            animation: 'scale-in'
        }).then(function (modal) {
            $scope.noteModal = modal;
        });

        var searchButtonIonItem = {
            addButton: true
        };

        var loadingMoreButton = {
            loadingMore: true
        };

        function showRecentPurchasedButton() {
            try {
                var orders = AccountService.getOrders();
                if (orders && orders != null && orders.length > 0) {
                    $scope.showRecentProducts = true;
                }
            } catch (exception) {
                LogService.error(exception);
            }
        }

        $scope.inCartText = function (product) {
            if ($scope.cartItemCountForProduct(product) > 1) {
                return product.description_label[product.description_label.length - 1];
            } else {
                return product.description_label[0];
            }
        };

        $scope.showRecentPurchased = function () {
            $state.go('app.recentProducts');
        };

        $scope.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        $scope.$on('$ionicView.beforeEnter', function () {
            loadNextAvailableDelivery();
        });

        $scope.goToSearchPage = function (e) {
            $state.go('app.searchProducts');
        };

        $scope.categoryClick = function (parentCat) {
            try {
                if (parentCat.category_count < 1) {
                    $state.go('app.products', { category: angular.toJson(parentCat) });
                } else {
                    $state.go('app.subcategories', { parentCat: angular.toJson(parentCat) });
                }
            } catch (e) {
                LogService.error(e);
                $state.go('app.subcategories', { parentCat: angular.toJson(parentCat) });
            }
        };

        $scope.doRefresh = function () {
            if ($scope.searching) {
                $scope.$broadcast('scroll.refreshComplete');
                return;
            }
            showRecentPurchasedButton();
            loadCategoriesFromServer();
            loadNextAvailableDelivery();
        };

        function loadSubCategories(category) {
            return ShoppingService.getSubCategories(category, true);
        }

        $scope.showProducts = function (subCat) {
            $state.go('app.products', { category: angular.toJson(subCat) });
        };

        function loadCategoriesFromServer() {
            ShoppingService.getCategories(true).then(function (data) {
                $scope.categories = data;
                $scope.dataLoaded = true;
                showRecentPurchasedButton();
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (error) {
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        }

        $scope.searchSubmit = function (value) {
            var val = $scope.search.searchQuery;
            if (!val || val == "" || val == 'undefined') {
                $scope.searching = false;
                lastSearchText = "";
            } else {
                $scope.searching = true;
                $scope.filterText = val;
                searchForProducts($scope.filterText);
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            }
        };

        $scope.$watch('search.searchQuery', function (val) {
            var val = $scope.search.searchQuery;
            if (!val || val == "" || val == 'undefined') {
                $scope.searching = false;
                lastSearchText = "";
            }
        });

        function addMoreLoadingThing() {
            $scope.searchResults.push(loadingMoreButton);
        }

        function removeLoadingThing() {
            var index = $scope.searchResults.map(function (el) {
                return el.loadingMore;
            }).indexOf(loadingMoreButton.loadingMore);
            if (index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function removeAddSpecialButton() {
            var index = $scope.searchResults.map(function (el) {
                return el.addButton;
            }).indexOf(searchButtonIonItem.addButton);
            if (index > -1) {
                $scope.searchResults.splice(index, 1);
            }
        }

        function searchForProducts(text) {
            if (!text || text == "") return;
            if (text != lastSearchText) {
                //reset search params if the search is different
                AppAnalytics.productSearch(text);
                $scope.searchResults = [];
                current_page = null;
                lastSearchText = text;
            } else if (total_pages != null && total_pages <= current_page) {
                //this will catch searches that were not supposed to happen
                return false;
            }
            var searchPromise = ProductService.searchForGroceryProducts(text, current_page).then(function (results) {
                current_page = results.current_page;
                total_pages = results.total_pages;
                if ($scope.searchResults && $scope.searchResults.length > 1) {
                    //add items to the end of the array
                    angular.forEach(results.products, function (item) {
                        $scope.searchResults.push(item);
                    });
                } else {
                    $scope.searchResults = results.products;
                }
                if (current_page == total_pages || total_pages == 0) {
                    if (!$scope.searchResults) $scope.searchResults = [];
                    $scope.searchResults.push(searchButtonIonItem);
                } else {
                    removeAddSpecialButton();
                    removeLoadingThing();
                    if ($scope.searchResults.length > 0) {
                        $scope.searchResults.push(searchButtonIonItem);
                    }

                    if (current_page == total_pages) {
                        removeLoadingThing();
                    } else {
                        addMoreLoadingThing();
                        removeAddSpecialButton();
                    }
                }
                $scope.$broadcast('scroll.infiniteScrollComplete');
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            }, function (error) {
                LogService.error({
                    message: 'Error Searching For Product',
                    error: error
                });
            });
            if (current_page == 1) {
                $scope.myPromise = searchPromise;
            }
        }

        $scope.cancelSearch = function () {

            $scope.searching = false;
            $scope.search.searchQuery = null;
            $scope.searchResults = [];
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();

            $timeout(function () {
                $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            }, 100);
        };

        angular.element('#clearSearchText').on('touchstart', function () {
            $timeout(function () {
                $scope.search.searchQuery = '';
            }, 1);
        });

        angular.element('#catIonContent').on('touchstart', function () {
            $timeout(function () {
                if (window.cordova) {
                    if ($cordovaKeyboard.isVisible()) {
                        $cordovaKeyboard.close();
                    }
                }
            }, 1);
        });

        $scope.searchFocus = function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            $ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(true);
            $ionicScrollDelegate.$getByHandle('mainScroll').resize();
            searchFocused = true;
            $scope.showCancelSearch = true;
        };

        $scope.searchUnFocus = function () {
            searchFocused = false;
            if ($scope.searching) {
                $scope.showCancelSearch = true;
            } else {
                $scope.showCancelSearch = false;
            }
            if (window.cordova && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
        };

        $scope.addItem = function (product, fromDetail) {
            if (canClickInList()) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                AppAnalytics.addProductToCart(product, 'search', fromDetail);
            }
        };

        $scope.removeItemFromCart = function (product) {
            if (canClickInList()) {
                ShoppingService.removeOneProductFromCart(product);
            }
        };

        $scope.cartItemCountForProduct = function (product, includeZero) {
            if (product) {
                var found = $scope.cartItems().find(function (x) {
                    return x.product.id == product.id;
                });
                if (found) {
                    if (product.product_type != "by weight") {
                        return parseInt(found.qty);
                    } else if (product.has_custom_label) {
                        return parseFloat(found.qty * 100) / (found.product.unit_weight * 100);
                    } else {
                        return parseFloat(found.qty);
                    }
                } else if (includeZero) {
                    return 0;
                }
            }
        };

        $scope.removeCartItemForProductFromCartCompletely = function (product) {
            if (canClickInList()) {
                ShoppingService.removeProductsCartItemFromCart(product);
            }
        };

        $scope.productInCart = function (product) {
            if (!product) {
                return false;
            }
            var index = $scope.cartItems().map(function (el) {
                return el.product.id;
            }).indexOf(product.id);
            return index > -1;
        };

        $ionicModal.fromTemplateUrl('app/groceries/shop/productDetail/productDetailModal.html', { scope: $scope }).then(function (modal) {
            $scope.productDetailModal = modal;
        });

        $scope.productDetail = function (product) {
            if (canClickInList()) {
                if (product.addButton) {
                    $scope.addCustomProduct();
                    return;
                }
                $scope.productDetailProduct = product;
                $scope.productDetailModal.show();
                AppAnalytics.viewProduct(product, 'search');
            }
        };

        $scope.closeProductDetail = function () {
            $scope.productDetailModal.hide();
            $scope.productDetailProduct = null;
        };

        $scope.$on('user.loggedin', function (event, data) {
            $scope.dataLoaded = false;
            $scope.doRefresh();
        });

        $rootScope.$on('refresh.user-data', function (event, data) {
            $scope.dataLoaded = false;
            $scope.doRefresh();
        });

        $scope.$on('user.registered', function (event, data) {
            $scope.dataLoaded = false;
            $scope.doRefresh();
        });

        $scope.getItemClass = function (product) {
            if (!product) return '';
            if (product.addButton) {
                return 'item-stable item-no-border';
            } else if (product.loadingMore) {
                return 'item-loading-more';
            }
        };

        $scope.addCustomProduct = function () {
            $ionicModal.fromTemplateUrl('app/groceries/shop/customProduct/addCustomProductModal.html', {
                scope: $scope,
                focusFirstInput: true
            }).then(function (modal) {
                $scope.addCustomProductModal = modal;
                $scope.addCustomProductModal.show();
            });
        };

        $scope.$on('close.addCustomProduct', function () {
            $scope.addCustomProductModal.hide();
        });

        $scope.cartItems = function () {
            return ShoppingService.getCartItems();
        };

        $scope.addNoteForProduct = function (product) {
            if (product) {
                var index = $scope.cartItems().map(function (el) {
                    return el.product.id;
                }).indexOf(product.id);

                if (index > -1) {
                    $scope.notePopoverItem = $scope.cartItems()[index];
                    $scope.noteModal.show();
                    $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
                }
            }
        };

        $scope.$on('close.productNotes', function (event, data) {
            $scope.notePopoverItem.note = data;
            ShoppingService.updateNoteOnItem($scope.notePopoverItem);
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.$on('cancel.productNotes', function () {
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.scrollList = function () {
            lastScrolling = Date.now();
        };

        function canClickInList() {
            var diff = Date.now() - lastScrolling;
            return true;
            return diff > 300;
        }

        $scope.moreDataCanBeLoadedSearch = function () {
            if (!$scope.searching || total_pages == 0) {
                return false;
            }
            if (total_pages) {
                if ($scope.searchResults.length > 1) {
                    if (total_pages > current_page) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        };

        $scope.loadMoreSearchItems = function () {
            searchForProducts($scope.search.searchQuery);
        };

        $scope.moreDataCanBeLoaded = function () {
            if ($scope.dataLoaded) {
                return false;
            } else {
                return true;
            }
        };

        $scope.loadMoreItems = function () {
            loadCategoriesFromServer();
        };

        $scope.categories = ShoppingService.getCachedCategories();

        $scope.doRefresh();

        var imageModal = null;
        $scope.imageModalImageUrl = '';
        $scope.openImageModal = function (product) {
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                imageModal = modal;
                var url = '';
                try {
                    if (product.images.length > 0 && product.images[0].original_size_url) {
                        url = product.images[0].original_size_url;
                    }
                } catch (exception) {
                    LogService.error(exception);
                }
                $scope.imageModalImageUrl = url;
                $ionicSlideBoxDelegate.slide(0);
                imageModal.show();
            });
        };

        $scope.closeImageModal = function () {
            imageModal.hide();
        };

        $scope.imageSlideChanged = function () {
            imageModal.hide();
        };

        $scope.clickAvailableTimeInfo = function () {
            UIUtil.showInfoAlertMessage('This delivery estimate is subject to change. ' + 'You will be shown available time slots to choose from at checkout.');
        };

        $scope.getPrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                    var unit_of_measure = "lb";
                } else {
                    var unit_of_measure = product.unit_of_measure;
                }

                return $filter('currency')(product.price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.price);
            }
        };

        $scope.getSalePrice = function (product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                var unit_of_measure = "lb";
            } else {
                var unit_of_measure = product.unit_of_measure;
            }

            if (product.product_type == 'by weight') {
                return $filter('currency')(product.sale_price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.sale_price);
            }
        };

        function loadNextAvailableDelivery() {
            AccountService.getNextAvailability().then(function (nextAvailable) {
                $scope.nextAvailability = nextAvailable;
                $scope.nextAvailableErrorHappened = false;
            }, function (error) {
                $scope.nextAvailableErrorHappened = true;
                LogService.critical([error, 'Error loading next availablity.']);
            });
        }
    }
})();

/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('FavoriteItemsController', ['$scope', '$ionicModal', '$state', '$stateParams', 'ShoppingService', '$log', 'UIUtil', '$timeout', '$cordovaKeyboard', 'LogService', '$ionicSlideBoxDelegate', 'AccountService', '$filter', 'AppAnalytics', 'FavoriteItem', FavoriteItemsController]);

    function FavoriteItemsController($scope, $ionicModal, $state, $stateParams, ShoppingService, $log, UIUtil, $timeout, $cordovaKeyboard, LogService, $ionicSlideBoxDelegate, AccountService, $filter, AppAnalytics, FavoriteItem) {

        var mq = window.matchMedia('all and (max-width: 700px)');
        if (mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }
        $scope.getItemWidth = function () {
            return $scope.itemWidth;
        };

        $scope.getItemClass = function (product) {
            if (!product) return '';
            if (product.addButton) {
                return 'item-stable item-no-border';
            } else if (product.loadingMore) {
                return 'item-loading-more';
            }
        };

        $scope.search = {
            text: null
        };
        $scope.addCustomProductModal = null;
        $scope.dataLoaded = false;
        $scope.showingProductHistory = false;

        var current_page = 0;
        var total_pages = null;
        var lastPageRequested = null;

        $scope.searchForProduct = function (item) {
            try {
                if (item.addButton) {
                    return true;
                }
                if (!$scope.search.text) {
                    return true;
                }
                if (item.name.toLowerCase().indexOf($scope.search.text.toLowerCase()) > -1 || item.brand_name.toLowerCase().indexOf($scope.search.text.toLowerCase()) > -1) {
                    return true;
                }
                if ((item.name.toLowerCase() + ' ' + item.brand_name.toLowerCase()).indexOf($scope.search.text.toLowerCase()) > -1) {
                    return true;
                }
                if ((item.brand_name.toLowerCase() + ' ' + item.name.toLowerCase()).indexOf($scope.search.text.toLowerCase()) > -1) {
                    return true;
                }
                return false;
            } catch (e) {
                return true;
                $log.info('error in filter', e);
            }
        };

        $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
            scope: $scope,
            focusFirstInput: true,
            animation: 'scale-in'
        }).then(function (modal) {
            $scope.noteModal = modal;
        });

        var searchButtonIonItem = {
            addButton: true
        };

        var loadingMoreButton = {
            loadingMore: true
        };

        $scope.inCartText = function (product) {
            if (product.product_type == 'by weight') {
                return product.unit_of_measure;
            } else {
                return "in cart";
            }
        };

        $scope.addItem = function (product, fromDetail) {
            if (canClickInList()) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                AppAnalytics.addProductToCart(product, $scope.categoryName, fromDetail);
            }
        };

        angular.element('#clearProductSearchText').on('touchstart', function () {
            $log.debug('touchstart');
            $timeout(function () {
                $scope.search.text = '';
            }, 1);
        });

        $scope.removeItemFromCart = function (product) {
            if (canClickInList()) {
                ShoppingService.removeOneProductFromCart(product);
            }
        };

        $scope.removeCartItemForProductFromCartCompletely = function (product) {
            if (canClickInList()) {
                ShoppingService.removeProductsCartItemFromCart(product);
            }
        };

        $scope.cartItemCountForProduct = function (product, includeZero) {
            if (product) {
                if (product.isCustom) {
                    var index = $scope.cartItems().map(function (el) {
                        return el.product.name;
                    }).indexOf(product.name);
                    if (index > -1) {
                        return $scope.cartItems()[index].qty;
                    } else if (includeZero) {
                        return 0;
                    }
                }

                var index = $scope.cartItems().map(function (el) {
                    return el.product.id;
                }).indexOf(product.id);
                if (index > -1) {
                    if (product.product_type != "by weight") {
                        return parseInt($scope.cartItems()[index].qty);
                    } else if (product.has_custom_label) {
                        return parseFloat($scope.cartItems()[index].qty * 100 / (product.unit_weight * 100));
                    } else {
                        return parseFloat($scope.cartItems()[index].qty);
                    }
                } else if (includeZero) {
                    return 0;
                }
            }
        };

        $scope.clearSearch = function () {
            $scope.search.text = null;
        };

        $scope.$on('$ionicView.beforeEnter', function () {});

        $scope.showNoProductsMessage = function () {
            try {
                if ($scope.dataLoaded && isRecentProducts()) {
                    return $scope.products.length <= 1;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        };

        $scope.isRecentProducts = isRecentProducts;
        var isRecentProducts = function isRecentProducts() {
            return $state.includes('app.recentProducts');
        };

        var loadData = function loadData() {
            AppAnalytics.viewCategory($scope.categoryName);
        };

        $scope.clickSubCategory = function (subCat) {
            subCat.parentName = $scope.categoryName;
            if (!$scope.parentCategory) $scope.parentCategory = $scope.subCategory;
            $scope.subCategory = subCat;
            $scope.products = null;
            $scope.search.text = null;
            $scope.addCustomProductModal = null;
            $scope.dataLoaded = false;
            $scope.showingProductHistory = false;

            current_page = 0;
            total_pages = null;
            lastPageRequested = null;

            loadProducts();
        };

        $scope.clickHome = function () {
            $state.go('app.home');
        };

        $scope.parentCategoryClick = function () {
            $ionicHistory.goBack();
        };

        function loadProducts(searching) {
            getProducts(searching);
        }

        function getRecentProducts() {
            ShoppingService.getRecentlyPurchasedProducts(current_page += 1).then(function (data) {
                current_page = data.current_page;
                total_pages = data.total_pages;
                if ($scope.products && $scope.products.length > 1) {
                    angular.forEach(data.products, function (item) {
                        $scope.products.push(item);
                    });
                } else {
                    $scope.products = data.products;
                }
                if (current_page - 1 == total_pages) {
                    removeAddSpecialButton();
                    $scope.products.push(searchButtonIonItem);
                } else {
                    removeAddSpecialButton();
                    removeLoadingThing();
                    if ($scope.products.length > 0) {
                        $scope.products.push(searchButtonIonItem);
                    }

                    if (current_page == total_pages) {
                        removeLoadingThing();
                    } else {
                        addMoreLoadingThing();
                        removeAddSpecialButton();
                    }
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (error) {
                UIUtil.showErrorAlert('Error Loading Recently Purchased Products');
                $scope.$broadcast('scroll.refreshComplete');
                LogService.error({
                    message: 'getRecentlyPurchasedProducts error',
                    error: error
                });
            });
        }

        function preventDuplicateUtilityItemsInList() {
            try {

                var index = $scope.products.map(function (el) {
                    return el.addButton;
                }).indexOf(searchButtonIonItem.addButton);
                if (index > -1) {
                    $scope.products.splice(index, 1);
                }

                var index = $scope.products.map(function (el) {
                    return el.loadingMore;
                }).indexOf(loadingMoreButton.loadingMore);
                if (index > -1) {
                    $scope.products.splice(index, 1);
                }
                var found = $scope.cartItems().find(function (x) {
                    return x.product.id == product.id;
                });
            } catch (e) {}
        }

        function getProducts(searching) {
            if (!$scope.moreDataCanBeLoaded('function getProducts') && getFilteredCount() <= 2) {
                removeLoadingThing();
                return false;
            }

            if (lastPageRequested) {
                if (current_page + 1 == lastPageRequested) {
                    $log.info('skipping page get because it was already requested but just not returned.');
                    return;
                } else {
                    lastPageRequested += 1;
                }
            } else {
                lastPageRequested = 1;
            }

            FavoriteItem.list(current_page += 1, searching).then(function (data) {
                current_page = data.current_page;
                total_pages = data.total_pages;
                if ($scope.products && $scope.products.length > 1) {
                    angular.forEach(data.products, function (item) {
                        $scope.products.push(item);
                    });
                } else {
                    $scope.products = data.products;
                }
                if (current_page > total_pages) {
                    removeAddSpecialButton();
                    $scope.products.push(searchButtonIonItem);
                    removeLoadingThing();
                } else {
                    removeAddSpecialButton();
                    removeLoadingThing();
                    if ($scope.products.length > 0) {
                        $scope.products.push(searchButtonIonItem);
                    }

                    if (current_page == total_pages) {
                        removeLoadingThing();
                    } else {
                        addMoreLoadingThing();
                        removeAddSpecialButton();
                    }
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (error) {
                UIUtil.showErrorAlert('Error retrieving products.');
                $scope.$broadcast('scroll.refreshComplete');
                LogService.error({
                    message: 'getProducts error',
                    error: error
                });
            });
        }

        function recentSpecialRequests() {
            ShoppingService.getRecentlyPurchasedSpecialRequests().then(function (products) {
                $scope.products = products;
                var i = 0;
                for (i = 0; i < $scope.products.length; i++) {
                    var product = $scope.products[i];
                    if (product.product_type == 'custom') {
                        product.name = product.description;
                        product.isCustom = true;
                    }
                }
                $scope.dataLoaded = true;
                $scope.products.push(searchButtonIonItem);
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                total_pages = 0;
            }, function (error) {
                UIUtil.showErrorAlert('Error Loading Recently Purchased Products');
                $scope.$broadcast('scroll.refreshComplete');
                LogService.error({
                    message: 'getRecentlyPurchasedProducts error',
                    error: error
                });
            });
        }

        function removeAddSpecialButton() {
            var index = $scope.products.map(function (el) {
                return el.addButton;
            }).indexOf(searchButtonIonItem.addButton);
            if (index > -1) {
                $scope.products.splice(index, 1);
            }
        }

        $scope.$watch('search.text', function () {
            if ($scope.search.text && $scope.search.text != "") {
                // if(getFilteredCount() <= 1 && webVersion){
                if (webVersion) {
                    loadProducts(true);
                }
            }
        });

        $scope.getFilteredCount = getFilteredCount;
        function getFilteredCount() {
            try {
                var length = $scope.$eval('products | filter:searchForProduct').length;
                $log.info('getFilteredCount', length);
                return length;
            } catch (e) {
                $log.error('getFilteredCount', e);
            }
        }

        function addMoreLoadingThing() {
            removeLoadingThing();
            $scope.products.push(loadingMoreButton);
        }

        function removeLoadingThing() {
            var index = $scope.products.map(function (el) {
                return el.loadingMore;
            }).indexOf(loadingMoreButton.loadingMore);
            if (index > -1) {
                $scope.products.splice(index, 1);
            }
        }

        $scope.doRefresh = function () {
            $scope.$broadcast('scroll.refreshComplete');
            current_page = 0;
            total_pages = null;
            $scope.products = null;
            loadProducts();
        };

        $scope.productUnFavoritedRemove = function (product) {
            $scope.products = $scope.products.filter(function (prod) {
                return prod.id != product.id;
            });
            $scope.closeProductDetail();
        };

        $scope.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        $scope.goToCat = function (catId) {
            $state.go('app.shopping');
        };

        $scope.productInCart = function (product) {
            if (!product) {
                return false;
            }
            if (product.isCustom) {
                var index = $scope.cartItems().map(function (el) {
                    return el.product.name;
                }).indexOf(product.name);
                return index > -1;
            }
            var index = $scope.cartItems().map(function (el) {
                return el.product.id;
            }).indexOf(product.id);
            return index > -1;
        };

        $ionicModal.fromTemplateUrl('app/groceries/shop/productDetail/productDetailModal.html', { scope: $scope }).then(function (modal) {
            $scope.productDetailModal = modal;
        });

        $scope.productDetail = function (product) {
            if (canClickInList()) {
                if (product.addButton) {
                    $scope.addCustomProduct();
                    return;
                }
                $scope.productDetailProduct = product;
                $log.info('product detail product', product);
                $scope.productDetailModal.show();
                AppAnalytics.viewProduct(product, $scope.categoryName);
            }
        };

        $scope.closeProductDetail = function () {
            $scope.productDetailModal.hide();
            $scope.productDetailCartItem = null;
            $scope.productDetailProduct = null;
        };

        $scope.addCustomProduct = function () {
            $ionicModal.fromTemplateUrl('app/groceries/shop/customProduct/addCustomProductModal.html', {
                scope: $scope,
                focusFirstInput: true
            }).then(function (modal) {
                $scope.addCustomProductModal = modal;
                $scope.addCustomProductModal.show();
            });
        };

        $scope.$on('close.addCustomProduct', function () {
            $scope.addCustomProductModal.hide();
        });

        $scope.moreDataCanBeLoaded = function () {
            if (total_pages == 0) {
                return false;
            }
            if (total_pages) {
                if (current_page != 0) {
                    if (total_pages > current_page) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return true;
            }
        };

        $scope.loadMoreItems = function (locationcalledfrom) {
            if ($scope.search.text && $scope.search.text != "") {
                loadProducts(true);
            } else {
                loadProducts();
            }
        };

        var lastScrolling = Date.now();

        $scope.scrollList = function () {
            lastScrolling = Date.now();
        };

        angular.element('#productsIonContent').on('touchstart', function () {
            $log.debug('productsIonContent touchstart');
            $timeout(function () {
                if (window.cordova) {
                    if ($cordovaKeyboard.isVisible()) {
                        $cordovaKeyboard.close();
                    }
                }
            }, 1);
        });

        function canClickInList() {
            var diff = Date.now() - lastScrolling;
            return diff > 400;
        }

        $scope.cartItems = function () {
            return ShoppingService.getCartItems();
        };

        $scope.addNoteForProduct = function (product) {
            if (product) {
                var index = -1;
                if (product.isCustom) {
                    index = $scope.cartItems().map(function (el) {
                        return el.product.name;
                    }).indexOf(product.name);
                } else {
                    index = $scope.cartItems().map(function (el) {
                        return el.product.id;
                    }).indexOf(product.id);
                }

                if (index > -1) {
                    $scope.notePopoverItem = $scope.cartItems()[index];
                    $scope.noteModal.show();
                    $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
                }
            }
        };

        $scope.$on('close.productNotes', function (event, data) {
            $scope.notePopoverItem.note = data;
            ShoppingService.updateNoteOnItem($scope.notePopoverItem);
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.$on('cancel.productNotes', function () {
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        var searchFocused = false;
        $scope.showCancelSearch = false;

        $scope.searchFocus = function () {
            searchFocused = true;
            $scope.showCancelSearch = true;
        };

        $scope.searchUnFocus = function () {
            searchFocused = false;
            if ($scope.searching) {
                $scope.showCancelSearch = true;
            } else {
                $scope.showCancelSearch = false;
            }
            if (window.cordova && cordova.plugins.Keyboard) {
                $log.debug('closingkeyboard');
                cordova.plugins.Keyboard.close();
            }
        };

        loadData();

        var imageModal = null;
        $scope.imageModalImageUrl = '';
        $scope.openImageModal = function (product) {
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                imageModal = modal;
                var url = '';
                try {
                    if (product.images.length > 0 && product.images[0].original_size_url) {
                        url = product.images[0].original_size_url;
                    }
                } catch (exception) {
                    LogService.error(exception);
                }
                $scope.imageModalImageUrl = url;
                $ionicSlideBoxDelegate.slide(0);
                imageModal.show();
            });
        };

        $scope.closeImageModal = function () {
            imageModal.hide();
        };

        $scope.imageSlideChanged = function () {
            imageModal.hide();
        };

        $scope.viewRecentSpecialRequestsClick = function () {
            $state.go('app.recentSpecialRequests');
        };
    }
})();

/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('ProductsController', ['$scope', '$ionicModal', '$state', '$stateParams', 'ShoppingService', '$log', 'UIUtil', '$timeout', '$cordovaKeyboard', 'LogService', '$ionicSlideBoxDelegate', 'AccountService', '$filter', 'AppAnalytics', '$ionicHistory', 'FeatureService', 'ProductService', ProductsController]);

    function ProductsController($scope, $ionicModal, $state, $stateParams, ShoppingService, $log, UIUtil, $timeout, $cordovaKeyboard, LogService, $ionicSlideBoxDelegate, AccountService, $filter, AppAnalytics, $ionicHistory, FeatureService, ProductService) {

        $scope.addCustomProductModal = null;
        $scope.dataLoaded = false;
        $scope.showingProductHistory = false;

        var mq = window.matchMedia('all and (max-width: 700px)');
        var categorySearchGoesToGlobalSearch = FeatureService.categorySearchGoesToGlobalSearch();
        var current_page = 0;
        var total_pages = null;
        var lastPageRequested = null;
        var isSaleCategory = false;

        $scope.search = {
            text: null
        };

        if (mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }

        $scope.getItemWidth = function () {
            return $scope.itemWidth;
        };

        $scope.getItemClass = function (product) {
            if (!product) return '';
            if (product.addButton) {
                return 'item-stable item-no-border';
            } else if (product.loadingMore) {
                return 'item-loading-more';
            }
        };

        $scope.searchForProduct = function (item) {
            return ProductService.fuzzyMatchProductWithTermFilter(item, $scope.search.text);
        };

        $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
            scope: $scope,
            focusFirstInput: true,
            animation: 'scale-in'
        }).then(function (modal) {
            $scope.noteModal = modal;
        });

        var addSpecialRequestItemButton = {
            addButton: true
        };

        var loadingMoreButton = {
            loadingMore: true
        };

        $scope.inCartText = function (product) {
            try {
                if (product.description_label) {
                    if ($scope.cartItemCountForProduct(product) > 1) {
                        return product.description_label[product.description_label.length - 1];
                    } else {
                        return product.description_label[0];
                    }
                }
            } catch (e) {
                return "";
            }
        };

        $scope.addItem = function (product, fromdetail) {
            if (canClickInList()) {
                ShoppingService.addProductToCart(product);
                product.added = true;
                AppAnalytics.addProductToCart(product, $scope.categoryName, fromdetail);
            }
        };

        angular.element('#clearProductSearchText').on('touchstart', function () {
            $timeout(function () {
                $scope.search.text = '';
            }, 1);
        });

        $scope.removeItemFromCart = function (product) {
            if (canClickInList()) {
                ShoppingService.removeOneProductFromCart(product);
            }
        };

        $scope.removeCartItemForProductFromCartCompletely = function (product) {
            if (canClickInList()) {
                ShoppingService.removeProductsCartItemFromCart(product);
            }
        };

        $scope.startTouchIntoSearchBar = function () {
            if (categorySearchGoesToGlobalSearch && !isSaleCategory) {
                $state.go('app.searchProducts');
            }
        };

        $scope.searchPlaceholder = function () {
            if (categorySearchGoesToGlobalSearch && !isSaleCategory) {
                return "Search All Products";
            }
            var searchPlaceholder = 'Search ' + $scope.categoryName;
            return searchPlaceholder;
        };

        $scope.cartItemCountForProduct = function (product, includeZero) {
            if (product) {
                if (product.isCustom) {
                    var index = $scope.cartItems().map(function (el) {
                        return el.product.name;
                    }).indexOf(product.name);
                    if (index > -1) {
                        return $scope.cartItems()[index].qty;
                    } else if (includeZero) {
                        return 0;
                    }
                }

                var index = $scope.cartItems().map(function (el) {
                    return el.product.id;
                }).indexOf(product.id);
                if (index > -1) {
                    if (product.product_type != "by weight") {
                        return parseInt($scope.cartItems()[index].qty);
                    } else if (product.has_custom_label) {
                        return $filter('number')(parseFloat($scope.cartItems()[index].qty * 100 / (product.unit_weight * 100)), 0);
                    } else {
                        return parseFloat($scope.cartItems()[index].qty);
                    }
                } else if (includeZero) {
                    return 0;
                }
            }
        };

        $scope.clearSearch = function () {
            $scope.search.text = null;
        };

        $scope.showNoProductsMessage = function () {
            try {
                if ($scope.dataLoaded && isRecentProducts()) {
                    return $scope.products.length <= 1;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        };

        $scope.isRecentProducts = isRecentProducts;
        var isRecentProducts = function isRecentProducts() {
            return $state.includes('app.recentProducts');
        };

        var loadData = function loadData() {
            if (isRecentProducts()) {
                $scope.categoryName = "Buy Again";
                $scope.showingProductHistory = true;
            } else if ($state.includes('app.recentSpecialRequests')) {
                $scope.categoryName = "Recent Special Requests";
            } else {
                var subCat = angular.fromJson($stateParams.category);
                $scope.subCategory = subCat;
                $scope.categoryName = $scope.subCategory.name;
                $scope.parentCategory = $scope.subCategory;
                ShoppingService.getSubCategories($scope.subCategory, true).then(function (data) {
                    $scope.subCategories = data.categories;
                    $scope.$broadcast('scroll.refreshComplete');
                }, function (error) {
                    LogService.error({
                        message: 'getSubCategories error',
                        error: error
                    });
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
            AppAnalytics.viewCategory($scope.categoryName);
            setSaleCategory();
        };

        function setSaleCategory() {
            isSaleCategory = $scope.categoryName == "On Sale";
        }

        $scope.clickSubCategory = function (subCat) {
            subCat.parentName = $scope.categoryName;
            if (!$scope.parentCategory) $scope.parentCategory = $scope.subCategory;
            $scope.subCategory = subCat;
            $scope.products = null;
            $scope.search.text = null;
            $scope.addCustomProductModal = null;
            $scope.dataLoaded = false;
            $scope.showingProductHistory = false;

            current_page = 0;
            total_pages = null;
            lastPageRequested = null;

            loadProducts();
        };

        $scope.clickHome = function () {
            $state.go('app.home');
        };

        $scope.parentCategoryClick = function () {
            $ionicHistory.goBack();
        };

        function loadProducts(searching) {
            if ($state.includes('app.recentProducts')) {
                getRecentProducts();
            } else if ($state.includes('app.recentSpecialRequests')) {
                recentSpecialRequests();
            } else {
                getProducts(searching);
            }
        }

        function getRecentProducts() {
            if (lastPageRequested) {
                if (current_page + 1 == lastPageRequested) {
                    return;
                } else {
                    lastPageRequested += 1;
                }
            } else {
                lastPageRequested = 1;
            }

            ShoppingService.getRecentlyPurchasedProducts(current_page += 1).then(function (data) {
                current_page = data.current_page;
                total_pages = data.total_pages;
                if ($scope.products && $scope.products.length > 1) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = data.products[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var _product = _step.value;

                            $scope.products.push(_product);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator['return']) {
                                _iterator['return']();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }
                } else {
                    $scope.products = data.products;
                }

                if (current_page - 1 == total_pages) {
                    removeAddSpecialButton();
                    $scope.products.push(addSpecialRequestItemButton);
                } else {
                    removeAddSpecialButton();
                    removeLoadingThing();
                    if ($scope.products.length > 0) {
                        $scope.products.push(addSpecialRequestItemButton);
                    }

                    if (current_page == total_pages) {
                        removeLoadingThing();
                    } else {
                        addMoreLoadingThing();
                        removeAddSpecialButton();
                    }
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (error) {
                UIUtil.showErrorAlert('Error Loading Recently Purchased Products');
                $scope.$broadcast('scroll.refreshComplete');
                LogService.error({
                    message: 'getRecentlyPurchasedProducts error',
                    error: error
                });
            });
        }

        function preventDuplicateUtilityItemsInList() {
            try {

                var index = $scope.products.map(function (el) {
                    return el.addButton;
                }).indexOf(addSpecialRequestItemButton.addButton);
                if (index > -1) {
                    $scope.products.splice(index, 1);
                }

                var index = $scope.products.map(function (el) {
                    return el.loadingMore;
                }).indexOf(loadingMoreButton.loadingMore);
                if (index > -1) {
                    $scope.products.splice(index, 1);
                }

                var found = $scope.cartItems().find(function (x) {
                    return x.product.id == product.id;
                });
            } catch (e) {}
        }

        function getProducts(searching) {
            if (!$scope.moreDataCanBeLoaded() && getFilteredCount() <= 2) {
                removeLoadingThing();
                return false;
            }

            if (lastPageRequested) {
                if (current_page + 1 == lastPageRequested) {
                    return;
                } else {
                    lastPageRequested += 1;
                }
            } else {
                lastPageRequested = 1;
            }

            ShoppingService.getProducts($scope.subCategory, true, current_page + 1, searching).then(function (data) {
                current_page = data.current_page;
                total_pages = data.total_pages;
                if ($scope.products && $scope.products.length > 1) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = data.products[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _product2 = _step2.value;

                            $scope.products.push(_product2);
                        }
                    } catch (err) {
                        _didIteratorError2 = true;
                        _iteratorError2 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                _iterator2['return']();
                            }
                        } finally {
                            if (_didIteratorError2) {
                                throw _iteratorError2;
                            }
                        }
                    }
                } else {
                    $scope.products = data.products;
                }
                if (current_page > total_pages) {
                    removeAddSpecialButton();
                    $scope.products.push(addSpecialRequestItemButton);
                    removeLoadingThing();
                } else {
                    removeAddSpecialButton();
                    removeLoadingThing();
                    if ($scope.products.length > 0) {
                        $scope.products.push(addSpecialRequestItemButton);
                    }

                    if (current_page == total_pages) {
                        removeLoadingThing();
                    } else {
                        addMoreLoadingThing();
                        removeAddSpecialButton();
                    }
                }
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (error) {
                UIUtil.showErrorAlert('Error retrieving products.');
                $scope.$broadcast('scroll.refreshComplete');
                LogService.error({
                    message: 'getProducts error',
                    error: error
                });
            });
        }

        function recentSpecialRequests() {
            ShoppingService.getRecentlyPurchasedSpecialRequests().then(function (products) {
                $scope.products = products;
                var i = 0;
                for (i = 0; i < $scope.products.length; i++) {
                    var product = $scope.products[i];
                    if (product.product_type == 'custom') {
                        product.name = product.description;
                        product.isCustom = true;
                    }
                }
                $scope.dataLoaded = true;
                $scope.products.push(addSpecialRequestItemButton);
                $scope.$broadcast('scroll.refreshComplete');
                $scope.$broadcast('scroll.infiniteScrollComplete');
                total_pages = 0;
            }, function (error) {
                UIUtil.showErrorAlert('Error Loading Recently Purchased Products');
                $scope.$broadcast('scroll.refreshComplete');
                LogService.error({
                    message: 'getRecentlyPurchasedProducts error',
                    error: error
                });
            });
        }

        function removeAddSpecialButton() {
            var index = $scope.products.map(function (el) {
                return el.addButton;
            }).indexOf(addSpecialRequestItemButton.addButton);
            if (index > -1) {
                $scope.products.splice(index, 1);
            }
        }

        $scope.$watch('search.text', function () {
            if ($scope.search.text && $scope.search.text != "") {
                // if(getFilteredCount() <= 1 && webVersion){
                if (webVersion) {
                    loadProducts(true);
                }
            }
        });

        $scope.getFilteredCount = getFilteredCount;
        function getFilteredCount() {
            try {
                var length = $scope.$eval('products | filter:searchForProduct').length;
                return length;
            } catch (e) {
                $log.error('getFilteredCount', e);
            }
        }

        function addMoreLoadingThing() {
            removeLoadingThing();
            $scope.products.push(loadingMoreButton);
        }

        function removeLoadingThing() {
            var index = $scope.products.map(function (el) {
                return el.loadingMore;
            }).indexOf(loadingMoreButton.loadingMore);
            if (index > -1) {
                $scope.products.splice(index, 1);
            }
        }

        $scope.doRefresh = function () {
            loadProducts();
        };

        $scope.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        $scope.goToCat = function (catId) {
            $state.go('app.shopping');
        };

        $scope.productInCart = function (product) {
            if (!product) {
                return false;
            }
            if (product.isCustom) {
                var index = $scope.cartItems().map(function (el) {
                    return el.product.name;
                }).indexOf(product.name);
                return index > -1;
            }
            var index = $scope.cartItems().map(function (el) {
                return el.product.id;
            }).indexOf(product.id);
            return index > -1;
        };

        $ionicModal.fromTemplateUrl('app/groceries/shop/productDetail/productDetailModal.html', { scope: $scope }).then(function (modal) {
            $scope.productDetailModal = modal;
        });

        $scope.productDetail = function (product) {
            if (canClickInList()) {
                if (product.addButton) {
                    $scope.addCustomProduct();
                    return;
                }
                $scope.productDetailProduct = product;
                $scope.productDetailModal.show().then(function () {
                    $("button[aria-label='add to favorites icon in top left']").first().focus();
                });
                AppAnalytics.viewProduct(product, $scope.categoryName);
            }
        };

        $scope.closeProductDetail = function () {
            $scope.productDetailModal.hide();
            $scope.productDetailCartItem = null;
            $scope.productDetailProduct = null;
        };

        $scope.addCustomProduct = function () {
            $ionicModal.fromTemplateUrl('app/groceries/shop/customProduct/addCustomProductModal.html', {
                scope: $scope,
                focusFirstInput: true
            }).then(function (modal) {
                $scope.addCustomProductModal = modal;
                $scope.addCustomProductModal.show();
            });
        };

        $scope.$on('close.addCustomProduct', function () {
            $scope.addCustomProductModal.hide();
        });

        $scope.moreDataCanBeLoaded = function () {
            if (total_pages > current_page) {
                return true;
            }
            if (total_pages == 0) {
                return false;
            }
            if (total_pages) {
                if (current_page != 0) {
                    if (total_pages > current_page) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return true;
            }
        };

        $scope.loadMoreItems = function (locationcalledfrom) {
            if ($scope.search.text && $scope.search.text != "") {
                loadProducts(true);
            } else {
                loadProducts();
            }
        };

        var lastScrolling = Date.now();

        $scope.scrollList = function () {
            lastScrolling = Date.now();
        };

        angular.element('#productsIonContent').on('touchstart', function () {
            $timeout(function () {
                if (window.cordova) {
                    if ($cordovaKeyboard.isVisible()) {
                        $cordovaKeyboard.close();
                    }
                }
            }, 1);
        });

        function canClickInList() {
            var diff = Date.now() - lastScrolling;
            return diff > 400;
        }

        $scope.cartItems = function () {
            return ShoppingService.getCartItems();
        };

        $scope.addNoteForProduct = function (product) {
            if (product) {
                var index = -1;
                if (product.isCustom) {
                    index = $scope.cartItems().map(function (el) {
                        return el.product.name;
                    }).indexOf(product.name);
                } else {
                    index = $scope.cartItems().map(function (el) {
                        return el.product.id;
                    }).indexOf(product.id);
                }

                if (index > -1) {
                    $scope.notePopoverItem = $scope.cartItems()[index];
                    $scope.noteModal.show();
                    $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
                }
            }
        };

        $scope.$on('close.productNotes', function (event, data) {
            $scope.notePopoverItem.note = data;
            ShoppingService.updateNoteOnItem($scope.notePopoverItem);
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.$on('cancel.productNotes', function () {
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        var searchFocused = false;
        $scope.showCancelSearch = false;

        $scope.searchFocus = function () {
            searchFocused = true;
            $scope.showCancelSearch = true;
        };

        $scope.searchUnFocus = function () {
            searchFocused = false;
            if ($scope.searching) {
                $scope.showCancelSearch = true;
            } else {
                $scope.showCancelSearch = false;
            }
            if (window.cordova && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.close();
            }
        };

        loadData();

        var imageModal = null;
        $scope.imageModalImageUrl = '';
        $scope.openImageModal = function (product) {
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                imageModal = modal;
                var url = '';
                try {
                    if (product.images.length > 0 && product.images[0].original_size_url) {
                        url = product.images[0].original_size_url;
                    }
                } catch (exception) {
                    LogService.error(exception);
                }
                $scope.imageModalImageUrl = url;
                $ionicSlideBoxDelegate.slide(0);
                imageModal.show();
            });
        };

        $scope.closeImageModal = function () {
            imageModal.hide();
        };

        $scope.imageSlideChanged = function () {
            imageModal.hide();
        };

        $scope.viewRecentSpecialRequestsClick = function () {
            $state.go('app.recentSpecialRequests');
        };

        $scope.getPrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                    var unit_of_measure = "lb";
                } else {
                    var unit_of_measure = product.unit_of_measure;
                }

                return $filter('currency')(product.price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.price);
            }
        };

        $scope.getSalePrice = function (product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                var unit_of_measure = "lb";
            } else {
                var unit_of_measure = product.unit_of_measure;
            }

            if (product.product_type == 'by weight') {
                return $filter('currency')(product.sale_price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.sale_price);
            }
        };
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('SubCategoriesController', ['$scope', '$state', 'ShoppingService', '$stateParams', 'UIUtil', 'LogService', 'AccountService', 'KahunaService', SubCategoriesController]);

    function SubCategoriesController($scope, $state, ShoppingService, $stateParams, UIUtil, LogService, AccountService, KahunaService) {

        $scope.dataLoaded = false;

        $scope.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        $scope.doRefresh = function () {
            ShoppingService.getSubCategories($scope.parentCat, true).then(function (data) {
                $scope.subCategories = data.categories;
                $scope.$broadcast('scroll.refreshComplete');
            }, function (error) {
                LogService.error({
                    message: 'getSubCategories error',
                    error: error
                });
                $scope.$broadcast('scroll.refreshComplete');
            });
        };

        var loadData = function loadData() {
            $scope.parentCat = angular.fromJson($stateParams.parentCat);
            $scope.title = $scope.parentCat.name;
            KahunaService.viewCategory($scope.title);
        };

        var loadSubCategories = function loadSubCategories() {
            ShoppingService.getSubCategories($scope.parentCat, true).then(function (data) {
                $scope.subCategories = data.categories;
                $scope.$broadcast('scroll.refreshComplete');
                $scope.dataLoaded = true;
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }, function (error) {
                UIUtil.showErrorAlert('Error loading categories.');
            });
        };

        $scope.loadMoreItems = function () {
            loadSubCategories();
        };

        $scope.showProducts = function (subCat) {
            if (hasSubCategories(subCat)) {
                $state.go('app.subcategories', { parentCat: angular.toJson(subCat) });
            } else {
                $state.go('app.products', { category: angular.toJson(subCat) });
            }
        };

        function hasSubCategories() {
            var subCat = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

            try {
                return subCat.categories && subCat.categories.length > 0;
            } catch (e) {
                return false;
            }
        }

        $scope.moreDataCanBeLoaded = function () {
            if ($scope.dataLoaded) {
                return false;
            } else {
                return true;
            }
        };

        loadData();
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('ShoppingCartController', ['$scope', '$filter', '$rootScope', 'ShoppingService', 'ShoppingCartService', '$ionicModal', '$log', '$state', 'AccountService', 'ProductDetailProvider', 'UIUtil', '$ionicActionSheet', '$timeout', ShoppingCartController]);

    function ShoppingCartController($scope, $filter, $rootScope, ShoppingService, ShoppingCartService, $ionicModal, $log, $state, AccountService, ProductDetailProvider, UIUtil, $ionicActionSheet, $timeout) {

        $scope.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        $scope.title = "Cart";
        $scope.total = 0;

        $rootScope.$on('cart.items.saved.refresh', function () {
            $scope.refreshCartData();
        });

        $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
            scope: $scope,
            focusFirstInput: true,
            animation: 'scale-in'
        }).then(function (modal) {
            $scope.noteModal = modal;
        });

        $ionicModal.fromTemplateUrl('app/groceries/shop/customProduct/addCustomProductModal.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function (modal) {
            $scope.addCustomProductModal = modal;
        });

        $ionicModal.fromTemplateUrl('app/groceries/shop/terms/alcoholTermsModal.html', {
            scope: $scope,
            focusFirstInput: true
        }).then(function (modal) {
            $scope.alcoholTermsModal = modal;
        });

        $scope.showNoCartItemsMessage = function () {
            if ($scope.cartItems) {
                if ($scope.cartItems.length < 1) {
                    return true;
                }
                return false;
            } else {
                return false;
            }
        };

        $scope.inCartText = function (product) {
            if (product.product_type == 'by weight') {
                return " " + product.unit_of_measure;
            } else {
                return "";
            }
        };

        $scope.inCartCount = function (cartItem) {
            var product = cartItem.product;
            if (product.product_type == 'by weight') {
                var unit_weight = product.unit_weight;
                if (product.has_custom_label) {
                    return $filter('number')(parseFloat(cartItem.qty) * 100 / (unit_weight * 100), 0);
                } else {
                    return parseFloat(cartItem.qty);
                }
            } else {
                return cartItem.qty;
            }
        };

        $scope.inShoppingCartText = function (product, count) {
            if (product.product_type == 'by weight') {
                return $scope.byWeightText(product, count);
            } else {
                return "";
            }
        };

        $scope.byWeightText = function (product, count) {
            if (product.has_custom_label) {
                if (count > 1) {
                    return " " + product.description_label[product.description_label.length - 1];
                } else {
                    return " " + product.description_label[0];
                }
            } else {
                return " " + product.unit_of_measure;
            }
        };

        $scope.saleHasExpiredSinceUpdate = function (cartItem) {
            try {
                if (cartItem.product.on_sale) {
                    return false;
                }
                if (!cartItem.product.sale_ends_on || !cartItem.updated_at) {
                    return false;
                }
                var saleEndDate = moment(cartItem.product.sale_ends_on);
                var cartItemUpdated = moment(cartItem.updated_at);
                if (cartItemUpdated.isBefore(saleEndDate) && moment().isAfter(saleEndDate)) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        };

        $scope.anyItemsWithSalePriceChanged = function () {
            try {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = $scope.cartItems[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var cartItem = _step.value;

                        if ($scope.saleHasExpiredSinceUpdate(cartItem)) {
                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator['return']) {
                            _iterator['return']();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } catch (e) {
                return false;
            }
        };

        $scope.getItemClass = function (cartItem) {
            var itemClass = '';
            if (!cartItem.product.isCustom) {
                itemClass += ' item-thumbnail-left ';
            }
            if ($scope.saleHasExpiredSinceUpdate(cartItem)) {
                itemClass += ' item-sale-expired ';
            }
            return itemClass;
        };

        $scope.addCustomProduct = function () {
            $scope.addCustomProductModal.show();
        };

        $scope.clickCartItem = function (cartItem) {
            ProductDetailProvider.showModal($scope, cartItem.product).then(function () {
                $scope.refreshCartData();
            });
        };

        $scope.$on('close.addCustomProduct', function () {
            $scope.addCustomProductModal.hide();
            $scope.refreshCartData();
        });

        $scope.refreshCartData = function (fromServer) {
            if (fromServer) {
                $scope.cartItems = ShoppingService.getCartItems();
                $scope.updateTotal();
                ShoppingCartService.loadServerCart().then(function () {
                    $scope.cartItems = ShoppingService.getCartItems();
                    $scope.updateTotal();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            } else {
                $scope.cartItems = ShoppingService.getCartItems();
                console.log($scope.cartItems);
                $scope.updateTotal();
            }
        };

        $scope.clearCart = function (confirm) {
            if (confirm) {
                confirmClearCart();
            } else {
                ShoppingService.clearCart();
                $scope.cartItems = [];
            }
        };

        $scope.updateTotal = function () {
            try {
                var total = 0;
                angular.forEach($scope.cartItems, function (cartItem) {
                    if (cartItem.product.on_sale) {
                        total = total + cartItem.product.sale_price * cartItem.qty;
                    } else {
                        total = total + cartItem.product.price * cartItem.qty;
                    }
                });
                $scope.total = total;
            } catch (exception) {}
        };

        $scope.completeOrder = function () {
            if (orderContainsAlcohol()) {
                $scope.alcoholTermsModal.show();
            } else {
                $state.go('app.checkout');
            }
        };

        function orderContainsAlcohol() {
            try {
                // check each product's categories for an alcohol category
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = $scope.cartItems[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var item = _step2.value;

                        if (!item.product.isCustom && categoryContainsAlcohol(item.product.categories)) {
                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                            _iterator2['return']();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return false;
            } catch (e) {
                return false;
            }
        }

        function categoryContainsAlcohol(categories) {
            try {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = categories[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var category = _step3.value;

                        if (category.terms_required) {
                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError3 = true;
                    _iteratorError3 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                            _iterator3['return']();
                        }
                    } finally {
                        if (_didIteratorError3) {
                            throw _iteratorError3;
                        }
                    }
                }

                return false;
            } catch (e) {
                return false;
            }
        }

        $scope.$on('$ionicView.beforeEnter', function () {
            loadStore();
            $scope.refreshCartData(true);
        });

        $scope.$on('$ionicView.afterEnter', function () {
            loadStore();
        });

        $scope.addNote = function (item) {
            $scope.noteModal.show();
            $scope.notePopoverItem = item;
            $scope.$broadcast('data.productNotes', $scope.notePopoverItem.note);
        };

        $scope.editAddNote = function (item) {
            item.showEditNote = true;
            item.editNoteText = item.note;
            $timeout(function () {
                $("textarea.text-are-note-item").focus();
            }, 200);
        };

        $scope.saveEditNoteArea = function (item) {
            item.note = item.editNoteText;
            ShoppingService.updateNoteOnItem(item);
            item.showEditNote = false;
        };

        $scope.cancelEditNoteArea = function (item) {
            item.editNoteText = item.note;
            item.showEditNote = false;
        };

        $scope.$on('close.productNotes', function (event, data) {
            $scope.notePopoverItem.note = data;
            ShoppingService.updateNoteOnItem($scope.notePopoverItem);
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.$on('cancel.productNotes', function () {
            $scope.notePopoverItem = null;
            $scope.noteModal.hide();
        });

        $scope.addProduct = function (productToAdd) {
            $log.info('add item', productToAdd);
            ShoppingService.addProductToCart(productToAdd);
            $scope.refreshCartData();
        };

        $scope.removeCartItemForProductFromCartCompletely = function (cartItem) {
            ShoppingService.removeProductsCartItemFromCart(cartItem.product);
            $scope.refreshCartData();
        };

        $scope.removeProduct = function (productToRemove) {
            ShoppingService.removeOneProductFromCart(productToRemove);
            $scope.refreshCartData();
        };

        function confirmClearCart() {
            UIUtil.showYesNoConfirm('Clear Cart', 'Are you sure you want to remove everything from your cart? This is not reversible.').then(function (doIt) {
                if (doIt) {
                    //clear the cart.
                    ShoppingCartService.clearCart();
                    $scope.cartItems = [];
                }
            });
        }

        $scope.cartOptionsButtonClicked = function () {
            $ionicActionSheet.show({
                titleText: 'Shopping Cart Options',
                cancelText: 'Cancel',
                destructiveText: 'Empty Cart',
                destructiveButtonClicked: function destructiveButtonClicked() {
                    confirmClearCart();
                    return true;
                }
            });
        };

        function loadStore() {
            $scope.store = AccountService.getCustomerStore();
        }

        $scope.getPrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.has_custom_label) {
                    var price = '~' + $filter('currency')(product.price * product.unit_weight);
                    var label = product.description_label[0];
                } else {
                    var price = $filter('currency')(product.price);
                    var label = weightedLabel(product);
                }
                return price + ' / ' + label;
            } else {
                return $filter('currency')(product.price);
            }
        };

        function weightedLabel(product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                return "lb";
            } else {
                return product.unit_of_measure;
            }
        }

        $scope.getSalePrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.has_custom_label) {
                    var price = '~' + $filter('currency')(product.sale_price * product.unit_weight);
                    var label = product.description_label[0];
                } else {
                    var price = $filter('currency')(product.sale_price);
                    var label = weightedLabel(product);
                }
                return price + ' / ' + label;
            } else {
                return $filter('currency')(product.sale_price);
            }
        };
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('alcoholTermsModalController', ['$scope', '$rootScope', '$ionicModal', '$log', '$state', 'UIUtil', '$ionicActionSheet', '$timeout', alcoholTermsModalController]);

    function alcoholTermsModalController($scope, $rootScope, $ionicModal, $log, $state, UIUtil, $ionicActionSheet, $timeout) {

        $scope.completeOrder = function () {
            $rootScope.alcohol_terms_accepted = true;
            $scope.alcoholTermsModal.hide();
            $state.go('app.checkout');
        };

        $scope.closeModal = function () {
            $rootScope.alcohol_terms_accepted = false;
            $scope.alcoholTermsModal.hide();
        };

        $scope.termsClass = function () {
            if (webVersion) {
                return "web-alcohol-terms";
            }
        };
    };
})();
'use strict';

(function () {
    'use strict';

    angular.module('app.shipt.search').directive('filterSort', filterSort);

    /* @ngInject */
    function filterSort() {

        var webTemplateUrl = "app/search/filterSort/filterSortDirective/webFilterSort.html",
            normaltemplateUrl = "app/search/filterSort/filterSortDirective/filterSort.html",
            templateUrl = null;

        if (webVersion) {
            templateUrl = webTemplateUrl;
        } else {
            templateUrl = normaltemplateUrl;
        }

        var directive = {
            restrict: 'E',
            templateUrl: templateUrl,
            scope: {
                categories: '=categories',
                brands: '=brands',
                filterSortOptions: "=filterSortOptions"
            },
            link: linkFunc,
            controller: filterSortDirectiveController,
            controllerAs: 'vm',
            bindToController: true
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {}
    }

    filterSortDirectiveController.$inject = ['$attrs', '$scope', '$log', 'filterSortOptions', 'AlgoliaFinder', 'FeatureService', 'COMMON_FEATURE_TOGGLES'];

    function filterSortDirectiveController($attrs, $scope, $log, filterSortOptions, AlgoliaFinder, FeatureService, COMMON_FEATURE_TOGGLES) {
        var vm = this;
        vm.filterSortOptions = $scope.vm.filterSortOptions;

        // Feature toggle for allowing algolia sort
        vm.algoliaSortEnabled = FeatureService.getFeatureToggle(COMMON_FEATURE_TOGGLES.ALGOLIA_SORT_ENABLED);
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('app.shipt.search').service('filterSortModal', filterSortModal);

    filterSortModal.$filterSortModal = ['$ionicModal', '$q'];

    /* @ngInject */
    function filterSortModal($ionicModal, $q) {

        var sortFilterModal = null;
        /**
         * @ngdoc function
         * @name show
         * @description function will return a promise and show the filter modal. Will resolve the promise when the modal is closed.
         *
         * @param $scope The scope that this modal will belong to.
         */
        this.show = function ($scope) {
            var defer = $q.defer();
            $scope.closeModal = function () {
                closeModal();
                defer.resolve();
            };
            getModal($scope).then(function (modal) {
                modal.show();
            });
            return defer.promise;
        };

        this.closeModal = function () {
            closeModal();
        };

        /**
         * @ngdoc function
         * @name getModal
         * @description Instantiates a new modal instance in the given scope.
         *
         * @param $scope The scope to which this modal belongs.
         * @returns {*} A promise resolving with the modal instance.
         */
        function getModal($scope) {
            var defer = $q.defer(),
                tpl = 'app/search/filterSort/modal/filterSortModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                sortFilterModal = modal;
                defer.resolve(sortFilterModal);
            });
            return defer.promise;
        }

        /**
         * Handler for closing the modal.
         */
        function closeModal() {
            if (sortFilterModal) {
                sortFilterModal.hide();
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('app.shipt.search').controller('filterSortModalController', filterSortModalController);

    filterSortModalController.$inject = ['$rootScope', '$scope', 'FILTER_SORT', 'AppAnalytics', '$ionicScrollDelegate'];

    /* @ngInject */
    function filterSortModalController($rootScope, $scope, FILTER_SORT, AppAnalytics, $ionicScrollDelegate) {
        var vm = this;

        $scope.$on(FILTER_SORT.EVENTS.RESET, function () {
            resetFilterSort($scope.filterSortOptions.sort, true);
            resetFilterSort($scope.filterSortOptions.categories);
            resetFilterSort($scope.filterSortOptions.brands);
            $scope.filterSortOptions.filterCount = 0;
        });

        vm.clear = function () {
            resetFilterSort($scope.filterSortOptions.sort, true);
            resetFilterSort($scope.filterSortOptions.categories);
            resetFilterSort($scope.filterSortOptions.brands);
            $scope.filterSortOptions.filterCount = 0;
            $ionicScrollDelegate.resize();
            $rootScope.$broadcast(FILTER_SORT.EVENTS.CLEAR_FILTER, {
                refreshSearch: true,
                searchTerm: $scope.filterSortOptions.extras.AlgoliaFinder.searchTermText
            });
        };

        function resetFilterSort(filterSort) {
            var isSort = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

            filterSort.displayExpanded = false;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = filterSort.options[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var option = _step.value;

                    option.selected = false;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            if (isSort) {
                filterSort.isNewSortApplied = false;
                _.findWhere(filterSort.options, { displayName: filterSort.defaultSelection }).selected = true;
            }
        }

        vm.cancel = function () {
            $scope.closeModal();
            $scope.filterSortOptions.sort.displayExpanded = false;
            $scope.filterSortOptions.categories.displayExpanded = false;
            $scope.filterSortOptions.brands.displayExpanded = false;
            AppAnalytics.filterSort({
                sortBy: $scope.filterSortOptions.sort.selectedOption().displayName,
                filterCategories: $scope.filterSortOptions.categories.selectedOptionsDisplay(),
                filterBrands: $scope.filterSortOptions.brands.selectedOptionsDisplay()
            });
        };
    }
})();
/**
 * Created by Shipt
 */

'use strict';

angular.module('shiptApp').controller('addressSearchController', ['$scope', '$state', 'UIUtil', 'LogService', 'PlacesAutocomplete', '$log', '$timeout', '$cordovaKeyboard', 'Geolocator', '$stateParams', addressSearchController]);

function addressSearchController($scope, $state, UIUtil, LogService, PlacesAutocomplete, $log, $timeout, $cordovaKeyboard, Geolocator, $stateParams) {
    var viewModel = this;
    $scope.search = { searchText: "" };
    viewModel.loadingSpinner = false;
    $scope.$on('$ionicView.afterEnter', function () {
        $('input.typeAheadAddressSearchTextBox').focus();
        viewModel.fromCheckout = angular.fromJson($stateParams.fromCheckout);
    });

    viewModel.resultClick = function (result) {
        try {
            if (result.other) {
                confirmAddress(null);
            } else {
                var place = result;
                result.loadingSpinner = true;
                $log.info('place click', place);
                if (place.address_components) {
                    viewModel.placeDetails = { result: place };
                    $log.info('placeDetails:', place);
                    var address = parsePlace(viewModel.placeDetails);
                    confirmAddress(address);
                    result.loadingSpinner = false;
                } else {
                    PlacesAutocomplete.getPlaceDetails(place).then(function (placeDetails) {
                        viewModel.placeDetails = placeDetails;
                        $log.info('placeDetails:', placeDetails);
                        var address = parsePlace(viewModel.placeDetails);

                        if (address.street1.includes("undefined")) {
                            address.street1 = place.terms[0].value;
                        }

                        confirmAddress(address);
                        result.loadingSpinner = false;
                    }, function (error) {
                        confirmAddress(null);
                    });
                }
            }
        } catch (e) {
            $log.error(e);
            result.loadingSpinner = false;
            errorSoHandleAsManualEntry();
        }
    };

    function errorSoHandleAsManualEntry() {
        UIUtil.showAlert('An Error Occurred', 'Please enter you address manually.').then(function () {
            viewModel.resultClick({ other: true });
        });
    }

    function confirmAddress(address) {
        $state.go('app.addEditAddress', { fromCheckout: angular.toJson(viewModel.fromCheckout), address: angular.toJson(address) });
    }

    function parsePlace(place) {
        try {
            var address = {};
            var ourAddress = {};
            var addressForm = {
                street_number: 'short_name',
                route: 'long_name',
                locality: 'long_name',
                administrative_area_level_1: 'long_name',
                postal_code: 'short_name'
            };
            var thePlace = place;
            if (!thePlace.result) {
                thePlace = {
                    result: place
                };
            }
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = thePlace.result.address_components[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var i = _step.value;

                    var addressType = i.types[0];
                    if (addressForm[addressType]) {
                        var val = i[addressForm[addressType]];
                        address[addressType] = val;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            ourAddress.street1 = address.street_number + ' ' + address.route;
            ourAddress.city = address.locality;
            ourAddress.state = address.administrative_area_level_1;
            ourAddress.zip_code = address.postal_code;
            return ourAddress;
        } catch (e) {
            $log.error(e);
            errorSoHandleAsManualEntry();
            return null;
        }
    }

    $scope.$watch('viewModel.search.searchQuery', function (val) {
        if (viewModel.search.searchQuery && viewModel.search.searchQuery != "") {
            viewModel.searchForAddress();
        }
    });

    viewModel.searchForAddress = function () {
        try {
            if (viewModel.search.searchQuery && viewModel.search.searchQuery != "") {
                viewModel.loadingSpinner = true;
                PlacesAutocomplete.searchText(viewModel.search.searchQuery).then(function (results) {
                    $log.info('RESULTS: ', results);
                    viewModel.results = results.predictions;
                    viewModel.loadingSpinner = false;
                    if (viewModel.results == null) {
                        viewModel.results = [];
                    }
                }, function (error) {
                    viewModel.results = [];
                    viewModel.loadingSpinner = false;
                    $log.info('ERROR: ', error);
                });
            }
        } catch (e) {
            viewModel.results = [];
            viewModel.loadingSpinner = false;
        }
    };

    viewModel.currentLocationClick = function () {
        try {
            viewModel.loadingSpinner = true;
            Geolocator.getCurrentPosition(true).then(function () {
                var lat = Geolocator.latitude();
                var long = Geolocator.longitude();
                PlacesAutocomplete.reverseGeolocationSearch(lat, long).then(function (data) {
                    $log.info('CURRENT LOCATION RESULTS:', data);
                    viewModel.resultClick(data.results[0]);
                    viewModel.loadingSpinner = false;
                }, function (error) {
                    UIUtil.showAlert('Error Getting Current Address', '');
                });
            });
        } catch (e) {
            $log.error(e);
            viewModel.loadingSpinner = false;
            errorSoHandleAsManualEntry();
        }
    };

    function confirmAddress(address) {
        $state.go('app.addEditAddress', { fromCheckout: angular.toJson(viewModel.fromCheckout), fromSearch: angular.toJson(true), address: angular.toJson(address) });
    }

    angular.element('#searchAddressListContent').on('touchstart', function () {
        $log.info('#searchAddressListContent touchstart');
        $timeout(function () {
            $log.info('#searchAddressListContent timeout');
            if (window.cordova) {
                $log.info('#searchAddressListContent window.cordova');
                if ($cordovaKeyboard.isVisible()) {
                    $log.info('#searchAddressListContent cordovaKeyboard.close');
                    $cordovaKeyboard.close();
                }
            }
        }, 1);
    });
};
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('selectAddressModal', ['$rootScope', '$ionicModal', '$q', selectAddressModal]);

    function selectAddressModal($rootScope, $ionicModal, $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/address/selectAddressModal/selectAddressModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                selectorModal = modal;
                defer.resolve(selectorModal);
            });
            return defer.promise;
        }

        var init = function init($scope, addresses, selectedAddress, addAddressCall) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.addresses = addresses;
            $scope.selectedAddress = selectedAddress;
            $scope.addAddressCall = addAddressCall;
            if (selectorModal) selectorModal.remove();
            selectorModal = null;
            getModal($scope).then(function (modal) {
                modal.show();
            });

            $scope.closeModal = function (selectedAddress) {
                defer.resolve(selectedAddress);
                selectorModal.hide();
            };

            $scope.$on('$destroy', function () {
                if (selectorModal) selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showModal: init
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('selectAddressModalController', ['$scope', '$timeout', selectAddressModalController]);

    function selectAddressModalController($scope, $timeout) {
        var vm = this;

        vm.cancel = function () {
            $scope.closeModal();
        };

        vm.saveSelection = function () {
            $scope.closeModal(vm.selectedAddress);
        };

        vm.clickAddress = function (window) {
            $timeout(function () {
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                vm.saveSelection();
            }, 200);
        };

        vm.addAddressClick = function () {
            $scope.addAddressCall();
            $scope.closeModal();
        };

        function loadData() {
            vm.selectedAddress = $scope.selectedAddress;
            vm.addresses = $scope.addresses;
        }

        loadData();
    }
})();
// customerAddressList
'use strict';

angular.module('shiptApp').directive('customerAddressList', ['$timeout', 'AccountService', 'AppAnalytics', '$rootScope', customerAddressList]);

function customerAddressList($timeout, AccountService, AppAnalytics, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            showEditButtons: '=showEditButtons',
            refreshList: '=refreshList',
            noDefaultAddress: '=noDefaultAddress',
            editAddressFunction: '&',
            chooseAddressFunction: '&',
            addAddressFunction: '&'
        },
        link: function link(scope, element, attrs) {

            function loadData() {
                scope.chooseStoreEnabled = AccountService.checkFeature("chooseStoreInApp");
                scope.customer = AccountService.getCustomerInfo(true);
                scope.defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();

                if (scope.refreshList) {
                    showLoading();
                    AccountService.getAddressesFromServer().then(function (data) {
                        scope.customer = data;
                        scope.defaultShoppingAddress = AccountService.getCustomerDefaultShoppingAddress();
                        hideLoading();
                        if (!scope.defaultShoppingAddress && scope.customer && scope.chooseStoreEnabled) {
                            scope.noDefaultAddress();
                        }
                    }, function (error) {
                        hideLoading();
                    });
                }
            }

            $rootScope.$on('refreshCustomerAddressList', function () {
                loadData();
            });

            function showLoading() {
                scope.showLoading = true;
            }

            function hideLoading() {
                scope.showLoading = false;
            }

            scope.clickAddress = function (address) {
                var addressClicked = address;
                scope.chooseAddressFunction({ clickedAddress: addressClicked });
            };

            scope.clickEditAddress = function (address) {
                var addressClicked = address;
                console.log('editAddressClick', addressClicked);
                scope.editAddressFunction({ clickedAddress: addressClicked });
            };

            scope.addAddressClick = function () {
                console.log('addAddressClick');
                scope.addAddressFunction();
            };

            loadData();
        },
        templateUrl: "app/groceries/account/address/customerAddressList/customerAddressList.html"
    };
}
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('AddProductToOrderSearchController', ['$scope', '$log', '$rootScope', 'ShoppingService', 'ProductService', 'UIUtil', '$ionicModal', '$filter', '$ionicSlideBoxDelegate', 'common', 'AppAnalytics', AddProductToOrderSearchController]);

    function AddProductToOrderSearchController($scope, $log, $rootScope, ShoppingService, ProductService, UIUtil, $ionicModal, $filter, $ionicSlideBoxDelegate, common, AppAnalytics) {
        var viewModel = this;

        viewModel.search = { searchQuery: null };
        viewModel.productDetailModal = null;
        var mq = window.matchMedia('all and (max-width: 700px)');
        var searchButtonIonItem = {
            addButton: true
        };
        var lastSearchText = "";
        if (mq.matches) {
            $scope.itemWidth = '33.3%';
        } else {
            $scope.itemWidth = '20%';
        }

        $scope.cancelSearch = function () {
            viewModel.closeAddItemModal();
        };

        $scope.$on('modal.shown', function (event, modal) {
            if (modal.id == 'addProductToOrderSearch') {
                viewModel.orderAddingTo = $scope.addProductToOrder;
            }
        });

        viewModel.getItemWidth = function () {
            return $scope.itemWidth;
        };

        $ionicModal.fromTemplateUrl('app/groceries/account/orders/addProduct/addProductToOrderDetailModal.html', { scope: $scope }).then(function (modal) {
            viewModel.productDetailModal = modal;
        });

        viewModel.addCustomProductClick = function () {
            $rootScope.$broadcast('customProduct.addProductToOrderSearch');
        };

        viewModel.closeProductDetail = function () {
            viewModel.productDetailModal.hide();
            viewModel.productDetailProduct = null;
        };

        viewModel.productClick = function (product) {
            if (product.addButton) {
                viewModel.addCustomProductClick();
                return;
            }

            viewModel.productDetailProduct = product;
            viewModel.productDetailModal.show();
        };

        viewModel.closeAddItemModal = function () {
            $rootScope.$broadcast('close.addProductToOrderSearch');
        };

        viewModel.saveProduct = function () {
            $rootScope.$broadcast('close.addProductToOrderSearch', viewModel.productToAdd);
        };

        function loadViewModelData() {
            viewModel.productToAdd = {};
        }

        viewModel.productInCart = function (product) {
            if (!product || !viewModel.orderAddingTo) {
                return false;
            }
            var index = viewModel.orderAddingTo.order_lines.map(function (el) {
                return el.requested_product.id;
            }).indexOf(product.id);
            return index > -1;
        };

        $scope.productInCart = viewModel.productInCart;

        $scope.addItemProductToOrder = function (product) {
            if (viewModel.productInCart(product)) {
                var orderLine = getOrderLineForProduct(product);
                if (orderLine.requested_product.product_type == 'by weight') {
                    orderLine.requested_qty = (orderLine.requested_qty * 100 + orderLine.requested_product.unit_weight * 100) / 100;
                } else {
                    orderLine.requested_qty++;
                }
            } else {
                var orderLine = {};
                orderLine.requested_product = product;
                if (product.product_type == 'by weight') {
                    orderLine.requested_qty = orderLine.requested_product.unit_weight;
                } else {
                    orderLine.requested_qty = 1;
                }
                orderLine.notes = null;
                viewModel.orderAddingTo.order_lines.push(orderLine);
            }
            $rootScope.$broadcast('update.OrderHistoryDetailModalController', viewModel.orderAddingTo);
        };

        function getOrderLineForProduct(product) {
            var index = viewModel.orderAddingTo.order_lines.map(function (el) {
                return el.requested_product.id;
            }).indexOf(product.id);
            if (index > -1) {
                return viewModel.orderAddingTo.order_lines[index];
            } else {
                return null;
            }
        }

        $scope.inCartCount = function (product) {
            if (product.product_type == 'by weight') {
                var unit_weight = product.unit_weight;
                if (product.has_custom_label) {
                    var quantity = $filter('number')(parseFloat(orderLine.requested_qty) * 100 / (unit_weight * 100), 0);
                    var label = quantity > 1 ? product.description_label[1] : product.description_label[0];
                    return quantity + ' ' + label;
                } else {
                    return parseFloat(orderLine.requested_qty);
                }
            } else {
                return orderLine.requested_qty;
            }
        };

        $scope.orderLineCountForProduct = function (product) {
            var orderLine = getOrderLineForProduct(product);
            if (orderLine) {
                if (product.product_type == 'by weight' && product.has_custom_label) {
                    var quantity = parseFloat(orderLine.requested_qty * 100 / (product.unit_weight * 100));
                    var count = $filter('number')(quantity, 0);
                    var label = quantity > 1 ? product.description_label[1] : product.description_label[0];
                    return quantity + ' ' + label;
                } else {
                    return orderLine.requested_qty;
                }
            }
        };

        $scope.removeItemProductToOrder = function (product) {
            var index = viewModel.orderAddingTo.order_lines.map(function (el) {
                return el.requested_product.id;
            }).indexOf(product.id);
            if (index > -1) {
                var orderLine = viewModel.orderAddingTo.order_lines[index];
                if (orderLine.requested_qty == 1 || orderLine.requested_qty == .5) {
                    if (orderLine.requested_product.product_type == 'by weight') {
                        if (orderLine.requested_qty == .5) {
                            viewModel.orderAddingTo.order_lines.splice(index, 1);
                        } else {
                            orderLine.requested_qty = orderLine.requested_qty - .5;
                        }
                    } else {
                        viewModel.orderAddingTo.order_lines.splice(index, 1);
                    }
                } else {
                    if (orderLine.requested_product.product_type == 'by weight') {
                        orderLine.requested_qty = orderLine.requested_qty - .5;
                    } else {
                        orderLine.requested_qty--;
                    }
                }
                $rootScope.$broadcast('update.OrderHistoryDetailModalController', viewModel.orderAddingTo);
            }
        };

        viewModel.getPrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                    var unit_of_measure = "lb";
                } else {
                    var unit_of_measure = product.unit_of_measure;
                }

                return $filter('currency')(product.price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.price);
            }
        };

        viewModel.getSalePrice = function (product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                var unit_of_measure = "lb";
            } else {
                var unit_of_measure = product.unit_of_measure;
            }

            if (product.product_type == 'by weight') {
                return $filter('currency')(product.sale_price) + ' per ' + unit_of_measure;
            } else {
                return $filter('currency')(product.sale_price);
            }
        };

        function refreshCartItems() {
            viewModel.cartItems = ShoppingService.getCartItems();
            viewModel.cartCount = ShoppingService.getCartItemCount();
        }

        viewModel.submitSearch = function () {
            if (viewModel.search.searchQuery && viewModel.search.searchQuery != "") {
                searchForProducts(viewModel.search.searchQuery);
            }
        };

        $scope.searchSubmit = viewModel.submitSearch;

        var searchForProducts = function searchForProducts(text) {
            $log.info('searching:' + text);
            if (text !== lastSearchText) {
                //reset search params if the search is different
                lastSearchText = text;
                AppAnalytics.productSearch(text);
            }
            $scope.myPromise = ProductService.searchForGroceryProducts(text).then(function (results) {
                if (results.constructor === Array) {
                    viewModel.searchResults = results;
                } else {
                    viewModel.searchResults = results.products;
                }

                viewModel.searchResults.push(searchButtonIonItem);
            }, function (error) {
                UIUtil.showAlert('Error', 'Error when searching for products.');
            });
        };

        loadViewModelData();

        var imageModal = null;
        $scope.imageModalImageUrl = '';
        $scope.openImageModal = function (product) {
            $ionicModal.fromTemplateUrl('image-modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                imageModal = modal;
                var url = '';
                try {
                    if (product.images.length > 0 && product.images[0].original_size_url) {
                        url = product.images[0].original_size_url;
                    }
                } catch (exception) {
                    LogService.error(exception);
                }
                $scope.imageModalImageUrl = url;
                $ionicSlideBoxDelegate.slide(0);
                imageModal.show();
            });
        };

        $scope.closeImageModal = function () {
            imageModal.hide();
        };

        $scope.imageSlideChanged = function () {
            imageModal.hide();
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('AddCustomProductToOrderController', ['$scope', '$rootScope', 'ShoppingService', 'AppAnalytics', AddCustomProductToOrderController]);

    function AddCustomProductToOrderController($scope, $rootScope, ShoppingService, AppAnalytics) {
        var viewModel = this;

        viewModel.cancelAddCustomProduct = function () {
            loadViewModelData();
            $rootScope.$broadcast('close.addCustomProduct');
        };

        viewModel.saveCustomProduct = function () {
            $rootScope.$broadcast('close.addCustomProduct', viewModel.customProduct);
            AppAnalytics.createSpecialRequest(viewModel.customProduct);
            loadViewModelData();
        };

        viewModel.subtractFromCustomItemCount = function () {
            if (viewModel.customProduct.qty != 1) {
                viewModel.customProduct.qty = viewModel.customProduct.qty - 1;
            }
        };

        viewModel.addToCustomItemCount = function () {
            viewModel.customProduct.qty = viewModel.customProduct.qty + 1;
        };

        function loadViewModelData() {
            viewModel.customProduct = {
                isCustom: true,
                price: 0,
                qty: 1
            };

            viewModel.title = "Special Request";
        }

        loadViewModelData();
    };
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('OrderHistoryDetailModalController', ['$scope', '$rootScope', 'AccountService', 'UIUtil', '$ionicModal', '$log', '$filter', 'UserOrderService', 'AppAnalytics', 'TippingModalProvider', 'TextNotesModalProvider', '$ionicActionSheet', 'ShareModalProvider', 'ShoppingService', 'FeatureService', 'OrderRating', 'ordersModalProvider', OrderHistoryDetailModalController]);

    function OrderHistoryDetailModalController($scope, $rootScope, AccountService, UIUtil, $ionicModal, $log, $filter, UserOrderService, AppAnalytics, TippingModalProvider, TextNotesModalProvider, $ionicActionSheet, ShareModalProvider, ShoppingService, FeatureService, OrderRating, ordersModalProvider) {

        var viewModel = this;
        viewModel.order = $scope.orderDetailOrder;
        var ratingModal = null;
        viewModel.noteModal = null;
        viewModel.addCustomProductToOpenOrderModel = null;
        viewModel.addProductToOrderSearchModal = null;
        $scope.addProductToOrder = null;

        function loadView() {
            var id = viewModel.order.id;
            AccountService.getOrder(id).success(function (order) {
                $log.debug('order from serve', order);
                angular.forEach(order.order_lines, function (order_line) {
                    if (order_line.actual_product) {
                        if (order_line.actual_product_type == "CustomProduct") {
                            order_line.actual_product.isCustom = true;
                        }
                    }
                    if (order_line.requested_product_type == "CustomProduct") {
                        order_line.requested_product.isCustom = true;
                    }
                });
                viewModel.order = order;
                setPageTitle();
                UIUtil.hideLoading();
                viewModel.accessibilityFocus();
                turnOnItemIssueReportingIfNeeded();
                $scope.$broadcast('scroll.refreshComplete');
            }).error(function (error) {
                UIUtil.hideLoading();
                $scope.$broadcast('scroll.refreshComplete');
                UIUtil.showErrorAlert('Could not load Order Data.');
            });
        }

        function turnOnItemIssueReportingIfNeeded() {
            try {
                if ($scope.rating) {
                    viewModel.rating = new OrderRating($scope.rating);
                    if (viewModel.rating.hasItemIssues()) {
                        viewModel.somethingWrongWithOrder = true;
                    }
                }
            } catch (e) {
                $log.error(e);
            }
        }

        function setPageTitle() {
            if (viewModel.order.store && viewModel.order.store.name) {
                viewModel.title = viewModel.order.store.name + " Order";
            } else {
                viewModel.title = "Order";
            }
        }

        function updateCurrentOrder(persistToServer) {
            if (persistToServer) {
                UIUtil.showLoading('Saving Order Changes...');
                UserOrderService.updateOrder(viewModel.order).success(function (updatedOrder) {
                    $log.debug('updated', updatedOrder);
                    $rootScope.$broadcast('order.saved.refresh', updatedOrder);
                    loadView();
                    UIUtil.hideLoading();
                    viewModel.hasChanges = false;
                }).error(function (error) {
                    showUpdateOrderErrorMessage(error);
                    UIUtil.hideLoading();
                });
            } else {
                viewModel.hasChanges = true;
            }
        }

        function showUpdateOrderErrorMessage(error) {
            try {
                if (!error || !error.errors) {
                    UIUtil.showErrorAlert('Error updating order info. \n\n' + JSON.stringify(error));
                }
                var message = '';
                var i;

                if (error.errors.base) {
                    for (i = 0; i < error.errors.base.length; i++) {
                        message += '\n';
                        message += ' ' + error.errors.base[i];
                    }
                }
                UIUtil.showErrorAlert('Error updating order info. \n\n' + message);
            } catch (exception) {
                UIUtil.showErrorAlert('Error updating order info. \n\n' + JSON.stringify(error));
            }
        }

        viewModel.addSpecialRequest = function () {
            if (viewModel.order.editable) {
                $ionicModal.fromTemplateUrl('app/groceries/account/orders/customProduct/addCustomProductToOpenOrder.html', { scope: $scope, focusFirstInput: true }).then(function (modal) {
                    viewModel.addCustomProductToOpenOrderModel = modal;
                    viewModel.addCustomProductToOpenOrderModel.show();
                });
            }
        };

        $scope.$on('close.addCustomProduct', function (event, data) {
            if (viewModel.addCustomProductToOpenOrderModel) viewModel.addCustomProductToOpenOrderModel.hide();
            viewModel.addCustomProductToOpenOrderModel = null;
            if (data) {
                data.requested_qty = data.qty;
                data.isCustom = true;
                data.requested_product = { description: data.name, isCustom: true };
                viewModel.order.order_lines.push(data);
                updateCurrentOrder();
            }
        });

        viewModel.addProductToOrder = function () {
            //popup search modal
            if (viewModel.order.editable) {
                $scope.addProductToOrder = viewModel.order;
                $ionicModal.fromTemplateUrl('app/groceries/account/orders/addProduct/addProductToOrderSearch.html', { id: 'addProductToOrderSearch', scope: $scope, focusFirstInput: true }).then(function (modal) {
                    viewModel.addProductToOrderSearchModal = modal;
                    viewModel.addProductToOrderSearchModal.show();
                });
            }
        };

        viewModel.getAriaLabel = function (order_line) {
            if (order_line.current_product.on_sale) {
                return viewModel.getDisplayNameForProduct(order_line.current_product) + viewModel.getSalePrice(order_line.current_product) + order_line.current_product.size;
            } else {
                return viewModel.getDisplayNameForProduct(order_line.current_product) + viewModel.getPrice(order_line.current_product) + order_line.current_product.size;
            }
        };

        viewModel.getAriaLabelSubstitutedOrderLine = function (order_line) {
            return viewModel.getDisplayNameForProduct(order_line.requested_product) + viewModel.getPrice(order_line.requested_product) + order_line.requested_product.size;
        };

        $scope.$on('update.OrderHistoryDetailModalController', function (event, order) {
            viewModel.order = order;
            updateCurrentOrder();
        });

        $scope.$on('customProduct.addProductToOrderSearch', function (event, data) {
            viewModel.addProductToOrderSearchModal.hide();
            viewModel.addSpecialRequest();
        });

        $scope.$on('close.addProductToOrderSearch', function (event, data) {
            viewModel.addProductToOrderSearchModal.hide();
        });

        viewModel.shareOrder = function () {
            ShareModalProvider.showModal($scope, 'order_detail_modal');
        };

        viewModel.editOrderNotes = function () {
            if (viewModel.order.editable) {
                $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
                    scope: $scope,
                    focusFirstInput: true,
                    animation: 'scale-in'
                }).then(function (modal) {
                    $scope.$broadcast('data.productNotes', { notes: viewModel.order.notes, title: "Order Notes" });
                    viewModel.noteModal = modal;
                    viewModel.noteModal.show();
                });
            }
        };

        $scope.$on('close.orderNotes', function (event, data) {
            viewModel.order.notes = data;
            viewModel.order.notesLoading = true;
            updateCurrentOrder();
            if (viewModel.noteModal) viewModel.noteModal.hide();
        });

        $scope.$on('cancel.orderNotes', function () {
            if (viewModel.noteModal) viewModel.noteModal.hide();
        });

        viewModel.showShareButton = function () {
            if (webVersion) {
                return true;
            } else {
                return true;
            }
        };

        viewModel.getDisplayDate = function (dateString) {
            return moment(dateString).format("MMM Do YYYY, h:mm a");
        };

        viewModel.saveChanges = function () {
            AppAnalytics.editOrder();
            updateCurrentOrder(true);
        };

        viewModel.getClassForItem = function (order_line) {
            var classString = "";
            classString += order_line.current_product.isCustom ? '' : 'item-thumbnail-left';
            if (viewModel.orderLineHasSub(order_line)) {
                classString += " sub-order-line-item";
            }
            if (viewModel.somethingWrongWithOrder) {
                classString += " reconciliation-item";
            }
            return classString;
        };

        viewModel.somethingWrongWithOrderClick = function () {
            if (!viewModel.somethingWrongWithOrder) {
                //UIUtil.showAlert('Report Problems',
                //'Click the "Issue" button on items that are problems to report problems to us.')
                viewModel.somethingWrongWithOrder = true;
            } else {
                viewModel.somethingWrongWithOrder = false;
            }
        };

        viewModel.showSomethingWrongButton = function () {
            if (!FeatureService.showTipping()) {
                return false;
            } else {
                return viewModel.order.status == "delivered";
            }
        };

        function isSameObject(obj1, obj2) {
            return JSON.stringify(obj1) == JSON.stringify(obj2);
        }

        function isSameProduct(prod1, prod2) {

            if (prod1.description && prod2.description) {
                if (prod1.description == prod2.description) return true;
                return false;
            }
            if (prod1.id && prod2.id) {
                if (prod1.id == prod2.id) {
                    return true;
                } else {
                    return false;
                }
            }
            return isSameObject(prod1, prod2);
        }

        viewModel.orderLineHasSub = function (order_line) {
            if (order_line.actual_product) {
                if (isSameProduct(order_line.requested_product, order_line.actual_product)) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        };

        viewModel.refreshOrder = function () {
            loadView();
        };

        viewModel.cancelOrderDetail = function () {
            if (viewModel.hasChanges) {
                UIUtil.showYesNoConfirm('Save Order Changes', 'You have made changes to this order. Would you like to save them?').then(function (confirmed) {
                    if (confirmed) {
                        updateCurrentOrder(true);
                        $scope.closeOrderDetailModel();
                    } else {
                        $scope.closeOrderDetailModel();
                    }
                });
            } else {
                $scope.closeOrderDetailModel();
            }
        };

        viewModel.rateOrderClick = function (order) {
            if ($scope.orderDetailFromRateOrder) {
                viewModel.cancelOrderDetail();
                return;
            }
            ordersModalProvider.showOrderRatingModalForOrder($scope, viewModel.order);
        };

        $rootScope.$on('hide.add.rating', function () {
            if (ratingModal) ratingModal.hide();
        });

        $rootScope.$on('rating.saved.refresh', function (event, args) {
            $log.info('rating.saved.refresh', args);
            if (viewModel.order) {
                viewModel.order.rating = args;
            }
        });

        viewModel.showRating = function (order) {
            return order.status == "delivered" && order.rating;
        };

        viewModel.showReconciliation = function () {
            if (!FeatureService.showCustomerOrderLineFeedback()) {
                return false;
            } else {
                return viewModel.order.status == "delivered";
            }
        };

        viewModel.getDisplayProductForOrderLine = function (order_line) {
            order_line.current_product = order_line.actual_product ? order_line.actual_product : order_line.requested_product;
            return order_line.current_product;
        };

        viewModel.getDisplayNameForProduct = function (product) {
            if (!product) return;
            if (product.isCustom) {
                return product.description;
            } else {
                if (product.brand_name) {
                    return product.brand_name + " " + product.name;
                } else {
                    return product.name;
                }
            }
        };

        viewModel.itemGoodClick = function (order_line) {
            order_line.reconciled = 'good';
        };

        viewModel.itemBadClick = function (order_line) {
            var hideSheet = $ionicActionSheet.show({
                buttons: [{ text: 'Something Wrong With Item' }, { text: 'Item Missing' }, { text: 'Wrong Item' }],
                titleText: 'Item Feedback',
                cancelText: 'Cancel',
                destructiveButtonClicked: function destructiveButtonClicked() {
                    itemMarkedAsMissing();
                    return true;
                },
                cancel: function cancel() {
                    // add cancel code..
                },
                buttonClicked: function buttonClicked(index) {
                    if (index == 0) {
                        somethingWrongWithItemGetFeedback(order_line, 'Something Wrong');
                    } else if (index == 1) {
                        somethingWrongWithItem(order_line, 'Item Missing');
                    } else if (index = 2) {
                        somethingWrongWithItem(order_line, 'Wrong Item');
                    }
                    return true;
                }
            });
        };

        viewModel.accessibilityFocus = function () {
            $('.order-modal-title').focus();
        };

        function somethingWrongWithItem(order_line, text) {
            UIUtil.showYesNoConfirm(text, 'Are you sure you want to submit this issue?').then(function (doIt) {
                if (doIt) {
                    saveOrderLineFeedback(order_line, text);
                }
            });
        }

        function somethingWrongWithItemGetFeedback(order_line, text) {
            TextNotesModalProvider.showModal($scope, text, "Let us know what is wrong with the item", "").then(function (reason) {
                saveOrderLineFeedback(order_line, text, reason);
            });
        }

        function saveOrderLineFeedback(order_line, text, reason) {
            UIUtil.showLoading('Saving Feedback...');
            UserOrderService.saveItemReconcileInfo(order_line, text, reason).then(function (response) {
                loadView();
                var message = response.display_message ? response.display_message : "Thank you for your feedback. We will review your feedback and get back to you as soon as we can.";
                UIUtil.showAlert('Feedback Saved', message);
            }, function (error) {
                UIUtil.hideLoading();
                UIUtil.showAlert('Count Not Save Feedback', 'Sorry, but we were not able to save the feedback at this time.');
            });
        }

        function itemMarkedAsMissing(order_line) {
            UIUtil.showAlert('Item Missing', 'Item has been marked as missing. We will be in contact with you for more details.');
        }

        viewModel.addEditNote = function (order_line) {
            $ionicModal.fromTemplateUrl('app/groceries/shop/cartProductNotes/cartProductNotes.html', {
                scope: $scope,
                focusFirstInput: true,
                animation: 'scale-in'
            }).then(function (modal) {
                viewModel.notePopoverItem = order_line;
                $scope.$broadcast('data.productNotes', viewModel.notePopoverItem.notes);
                viewModel.noteModal = modal;
                viewModel.noteModal.show();
            });
        };

        $scope.$on('close.productNotes', function (event, data) {
            if (viewModel.notePopoverItem) {
                viewModel.notePopoverItem.notes = data;
                updateCurrentOrder();
                viewModel.notePopoverItem = null;
                if (viewModel.noteModal) viewModel.noteModal.hide();
            }
        });

        $scope.$on('cancel.productNotes', function () {
            viewModel.notePopoverItem = null;
            if (viewModel.noteModal) viewModel.noteModal.hide();
        });

        viewModel.addOneToOrderLine = function (orderLine) {
            if (orderLine.requested_product.product_type == 'by weight') {
                orderLine.requested_qty = parseFloat(orderLine.requested_qty * 100 + orderLine.requested_product.unit_weight * 100) / 100;
            } else {
                orderLine.requested_qty++;
            }
            updateCurrentOrder();
        };

        viewModel.removeOneFromOrderLine = function (orderLine) {
            if (orderLine.requested_product.product_type == 'by weight') {
                orderLine.requested_qty = parseFloat(orderLine.requested_qty * 100 - orderLine.requested_product.unit_weight * 100) / 100;
            } else {
                orderLine.requested_qty--;
            }
            if (orderLine.requested_qty == 0) {
                viewModel.removeOrderLineCompletely(orderLine);
            }
            updateCurrentOrder();
        };

        viewModel.removeOrderLineCompletely = function (orderLine) {
            var index;
            index = viewModel.order.order_lines.indexOf(orderLine);
            if (index > -1) {
                viewModel.order.order_lines.splice(index, 1);
            }
            updateCurrentOrder();
        };

        $scope.addProduct = function (productToAdd) {
            $log.info('add item', productToAdd);
            ShoppingService.addProductToCart(productToAdd);
            $scope.refreshCartData();
        };

        $scope.removeCartItemForProductFromCartCompletely = function (cartItem) {
            ShoppingService.removeProductsCartItemFromCart(cartItem.product);
            $scope.refreshCartData();
        };

        viewModel.cancelOrderClick = function (order) {
            UIUtil.showYesNoConfirm("Cancel Order", "Are you sure you want to cancel this order?").then(function (confirmed) {
                if (confirmed) {
                    UIUtil.showLoading();
                    try {
                        AccountService.cancelOrder(order).success(function (data, status, headers, config) {
                            AppAnalytics.cancelOrder();
                            UIUtil.hideLoading();
                            $rootScope.$broadcast('order.saved.refresh');
                            UIUtil.showAlert('Canceled', 'Order has been canceled.');
                            viewModel.hasChanges = false;
                            viewModel.cancelOrderDetail();
                        }).error(function (data, status, headers, config) {
                            UIUtil.hideLoading();
                            showCancelOrderErrorMessage(data);
                        });
                    } catch (exception) {
                        UIUtil.hideLoading();
                    }
                }
            });
        };

        function showCancelOrderErrorMessage(error) {
            if (!error.errors) {
                UIUtil.showErrorAlert('Not able to cancel order \n\n' + JSON.stringify(error));
            }
            var message = 'Not able to cancel order. \n\n';
            var i;
            if (error.errors.base) {
                for (i = 0; i < error.errors.base.length; i++) {
                    message += '\n';
                    message += error.errors.base[i];
                }
            }
            UIUtil.showAlert('Cancel Order', message);
        }

        UIUtil.showLoading('Loading Order Info...');
        loadView();

        viewModel.getTipString = function () {
            if (viewModel.order.tip && viewModel.order.tip > 0) {
                return $filter('currency')(viewModel.order.tip);
            } else {
                return 'No Tip';
            }
        };

        viewModel.getOrderMessage = function () {
            return UserOrderService.getCheckoutScreenMessageForOrder(viewModel.order);
        };

        viewModel.tipClick = function () {
            if (!viewModel.order.tippable) {
                UIUtil.showAlert('Tipping Not Available', 'Oops! The 24 hour tip window has expired.');
                return;
            }
            TippingModalProvider.showModal($scope, viewModel.order).then(function (order) {
                viewModel.order = order;
            });
        };

        viewModel.showTipButton = function () {
            if (!FeatureService.showTipping()) {
                return false;
            } else {
                if ($scope.orderDetailFromRateOrder) {
                    return false;
                }
                return viewModel.order.status == "delivered" || viewModel.order.status == "processed";
            }
        };

        viewModel.customLabel = function (product, quantity) {
            var label = product.description_label;
            if (product.product_type == "by weight") {
                return quantity / product.unit_weight > 1 ? label[1] : label[0];
            } else {
                return quantity > 1 ? label[1] : label[0];
            };
        };

        viewModel.getQuantity = function (product, quantity) {
            if (product.has_custom_label && product.product_type == 'by weight') {
                return $filter('number')(parseInt(quantity * 100 / (product.unit_weight * 100)));
            } else {
                return parseFloat(quantity);
            }
        };

        viewModel.getPrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.has_custom_label) {
                    var price = '~' + $filter('currency')(product.price * product.unit_weight);
                    var label = product.description_label[0];
                } else {
                    var price = $filter('currency')(product.price);
                    var label = weightedLabel(product);
                }
                return price + ' / ' + label;
            } else {
                return $filter('currency')(product.price);
            }
        };

        function weightedLabel(product) {
            if (product.unit_of_measure == "lbs" || product.unit_of_measure == "Per lb") {
                return "lb";
            } else {
                return product.unit_of_measure;
            }
        }

        viewModel.getSalePrice = function (product) {
            if (product.product_type == 'by weight') {
                if (product.has_custom_label) {
                    var price = '~' + $filter('currency')(product.sale_price * product.unit_weight);
                    var label = product.description_label[0];
                } else {
                    var price = $filter('currency')(product.sale_price);
                    var label = weightedLabel(product);
                }
                return price + ' / ' + label;
            } else {
                return $filter('currency')(product.sale_price);
            }
        };

        viewModel.inCartCount = function (orderLine) {
            var product = orderLine.current_product;
            if (product.product_type == 'by weight') {
                var unit_weight = product.unit_weight;
                if (product.has_custom_label) {
                    var quantity = $filter('number')(parseFloat(orderLine.requested_qty) * 100 / (unit_weight * 100), 0);
                    var label = quantity > 1 ? product.description_label[1] : product.description_label[0];
                    return quantity + ' ' + label;
                } else {
                    return parseFloat(orderLine.requested_qty);
                }
            } else {
                return orderLine.requested_qty;
            }
        };
    }
})();
// orderItemsList
'use strict';

angular.module('shiptApp').directive('orderItemsList', ['$timeout', 'AccountService', 'AppAnalytics', '$rootScope', orderItemsList]);

function orderItemsList($timeout, AccountService, AppAnalytics, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            order: '=order',
            hasChanges: '=hasChanges',
            editAddressFunction: '&',
            chooseAddressFunction: '&',
            addAddressFunction: '&'
        },
        link: function link(scope, element, attrs) {

            function loadData() {
                try {
                    if (!scope.order.order_lines) {
                        AccountService.getOrder(scope.order.id).success(function (order) {
                            scope.order = order;
                        });
                    }
                } catch (e) {}
            }

            scope.addOneToOrderLine = function (order_line) {
                if (orderLine.requested_product.product_type == 'by weight') {
                    orderLine.requested_qty = parseFloat(orderLine.requested_qty) + .5;
                } else {
                    orderLine.requested_qty++;
                }
                updateCurrentOrder();
            };

            scope.removeOneFromOrderLine = function (order_line) {
                if (orderLine.requested_product.product_type == 'by weight') {
                    orderLine.requested_qty = parseFloat(orderLine.requested_qty) - .5;
                } else {
                    orderLine.requested_qty--;
                }
                if (orderLine.requested_qty == 0) {
                    viewModel.removeOrderLineCompletely(orderLine);
                }
                updateCurrentOrder();
            };

            scope.removeOrderLineCompletely = function (order_line) {
                var index;
                index = viewModel.order.order_lines.indexOf(orderLine);
                if (index > -1) {
                    viewModel.order.order_lines.splice(index, 1);
                }
                updateCurrentOrder();
            };

            scope.getDisplayProductForOrderLine = function (order_line) {
                order_line.current_product = order_line.actual_product ? order_line.actual_product : order_line.requested_product;
                return order_line.current_product;
            };

            scope.getDisplayNameForProduct = function (product) {
                if (!product) return;
                if (product.isCustom) {
                    return product.description;
                } else {
                    if (product.brand_name) {
                        return product.brand_name + " " + product.name;
                    } else {
                        return product.name;
                    }
                }
            };

            function updateCurrentOrder() {
                scope.hasChanges = true;
            }

            loadData();
        },
        templateUrl: "app/groceries/account/orders/orderItemsList/orderItemsList.html"
    };
}
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('createPaymentMethodModal', ['$rootScope', '$ionicModal', '$q', createPaymentMethodModal]);

    function createPaymentMethodModal($rootScope, $ionicModal, $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/payment/createPaymentMethodModal/createPaymentMethodModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up',
                focusFirstInput: true
            }).then(function (modal) {
                selectorModal = modal;
                defer.resolve(selectorModal);
            });
            return defer.promise;
        }

        var init = function init($scope) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            if (selectorModal) selectorModal.remove();
            selectorModal = null;
            getModal($scope).then(function (modal) {
                modal.show();
            });

            $scope.closeCardModal = function (newCard) {
                if (newCard) {
                    defer.resolve(newCard);
                } else {
                    defer.reject();
                }
                selectorModal.hide();
            };

            $scope.$on('$destroy', function () {
                if (selectorModal) selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showModal: init
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('createPaymentMethodModalController', ['$scope', '$timeout', '$rootScope', 'LogService', 'AccountService', 'UIUtil', '$log', 'ErrorHandler', 'AppAnalytics', createPaymentMethodModalController]);

    function createPaymentMethodModalController($scope, $timeout, $rootScope, LogService, AccountService, UIUtil, $log, ErrorHandler, AppAnalytics) {
        var vm = this;
        vm.card = null;

        vm.saveCard = function (card) {
            card = vm.card;
            UIUtil.showLoading('Saving Card...');
            $log.info('saveCard click', card);
            AccountService.saveNewCard(card).then(function (card) {
                AppAnalytics.addCard();
                $log.info('success');
                $rootScope.$broadcast('refresh.user-data');
                UIUtil.hideLoading();
                vm.saveCardModal();
            }, function (error) {
                LogService.error(error);
                $rootScope.$broadcast('refresh.user-data');
                ErrorHandler.displayStripeError(error, "Couldn't Save Card");
                UIUtil.hideLoading();
            });
        };

        vm.cancel = function () {
            $scope.closeCardModal();
        };

        vm.saveCardModal = function (window) {
            $timeout(function () {
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                $scope.closeCardModal(vm.card);
            }, 200);
        };

        function loadData() {}

        loadData();
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('selectPaymentMethod', ['$rootScope', '$ionicModal', '$q', selectPaymentMethod]);

    function selectPaymentMethod($rootScope, $ionicModal, $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/payment/selectPaymentMethodModal/selectPaymentMethodModal.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                selectorModal = modal;
                defer.resolve(selectorModal);
            });
            return defer.promise;
        }

        var init = function init($scope, sources, selectedSource) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.sources = sources;
            $scope.selectedSource = selectedSource;
            if (selectorModal) selectorModal.remove();
            selectorModal = null;
            getModal($scope).then(function (modal) {
                modal.show();
            });

            $scope.closeModal = function (selectedSource) {
                defer.resolve(selectedSource);
                selectorModal.hide();
            };

            $scope.$on('$destroy', function () {
                if (selectorModal) selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showModal: init
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('selectedPaymentMethodModalController', ['$scope', '$timeout', selectedPaymentMethodModalController]);

    function selectedPaymentMethodModalController($scope, $timeout) {
        var vm = this;

        vm.cancel = function () {
            $scope.closeModal();
        };

        vm.saveSelection = function () {
            $scope.closeModal(vm.selectedSource);
        };

        vm.clickSource = function (window) {
            $timeout(function () {
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                vm.saveSelection();
            }, 200);
        };

        function loadData() {
            vm.selectedSource = $scope.selectedSource;
            vm.sources = $scope.sources;
        }

        loadData();
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('choosePlan', ['$rootScope', '$ionicModal', '$q', choosePlan]);

    function choosePlan($rootScope, $ionicModal, $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/account/plan/choosePlan/choosePlan.html';
            $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                defer.resolve(modal);
            });
            return defer.promise;
        }

        var init = function init($scope, plans, selectedPlan) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.plans = plans;
            $scope.selectedPlan = selectedPlan;
            if (selectorModal) selectorModal.remove();
            selectorModal = null;
            getModal($scope).then(function (modal) {
                selectorModal = modal;
                modal.show();
            });

            $scope.closeModal = function (selectedPlan) {
                if (selectedPlan) {
                    defer.resolve(selectedPlan);
                } else {
                    defer.reject();
                }
                selectorModal.hide();
            };

            $scope.$on('$destroy', function () {
                if (selectorModal) selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showModal: init
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('choosePlanController', ['$scope', '$timeout', 'UIUtil', 'Subscription', 'createPaymentMethodModal', 'AccountService', 'AppAnalytics', choosePlanController]);

    function choosePlanController($scope, $timeout, UIUtil, Subscription, createPaymentMethodModal, AccountService, AppAnalytics) {
        var vm = this;

        vm.cancel = function () {
            $scope.closeModal();
        };

        vm.selectedPlanInPlans = true;

        vm.saveSelection = function () {
            $scope.closeModal(vm.selectedPlan);
        };

        vm.clickSource = function (window) {
            $timeout(function () {
                if (vm.cards.length == 0) {
                    //needs to add a card first
                    AppAnalytics.track('choosePlanClickPlan', { customerHasCardAlready: false, selectedPlan: vm.selectedPlan });
                    createPaymentMethodModal.showModal($scope).then(function (newCard) {
                        vm.saveSelection();
                    }, function (error) {
                        AppAnalytics.track('canceledPaymentModalAfterChoosePlanClick');
                        //canceled the payment modal
                    });
                } else {
                        AppAnalytics.track('choosePlanClickPlan', { customerHasCardAlready: true, selectedPlan: vm.selectedPlan });
                        vm.saveSelection();
                    }
            }, 200);
        };

        vm.planPrice = function (plan) {
            var amount = plan.amount / 100;
            return amount;
        };

        vm.addPayment = function () {
            createPaymentMethodModal.showModal($scope);
        };

        function loadData() {
            loadPaymentMethods();
            vm.plans = $scope.plans;
            vm.selectedPlan = $scope.selectedPlan;
            selectPlan();
            if (!vm.plans) {
                Subscription.list().then(function (data) {
                    vm.plans = data;
                    selectPlan();
                });
            }
        }

        function loadPaymentMethods() {
            AccountService.getCardsFromServer().then(function (data) {
                var customerInfo = data;
                vm.cards = customerInfo.credit_cards;
            }, function (error) {
                $log.info('load cards error', error);
            });
        }

        function selectPlan() {
            if (vm.selectedPlan && vm.plans) {
                var planMatch = vm.plans.find(function (x) {
                    return x.id == vm.selectedPlan.id;
                });
                if (planMatch) {
                    vm.selectedPlanInPlans = true;
                    vm.selectedPlan = planMatch;
                } else {
                    vm.selectedPlanInPlans = false;
                }
            }
        }

        loadData();
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('DeliveryWindowSelectorController', ['$scope', '$timeout', DeliveryWindowSelectorController]);

    function DeliveryWindowSelectorController($scope, $timeout) {
        var viewModel = this;

        viewModel.cancel = function () {
            $scope.closeModal(viewModel.selectedWindow);
        };

        viewModel.disableSaveButton = function () {
            return viewModel.selectedWindow == null;
        };

        viewModel.windowAvailable = function (window) {
            if (window.available === undefined) {
                return true;
            } else {
                return window.available;
            }
        };

        viewModel.saveSelection = function () {
            $scope.closeModal(viewModel.selectedWindow);
        };

        $scope.$on('refresh.delivery.window.selector', function () {
            loadData();
        });

        viewModel.clickWindow = function (window) {
            $timeout(function () {
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                viewModel.saveSelection();
            }, 200);
        };

        $scope.$watch('viewModel.selectedWindow', function (oldValue, newValue) {});

        function loadData() {
            viewModel.selectedWindow = $scope.selectedWindow;
            viewModel.deliveryWindows = $scope.deliveryWindows;
            if (viewModel.selectedWindow) {
                var index = viewModel.deliveryWindows.map(function (el) {
                    return el.time_slot_id;
                }).indexOf(viewModel.selectedWindow.time_slot_id);
                if (index > -1) {
                    viewModel.selectedWindow = viewModel.deliveryWindows[index];
                }
            }
            console.log('loadData');
        }
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('DeliveryWindowSelectorProvider', ['$rootScope', '$ionicModal', '$q', DeliveryWindowSelectorProvider]);

    function DeliveryWindowSelectorProvider($rootScope, $ionicModal, $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            if (selectorModal) {
                defer.resolve(selectorModal);
            } else {
                var tpl = 'app/groceries/shop/checkOut/deliveryWindow/deliveryWindowSelector.html';
                $ionicModal.fromTemplateUrl(tpl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    selectorModal = modal;
                    defer.resolve(selectorModal);
                });
            }
            return defer.promise;
        }

        var init = function init($scope, deliveryWindows, selectedWindow) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.deliveryWindows = deliveryWindows;
            $scope.selectedWindow = selectedWindow;
            if (selectorModal) selectorModal.remove();
            selectorModal = null;
            getModal($scope).then(function (modal) {
                $scope.$broadcast('refresh.delivery.window.selector');
                modal.show();
            });

            $scope.closeModal = function (selectedWindow) {
                defer.resolve(selectedWindow);
                selectorModal.hide();
            };

            $scope.$on('$destroy', function () {
                if (selectorModal) selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showSelectDeliveryWindowModal: init
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('SubstitutionOptionsModalController', ['$scope', '$timeout', SubstitutionOptionsModalController]);

    function SubstitutionOptionsModalController($scope, $timeout) {
        var viewModel = this;

        viewModel.cancel = function () {
            $scope.closeModal(viewModel.selectedOption);
        };

        viewModel.disableSaveButton = function () {
            return viewModel.selectedOption == null;
        };

        viewModel.windowAvailable = function (window) {
            if (window.available === undefined) {
                return true;
            } else {
                return window.available;
            }
        };

        viewModel.saveSelection = function () {
            $scope.closeModal(viewModel.selectedOption);
        };

        $scope.$on('refresh.substitution.options.selector', function () {
            loadData();
        });

        viewModel.clickOption = function (option) {
            $timeout(function () {
                //gives it a little little delay for the user to see the selection
                //take place. its real nice.
                viewModel.saveSelection();
            }, 200);
        };

        function loadData() {
            viewModel.selectedOption = $scope.selectedOption;
            viewModel.options = $scope.options;
            if (viewModel.selectedOption) {
                var index = viewModel.options.map(function (el) {
                    return el.text;
                }).indexOf(viewModel.selectedOption.text);
                if (index > -1) {
                    viewModel.selectedOption = viewModel.options[index];
                }
            }
        }
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('SubstitutionOptionsModalProvider', ['$rootScope', '$ionicModal', '$q', SubstitutionOptionsModalProvider]);

    function SubstitutionOptionsModalProvider($rootScope, $ionicModal, $q) {

        var selectorModal = null;

        function getModal($scope) {
            var defer = $q.defer();

            if (selectorModal) {
                defer.resolve(selectorModal);
            } else {
                var tpl = 'app/groceries/shop/checkOut/substitutionOptions/substitutionOptionsModal.html';
                $ionicModal.fromTemplateUrl(tpl, {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function (modal) {
                    selectorModal = modal;
                    defer.resolve(selectorModal);
                });
            }
            return defer.promise;
        }

        var init = function init($scope, options, selectedOption) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.selectedOption = selectedOption;
            $scope.options = options;
            if (selectorModal) selectorModal.remove();
            selectorModal = null;
            getModal($scope).then(function (modal) {
                $scope.$broadcast('refresh.substitution.options.selector');
                modal.show();
            });

            $scope.closeModal = function (selectedOption) {
                defer.resolve(selectedOption);
                selectorModal.hide();
            };

            $scope.$on('$destroy', function () {
                if (selectorModal) selectorModal.remove();
                selectorModal = null;
            });

            return defer.promise;
        };

        return {
            showSubstitutionOptionsModal: init
        };
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('mealKitDetailController', ['$scope', '$ionicModal', '$state', '$stateParams', 'ShoppingService', '$log', 'UIUtil', '$timeout', '$cordovaKeyboard', 'LogService', '$ionicSlideBoxDelegate', 'AccountService', 'MealKits', '$filter', mealKitDetailController]);

    function mealKitDetailController($scope, $ionicModal, $state, $stateParams, ShoppingService, $log, UIUtil, $timeout, $cordovaKeyboard, LogService, $ionicSlideBoxDelegate, AccountService, MealKits, $filter) {

        var vm = this;

        var displayServingIndex = 0;
        vm.cartMealKit = null;

        vm.goToCart = function () {
            $state.go('app.shoppingCart');
        };

        vm.guest_account = function () {
            return AccountService.isCustomerGuest();
        };

        vm.cartCount = function () {
            return ShoppingService.getCartItemCount();
        };

        vm.clickBuyMealKitButton = function () {
            vm.cartMealKit = vm.mealKit;
            vm.cartMealKit.serving = vm.displayServingGet();
        };

        vm.buyButtonText = function () {
            //if in cart and selected serving is the same as what is in cart
            if (vm.cartMealKit && vm.displayServingGet() == vm.cartMealKit.serving) {
                return "In Cart";
            }
            //if in cart but serving is different
            if (vm.cartMealKit && vm.displayServingGet() != vm.cartMealKit.serving) {
                return "Update Quantity";
            }
            //else if nothign is in the cart
            return "Add to Cart";
        };

        vm.buyServingButtonText = function (serving) {
            //if in cart and selected serving is the same as what is in cart
            if (vm.cartMealKit && vm.cartMealKit.serving == serving) {
                return "In Cart";
            }
            //if in cart but serving is different
            if (vm.cartMealKit && vm.cartMealKit.serving != serving) {
                return "Update Quantity";
            }
            //else if nothign is in the cart
            return "Add to Cart";
        };

        vm.displayMinus = function () {
            if (displayServingIndex > 0) {
                return true;
            } else if (displayServingIndex == vm.mealKit.servings.length) {
                return false;
            }
        };

        vm.buyServingButton = function (serving) {
            if (vm.cartMealKit && vm.cartMealKit.serving == serving) {
                vm.cartMealKit = null;
            } else {
                vm.cartMealKit = vm.mealKit;
                vm.cartMealKit.serving = serving;
                MealKits.addMealKitToCart(vm.cartMealKit);
            }
        };

        vm.displayPlus = function () {
            return vm.mealKit.servings.length > displayServingIndex + 1;
        };

        vm.minusMealKit = function () {
            displayServingIndex--;
        };

        vm.plusMealKit = function () {
            displayServingIndex++;
        };

        vm.displayServingGet = function () {
            console.log('meal kit', vm.mealKit);
            return vm.mealKit.servings[displayServingIndex];
        };

        vm.loadData = function () {
            var mealKit = angular.fromJson($stateParams.mealKit);
            vm.mealKit = mealKit;

            if (vm.cartMealKit) {} else {
                displayServingIndex = 0;
            }
        };

        vm.loadData();
    }
})();
/**
 * Created by Shipt
 */

'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('recipesController', ['$scope', '$ionicModal', '$state', '$stateParams', 'ShoppingService', '$log', 'UIUtil', '$timeout', '$cordovaKeyboard', 'LogService', '$ionicSlideBoxDelegate', 'AccountService', 'MealKits', '$filter', recipesController]);

    function recipesController($scope, $ionicModal, $state, $stateParams, ShoppingService, $log, UIUtil, $timeout, $cordovaKeyboard, LogService, $ionicSlideBoxDelegate, AccountService, MealKits, $filter) {

        var viewModel = this;

        $scope.goToCart = function () {
            $state.go('app.shoppingCart');
        };

        viewModel.loadData = function () {
            var mealKit = angular.fromJson($stateParams.mealKit);
            viewModel.mealKit = mealKit;
        };

        viewModel.clickBuyMealKitButton = function () {
            $log.info('clickBuyMealKitButton');
            viewModel.mealKit.inCart = true;
        };

        viewModel.subMealKit = function () {
            viewModel.mealKit.inCart = false;
        };

        viewModel.loadData();
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').controller('shopCategoriesController', shopCategoriesController);

    shopCategoriesController.$inject = ['$scope', '$state', 'ShoppingService'];

    function shopCategoriesController($scope, $state, ShoppingService) {
        var vm = this;

        activate();

        function activate() {
            vm.categories = $scope.categories;
            if (!vm.categories) {
                ShoppingService.getCategories().then(function (cats) {
                    vm.categories = cats;
                });
            }
        };

        vm.yourRecentItemsClick = function () {
            $state.go('app.recentProducts');
            $scope.closePopover();
        };

        vm.categoryClick = function (category) {
            $state.go('app.products', { category: angular.toJson(category) });
            $scope.closePopover();
        };

        vm.closeClick = function () {
            $scope.closePopover();
        };

        vm.saleCategoryClick = function () {
            try {
                var saleCat = vm.categories.find(function (x) {
                    return x.name == 'On Sale';
                });
                vm.categoryClick(saleCat);
            } catch (e) {
                LogService.error(e);
            }
        };
    }
})();
'use strict';

(function () {
    'use strict';

    angular.module('shiptApp').factory('shopCategoriesProvider', shopCategoriesProvider);

    shopCategoriesProvider.$inject = ['$rootScope', '$ionicPopover', '$q'];

    /* @ngInject */
    function shopCategoriesProvider($rootScope, $ionicPopover, $q) {

        var popover = null;
        function getPopover($scope) {
            var defer = $q.defer();
            var tpl = 'app/groceries/shop/webMenus/shopCategories/shopCategories.html';
            $ionicPopover.fromTemplateUrl(tpl, {
                scope: $scope
            }).then(function (_popover) {
                defer.resolve(_popover);
            });
            return defer.promise;
        }

        var init = function init($scope, $event, categories) {
            var defer = $q.defer();
            $scope = $scope || $rootScope.$new();
            $scope.categories = categories;
            getPopover($scope).then(function (_popover) {
                popover = _popover;
                popover.show($event);
                $('.category-heading').focus();
            });
            $scope.closePopover = function () {
                defer.reject();
                popover.hide();
                popover = null;
            };

            return defer.promise;
        };

        var service = {
            show: init
        };

        return service;
    }
})();