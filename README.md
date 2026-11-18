# GRID/09 – Tic-Tac-Toe Angular

Videojuego de Tres en Raya desarrollado con Angular y TypeScript como parte del laboratorio de Desarrollo de Videojuegos de la Universidad de las Fuerzas Armadas ESPE.

## Descripción

El proyecto implementa el juego clásico de Tres en Raya (Tic-Tac-Toe), incorporando diferentes estrategias de inteligencia artificial y un modo multijugador local.

Esta versión corresponde a la implementación desarrollada con Angular y es independiente del proyecto realizado con React.

## Modalidades de juego

### 1. UnbeatableAI
Inteligencia artificial basada en reglas heurísticas.

- Busca movimientos ganadores.
- Bloquea amenazas del jugador.
- Detecta oportunidades de doble amenaza.
- Prioriza posiciones estratégicas.

### 2. MediumAI
Inteligencia artificial de dificultad intermedia.

- Prioriza la casilla central.
- Identifica oportunidades de victoria.
- Bloquea movimientos ganadores.
- Selecciona posiciones libres mediante aleatoriedad.

### 3. MinimaxAI
Inteligencia artificial que utiliza el algoritmo Minimax.

- Explora posibles estados futuros.
- Evalúa victorias, derrotas y empates.
- Selecciona movimientos óptimos.
- Considera la profundidad de las jugadas.

### 4. Multijugador local (1 vs 1)
Modalidad adicional que permite jugar a dos personas desde el mismo dispositivo, alternando los símbolos X y O.

## Tecnologías utilizadas

- Angular
- TypeScript
- HTML5
- CSS3
- Angular Signals
- Vitest
- Node.js y npm
- Git y GitHub

## Requisitos

Tener instalados:

- Node.js
- npm
- Angular CLI

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Juda1024/tic-tac-toe-angular-G-4.git
```

Ingresar al proyecto:

```bash
cd tic-tac-toe-angular-G-4
```

Instalar dependencias:

```bash
npm install
```

## Ejecutar el videojuego

```bash
ng serve --open
```

La aplicación estará disponible normalmente en:

http://localhost:4200

## Pruebas automatizadas

Ejecutar todas las pruebas:

```bash
ng test --watch=false
```

Las pruebas incluyen:

- Validación de reglas del juego.
- Detección de victorias y empates.
- Validación de movimientos.
- Evaluación de las estrategias de inteligencia artificial.
- Verificación del algoritmo Minimax.
- Gestión de turnos y estados.
- Pruebas de integración de la interfaz.

## Compilación

```bash
ng build
```

## Organización

El proyecto separa la lógica del videojuego de los componentes visuales.

- `src/app/game/`: reglas, inteligencia artificial y gestión de partidas.
- `src/app/components/`: componentes de la interfaz.
- `src/app/app.ts`: coordinación principal de la aplicación.
- `src/styles.css`: estilos generales.

## Proyecto académico

**Universidad:** Universidad de las Fuerzas Armadas ESPE

**Asignatura:** Desarrollo de Videojuegos

**Grupo:** 4

**Proyecto:** Tic-Tac-Toe

**Framework:** Angular