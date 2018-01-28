/// <reference path="../types.d.ts"/>

import { State } from '../state'
import { Matrix } from '../elements/matrix'
import { MATRIX_SIZE } from '../constants'
import { TRANSFORM_NONE, TRANSFORM_SWAPDOWN, TRANSFORM_CHANGECASE } from '../../../testbed/gamebase.js'

const cursorImage = require('assets/test-sprite.gif')
const tileTest = require('assets/block.png')
const atlasJson = require('assets/sprites.json')
const atlasImage = require('assets/sprites.png')

//audio
const music = require('assets/music/test.ogg')
const placeControl = require('assets/sfx/place_control.wav')
const placeControl2 = require('assets/sfx/place_control2.wav')
const removeControl = require('assets/sfx/remove_control.wav')


export class MainState extends State {
  testSprite: Phaser.Sprite
  testSprite2: Phaser.Sprite
  controls: Control[]
  player: Player
  matrix: any
  timer: Phaser.Timer
  startButton: Phaser.Button
  tintTimer: Phaser.Timer
  movingBoxes: boolean
  selectControlSound: Phaser.Sound
  backgroundMusic: Phaser.Sound
  transmissionStarted: boolean

  preload(): void {
   this.game.load.image('cursor', cursorImage)
   this.game.load.image('tile', tileTest)
   this.game.load.atlas('mainAtlas', atlasImage, atlasJson)
   this.game.load.audio('backgroundMusic', music)
   this.game.load.audio('placeControlSFX', placeControl)
   this.game.load.audio('placeControl2SFX', placeControl2)
   this.game.load.audio('removeControlSFX', removeControl)
  }

  create(): void {
    this.loadControls()
    this.setLines('prueba')
    this.setStartTimerButton()
    this.tintTimer =  this.game.time.create(false)
    this.movingBoxes = false
    this.transmissionStarted = false
    this.selectControlSound = this.game.add.sound('placeControl2SFX')
    this.backgroundMusic = this.game.add.sound('backgroundMusic')
  }

  update(): void {
    if (!this.movingBoxes && this.matrix.endOfLine()) {
      this.movingBoxes = true
      this.matrix.moveBoxesOut().then(result => {
        this.movingBoxes = false
        console.log('done')
        this.transmissionStarted = false
        this.matrix.resetData()
        this.setLines('GameJam')
      })
    }
  }

  setLines(word) {
    this.matrix = new Matrix(this.game, MATRIX_SIZE.WIDTH, word.length)
    this.matrix.drawMatrix()
    this.matrix.initialize(word)
  }

  setStartTimerButton() {
    this.timer =  this.game.time.create(false)
    this.timer.loop(Phaser.Timer.SECOND, () => {
      console.log('tick')
      if (this.transmissionStarted) {
        this.matrix.updateLettersPosition()
      }
    })
    this.timer.start()    
    this.startButton = this.game.add.button(50, 200, 'cursor', this.startTransmission, this)
  }

  startTransmission() {
    this.transmissionStarted = true
  }

  loadControls(): void {
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
        this.selectControlSound.play()
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