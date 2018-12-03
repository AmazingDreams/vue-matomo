export default new Proxy({}, {
  get (id, name, receiver) {
    window._paq = window._paq || []

    return (...args) => {
      const arr = [name].concat(args)
      console.debug(arr)
      window._paq.push(arr)
    }
  }
})
