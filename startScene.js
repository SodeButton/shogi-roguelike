"use strict";
class StartScene extends Phaser.Scene {
	constructor() {
		super({ key: "startScene" });
	}

	preload() {}

	create() {
		let background = this.add.image(0, 0, "tatami");
		background.setOrigin(0, 0);
		background.displayWidth = game_width;
		background.displayHeight = game_height;
		this.title = this.add.text(game_width / 2, game_height / 4, "将棋ローグライク", {
			fontSize: "60px",
			fontFamily: "BrushFont",
			color: "#000000",
			padding: { left: 0, right: 0, bottom: 0, top: 4 },
		});
		this.title.setOrigin(0.5, 0.5);

		this.tapText = this.add.text(game_width / 2, game_height * 0.7, "スタート", {
			fontSize: "30px",
			fontFamily: "BrushFont",
			color: "#000000",
			padding: { left: 0, right: 0, bottom: 0, top: 4 },
		});
		this.tapText.setOrigin(0.5, 0.5);

		this.versionText = this.add.text(30, game_height - 10, "Ver beta0.0.3", {
			fontSize: "30px",
			fontFamily: "BrushFont",
			color: "#000000",
			padding: { left: 0, right: 0, bottom: 0, top: 4 },
		});
		this.versionText.setOrigin(0, 1);

		this.copyrightText = this.add.text(game_width - 30, game_height - 10, "(c)2021 Button", {
			fontSize: "30px",
			fontFamily: "BrushFont",
			color: "#000000",
			padding: { left: 0, right: 0, bottom: 0, top: 4 },
		});
		this.copyrightText.setOrigin(1, 1);

		this.bgm_title = this.sound.add("bgm_title");
		this.bgm_title.volume = 0.3;
		this.bgm_title.play();

		this.isClick = false;

		this.input.once(
			"pointerdown",
			function () {
				this.tweens.add({
					targets: this.bgm_title,
					volume: 0,
					duration: 1000,
					ease: "Power2",
				});
				this.fade = new Fade(this, 0);
				this.isClick = true;
			},
			this
		);
	}

	update(time, delta) {
		this.title.updateText();
		this.tapText.updateText();
		this.versionText.updateText();
		this.copyrightText.updateText();

		if (this.isClick && this.fade.isComplete) {
			this.bgm_title.stop();
			this.scene.start("gameScene");
		}
	}
}