const path = require('path')

const phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js')

const assets = path.join(__dirname, 'assets/')  

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/scripts/app.ts',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public')
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
      'assets': assets
    },
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    loaders: [{ test: /\.tsx?$/, loader: 'ts-loader' }, 
      { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
      { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
      { test: /p2\.js/, use: ['expose-loader?p2']},
      { test: /assets(\/|\\)/, loader: 'file-loader?name=assets/[hash].[ext]' }
    ]
  }
}