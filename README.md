# react component Loader
a react component of a directory loader for webpack

# What is a react component
a react component may contains scripts (js, jsx, ts, tsx, mjs, etc.), styles (css, less, styl, scss) and assets (images, files, fonts, etc.).

## The component structure
```
component
├── script.js
├── assets
│   ├── 1.jpg
│   ├── 2.png
│   └── index.js
├── style
│   └── index.less
│   └── index.css
└── index.js
```
you can see more examples in `.examples/src`

## Assets (Experiment)
when match `/assets/index.(js|ts|jsx|tsx)/`, the loader will change
```javascript
export const JPG1 = './1.jpg';
export const JPG2 = './2.jpg';
```
to
```javascript
export { default as JPG1 } from './1.jpg';
export { default as JPG2 } from './2.jpg';
```

# Usage
## Install
```
yarn add react-component-pack-loader
```

## Webpack loader config
```javascript
module: {
  rules: [
    {
      test: /\.(ts|js)$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: path.resolve('./component-loader'),
        options: {
          baseStyleTarget: path.resolve('./src/index.js'),
          components: [{
            // is default
            lib: 'lib',
            // will inject to baseStyleTarget script, should without extension
            baseStyle: 'lib/style/base',
            // will inject to component file
            style: 'less'
          }, {
            test: 'My',
            style: 'less'
          }]
        }
      }]
    },
    {
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }]
    },
    {
      test: /\.jpg|png/,
      use: ['file-loader']
    },
    {
      test: /\.css/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.less/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }
  ]
}
```

## Options
you can use webpack loader `options` as bellow.
```typescript
type Option = {
  // absolute path for inject base styles
  baseStyleTarget: string,
  // the array order is the same with baseStyle injection order
  components: Array<{
    // the webpack resolve path for library, this will search pakcage.json of lib,
    // to find `components` property and append to options
    lib: string;
    // the style file path to inject to `baseStyleTarget`, should not with extension
    baseStyle: string;

    // determine match or not, when lib is set the test will auto set to
    test: string | RegExp;
    // string for RegExp constructor, default is assets/index.(js|ts|jsx|tsx|mjs)
    assetsRule: string | RegExp;
    componentRule: string | RegExp;
    // 'less' | 'css' | 'styl' | 'scss'
    style: string;
  }>
}
```
`pathRegExp + index` is the regular expression for test the absolute file path. if matched will insert the `import '${style}'` into the file.
