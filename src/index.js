import MatomoJS from './matomo'

const defaultOptions = {
  debug: false,
  enableLinkTracking: true,
  requireConsent: false,
  trackInitialView: true,
  trackerFileName: 'piwik'
}

export default function install (Vue, setupOptions = {}) {
  const options = Object.assign({}, defaultOptions, setupOptions)

  const { host, siteId, trackerFileName, trackerUrl } = options
  const trackerEndpoint = trackerUrl || `${host}/${trackerFileName}.php`;

  const Matomo = MatomoJS.getTracker(trackerEndpoint, siteId)

  // Assign matomo to Vue
  Vue.prototype.$piwik = Matomo
  Vue.prototype.$matomo = Matomo

  if (options.requireConsent) {
    Matomo.requireConsent()
  }

  if (options.trackInitialView) {
    // Register first page view
    Matomo.trackPageView()
  }

  if (options.enableLinkTracking) {
    Matomo.enableLinkTracking()
  }

  // Track page navigations if router is specified
  if (options.router) {
    options.router.afterEach((to, from) => {

      // Unfortunately the window location is not yet updated here
      // We need to make our own url using the data provided by the router
      const loc = window.location

      // Protocol may or may not contain a colon
      let protocol = loc.protocol
      if (protocol.slice(-1) !== ':') {
          protocol += ':'
      }

      const maybeHash = options.router.mode === 'hash' ? '/#' : ''
      const url = protocol + '//' + loc.host + maybeHash + to.path

      if (to.meta.analyticsIgnore) {
        options.debug && console.debug('[vue-matomo] Ignoring ' + url)
        return
      }

      options.debug && console.debug('[vue-matomo] Tracking ' + url)

      Matomo.setCustomUrl(url)
      Matomo.trackPageView()
    })
  }
}
