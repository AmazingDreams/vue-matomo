# VueMatomo

[![npm](https://img.shields.io/npm/v/vue-matomo.svg)](https://www.npmjs.com/package/vue-matomo)
[![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)
[![Build Status](https://travis-ci.org/AmazingDreams/vue-matomo.svg?branch=master)](https://travis-ci.org/AmazingDreams/vue-matomo)

Link your Piwik/Matomo installation

## Installation

```bash
npm install --save vue-matomo
```

## Usage

### Bundler (Webpack, Rollup)

```js
import Vue from 'vue'
import VueMatomo from 'vue-matomo'

Vue.use(VueMatomo, {
  // Configure your matomo server and site
  host: 'https://matomo.example.com',
  siteId: 5,

  // Enables automatically registering pageviews on the router
  router: router,

  // Require consent before sending tracking information to matomo
  // Default: false
  requireConsent: false,

  // Whether to track the initial page view
  // Default: true
  trackInitialView: true

  // Changes the default .js and .php endpoint's filename
  // Default: 'piwik'
  trackerFileName: 'piwik'
})

// Now you can access piwik api in components through
this.$matomo

// or
window._paq.push

// or through
window.Piwik.getTracker
```

For available operations see the [matomo api docs](https://developer.matomo.org/api-reference/tracking-javascript)

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<script src="vue-matomo/dist/vue-matomo.js"></script>

<!-- From CDN -->
<script src="https://unpkg.com/vue-matomo"></script>
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```

## License

[MIT](http://opensource.org/licenses/MIT)
