var scrollspy = require('./')

$.fn.scrollspy = function() {
	return this.each(function() {
		var me = this
		var $me = $(me)
		var className = $me.attr(['data', scrollspy.name, 'class'].join('-'))
		scrollspy.add(me, {
			scrollin: function() {
				$me.addClass(className)
			},
			scrollout: function() {
				$me.removeClass(className)
			},
			//once: true
		})
	})
}
