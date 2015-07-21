Usage
---

[Demo Page](http://chunpu.github.io/scrollspy/example/)

```js
var scrollspy = require('scrollspy')

$('.scroll-class').each(function() {
	var me = this
	var $me = $(me)
	scrollspy.add(me, {
		scrollIn: function() {
			$me.addClass('show')
		},
		scrollOut: function() {
			$me.removeClass('show')
		}
	})
})
```

Api
---

#### Add

- `scrollspy.add(element, opt)`
- `scrollspy.add(element, scrollIn, scrollOut[, opt])`
- `scrollspy.add(element, className[, opt])`

options

- `scrollIn` scroll in handler
- `scrollOut` scroll out handler
- `className` add class when scroll in, remove class when scroll out
- `once` if trigger scroll in(no scroll out) just once, default false

#### Remove

remove element from checklist elements when scrolling

- `scrollspy.remove(el)`

Tip
---

> elements been scroll spied should be shown, which means `display: none` will be ignored
