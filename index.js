var name = 'scrollspy'

var _ = require('min-util')
var cooled = require('cooled')
var debug = require('min-debug')(name)

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
	  scrollin: _.noop
	, scrollout: _.noop
	, isInView: false
	, once: false // scroll in and remove event
}

exports.init = function() {
	if (hasInited) return

	debug('init')
	hasInited = true

	var check =	cooled(function(ev) {
		exports.check(ev)
	}, 300)

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

exports.add = function(el, opt) {
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
		height: $el.height(),
		width: $el.width()
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
	if (isInView) {
		opt.scrollin.call(el, ev)
	} else {
		opt.scrollout.call(el, ev)
	}
	if (opt.once) {
		arr.splice(arr.indexOf(el), 1)
	}
}
