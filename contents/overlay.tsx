import "~src/styles/tailwind.css"

import { useEffect, useState } from "react"
import type { PlasmoCSConfig, PlasmoGetRootContainer } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  run_at: "document_idle",
  all_frames: false
}

export const getRootContainer: PlasmoGetRootContainer = async () => {
  console.log("[universal-overlay] extension loaded")

  const existing = document.getElementById("universal-overlay-root")
  if (existing) {
    console.log("[universal-overlay] overlay mounted (existing root)")
    return existing
  }

  const root = document.createElement("div")
  root.id = "universal-overlay-root"

  try {
    document.documentElement.appendChild(root)
    console.log("[universal-overlay] overlay mounted")
    return root
  } catch (error) {
    console.error("[universal-overlay] failed to append root to documentElement", error)
    throw error
  }
}

const DebugOverlay = () => {
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    console.log("[universal-overlay] react rendered")
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2147483647,
        pointerEvents: "none",
        background: "rgba(56, 189, 248, 0.08)"
      }}>
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 2147483647,
          pointerEvents: "auto",
          background: "rgba(0,0,0,0.9)",
          color: "#fff",
          borderRadius: 8,
          padding: "8px 10px",
          fontSize: 12,
          lineHeight: 1.4,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
        }}>
        <div className="font-semibold">Overlay Active</div>
        <div>URL: {window.location.href}</div>
        <div>
          Viewport: {viewport.width} × {viewport.height}
        </div>
      </div>
    </div>
  )
}

export default function OverlayEntry() {
  try {
    return <DebugOverlay />
  } catch (error) {
    console.error("[universal-overlay] react mount/render error", error)
    return null
  }
}
