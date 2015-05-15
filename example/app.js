var scrollspy = require('../')

var colors = 'lightseagreen forestgreen goldenrod dodgerblue darkorchid crimson'.split(' ')

$(init)

function init() {
	$('p').each(function() {
		var me = this
		var $me = $(me)
		scrollspy.add(me, {
			scrollin: function() {
				$me.addClass('show').css('background', colors[~~(Math.random() * colors.length)])
			},
			scrollout: function() {
				$me.removeClass('show').css('background', null)
			},
			once: -1 != $me.text().indexOf('once')
		})
	})
}
