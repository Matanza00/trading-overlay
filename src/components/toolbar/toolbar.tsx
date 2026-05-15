import { MousePointer2, TrendingUp, Minus, Square } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { useOverlayStore } from "~src/store/overlay-store"
import { ToolType } from "~src/types/tools"

type ToolButton = { tool: ToolType; icon: LucideIcon; label: string; hotkey: string }

const tools: ToolButton[] = [
  { tool: ToolType.Select, icon: MousePointer2, label: "Select", hotkey: "V" },
  { tool: ToolType.TrendLine, icon: TrendingUp, label: "Trend", hotkey: "T" },
  { tool: ToolType.HorizontalLine, icon: Minus, label: "H-Line", hotkey: "H" },
  { tool: ToolType.Rectangle, icon: Square, label: "Rect", hotkey: "R" }
]

export const Toolbar = () => {
  const activeTool = useOverlayStore((s) => s.activeTool)
  const setTool = useOverlayStore((s) => s.setTool)

  return (
    <div className="pointer-events-auto absolute left-4 top-4 z-10 flex gap-2 rounded-md border border-zinc-700 bg-zinc-900/95 p-2 shadow-lg">
      {tools.map(({ tool, icon: Icon, label, hotkey }) => {
        const isActive = activeTool === tool
        return (
          <button
            key={tool}
            type="button"
            onClick={() => setTool(tool)}
            className={`flex items-center gap-1 rounded px-2 py-1 text-xs ${
              isActive ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}>
            <Icon className="h-3.5 w-3.5" />
            <span>{label}</span>
            <span className="text-[10px] opacity-70">{hotkey}</span>
          </button>
        )
      })}
    </div>
  )
}
