import * as Phaser from 'phaser';
import { gameWidth, gameHeight } from '../config';

export class TitleScene extends Phaser.Scene {
	constructor() {
		super('titleScene');
	}

	preload() {}

	create() {
		this.scene.start('gameScene');
		this.add.image(0, 0, 'tatami').setOrigin(0).setScale(5, 5);

		this.addText(gameWidth / 2, gameHeight / 2, '将棋ローグライク', 60);

		const zone = this.add.zone(0, 0, gameWidth, gameHeight);
		zone.setOrigin(0);
		zone.setInteractive();

		this.cameras.main.fadeIn(1000, 0, 0, 0);
		this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
			zone.once('pointerdown', () => {
				this.cameras.main.fadeOut(1000, 0, 0, 0);
			});
		});
		this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
			this.scene.start('gameScene');
		});
	}
	addText(x: number, y: number, text: string, fontSize: number = 50) {
		return this.add
			.text(x, y, text, {
				fontSize: fontSize + 'px',
				fontStyle: 'mohitsu',
			})
			.setOrigin(0.5)
			.setPadding(0, 6, 0, 0);
	}
	changeScene(sceneName: string, delay: number = 1000) {
		let time = { now: 0 };
		this.tweens.add({
			targets: time,
			now: 1,
			duration: delay,
			onComplete: () => {
				this.scene.start(sceneName);
			},
		});
	}
}
