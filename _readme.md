Usage
===

```js
var scrollspy = require('scrollspy')

$('.scroll-class').each(function() {
	var me = this
	var $me = $(me)
	scrollspy.add(me, {
		scrollin: function() {
			$me.addClass('show')
		},
		scrollout: function() {
			$me.removeClass('show')
		}
	})
})
```

Api
===

#### Add

`scrollspy.add(element, opt)`

options

- `scrollin` scroll in handler
- `scrollout` scroll out handler
- `once` if trigger scroll in or out just once, default false
