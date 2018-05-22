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
    console.error('Error loading script', error)
  })

  return scriptPromise
}
