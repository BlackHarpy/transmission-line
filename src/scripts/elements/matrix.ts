import { GameData } from '../../../testbed/gamebase.js'
import { Utils } from './utils'
import { TILE_SIZE, SCALE, START_POINT, LINE_SPACE, MATRIX_START_X } from '../constants'
import { TRANSFORM_NONE, TRANSFORM_SWAPDOWN, TRANSFORM_CHANGECASE, TRANSFORM_INCREMENT, TRANSFORM_DECREMENT } from '../../../testbed/gamebase.js'

export class Matrix {
  game: Phaser.Game
  gameData: any
  letters: Letter[]
  cells: Cell[][]
  width: number
  height: number
  currentColumnPosition: number
  transmission: string
  selectedControl: Control
  hightlightActive: boolean
  hightlightTimer: Phaser.Timer
  textStyle: Phaser.PhaserTextStyle
  placeControlSound: Phaser.Sound
  lineEndSprite: Phaser.Sprite[][]
  placedControls: any[]
  recievers: Phaser.Sprite[]
  solutionLetters: Phaser.Text[]

  constructor(game, width, height) {
    this.game = game
    this.gameData = new GameData(width, height)
    this.width = width
    this.height = height
    this.cells = []
    this.letters = []
    this.lineEndSprite = []
    this.placedControls = []
    this.recievers = []
    this.solutionLetters = []
    this.currentColumnPosition = 0
    this.hightlightTimer = this.game.time.create(false)
    this.hightlightActive = false
    this.textStyle = { font: "22px Courier", fill: "#fff", strokeThickness: 4 }
    this.placeControlSound = this.game.add.sound('placeControlSFX')
  }

  resetData() {
    this.deleteLines()
    this.deleteBoxes()
    this.deleteReceivers()
    this.deleteSolutionLetters()
    this.deleteControls()
    this.cells = []
    this.letters = []
    this.lineEndSprite = []
    this.currentColumnPosition = 0    
  }

  getCellSprite(i, j) {
    return this.cells[i][j].sprite
  }

  setLetters(splitWord) {
    splitWord.forEach((character, index) => {
      const x = this.lineEndSprite[0][index].centerX
      const y = this.lineEndSprite[0][index].centerY - 30

      const spriteCharacter = new Phaser.Text(this.game, 0, 0, character, this.textStyle)
      const boxSprite = this.setBoxSprite(x, 0)   
      boxSprite.anchor.set(0.5, 0.5)

      Utils.createFallTween(this.game, boxSprite, y)

      spriteCharacter.anchor.set(0.5, 0.5)      
      spriteCharacter.position.set(boxSprite.centerX, y)
      this.game.add.existing(spriteCharacter)

      this.letters.push({
        value: character,
        sprite: boxSprite,
        text: spriteCharacter
      })
    })
  }

  moveLetters() {
      const promises = []
      this.startLinesAnimation()
      this.letters.forEach((letter, index) => {
        const x = this.getCellSprite(this.currentColumnPosition, index).centerX
        const y = this.getCellSprite(this.currentColumnPosition, index).centerY
        //letter.text.position.set(x + 30, y - 30)
        //letter.sprite.position.set(x, y - 60)
        promises.push(Utils.moveFowardTween(this.game, letter.text, x))
        promises.push(Utils.moveFowardTween(this.game, letter.sprite, x))
      })
      return Promise.all(promises).then(resolve => {
        this.stopLinesAnimation()
      })
    
  }

  initialize(word) {
    this.transmission = word
    const splitWord = word.split('')
    this.currentColumnPosition = -1
    this.setLetters(splitWord)
  }

  updateLettersPosition() {
    if (this.currentColumnPosition + 1 < this.width) {
      this.currentColumnPosition++
      
      this.moveLetters().then(resolve => {
        this.applyTransformations()
        
        Promise.all(this.turnOnControls()).then(result => {
        })  
      })
    } else {
      this.currentColumnPosition++
    }
  }

  turnOnControls() {
    const promises = []
    this.placedControls.forEach(control => {
      if (control.position.x === this.currentColumnPosition) {
        control.sprite.loadTexture(control.sprite.key,  control.key + '_1.png')
        promises.push(new Promise(resolve => {
          this.game.time.events.add(Phaser.Timer.HALF + Phaser.Timer.QUARTER, function () {
         control.sprite.loadTexture(control.sprite.key,  control.key + '_0.png')
            
            resolve(true)
          }, this);
        }))
      }
    })
    return promises
  }

  applyTransformations() {
    this.transmission = this.gameData.applyTransforms(this.transmission, this.currentColumnPosition)
    this.letters.forEach((letter, index) => {
      letter.text.setText(this.transmission[index])
    })
  }

  drawMatrix() {
    this.addEndsOfLinesSprites()
    for (let i = 0; i < this.width; i++) {
      const row: Cell[] = []
      for (let j = 0; j < this.height; j++) {
        const cell = this.setCellSprite(i, j)
        row.push({
          transformValue: TRANSFORM_NONE,
          sprite: cell
        })
      }
      this.cells.push(row)
    }
    this.addRecievers()
  }
  
  checkSolution () {
	for(let i = 0; i < this.solutionLetters.length; i++) {
		if (this.transmission[i] == this.solutionLetters[i].text) {
			this.recievers[i].animations.play('good');
		} else {
			this.recievers[i].animations.play('bad');
		}
	}
  }

  addRecievers() {
    for(let i = 0; i < this.height; i++) {
      const x = START_POINT.X + (TILE_SIZE.WIDTH * SCALE * (this.width + 2) + 32)
      const y = START_POINT.Y - 40 + (LINE_SPACE * i)
      const table: Phaser.Sprite = new Phaser.Sprite(this.game, x, y, 'mainAtlas', 'table_normal.png');
	  table.animations.add('good', ['table_normal.png', 'table_good.png'], 10, false)
	  table.animations.add('bad', ['table_normal.png', 'table_bad.png'], 10, false)
      table.scale.set(SCALE)
      this.game.add.existing(table)
      this.recievers.push(table) 
      let text =  new Phaser.Text(this.game, x + 20, y + 52, '', this.textStyle)
      this.solutionLetters.push(text)  
	  this.game.add.existing(text)	  
    }
  }

  setSolution(word) {
	for(let i = 0; i < this.solutionLetters.length; i++) {
		if (i < word.length) {
			this.solutionLetters[i].text = word[i]
		} else {
			this.solutionLetters[i].text = " "
		}
		
	}
  }

  addEndsOfLinesSprites() {
    const left = []
    const right = []    
    for(let i = 0; i < this.height; i++) {
      const x = START_POINT.X
      const y = START_POINT.Y + (LINE_SPACE * i)
      const line: Phaser.Sprite = new Phaser.Sprite(this.game, x, y, 'mainAtlas', 'line_l_0.png');
      line.scale.set(SCALE)
      line.animations.add('move', ['line_l_0.png', 'line_l_1.png', 'line_l_2.png'], 10, true)
      this.game.add.existing(line)
      left.push(line)            
    }
    this.lineEndSprite.push(left)
    for(let i = 0; i < this.height; i++) {
      const x = START_POINT.X + (TILE_SIZE.WIDTH * SCALE * (this.width + 1))
      const y = START_POINT.Y + (LINE_SPACE * i)
      const line: Phaser.Sprite = new Phaser.Sprite(this.game, x, y, 'mainAtlas', 'line_r_0.png');
      line.scale.set(SCALE)
      line.animations.add('move', ['line_r_0.png', 'line_r_1.png', 'line_r_2.png'], 10, true)
      this.game.add.existing(line)
      right.push(line)            
    }
    this.lineEndSprite.push(right)
  }

  setCellSprite(i, j) {
    const cellSprite = this.setLineSprite(i, j)
    cellSprite.inputEnabled = true
    cellSprite.events.onInputDown.add(this.handleCellClick, this, 0, i, j)
    cellSprite.events.onInputOver.add(this.handleCellPointerOver, this, 0, i, j)
    cellSprite.events.onInputOut.add(this.handleCellPointerOut, this, 0, i, j)
    return this.game.add.existing(cellSprite)
  }

  setSelectedControl(control) {
    this.selectedControl = control
    this.hightlightActive = true
  }

  setControl(cellPosition, control) {
    console.log('control id', control)    
    const result = this.gameData.setCellWithRestrictions(cellPosition.x, cellPosition.y, control.id)
    if (result) {
      if (control.id === TRANSFORM_NONE) {
        const index = this.placedControls.findIndex(control => {
          return control.position.x === cellPosition.x
        })
        this.placedControls[index].sprite.destroy()
        this.placedControls.splice(index, 1);
      } else {
        this.cells[cellPosition.x][cellPosition.y].transformValue = control
        const spritePosition = {
          x: this.cells[cellPosition.x][cellPosition.y].sprite.x,
          y: this.cells[cellPosition.x][cellPosition.y].sprite.y - 70
  
        }
        const controlSprite =  new Phaser.Sprite(this.game, 0, 0,  'mainAtlas', control.spriteInLine + '_0.png')
        controlSprite.scale.set(SCALE)
        controlSprite.position.set(spritePosition.x, spritePosition.y)
        this.game.add.existing(controlSprite)
        this.placedControls.push({sprite: controlSprite, position: cellPosition, key: control.spriteInLine})
        this.placeControlSound.play()  
      }
    }
    this.gameData.debugPrintProblem()
  }

  getAvailableTiles(i, j) {
    let available = []
      available = [this.cells[i][j]]
      console.log(this.selectedControl)
      switch (this.selectedControl.id) {
        case TRANSFORM_SWAPDOWN:
          if (j < this.height - 1) {
            available.push(this.cells[i][j + 1])
          } else {
            available = []
          }
      }
    return available
  }

  handleCellClick(sprite, pointer, i, j) {
    this.setControl({ x: i, y: j }, this.selectedControl)
  }

  handleCellPointerOver(sprite, pointer, i, j) {
    if (this.hightlightActive) {
      const availableTiles = this.getAvailableTiles(i, j)
      availableTiles.forEach(tile => {
        this.hightlightControl(tile.sprite)
      })
    }
  }

  handleCellPointerOut(sprite, pointer, i, j) {
    const availableTiles = this.getAvailableTiles(i, j)
    availableTiles.forEach(tile => {
      this.resetFocus(tile.sprite)
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

  setLineSprite(i, j): Phaser.Sprite {
    const x =  MATRIX_START_X + (TILE_SIZE.WIDTH * SCALE) * i
    const y =  j === 0 ? START_POINT.Y : START_POINT.Y + (LINE_SPACE * (j)) 
    const line: Phaser.Sprite = new Phaser.Sprite(this.game, x, y, 'mainAtlas',  'line_m_1.png');
    line.animations.add('move', ['line_m_0.png', 'line_m_1.png', 'line_m_2.png'], 10, true)
    line.scale.set(SCALE)
    return line
  }

  setBoxSprite(x, y): Phaser.Sprite {
    const box: Phaser.Sprite = new Phaser.Sprite(this.game, x, y, 'mainAtlas', 'letter_1.png')
    box.scale.set(SCALE)
    this.game.add.existing(box)
    return box
  }

  moveBoxesOut() {
    return new Promise(resolve => {
      const promises = []
      this.letters.forEach(letter => {
        promises.push(Utils.moveFowardTween(this.game, letter.sprite, letter.sprite.x + 150))        
        promises.push(Utils.moveFowardTween(this.game, letter.text, letter.sprite.x + 150))
      })
  
      Promise.all(promises).then(result => {
        resolve(true)
      })
    })    
  }

  startLinesAnimation() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.cells[i][j].sprite.animations.play('move')
        if (i === 0 || i === 1) {
          this.lineEndSprite[i][j].animations.play('move')
        }
      }
    }

  }

  stopLinesAnimation() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.cells[i][j].sprite.animations.stop('move')
        if (i === 0 || i === 1) {
          this.lineEndSprite[i][j].animations.stop('move')
        }
      }
    }
  }

  endOfLine(): boolean {
    return this.currentColumnPosition > this.width - 1
  }

  deleteBoxes() {
    this.letters.forEach(box => {
      box.sprite.destroy()
      box.text.destroy()
    })
    this.letters = []
  }
  
  deleteReceivers() {
    this.recievers.forEach(recv => {
      recv.destroy()
    })
    this.recievers = []
  }
  
  deleteSolutionLetters() {
    this.solutionLetters.forEach(letter => {
      letter.destroy()
    })
    this.solutionLetters = []
  }

  deleteLines() {
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        this.cells[i][j].sprite.destroy()
        if (i === 0 || i === 1) {
          this.lineEndSprite[i][j].destroy()
        }
      }
    }
  }

  deleteControls() {
    this.placedControls.forEach(control => {
      control.sprite.destroy()
    })
  }

}
