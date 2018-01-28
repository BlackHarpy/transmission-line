/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts"/>
/// <reference path="../../node_modules/phaser-ce/typescript/pixi.d.ts"/>

import 'pixi'
import 'p2'
import 'phaser'

import { MainState } from './states/main'

export default class App extends Phaser.Game {
    constructor(config: Phaser.IGameConfig) {
      super(config)
      //this.state.add('intro', IntroState)      
      this.state.add('main', MainState)
      this.state.start('main')
    }
  }

window.onload = () => {
    const config: Phaser.IGameConfig = {
      width:           896, 
      height:          640,
      renderer:        Phaser.AUTO,       //Reseach further about Phaser.WEBGL_MULTI multi-texture rendering
      parent:          'content',
      resolution:      1,
      forceSetTimeOut: false,
      antialias: false
    }
    new App(config)
}