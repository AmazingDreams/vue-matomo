export function buildBaseUrl (options) {
  const loc = window.location

  let routerBase = '/'
  if (options.router.options.base) {
    // Trim '/' at start and end, replace with single '/' at start and end
    routerBase = options.router.options.base
      .replace(/^\//, '')
      .replace(/\/+$/, '')

    routerBase = `/${routerBase}`
  }

  // Protocol may or may not contain a colon
  let protocol = loc.protocol
  if (protocol.slice(-1) !== ':') {
    protocol += ':'
  }

  const maybeHash = options.router.mode === 'hash' ? '/#' : ''

  return protocol + '//' + loc.host + routerBase + maybeHash
}
