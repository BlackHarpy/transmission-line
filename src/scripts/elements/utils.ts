import { TRANSFORM_NONE, TRANSFORM_SWAPDOWN, TRANSFORM_CHANGECASE, TRANSFORM_DECREMENT, TRANSFORM_INCREMENT } from '../../../testbed/gamebase.js'

export class Utils {

  static getAllControls(game) {
    return [{
      id: TRANSFORM_SWAPDOWN,
      name: 'Swap',
    sprite: new Phaser.Sprite(game, 0, 0),      
      sprite_base: 'btn_swap',
	  spriteInLine: 'swap',
	  x: 16,
	  y: 48,
      timer:  game.time.create(false)
    },{
      id: TRANSFORM_CHANGECASE,
      name: 'Change Case',
	  sprite_base: 'btn_case',
    spriteInLine: 'case',
    sprite: new Phaser.Sprite(game, 0, 0),          
	  x: 16,
	  y: 100,
      timer:  game.time.create(false)      
    },{
      id: TRANSFORM_DECREMENT,
      name: 'Decrement',
    sprite_base: 'btn_dec',
    sprite: new Phaser.Sprite(game, 0, 0),    
	  x: 16,
    y: 152,
    spriteInLine: 'dec',    
      timer:  game.time.create(false)      
    },{
      id: TRANSFORM_INCREMENT,
      name: 'Increment',
	  sprite_base: 'btn_inc',
    spriteInLine: 'inc',
    sprite: new Phaser.Sprite(game, 0, 0),        
	  x: 16,
	  y: 204,
      timer:  game.time.create(false)      
    },{
      id: TRANSFORM_NONE,
      name: 'Delete',
	  sprite_base: 'btn_del',
    spriteInLine: 'none',
    sprite: new Phaser.Sprite(game, 0, 0),
	  x: 16,
	  y: 256,
      timer:  game.time.create(false)      
    }]
  }

  static createFallTween(game, sprite, position) {
      return new Promise<any>(resolve => {
        const tween = game.add.tween(sprite).to({ y: position }, 250, "Linear", true)
        tween.onComplete.add(() => {
          sprite.animations.add('bounce', ['letter_1.png', 'letter_2.png', 'letter_3.png',  'letter_2.png',  'letter_1.png'], 10, false)
          sprite.animations.play('bounce')
          resolve(true)
        })
      })
  }

  static moveFowardTween(game, sprite, position) {
    return new Promise<any>(resolve => {
      const tween = game.add.tween(sprite).to({ x: position }, 500, "Linear", true)
      tween.onComplete.add(() => {
        resolve(true)
      })
    })
  }

}