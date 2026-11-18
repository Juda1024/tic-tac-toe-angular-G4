import { describe, expect, it } from 'vitest';
import type { Board } from './game-logic';
import { checkGameResult, createBoard, makeMove } from './game-logic';
import { getUnbeatableAIMove } from './unbeatable-ai';

interface Results {
  humanWins: number;
  aiWins: number;
  draws: number;
}

// Recorre todas las jugadas legales de X; O contesta con su heurística.
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

    const aiMove = getUnbeatableAIMove(humanBoard);
    if (aiMove === null) throw new Error('UnbeatableAI no eligió casilla');

    const aiBoard = makeMove(humanBoard, aiMove, 'O');
    if (!aiBoard) throw new Error('UnbeatableAI hizo una jugada inválida');

    const result = checkGameResult(aiBoard);
    if (result.status === 'won') results.aiWins++;
    else if (result.status === 'draw') results.draws++;
    else exploreGames(aiBoard, results);
  }
}

describe('UnbeatableAI: estrategia por reglas', () => {
  it('toma el centro ante una X en la esquina', () => {
    const board = createBoard();
    board[0] = 'X';
    expect(getUnbeatableAIMove(board)).toBe(4);
  });

  it('bloquea una victoria inmediata', () => {
    const board: Board = [
      'X', 'X', null,
      null, 'O', null,
      null, null, null,
    ];

    expect(getUnbeatableAIMove(board)).toBe(2);
  });

  it('no pierde en ninguna rama posible si X empieza', () => {
    const results: Results = { humanWins: 0, aiWins: 0, draws: 0 };
    exploreGames(createBoard(), results);

    expect(results.humanWins).toBe(0);
    expect(results.aiWins + results.draws).toBeGreaterThan(0);
  });

  it('no modifica el tablero original', () => {
    const board = createBoard();
    board[0] = 'X';
    const original = [...board];
    getUnbeatableAIMove(board);
    expect(board).toEqual(original);
  });

  it('no mueve cuando el resultado es definitivo', () => {
    const board: Board = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];
    expect(getUnbeatableAIMove(board)).toBeNull();
  });
});
