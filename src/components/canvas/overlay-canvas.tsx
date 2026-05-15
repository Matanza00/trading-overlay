import { memo } from "react"
import { Circle, Layer, Line, Rect, Stage } from "react-konva"

import { useOverlayStore } from "~src/store/overlay-store"
import { ShapeType } from "~src/types/shapes"
import { ToolType } from "~src/types/tools"

export const OverlayCanvas = memo(({ width, height }: { width: number; height: number }) => {
  const { shapes, selectedShapeId, activeTool, interaction } = useOverlayStore((s) => s)
  const { setSelectedShapeId, startDrawing, updateDrawing, commitDrawing, moveShape, updateShape, setTool } = useOverlayStore((s) => s)

  const onStageMouseDown = (evt) => {
    const pos = evt.target.getStage()?.getPointerPosition()
    if (!pos) return
    if (activeTool === ToolType.HorizontalLine) {
      const id = crypto.randomUUID()
      useOverlayStore.setState((state) => ({
        shapes: [...state.shapes, { id, type: ShapeType.HorizontalLine, y: pos.y, createdAt: Date.now() }],
        selectedShapeId: id,
        activeTool: ToolType.Select
      }))
      return
    }
    if (activeTool === ToolType.TrendLine || activeTool === ToolType.Rectangle) startDrawing(activeTool, pos)
    if (activeTool === ToolType.Select && evt.target === evt.target.getStage()) setSelectedShapeId(null)
  }

  const onStageMouseMove = (evt) => {
    const pos = evt.target.getStage()?.getPointerPosition()
    if (pos) updateDrawing(pos)
  }

  const onStageMouseUp = () => {
    if (interaction.mode === "drawing") {
      commitDrawing()
      setTool(ToolType.Select)
    }
  }

  return (
    <div className="pointer-events-auto h-full w-full">
      <Stage width={width} height={height} onMouseDown={onStageMouseDown} onMouseMove={onStageMouseMove} onMouseUp={onStageMouseUp}>
        <Layer />
        <Layer>
          {shapes.map((shape) => {
            const isSelected = selectedShapeId === shape.id
            if (shape.type === ShapeType.TrendLine) {
              return <Line key={shape.id} points={[shape.start.x, shape.start.y, shape.end.x, shape.end.y]} stroke={isSelected ? "#60a5fa" : "#e4e4e7"} strokeWidth={2} onClick={() => setSelectedShapeId(shape.id)} draggable={activeTool===ToolType.Select} onDragMove={(e)=>moveShape(shape.id,e.target.x(),e.target.y())} onDragEnd={(e)=>e.target.position({x:0,y:0})} />
            }
            if (shape.type === ShapeType.HorizontalLine) {
              return <Line key={shape.id} points={[0, shape.y, width, shape.y]} stroke={isSelected ? "#60a5fa" : "#f4f4f5"} strokeWidth={2} onClick={() => setSelectedShapeId(shape.id)} draggable={activeTool===ToolType.Select} dragBoundFunc={(p)=>({x:0,y:p.y})} onDragMove={(e)=>updateShape(shape.id,(s)=>({...s,y:e.target.y()} as any))} onDragEnd={(e)=>e.target.position({x:0,y:0})} />
            }
            const x = Math.min(shape.start.x, shape.end.x)
            const y = Math.min(shape.start.y, shape.end.y)
            const w = Math.abs(shape.end.x - shape.start.x)
            const h = Math.abs(shape.end.y - shape.start.y)
            return <Rect key={shape.id} x={x} y={y} width={w} height={h} fill="rgba(96,165,250,0.12)" stroke={isSelected ? "#60a5fa" : "#e4e4e7"} strokeWidth={2} onClick={() => setSelectedShapeId(shape.id)} draggable={activeTool===ToolType.Select} onDragMove={(e)=>moveShape(shape.id,e.target.x(),e.target.y())} onDragEnd={(e)=>e.target.position({x:0,y:0})} />
          })}
        </Layer>
        <Layer>
          {interaction.mode === "drawing" && interaction.tool !== ToolType.HorizontalLine && (
            interaction.tool === ToolType.TrendLine ? (
              <Line points={[interaction.start.x, interaction.start.y, interaction.current.x, interaction.current.y]} stroke="#38bdf8" dash={[6, 4]} strokeWidth={2} />
            ) : (
              <Rect x={Math.min(interaction.start.x, interaction.current.x)} y={Math.min(interaction.start.y, interaction.current.y)} width={Math.abs(interaction.current.x - interaction.start.x)} height={Math.abs(interaction.current.y - interaction.start.y)} stroke="#38bdf8" dash={[6, 4]} />
            )
          )}
        </Layer>
        <Layer>
          {shapes.filter((s)=>s.id===selectedShapeId && s.type!==ShapeType.HorizontalLine).map((shape)=>[
            <Circle key={`${shape.id}-s`} x={shape.start.x} y={shape.start.y} radius={4} fill="#fff" stroke="#2563eb" strokeWidth={1.5} draggable onDragMove={(e)=>updateShape(shape.id,(prev)=>({...prev,start:{x:e.target.x(),y:e.target.y()}} as any))} />,
            <Circle key={`${shape.id}-e`} x={shape.end.x} y={shape.end.y} radius={4} fill="#fff" stroke="#2563eb" strokeWidth={1.5} draggable onDragMove={(e)=>updateShape(shape.id,(prev)=>({...prev,end:{x:e.target.x(),y:e.target.y()}} as any))} />
          ])}
        </Layer>
      </Stage>
    </div>
  )
})
