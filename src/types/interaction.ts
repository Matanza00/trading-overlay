import type { Point } from "./canvas"
import type { Tool } from "./tools"

type IdleInteraction = {
  mode: "idle"
}

type DrawingInteraction = {
  mode: "drawing"
  tool: Tool
  start: Point
  current: Point
}

type AnchorEditingInteraction = {
  mode: "anchor-edit"
  shapeId: string
  anchor: "start" | "end"
}

export type InteractionState = IdleInteraction | DrawingInteraction | AnchorEditingInteraction
