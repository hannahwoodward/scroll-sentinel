export default class ScrollSentinel {
  constructor(options) {
    options = options || {}
    const defaults = {
      container: window,
      items: [],
      forceRun: false
    }
    if (options) {
      for (const key in defaults) {
        this[key] = options[key] || defaults[key]
      }
    }

    // initial load
    this.init()
  }

  init() {
    let is_ready = true
    const runItemCallbacks = (ds_changed = true) => {
      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i]
        if (ds_changed || !item.dsThrottle) {
          item.fx(item.element)
        }
      }
      return true
    }

    const fps = 60
    const _this = this
    let x0 = getScrollX()
    let y0 = getScrollY()
    let t0 = getTime()

    requestAnimationFrame(update)
    if (this.container === window) {
      window.addEventListener('resize', runItemCallbacks)
      window.addEventListener('orientationchange', runItemCallbacks)
    }

    function update() {
      requestAnimationFrame(update)
      const t1 = getTime()
      if (!is_ready || (t1 - t0) < fps) {
        return
      }

      const x1 = getScrollX()
      const y1 = getScrollY()
      const x_changed = (x1 !== x0)
      const y_changed = (y1 !== y0)
      // return early if no elements have DY throttling disabled
      if (!x_changed && !y_changed && !_this.forceRun) {
        return
      }
      is_ready = false

      x0 = x1
      y0 = y1
      t0 = t1
      is_ready = runItemCallbacks(x_changed || y_changed)
    }
    function getScrollX() {
      if (_this.container === window) {
        return (window.scrollX || document.documentElement.scrollLeft)
      }
      return _this.container.scrollLeft
    }
    function getScrollY() {
      if (_this.container === window) {
        return (window.scrollY || document.documentElement.scrollTop)
      }
      return _this.container.scrollTop
    }
    function getTime() {
      return performance.now()
    }
  }

  add(item) {
    // FORMAT: { element: el, dsThrottle: false, fx: () => {} }
    if (!item.element || !item.fx) {
      return
    }
    item.dsThrottle = 'dsThrottle' in item ? item.dsThrottle : true
    this.items.push(item)
    if (!item.dsThrottle) {
      this.forceRun = true
    }
  }

  clearItems() {
    this.items = []
  }

  // stop() {
  //   this.clearItems()
  //   cancelAnimationFrame(update)
  //   if (this.container === window) {
  //     window.removeEventListener('resize', runItemCallbacks)
  //   }
  // }
}
