import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ShapeDefinition, GhostPosition, BoolGrid } from '../../types';
import DraggableBlock from './DraggableBlock';
import { COLORS } from '../../constants/colors';
import { TRAY_HEIGHT, SPACING, RADIUS } from '../../constants/theme';

// ─── BlockTray ────────────────────────────────────────────────────────────────

interface Props {
  tray: (ShapeDefinition | null)[];
  grid: BoolGrid;
  gridOriginX: number;
  gridOriginY: number;
  onPlace: (trayIndex: number, row: number, col: number) => void;
  onGhostUpdate: (
    shape: ShapeDefinition | null,
    position: GhostPosition | null,
    valid: boolean
  ) => void;
}

export default function BlockTray({
  tray,
  grid,
  gridOriginX,
  gridOriginY,
  onPlace,
  onGhostUpdate,
}: Props) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((idx: number) => {
    setDraggingIndex(idx);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggingIndex(null);
  }, []);

  return (
    <View style={styles.container}>
      {tray.map((shape, idx) =>
        shape ? (
          <DraggableBlock
            key={`${shape.id}_${idx}`}
            shape={shape}
            trayIndex={idx}
            gridOriginX={gridOriginX}
            gridOriginY={gridOriginY}
            grid={grid}
            onPlace={onPlace}
            onGhostUpdate={onGhostUpdate}
            onDragStart={() => handleDragStart(idx)}
            onDragEnd={handleDragEnd}
            disabled={draggingIndex !== null && draggingIndex !== idx}
          />
        ) : (
          // Empty slot placeholder
          <View key={`empty_${idx}`} style={styles.emptySlot} />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: TRAY_HEIGHT,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  emptySlot: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
