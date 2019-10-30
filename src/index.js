import { buildBaseUrl } from './utils'

const defaultOptions = {
  debug: false,
  enableLinkTracking: true,
  requireConsent: false,
  trackInitialView: true,
  trackerFileName: 'piwik',
  trackerUrl: undefined,
  userId: undefined
}

function loadScript (trackerScript) {
  const scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = trackerScript

    const head = document.head || document.getElementsByTagName('head')[0]
    head.appendChild(script)

    script.onload = resolve
    script.onerror = reject
  })

  scriptPromise.catch((error) => {
    const msg = '[vue-matomo] An error occurred trying to load ' + error.target.src + '. ' +
      'If the file exists you may have an ad- or trackingblocker enabled.'

    console.error(msg)
  })

  return scriptPromise
}


function initMatomo(Vue, options) {
  const { host, siteId, trackerFileName, trackerUrl } = options
  const trackerEndpoint = trackerUrl || `${host}/${trackerFileName}.php`;

  const Matomo = window.Piwik.getTracker(trackerEndpoint, siteId)

  // Assign matomo to Vue
  Vue.prototype.$piwik = Matomo
  Vue.prototype.$matomo = Matomo

  if (options.requireConsent) {
    Matomo.requireConsent()
  }

  if (options.userId) {
    Matomo.setUserId(options.userId)
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
    const baseUrl = buildBaseUrl(options)

    options.router.afterEach((to, from) => {
      // Unfortunately the window location is not yet updated here
      // We need to make our own url using the data provided by the router
      const url = baseUrl + to.fullPath

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

export default function install (Vue, setupOptions = {}) {
  const options = Object.assign({}, defaultOptions, setupOptions)

  const { host, trackerFileName } = options
  const trackerScript = `${host}/${trackerFileName}.js`

  loadScript(trackerScript)
    .then(() => initMatomo(Vue, options))
}
