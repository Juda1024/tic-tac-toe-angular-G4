import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './app';

describe('GRID/09: integración de la interfaz Angular', () => {
  let fixture: ComponentFixture<App>;
  let root: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [App] });
    fixture = TestBed.createComponent(App);
    root = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  function cards(): HTMLButtonElement[] {
    return Array.from(root.querySelectorAll<HTMLButtonElement>('.mode-card'));
  }

  function cells(): HTMLButtonElement[] {
    return Array.from(root.querySelectorAll<HTMLButtonElement>('.cell'));
  }

  function click(element: HTMLButtonElement): void {
    element.click();
    fixture.detectChanges();
  }

  function startGame(): void {
    const button = root.querySelector<HTMLButtonElement>('.start-bar .cta');
    if (!button) throw new Error('No se encontró el botón Empezar');
    click(button);
  }

  function selectMode(index: number): void {
    const button = cards()[index];
    if (!button) throw new Error(`No se encontró el modo ${index + 1}`);
    click(button);
  }

  function move(position: number): void {
    const cell = cells()[position - 1];
    if (!cell) throw new Error(`No se encontró la casilla ${position}`);
    click(cell);
  }

  function waitForAI(): void {
    vi.advanceTimersByTime(500);
    fixture.detectChanges();
  }

  it('muestra los cuatro modos antes de entrar al tablero', () => {
    expect(cards()).toHaveLength(4);
    expect(root.textContent).toContain('UnbeatableAI');
    expect(root.textContent).toContain('MediumAI');
    expect(root.textContent).toContain('MinimaxAI');
    expect(root.textContent).toContain('1 vs 1');
    expect(cells()).toHaveLength(0);

    startGame();

    expect(cells()).toHaveLength(9);
    expect(cards()).toHaveLength(0);
  });

  it('marca el modo seleccionado y lo muestra en la partida', () => {
    selectMode(2); // 3 = MinimaxAI

    expect(cards()[2].getAttribute('aria-pressed')).toBe('true');
    startGame();

    expect(root.querySelector('.arena-mode')?.textContent).toContain('MinimaxAI');
  });

  it('MediumAI responde al movimiento humano y libera el tablero', () => {
    selectMode(1);
    startGame();
    move(1);

    expect(cells()[0].textContent?.trim()).toBe('X');
    expect(cells()[1].disabled).toBe(true);

    waitForAI();

    expect(cells()[4].textContent?.trim()).toBe('O');
    expect(cells()[1].disabled).toBe(false);
  });

  it.each([
    [0, 'UnbeatableAI'],
    [2, 'MinimaxAI'],
  ] as const)('el modo %s usa %s y responde con el centro', (index, name) => {
    selectMode(index);
    startGame();

    expect(root.querySelector('.arena-mode')?.textContent).toContain(name);
    move(1);
    waitForAI();

    expect(cells()[4].textContent?.trim()).toBe('O');
  });

  it('permite jugar a dos personas sin jugadas automáticas', () => {
    selectMode(3); // 4 = 1 vs 1
    startGame();

    move(1);
    waitForAI();
    expect(cells()[0].textContent?.trim()).toBe('X');
    expect(cells()[4].textContent?.trim()).toBe('');

    move(5);
    expect(cells()[4].textContent?.trim()).toBe('O');
  });

  it('señala la victoria local y bloquea las casillas restantes', () => {
    selectMode(3);
    startGame();

    for (const position of [1, 4, 2, 5, 3]) move(position);

    for (const position of [1, 2, 3]) {
      expect(cells()[position - 1].classList.contains('winning-cell')).toBe(true);
    }
    expect(cells()[5].disabled).toBe(true);
  });

  it('detecta un empate en la modalidad local', () => {
    selectMode(3);
    startGame();

    // Alternancia X/O que llena las nueve casillas sin tres en raya.
    for (const position of [1, 2, 3, 5, 4, 6, 8, 7, 9]) move(position);

    expect(root.querySelector('.status')?.textContent?.toLowerCase()).toContain('empate');
    expect(cells().every(cell => cell.disabled)).toBe(true);
  });

  it('Nueva partida cancela la jugada que la IA aún no hizo', () => {
    startGame();
    move(1);

    const reset = root.querySelector<HTMLButtonElement>('.arena-actions .cta');
    if (!reset) throw new Error('No se encontró Nueva partida');
    click(reset);

    waitForAI();
    expect(cells().every(cell => cell.textContent?.trim() === '')).toBe(true);
  });

  it('permite volver a Modos y empezar con un tablero nuevo', () => {
    startGame();
    move(1);

    const back = root.querySelector<HTMLButtonElement>('.arena-head .ghost');
    if (!back) throw new Error('No se encontró Volver a modos');
    click(back);

    expect(cards()).toHaveLength(4);
    expect(cells()).toHaveLength(0);

    selectMode(3);
    startGame();
    waitForAI();

    expect(cells().every(cell => cell.textContent?.trim() === '')).toBe(true);
  });
});
