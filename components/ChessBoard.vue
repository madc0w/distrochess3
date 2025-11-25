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

		<!-- History controls -->
		<!-- history controls moved to parent -->
	</div>
</template>

<script setup lang="ts">
import { Chess } from 'chess.js';
import { computed, ref, watch } from 'vue';

interface Props {
	fen: string;
	playerColor: 'white' | 'black';
	isViewingHistory?: boolean;
	isDrawOffered?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
	move: [move: { from: string; to: string; promotion?: string }];
	blockedMove: [];
}>();

const game = ref(new Chess(props.fen));
const selectedSquare = ref<string | null>(null);
const validMoves = ref<string[]>([]);
const draggedPiece = ref<string | null>(null);

// Parent can indicate when the board is in history-viewing mode
// (when the parent is showing a past position and moving should be disabled)
// `props.viewingHistory` is optional and treated as boolean

// Support parent prop `isViewingHistory` (use `props.isViewingHistory` at runtime)
const isViewingHistory = computed(() => !!(props as any).isViewingHistory);

// Support parent prop `isDrawOffered` to block moves when a draw is offered
const isDrawOffered = computed(() => !!(props as any).isDrawOffered);

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
		// Update local game to the incoming FEN
		if (newFen) game.value = new Chess(newFen);

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
	// When viewing history (not on the latest move), disable moving
	if (isViewingHistory.value) return;
	// When a draw is offered, disable moving but notify parent
	if (isDrawOffered.value) {
		emit('blockedMove');
		return;
	}

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

	// Build move object for chess.js
	const moveObj: any = { from, to };

	// Check for pawn promotion
	if (
		piece &&
		piece.type === 'p' &&
		((piece.color === 'w' && to[1] === '8') ||
			(piece.color === 'b' && to[1] === '1'))
	) {
		// Auto-promote to queen for simplicity
		moveObj.promotion = 'q';
	}

	// Apply the move locally so UI updates immediately
	const result = game.value.move(moveObj);

	if (result) {
		// Emit move to parent
		if (moveObj.promotion)
			emit('move', { from, to, promotion: moveObj.promotion });
		else emit('move', { from, to });
	} else {
		// If move invalid, do not emit
	}

	selectedSquare.value = null;
	validMoves.value = [];
}

// Drag and drop handlers
function handleDragStart(event: DragEvent, square: string) {
	// disable dragging when parent indicates history view
	if (isViewingHistory.value) {
		event.preventDefault();
		return;
	}
	// disable dragging when a draw is offered
	if (isDrawOffered.value) {
		event.preventDefault();
		emit('blockedMove');
		return;
	}

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

	if (isViewingHistory.value) return;
	if (isDrawOffered.value) return;

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
	// disable touch moving when viewing history
	if (isViewingHistory.value) return;
	// disable touch moving when a draw is offered
	if (isDrawOffered.value) {
		emit('blockedMove');
		return;
	}

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

// History navigation is handled by parent component
function handleTouchMove(event: TouchEvent) {
	if (!draggedPiece.value) return;
	event.preventDefault();
}

function handleTouchEnd(event: TouchEvent, square: string) {
	if (!draggedPiece.value) return;

	// disable touch drops when viewing history
	if (isViewingHistory.value) return;
	// disable touch drops when a draw is offered
	if (isDrawOffered.value) return;

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
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	/* legacy padding removed since history is handled by parent */
	padding-bottom: 12px;
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
	/* let the board size by its intrinsic aspect ratio so the wrapper can grow
	   and show the controls below it instead of clipping them */
	height: auto;
	aspect-ratio: 1 / 1;
	border: 2px solid #333;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
	margin: 0 auto;
	user-select: none;
	touch-action: manipulation;
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
	touch-action: manipulation;
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
		width: 100%;
		max-width: 95vw;
		border-width: 1px;
		aspect-ratio: 1;
	}
	.piece {
		font-size: clamp(1.5rem, 8vw, 2.5rem);
	}
	.chess-board-wrapper {
		width: 100%;
		max-width: 95vw;
	}
}

.history-bar {
	/* fixed to viewport bottom-center so controls are always visible */
	position: fixed;
	bottom: 18px;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	gap: 8px;
	background: rgba(255, 255, 255, 0.96);
	padding: 6px 12px;
	border-radius: 20px;
	box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22);
	z-index: 9999;
	pointer-events: auto;
}

.history-message {
	font-size: 0.85rem;
	color: #333;
	background: transparent;
	padding: 0 6px 0 0;
	border-radius: 4px;
	font-weight: 600;
}

.history-controls {
	display: inline-flex;
	align-items: center;
	gap: 8px;
}

.history-btn {
	background: #222;
	color: #fff;
	border: none;
	padding: 6px 10px;
	border-radius: 6px;
	font-size: 1.1rem;
	cursor: pointer !important;
	box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.history-btn[disabled] {
	opacity: 0.35;
	cursor: pointer !important;
}

.history-pos {
	font-size: 0.85rem;
	color: #222;
	background: #f3f3f3;
	padding: 4px 8px;
	border-radius: 6px;
}

@media (max-width: 600px) {
	.history-bar {
		padding: 4px 8px;
	}
	.history-btn {
		padding: 5px 8px;
		font-size: 1rem;
	}
}
</style>
