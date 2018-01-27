/// <reference path="../types.d.ts"/>

import { State } from '../state'
import { GameData } from '../../../testbed/gamebase.js'

const cursorImage = require('assets/test-sprite.gif')

export class MainState extends State {
  testSprite: Phaser.Sprite
  testSprite2: Phaser.Sprite
  controls: Control[]
  player: Player

  preload(): void {
   this.game.load.image('cursor', cursorImage)
  }

  create(): void {
    this.setControls()
    console.log(GameData)
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