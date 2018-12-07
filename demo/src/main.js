// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import VueMatomo from 'vue-matomo'

console.log(VueMatomo)

Vue.use(VueMatomo, {
  host: 'https://demo.matomo.org',
  siteId: 62,

  // Enables automatically registering pageviews on the router
  router: router,

  // Enables link tracking on regular links. Note that this won't
  // work for routing links (ie. internal Vue router links)
  // Default: true
  enableLinkTracking: true,

  // Require consent before sending tracking information to matomo
  // Default: false
  requireConsent: false,

  // Whether to track the initial page view
  // Default: true
  trackInitialView: true,

  // Changes the default .js and .php endpoint's filename
  // Default: 'piwik'
  trackerFileName: 'piwik',

  // Whether or not to log debug information
  // Default: false
  debug: true
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
