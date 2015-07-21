scrollspy
===

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]
[![Dependency Status][david-image]][david-url]
[npm-image]: https://img.shields.io/npm/v/scrollspy.svg?style=flat-square
[npm-url]: https://npmjs.org/package/scrollspy
[downloads-image]: http://img.shields.io/npm/dm/scrollspy.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/scrollspy
[david-image]: http://img.shields.io/david/chunpu/scrollspy.svg?style=flat-square
[david-url]: https://david-dm.org/chunpu/scrollspy


scrollspy for jQuery

Installation
---

```sh
npm i scrollspy
```

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

License
---

[![License][license-image]][license-url]

[license-image]: http://img.shields.io/npm/l/scrollspy.svg?style=flat-square
[license-url]: #
