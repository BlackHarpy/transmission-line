/// <reference path="../types.d.ts"/>

import { State } from '../state'
import { Matrix } from '../elements/matrix'
import { TRANSFORM_NONE, TRANSFORM_SWAPDOWN, TRANSFORM_CHANGECASE } from '../../../testbed/gamebase.js'

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
    
  }

  update(): void {

  }

  setStartTimerButton() {
    this.timer =  this.game.time.create(false)
    this.timer.loop(Phaser.Timer.SECOND, () => {
      console.log('tick')
      this.matrix.updateLettersPosition()
    })
    this.startButton = this.game.add.button(50, 200, 'cursor', this.startTransmission, this)
  }

  startTransmission() {
    this.timer.start()
  }

  setControls(): void {
    this.controls = [{
      id: TRANSFORM_SWAPDOWN,
      name: 'Swap',
      sprite: new Phaser.Sprite(this.game, 50, 50, 'cursor'),
      timer:  this.game.time.create(false)
    },{
      id: TRANSFORM_CHANGECASE,
      name: 'Change Case',
      sprite: new Phaser.Sprite(this.game, 50, 80, 'cursor'),
      timer:  this.game.time.create(false)      
    },{
      id: TRANSFORM_NONE,
      name: 'Delete',
      sprite: new Phaser.Sprite(this.game, 50, 110, 'cursor'),
      timer:  this.game.time.create(false)      
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
    this.controls.forEach(control => {
      if (control.id !== id) {
        this.resetFocus(control)
      } else {
        this.hightlightControl(control)
      }
    })
  }

  getControlById(id) {
    return this.controls.find(control => {
      return control.id === id
    })
  }

  hightlightControl(control): void {
    enum tints {
      light = 0xffffff,
      dark = 0x918e8c
    }
    let key: boolean = true
    control.timer.loop(Phaser.Timer.QUARTER / 2, () => {
      key = !key
      control.sprite.tint = key ? tints.dark : tints.light
    })
    control.timer.start()
  }

  resetFocus(control): void {
    control.timer.stop()
    control.sprite.tint = 0xffffff
  }

}