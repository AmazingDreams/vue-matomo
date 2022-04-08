import { getMatomo, getResolvedHref, loadScript } from './utils'

const defaultOptions = {
  debug: false,
  disableCookies: false,
  requireCookieConsent: false,
  enableHeartBeatTimer: false,
  enableLinkTracking: true,
  heartBeatTimerInterval: 15,
  requireConsent: false,
  trackInitialView: true,
  trackSiteSearch: false,
  trackerFileName: 'matomo',
  trackerUrl: undefined,
  trackerScriptUrl: undefined,
  userId: undefined,
  cookieDomain: undefined,
  domains: undefined,
  preInitActions: [],
  crossOrigin: undefined
}

export const matomoKey = 'Matomo'

function trackUserInteraction (options, to, from) {
  if (typeof options.trackSiteSearch === 'function') {
    const siteSearch = options.trackSiteSearch(to)
    if (siteSearch) {
      trackMatomoSiteSearch(options, siteSearch)
      return
    }
  }
  trackMatomoPageView(options, to, from)
}

function trackMatomoSiteSearch (options, { keyword, category, resultsCount }) {
  const Matomo = getMatomo()

  options.debug && console.debug('[vue-matomo] Site Search ' + keyword)

  Matomo.trackSiteSearch(keyword, category, resultsCount)
}

function trackMatomoPageView (options, to, from) {
  const Matomo = getMatomo()

  let title
  let url
  let referrerUrl

  if (options.router) {
    url = getResolvedHref(options.router, to.fullPath)
    referrerUrl = from && from.fullPath
      ? getResolvedHref(options.router, from.fullPath)
      : undefined

    if (to.meta.analyticsIgnore) {
      options.debug && console.debug('[vue-matomo] Ignoring ' + url)
      return
    }

    options.debug && console.debug('[vue-matomo] Tracking ' + url)
    title = to.meta.title || url
  }

  if (referrerUrl) {
    Matomo.setReferrerUrl(referrerUrl)
  }
  if (url) {
    Matomo.setCustomUrl(url)
  }

  Matomo.trackPageView(title)
}

function initMatomo (Vue, options) {
  const Matomo = getMatomo()

  const version = Number(Vue.version.split('.')[0])

  if (version > 2) {
    Vue.config.globalProperties.$piwik = Matomo
    Vue.config.globalProperties.$matomo = Matomo
    Vue.provide(matomoKey, Matomo)
  } else {
    Vue.prototype.$piwik = Matomo
    Vue.prototype.$matomo = Matomo
  }

  if (options.trackInitialView && options.router) {
    // Vue 3 must use currentRoute.value
    const currentRoute = options.router.currentRoute.value
      ? options.router.currentRoute.value
      : options.router.currentRoute

    // Register first page view
    trackUserInteraction(options, currentRoute)
  }

  // Track page navigations if router is specified
  if (options.router) {
    options.router.afterEach((to, from) => {
      trackUserInteraction(options, to, from)

      if (options.enableLinkTracking) {
        Matomo.enableLinkTracking()
      }
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

  if (options.requireCookieConsent) {
    window._paq.push(['requireCookieConsent'])
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

  loadScript(trackerScript, options.crossOrigin)
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
