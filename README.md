# VuePiwik

[![npm](https://img.shields.io/npm/v/vue-piwik.svg)](https://www.npmjs.com/package/vue-piwik)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![Build Status](https://travis-ci.org/AmazingDreams/vue-piwik.svg?branch=master)](https://travis-ci.org/AmazingDreams/vue-piwik)

> Link your Piwik/Matomo installation

## Installation

```bash
npm install --save vue-piwik
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import VuePiwik from 'vue-piwik'

Vue.use(VuePiwik, {
  host: 'https://matomo.example.com',
  siteId: 5,
  router: router // Enables automatically registering pageviews on the router
})

// Now you can access piwik api in components through
this.$piwik

// or
window._paq.push

// or through
window.Piwik.getTracker
```

For available operations see the [piwik api docs](https://developer.matomo.org/api-reference/tracking-javascript)

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<script src="vue-piwik/dist/vue-piwik.js"></script>

<!-- From CDN -->
<script src="https://unpkg.com/vue-piwik"></script>
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```

## License

[MIT](http://opensource.org/licenses/MIT)
