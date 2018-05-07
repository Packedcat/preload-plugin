const fs = require('fs')
const path = require('path')

function resolve(fileName) {
  return path.join(__dirname, fileName);
}

// TODO: error catch
class PreLoadPlugin {
  constructor(options) {
    // TODO: option with index fileName
    this.options = Object.assign({}, options)
  }
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      let source = compilation.assets['index.html'].source()
      const dom = fs.readFileSync(resolve('pre-load-dom.html')).toString()
      const style = fs.readFileSync(resolve('./pre-load-style.css')).toString()
      const script = fs.readFileSync(resolve('./pre-load-script.js')).toString()

      source = source.replace('</head>', `<style type="test/css">\n${style}</style>\n</head>`)
      source = source.replace('</body>', `${dom}\n</body>`)
      source = source.replace('</body>', `<script type="test/javascript">\n${script}</script>\n</body>`)

      let [pre, after] = source.split('<body>')
      // let style
      pre += `<body>\n  <script type="text/javascript">window.__SCRIPTS__=[`
      // Reflect.ownKeys(compilation.assets).map(filename => {
      //   var reg = /^static\/js\/(app|manifest|vendor)\.[a-zA-z\d]*\.js$/
      //   if (reg.test(filename)) {
      //     // TODO: get file size
      //     pre += `{url:'/${filename}',size:1},`
      //   }
      //   if (/^.*app\.[a-zA-z\d]*\.css$/.test(filename)) {
      //     style = `/${filename}`
      //   }
      // })
      // pre = pre.slice(0, -1)
      pre += ']</script>'
      // pre = pre.replace('</head>', `  <link rel="stylesheet" href="${style}">\n</head>`)

      // pre = pre.replace('</head>', `  <style type="test/css">\n${style}\n</style>\n</head>`)
      compilation.assets['index.html'] = {
        source() {
          return pre + after
        },
        size() {
          return source.length
        },
      }
      callback()
    })
  }
}

module.exports = PreLoadPlugin
