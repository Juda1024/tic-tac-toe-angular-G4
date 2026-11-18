// Tipos utilizados para representar los jugadores y el tablero.
export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

// Posibles resultados de una partida.
export type GameResult =
  | { status: 'playing' }
  | { status: 'draw' }
  | { status: 'won'; winner: Player; line: number[] };

// Las ocho combinaciones posibles para ganar.
export const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontales
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticales
  [0, 4, 8], [2, 4, 6],           // Diagonales
];

// Crea un tablero nuevo con nueve casillas vacías.
export function createBoard(): Board {
  return Array(9).fill(null);
}

// Comprueba si existe un ganador, empate o si continúa la partida.
export function checkGameResult(board: Board): GameResult {

  // Recorre las combinaciones ganadoras.
  for (const [a, b, c] of WIN_LINES) {
    const player = board[a];

    if (player && player === board[b] && player === board[c]) {
      return {
        status: 'won',
        winner: player,
        line: [a, b, c],
      };
    }
  }

  // Si todas las casillas están ocupadas, termina en empate.
  if (board.every(cell => cell !== null)) {
    return { status: 'draw' };
  }

  return { status: 'playing' };
}

// Valida y registra el movimiento de un jugador.
export function makeMove(
  board: Board,
  index: number,
  player: Player
): Board | null {

  // Impide movimientos inválidos o partidas ya terminadas.
  if (
    !Number.isInteger(index) ||
    index < 0 ||
    index >= 9 ||
    board[index] !== null ||
    checkGameResult(board).status !== 'playing'
  ) {
    return null;
  }

  // Copia el tablero para conservar el estado anterior.
  const newBoard = [...board];
  newBoard[index] = player;

  return newBoard;
}