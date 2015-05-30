var name = 'scrollspy'

var _ = require('min-util')
var cooled = require('cooled')
var debug = require('min-debug')(name)
var Reopt = require('reopt')

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
	, 'el scrollIn' // scroll in once
])

exports.add = function() {
	var args = arguments
	var opt = addReopt.get(args)
	if (!opt) return debug('unknown args', args)
	opt = _.extend({}, exports.absent, opt, opt.opt)
	var el = opt.el
	opt = _.only(opt, 'scrollIn scrollOut className once isInView')
	if (!opt.scrollOut && false !== opt.once) {
		// also once
		opt.once = true
	}
	$(el).data(optName, opt)
	if (0 == arr.length) {
		exports.init()
	}
	arr.push(el)
	check(el)
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
	if (!$el.is(':visible')) return false
	
	var offset = getOffset(el)
	winOffset = winOffset || getOffset(global)
	
	var isVerticalIn = offset.top + offset.height >= winOffset.top && offset.top <= winOffset.top + winOffset.height
	var isHorizonalIn = offset.left + offset.width >= winOffset.left && offset.left <= winOffset.left + winOffset.width
	if (isVerticalIn && isHorizonalIn) return true
	return false
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
