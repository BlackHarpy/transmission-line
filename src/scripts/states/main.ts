/// <reference path="../types.d.ts"/>

import { State } from '../state'
import { Matrix } from '../elements/matrix'
import { MATRIX_SIZE, SCALE} from '../constants'
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
  testSprite: Phaser.Sprite
  testSprite2: Phaser.Sprite
  controls: Control[]
  player: Player
  matrix: any
  timer: Phaser.Timer
  startButton: Phaser.Sprite
  tintTimer: Phaser.Timer
  movingBoxes: boolean
  selectControlSound: Phaser.Sound
  backgroundMusic: Phaser.Sound
  transmissionStarted: boolean
  currentLevel: Number
  words: WordData

  preload(): void {
   this.game.load.image('cursor', cursorImage)
   this.game.load.image('tile', tileTest)
   this.game.load.atlas('mainAtlas', atlasImage, atlasJson)
   this.game.load.audio('backgroundMusic', music)
   this.game.load.audio('placeControlSFX', placeControl)
   this.game.load.audio('placeControl2SFX', placeControl2)
   this.game.load.audio('removeControlSFX', removeControl)
  }

  createProblem() : String {
	let thisword    = this.words.getWordForLevel (this.currentLevel)
	let transforms = this.words.getTransformsForLevel (this.currentLevel)
	let problem : GameData = new GameData(this.words.getMaxNumberOfTransforms(), thisword.length)
	return problem.generateProblemSafe (thisword, transforms)
  }
 
  create(): void {
    this.currentLevel = 0
    this.words = new WordData();
  	let bg : Phaser.Image = new Phaser.Image(this.game, 0, 0, 'mainAtlas', 'bg.png')
  	bg.scale.set(SCALE)
    this.game.add.existing(bg)

    this.loadControls()
    this.setLines(this.createProblem())
    this.setStartTimerButton()
    this.tintTimer =  this.game.time.create(false)
    this.movingBoxes = false
    this.transmissionStarted = false
    this.selectControlSound = this.game.add.sound('placeControl2SFX')
    this.backgroundMusic = this.game.add.sound('backgroundMusic')
    this.backgroundMusic.play('', 0, 1, true)
  }

  update(): void {
    if (!this.movingBoxes && this.matrix.endOfLine()) {
      this.movingBoxes = true
      this.matrix.moveBoxesOut().then(result => {
        this.movingBoxes = false
        this.transmissionStarted = false
        this.matrix.resetData()
		this.currentLevel++
        this.setLines(this.createProblem())
      })
    }
  }

  setLines(word) {
    this.matrix = new Matrix(this.game, MATRIX_SIZE.WIDTH, word.length)
    this.matrix.drawMatrix()
    this.matrix.initialize(word)
    this.matrix.setSelectedControl(this.controls[0])
  }

  setStartTimerButton() {
    this.timer =  this.game.time.create(false)
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

  loadControls(): void {
    this.controls = [{
      id: TRANSFORM_SWAPDOWN,
      name: 'Swap',
    sprite: new Phaser.Sprite(this.game, 0, 0),      
      sprite_base: 'btn_swap',
	  spriteInLine: 'swap',
	  x: 16,
	  y: 48,
      timer:  this.game.time.create(false)
    },{
      id: TRANSFORM_CHANGECASE,
      name: 'Change Case',
	  sprite_base: 'btn_case',
    spriteInLine: 'case',
    sprite: new Phaser.Sprite(this.game, 0, 0),          
	  x: 16,
	  y: 100,
      timer:  this.game.time.create(false)      
    },{
      id: TRANSFORM_DECREMENT,
      name: 'Delete',
    sprite_base: 'btn_dec',
    sprite: new Phaser.Sprite(this.game, 0, 0),    
	  x: 16,
    y: 152,
    spriteInLine: 'dec',    
      timer:  this.game.time.create(false)      
    },{
      id: TRANSFORM_INCREMENT,
      name: 'Delete',
	  sprite_base: 'btn_inc',
    spriteInLine: 'inc',
    sprite: new Phaser.Sprite(this.game, 0, 0),        
	  x: 16,
	  y: 204,
      timer:  this.game.time.create(false)      
    },{
      id: TRANSFORM_NONE,
      name: 'Delete',
	  sprite_base: 'btn_del',
    spriteInLine: 'none',
    sprite: new Phaser.Sprite(this.game, 0, 0),
	  x: 16,
	  y: 256,
      timer:  this.game.time.create(false)      
    },]

    this.controls.forEach(control => {
	  control.sprite = new Phaser.Sprite(this.game, control.x, control.y, 'mainAtlas', control.sprite_base + '_0.png'),
	  control.sprite.scale.set(SCALE)
      this.game.add.existing(control.sprite)
      control.sprite.inputEnabled = true
	  control.sprite.animations.add('push', [control.sprite_base + '_1.png', control.sprite_base + '_0.png'], 10, false)
      control.sprite.events.onInputDown.add(this.handleClick, this, 0, control)
      this.game.physics.enable(control.sprite, Phaser.Physics.ARCADE);
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