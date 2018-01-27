/// <reference path="../types.d.ts"/>

import { State } from '../state'
import { Matrix } from '../elements/matrix'
const cursorImage = require('assets/test-sprite.gif')
const tileTest = require('assets/block.png')

export class MainState extends State {
  testSprite: Phaser.Sprite
  testSprite2: Phaser.Sprite
  controls: Control[]
  player: Player
  matrix: any

  preload(): void {
   this.game.load.image('cursor', cursorImage)
   this.game.load.image('tile', tileTest)
  }

  create(): void {
    this.setControls()
    this.matrix = new Matrix(this.game, 5,5)
    this.matrix.drawMatrix()
    this.matrix.initialize('holas')
    this.matrix.setControlTest()
  }

  update(): void {
  }

  setControls(): void {
    this.controls = [{
      id: 1,
      name: 'Control 1',
      sprite: new Phaser.Sprite(this.game, 50, 50, 'cursor')
    },
    {
      id: 2,
      name: 'Control 2',
      sprite: new Phaser.Sprite(this.game, 50, 80, 'cursor')
    }]

    this.controls.forEach(control => {
      this.game.add.existing(control.sprite)
      control.sprite.inputEnabled = true
      control.sprite.events.onInputDown.add(this.handleClick, this, 0, control.id)
    })
  }

  setEvents(): void {
    this.testSprite.events.onInputDown.add(this.handleClick, this)
  }

  handleClick(sprite, pointer, id): void {
    console.log('click one time', id)
  }

}