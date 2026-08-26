import { BoolGrid, ColorGrid, ShapeDefinition, GhostPosition } from '../types';
import { GRID_SIZE } from '../constants/theme';

// ─── Grid Creation ────────────────────────────────────────────────────────────

export function createEmptyGrid(): BoolGrid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => false)
  );
}

export function createEmptyColorGrid(): ColorGrid {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => null)
  );
}

// ─── Placement ────────────────────────────────────────────────────────────────

/**
 * Returns true if the shape can be placed at (row, col) without going
 * out of bounds or overlapping existing filled cells.
 */
export function canPlaceShape(
  grid: BoolGrid,
  shape: ShapeDefinition,
  row: number,
  col: number
): boolean {
  const cells = shape.cells;
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      if (!cells[r][c]) continue;
      const gr = row + r;
      const gc = col + c;
      if (gr < 0 || gr >= GRID_SIZE || gc < 0 || gc >= GRID_SIZE) return false;
      if (grid[gr][gc]) return false;
    }
  }
  return true;
}

/**
 * Returns a new grid with the shape placed at (row, col).
 * Does NOT mutate the original grid.
 */
export function placeShape(
  grid: BoolGrid,
  shape: ShapeDefinition,
  row: number,
  col: number
): BoolGrid {
  const newGrid = grid.map(r => [...r]);
  const cells = shape.cells;
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      if (cells[r][c]) {
        newGrid[row + r][col + c] = true;
      }
    }
  }
  return newGrid;
}

/**
 * Returns a new colorGrid with shape color applied.
 */
export function placeShapeColor(
  colorGrid: ColorGrid,
  shape: ShapeDefinition,
  row: number,
  col: number
): ColorGrid {
  const newGrid = colorGrid.map(r => [...r]);
  const cells = shape.cells;
  for (let r = 0; r < cells.length; r++) {
    for (let c = 0; c < cells[r].length; c++) {
      if (cells[r][c]) {
        newGrid[row + r][col + c] = shape.color;
      }
    }
  }
  return newGrid;
}

// ─── Line Detection ───────────────────────────────────────────────────────────

/** Returns indices of all fully-filled rows. */
export function findFullRows(grid: BoolGrid): number[] {
  const full: number[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r].every(cell => cell)) {
      full.push(r);
    }
  }
  return full;
}

/** Returns indices of all fully-filled columns. */
export function findFullCols(grid: BoolGrid): number[] {
  const full: number[] = [];
  for (let c = 0; c < GRID_SIZE; c++) {
    let allFilled = true;
    for (let r = 0; r < GRID_SIZE; r++) {
      if (!grid[r][c]) {
        allFilled = false;
        break;
      }
    }
    if (allFilled) full.push(c);
  }
  return full;
}

/**
 * Returns a new grid with specified rows and columns cleared.
 */
export function clearLines(
  grid: BoolGrid,
  rows: number[],
  cols: number[]
): BoolGrid {
  const newGrid = grid.map(r => [...r]);
  for (const r of rows) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[r][c] = false;
    }
  }
  for (const c of cols) {
    for (let r = 0; r < GRID_SIZE; r++) {
      newGrid[r][c] = false;
    }
  }
  return newGrid;
}

/**
 * Returns a new colorGrid with specified rows and columns cleared.
 */
export function clearLinesColor(
  colorGrid: ColorGrid,
  rows: number[],
  cols: number[]
): ColorGrid {
  const newGrid = colorGrid.map(r => [...r]);
  for (const r of rows) {
    for (let c = 0; c < GRID_SIZE; c++) {
      newGrid[r][c] = null;
    }
  }
  for (const c of cols) {
    for (let r = 0; r < GRID_SIZE; r++) {
      newGrid[r][c] = null;
    }
  }
  return newGrid;
}

// ─── Game Over Detection ──────────────────────────────────────────────────────

/**
 * Returns true if none of the tray shapes can be placed anywhere on the grid.
 */
export function checkGameOver(
  grid: BoolGrid,
  tray: ShapeDefinition[]
): boolean {
  for (const shape of tray) {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (canPlaceShape(grid, shape, r, c)) {
          return false;
        }
      }
    }
  }
  return true;
}

// ─── Ghost Position ───────────────────────────────────────────────────────────

/**
 * Given a finger position in grid-cell coordinates (possibly fractional),
 * finds the best valid snap position for the piece.
 * Returns null if no valid position exists near the finger.
 */
export function getGhostPosition(
  grid: BoolGrid,
  shape: ShapeDefinition,
  fingerRow: number,
  fingerCol: number
): GhostPosition | null {
  // Center the shape on finger
  const shapeRows = shape.cells.length;
  const shapeCols = shape.cells[0].length;
  const snapRow = Math.round(fingerRow - shapeRows / 2);
  const snapCol = Math.round(fingerCol - shapeCols / 2);

  if (canPlaceShape(grid, shape, snapRow, snapCol)) {
    return { row: snapRow, col: snapCol };
  }

  // Search nearby positions (±1)
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = snapRow + dr;
      const c = snapCol + dc;
      if (canPlaceShape(grid, shape, r, c)) {
        return { row: r, col: c };
      }
    }
  }

  return null;
}

// ─── Cell counting ────────────────────────────────────────────────────────────

/** Count how many cells a shape has. */
export function countCells(shape: ShapeDefinition): number {
  return shape.cells.reduce(
    (total, row) => total + row.filter(c => c).length,
    0
  );
}
