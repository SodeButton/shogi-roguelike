"use strict";
const game_width = 64 * 10; // 640
const game_height = 64 * 16; // 1024

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

		this.fade = this.add.graphics();
		this.fade.fillStyle(0x000000, 1).fillRect(0, 0, game_width, game_height);
		this.fade.alpha = 0;

		this.isClick = false;
		this.fadeTime = 0;

		this.input.once(
			"pointerdown",
			function () {
				this.tweens.add({
					targets: this.fade,
					alpha: 1,
					duration: 1000,
					ease: "Power2",
				});
				this.tweens.add({
					targets: this.bgm_title,
					volume: 0,
					duration: 1000,
					ease: "Power2",
				});
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

		if (this.isClick) {
			this.fadeTime += delta / 1000;
			if (this.fadeTime >= 1.0) {
				this.fadeTime = 0;
				this.bgm_title.stop();
				this.scene.start("gameScene");
			}
		}
	}
}

let gameData = {};
gameData.turn = "player";
gameData.select_object = null;
gameData.piecesBoard = [];
gameData.board = [];
gameData.handBoard = new Array(9);
gameData.pieceData = ["pawn", "lance", "knight", "silver", "gold", "bishop", "rook", "queen"];

let se = [];

for (let i = 0; i < 9; i++) {
	gameData.piecesBoard[i] = new Array(9).fill(null);
}

class GameScene extends Phaser.Scene {
	constructor() {
		super({ key: "gameScene" });
	}

	create() {
		this.drawBoard();

		let stage = this.cache.json.get("stage_data");
		let index = "0";
		for (let y = 0; y < 9; y++) {
			for (let x = 0; x < 9; x++) {
				if (stage[index][y][x] != null) {
					gameData.piecesBoard[y][x] = new Piece(this, x * 64 + 64, y * 64 + 256, stage[index][y][x], true);
				}
			}
		}
		gameData.piecesBoard[8][4] = new Piece(this, 4 * 64 + 64, 8 * 64 + 256, "king");

		this.isFade = false;
		this.fade = this.add.graphics();
		this.fade.fillStyle(0x000000, 1).fillRect(0, 0, game_width, game_height);
		this.fade.alpha = 1;
		this.fade.depth = 10;

		this.tweens.add({
			targets: this.fade,
			alpha: 0,
			duration: 1000,
			ease: "Power2",
		});

		this.bgm_game = this.sound.add("bgm_game");
		this.bgm_game.volume = 0.3;
		this.bgm_game.play();

		se.shogi = this.sound.add("se_shogi");
		se.kill = this.sound.add("se_kill");

		let particle = this.add.particles("piece_particle");
		particle.depth = 9;
		this.piece_particle = particle.createEmitter({
			x: game_width / 2,
			y: game_height / 2,
			on: false,
			lifespan: 300,
			maxParticles: 0,
			timeScale: 1,
			accelerationX: {
				ease: "Linear",
				min: -1000,
				max: 1000,
			},
			accelerationY: {
				ease: "Linear",
				min: -1000,
				max: 1000,
			},
			alpha: {
				start: 1,
				end: 0,
				ease: "Linear",
			},
			angle: {
				min: 0,
				max: 360,
				ease: "Linear",
			},
			maxVelocityX: 10000,
			maxVelocityY: 10000,
			scale: {
				start: 1,
				end: 0.5,
				ease: "Linear",
			},
			emitCallback: () => {
				this.piece_particle.on = false;
			},
		});

		this.isFade = false;
		this.fadeTime = 0;
		this.is_enemy_moved = false;
	}

	update(time, delta) {
		if (!this.isFade) {
			this.fadeTime += delta / 1000;
			if (this.fadeTime >= 1.0) {
				this.fadeTime = 0;
				this.isFade = true;
			}
			return;
		}

		let pointer = this.input.activePointer;
		if (pointer.isDown) {
			this.piece_particle.setPosition(pointer.x, pointer.y);
			this.piece_particle.on = true;
		}

		if (gameData.turn === "enemy") {
			for (let y = 0; y < 9; y++) {
				for (let x = 0; x < 9; x++) {
					if (gameData.piecesBoard[y][x] != null) {
						if (gameData.piecesBoard[y][x].isEnemy && !gameData.piecesBoard[y][x].isMoved) {
							let flag = gameData.piecesBoard[y][x].moveEnemy();
							if (!this.is_enemy_moved) {
								this.is_enemy_moved = flag;
							}
						}
					}
				}
			}
			if (!this.is_enemy_moved) {
				this.is_tween_turn = false;
				this.is_enemy_moved = false;
				gameData.tweenTime = 0;
				gameData.turn = "player";
			} else {
				if (!this.is_tween_turn) {
					this.is_tween_turn = true;
					this.tweens.add({
						targets: gameData,
						tweenTime: 100,
						duration: 1000,
						ease: "Linear",
						onComplete: () => {
							for (let y = 0; y < 9; y++) {
								for (let x = 0; x < 9; x++) {
									if (gameData.piecesBoard[y][x]?.isMoved) {
										gameData.piecesBoard[y][x].isMoved = false;
									}
								}
							}
							this.is_tween_turn = false;
							this.is_enemy_moved = false;
							gameData.tweenTime = 0;
							gameData.turn = "player";
						},
					});
				}
			}
		}
	}

	drawBoard() {
		let background = this.add.image(0, 0, "tatami");
		background.setOrigin(0, 0);
		background.displayWidth = game_width;
		background.displayHeight = game_height;
		background.depth = 0;

		for (let x = 0; x < 9; x++) {
			for (let y = 0; y < 9; y++) {
				let board = this.add.image(x * 64 + 64, y * 64 + 256, "board_chip");
				board.depth = 1;
			}
		}

		for (let x = 0; x < 9; x++) {
			let board = this.add.image(x * 64 + 64, 9 * 64 + 288, "board_chip");
			board.depth = 1;
			if (x < 8) {
				gameData.handBoard[x] = new Piece(this, x * 64 + 64, 9 * 64 + 288, gameData.pieceData[x]);
				gameData.handBoard[x].isHand = true;
				gameData.handBoard[x].tint = 0x555555;
				gameData.handBoard[x].count = 0;
				gameData.handBoard[x].textObject = this.add.text(64 * (x + 1) + 12, 9 * 64 + 290, gameData.handBoard[x].count + "", {
					fontSize: "40px",
					fontFamily: "BrushFont",
					color: "#00ff00",
					padding: { left: 0, right: 0, bottom: 0, top: 4 },
				});
				gameData.handBoard[x].textObject.setOrigin(0, 0);
				gameData.handBoard[x].textObject.depth = 5;
			}
		}
	}
}

function Random(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

const config = {
	type: Phaser.AUTO,
	parent: "canvas",
	width: game_width,
	height: game_height,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
	},
	pixelArt: true,
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 0 },
		},
	},
	scene: [LogoScene, LoadScene, StartScene, GameScene],
};

let game = new Phaser.Game(config);
