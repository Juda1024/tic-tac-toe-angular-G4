import {
  Injectable,
  OnDestroy,
  signal,
  computed,
} from '@angular/core';

import type { Board, Player } from './game-logic';

import {
  createBoard,
  makeMove,
  checkGameResult,
} from './game-logic';

import { getMediumAIMove } from './medium-ai';
import { getUnbeatableAIMove } from './unbeatable-ai';
import { getMinimaxAIMove } from './minimax-ai';

// Modalidades disponibles: tres IA y un modo local.
export type GameMode =
  | 'medium'
  | 'unbeatable'
  | 'minimax'
  | 'local';

// Representa el estado completo de una partida.
interface GameState {
  board: Board;
  currentPlayer: Player;
  mode: GameMode;
}

// Relaciona cada modalidad con su algoritmo.
const AI_STRATEGIES: Record<
  Exclude<GameMode, 'local'>,
  (board: Board) => number | null
> = {
  medium: getMediumAIMove,
  unbeatable: getUnbeatableAIMove,
  minimax: getMinimaxAIMove,
};

@Injectable({
  providedIn: 'root',
})
export class GameService implements OnDestroy {

  // Guarda el estado de la partida mediante Signals.
  private readonly gameState = signal<GameState>({
    board: createBoard(),
    currentPlayer: 'X',
    mode: 'medium',
  });

  // Expone los datos que utilizarán los componentes.
  readonly board = computed(() => this.gameState().board);
  readonly currentPlayer = computed(() => this.gameState().currentPlayer);
  readonly mode = computed(() => this.gameState().mode);

  // Calcula el resultado cuando cambia el tablero.
  readonly result = computed(() =>
    checkGameResult(this.gameState().board)
  );

  // Almacena el movimiento pendiente de la IA.
  private aiTimer: ReturnType<typeof setTimeout> | null = null;

  // Registra los movimientos humanos según la modalidad.
  playMove(index: number): void {

    const current = this.gameState();

    const isHumanTurn =
      current.mode === 'local' ||
      current.currentPlayer === 'X';

    // Impide jugar durante el turno de la IA o después de terminar.
    if (
      !isHumanTurn ||
      checkGameResult(current.board).status !== 'playing'
    ) {
      return;
    }

    const nextBoard = makeMove(
      current.board,
      index,
      current.currentPlayer
    );

    if (!nextBoard) return;

    const nextResult = checkGameResult(nextBoard);

    // Alterna los turnos únicamente si continúa la partida.
    const nextPlayer: Player =
      nextResult.status === 'playing'
        ? current.currentPlayer === 'X' ? 'O' : 'X'
        : current.currentPlayer;

    const nextState: GameState = {
      ...current,
      board: nextBoard,
      currentPlayer: nextPlayer,
    };

    this.gameState.set(nextState);

    // Solicita una respuesta automática únicamente en modos de IA.
    if (
      current.mode !== 'local' &&
      nextPlayer === 'O' &&
      nextResult.status === 'playing'
    ) {
      this.scheduleAIMove(nextState);
    }
  }

  // Programa el movimiento automático de la computadora.
  private scheduleAIMove(expectedState: GameState): void {

    this.cancelPendingMove();

    // Mantiene una pausa visual similar a la versión React.
    this.aiTimer = setTimeout(() => {

      this.aiTimer = null;

      const current = this.gameState();

      // Evita aplicar movimientos de una partida anterior.
      if (
        current !== expectedState ||
        current.mode === 'local' ||
        current.currentPlayer !== 'O' ||
        checkGameResult(current.board).status !== 'playing'
      ) {
        return;
      }

      const aiMove = AI_STRATEGIES[current.mode](current.board);

      if (aiMove === null) return;

      const nextBoard = makeMove(
        current.board,
        aiMove,
        'O'
      );

      if (!nextBoard) return;

      // Devuelve el turno al humano después de responder.
      this.gameState.set({
        ...current,
        board: nextBoard,
        currentPlayer: 'X',
      });

    }, 450);
  }

  // Cancela cualquier movimiento automático pendiente.
  private cancelPendingMove(): void {
    if (this.aiTimer !== null) {
      clearTimeout(this.aiTimer);
      this.aiTimer = null;
    }
  }

  // Cambia de modalidad y comienza una nueva partida.
  changeMode(mode: GameMode): void {

    const current = this.gameState();

    if (current.mode === mode) return;

    this.cancelPendingMove();

    this.gameState.set({
      board: createBoard(),
      currentPlayer: 'X',
      mode,
    });
  }

  // Reinicia el tablero conservando la modalidad seleccionada.
  resetGame(): void {

    this.cancelPendingMove();

    this.gameState.set({
      board: createBoard(),
      currentPlayer: 'X',
      mode: this.gameState().mode,
    });
  }

  // Libera el temporizador cuando Angular destruye el servicio.
  ngOnDestroy(): void {
    this.cancelPendingMove();
  }
}