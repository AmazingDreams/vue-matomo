import { getMatomo, loadScript } from './utils'

const defaultOptions = {
  debug: false,
  disableCookies: false,
  enableHeartBeatTimer: false,
  enableLinkTracking: true,
  heartBeatTimerInterval: 15,
  requireConsent: false,
  trackInitialView: true,
  trackerFileName: 'matomo',
  trackerUrl: undefined,
  trackerScriptUrl: undefined,
  userId: undefined,
  cookieDomain: undefined,
  domains: undefined,
  preInitActions: []
}

function trackMatomoPageView (options) {
  let title

  if (options.router) {
    const url = window.location
    const meta = options.router.currentRoute.meta

    if (meta.analyticsIgnore) {
      options.debug && console.debug('[vue-matomo] Ignoring ' + url)
      return
    }

    options.debug && console.debug('[vue-matomo] Tracking ' + url)

    title = meta.title
  }

  getMatomo().trackPageView(title)
}

function initMatomo (Vue, options) {
  const Matomo = getMatomo()

  // Assign matomo to Vue
  Vue.prototype.$piwik = Matomo
  Vue.prototype.$matomo = Matomo

  if (options.trackInitialView) {
    // Register first page view
    trackMatomoPageView(options, Matomo)
  }

  // Track page navigations if router is specified
  if (options.router) {
    options.router.afterEach((to, from) => {
      Vue.nextTick(() => {
        // Make matomo aware of the route change
        Matomo.setReferrerUrl(from.fullPath)
        Matomo.setCustomUrl(to.fullPath)

        trackMatomoPageView(options, Matomo)

        if (options.enableLinkTracking) {
          Matomo.enableLinkTracking()
        }
      })
    })
  }
}

function piwikExists () {
  // In case of TMS,  we load a first container_XXX.js which triggers aynchronously the loading of the standard Piwik.js
  // this will avoid the error throwed in initMatomo when window.Piwik is undefined
  // if window.Piwik is still undefined when counter reaches 3000ms we reject and go to error

  return new Promise((resolve, reject) => {
    const checkInterval = 50
    const timeout = 3000
    const waitStart = Date.now()

    const interval = setInterval(() => {
      if (window.Piwik) {
        clearInterval(interval)

        return resolve()
      }

      if (Date.now() >= waitStart + timeout) {
        clearInterval(interval)

        throw new Error(`[vue-matomo]: window.Piwik undefined after waiting for ${timeout}ms`)
      }
    }, checkInterval)
  })
}

export default function install (Vue, setupOptions = {}) {
  const options = Object.assign({}, defaultOptions, setupOptions)

  const { host, siteId, trackerFileName, trackerUrl, trackerScriptUrl } = options
  const trackerScript = trackerScriptUrl || `${host}/${trackerFileName}.js`
  const trackerEndpoint = trackerUrl || `${host}/${trackerFileName}.php`

  window._paq = window._paq || []

  window._paq.push(['setTrackerUrl', trackerEndpoint])
  window._paq.push(['setSiteId', siteId])

  if (options.requireConsent) {
    window._paq.push(['requireConsent'])
  }

  if (options.userId) {
    window._paq.push(['setUserId', options.userId])
  }

  if (options.enableLinkTracking) {
    window._paq.push(['enableLinkTracking'])
  }

  if (options.disableCookies) {
    window._paq.push(['disableCookies'])
  }

  if (options.enableHeartBeatTimer) {
    window._paq.push(['enableHeartBeatTimer', options.heartBeatTimerInterval])
  }

  if (options.cookieDomain) {
    window._paq.push(['setCookieDomain', options.cookieDomain])
  }

  if (options.domains) {
    window._paq.push(['setDomains', options.domains])
  }

  options.preInitActions.forEach((action) => window._paq.push(action))

  loadScript(trackerScript)
    .then(() => piwikExists())
    .then(() => initMatomo(Vue, options))
    .catch((error) => {
      if (error.target) {
        return console.error(
          `[vue-matomo] An error occurred trying to load ${error.target.src}. ` +
          'If the file exists you may have an ad- or trackingblocker enabled.'
        )
      }

      console.error(error)
    })
}
