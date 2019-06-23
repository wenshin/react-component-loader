const url = require('url')
const { getOptions } = require('loader-utils')
const validateOptions = require('schema-utils')

const schema = {
  test: [RegExp],
  style: [String],
  scriptExts: [String]
}

const DEFAULT_EXTS = ['js', 'mjs', 'ts', 'jsx', 'tsx']
const URL_BASE = 'http://localhost';

module.exports = function reactComponentLoader (source) {
  const options = Object.assign({
    test: [],
    style: 'index.css',
    scriptExts: DEFAULT_EXTS
  }, getOptions(this))

  validateOptions(schema, options, 'react component loader option validation failed')

  // put notation like `/*** component-loader?type=index|assets&style=index.less ***/` into file to config component
  const matched = source.match(/\/\*\*\*\s*(react-component-pack-loader\?[^\s]+)\s*\*\*\*\//)
  if (!matched && !(options.test && options.test.length)) {
    return source
  }

  let notation
  if (matched) {
    notation = new url.URL(matched[1], URL_BASE)
  } else {
    const rule = options.test.find(r => this.resourcePath.match(r))
    if (rule) {
      notation = new url.URL('?type=index', URL_BASE)
    } else {
      return source
    }
  }
  const style = notation.searchParams.get('style') || options.style

  switch (notation.searchParams.get('type')) {
    case 'index':
      const scriptRegExp = new RegExp(`index.(${options.scriptExts.join('|')})$`)
      const stylePath = this.resourcePath.replace(scriptRegExp, `${style}`)
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
