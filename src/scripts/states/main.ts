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
    this.matrix.setControlTest()

    // example of adding a hardcoded line.
    // {
    //   const lineSize = 10;
    //   for (let i = 0; i < lineSize; ++i)
    //   {
    //     let line : Phaser.Sprite = this.game.add.sprite(100 + 64 * i, 100, 'mainAtlas');
    //     if (i === 0)
    //       line.animations.add('move', ['line_l_0.png', 'line_l_1.png', 'line_l_2.png'], 10, true)
    //     else if (i === (lineSize - 1))
    //       line.animations.add('move', ['line_r_0.png', 'line_r_1.png', 'line_r_2.png'], 10, true)
    //     else
    //       line.animations.add('move', ['line_m_0.png', 'line_m_1.png', 'line_m_2.png'], 10, true)
  
    //      line.animations.play('move');
         
    //      // Maybe scale the game instead of the game object?
    //      line.scale.x = 2.0;
    //      line.scale.y = 2.0;
    //   }
    // }
    this.timer =  this.game.time.create(false)
    this.timer.loop(Phaser.Timer.SECOND, () => {
      console.log('tick')
      this.matrix.updateLettersPosition()
    })
    this.timer.start()
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