export class Utils {
  tweens: Phaser.Tween[]

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