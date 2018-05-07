(function(arr) {
  arr.forEach(function(item) {
    if (item.hasOwnProperty('remove')) {
      return
    }
    Object.defineProperty(item, 'remove', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function remove() {
        this.parentNode.removeChild(this)
      }
    })
  })
})([Element.prototype, CharacterData.prototype, DocumentType.prototype])

(function() {
  var FOREIGN_HOST = 'foxrenderfarm.com'
  var SORT_MAP = {
    manifest: 1,
    vendor: 2,
    app: 3
  }
  function sortUrl(prev, curr) {
    var w = SORT_MAP[prev.split('.').shift().split('/').pop()]
    var x = SORT_MAP[curr.split('.').shift().split('/').pop()]
    return w > x
  }
  function PreLoadPlugin(data) {
    this.preLoad = document.getElementById('pre-load')
    this.thumb = document.querySelector('#pre-load .load-thumb')
    this.rate = document.querySelector('#pre-load .load-rate')
    if (!data) { return }
    this.urlList = data.map(function(item) {
      return item.url
    }).sort(sortUrl)
    // var sizeList = data.map(function(item) {
    //   return item.size
    // })
    // TODO: get file size
    var sizeList = [8, 40, 50]
    var totalSize = sizeList.reduce(function(prev, curr) {
      return prev + curr
    })
    this.weightList = sizeList.map(function(item) {
      return Number((item / totalSize).toFixed(2))
    })
    this.scriptList = Array(this.urlList.length)
    this.loadedCount = 0
    this.progressList = [0, 0, 0]
  }
  PreLoadPlugin.prototype = {
    onRenderFinish: function() {
      var _this = this
      window.setTimeout(function() {
        _this.thumb.innerHTML = '100%'
        _this.thumb.style.left = '99%'
        _this.rate.style.width = '100%'
        _this.preLoad.style.opacity = 0
      })
      window.setTimeout(function() {
        _this.preLoad.remove()
        document.getElementById('app').style.opacity = 1
      }, 500)
    },
    onProgress: function() {
      var _this = this
      var progress = this.progressList.map(function(item, index) {
        return item * _this.weightList[index]
      }).reduce(function(prev, curr) {
        return prev + curr
      }).toFixed(2)
      this.thumb.innerHTML = progress + '%'
      this.thumb.style.left = progress - 1 + '%'
      this.rate.style.width = progress + '%'
    },
    loadScript: function(url, index) {
      var _this = this
      var request = new XMLHttpRequest()
      request.addEventListener('progress', function(event) {
        var percentComplete = event.loaded / event.total * 100
        _this.progressList[index] = percentComplete
        _this.onProgress()
      }, false)
      request.addEventListener('load', function(event) {
        _this.scriptList[index] = event.target.responseText
        _this.loadedCount += 1
        _this.render()
      }, false);
      request.open('GET', url)
      request.send()
    },
    render: function() {
      if (this.loadedCount === this.scriptList.length) {
        this.scriptList.forEach(function(item) {
          var script = document.createElement('script')
          script.innerHTML = item
          document.documentElement.appendChild(script)
        })
      }
    },
    init: function() {
      if (window.location.hostname.indexOf(FOREIGN_HOST) !== -1) {
        document.title = 'FoxRenderfarm'
        document.querySelector('#pre-load .load-text').innerHTML = 'loading...'
      }
      var _this = this
      this.rate.style.width = '0'
      this.thumb.innerHTML = '0%'
      this.thumb.style.left = '1%'
      if (!this.urlList) { return }
      this.urlList.forEach(function(url, index) {
        _this.loadScript(url, index)
      })
    }
  }
  window.__PRE_LOAD_PLUGIN__ = new PreLoadPlugin(window.__SCRIPTS__)
  window.__PRE_LOAD_PLUGIN__.init()
})()
