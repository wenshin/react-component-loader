const url = require('url')
const path = require('path')
const { getOptions } = require('loader-utils')

const DEFAULT_EXTS = ['js', 'mjs', 'ts', 'jsx', 'tsx']
const URL_BASE = 'http://localhost'
const DEFAULT_STYLE = 'index.css'

function createConfig (opt) {
  return Object.assign({
    index: `index\\.(${DEFAULT_EXTS.join('|')})$`,
    assets: `assets.*\\.(${DEFAULT_EXTS.join('|')})$`,
    style: DEFAULT_STYLE
  }, opt)
}

module.exports = function reactComponentLoader (source) {
  const options = getOptions(this)

  // put notation like `/*** component-loader?type=index|assets&style=index.less ***/` into file to config component
  const matched = source.match(/\/\*\*\*\s*(react-component-pack-loader\?[^\s]+)\s*\*\*\*\//)
  let type
  let style

  const pkgs = Object.keys(options)
  for (const pkg of pkgs) {
    const conf = createConfig(options[pkg])
    const indexRe = new RegExp(`${pkg}/${conf.index}`)
    const assetsRe = new RegExp(`${pkg}/${conf.assets}`)
    if (this.resourcePath.match(indexRe)) {
      type = 'index'
      style = conf.style
      break
    } else if (this.resourcePath.match(assetsRe)) {
      type = 'assets'
      break
    }
  }

  if (!matched && !type) {
    return source
  } else if (matched) {
    const notation = new url.URL(matched[1], URL_BASE)
    type = notation.searchParams.get('type')
    // can override by user
    style = style || notation.searchParams.get('style') || DEFAULT_STYLE
  }

  switch (type) {
    case 'index':
      const stylePath = path.join(path.dirname(this.resourcePath), style)
      const callback = this.async()
      this.fs.stat(stylePath, (err, stat) => {
        if (err) {
          console.log(`${stylePath} NOT EXIST, SKIP`)
          return
        }
        this.addDependency(stylePath)
        callback(null, `import './${style}'\n${source}`)
      })
      return
    case 'assets':
      // replace `export const JPG = './foo.jpg'` to `export { default as JPG } from './foo.jpg'`
      return source.replace(
        /export\s+(const|var|let)\s+(\w+)\s*=\s*(['"][^'"]+['"])/gm,
        'export { default as $2 } from $3'
      )
    default:
      return source
  }
}
