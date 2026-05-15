import type { Point } from "./canvas"

export enum ShapeType {
  TrendLine = "trendline",
  HorizontalLine = "horizontal",
  Rectangle = "rectangle"
}

type BaseShape = {
  id: string
  type: ShapeType
  createdAt: number
}

export type TrendLineShape = BaseShape & {
  type: ShapeType.TrendLine
  start: Point
  end: Point
}

export type HorizontalLineShape = BaseShape & {
  type: ShapeType.HorizontalLine
  y: number
}

export type RectangleShape = BaseShape & {
  type: ShapeType.Rectangle
  start: Point
  end: Point
}

export type OverlayShape = TrendLineShape | HorizontalLineShape | RectangleShape

export type AnchorKey = "start" | "end"
