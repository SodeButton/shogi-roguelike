import pieceKing from './assets/sprites/pieces/king.png';
import pieceQueen from './assets/sprites/pieces/queen.png';
import pieceRook from './assets/sprites/pieces/rook.png';
import pieceRookNari from './assets/sprites/pieces/rook_nari.png';
import pieceBishop from './assets/sprites/pieces/bishop.png';
import pieceBishopNari from './assets/sprites/pieces/bishop_nari.png';
import pieceGold from './assets/sprites/pieces/gold.png';
import pieceSilver from './assets/sprites/pieces/silver.png';
import pieceSilverNari from './assets/sprites/pieces/silver_nari.png';
import pieceKnight from './assets/sprites/pieces/knight.png';
import pieceKnightNari from './assets/sprites/pieces/knight_nari.png';
import pieceLance from './assets/sprites/pieces/lance.png';
import pieceLanceNari from './assets/sprites/pieces/lance_nari.png';
import piecePawn from './assets/sprites/pieces/pawn.png';
import piecePawnNari from './assets/sprites/pieces/pawn_nari.png';

import imgBoard from './assets/sprites/board_piece.png';
import imgBoardEdge from './assets/sprites/board_edge.png';

// import imgPieceParticle from './assets/sprites/piece_particle.png';

import imgTatami from './assets/sprites/tatami.jpg';
// import imgWindow from './assets/sprites/window.png';

// import se_shogi from './assets/audios/se_shogi.wav';
// import se_kill from './assets/audios/se_kill.mp3';
// import bgm_title from './assets/audios/bgm_title.mp3';
// import bgm_game from './assets/audios/bgm_game.mp3';

export class ImgLoader {
	pieces: { [key: string]: string };
	boards: { [key: string]: string };
	imgs: { [key: string]: string };
	// TODO: pieces, boards, imgs
	constructor() {
		this.pieces = {
			king: pieceKing,
			queen: pieceQueen,
			rook: pieceRook,
			rook_nari: pieceRookNari,
			bishop: pieceBishop,
			bishop_nari: pieceBishopNari,
			gold: pieceGold,
			silver: pieceSilver,
			silver_nari: pieceSilverNari,
			knight: pieceKnight,
			knight_nari: pieceKnightNari,
			lance: pieceLance,
			lance_nari: pieceLanceNari,
			pawn: piecePawn,
			pawn_nari: piecePawnNari,
		};
		this.boards = {
			board: imgBoard,
			board_edge: imgBoardEdge,
		};
		this.imgs = {
			tatami: imgTatami,
		};
	}

	loadAll(scene: Phaser.Scene) {
		this.loadPiece(scene);
		this.loadBoard(scene);
		this.loadImg(scene);
	}

	loadBoard(scene: Phaser.Scene) {
		Object.keys(this.boards).forEach((key) => {
			scene.load.spritesheet(key, this.boards[key], {
				frameWidth: 64,
				frameHeight: 64,
			});
		});
	}

	loadPiece(scene: Phaser.Scene) {
		Object.keys(this.pieces).forEach((key) => {
			scene.load.spritesheet(key, this.pieces[key], {
				frameWidth: 64,
				frameHeight: 64,
			});
		});
	}

	loadImg(scene: Phaser.Scene) {
		Object.keys(this.imgs).forEach((key) => {
			scene.load.image(key, this.imgs[key]);
		});
	}
}
