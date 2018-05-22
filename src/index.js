import VuePiwik from './VuePiwik'
import bootstrap from './bootstrap'

export default function install (Vue, options = {}) {
  bootstrap(options)
    .then(() => {
      const piwik = new VuePiwik(options, window._paq)
      Vue.prototype.$piwik = piwik

      // Register first page view
      piwik.trackPageView()
    })
}
