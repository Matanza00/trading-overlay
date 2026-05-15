import "~src/styles/tailwind.css"

import type { PlasmoCSConfig } from "plasmo"

import { OverlayCanvas } from "~src/components/canvas/overlay-canvas"
import { Toolbar } from "~src/components/toolbar/toolbar"
import { useKeyboardShortcuts } from "~src/hooks/use-keyboard-shortcuts"
import { useOverlayViewport } from "~src/hooks/use-overlay-viewport"
import { usePersistence } from "~src/hooks/use-persistence"

export const config: PlasmoCSConfig = {
  matches: ["https://*.tradingview.com/*"],
  all_frames: true
}

const Overlay = () => {
  usePersistence()
  useKeyboardShortcuts()
  const { width, height } = useOverlayViewport()

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 999999, pointerEvents: "none" }}>
      <Toolbar />
      <OverlayCanvas width={width} height={height} />
    </div>
  )
}

export default Overlay
