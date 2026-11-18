import { describe, expect, it } from 'vitest';
import type { Board } from './game-logic';
import { checkGameResult, createBoard, makeMove } from './game-logic';
import { getMinimaxAIMove } from './minimax-ai';

interface Results {
  humanWins: number;
  aiWins: number;
  draws: number;
}

// Prueba todas las respuestas humanas posibles frente al árbol Minimax.
function exploreGames(board: Board, results: Results): void {
  for (let index = 0; index < 9; index++) {
    if (board[index] !== null) continue;

    const humanBoard = makeMove(board, index, 'X');
    if (!humanBoard) throw new Error('Movimiento humano inválido');

    const humanResult = checkGameResult(humanBoard);
    if (humanResult.status === 'won') {
      results.humanWins++;
      continue;
    }
    if (humanResult.status === 'draw') {
      results.draws++;
      continue;
    }

    const aiMove = getMinimaxAIMove(humanBoard);
    if (aiMove === null) throw new Error('Minimax no eligió casilla');

    const aiBoard = makeMove(humanBoard, aiMove, 'O');
    if (!aiBoard) throw new Error('Minimax hizo una jugada inválida');

    const result = checkGameResult(aiBoard);
    if (result.status === 'won') results.aiWins++;
    else if (result.status === 'draw') results.draws++;
    else exploreGames(aiBoard, results);
  }
}

describe('MinimaxAI', () => {
  it('gana inmediatamente si puede', () => {
    const board: Board = [
      'O', 'O', null,
      'X', 'X', null,
      null, null, 'X',
    ];
    expect(getMinimaxAIMove(board)).toBe(2);
  });

  it('bloquea una victoria inmediata de X', () => {
    const board: Board = [
      'X', 'X', null,
      null, 'O', null,
      null, null, null,
    ];
    expect(getMinimaxAIMove(board)).toBe(2);
  });

  it('no altera el tablero original', () => {
    const board = createBoard();
    board[0] = 'X';
    const original = [...board];
    expect(getMinimaxAIMove(board)).not.toBeNull();
    expect(board).toEqual(original);
  });

  it('no juega en partidas terminadas', () => {
    const board: Board = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];
    expect(getMinimaxAIMove(board)).toBeNull();
  });

  it('nunca pierde frente a las jugadas posibles de X', () => {
    const results: Results = { humanWins: 0, aiWins: 0, draws: 0 };
    exploreGames(createBoard(), results);

    expect(results.humanWins).toBe(0);
    expect(results.aiWins + results.draws).toBeGreaterThan(0);
  });
});
