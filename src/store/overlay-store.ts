import { create } from "zustand"

import type { Point } from "~src/types/canvas"
import type { InteractionState } from "~src/types/interaction"
import { ShapeType, type OverlayShape } from "~src/types/shapes"
import { ToolType } from "~src/types/tools"
import { createId } from "~src/utils/id"

type OverlayStore = {
  activeTool: ToolType
  shapes: OverlayShape[]
  selectedShapeId: string | null
  hoveredShapeId: string | null
  interaction: InteractionState
  setTool: (tool: ToolType) => void
  setShapes: (shapes: OverlayShape[]) => void
  setSelectedShapeId: (id: string | null) => void
  setHoveredShapeId: (id: string | null) => void
  startDrawing: (tool: ToolType, point: Point) => void
  updateDrawing: (point: Point) => void
  commitDrawing: () => void
  cancelInteraction: () => void
  deleteSelected: () => void
  updateShape: (shapeId: string, updater: (shape: OverlayShape) => OverlayShape) => void
  moveShape: (shapeId: string, dx: number, dy: number) => void
}

export const useOverlayStore = create<OverlayStore>((set, get) => ({
  activeTool: ToolType.Select,
  shapes: [],
  selectedShapeId: null,
  hoveredShapeId: null,
  interaction: { mode: "idle" },
  setTool: (tool) => set({ activeTool: tool, interaction: { mode: "idle" } }),
  setShapes: (shapes) => set({ shapes }),
  setSelectedShapeId: (selectedShapeId) => set({ selectedShapeId }),
  setHoveredShapeId: (hoveredShapeId) => set({ hoveredShapeId }),
  startDrawing: (tool, point) =>
    set({
      interaction: { mode: "drawing", tool, start: point, current: point },
      selectedShapeId: null
    }),
  updateDrawing: (point) => {
    const { interaction } = get()
    if (interaction.mode !== "drawing") return
    set({ interaction: { ...interaction, current: point } })
  },
  commitDrawing: () => {
    const { interaction, shapes } = get()
    if (interaction.mode !== "drawing") return

    const createdAt = Date.now()
    const id = createId()
    let next: OverlayShape | null = null

    if (interaction.tool === ToolType.TrendLine) {
      next = { id, type: ShapeType.TrendLine, start: interaction.start, end: interaction.current, createdAt }
    }

    if (interaction.tool === ToolType.Rectangle) {
      next = { id, type: ShapeType.Rectangle, start: interaction.start, end: interaction.current, createdAt }
    }

    if (next) {
      set({ shapes: [...shapes, next], interaction: { mode: "idle" }, selectedShapeId: id })
      return
    }

    set({ interaction: { mode: "idle" } })
  },
  cancelInteraction: () => set({ interaction: { mode: "idle" } }),
  deleteSelected: () => {
    const { selectedShapeId, shapes } = get()
    if (!selectedShapeId) return
    set({ shapes: shapes.filter((shape) => shape.id !== selectedShapeId), selectedShapeId: null })
  },
  updateShape: (shapeId, updater) => {
    const { shapes } = get()
    set({ shapes: shapes.map((shape) => (shape.id === shapeId ? updater(shape) : shape)) })
  },
  moveShape: (shapeId, dx, dy) => {
    get().updateShape(shapeId, (shape) => {
      if (shape.type === ShapeType.HorizontalLine) return { ...shape, y: shape.y + dy }
      return {
        ...shape,
        start: { x: shape.start.x + dx, y: shape.start.y + dy },
        end: { x: shape.end.x + dx, y: shape.end.y + dy }
      }
    })
  }
}))
