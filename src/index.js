import ClickListener from './listeners/click'

import bootstrap from './bootstrap'
import Matomo from './matomo'

const bindListeners = function (matomo) {
  new ClickListener(matomo).bind(document)
}

const defaultOptions = {
  requireConsent: false,
  trackInitialView: true,
  trackerFileName: 'piwik'
}

export default function install (Vue, setupOptions = {}) {
  const options = Object.assign({}, defaultOptions, setupOptions)

  const { host, siteId, trackerFileName } = options

  // Assign matomo to Vue
  Vue.prototype.$piwik = Matomo
  Vue.prototype.$matomo = Matomo

  Matomo.setTrackerUrl(`${host}/${trackerFileName}.php`)
  Matomo.setSiteId('' + siteId)

  if (options.requireConsent) {
    Matomo.requireConsent()
  }

  // Register first page view
  if (options.trackInitialView) {
    Matomo.trackPageView()
  }

  // Track page navigations if router is specified
  if (options.router) {
    options.router.afterEach((to, from) => {
      // Unfortunately the window location is not yet updated here
      // We need to make our own ulr using the data provided by the router
      const loc = window.location

      // Protocol may or may not contain a colon
      let protocol = loc.protocol
      if (protocol.slice(-1) !== ':') {
        protocol += ':'
      }

      const url = protocol + '//' + loc.host + to.path

      Matomo.setCustomUrl(url)
      Matomo.trackPageView(to.name)
    })
  }

  // Load external matomo js
  bootstrap(options)
}
