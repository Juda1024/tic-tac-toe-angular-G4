import type { Board, Player } from './game-logic';
import { WIN_LINES, checkGameResult } from './game-logic';

// Posiciones estratégicas del tablero.
const CORNERS = [0, 2, 6, 8];
const SIDES = [1, 3, 5, 7];

// Identifica casillas que permiten completar una línea ganadora.
function winningMoves(board: Board, player: Player): number[] {
  const available: number[] = [];

  for (const line of WIN_LINES) {
    const own = line.filter(index => board[index] === player).length;
    const empty = line.filter(index => board[index] === null);

    if (
      own === 2 &&
      empty.length === 1 &&
      !available.includes(empty[0])
    ) {
      available.push(empty[0]);
    }
  }

  return available;
}

// Encuentra movimientos que generan dos amenazas simultáneas.
function forkMoves(board: Board, player: Player): number[] {
  const forks: number[] = [];

  board.forEach((cell, index) => {
    if (cell !== null) return;

    // Simula el movimiento sin modificar el tablero original.
    const nextBoard = [...board];
    nextBoard[index] = player;

    if (winningMoves(nextBoard, player).length >= 2) {
      forks.push(index);
    }
  });

  return forks;
}

// Selecciona movimientos mediante reglas heurísticas avanzadas.
export function getUnbeatableAIMove(board: Board): number | null {

  if (checkGameResult(board).status !== 'playing') {
    return null;
  }

  // Prioridad 1: ganar inmediatamente.
  const win = winningMoves(board, 'O')[0];

  if (win !== undefined) {
    return win;
  }

  // Prioridad 2: bloquear una victoria inmediata.
  const block = winningMoves(board, 'X')[0];

  if (block !== undefined) {
    return block;
  }

  // Prioridad 3: crear una doble amenaza.
  const ownFork = forkMoves(board, 'O')[0];

  if (ownFork !== undefined) {
    return ownFork;
  }

  // Prioridad 4: impedir dobles amenazas del jugador.
  const enemyForks = forkMoves(board, 'X');

  if (enemyForks.length === 1) {
    return enemyForks[0];
  }

  if (enemyForks.length > 1) {

    // Detecta cuando X ocupa esquinas opuestas.
    const oppositeCorners =
      (board[0] === 'X' && board[8] === 'X') ||
      (board[2] === 'X' && board[6] === 'X');

    // Si O controla el centro, un lateral evita la doble amenaza.
    if (board[4] === 'O' && oppositeCorners) {
      return SIDES.find(index => board[index] === null) ?? null;
    }

    // Intenta obligar al jugador a defenderse.
    for (const index of [...CORNERS, ...SIDES, 4]) {
      if (board[index] !== null) continue;

      const nextBoard = [...board];
      nextBoard[index] = 'O';

      if (winningMoves(nextBoard, 'O').length > 0) {
        return index;
      }
    }
  }

  // Prioridad 5: controlar el centro.
  if (board[4] === null) {
    return 4;
  }

  // Prioridad 6: elegir la esquina opuesta al jugador.
  const opposite = [8, 6, 2, 0];

  for (let i = 0; i < CORNERS.length; i++) {
    if (
      board[CORNERS[i]] === 'X' &&
      board[opposite[i]] === null
    ) {
      return opposite[i];
    }
  }

  // Prioridad 7: seleccionar una esquina o lateral disponible.
  return [...CORNERS, ...SIDES].find(
    index => board[index] === null
  ) ?? null;
}