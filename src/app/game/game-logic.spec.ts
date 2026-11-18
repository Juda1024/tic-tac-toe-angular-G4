import { describe, expect, it } from 'vitest';
import type { Board } from './game-logic';
import { WIN_LINES, checkGameResult, createBoard, makeMove } from './game-logic';

describe('Reglas generales de Tic-Tac-Toe', () => {
  it('crea un tablero de nueve casillas vacías', () => {
    expect(createBoard()).toEqual(Array(9).fill(null));
  });

  it('crea tableros independientes', () => {
    const first = createBoard();
    const second = createBoard();
    first[0] = 'X';
    expect(second[0]).toBeNull();
  });

  it('registra una jugada sin modificar el tablero original', () => {
    const board = createBoard();
    const next = makeMove(board, 4, 'X');

    expect(next?.[4]).toBe('X');
    expect(board[4]).toBeNull();
  });

  it('impide ocupar una casilla utilizada', () => {
    const board = createBoard();
    board[0] = 'X';
    expect(makeMove(board, 0, 'O')).toBeNull();
  });

  it('rechaza índices inválidos', () => {
    const board = createBoard();
    for (const index of [-1, 9, 1.5, Number.NaN]) {
      expect(makeMove(board, index, 'X')).toBeNull();
    }
  });

  // Cada combinación ganadora debe funcionar independientemente.
  it.each(WIN_LINES)('detecta victoria en %i, %i, %i', (a, b, c) => {
    const board = createBoard();
    board[a] = 'X';
    board[b] = 'X';
    board[c] = 'X';

    expect(checkGameResult(board)).toEqual({
      status: 'won',
      winner: 'X',
      line: [a, b, c],
    });
  });

  it('detecta una victoria de O', () => {
    const board: Board = [
      'O', 'O', 'O',
      'X', 'X', null,
      null, null, null,
    ];

    expect(checkGameResult(board)).toEqual({
      status: 'won',
      winner: 'O',
      line: [0, 1, 2],
    });
  });

  it('detecta un empate', () => {
    const board: Board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];

    expect(checkGameResult(board)).toEqual({ status: 'draw' });
  });

  it('reconoce una partida en desarrollo', () => {
    const board = createBoard();
    board[0] = 'X';
    expect(checkGameResult(board)).toEqual({ status: 'playing' });
  });

  it('bloquea movimientos después de una victoria', () => {
    const board: Board = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];

    expect(makeMove(board, 5, 'O')).toBeNull();
  });

  it('bloquea movimientos después de un empate', () => {
    const board: Board = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];

    expect(makeMove(board, 0, 'X')).toBeNull();
  });
});
