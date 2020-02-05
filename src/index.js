import { buildBaseUrl } from './utils'

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

  return scriptPromise
}

function initMatomo (Vue, options) {
  const Matomo = window.Piwik.getAsyncTracker()

  // Assign matomo to Vue
  Vue.prototype.$piwik = Matomo
  Vue.prototype.$matomo = Matomo

  if (options.trackInitialView) {
    // Register first page view
    Matomo.trackPageView()
  }

  // Track page navigations if router is specified
  if (options.router) {
    const baseUrl = buildBaseUrl(options)
    const baseUrlHasSlash = baseUrl.slice(-1) === '/'

    options.router.afterEach((to, from) => {
      // Unfortunately the window location is not yet updated here
      // We need to make our own url using the data provided by the router
      const url = baseUrl + (baseUrlHasSlash ? to.fullPath.replace(/^\//, '') : to.fullPath)

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

function piwikExists() {
  // In case of TMS,  we load a first container_XXX.js which triggers aynchronously the loading of the standard Piwik.js
  // this will avoid the error throwed in initMatomo when window.Piwik is undefined
  // if window.Piwik is still undefined when counter reaches 3000ms we reject and go to error
  const timeout = 50;
  return new Promise((resolve,reject)=>{
    let initialNow = Date.now();
    const interval = setInterval(()=>{
      if (!!window.Piwik) {
        clearInterval(interval);
        return resolve();
      } else {
        let now = Date.now();
        if ( now >= initialNow + 3000){
          clearInterval(interval);
          return reject('window.Piwik is undefined');
        }
      }}, timeout);
  })
}

export default function install (Vue, setupOptions = {}) {
  const options = Object.assign({}, defaultOptions, setupOptions)

  const { host, siteId, trackerFileName, trackerUrl } = options
  const trackerScript = `${host}/${trackerFileName}.js`
  const trackerEndpoint = trackerUrl || `${host}/${trackerFileName}.php`

  window._paq = window._paq || []

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

  window._paq.push(['setTrackerUrl', trackerEndpoint])
  window._paq.push(['setSiteId', siteId])

  loadScript(trackerScript)
    .then(() => piwikExists())
    .then(() => initMatomo(Vue, options))
    .catch((error) => {
      const msg = '[vue-matomo] An error occurred trying to load ' + error.target.src + '. ' +
        'If the file exists you may have an ad- or trackingblocker enabled.'
      console.error(msg)
    })
}
