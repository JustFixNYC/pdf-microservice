<a name="v0.3.3"></a>
### v0.3.3 (2013-12-18)


#### Bug Fixes

* rename module export in client side to window.lxHelpers ([6189db48](https://github.com/litixsoft/lx-helpers/commit/6189db481ab15ff9fb5be87f1f65a7090a342b30))

<a name="v0.3.2"></a>
### v0.3.2 (2013-12-09)


#### Features

* add function roundPrecise() to round  a value to n decimal places, with 0.005 be ([e9660ee6](https://github.com/litixsoft/lx-helpers/commit/e9660ee6502a61ca142646cfe6e9e3a364fb9107))

<a name="v0.3.1"></a>
### v0.3.1 (2013-12-09)


#### Features

* **Gruntfile:**
  * add grunt-bump task ([ec9e40a6](https://github.com/litixsoft/lx-helpers/commit/ec9e40a668c992bb5f5502ea482889290d1694e8))
  * add grunt-conventional-changelog to generate changelog ([cb73cc8d](https://github.com/litixsoft/lx-helpers/commit/cb73cc8d5c05eec39a0e8dada5b8a1ae27e34369))
* **git:** add git commit hook to validate the commit message ([778a6dce](https://github.com/litixsoft/lx-helpers/commit/778a6dce68298d4dfb30108b2aa1f5ffe1a7f30c))

## v0.3.0
#### Features
* add function isNumber()
* **getType():** now detects Infinite and NaN

#### Breaking Changes
* **getType():** now returns the type in lower case without the part ‘[object]‘

### v0.2.5
#### Features
* add break condition to forEach function

### v0.2.4
#### Features
* add function arrayHasItem(array, item) to check if an array contains the given item.

### v0.2.3
#### Features
* add function for getting a TypeError with a message.

### v0.2.2
#### Features
* function isEmpty() now only checks length for arrays and objects. Functions now return always true.

### v0.2.1
#### Features
* add function getType() to get the full type of the value (e.g. getType(null) === '[object Null]')

## v0.2.0
#### Features
* add zip file in dist folder containing the debug and min version of lx-helpers
* add function isEmpty() to check if the given value has no items/keys
* add function isArray() to check if the given value is an array
* add function isObject() to check if the given value is an object
* add function isFunction() to check if the given value is a function
* add function isDate() to check if the given value is a date
* add function forEach() to iterate over array, objects or functions
* update devDependencies

## v0.1.0 project initial