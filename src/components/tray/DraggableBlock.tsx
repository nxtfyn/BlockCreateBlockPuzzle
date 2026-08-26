import React, { useRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { ShapeDefinition, GhostPosition } from '../../types';
import { TRAY_CELL_SIZE, CELL_SIZE, SPACING, RADIUS } from '../../constants/theme';
import { COLORS, BLOCK_GLOW } from '../../constants/colors';
import { canPlaceShape, getGhostPosition } from '../../utils/gridUtils';
import { BoolGrid } from '../../types';

// ─── DraggableBlock ───────────────────────────────────────────────────────────

interface Props {
  shape: ShapeDefinition;
  trayIndex: number;
  gridOriginX: number;
  gridOriginY: number;
  grid: BoolGrid;
  onPlace: (trayIndex: number, row: number, col: number) => void;
  onGhostUpdate: (
    shape: ShapeDefinition | null,
    position: GhostPosition | null,
    valid: boolean
  ) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  disabled?: boolean;
}

// Mini block cell for tray preview
function MiniCell({ color, colorKey }: { color: string; colorKey: string }) {
  const glow = BLOCK_GLOW[colorKey] ?? 'transparent';
  return (
    <View
      style={[
        miniStyles.cell,
        {
          backgroundColor: color,
          shadowColor: glow,
        },
      ]}
    >
      <View
        style={[
          miniStyles.shine,
          { backgroundColor: 'rgba(255,255,255,0.22)' },
        ]}
      />
    </View>
  );
}

// Full-size block cell used while dragging
function FullCell({ color, colorKey }: { color: string; colorKey: string }) {
  const glow = BLOCK_GLOW[colorKey] ?? 'transparent';
  return (
    <View
      style={[
        fullStyles.cell,
        {
          backgroundColor: color,
          shadowColor: glow,
        },
      ]}
    >
      <View
        style={[
          fullStyles.shine,
          { backgroundColor: 'rgba(255,255,255,0.22)' },
        ]}
      />
    </View>
  );
}

export default function DraggableBlock({
  shape,
  trayIndex,
  gridOriginX,
  gridOriginY,
  grid,
  onPlace,
  onGhostUpdate,
  onDragStart,
  onDragEnd,
  disabled = false,
}: Props) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDragging = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const shapeRows = shape.cells.length;
  const shapeCols = shape.cells[0].length;

  // Finger offset — lift piece above finger so it's visible
  const FINGER_OFFSET_Y = -(CELL_SIZE * 1.5);

  const updateGhost = useCallback(
    (absX: number, absY: number) => {
      const adjustedY = absY + FINGER_OFFSET_Y;
      // Convert absolute position to grid coordinates
      const gridX = absX - gridOriginX - (shapeCols / 2) * CELL_SIZE;
      const gridY = adjustedY - gridOriginY - (shapeRows / 2) * CELL_SIZE;

      const fingerCol = gridX / CELL_SIZE + shapeCols / 2;
      const fingerRow = gridY / CELL_SIZE + shapeRows / 2;

      const ghost = getGhostPosition(grid, shape, fingerRow, fingerCol);
      const valid = ghost
        ? canPlaceShape(grid, shape, ghost.row, ghost.col)
        : false;

      onGhostUpdate(ghost ? shape : null, ghost, valid);
    },
    [grid, shape, gridOriginX, gridOriginY, shapeCols, shapeRows, onGhostUpdate]
  );

  const clearGhost = useCallback(() => {
    onGhostUpdate(null, null, false);
  }, [onGhostUpdate]);

  const tryPlace = useCallback(
    (absX: number, absY: number) => {
      const adjustedY = absY + FINGER_OFFSET_Y;
      const gridX = absX - gridOriginX - (shapeCols / 2) * CELL_SIZE;
      const gridY = adjustedY - gridOriginY - (shapeRows / 2) * CELL_SIZE;

      const fingerCol = gridX / CELL_SIZE + shapeCols / 2;
      const fingerRow = gridY / CELL_SIZE + shapeRows / 2;

      const ghost = getGhostPosition(grid, shape, fingerRow, fingerCol);
      if (ghost && canPlaceShape(grid, shape, ghost.row, ghost.col)) {
        onPlace(trayIndex, ghost.row, ghost.col);
        return true;
      }
      return false;
    },
    [grid, shape, trayIndex, gridOriginX, gridOriginY, shapeCols, shapeRows, onPlace]
  );

  const panGesture = Gesture.Pan()
    .enabled(!disabled)
    .onBegin((_e: { absoluteX: number; absoluteY: number }) => {
      isDragging.value = true;
      startX.value = _e.absoluteX;
      startY.value = _e.absoluteY;
      scale.value = withSpring(1.3, { damping: 12, stiffness: 200 });
      runOnJS(onDragStart)();
    })
    .onUpdate((_e: { absoluteX: number; absoluteY: number }) => {
      translateX.value = _e.absoluteX - startX.value;
      translateY.value = _e.absoluteY - startY.value + FINGER_OFFSET_Y;
      runOnJS(updateGhost)(_e.absoluteX, _e.absoluteY);
    })
    .onEnd((_e: { absoluteX: number; absoluteY: number }) => {
      runOnJS(tryPlace)(_e.absoluteX, _e.absoluteY);
      // Return to origin
      translateX.value = withSpring(0, { damping: 15, stiffness: 250 });
      translateY.value = withSpring(0, { damping: 15, stiffness: 250 });
      scale.value = withSpring(1, { damping: 12, stiffness: 200 });
      isDragging.value = false;
      runOnJS(clearGhost)();
      runOnJS(onDragEnd)();
    })
    .onFinalize(() => {
      if (isDragging.value) {
        translateX.value = withSpring(0, { damping: 15, stiffness: 250 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 250 });
        scale.value = withSpring(1, { damping: 12, stiffness: 200 });
        isDragging.value = false;
        runOnJS(clearGhost)();
        runOnJS(onDragEnd)();
      }
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: isDragging.value ? 999 : 1,
  }));

  // Compute tray preview dimensions
  const previewWidth = shapeCols * (TRAY_CELL_SIZE + 2);
  const previewHeight = shapeRows * (TRAY_CELL_SIZE + 2);

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.wrapper, animStyle]}>
        {/* Tray preview (mini size) */}
        <View
          style={[
            styles.preview,
            { width: previewWidth, height: previewHeight },
          ]}
        >
          {shape.cells.map((rowArr, r) => (
            <View key={r} style={styles.shapeRow}>
              {rowArr.map((cell, c) =>
                cell ? (
                  <MiniCell
                    key={c}
                    color={shape.color}
                    colorKey={shape.colorKey}
                  />
                ) : (
                  <View
                    key={c}
                    style={{ width: TRAY_CELL_SIZE + 2, height: TRAY_CELL_SIZE + 2 }}
                  />
                )
              )}
            </View>
          ))}
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
  },
  preview: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  shapeRow: {
    flexDirection: 'row',
  },
});

const miniStyles = StyleSheet.create({
  cell: {
    width: TRAY_CELL_SIZE,
    height: TRAY_CELL_SIZE,
    borderRadius: RADIUS.xs,
    margin: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 3,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderTopLeftRadius: RADIUS.xs,
    borderTopRightRadius: RADIUS.xs,
  },
});

const fullStyles = StyleSheet.create({
  cell: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    borderRadius: RADIUS.xs,
    margin: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 5,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderTopLeftRadius: RADIUS.xs,
    borderTopRightRadius: RADIUS.xs,
  },
});
