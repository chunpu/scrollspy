var scrollspy = require('../')

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
