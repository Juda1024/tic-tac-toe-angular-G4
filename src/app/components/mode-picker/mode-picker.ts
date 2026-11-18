import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
} from '@angular/core';

import type { GameMode } from '../../game/game.service';
import { MODES, MODE_ORDER } from '../../game/modes';

@Component({
  selector: 'app-mode-picker',
  standalone: true,
  templateUrl: './mode-picker.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModePicker {

  // Recibe la modalidad seleccionada.
  readonly mode = input.required<GameMode>();

  // Comunica al componente principal cuando cambia el modo.
  readonly selectMode = output<GameMode>();

  // Datos utilizados por la plantilla.
  readonly modes = MODES;
  readonly modeOrder = MODE_ORDER;
}