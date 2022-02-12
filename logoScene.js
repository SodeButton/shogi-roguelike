"use strict";
class LogoScene extends Phaser.Scene {
	constructor() {
		super({ key: "logoScene" });
	}

	preload() {
		this.load.setPath("./Resources/Logos");
		this.load.image("phaser_logo", "./PhaserLogo.png");
	}

	create() {
		this.logo = this.add.image(game_width / 2, game_height / 2, "phaser_logo");
		this.logo.setOrigin(0.5, 0.5);
		this.logo.alpha = 0;
		this.tweens.add({
			targets: this.logo,
			alpha: 1,
			duration: 1000,
			ease: "Power2",
		});
		this.isClick = true;
		this.fadeTime = 0;
	}

	update(time, delta) {
		this.fadeTime += delta / 1000;
		if (this.isClick) {
			if (this.fadeTime >= 2) {
				this.fadeTime = 0;
				this.isClick = false;
				this.tweens.add({
					targets: this.logo,
					alpha: 0,
					duration: 1000,
					ease: "Power2",
				});
			}
		} else {
			if (this.fadeTime >= 1) {
				this.fadeTime = 0;
				this.isClick = false;
				this.scene.start("loadScene");
			}
		}
	}
}