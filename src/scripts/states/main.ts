/// <reference path="../types.d.ts"/>

import { State } from '../state'
import { Matrix } from '../elements/matrix'
const cursorImage = require('assets/test-sprite.gif')
const tileTest = require('assets/block.png')
const atlasJson = require('assets/sprites.json')
const atlasImage = require('assets/sprites.png')

export class MainState extends State {
  testSprite: Phaser.Sprite
  testSprite2: Phaser.Sprite
  controls: Control[]
  player: Player
  matrix: any
  timer: Phaser.Timer
  
  startButton: Phaser.Button
  tintTimer: Phaser.Timer
  deleteControlButton: Phaser.Button

  preload(): void {
   this.game.load.image('cursor', cursorImage)
   this.game.load.image('tile', tileTest)
   this.game.load.atlas('mainAtlas', atlasImage, atlasJson);
  }

  create(): void {
    this.setControls()
    this.matrix = new Matrix(this.game, 5,5)
    this.matrix.drawMatrix()
    this.matrix.initialize('holas')
    this.setStartTimerButton()
    this.tintTimer =  this.game.time.create(false)
    
    this.deleteControlButton = this.game.add.button(50, 130, 'cursor', this.setDeleteControl, this)    
    
  }

  update(): void {

  }

  setStartTimerButton() {
    this.timer =  this.game.time.create(false)
    this.timer.loop(Phaser.Timer.SECOND, () => {
      console.log('tick')
      this.matrix.updateLettersPosition()
    })
    this.startButton = this.game.add.button(50, 110, 'cursor', this.startTransmission, this)
  }

  setDeleteControl() {
    this.matrix.setSelectedControl(0)
  }

  startTransmission() {
    this.timer.start()
  }

  setControls(): void {
    this.controls = [{
      id: 2,
      name: 'Control 1',
      sprite: new Phaser.Sprite(this.game, 50, 50, 'cursor')
    },{
      id: 3,
      name: 'Control 1',
      sprite: new Phaser.Sprite(this.game, 50, 80, 'cursor')
    }]

    this.controls.forEach(control => {
      this.game.add.existing(control.sprite)
      control.sprite.inputEnabled = true
      control.sprite.events.onInputDown.add(this.handleClick, this, 0, control.id)
      this.game.physics.enable(control.sprite, Phaser.Physics.ARCADE);
    })
  }

  setEvents(): void {
    this.testSprite.events.onInputDown.add(this.handleClick, this)
  }

  handleClick(sprite, pointer, id): void {
    this.matrix.setSelectedControl(id)
    this.hightlightControl(this.controls[0].sprite)

  }

  hightlightControl(sprite): void {
    enum tints {
      light = 0xffffff,
      dark = 0x918e8c
    }
    let key: boolean = true
    this.tintTimer.loop(Phaser.Timer.QUARTER / 2, () => {
      key = !key
      sprite.tint = key ? tints.dark : tints.light
    })
    this.tintTimer.start()
  }

  resetFocus(sprite): void {
    this.tintTimer.stop()
    sprite.tint = 0xffffff
  }

}