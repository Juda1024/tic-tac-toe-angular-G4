import type { Board, Player } from './game-logic';
import { WIN_LINES, checkGameResult } from './game-logic';

// Busca una casilla que permita ganar o bloquear una línea.
function findLineMove(board: Board, player: Player): number | null {
  for (const line of WIN_LINES) {
    const count = line.filter(index => board[index] === player).length;

    // La línea necesita dos símbolos iguales y una casilla libre.
    if (count !== 2) continue;

    const emptyIndex = line.find(index => board[index] === null);

    if (emptyIndex !== undefined) {
      return emptyIndex;
    }
  }

  return null;
}

// Selecciona un movimiento usando reglas básicas y aleatoriedad.
export function getMediumAIMove(board: Board): number | null {

  // No realiza movimientos cuando la partida terminó.
  if (checkGameResult(board).status !== 'playing') {
    return null;
  }

  // Prioridad 1: ocupar el centro.
  if (board[4] === null) {
    return 4;
  }

  // Prioridad 2: buscar una victoria inmediata.
  const winningMove = findLineMove(board, 'O');

  if (winningMove !== null) {
    return winningMove;
  }

  // Prioridad 3: bloquear una victoria del jugador.
  const blockingMove = findLineMove(board, 'X');

  if (blockingMove !== null) {
    return blockingMove;
  }

  // Prioridad 4: seleccionar una casilla libre al azar.
  const available = board.flatMap((cell, index) =>
    cell === null ? [index] : []
  );

  return available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : null;
}