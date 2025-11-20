<template>
	<div class="chess-board-wrapper">
		<!-- 
		<div class="debug">
			fen {{ fen }}<br />
			playerColor {{ playerColor }}
		</div> -->

		<div class="chess-board">
			<div
				v-for="square in squares"
				:key="square"
				:class="[
					'square',
					isLightSquare(square) ? 'light' : 'dark',
					{ selected: selectedSquare === square },
					{ 'valid-move': validMoves.includes(square) },
					{ dragging: draggedPiece === square },
				]"
				@click="handleSquareClick(square)"
				@dragover="handleDragOver"
				@drop="handleDrop($event, square)"
				@touchend="handleTouchEnd($event, square)"
			>
				<div
					v-if="getPieceAt(square)"
					:class="['piece', getPieceColor(square)]"
					draggable="true"
					@dragstart="handleDragStart($event, square)"
					@dragend="handleDragEnd"
					@touchstart="handleTouchStart($event, square)"
					@touchmove="handleTouchMove"
				>
					{{ getPieceAt(square) }}
				</div>
				<div v-if="validMoves.includes(square)" class="move-indicator"></div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Chess } from 'chess.js';
import { computed, ref, watch } from 'vue';

interface Props {
	fen: string;
	playerColor: 'white' | 'black';
}

const props = defineProps<Props>();
const emit = defineEmits<{
	move: [move: { from: string; to: string; promotion?: string }];
}>();

const game = ref(new Chess(props.fen));
const selectedSquare = ref<string | null>(null);
const validMoves = ref<string[]>([]);
const draggedPiece = ref<string | null>(null);

// Unicode chess pieces
const pieceSymbols: Record<string, string> = {
	p: '♟',
	r: '♜',
	n: '♞',
	b: '♝',
	q: '♛',
	k: '♚',
	P: '♙',
	R: '♖',
	N: '♘',
	B: '♗',
	Q: '♕',
	K: '♔',
};

// Watch for FEN changes and update the game
watch(
	() => props.fen,
	(newFen) => {
		game.value = new Chess(newFen);
		selectedSquare.value = null;
		validMoves.value = [];
	}
);

// Generate board squares (a1-h8)
const squares = computed(() => {
	const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
	const ranks =
		props.playerColor === 'white'
			? [8, 7, 6, 5, 4, 3, 2, 1]
			: [1, 2, 3, 4, 5, 6, 7, 8];
	const result: string[] = [];

	for (const rank of ranks) {
		for (const file of files) {
			result.push(`${file}${rank}`);
		}
	}

	return result;
});

function getPieceAt(square: string): string | null {
	const piece = game.value.get(square as any);
	return piece
		? pieceSymbols[
				piece.type.toUpperCase() === piece.type
					? piece.type.toUpperCase()
					: piece.type.toLowerCase()
		  ]
		: null;
}

function getPieceColor(square: string): 'white' | 'black' | null {
	const piece = game.value.get(square as any);
	return piece ? (piece.color === 'w' ? 'white' : 'black') : null;
}

function isLightSquare(square: string): boolean {
	const file = square.charCodeAt(0) - 97; // a=0, b=1, etc.
	const rank = parseInt(square[1]) - 1;
	return (file + rank) % 2 === 0;
}

function handleSquareClick(square: string) {
	const piece = game.value.get(square as any);
	const currentTurn = game.value.turn() === 'w' ? 'white' : 'black';

	// If clicking on own piece, select it
	if (
		piece &&
		getPieceColor(square) === props.playerColor &&
		currentTurn === props.playerColor
	) {
		selectedSquare.value = square;
		const moves = game.value.moves({ square: square as any, verbose: true });
		validMoves.value = moves.map((m: any) => m.to);
	}
	// If a square is selected and clicking on a valid move
	else if (selectedSquare.value && validMoves.value.includes(square)) {
		makeMove(selectedSquare.value, square);
	}
	// Otherwise, deselect
	else {
		selectedSquare.value = null;
		validMoves.value = [];
	}
}

function makeMove(from: string, to: string) {
	const piece = game.value.get(from as any);

	// Check for pawn promotion
	if (
		piece &&
		piece.type === 'p' &&
		((piece.color === 'w' && to[1] === '8') ||
			(piece.color === 'b' && to[1] === '1'))
	) {
		// Auto-promote to queen for simplicity
		emit('move', { from, to, promotion: 'q' });
	} else {
		emit('move', { from, to });
	}

	selectedSquare.value = null;
	validMoves.value = [];
}

// Drag and drop handlers
function handleDragStart(event: DragEvent, square: string) {
	const piece = game.value.get(square as any);
	const currentTurn = game.value.turn() === 'w' ? 'white' : 'black';

	if (
		!piece ||
		getPieceColor(square) !== props.playerColor ||
		currentTurn !== props.playerColor
	) {
		event.preventDefault();
		return;
	}

	draggedPiece.value = square;
	selectedSquare.value = square;
	const moves = game.value.moves({ square: square as any, verbose: true });
	validMoves.value = moves.map((m: any) => m.to);

	if (event.dataTransfer) {
		event.dataTransfer.effectAllowed = 'move';
		event.dataTransfer.setData('text/plain', square);
	}
}

function handleDragOver(event: DragEvent) {
	event.preventDefault();
	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = 'move';
	}
}

function handleDrop(event: DragEvent, square: string) {
	event.preventDefault();

	if (draggedPiece.value && validMoves.value.includes(square)) {
		makeMove(draggedPiece.value, square);
	}

	draggedPiece.value = null;
	selectedSquare.value = null;
	validMoves.value = [];
}

function handleDragEnd() {
	if (!draggedPiece.value) return;

	// If drag ended without a valid drop, just clear the selection
	draggedPiece.value = null;
	selectedSquare.value = null;
	validMoves.value = [];
}

function handleTouchStart(event: TouchEvent, square: string) {
	const piece = game.value.get(square as any);
	const currentTurn = game.value.turn() === 'w' ? 'white' : 'black';

	if (
		!piece ||
		getPieceColor(square) !== props.playerColor ||
		currentTurn !== props.playerColor
	) {
		return;
	}

	event.preventDefault();
	draggedPiece.value = square;
	selectedSquare.value = square;
	const moves = game.value.moves({ square: square as any, verbose: true });
	validMoves.value = moves.map((m: any) => m.to);
}

function handleTouchMove(event: TouchEvent) {
	if (!draggedPiece.value) return;
	event.preventDefault();
}

function handleTouchEnd(event: TouchEvent, square: string) {
	if (!draggedPiece.value) return;

	event.preventDefault();

	if (validMoves.value.includes(square)) {
		makeMove(draggedPiece.value, square);
	} else {
		// Just clicked the same square - keep it selected
		if (draggedPiece.value !== square) {
			draggedPiece.value = null;
			selectedSquare.value = null;
			validMoves.value = [];
		}
	}
}
</script>

<style scoped>
.chess-board-wrapper {
	position: relative;
	width: 100%;
}

.debug {
	position: absolute;
	top: 8px;
	left: 8px;
	background: rgba(255, 255, 255, 0.9);
	color: #111;
	padding: 6px 10px;
	border-radius: 6px;
	font-size: 0.85rem;
	z-index: 20;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.chess-board {
	display: grid !important;
	/* explicit 8x8 grid with resilient sizing */
	grid-auto-flow: row;
	grid-template-columns: repeat(8, minmax(0, 1fr));
	grid-template-rows: repeat(8, minmax(0, 1fr));
	width: 100%;
	height: 100%;
	aspect-ratio: 1 / 1;
	border: 2px solid #333;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	margin: 0 auto;
	user-select: none;
	touch-action: none;
}

.square {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	/* make sure each grid cell occupies the expected cell area */
	width: 100%;
	height: 100%;
	box-sizing: border-box;
	cursor: pointer;
	transition: background-color 0.2s;
}

.square.light {
	background-color: #f0d9b5;
}

.square.dark {
	background-color: #b58863;
}

.square.selected {
	background-color: #7fc97f !important;
	box-shadow: inset 0 0 0 3px #4a9d4a;
}

.square.valid-move {
	cursor: pointer;
}

.square.dragging {
	opacity: 0.5;
}

.piece {
	font-size: clamp(2rem, 8vw, 3.5rem);
	line-height: 1;
	cursor: grab;
	touch-action: none;
	pointer-events: auto;
	transition: transform 0.1s;
}

.piece:active {
	cursor: grabbing;
	transform: scale(1.1);
}

.piece.white {
	color: #fff;
	text-shadow: 0 0 2px #000, 0 0 4px #000;
}

.piece.black {
	color: #000;
	text-shadow: 0 0 2px #fff, 0 0 4px #fff;
}

.move-indicator {
	position: absolute;
	width: 25%;
	height: 25%;
	background-color: rgba(0, 128, 0, 0.5);
	border-radius: 50%;
	pointer-events: none;
}

.square.valid-move:hover {
	background-color: rgba(127, 201, 127, 0.3);
}

/* Mobile optimizations */
@media (max-width: 600px) {
	.chess-board {
		width: 100vw;
		height: 100vw;
		border-width: 1px;
		aspect-ratio: 1;
		max-width: none;
	}
	.piece {
		font-size: clamp(1.5rem, 10vw, 2.5rem);
	}
}
</style>
