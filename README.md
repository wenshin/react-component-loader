# react component Loader
a react component of a directory loader for webpack

# What is a react component
a react component may contains scripts (js, jsx, ts, tsx, mjs, etc.), styles (css, less, styl, scss) and assets (images, files, fonts, etc.).

## The simplest component
```
component
├── script.js
├── assets
│   ├── 1.jpg
│   ├── 2.png
│   └── index.js
├── index.js
└── index.css
```
you can see more examples in `.examples/src`

## Index file
the comment `/* react-component-pack-loader?type=index&style=./style/index.less */` will change file
```javascript
/* react-component-pack-loader?type=index&style=./style/index.less */

import My from './My';
import { JPG1, JPG2 } from './assets';

export default My;
```

to
```javascript
// react-component-pack-loader?type=index&style=./style/index.less

import './style/index.less';
import My from './My';
import { JPG1, JPG2 } from './assets';

export default My;
```


## Assets
the notation `/* react-component-pack-loader?type=assets */` will change file
```javascript
// react-component-pack-loader?type=assets

export const JPG1 = './1.jpg';
export const JPG2 = './2.jpg';
```

to
```javascript
// react-component-pack-loader?type=assets

export { default as JPG1 } from './1.jpg';
export { default as JPG2 } from './2.jpg';
```


# Usage
## Install
```
yarn add react-component-pack-loader
```

## Webpack config
```javascript
module: {
  rules: [
    {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }, {
        loader: path.resolve('./component-loader'),
        options: {
          'My1': {
            index: 'index.(js|ts)$',
            assets: 'assets/index.(js|ts)$',
            style: './index.css'
          },
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

```typescript
type Option = {
  [rootPath: string]: {
    // string for RegExp constructor, default is index.(js|ts|jsx|tsx|mjs)
    index: string;
    // string for RegExp constructor, default is assets/index.(js|ts|jsx|tsx|mjs)
    assets: string;
    // the relative or absolute style path for import, default is './index.css'.
    // the path will use webpack resolver to resolve
    style: string;
  }
}
```

1. 给任意 js 注入 css or less
2. 给目录下的 index.js 或者指定文件 注入 css or less
