import bootstrap from './bootstrap'
import ClickListener from './listeners/click'

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

  bootstrap(options)
    .then(() => {
      const { host, siteId, trackerFileName } = options
      const matomo = window.Piwik.getTracker(`${host}/${trackerFileName}.php`, siteId)

      // Assign matomo to Vue
      Vue.prototype.$piwik = matomo
      Vue.prototype.$matomo = matomo

      if (options.requireConsent) {
        matomo.requireConsent()
      }

      // Register first page view
      if (options.trackInitialView) {
        matomo.trackPageView()
      }

      // Bind event listeners
      bindListeners(matomo)

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

          matomo.setCustomUrl(url)
          matomo.trackPageView(to.name)
        })
      }
    })
}
