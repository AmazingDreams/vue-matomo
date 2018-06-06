import bootstrap from './bootstrap'

export default function install (Vue, options = {}) {
  bootstrap(options)
    .then(() => {
      const { host, siteId } = options
      const piwik = window.Piwik.getTracker(host + '/piwik.php', siteId)

      // Assign piwik to Vue
      Vue.prototype.$piwik = piwik

      // Register first page view
      piwik.trackPageView()

      // Track page navigations if router is specified
      if (options.router) {
        options.router.afterEach((to, from) => {
          const loc = window.location
          const url = loc.protocol + '://' + loc.host + to.path

          piwik.setCustomUrl(url)
          piwik.trackPageView(to.name)
        })
      }
    })
}
