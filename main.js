"use strict";

const game_width = 64 * 10; // 640
const game_height = 64 * 16; // 1024

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
	// scene: [LogoScene, LoadScene, StartScene, GameScene],
	scene: [LoadScene, StartScene, GameScene],
};

let game = new Phaser.Game(config);
