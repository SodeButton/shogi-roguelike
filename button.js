class Button extends Phaser.GameObjects.Container {
	/**
	 * @param scene
	 * @param x
	 * @param y
	 * @param text
	 * @param fontSize
	 * @param clickEvent	- クリックした時のイベント
	 */
	constructor(scene, x, y, text, fontSize, clickEvent) {
		super(scene, x, y);

		this.x = x;
		this.y = y;
		this.width = fontSize * text.length;
		this.height = fontSize + 16;
		this.text = text;
		this.fontSize = fontSize;
		this.isInteractive = true;
		this.setInteractive();
		this.isClick = false;

		this.scene = scene;
		this.scene.add.existing(this);

		this.buttonShadow = this.scene.add.graphics()
			.fillRoundedRect(this.x - this.width / 2 + 32, this.y - this.height / 2 + 32, this.width, this.height, 8)
			.fillStyle(0xff0000, 1);
		this.buttonShadow.depth = 11;

		this.buttonImage = this.scene.add.graphics()
			.fillRoundedRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, 8)
			.fillStyle(0x00ff00, 1);
		this.buttonImage.depth = 11;

		this.buttonText = this.scene.add.text(this.x, this.y, this.text, {
			fontSize: this.fontSize
		});
		this.buttonText.setOrigin(0.5, 0.5);
		this.buttonText.depth = 12;

		this.on("pointerdown", () => {
			if (!this.isClick && this.isInteractive) {
				clickEvent();
				this.isClick = true;
			}
		});
		this.on("pointerup", () => {
			this.isClick = false;
		})
	}
	setInteractive(hitArea, callback, dropZone) {
		this.isInteractive = true;
		return super.setInteractive(hitArea, callback, dropZone);
	}
	removeInteractive() {
		this.isInteractive = false;
		return super.removeInteractive();
	}
}