(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var scrollspy = require('../')

var colors = 'lightseagreen forestgreen goldenrod dodgerblue darkorchid crimson'.split(' ')

$(init)

function init() {
	$('p').each(function() {
		var me = this
		var $me = $(me)
		scrollspy.add(me, {
			scrollIn: function() {
				$me.addClass('show').css('background', colors[~~(Math.random() * colors.length)])
			},
			scrollOut: function() {
				$me.removeClass('show').css('background', null)
			},
			once: -1 != $me.text().indexOf('once')
		})
	})
}

},{"../":2}],2:[function(require,module,exports){
(function (global){
var name = 'scrollspy'

var _ = require('min-util')
var cooled = require('cooled')
var debug = require('min-debug')(name)
var Reopt = require('reopt')

var is = _.is
var optName = name + '-option'
var arr = [] // all elements to spy scroll
var hasInited = false

$(function() {
	// auto init
	exports.init()
})

exports.name = name
exports.arr = arr
exports.absent = {
	  scrollIn: _.noop
	, scrollOut: _.noop
	, isInView: false
	, once: false // scroll in and remove event
}
exports.interval = 300

exports.init = function() {
	if (hasInited) return

	debug('init')
	hasInited = true

	var check =	cooled(function(ev) {
		exports.check(ev)
	}, exports.interval)

	var evName = _.map('scroll resize'.split(' '), function(val) {
		return [val, name].join('.')
	}).join(' ')

	$(global).on(evName, function(ev) {
		// add interval limit
		check(ev)
	})
}

exports.check = function(ev) {
	debug('scroll check', ev.type)
	_.each(_.slice(arr), function(el) {
		check(el, ev)
	})
}

// el, opt
// el, scrollin, scrollout, opt
// el, className, opt
var addReopt = new Reopt({
	  el: 'element'
	, scrollIn: 'function'
	, scrollOut: 'function'
	, opt: 'object undefined'
	, className: 'string'
}, [
	  'el opt'
	, 'el scrollIn scrollOut opt'
	, 'el className opt'
])

exports.add = function() {
	var args = arguments
	var opt = addReopt.get(args)
	if (!opt) return debug('unknown args', args)
	opt = _.extend({}, exports.absent, opt, opt.opt)
	var el = opt.el
	opt = _.only(opt, 'scrollIn scrollOut className once')
	$(el).data(optName, opt)
	arr.push(el)
	check(el)
}

exports.add2 = function(el, opt) {
	opt = _.extend({}, exports.absent, opt)
	$(el).data(optName, opt)
	arr.push(el)
	check(el)
}

exports.isInView = isInView

function isInView(el, winOffset) {
	var $el = $(el)
	if (!$el.is(':visible')) return false
	
	var offset = getOffset(el)
	winOffset = winOffset || getOffset(global)
	
	var isVerticalIn = offset.top + offset.height >= winOffset.top && offset.top <= winOffset.top + winOffset.height
	var isHorizonalIn = offset.left + offset.width >= winOffset.left && offset.left <= winOffset.left + winOffset.width
	if (isVerticalIn && isHorizonalIn) return true
	return false
}

global.isInView = isInView // test

function getOffset(el) {
	var $el = $(el)
	var offset
	if ($.isWindow(el)) {
		// window use scroll
		offset = {
			top: $el.scrollTop(),
			left: $el.scrollLeft()
		}
	} else {
		offset = $el.offset()
	}
	return _.extend(offset, {
		height: $el.innerHeight(),
		width: $el.innerWidth()
	})
}

function check(el, ev) {
	ev = ev || $.Event('scrollspy-init')
	var $el = $(el)
	var opt = $el.data(optName)
	if (!opt) {
		return debug('no opt', el)
	}
	var isInView = exports.isInView(el)
	if (opt.isInView == isInView) return // no change, do nothing

	debug('is inview', isInView, el)
	opt.isInView = isInView
	var cname = opt.className
	if (isInView) {
		// scrollIn
		if (cname) {
			$el.addClass(cname)
		} else {
			opt.scrollIn.call(el, ev)
		}
		if (opt.once) {
			// scroll in once
			arr.splice(arr.indexOf(el), 1)
		}
	} else {
		// scroll out
		if (cname) {
			$el.removeClass(cname)
		} else {
			opt.scrollOut.call(el, ev)
		}
	}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"cooled":3,"min-debug":4,"min-util":5,"reopt":7}],3:[function(require,module,exports){
module.exports = cooled

function cooled(fn, minInterval) {
	var prev = 0
	var hasDelay = false

	return function() {
		if (hasDelay) return

		var now = +new Date
		var next = prev + minInterval
		var ctx = this
		var args = arguments

		if (now > next) {
			return run(ctx, args)
		}

		// delay
		hasDelay = true
		setTimeout(function() {
			run(ctx, args)
		}, next - now)
	}


	function run(ctx, args) {
		fn.apply(ctx, args)
		// reset time after run
		prev = +new Date
		hasDelay = false
	}
}

},{}],4:[function(require,module,exports){
(function (global){
module.exports = exports = Debug

var colors = 'lightseagreen forestgreen goldenrod dodgerblue darkorchid crimson'.split(' ')
var colorIndex = 0
var prev
var inherit = 'color:inherit'
var console = global.console
var doc = global.document
var names = []
var skips = []

init()

exports.prefix = ''

exports.log = function(namespace, args, color) {
	var curr = +new Date
	var ms = curr - (prev || curr)
	prev = curr

	var label = exports.prefix + namespace
	var main = '%c' + label + '%c'
	var arr = [null, color, inherit]
	for (var i = 0; i < args.length; i++) {
		arr.push(args[i])
		main += ' %o'
	}
	arr.push(color)
	main += '%c +' + ms + 'ms'
	arr[0] = main
	console.debug.apply(console, arr)
}

exports.init = init

function Debug(namespace) {
	var color = 'color:' + getColor()
	return enabled(namespace) ? function() {
		exports.log(namespace, arguments, color)
	} : noop
}

function init(key) {
	key = key || 'debug'
	var reg = new RegExp(key + '=(\\S+)')
	var res = reg.exec(location.href)
	if (res) {
		enable(res[1])
		var elem = doc.createElement('textarea')
		elem.style.cssText = 'width:100%;height:300px;overflow:auto;line-height:1.4;background:#333;color:#fff;font:16px Consolas;border:none'
		var box = doc.body || doc.documentElement
		box.insertBefore(elem, box.firstChild)
		exports.log = function(namespace, arr, color) {
			var ret = ['[' + namespace + ']']
			var len = arr.length
			for (var i = 0; i < len; i++) {
				var val = arr[i]
				try {
					val = JSON.stringify(val, 0, 4)
				} catch (e) {
					val += ''
				}
				ret.push(val)
			}
			elem.value += ret.join(' ') + '\n'
			elem.scrollTop = elem.scrollHeight
		}

	} else if (global.localStorage && console) {
		try {
			enable(localStorage[key])
		} catch (ignore) {}
	}
}

function noop() {}

function enable(namespaces) {
	if (!namespaces) return
	skips = []
	names = []
	var split = namespaces.split(/[\s,]+/)
	for (var i = 0; i < split.length; i++) {
		if (!split[i]) continue
		namespaces = split[i].replace(/\*/g, '.*?')
		if ('-' == namespaces[0])
			skips.push(new RegExp('^' + namespaces.substr(1) + '$'))
		else
			names.push(new RegExp('^' + namespaces + '$'))
	}
}

function enabled(name) {
	var i = 0, reg
	for (i = 0; reg = skips[i++];) {
		if (reg.test(name)) return false
	}
	for (i = 0; reg = names[i++];) {
		if (reg.test(name)) return true
	}
}

function getColor() {
	return colors[colorIndex++ % colors.length]
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
var is = require('min-is')

var _ = exports

_.is = is

function extend(dst) {
	var len = arguments.length
	if (dst && len > 1) {
		for (var i = 1; i < len; i++) {
			var hash = arguments[i]
			if (hash) {
				for (var key in hash) {
					if (is.owns(hash, key)) {
						var val = hash[key]
						if (is.undef(val) || val === dst[key] || val === dst) continue
						dst[key] = val
					}
				}
			}
		}
	}
	return dst
}

_.noop = function() {}

_.now = function() {
	return +new Date
}

_.keys = function(hash) {
	var ret = []
	if (hash) {
		for (var key in hash) {
			if (is.owns(hash, key)) {
				ret.push(key)
			}
		}
	}
	return ret
}

_.extend = extend

function identity(val) {
	return val
}

_.identity = identity

var stopKey = 'stopOnFalse'

function each(arr, fn, custom) {
	if (!is.fn(fn)) fn = identity
	if (!is.arraylike(arr)) arr = []

	var len = arr.length
	var opt = extend({}, custom)

	if (custom) {
		var ints = ['from', 'end', 'step']
		for (var i = 0; i < ints.length; i++) {
			var val = +opt[ints[i]]
			if (!is.int(val)) val = undefined
			opt[ints[i]] = val
		}
	}

	var from = opt.from || 0
	var end = opt.end || len
	var step = opt.step || 1

	if (custom) {
		if (from < 0) from = 0
		if (end > len) end = len
		if (from + step * Infinity <= end) return arr // cannot finish
	}

	for (var i = from; i < end; i += step) {
		var ret
		if (opt.context) {
			ret = fn.call(opt.context, arr[i], i, arr)
		} else {
			ret = fn(arr[i], i, arr)
		}
		// default is stop on false
		if (false !== opt[stopKey] && false === ret) break
	}

	return arr
}

_.each = each

_.map = function(arr, fn) {
	var ret = []
	each(arr, function(item, i, arr) {
		ret[i] = fn(item, i, arr)
	})
	return ret
}

_.filter = function(arr, fn) {
	var ret = []
	each(arr, function(item, i, arr) {
		var val = fn(item, i, arr)
		if (val) ret.push(item)
	})
	return ret
}

_.some = function(arr, fn) {
	var ret = false
	each(arr, function(item, i, arr) {
		if (fn(item, i, arr)) {
			ret = true
			return false
		}
	})
	return ret
}

_.every = function(arr, fn) {
	var ret = true
	each(arr, function(item, i, arr) {
		if (!fn(item, i, arr)) {
			ret = false
			return false
		}
	})
	return ret
}

_.find = function(arr, fn) {
	var ret
	each(arr, function(item, i, arr) {
		if (fn(item, i, arr)) {
			ret = item
			return false
		}
	})
	return ret
}

_.without = function(arr) {
	var other = _.slice(arguments, 1)
	return _.difference(arr, other)
}

_.difference = function(arr, other) {
	var ret = []
	_.each(arr, function(val) {
		if (!_.has(other, val)) {
			ret.push(val)
		}
	})
	return ret
}	

_.asyncMap = function(arr, fn, cb) {
	var ret = []
	var count = 0
	var hasDone, hasStart

	each(arr, function(arg, i) {
		hasStart = true
		fn(arg, function(err, val) {
			if (hasDone) return
			count++
			if (err) {
				hasDone = true
				return cb(err)
			}
			ret[i] = val
			if (count == arr.length) {
				hasDone = true
				cb(null, ret)
			}
		})
	})

	if (!hasStart) cb(null) // empty
}

function slice(arr, from, end) {
	var ret = []
	each(arr, function(item) {
		ret.push(item)
	}, {
		  from: from
		, end: end
	})
	return ret
}

_.slice = slice

function indexOf(val, sub) {
	if (is.str(val)) return val.indexOf(sub)
	var ret = -1
	each(val, function(item, i) {
		if (item == sub) {
			ret = i
			return false
		}
	})
	return ret
}

_.indexOf = indexOf

function has(val, sub) {
	return -1 != indexOf(val, sub)
}

_.has = has

_.uniq = function(arr) {
	var ret = []
	each(arr, function(item) {
		if (!has(ret, item)) ret.push(item)
	})
	return ret
}

function reduce(arr, fn, prev) {
	each(arr, function(item, i) {
		prev = fn(prev, item, i, arr)
	})
	return prev
}

_.reduce = reduce

_.only = function(obj, keys) {
	obj = obj || {}
	if (is.str(keys)) keys = keys.split(/ +/)
	return reduce(keys, function(ret, key) {
		if (null != obj[key]) ret[key] = obj[key]
		return ret
	}, {})
}

var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

_.trim = function(str) {
	if (null == str) return ''
	return ('' + str).replace(rtrim, '')
}

_.tostr = tostr

function tostr(str) {
	if (str || 0 == str) return str + ''
	return ''
}

_.capitalize = function(str) {
	str = tostr(str)
	return str.charAt(0).toUpperCase() + str.substr(1)
}

_.decapitalize = function(str) {
	str = tostr(str)
	return str.charAt(0).toLowerCase() + str.substr(1)
}

_.camelCase = function(str) {
	str = tostr(str)
	var arr = str.split(/[^\w]|_+/)
	arr = _.map(arr, function(val) {
		return _.capitalize(val)
	})
	return _.decapitalize(arr.join(''))
}

_.flatten = function(arrs) {
	var ret = []
	each(arrs, function(arr) {
		if (is.arraylike(arr)) {
			each(arr, function(item) {
				ret.push(item)
			})
		} else ret.push(arr)
	})
	return ret
}

_.union = function() {
	return _.uniq(_.flatten(arguments))
}

_.bind = function(fn, ctx) {
	if (is.str(ctx)) {
		var obj = fn
		fn = obj[ctx]
		ctx = obj
	}
	if (!is.fn(fn)) return fn
	var args = slice(arguments, 2)
	ctx = ctx || this
	return function() {
		return fn.apply(ctx, _.flatten([args, arguments]))
	}
}

_.create = (function() {
	function Object() {} // so it seems like Object.create
	return function(proto, property) {
		// not same as Object.create, Object.create(proto, propertyDescription)
		if ('object' != typeof proto) {
			// null is ok
			proto = null
		}
		Object.prototype = proto
		return _.extend(new Object, property)
	}
})()

_.inherits = function(ctor, superCtor) {
	ctor.super_ = superCtor
	ctor.prototype = _.create(superCtor.prototype, {
		constructor: ctor
	})
}

},{"min-is":6}],6:[function(require,module,exports){
(function (global){
var is = exports

var obj = Object.prototype

is.browser = (function() {
	return global.window == global
})()

// simple modern browser detect
is.h5 = (function() {
	if (is.browser && navigator.geolocation) {
		return true
	}
	return false
})()

function _class(val) {
	var name = obj.toString.call(val)
	// [object Class]
	return name.substring(8, name.length - 1).toLowerCase()
}

function _type(val) {
	// undefined object boolean number string symbol function
	return typeof val
}

function owns(owner, key) {
	return obj.hasOwnProperty.call(owner, key)
}

is._class = _class

is._type = _type

is.owns = owns

// not a number
is.nan = function(val) {
	return !is.num(val)
}

is.infinite = function(val) {
	return val == Infinity || val == -Infinity
}

is.num = is.number = function(num) {
	return !isNaN(num) && 'number' == _class(num)
}

// int or decimal
is.iod = function(val) {
	if (is.num(val) && !is.infinite(val)) {
		return true
	}
	return false
}

is.decimal = function(val) {
	if (is.iod(val)) {
		return 0 != val % 1
	}
	return false
}

is.int = function(val) {
	if (is.iod(val)) {
		return 0 == val % 1
	}
	return false
}

// object or function
is.oof = function(val) {
	if (val) {
		var tp = _type(val)
		return 'object' == tp || 'function' == tp
	}
	return false
}

// regexp should return object
is.obj = is.object = function(obj) {
	return is.oof(obj) && 'function' != _class(obj)
}

is.hash = is.plainObject = function(hash) {
	if (hash) {
		if ('object' == _class(hash)) {
			// old window is object
			if (hash.nodeType || hash.setInterval) {
				return false
			}
			return true
		}
	}
	return false
}

is.undef = function(val) {
	return 'undefined' == _type(val)
}

// host function should return function, e.g. alert
is.fn = function(fn) {
	return 'function' == _class(fn)
}

is.str = is.string = function(str) {
	return 'string' == _class(str)
}

// number or string
is.nos = function(val) {
	return is.iod(val) || is.str(val)
}

is.array = function(arr) {
	return 'array' == _class(arr)
}

is.arraylike = function(arr) {
	// window has length for iframe too, but it is not arraylike
	if (!is.window(arr) && is.obj(arr)) {
		if (owns(arr, 'length')) {
			var len = arr.length
			if (is.int(len) && len >= 0) {
				return true
			}
		}
	}
	return false
}

is.window = function(val) {
	if (val && val.window == val) {
		return true
	}
	return false
}

is.empty = function(val) {
	if (is.str(val) || is.arraylike(val)) {
		return 0 === val.length
	}
	if (is.hash(val)) {
		for (var key in val) {
			if (owns(val, key)) {
				return false
			}
		}
	}
	return true
}

is.element = function(elem) {
	if (elem && 1 === elem.nodeType) {
		return true
	}
	return false
}

is.regexp = function(val) {
	return 'regexp' == _class(val)
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
var _ = require('min-util')

var is = _.is

module.exports = Reopt

function Reopt(typeDefine, overloads) {
	this.typeDefine = getTypeDefine(typeDefine)
	this.overloads = getOverloads(overloads)
}

var proto = Reopt.prototype

proto.isOverload = function(args, overload) {
	var me = this
	return _.every(overload, function(item, i) {
		var types = me.typeDefine[item]
		return matchTypes(args[i], types)
	})
}

proto.match = function(args) {
	var me = this
	return _.find(me.overloads, function(overload) {
		return me.isOverload(args, overload) 	
	})
}

proto.get = function(args) {
	var overload = this.match(args)
	if (overload) {
	 	return _.reduce(overload, function(ret, key, i) {
	 		ret[key] = args[i]
	 		return ret
	 	}, {})
	}
}

Reopt.types = {
	'*': function() {
		return true
	},
	'element': function(val) {
		return is.element(val)
	},
	'array': function(val) {
		return is.arr(val)
	}
}

function matchTypes(val, types) {
	return _.some(types, function(type) {
		var fn = Reopt.types[type]
		if (fn) return fn(val)
		return is._type(val) == type
	})
}

function getTypeDefine(typeDefine) {
	var ret = _.extend({}, typeDefine)
	return _.reduce(_.keys(ret), function(ret, key) {
		ret[key] = makeArray(ret[key])
		return ret
	}, ret)
}

function getOverloads(overloads) {
	return _.filter(_.map(overloads, function(overload) {
		return makeArray(overload)
	}), function(arr) {
		return !is.empty(arr)
	}).sort(function(arr1, arr2) {
		// can be ambiguities, so who long match first
		return arr2.length - arr1.length
	})
}

function makeArray(arr, sep) {
	if (is.array(arr)) return arr
	sep = sep || ' '
	if (is.str(arr)) return arr.split(sep)
	return []
}

},{"min-util":5}]},{},[1]);
