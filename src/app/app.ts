import {
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';

import { GameService } from './game/game.service';
import { MODES, MODE_ORDER } from './game/modes';

import { ModePicker } from './components/mode-picker/mode-picker';
import { Arena } from './components/arena/arena';

// Pantallas disponibles de la aplicación.
type View = 'select' | 'game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ModePicker,
    Arena,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  // Accede al controlador principal del videojuego.
  readonly game = inject(GameService);

  // Controla la pantalla que se muestra.
  readonly view = signal<View>('select');

  readonly modes = MODES;
  readonly modeOrder = MODE_ORDER;

  // Comienza una partida nueva con la modalidad seleccionada.
  startGame(): void {
    this.game.resetGame();
    this.view.set('game');
  }

  // Regresa a la pantalla de selección.
  backToModes(): void {
    this.view.set('select');
  }

  // Permite utilizar las teclas de acceso rápido.
  @HostListener('document:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {

    // Escape permite regresar al selector.
    if (
      event.key === 'Escape' &&
      this.view() === 'game'
    ) {
      event.preventDefault();
      this.backToModes();
      return;
    }

    if (this.view() !== 'select') return;

    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    const target = event.target as HTMLElement | null;

    // Enter inicia la modalidad seleccionada.
    if (event.key === 'Enter') {

      if (target?.closest('.brand')) return;

      event.preventDefault();
      this.startGame();
      return;
    }

    // Las teclas 1-4 seleccionan una modalidad.
    const digit = ['1', '2', '3', '4'].indexOf(event.key);

    if (digit !== -1) {
      event.preventDefault();
      this.game.changeMode(MODE_ORDER[digit]);
      return;
    }

    // Las flechas permiten recorrer las modalidades.
    if (event.key.startsWith('Arrow')) {

      event.preventDefault();

      const position = MODE_ORDER.indexOf(this.game.mode());

      const step =
        event.key === 'ArrowRight' ||
        event.key === 'ArrowDown'
          ? 1
          : -1;

      const next =
        MODE_ORDER[
          (position + step + MODE_ORDER.length) %
          MODE_ORDER.length
        ];

      this.game.changeMode(next);
    }
  }
}