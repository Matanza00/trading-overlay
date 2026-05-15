import { useEffect } from "react"

import { useOverlayStore } from "~src/store/overlay-store"
import { ToolType } from "~src/types/tools"

export const useKeyboardShortcuts = () => {
  const setTool = useOverlayStore((s) => s.setTool)
  const deleteSelected = useOverlayStore((s) => s.deleteSelected)
  const cancelInteraction = useOverlayStore((s) => s.cancelInteraction)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((event.target as HTMLElement)?.tagName)) return
      const key = event.key.toLowerCase()
      if (key === "v") setTool(ToolType.Select)
      if (key === "t") setTool(ToolType.TrendLine)
      if (key === "h") setTool(ToolType.HorizontalLine)
      if (key === "r") setTool(ToolType.Rectangle)
      if (event.key === "Delete" || event.key === "Backspace") deleteSelected()
      if (event.key === "Escape") cancelInteraction()
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [cancelInteraction, deleteSelected, setTool])
}
