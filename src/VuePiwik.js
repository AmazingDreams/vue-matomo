export default class VuePiwik {
  constructor (options) {
    const { host, siteId } = options
    this._options = options
    this._tracker = window.Piwik.getTracker(host + '/piwik.php', siteId)

    if (options.router) {
      options.router.afterEach(this.autoTrackRouter.bind(this))
    }
  }

  autoTrackRouter (from, to) {
    this.trackPageView()
  }

  trackPageView (name) {
    this._tracker.trackPageView(name)
  }
}
