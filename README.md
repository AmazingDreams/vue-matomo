# VuePiwik

[![npm](https://img.shields.io/npm/v/vue-piwik.svg)](https://www.npmjs.com/package/vue-piwik) [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)

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
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'vue-piwik/dist/vue-piwik.css'

Vue.use(VuePiwik, {
  host: 'https://matomo.example.com',
  siteId: 5,
  router: router // Enables automatically registering pageviews on the router
})

// Now you can access piwik api in components through
this.$piwik
```

For available operations see the [piwik api docs](https://developer.matomo.org/api-reference/tracking-javascript)

### Browser

```html
<!-- Include after Vue -->
<!-- Local files -->
<link rel="stylesheet" href="vue-piwik/dist/vue-piwik.css"></link>
<script src="vue-piwik/dist/vue-piwik.js"></script>

<!-- From CDN -->
<link rel="stylesheet" href="https://unpkg.com/vue-piwik/dist/vue-piwik.css"></link>
<script src="https://unpkg.com/vue-piwik"></script>
```

## Development

### Launch visual tests

```bash
npm run dev
```

### Launch Karma with coverage

```bash
npm run dev:coverage
```

### Build

Bundle the js and css of to the `dist` folder:

```bash
npm run build
```


## Publishing

The `prepublish` hook will ensure dist files are created before publishing. This
way you don't need to commit them in your repository.

```bash
# Bump the version first
# It'll also commit it and create a tag
npm version
# Push the bumped package and tags
git push --follow-tags
# Ship it 🚀
npm publish
```

## License

[MIT](http://opensource.org/licenses/MIT)
