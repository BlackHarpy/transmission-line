/// <reference path="../types.d.ts"/>

import { State } from '../state'
import { Utils } from './../elements/utils';
import { Matrix } from '../elements/matrix'
import { MATRIX_SIZE, SCALE } from '../constants'
import { WordData, GameData, TRANSFORM_NONE, TRANSFORM_SWAPDOWN, TRANSFORM_CHANGECASE, TRANSFORM_DECREMENT, TRANSFORM_INCREMENT } from '../../../testbed/gamebase.js'

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
  controls: Control[]
  availableControls: Control[]
  player: Player
  matrix: any
  timer: Phaser.Timer
  startButton: Phaser.Sprite
  tintTimer: Phaser.Timer
  movingBoxes: boolean
  selectControlSound: Phaser.Sound
  backgroundMusic: Phaser.Sound
  transmissionStarted: boolean
  currentLevel: number
  words: WordData
  endTriggered: boolean
  highlightedControl: Control

  preload(): void {
    this.game.load.image('cursor', cursorImage)
    this.game.load.image('tile', tileTest)
    this.game.load.atlas('mainAtlas', atlasImage, atlasJson)
    this.game.load.audio('backgroundMusic', music)
    this.game.load.audio('placeControlSFX', placeControl)
    this.game.load.audio('placeControl2SFX', placeControl2)
    this.game.load.audio('removeControlSFX', removeControl)
  }

  createProblem() {
    const thisword = this.words.getWordForLevel(this.currentLevel)
    const transforms = this.words.getTransformsForLevel(this.currentLevel)
    this.loadControls(transforms)
    const problem: GameData = new GameData(this.words.getMaxNumberOfTransforms(), thisword.length)
    const input = problem.generateProblemSafe(thisword, transforms)
    this.setLines(input)
    this.matrix.setSolution(thisword)
  }

  create(): void {
    this.endTriggered = false
    this.currentLevel = 0
    this.words = new WordData();
    let bg: Phaser.Image = new Phaser.Image(this.game, 0, 0, 'mainAtlas', 'bg.png')
    bg.scale.set(SCALE)
    this.game.add.existing(bg)
    this.controls = Utils.getAllControls(this.game)
    this.createProblem()
    this.setStartTimerButton()
    this.tintTimer = this.game.time.create(false)
    this.movingBoxes = false
    this.transmissionStarted = false
    this.selectControlSound = this.game.add.sound('placeControl2SFX')
    this.backgroundMusic = this.game.add.sound('backgroundMusic')
    this.backgroundMusic.play('', 0, 1, true)
  }



  nextLevel(): void {
    this.matrix.resetData()
    this.resetControls()
    this.currentLevel++
    this.endTriggered = false
    this.createProblem()
  }

  update(): void {
    if (!this.movingBoxes && this.matrix.endOfLine() && !this.endTriggered) {
      this.movingBoxes = true
      this.matrix.moveBoxesOut().then(result => {
        this.movingBoxes = false
        this.transmissionStarted = false
        this.endTriggered = true
        this.matrix.checkSolution()
        this.game.time.events.add(Phaser.Timer.SECOND * 4, this.nextLevel, this)
      })
    }
  }

  resetControls() {
    this.availableControls.forEach(control => {
      control.sprite.destroy()
    })
  }

  setLines(word) {
    this.matrix = new Matrix(this.game, MATRIX_SIZE.WIDTH, word.length)
    this.matrix.drawMatrix()
    this.matrix.initialize(word)
    this.hightlightControl(this.controls[0])
    this.matrix.setSelectedControl(this.controls[0])
  }

  setStartTimerButton() {
    this.timer = this.game.time.create(false)
    this.timer.loop(Phaser.Timer.SECOND, () => {
      //console.log('tick')
      if (this.transmissionStarted) {
        this.matrix.updateLettersPosition()
      }
    })
    this.timer.start()
    this.startButton = new Phaser.Sprite(this.game, 16, 336, 'mainAtlas', 'btn_play_0.png'),
      this.game.add.existing(this.startButton)
    this.startButton.inputEnabled = true
    this.startButton.scale.set(SCALE)
    this.startButton.animations.add('push', ['btn_play_1.png', 'btn_play_0.png'], 10, false)
    this.startButton.events.onInputDown.add(this.startTransmission, this, 0, this.startButton)
  }

  startTransmission() {
    this.startButton.animations.play("push")
    this.transmissionStarted = true
  }

  loadControls(transforms: number[]): void {
    this.availableControls = []
    this.controls.forEach(control => {
      if (transforms.indexOf(control.id) !== -1) {
        const availableControl: Control = control
        availableControl.sprite = new Phaser.Sprite(this.game, control.x, control.y, 'mainAtlas', availableControl.sprite_base + '_0.png'),
        availableControl.sprite.scale.set(SCALE)
        availableControl.sprite.inputEnabled = true
        availableControl.sprite.animations.add('push', [availableControl.sprite_base + '_1.png', availableControl.sprite_base + '_0.png'], 10, false)
        availableControl.sprite.events.onInputDown.add(this.handleClick, this, 0, availableControl)
        this.game.physics.enable(availableControl.sprite, Phaser.Physics.ARCADE)
        this.game.add.existing(availableControl.sprite)        
        this.availableControls.push(availableControl)
      }

    })
  }

  resetFocusAll() {
    this.controls.forEach(control => {
      this.resetFocus(control)
    })
  }

  handleClick(sprite, pointer, selected): void {
    this.matrix.setSelectedControl(selected)
    this.controls.forEach(control => {
      if (control.id !== selected.id) {
        this.resetFocus(control)
      } else {
        this.selectControlSound.play()
        control.sprite.animations.play('push')
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
    if (this.highlightedControl != null) this.resetFocus(this.highlightedControl)
    let key: boolean = true
    control.timer.loop(Phaser.Timer.QUARTER / 2, () => {
      key = !key
      control.sprite.tint = key ? tints.dark : tints.light
    })
    control.timer.start()
    this.highlightedControl = control
  }

  resetFocus(control): void {
    control.timer.stop()
    control.sprite.tint = 0xffffff
  }

}