import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GameService } from './game.service';

describe('GameService: gestión de partidas', () => {
  let game: GameService;

  beforeEach(() => {
    // Controlamos los 450 ms de espera de la IA sin esperar en tiempo real.
    vi.useFakeTimers();
    game = TestBed.inject(GameService);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('comienza en MediumAI con tablero vacío y turno de X', () => {
    expect(game.mode()).toBe('medium');
    expect(game.board()).toEqual(Array(9).fill(null));
    expect(game.currentPlayer()).toBe('X');
    expect(game.result()).toEqual({ status: 'playing' });
  });

  it('bloquea el turno humano mientras MediumAI piensa', () => {
    game.playMove(0);

    expect(game.board()[0]).toBe('X');
    expect(game.currentPlayer()).toBe('O');

    // No acepta un segundo clic del jugador mientras responde la IA.
    game.playMove(1);
    expect(game.board()[1]).toBeNull();

    vi.advanceTimersByTime(500);

    expect(game.board()[4]).toBe('O');
    expect(game.currentPlayer()).toBe('X');
  });

  it('alterna X y O en 1 vs 1 sin usar IA', () => {
    game.changeMode('local');

    game.playMove(0);
    expect(game.board()[0]).toBe('X');
    expect(game.currentPlayer()).toBe('O');

    vi.advanceTimersByTime(500);
    expect(game.board().filter(cell => cell !== null)).toHaveLength(1);

    game.playMove(4);
    expect(game.board()[4]).toBe('O');
    expect(game.currentPlayer()).toBe('X');
  });

  it('no permite sobrescribir una casilla ocupada', () => {
    game.changeMode('local');
    game.playMove(0);
    game.playMove(0);

    expect(game.board()[0]).toBe('X');
    expect(game.board().filter(cell => cell !== null)).toHaveLength(1);
    expect(game.currentPlayer()).toBe('O');
  });

  it('detecta una victoria local y detiene las jugadas', () => {
    game.changeMode('local');

    // X completa la fila superior; O ocupa dos casillas centrales.
    for (const index of [0, 3, 1, 4, 2]) game.playMove(index);

    expect(game.result()).toEqual({
      status: 'won',
      winner: 'X',
      line: [0, 1, 2],
    });

    game.playMove(8);
    expect(game.board()[8]).toBeNull();
  });

  it('reiniciar elimina las marcas y cancela la respuesta pendiente', () => {
    game.playMove(0);
    game.resetGame();

    vi.advanceTimersByTime(500);

    expect(game.board()).toEqual(Array(9).fill(null));
    expect(game.currentPlayer()).toBe('X');
    expect(game.result()).toEqual({ status: 'playing' });
  });

  it('cambiar de modalidad no arrastra jugadas de una IA anterior', () => {
    game.playMove(0);
    game.changeMode('local');

    vi.advanceTimersByTime(500);

    expect(game.mode()).toBe('local');
    expect(game.board()).toEqual(Array(9).fill(null));
    expect(game.currentPlayer()).toBe('X');
  });

  it.each(['unbeatable', 'minimax'] as const)(
    '%s responde legalmente al movimiento inicial',
    mode => {
      game.changeMode(mode);
      game.playMove(0);

      vi.advanceTimersByTime(500);

      expect(game.board()[0]).toBe('X');
      expect(game.board()[4]).toBe('O');
      expect(game.board().filter(cell => cell !== null)).toHaveLength(2);
      expect(game.currentPlayer()).toBe('X');
    },
  );
});
