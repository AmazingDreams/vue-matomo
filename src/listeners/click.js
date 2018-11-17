export default class ClickListener {
  constructor(matomo) {
    this.matomo = matomo
  }

  bind (document) {
    document.addEventListener('click', this.handle.bind(this))
  }

  extractDomain (url) {
    return url.replace('http://','').replace('https://','').split('/')[0]
  }

  handle (e) {
    if (e.target.nodeName.toLowerCase() === 'a' &&
        this.isExternalUrl(e.target.href)) {
      this.matomo.trackLink(e.target.href)
    }
  }

  isExternalUrl (url) {
    console.log('url ' + url)
    return this.extractDomain(location.href) !== this.extractDomain(url);
  }
}
