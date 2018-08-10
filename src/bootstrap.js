export default function (options) {
  const { host } = options
  const filename = host + '/piwik.js'

  const scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = filename

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
