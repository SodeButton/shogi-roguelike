"use strict";
class LoadScene extends Phaser.Scene {
	constructor() {
		super({ key: "loadScene" });
	}

	preload() {
		let progressBar = this.add.graphics();
		let progressBox = this.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(game_width / 2 - 250, game_height / 2 - 30, 500, 60);

		let text = this.add.text(game_width / 2, (game_height / 5) * 3, "load", {
			fontSize: "40px",
			fontFamily: "BrushFont",
		});
		text.setOrigin(0.5, 0.5);

		//ロードが進行したときの処理
		this.load.on("progress", function (value) {
			progressBar.clear();
			progressBar.fillStyle(0xffffff, 1);
			progressBar.fillRect(game.scale.width / 2 - 250, game.scale.height / 2 - 30, 500 * value, 60);
		});

		//ファイルのロードに入ったときの処理
		this.load.on("fileprogress", function (file) {
			text.text = file.key;
		});

		//すべてのロードが完了したときの処理
		this.load.on("complete", function () {
			text.text = "complete";
		});
		this.load.setPath("./Resources/Sprites");

		this.load.image("king", "./king.png");
		this.load.image("queen", "./queen.png");
		this.load.image("rook", "./rook.png");
		this.load.image("rook_nari", "./rook_nari.png");
		this.load.image("bishop", "./bishop.png");
		this.load.image("bishop_nari", "./bishop_nari.png");
		this.load.image("gold", "./gold.png");
		this.load.image("silver", "./silver.png");
		this.load.image("silver_nari", "./silver_nari.png");
		this.load.image("knight", "./knight.png");
		this.load.image("knight_nari", "./knight_nari.png");
		this.load.image("lance", "./lance.png");
		this.load.image("lance_nari", "./lance_nari.png");
		this.load.image("pawn", "./pawn.png");
		this.load.image("pawn_nari", "./pawn_nari.png");
		this.load.image("piece_particle", "./piece_particle.png");
		this.load.image("board_chip", "./board_chip.png");
		this.load.image("input_board_chip", "./input_board_chip.png");
		this.load.image("enemy_board_chip", "./enemy_board_chip.png");
		this.load.image("tatami", "./tatami.jpg");
		this.load.image("window", "./window.png");

		this.load.setPath("./Resources/Audios");
		this.load.audio("se_shogi", "./se_shogi.wav");
		this.load.audio("se_kill", "./se_kill.mp3");
		this.load.audio("bgm_title", "./bgm_title.mp3");
		this.load.audio("bgm_game", "./bgm_game.mp3");

		this.load.setPath("./");
		this.load.json("stage_data", "./stage_data.json");
		this.load.script("piece_class", "./piece.js");
	}

	create() {
		this.scene.start("startScene");
	}
}