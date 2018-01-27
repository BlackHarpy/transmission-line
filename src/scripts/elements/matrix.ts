import { GameData } from '../../../testbed/gamebase.js'

export class Matrix {
  game: Phaser.Game
  gameData: any
  letters: Letter[][]
  cells: Phaser.Sprite[][]
  width: number
  height: number
  lettersPosition: number[][]

  constructor(game, width, height) {
    this.game = game
    this.gameData = new GameData(width, height)
    this.width = width
    this.height = height
    this.cells = []
    this.letters = []
    this.lettersPosition = [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
    ]
  }

  setLetters() {
    for(let i = 0; i < this.height; i++) {
      const row: Letter[] = []
      for(let j = 0; j < this.width; j++) {
        if (i === 0) {
          const blockCenter = {
            x: this.cells[i][j].centerX,
            y: this.cells[i][j].centerY,
          }
          row.push({
            value: 'a',
            sprite: new Phaser.Sprite(this.game, 0,0),
            text: this.game.add.text(blockCenter.x,  blockCenter.y, 'a')
          })
        }
      }
      this.letters.push(row)
    }
  }

  findLetterNextPosition(i, j) {
    this.lettersPosition[i][j] = 0
    // this.lettersPosition
  }

  updatePosition() {
    for(let i = 0; i < this.height; i++) {
      for(let j = 0; j < this.width; j++) {
        if (this.lettersPosition[i][j] === 1) {
          //move to next position

        }
      }
    }
  }

  drawMatrix() {
    for(let i = 0; i < this.height; i++) {
      const row: Phaser.Sprite[] = []
      for(let j = 0; j < this.width; j++) {
        const cell = this.game.add.sprite(100 + (75 * (i + 1)), 100 + (80 * (j + 1)), 'tile')
        row.push(cell)
      }
      this.cells.push(row)
    }
  }

  

}
