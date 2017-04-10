/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var scrollspy = __webpack_require__(1)

	global.scrollspy = scrollspy

	var colors = 'lightseagreen forestgreen goldenrod dodgerblue darkorchid crimson'.split(' ')

	$(init)

	function init() {
		$('p').each(function() {
			var me = this
			var $me = $(me)
			if ($me.hasClass('once')) {
				scrollspy.add(me, function() {
					$me.addClass('show').css('background', colors[~~(Math.random() * colors.length)])
				})
			} else {
				scrollspy.add(me, {
					scrollIn: function() {
						$me.addClass('show').css('background', colors[~~(Math.random() * colors.length)])
					},
					scrollOut: function() {
						$me.removeClass('show').css('background', null)
					}
				})
			}
		})

		scrollspy.add('.top, .right', function() {
			$(this).addClass('expand')
		}, function() {
			$(this).removeClass('expand')
		})
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var name = 'scrollspy'

	// need in jQuery env
	var _ = __webpack_require__(2)
	var debug = __webpack_require__(13).getLogger(name).getLevelFunction()
	var Reopt = __webpack_require__(17)

	var is = _.is
	var optName = name + '-option'
	var arr = [] // all elements to spy scroll
	var hasInited = false
	var $ = global.$

	exports.name = name
	exports.arr = arr
	exports.absent = {
		  scrollIn: _.noop
		, isInView: false
	}
	exports.interval = 300

	exports.set$ = function(val) {
		$ = val
	}

	exports.init = function() {
		if (hasInited) return

		debug('init')
		hasInited = true

		var check = _.throttle(function(ev) {
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

	var addReopt = new Reopt({
		  el: '*'
		, scrollIn: 'function'
		, scrollOut: 'function'
		, opt: 'object undefined'
		, className: 'string'
	}, [
		  'el opt'
		, 'el scrollIn scrollOut opt'
		, 'el className opt'
		, 'el scrollIn' // scroll in once
	])

	exports.add = function() {
		var args = arguments
		var opt = addReopt.get(args)
		if (!opt) return debug('unknown args', args)
		opt = _.extend({}, exports.absent, opt, opt.opt)
		var $el = $(opt.el)
		if (!opt.scrollOut && false !== opt.once) {
			// also once
			opt.once = true
		}
		if (0 == arr.length && $el.length) {
			exports.init()
		}
		_.each($el, function(el) {
			$(el).data(optName, _.only(opt, 'scrollIn scrollOut className once isInView'))
			arr.push(el)
			check(el)
		})
	}

	exports.remove = function(el) {
		arr.splice(_.indexOf(arr, el), 1)
		if (0 == arr.length) {
			$(global).off('.' + name)
			hasInited = false
		}
	}

	exports.isInView = isInView

	function isInView(el, winOffset) {
		var $el = $(el)
		
		var offset = getOffset(el)
		winOffset = winOffset || getOffset(global)
		
		// if (hasSize(el)) {
		if (!isHide(el)) {
			// not display none
			var isVerticalIn = offset.top + offset.height >= winOffset.top && offset.top <= winOffset.top + winOffset.height
			var isHorizonalIn = offset.left + offset.width >= winOffset.left && offset.left <= winOffset.left + winOffset.width
			if (isVerticalIn && isHorizonalIn) {
				return true
			}
		}
		return false
	}

	/*
	function hasSize(el) {
		if (el.offsetWidth || el.offsetHeight) {
			return true
		}
		return false
	}
	*/
	function isHide(el) {
		var rect = el.getBoundingClientRect()
		for (var key in rect) {
			if (rect[key] > 0) return false
		}
		return true
	}

	// global.isInView = isInView // test

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

		// zepto has no innerHeight
		var height
		var width
		if ($el.innerHeight) {
			height = $el.innerHeight()
			width = $el.innerWidth()
		} else {
			height = $el.height()
			width = $el.width()
		}
		return _.extend(offset, {
			height: height,
			width: width
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
				exports.remove(el)
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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3)

	/* webpack only
	if (DEBUG && global.console) {
		console.debug('debug mode')
	}
	*/


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var cou = __webpack_require__(4)

	module.exports = cou.extend(_, cou)

	__webpack_require__(6)
	__webpack_require__(7)
	__webpack_require__(8)
	__webpack_require__(10)
	__webpack_require__(11)
	__webpack_require__(12)

	_.mixin(_, _)

	function _(val) {
		if (!(this instanceof _)) return new _(val)
		this.__value = val
		this.__chain = false
	}



/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(5)

	var slice = [].slice

	var _ = exports

	_.is = is

	_.extend = _.assign = extend

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
		return -1 != findIndex(arr, fn)
	}

	_.every = function(arr, fn) {
		return -1 == findIndex(arr, negate(fn))
	}

	_.reduce = reduce

	_.findIndex = findIndex

	_.find = function(arr, fn) {
		var index = _.findIndex(arr, fn)
		if (-1 != index) {
			return arr[index]
		}
	}

	_.indexOf = indexOf

	_.includes = function(val, sub) {
		return -1 != indexOf(val, sub)
	}

	_.toArray = toArray

	_.slice = function(arr, start, end) {
		// support array and string
		var ret = [] // default return array
		var len = getLength(arr)
		if (len >= 0) {
			start = start || 0
			end = end || len
			// raw array and string use self slice
			if (!is.fn(arr.slice)) {
				arr = toArray(arr)
			}
			ret = arr.slice(start, end)
		}
		return ret
	}

	_.negate = negate

	_.forIn = forIn

	_.keys = keys

	var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g

	_.trim = function(str) {
		if (null == str) return ''
		return ('' + str).replace(rtrim, '')
	}

	_.noop = function() {}

	_.len = getLength

	function getLength(arr) {
		if (null != arr) return arr.length
	}

	function each(arr, fn) {
		var len = getLength(arr)
		if (len && is.fn(fn)) {
			for (var i = 0; i < len; i++) {
				if (false === fn(arr[i], i, arr)) break
			}
		}
		return arr
	}

	function findIndex(arr, fn) {
		var ret = -1
		each(arr, function(item, i, arr) {
			if (fn(item, i, arr)) {
				ret = i
				return false
			}
		})
		return ret
	}

	function toArray(arr) {
		var ret = []
		each(arr, function(item) {
			ret.push(item)
		})
		return ret
	}


	function extend(target) {
		if (target) {
			var sources = slice.call(arguments, 1)
			each(sources, function(src) {
				forIn(src, function(val, key) {
					if (!is.undef(val)) {
						target[key] = val
					}
				})
			})
		}
		return target
	}

	function negate(fn) {
		return function() {
			return !fn.apply(this, arguments)
		}
	}

	function indexOf(val, sub) {
		if (is.string(val)) return val.indexOf(sub)

		return findIndex(val, function(item) {
			// important!
			return sub === item
		})
	}

	function reduce(arr, fn, prev) {
		each(arr, function(item, i) {
			prev = fn(prev, item, i, arr)
		})
		return prev
	}

	function forIn(hash, fn) {
		if (hash) {
			for (var key in hash) {
				if (is.owns(hash, key)) {
					if (false === fn(hash[key], key, hash)) break
				}
			}
		}
		return hash
	}

	function keys(hash) {
		var ret = []
		forIn(hash, function(val, key) {
			ret.push(key)
		})
		return ret
	}



/***/ },
/* 5 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {var is = exports

	var obj = Object.prototype

	var navigator = global.navigator

	// reserved words in es3: instanceof null undefined arguments boolean false true function int
	// only have is.string and is.object, not is.str and is.obj
	// instanceof null undefined arguments boolean false true function int

	is.browser = function() {
		if (!is.wechatApp()) {
			if (navigator && global.window == global) {
				return true
			}
		}
		return false
	}

	// simple modern browser detect
	is.h5 = function() {
		if (is.browser() && navigator.geolocation) {
			return true
		}
		return false
	}

	is.mobile = function() {
		if (is.browser() && /mobile/i.test(navigator.userAgent)) {
			return true
		}
		return false
	}

	is.wechatApp = function() {
		if ('object' == typeof wx) {
			if (wx && is.fn(wx.createVideoContext)) {
				// wechat js sdk has no createVideoContext
				return true
			}
		}
		return false
	}

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
		return val !== val
	}

	is.bool = function(val) {
		return 'boolean' == _class(val)
	}

	is.infinite = function(val) {
		return val == Infinity || val == -Infinity
	}

	is.number = function(num) {
		return !isNaN(num) && 'number' == _class(num)
	}

	// integer or decimal
	is.iod = function(val) {
		if (is.number(val) && !is.infinite(val)) {
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

	is.integer = function(val) {
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
	is.object = function(obj) {
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

	is.string = function(str) {
		return 'string' == _class(str)
	}

	// number or string
	is.nos = function(val) {
		return is.iod(val) || is.string(val)
	}

	is.array = function(arr) {
		return 'array' == _class(arr)
	}

	is.arraylike = function(arr) {
		// window has length for iframe too, but it is not arraylike
		if (!is.window(arr) && is.object(arr)) {
			var len = arr.length
			if (is.integer(len) && len >= 0) {
				return true
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
		if (is.string(val) || is.arraylike(val)) {
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


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var _ = module.exports = __webpack_require__(3)

	var each = _.each
	var includes = _.includes
	var is = _.is
	var proto = Array.prototype

	_.reject = function(arr, fn) {
		return _.filter(arr, function(val, i, arr) {
			return !fn(val, i, arr)
		})
	}

	_.without = function(arr) {
		var other = _.slice(arguments, 1)
		return _.difference(arr, other)
	}

	_.difference = function(arr, other) {
		var ret = []
		_.each(arr, function(val) {
			if (!includes(other, val)) {
				ret.push(val)
			}
		})
		return ret
	}

	_.pluck = function(arr, key) {
		return _.map(arr, function(item) {
			if (item) return item[key]
		})
	}

	_.size = function(arr) {
		var len = _.len(arr)
		if (null == len) {
			len = _.keys(arr).length
		}
		return len
	}

	_.first = function(arr) {
		if (arr) return arr[0]
	}

	_.last = function(arr) {
		var len = _.len(arr)
		if (len) {
			return arr[len - 1]
		}
	}

	_.asyncMap = function(arr, fn, cb) {
		// desperate
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

	_.uniq = function(arr) {
		return _.uniqBy(arr)
	}

	_.uniqBy = function(arr, fn) {
		var ret = []
		var pool = []
		if (!is.fn(fn)) {
			fn = null
		}
		each(arr, function(item) {
			var val = item
			if (fn) {
				val = fn(item)
			}
			if (!includes(pool, val)) {
				pool.push(val)
				ret.push(item)
			}
		})
		return ret
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

	_.sample = function(arr, n) {
		var ret = _.toArray(arr)
		var len = ret.length
		var need = Math.min(n || 1, len)
		for (var i = 0; i < len; i++) {
			var rand = _.random(i, len - 1)
			var tmp = ret[rand]
			ret[rand] = ret[i]
			ret[i] = tmp
		}
		ret.length = need
		if (null == n) {
			return ret[0]
		}
		return ret
	}

	_.shuffle = function(arr) {
		return _.sample(arr, Infinity)
	}

	_.compact = function(arr) {
		return _.filter(arr, _.identity)
	}

	_.rest = function(arr) {
		return _.slice(arr, 1)
	}

	_.invoke = function() {
		var args = arguments
		var arr = args[0]
		var fn = args[1]
		var isFunc = is.fn(fn)
		args = _.slice(args, 2)

		return _.map(arr, function(item) {
			if (isFunc) {
				return fn.apply(item, args)
			}
			if (null != item) {
				var method = item[fn]
				if (is.fn(method)) {
					return method.apply(item, args)
				}
			}
		})
	}

	_.partition = function(arr, fn) {
		var hash = _.groupBy(arr, function(val, i, arr) {
			var ret = fn(val, i, arr)
			if (ret) return 1
			return 2
		})
		return [hash[1] || [], hash[2] || []]
	}

	_.groupBy = function(arr, fn) {
		var hash = {}
		_.each(arr, function(val, i, arr) {
			var ret = fn(val, i, arr)
			hash[ret] = hash[ret] || []
			hash[ret].push(val)
		})
		return hash
	}

	_.range = function() {
		var args = arguments
		if (args.length < 2) {
			return _.range(args[1], args[0])
		}
		var start = args[0] || 0
		var last = args[1] || 0
		var step = args[2]
		if (!is.number(step)) {
			step = 1
		}
		var count = last - start
		if (0 != step) {
			count = count / step
		}
		var ret = []
		var val = start
		for (var i = 0; i < count; i++) {
			ret.push(val)
			val += step
		}
		return ret
	}

	_.pullAt = function(arr) {
		// `_.at` but mutate
		var indexes = _.slice(arguments, 1)
		return mutateDifference(arr, indexes)
	}

	function mutateDifference(arr, indexes) {
		var ret = []
		var len = _.len(indexes)
		if (len) {
			indexes = indexes.sort(function(a, b) {
				return a - b
			})
			while (len--) {
				var index = indexes[len]
				ret.push(proto.splice.call(arr, index, 1)[0])
			}
		}
		ret.reverse()
		return ret
	}

	_.remove = function(arr, fn) {
		// `_.filter` but mutate
		var len = _.len(arr) || 0
		var indexes = []
		while (len--) {
			if (fn(arr[len], len, arr)) {
				indexes.push(len)
			}
		}
		return mutateDifference(arr, indexes)
	}

	_.fill = function(val, start, end) {
		// TODO
	}


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _ = module.exports = __webpack_require__(3)

	var is = _.is
	var each = _.each
	var forIn = _.forIn

	_.only = function(obj, keys) {
		obj = obj || {}
		if (is.string(keys)) keys = keys.split(/ +/)
		return _.reduce(keys, function(ret, key) {
			if (null != obj[key]) ret[key] = obj[key]
			return ret
		}, {})
	}

	_.values = function(obj) {
		return _.map(_.keys(obj), function(key) {
			return obj[key]
		})
	}

	_.pick = function(obj, fn) {
		if (!is.fn(fn)) {
			return _.pick(obj, function(val, key) {
				return key == fn
			})
		}
		var ret = {}
		forIn(obj, function(val, key, obj) {
			if (fn(val, key, obj)) {
				ret[key] = val
			}
		})
		return ret
	}

	_.functions = function(obj) {
		return _.keys(_.pick(obj, function(val) {
			return is.fn(val)
		}))
	}

	_.mapKeys = function(obj, fn) {
		var ret = {}
		forIn(obj, function(val, key, obj) {
			var newKey = fn(val, key, obj)
			ret[newKey] = val
		})
		return ret
	}

	_.mapObject = _.mapValues = function(obj, fn) {
		var ret = {}
		forIn(obj, function(val, key, obj) {
			ret[key] = fn(val, key, obj)
		})
		return ret
	}

	// return value when walk through path, otherwise return empty
	_.get = function(obj, path) {
		path = toPath(path)
		if (path.length) {
			var flag = _.every(path, function(key) {
				if (null != obj) { // obj can be indexed
					obj = obj[key]
					return true
				}
			})
			if (flag) return obj
		}
	}

	_.has = function(obj, path) {
		path = toPath(path)
		if (path.length) {
			var flag = _.every(path, function(key) {
				if (null != obj && is.owns(obj, key)) {
					obj = obj[key]
					return true
				}
			})
			if (flag) return true
		}
		return false
	}

	_.set = function(obj, path, val) {
		path = toPath(path)
		var cur = obj
		_.every(path, function(key, i) {
			if (is.oof(cur)) {
				if (i + 1 == path.length) {
					cur[key] = val
				} else {
					var item = cur[key]
					if (null == item) {
						// fill value with {} or []
						var item = {}
						if (~~key == key) {
							item = []
						}
					}
					cur = cur[key] = item
					return true
				}
			}
		})
		return obj
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

	_.defaults = function() {
		var args = arguments
		var target = args[0]
		var sources = _.slice(args, 1)
		if (target) {
			_.each(sources, function(src) {
				_.mapObject(src, function(val, key) {
					if (is.undef(target[key])) {
						target[key] = val
					}
				})
			})
		}
		return target
	}

	_.isMatch = function(obj, src) {
		var ret = true
		obj = obj || {}
		forIn(src, function(val, key) {
			if (val !== obj[key]) {
				ret = false
				return false
			}
		})
		return ret
	}

	_.toPlainObject = function(val) {
		var ret = {}
		forIn(val, function(val, key) {
			ret[key] = val
		})
		return ret
	}

	_.invert = function(obj) {
		var ret = {}
		forIn(obj, function(val, key) {
			ret[val] = key
		})
		return ret
	}

	// topath, copy from lodash

	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g
	var reEscapeChar = /\\(\\)?/g;

	function toPath(val) {
		if (is.array(val)) return val
		var ret = []
		_.tostr(val).replace(rePropName, function(match, number, quote, string) {
			var item = number || match
			if (quote) {
				item = string.replace(reEscapeChar, '$1')
			}
			ret.push(item)
		})
		return ret
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var _ = module.exports = __webpack_require__(3)

	var is = _.is
	var slice = _.slice

	_.bind = function(fn, ctx) {
		if (is.string(ctx)) {
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

	// from lang.js `Function.prototype.inherits`
	// so belong to function
	_.inherits = function(ctor, superCtor) {
		ctor.super_ = superCtor
		ctor.prototype = _.create(superCtor.prototype, {
			constructor: ctor
		})
	}

	_.delay = function(fn, wait) {
		var args = _.slice(arguments, 2)
		return setTimeout(function() {
			fn.apply(this, args)
		}, wait)
	}

	_.before = function(n, fn) {
		return function() {
			if (n > 1) {
				n--
				return fn.apply(this, arguments)
			}
		}
	}

	_.once = function(fn) {
		return _.before(2, fn)
	}

	_.after = function(n, fn) {
		return function() {
			if (n > 1) {
				n--
			} else {
				return fn.apply(this, arguments)
			}
		}
	}

	_.throttle = function(fn, wait, opt) {
		wait = wait || 0
		opt = _.extend({
			leading: true,
			trailing: true,
			maxWait: wait
		}, opt)
		return _.debounce(fn, wait, opt)
	}

	_.debounce = function(fn, wait, opt) {
		wait = wait || 0
		opt = _.extend({
			leading: false,
			trailing: true
		}, opt)
		var maxWait = opt.maxWait
		var lastExec = 0 // wait
		var lastCall = 0 // just for maxWait
		var now = _.now()
		var timer

		if (!opt.leading) {
			lastExec = now
		}

		function ifIsCD() {
			if (now - lastExec > wait) return false
			if (maxWait && now - lastCall > maxWait) return false
			return true
		}

		function exec(fn, ctx, args) {
			lastExec = _.now() // update last exec
			return fn.apply(ctx, args)
		}

		function cancel() {
			if (timer) {
				clearTimeout(timer)
				timer = null
			}
		}

		function debounced() {
			now = _.now() // update now
			var isCD = ifIsCD()
			lastCall = now // update last call
			var me = this
			var args = arguments

			cancel()

			if (!isCD) {
				exec(fn, me, args)
			} else {
				if (opt.trailing) {
					timer = _.delay(function() {
						exec(fn, me, args)
					}, wait)
				}
			}
		}

		debounced.cancel = cancel

		return debounced
	}

	function memoize(fn) {
		var cache = new memoize.Cache
		function memoized() {
			var args = arguments
			var key = args[0]
			if (!cache.has(key)) {
				var ret = fn.apply(this, args)
				cache.set(key, ret)
			}
			return cache.get(key)
		}
		memoized.cache = cache
		return memoized
	}

	memoize.Cache = __webpack_require__(9)

	_.memoize = memoize

	_.wrap = function(val, fn) {
		return function() {
			var args = [val]
			args.push.apply(args, arguments)
			return fn.apply(this, args)
		}
	}

	_.curry = function(fn) {
		var len = fn.length
		return setter([])

		function setter(args) {
			return function() {
				var arr = args.concat(_.slice(arguments))
				if (arr.length >= len) {
					arr.length = len
					return fn.apply(this, arr)
				}
				return setter(arr)
			}
		}
	}


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(3)
	var is = _.is

	module.exports = Cache

	function Cache() {
		this.data = {}
	}

	var proto = Cache.prototype

	proto.has = function(key) {
		return is.owns(this.data, key)
	}

	proto.get = function(key) {
		return this.data[key]
	}

	proto.set = function(key, val) {
		this.data[key] = val
	}

	proto['delete'] = function(key) {
		delete this.data[key]
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var _ = module.exports = __webpack_require__(3)
	var is = _.is

	_.now = function() {
		return +new Date
	}

	_.constant = function(val) {
		return function() {
			return val
		}
	}

	_.identity = function(val) {
		return val
	}

	_.random = function(min, max) {
		return min + Math.floor(Math.random() * (max - min + 1))
	}

	_.mixin = function(dst, src, opt) {
		var keys = _.functions(src)
		if (dst) {
			if (is.fn(dst)) {
				opt = opt || {}
				var isChain = !!opt.chain
				// add to prototype
				var proto = dst.prototype
				_.each(keys, function(key) {
					var fn = src[key]
					proto[key] = function() {
						var me = this
						var args = [me.__value]
						args.push.apply(args, arguments)
						var ret = fn.apply(me, args)
						if (me.__chain) {
							me.__value = ret
							return me
						}
						return ret
					}
				})
			} else {
				_.each(keys, function(key) {
					dst[key] = src[key]
				})
			}
		}
		return dst
	}

	_.chain = function(val) {
		var ret = _(val)
		ret.__chain = true
		return ret
	}

	_.value = function() {
		this.__chain = false
		return this.__value
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var _ = module.exports = __webpack_require__(3)

	_.tostr = tostr // lodash toString

	var indexOf = _.indexOf

	_.split = function(str, separator, limit) {
		str = tostr(str)
		return str.split(separator, limit)
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

	_.startsWith = function(str, val) {
		return 0 == indexOf(str, val)
	}

	_.endsWith = function(str, val) {
		val += '' // null => 'null'
		return val == _.slice(str, _.len(str) - _.len(val))
	}

	_.lower = function(str) {
		// lodash toLower
		return tostr(str).toLowerCase()
	}

	_.upper = function(str) {
		// lodash toUpper
		return tostr(str).toUpperCase()
	}

	_.repeat = function(str, count) {
		return _.map(_.range(count), function() {
			return str
		}).join('')
	}

	_.padStart = function(str, len, chars) {
		str = _.tostr(str)
		len = len || 0
		var delta = len - str.length
		return getPadStr(chars, delta) + str
	}

	_.padEnd = function(str, len, chars) {
		str = _.tostr(str)
		len = len || 0
		var delta = len - str.length
		return str + getPadStr(chars, delta)
	}

	function getPadStr(chars, len) {
		chars = _.tostr(chars) || ' ' // '' will never end
		var count = Math.floor(len / chars.length) + 1
		return _.repeat(chars, count).slice(0, len)
	}

	function tostr(str) {
		if (str || 0 == str) return str + ''
		return ''
	}


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var _ = module.exports = __webpack_require__(3)

	_.sum = function(arr) {
		return _.reduce(arr, function(sum, val) {
			return sum + val
		}, 0)
	}

	_.max = function(arr, fn) {
		var index = -1
		var data = -Infinity
		fn = fn || _.identity
		_.each(arr, function(val, i) {
			val = fn(val)
			if (val > data) {
				data = val
				index = i
			}
		})
		if (index > -1) {
			return arr[index]
		}
		return data
	}

	_.min = function(arr, fn) {
		var index = -1
		var data = Infinity
		fn = fn || _.identity
		_.each(arr, function(val, i) {
			val = fn(val)
			if (val < data) {
				data = val
				index = i
			}
		})
		if (index > -1) {
			return arr[index]
		}
		return data
	}


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var Log = __webpack_require__(14)

	var defaultLog = Log.getLogger()

	module.exports = exports = defaultLog


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var _ = __webpack_require__(2)
	var is = _.is
	var safeConsole = __webpack_require__(15)

	module.exports = exports = Log

	function Log(opt) {
		var me = this
		if (is.string(opt)) {
			opt = {name: opt}
		}
		opt = opt || {}
		me.name = opt.name || Log.defaultName
		me.enabled = me.isNameMatch(me.name)
		me.Log = Log
	}

	// static

	var defaultConfig = {
		level: 0, // print all level
		MAX_LOG_LEN: 3000,
		debugKey: 'debug',
		defaultLevelName: 'log',
		defaultName: 'default',
		_name: '', // can not use name, default should be empty for online mode
		prefix: '',
		// TODO format layout?
		outputers: [], // 叫 log4j 叫 appender, seelog 叫 writer
		logFilters: [logFilter1],
		custom: {
			outputers: {
				color: __webpack_require__(16)
			}
		}
	}

	_.extend(Log, defaultConfig)

	var loggers = {} // cache all logger
	var logs = Log.logs = []

	if (safeConsole.hasConsole()) {
		Log.outputers.push(defaultOutput)
	}

	var LEVEL = {
		name2code: {
			// error always > info
			verbose: 0,
			log: 1,
			debug: 2,
			info: 3,
			warn: 4,
			error: 5
		},
		toname: function(name) {
			if (is.number(name)) {
				name = LEVEL.code2name[name]
			}
			if (!is.string(name)) {
				name = Log.defaultLevelName
			}
			return name
		},
		tocode: function(code) {
			if (is.string(code)) {
				code = LEVEL.name2code[_.lower(code)]
			}
			if (!is.number(code)) {
				code = LEVEL.name2code[Log.defaultLevelName]
			}
			return code
		}
	}

	LEVEL.code2name = _.invert(LEVEL.name2code)

	Log.LEVEL = LEVEL // TODO make level a class?

	Log.setLevel = function(level) {
		Log.level = LEVEL.tocode(level)
	}

	Log.setName = function(name) {
		Log._name = name
		Log.pattern = normalizePattern(name)
		_.forIn(loggers, function(logger) {
			logger.enabled = logger.isNameMatch(name)
		})
	}

	Log.getPlainLog = function() {
		return _.map(Log.logs, function(item) {
			return _.map(item.data, function(val) {
				var ret = val
				if (global.JSON) {
					try {
						ret = JSON.stringify(val)
					} catch (err) {
						ret = '[Nested]'
					}
				}
				return ret
			}).join(' ')
		}).join('\r\n')
	}

	Log.getLogger = getLogger

	Log.setName(Log._name)
	Log.setLevel(Log.level)

	Log.init = function(key) {
		key = key || Log.debugKey
		var name

		// try get name
		// get by url first
		if (global.location) {
			var reg = new RegExp(key + '=(\\S+)')
			var res = reg.exec(global.location.href)
			if (res) {
				name = res[1]
			}
		}

		// then localStorage
		if (null == name) {
			try {
				// never test global.localStorage, will also crash in no cookie mode
				name = localStorage[key]
			} catch (ignore) {}
		}

		// then env
		if (null == name && global.process) {
			name = _.get(global, ['process', 'env', key])
		}

		// 没有 name 也要 set, 要清除日志
		Log.setName(name)
	}

	Log.init() // always self init, so can use directly

	function defaultOutput(item) {
		var levelName = LEVEL.toname(item.level)
		safeConsole.console(levelName, item.data)
	}

	function logFilter1(item) {
		// data name level time
		item.time = _.now()
		saveLog(item)
	}

	function saveLog(item) {
		// TODO lru cache
		logs.push(item)
		if (logs.length > Log.MAX_LOG_LEN) {
			logs.shift()
		}
	}

	function getLogger(name) {
		// inspired by log4j getLogger
		name = name || Log.defaultName
		var logger = loggers[name]
		if (!logger) {
			logger = loggers[name] = new Log(name)
		}
		return logger
	}

	function normalizePattern(pattern) {
		var skips = []
		var names = []

		if (pattern && is.string(pattern)) {
			_.each(pattern.split(/[\s,]+/), function(name) {
				name = name.replace(/\*/g, '.*?')
				var first = name.charAt(0)
				if ('-' == first) {
					skips.push(new RegExp('^' + _.slice(name, 1) + '$'))
				} else {
					names.push(new RegExp('^' + name + '$'))
				}
			})
		}

		return {
			skips: skips,
			names: names
		}
	}

	// private

	var proto = Log.prototype

	proto.getLogger = getLogger

	proto.getLevelFunction = function(level) {
		var code = LEVEL.tocode(level)
		var me = this
		return function() {
			me.print(code, arguments)
		}
	}

	_.each(_.keys(LEVEL.name2code), function(level) {
		var code = LEVEL.tocode(level)
		Log[_.upper(level)] = code
		proto[level] = function() {
			var me = this
			me.print(code, arguments)
		}
	})

	proto.print = function(levelCode, data) {
		var me = this
		if (me.enabled && levelCode >= Log.level) {
			var item = {
				level: levelCode,
				name: me.name,
				data: data
			}
			_.each(Log.logFilters, function(logFilter) {
				logFilter(item, Log.lastLog)
			})
			Log.lastLog = item
			_.each(Log.outputers, function(outputer) {
				outputer(item, Log)
			})
		}
	}

	proto.isNameMatch = function(name) {
		var me = this
		var pattern = Log.pattern
		if (!name) {
			// clear all
			return false
		}
		function regMatch(reg) {
			return reg.test(name)
		}
		if (_.some(pattern.skips, regMatch)) {
			return false
		}
		if (_.some(pattern.names, regMatch)) {
			return true
		}
		return false
	}


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 15 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {exports.hasConsole = function() {
		if (global.console) {
			return true
		}
		return false
	}

	exports.console = function(level, arr) {
		// support ie8+
		// http://stackoverflow.com/questions/5538972/console-log-apply-not-working-in-ie9
		var apply = Function.prototype.apply || console[level].apply // wechat has no Function.prototype.apply
		apply.call(console[level], console, arr)
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(2)
	var is = _.is
	var safeConsole = __webpack_require__(15)

	var colors = 'lightseagreen forestgreen goldenrod dodgerblue darkorchid crimson'.split(' ')
	var colorIndex = 0
	var inherit = 'color:inherit'
	var lastTime

	var cacheColorMap = {}

	module.exports = _.noop

	if (safeConsole.hasConsole()) {
		if (supportColor()) {
			module.exports = colorLog
		} else {
			module.exports = function(item, Log) {
				safeConsole.console('log', item.data)
			}
		}
	}

	function supportColor() {
		if (is.wechatApp()) {
			return true
		}
		if (isIE()) { // 可能可以改成 is.h5
			return false
		}
		if (!is.browser()) {
			return false
		}
		return true
	}

	function isIE() {
		if (is.browser()) {
			if (/Trident/i.test(navigator.userAgent)) {
				return true
			}
		}
		return false
	}

	function colorLog(item, Log) {
		var now = _.now()
		var ms = now - (lastTime || now)
		var color = 'color:' + getColor(item.name)
		lastTime = now

		var label = Log.prefix + item.name
		var main = '%c' + label + '%c'
		var arr = [null, color, inherit]

		_.each(item.data, function(val) {
			arr.push(val)
			main += ' %o'
		})

		arr.push(color)
		main += '%c +' + ms + 'ms'
		arr[0] = main
		safeConsole.console('log', arr)
	}

	function getColor(name) {
		if (!cacheColorMap[name]) {
			cacheColorMap[name] = colors[colorIndex++ % colors.length]
		}
		return cacheColorMap[name]
	}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(2)

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
			return is.array(val)
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
		if (is.string(arr)) return arr.split(sep)
		return []
	}


/***/ }
/******/ ]);