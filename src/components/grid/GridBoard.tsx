import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, LayoutChangeEvent } from 'react-native';
import { COLORS, BLOCK_COLORS, BLOCK_COLOR_KEYS, BLOCK_GLOW } from '../../constants/colors';
import { GRID_SIZE, CELL_SIZE, GRID_GAP, GRID_WIDTH, RADIUS } from '../../constants/theme';
import { BoolGrid, ColorGrid, ShapeDefinition, GhostPosition } from '../../types';
import GridCell from './GridCell';

// ─── Helper: get colorKey from color hex string ───────────────────────────────
function getColorKey(color: string | null): string | null {
  if (!color) return null;
  const idx = BLOCK_COLORS.indexOf(color);
  if (idx >= 0) return BLOCK_COLOR_KEYS[idx] ?? null;
  return null;
}

// ─── GridBoard ────────────────────────────────────────────────────────────────

interface Props {
  grid: BoolGrid;
  colorGrid: ColorGrid;
  clearingRows: number[];
  clearingCols: number[];
  ghostShape: ShapeDefinition | null;
  ghostPosition: GhostPosition | null;
  ghostValid: boolean;
  onLayout: (x: number, y: number, width: number, height: number) => void;
}

export default function GridBoard({
  grid,
  colorGrid,
  clearingRows,
  clearingCols,
  ghostShape,
  ghostPosition,
  ghostValid,
  onLayout,
}: Props) {
  const viewRef = useRef<View>(null);

  const handleLayout = useCallback(
    (_e: LayoutChangeEvent) => {
      viewRef.current?.measure((_fx, _fy, w, h, px, py) => {
        onLayout(px, py, w, h);
      });
    },
    [onLayout]
  );

  // Build ghost cells set
  const ghostCells = new Set<string>();
  if (ghostShape && ghostPosition) {
    for (let r = 0; r < ghostShape.cells.length; r++) {
      for (let c = 0; c < ghostShape.cells[r].length; c++) {
        if (ghostShape.cells[r][c]) {
          ghostCells.add(`${ghostPosition.row + r},${ghostPosition.col + c}`);
        }
      }
    }
  }

  const clearingRowSet = new Set(clearingRows);
  const clearingColSet = new Set(clearingCols);

  return (
    <View
      ref={viewRef}
      style={styles.container}
      onLayout={handleLayout}
    >
      <View style={styles.grid}>
        {Array.from({ length: GRID_SIZE }, (_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: GRID_SIZE }, (_, col) => {
              const filled = grid[row][col];
              const color = colorGrid[row][col];
              const colorKey = getColorKey(color);
              const isClearing = clearingRowSet.has(row) || clearingColSet.has(col);
              const isGhost = ghostCells.has(`${row},${col}`) && !filled;

              return (
                <GridCell
                  key={col}
                  filled={filled}
                  color={color}
                  colorKey={colorKey}
                  isClearing={isClearing}
                  isGhost={isGhost}
                  isGhostValid={ghostValid}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: GRID_WIDTH + GRID_GAP,
    alignSelf: 'center',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: GRID_GAP / 2,
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
});
