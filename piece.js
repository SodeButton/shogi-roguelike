const promoted_list = ["pawn", "lance", "knight", "silver", "bishop", "rook"];
class Piece extends Phaser.GameObjects.Image {
	constructor(scene, x, y, texture, isEnemy = false) {
		super(scene, x, y, texture, 0);

		this.scene = scene;
		this.scene.add.existing(this);
		this.x = x;
		this.y = y;
		this.texture = texture;
		this.name = texture;
		this.select = false;
		this.depth = 4;
		this.isHand = false;
		this.isEnemy = isEnemy;
		this.isMoved = false;
		this.canPremoted = false;

		if (!this.isEnemy) {
			this.setInteractive().on("pointerdown", (pointer, localX, localY, event) => {
				this.touchThisObject(pointer, localX, localY, event);
			});
		}

		for (const i of promoted_list) {
			if (this.name === i) {
				this.canPremoted = true;
				break;
			}
		}

		this.shadowObject = this.scene.add.image(x + 4, y + 4, texture);
		this.shadowObject.depth = 3;
		this.shadowObject.tint = 0x000000;
		this.shadowObject.alpha = 0.6;
		if (this.isEnemy) {
			this.setAngle(180);
			this.shadowObject.setAngle(180);
		}

		this.touchSensorObjects = this.scene.add.group();
	}

	// select this object.
	selectThisObject() {
		if (gameData.select_object == null) {
			this.select = true;
			gameData.select_object = this;
			this.setShadow(true);
			this.searchMovementPos();
			return true;
		} else {
			if (this === gameData.select_object) {
				gameData.select_object = null;
				this.setShadow(false);
				this.touchSensorObjects.clear(this.scene, true);
				se.shogi.play();
			}
			return false;
		}
	}

	// visible shadow.
	setShadow(flag) {
		if (flag) {
			this.shadowObject.x = this.x + 10;
			this.shadowObject.y = this.y + 10;
			this.shadowObject.alpha = 0.6;
		} else {
			this.shadowObject.x = this.x + 4;
			this.shadowObject.y = this.y + 4;
			this.shadowObject.alpha = 0.6;
		}
	}

	// if touched this object.
	touchThisObject() {
		if (gameData.turn === "player") {
			if (this.isHand) {
				if (this.count > 0) {
					this.selectThisObject();
				}
			} else {
				this.selectThisObject();
			}
		}
	}

	touchHandMovablePos(x, y) {
		this.touchSensorObjects.clear(this.scene, true);
		this.setShadow(false);
		this.select = false;
		this.count--;
		if (this.count <= 0) {
			this.tint = 0x555555;
		}
		gameData.select_object = null;
		gameData.piecesBoard[y][x] = new Piece(this.scene, x * 64 + 64, y * 64 + 256, this.texture);
		let index = gameData.pieceData.indexOf(this.name);
		gameData.handBoard[index].textObject.text = gameData.handBoard[index].count + "";
		se.shogi.play();
		gameData.turn = "enemy";
	}

	// if touched movable position.
	touchMovablePos(x, y, oldX, oldY, isEnemyPos) {
		this.touchSensorObjects.clear(this.scene, true);
		this.x = x * 64 + 64;
		this.y = y * 64 + 256;
		this.select = false;
		this.setShadow(false);
		if (isEnemyPos) {
			gameData.piecesBoard[y][x].getEnemy();
		}
		gameData.select_object = null;
		gameData.piecesBoard[y][x] = this;
		gameData.piecesBoard[oldY][oldX] = null;
		se.shogi.play();
		if (y <= 0) {
			// TODO:版の移動
			if (this.name === "king") {
				
			}
		}
		if (y < 3 && this.canPremoted) {
			// TODO:成りの追加
			let wx = x * 64 + 64;
			let wy = y * 64 + 256;
			let width = 160;
			let height = 96;
			if (x <= 4) {
				this.showPromotedWindow(x, y, wx, wy, width, height);
			} else {
				this.showPromotedWindow(x, y, wx - width, wy, width, height);
			}

		}
		gameData.turn = "enemy";
	}

	showPromotedWindow(x, y, wx, wy, width, height) {
		gameData.piecesBoard[y][x].window = this.scene.add.graphics();
		gameData.piecesBoard[y][x].window.fillStyle(0xffffff, 0.7).fillRect(wx, wy, width, height);
		gameData.piecesBoard[y][x].window.depth = 7;
	}

	// get enemy piece.
	getEnemy() {
		this.destroy();
		this.shadowObject.destroy();

		let index = gameData.pieceData.indexOf(this.name);
		gameData.handBoard[index].count++;
		gameData.handBoard[index].tint = 0xffffff;
		gameData.handBoard[index].textObject.text = gameData.handBoard[index].count + "";
	}

	// search movement position.
	searchMovementPos() {
		let x = (this.x - 64) / 64;
		let y = (this.y - 256) / 64;

		if (this.isHand) {
			for (let boardY = 0; boardY < 9; boardY++) {
				for (let boardX = 0; boardX < 9; boardX++) {
					if (gameData.piecesBoard[boardY][boardX] == null) {
						let object = this.scene.add.image(boardX * 64 + 64, boardY * 64 + 256, "input_board_chip");
						object.depth = 2;
						object.setInteractive().on("pointerdown", () => {
							this.touchHandMovablePos(boardX, boardY);
						});
						this.touchSensorObjects.add(object);
					}
				}
			}
			return;
		}
		let dx = 0;
		let dy = 0;
		switch (this.name) {
			case "king":
				for (dy = -1; dy <= 1; dy++) {
					for (dx = -1; dx <= 1; dx++) {
						if (x + dx >= 0 && x + dx <= 8 && y + dy >= 0 && y + dy <= 8) {
							this.putMovableBoard(x, y, dx, dy);
						}
					}
				}
				break;
			case "pawn":
				dy = -1;
				if (y + dy >= 0) {
					this.putMovableBoard(x, y, dx, dy);
				}
				break;
			case "lance":
				for (dy = -1; y + dy >= 0; dy--) {
					let result = this.putMovableBoard(x, y, dx, dy);
					if (result) {
						break;
					}
				}
				break;
			case "knight":
				dy = -2;
				for (dx = -1; dx <= 1; dx += 2) {
					if (x + dx >= 0 && x + dx <= 8 && y + dy >= 0 && y + dy <= 8) {
						this.putMovableBoard(x, y, dx, dy);
					}
				}
				break;
			case "silver":
				for (dy = -1; dy <= 1; dy += 2) {
					for (dx = -1; dx <= 1; dx++) {
						if (x + dx >= 0 && x + dx <= 8 && y + dy >= 0 && y + dy <= 8) {
							if (!(dy === 1 && dx === 0)) {
								this.putMovableBoard(x, y, dx, dy);
							}
						}
					}
				}
				break;
			case "gold":
				for (dy = -1; dy <= 1; dy++) {
					for (dx = -1; dx <= 1; dx++) {
						if (x + dx >= 0 && x + dx <= 8 && y + dy >= 0 && y + dy <= 8) {
							if (!(dy === 1 && dx !== 0)) {
								this.putMovableBoard(x, y, dx, dy);
							}
						}
					}
				}
				break;
			case "bishop":
				for (dy = 1; y + dy <= 8 && x + dy <= 8; dy++) {
					let result = this.putMovableBoard(x, y, dy, dy);
					if (result) break;
				}
				for (dy = -1; y + dy >= 0 && x + dy >= 0; dy--) {
					let result = this.putMovableBoard(x, y, dy, dy);
					if (result) break;
				}
				for (dy = 1; y - dy >= 0 && x + dy <= 8; dy++) {
					let result = this.putMovableBoard(x, y, dy, -dy);
					if (result) break;
				}
				for (dy = -1; y - dy <= 8 && x + dy >= 0; dy--) {
					let result = this.putMovableBoard(x, y, dy, -dy);
					if (result) break;
				}
				break;
			case "rook":
				for (dy = 1; y + dy <= 8; dy++) {
					let result = this.putMovableBoard(x, y, dx, dy);
					if (result) break;
				}
				for (dy = -1; y + dy >= 0; dy--) {
					let result = this.putMovableBoard(x, y, dx, dy);
					if (result) break;
				}
				dy = 0;
				for (dx = 1; x + dx <= 8; dx++) {
					let result = this.putMovableBoard(x, y, dx, dy);
					if (result) break;
				}
				for (dx = -1; x + dx >= 0; dx--) {
					let result = this.putMovableBoard(x, y, dx, dy);
					if (result) break;
				}
				break;
			case "queen":
				for (dy = -1; dy <= 1; dy++) {
					for (dx = -1; dx <= 1; dx++) {
						if (x + dx >= 0 && x + dx <= 8 && y + dy >= 0 && y + dy <= 8) {
							this.putMovableBoard(x, y, dx, dy);
						}
					}
				}
				break;
		}
	}

	putMovableBoard(x, y, dx, dy) {
		if (gameData.piecesBoard[y + dy][x + dx] != null) {
			if (gameData.piecesBoard[y + dy][x + dx].isEnemy) {
				let object = this.scene.add.image((x + dx) * 64 + 64, (y + dy) * 64 + 256, "enemy_board_chip");
				object.depth = 2;
				object.setInteractive().on("pointerdown", () => {
					this.touchMovablePos(x + dx, y + dy, x, y, true);
				});
				this.touchSensorObjects.add(object);
			}
			return true;
		} else {
			let object = this.scene.add.image((x + dx) * 64 + 64, (y + dy) * 64 + 256, "input_board_chip");
			object.depth = 2;
			object.setInteractive().on("pointerdown", () => {
				this.touchMovablePos(x + dx, y + dy, x, y, false);
			});
			this.touchSensorObjects.add(object);
		}
	}

	moveEnemy() {
		let x = (this.x - 64) / 64;
		let y = (this.y - 256) / 64;
		let dx = 0;
		let dy = 0;
		let d = 1;

		let movable_point = [];

		let pushMovablePoint = function (x, y, dx, dy) {
			if (gameData.piecesBoard[y + dy][x + dx] != null) {
				if (!gameData.piecesBoard[y + dy][x + dx].isEnemy) {
					movable_point.push({ x: x, y: y, dx: dx, dy: dy, isPlayer: true });
					return true;
				}
			} else {
				movable_point.push({ x: x, y: y, dx: dx, dy: dy, isPlayer: false });
				return true;
			}
			return false;
		};

		let has_movable_point = false;

		switch (this.name) {
			case "pawn":
				dy = 1;
				if (y + dy <= 8) {
					if (pushMovablePoint(x, y, dx, dy)) {
						has_movable_point = true;
					}
				}
				break;
			case "lance":
				for (dy = 0; y + dy <= 8; dy++) {
					has_movable_point = pushMovablePoint(x, y, dx, dy);
					if (has_movable_point) break;
				}
				break;
			case "knight":
				dy = 2;
				for (dx = -1; dx <= 1; dx += 2) {
					if (x + dx <= 8 && x + dx >= 0 && y + dy <= 8 && y + dy >= 0) {
						has_movable_point = pushMovablePoint(x, y, dx, dy);
						if (has_movable_point) break;
					}
				}
				break;
			case "silver":
				for (dy = -1; dy <= 1; dy += 2) {
					for (dx = -1; dx <= 1; dx++) {
						if (x + dx <= 8 && x + dx >= 0 && y + dy <= 8 && y + dy >= 0) {
							if (!(dy === -1 && dx === 0)) {
								has_movable_point = pushMovablePoint(x, y, dx, dy);
								if (has_movable_point) break;
							}
						}
					}
				}
				break;
			case "gold":
				for (dy = -1; dy <= 1; dy++) {
					for (dx = -1; dx <= 1; dx++) {
						if (x + dx <= 8 && x + dx >= 0 && y + dy <= 8 && y + dy >= 0) {
							if (!(dy === -1 && dx !== 0)) {
								has_movable_point = pushMovablePoint(x, y, dx, dy);
								if (has_movable_point) break;
							}
						}
					}
				}
				break;
			case "bishop":
				d = 1;
				while (d <= 8) {
					if (y + d <= 8 && x + d <= 8) {
						has_movable_point = pushMovablePoint(x, y, d, d);
					}
					if (y - d >= 0 && x - d >= 0) {
						has_movable_point = pushMovablePoint(x, y, -d, -d);
					}
					if (y + d <= 8 && x - d >= 0) {
						has_movable_point = pushMovablePoint(x, y, -d, d);
					}
					if (y - d >= 0 && x + d <= 8) {
						has_movable_point = pushMovablePoint(x, y, d, -d);
					}
					d++;
				}
				break;
			case "rook":
				d = 1;
				while (d <= 8) {
					if (y + d <= 8) {
						has_movable_point = pushMovablePoint(x, y, 0, d);
					}
					if (y - d >= 0) {
						has_movable_point = pushMovablePoint(x, y, 0, -d);
					}
					if (x + d <= 8) {
						has_movable_point = pushMovablePoint(x, y, d, 0);
					}
					if (x - d >= 0) {
						has_movable_point = pushMovablePoint(x, y, -d, 0);
					}
					d++;
				}
				break;
			case "queen":
				for (dy = -1; dy <= 1; dy++) {
					for (dx = -1; dx <= 1; dx++) {
						if (x + dx <= 8 && x + dx >= 0 && y + dy <= 8 && y + dy >= 0) {
							if (dx !== 0 && dy !== 0) {
								has_movable_point = pushMovablePoint(x, y, dx, dy);
								if (has_movable_point) break;
							}
						}
					}
				}
				break;
		}

		if (has_movable_point) {
			this.putEnemy(movable_point);
		}

		return has_movable_point;
	}

	putEnemy(movable_point) {
		if (movable_point.length <= 0) {
			return;
		}
		let index = Random(0, movable_point.length - 1);

		for (let i = 0; i < movable_point.length; i++) {
			if (movable_point[i].isPlayer) {
				index = i;
				break;
			}
		}

		let x = movable_point[index].x;
		let y = movable_point[index].y;
		let dx = movable_point[index].dx;
		let dy = movable_point[index].dy;
		let isPLayer = movable_point[index].isPlayer;

		// this.x = (x + dx) * 64 + 64;
		// this.y = (y + dy) * 64 + 256;
		let player_data = gameData.piecesBoard[y + dy][x + dx];
		gameData.piecesBoard[y + dy][x + dx] = this;
		gameData.piecesBoard[y][x] = null;

		this.scene.tweens.add({
			targets: this,
			x: (x + dx) * 64 + 64,
			y: (y + dy) * 64 + 256,
			duration: 500,
			ease: "Power2",
			onComplete: () => {
				if (isPLayer) {
					player_data.destroy();
					player_data.shadowObject.destroy();
				}
			},
		});

		this.scene.tweens.add({
			targets: this.shadowObject,
			x: (x + dx) * 64 + 64 + 4,
			y: (y + dy) * 64 + 256 + 4,
			duration: 500,
			ease: "Power2",
		});

		this.isMoved = true;
		//this.setShadow(false);
	}

	update(...args) {
		super.update(...args);
	}
}
