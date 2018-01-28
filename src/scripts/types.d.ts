interface Player {
  selectedControl: number
}

interface Control {
  id: number
  name: string,
  sprite_base: string,
  x: number,
  y: number,
  sprite: Phaser.Sprite
  timer: Phaser.Timer,
  spriteInLine: string
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