"use strict";
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
		this.fade = new Fade(this, 1);

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
		this.is_enemy_moved = false;
	}

	update(time, delta) {
		if (!this.fade.isComplete) {
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
						duration: 500,
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