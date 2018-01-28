interface Player {
  selectedControl: number
}

interface Control {
  id: number
  name: string,
  sprite: Phaser.Sprite
  timer: Phaser.Timer
}

interface Letter {
  value: string
  sprite: Phaser.Sprite
  text: Phaser.Text
}

interface Cell {
  transformValue: number
  sprite: Phaser.Sprite
}