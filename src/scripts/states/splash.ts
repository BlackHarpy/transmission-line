import { State } from '../state'

const gameJamSplash = require('assets/ggj_splash.jpg')
const atlasJson = require('assets/sprites.json')
const atlasImage = require('assets/sprites.png')

export class SplashState extends State {
  splash: Phaser.Sprite

  preload(): void {
    this.game.load.image('splashGGJ', gameJamSplash)
    this.game.load.atlas('mainAtlas', atlasImage, atlasJson)
  }
  create(): void {
    this.splash = new Phaser.Sprite(this.game, 0, 0, 'splashGGJ')
    this.splash.scale.setTo(0.5)
    this.game.add.existing(this.splash)
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function () {
      this.splash.loadTexture('mainAtlas',  'splash.png')
      this.splash.scale.setTo(2)
      this.game.time.events.add(Phaser.Timer.SECOND * 2, this.startGame, this)    
    }, this)
  }
  update(): void {
  }

  startGame() {
    this.game.state.start('main')

  }

}