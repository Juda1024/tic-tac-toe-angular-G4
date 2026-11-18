import {
  Component,
  ChangeDetectionStrategy,
  computed,
  input,
  output,
} from '@angular/core';

import type {
  Board,
  Player,
  GameResult,
} from '../../game/game-logic';

import type { GameMode } from '../../game/game.service';
import { MODES } from '../../game/modes';

@Component({
  selector: 'app-arena',
  standalone: true,
  templateUrl: './arena.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Arena {

  // Recibe el estado actual desde GameService.
  readonly board = input.required<Board>();
  readonly currentPlayer = input.required<Player>();
  readonly mode = input.required<GameMode>();
  readonly result = input.required<GameResult>();

  // Eventos que utilizará el componente principal.
  readonly move = output<number>();
  readonly reset = output<void>();
  readonly back = output<void>();

  readonly modes = MODES;

  // Identifica si estamos jugando contra otra persona.
  readonly isLocal = computed(() =>
    this.mode() === 'local'
  );

  // Comprueba si todavía continúa la partida.
  readonly isPlaying = computed(() =>
    this.result().status === 'playing'
  );

  // Identifica cuando corresponde responder a la IA.
  readonly isAITurn = computed(() =>
    this.isPlaying() &&
    !this.isLocal() &&
    this.currentPlayer() === 'O'
  );

  // Obtiene las casillas de la línea ganadora.
  readonly winningLine = computed(() => {
    const result = this.result();

    return result.status === 'won'
      ? result.line
      : [];
  });

  // Genera el mensaje que se muestra durante la partida.
  readonly statusText = computed(() => {

    const result = this.result();
    const mode = this.mode();
    const rival = MODES[mode].name;

    if (result.status === 'won') {

      if (this.isLocal()) {
        return `¡Victoria del jugador ${result.winner}!`;
      }

      return result.winner === 'X'
        ? '¡Victoria! Has ganado la partida'
        : `¡${rival} ha ganado!`;
    }

    if (result.status === 'draw') {
      return '¡Empate! Buena partida';
    }

    if (this.isLocal()) {
      return `Turno del jugador ${this.currentPlayer()}`;
    }

    return this.isAITurn()
      ? `${rival} está pensando...`
      : 'Tu turno: juega con X';
  });

  // Determina el estilo del mensaje de estado.
  readonly statusKind = computed(() => {
    const result = this.result();

    if (result.status === 'won') return 'win';
    if (result.status === 'draw') return 'draw';

    return 'turn';
  });

  // Envía el movimiento seleccionado al controlador.
  playMove(index: number): void {
    this.move.emit(index);
  }
}