import type { GameMode } from './game.service';

// Información visual de cada modalidad.
export interface ModeInfo {
  name: string;
  code: string;
  desc: string;
}

// Mantiene los nombres y descripciones de React.
export const MODES: Record<GameMode, ModeInfo> = {
  unbeatable: {
    name: 'UnbeatableAI',
    code: '03 / REGLAS',
    desc: 'Nunca pierde. Bloquea y ataca.',
  },

  medium: {
    name: 'MediumAI',
    code: '04 / MEDIO',
    desc: 'Estrategia con algo de azar.',
  },

  minimax: {
    name: 'MinimaxAI',
    code: '06 / MINIMAX',
    desc: 'Calcula todas las jugadas posibles.',
  },

  local: {
    name: '1 vs 1',
    code: 'EXTRA / LOCAL',
    desc: 'Dos personas, un tablero.',
  },
};

// Orden de las tarjetas y sus atajos de teclado.
export const MODE_ORDER: GameMode[] = [
  'unbeatable',
  'medium',
  'minimax',
  'local',
];