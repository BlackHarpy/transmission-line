import { GameData } from '../../../testbed/gamebase.js'
import { TILE_SIZE } from '../constants'
import {TRANSFORM_NONE, TRANSFORM_SWAPUP, TRANSFORM_SWAPDOWN, TRANSFORM_CHANGECASE} from '../../../testbed/gamebase.js'

export class Matrix {
  game: Phaser.Game
  gameData: any
  letters: Letter[]
  cells: Cell[][]
  width: number
  height: number
  currentColumnPosition: number
  transmission: string

  constructor(game, width, height) {
    this.game = game
    this.gameData = new GameData(width, height)
    this.width = width
    this.height = height
    this.cells = []
    this.letters = []
    this.currentColumnPosition = 0
  }

  getCellSprite(i,j) {
    return this.cells[i][j].sprite
  }

  setLetters(splitWord) {
    splitWord.forEach((character, index) => {
      var spriteCharacter = new Phaser.Text(this.game, 0, 0, character)
      spriteCharacter.anchor.set(0.5, 0.5)
      spriteCharacter.position.set(this.getCellSprite(this.currentColumnPosition,index).centerX, this.getCellSprite(this.currentColumnPosition,index).centerY)
      this.game.add.existing(spriteCharacter)
      this.letters.push({
        value: character,
        sprite: new Phaser.Sprite(this.game, 0, 0),
        text: spriteCharacter
      })
    })
  }

  moveLetters() {
    this.letters.forEach((letter, index) => {
      letter.text.position.set(this.getCellSprite(this.currentColumnPosition,index).centerX, this.getCellSprite(this.currentColumnPosition,index).centerY)
    })
  }

  initialize(word) {
    this.transmission = word
    const splitWord = word.split('')
    this.currentColumnPosition = 0
    this.setLetters(splitWord)
  }

  updateLettersPosition() {
    if (this.currentColumnPosition + 1 < this.height) {
      this.currentColumnPosition++
      this.applyTransformations()
      this.moveLetters()
    }
  }

  applyTransformations() {
    this.transmission = this.gameData.applyTransforms(this.transmission, this.currentColumnPosition)
    this.letters.forEach((letter, index) => {
      letter.text.setText(this.transmission[index])
    })
    console.log(this.transmission)
  }

  drawMatrix() {
    for(let i = 0; i < this.height; i++) {
      const row: Cell[] = []
      for(let j = 0; j < this.width; j++) {
        const cell = this.game.add.sprite(100 + (75 * (i + 1)), 100 + (80 * (j + 1)), 'tile')
        row.push({
          transformValue: TRANSFORM_NONE,
          sprite: cell
        })
      }
      this.cells.push(row)
    }
  }

  setControl(cellPosition, control) {
    this.cells[cellPosition.x][cellPosition.y].transformValue = control
    this.gameData.setCell(cellPosition.x, cellPosition.y, control)
    //set graphic of control
  }

  setControlTest() {
    this.setControl({x: 1, y: 0}, TRANSFORM_CHANGECASE)
    this.setControl({x: 2, y: 1}, TRANSFORM_SWAPDOWN)
    this.setControl({x: 4, y: 3}, TRANSFORM_SWAPUP)
  }
}
