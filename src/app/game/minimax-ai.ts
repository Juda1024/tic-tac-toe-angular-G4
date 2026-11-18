import type { Board } from './game-logic';
import { checkGameResult } from './game-logic';

// Evalúa recursivamente todas las jugadas futuras.
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean
): number {

  const result = checkGameResult(board);

  // Evalúa los estados donde existe un ganador.
  if (result.status === 'won') {
    return result.winner === 'O'
      ? 10 - depth
      : -10 + depth;
  }

  // El empate tiene una puntuación neutral.
  if (result.status === 'draw') {
    return 0;
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;

  // Recorre todas las casillas disponibles.
  for (let index = 0; index < 9; index++) {
    if (board[index] !== null) continue;

    // Simula un movimiento sin alterar el tablero real.
    const nextBoard = [...board];
    nextBoard[index] = isMaximizing ? 'O' : 'X';

    // Evalúa el siguiente turno del oponente.
    const score = minimax(
      nextBoard,
      depth + 1,
      !isMaximizing
    );

    // MAX busca el valor mayor y MIN busca el menor.
    bestScore = isMaximizing
      ? Math.max(bestScore, score)
      : Math.min(bestScore, score);
  }

  return bestScore;
}

// Encuentra el mejor movimiento posible para la computadora.
export function getMinimaxAIMove(board: Board): number | null {

  if (checkGameResult(board).status !== 'playing') {
    return null;
  }

  let bestScore = -Infinity;
  let bestMove: number | null = null;

  // Evalúa cada posible movimiento de O.
  for (let index = 0; index < 9; index++) {
    if (board[index] !== null) continue;

    const nextBoard = [...board];
    nextBoard[index] = 'O';

    // Después de O, corresponde el turno de X.
    const score = minimax(nextBoard, 1, false);

    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }

  return bestMove;
}