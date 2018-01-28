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
  selectedControl: number
  hightlightActive: boolean
  hightlightTimer: Phaser.Timer

  constructor(game, width, height) {
    this.game = game
    this.gameData = new GameData(width, height)
    this.width = width
    this.height = height
    this.cells = []
    this.letters = []
    this.currentColumnPosition = 0
    this.hightlightTimer = this.game.time.create(false)
    this.hightlightActive = false
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
  }

  drawMatrix() {
    for(let i = 0; i < this.height; i++) {
      const row: Cell[] = []
      for(let j = 0; j < this.width; j++) {
        const cell = this.setCellSprite(i, j)
        row.push({
          transformValue: TRANSFORM_NONE,
          sprite: cell
        })
      }
      this.cells.push(row)
    }
  }

  setCellSprite(i, j) {
    const cellSprite = new Phaser.Sprite(this.game, 100 + (TILE_SIZE.HEIGHT * (i + 1)), 100 + (TILE_SIZE.WIDTH * (j + 1)), 'tile')
    cellSprite.inputEnabled = true
    cellSprite.events.onInputDown.add(this.handleCellClick, this, 0, i, j)
    cellSprite.events.onInputOver.add(this.handleCellPointerOver, this, 0, i, j)
    cellSprite.events.onInputOut.add(this.handleCellPointerOut,  this, 0, i, j)
    return this.game.add.existing(cellSprite)
  }

  

  setSelectedControl(controlValue) {
    console.log('control id', controlValue)
    this.selectedControl = controlValue
    this.hightlightActive = true
  }

  setControl(cellPosition, control) {
    this.cells[cellPosition.x][cellPosition.y].transformValue = control
    this.gameData.setCell(cellPosition.x, cellPosition.y, control)
    console.log(this.cells)
    this.gameData.debugPrintProblem()
    //set graphic of control
  }

  getAvailableTiles(i,j) {
    let available = [this.cells[i][j].sprite]
    switch (this.selectedControl) {
      case TRANSFORM_SWAPDOWN: 
        if (j < this.height - 1) {
          available.push(this.cells[i][j + 1].sprite)
        } else {
          available = []
        }
    }
    return available
  }

  handleCellClick(sprite, pointer, i, j) {
    this.setControl({x: i, y: j}, this.selectedControl)
  }

  handleCellPointerOver(sprite, pointer, i, j) {
    if (this.hightlightActive) {
      const availableTiles = this.getAvailableTiles(i, j)
      availableTiles.forEach(tile => {
        this.hightlightControl(tile)

      })
    }
  }

  handleCellPointerOut(sprite, pointer, i, j) {
    const availableTiles = this.getAvailableTiles(i, j)
      availableTiles.forEach(tile => {
        this.resetFocus(tile)
      })
  }

  hightlightControl(sprite): void {
    enum tints {
      light = 0xffffff,
      dark = 0x918e8c
    }
    let key: boolean = true
    this.hightlightTimer.loop(Phaser.Timer.QUARTER / 2, () => {
      key = !key
      sprite.tint = key ? tints.dark : tints.light
    })
    this.hightlightTimer.start()
  }

  resetFocus(sprite): void {
    this.hightlightTimer.stop()
    sprite.tint = 0xffffff
  }


}
