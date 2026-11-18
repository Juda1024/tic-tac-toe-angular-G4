import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Board } from './game-logic';
import { createBoard } from './game-logic';
import { getMediumAIMove } from './medium-ai';

afterEach(() => vi.restoreAllMocks());

describe('MediumAI', () => {
  it('toma el centro si está disponible', () => {
    const board = createBoard();
    board[0] = 'X';
    expect(getMediumAIMove(board)).toBe(4);
  });

  it('elige una victoria inmediata', () => {
    const board: Board = [
      'O', 'O', null,
      'X', 'X', 'O',
      null, null, 'X',
    ];

    expect(getMediumAIMove(board)).toBe(2);
  });

  it('bloquea una victoria humana cuando el centro está ocupado', () => {
    const board: Board = [
      'X', 'X', null,
      null, 'O', null,
      null, null, null,
    ];

    expect(getMediumAIMove(board)).toBe(2);
  });

  it('elige una casilla libre al utilizar la parte aleatoria', () => {
    const board: Board = [
      'X', null, null,
      null, 'O', null,
      null, null, null,
    ];

    // Controlamos el azar para que la prueba siempre dé el mismo resultado.
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(getMediumAIMove(board)).toBe(1);
  });

  it('no modifica el tablero recibido', () => {
    const board = createBoard();
    board[0] = 'X';
    const original = [...board];

    getMediumAIMove(board);
    expect(board).toEqual(original);
  });

  it('no juega si la partida terminó', () => {
    const board: Board = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];

    expect(getMediumAIMove(board)).toBeNull();
  });
});
