/// <reference path="../../node_modules/phaser-ce/typescript/phaser.d.ts"/>
/// <reference path="../../node_modules/phaser-ce/typescript/pixi.d.ts"/>

import 'pixi'
import 'p2'
import 'phaser'

const logoImage = require('assets/phaser.png')

class SimpleGame {
    game: Phaser.Game;    
    constructor() {
        const config: Phaser.IGameConfig = {
            width:           800, 
            height:          600,
            renderer:        Phaser.AUTO,   
            parent:          'content',
            resolution:      1,
            forceSetTimeOut: false,
            state: { preload: this.preload, create: this.create }
        }
        this.game = new Phaser.Game(config)
    }


    preload() {
        this.game.load.image('logo', logoImage)
    }

    create() {
        const logo: Phaser.Sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo')

        const textStyle: Phaser.PhaserTextStyle = {
            font: "15px Arial", 
            fill: "#19de65" ,
            align:  'left',
            boundsAlignH: 'center',
            boundsAlignV: 'bottom'
        }
        const text: Phaser.Text = this.game.add.text(0, 0, 'Hello World!', textStyle)
        
        text.setTextBounds(16, 16, 768, 568)
        logo.anchor.setTo(0.5, 0.5)
    }

}

window.onload = () => {
    const game = new SimpleGame()
};