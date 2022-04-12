class Fade extends Phaser.GameObjects.Graphics {

    /**
     *
     * @param scene
     * @param fadeType - 0: fade in. 1: fade out.
     */
    constructor(scene, fadeType = 0) {
        super(scene);

        this.isComplete = false;
        this.scene = scene;
        this.scene.add.existing(this);
        this.alpha = fadeType;
        this.depth = 10;
        this.fillStyle(0x000000, 1).fillRect(0, 0, game_width, game_height);

        this.scene.tweens.add({
            targets: this,
            alpha: 1 - fadeType,
            duration: 1000,
            ease: "Power2",
            onComplete: () => {
                this.isComplete = true;
            }
        });
    }
}