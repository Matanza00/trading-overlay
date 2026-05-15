import "~src/styles/tailwind.css"

import { useEffect, useMemo, useState } from "react"
import type { PlasmoCSConfig } from "plasmo"

import { OverlayCanvas } from "~src/components/canvas/overlay-canvas"
import { Toolbar } from "~src/components/toolbar/toolbar"
import { OverlayManager } from "~src/components/tools/overlay-manager"
import { useKeyboardShortcuts } from "~src/hooks/use-keyboard-shortcuts"
import { usePersistence } from "~src/hooks/use-persistence"
import type { GraphCandidate } from "~src/types/graph"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

const manager = new OverlayManager()

const Overlay = () => {
  const [candidates, setCandidates] = useState<GraphCandidate[]>([])
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(null)

  const activeCandidate = useMemo(
    () => candidates.find((candidate) => candidate.id === activeCandidateId) || null,
    [activeCandidateId, candidates]
  )

  usePersistence(activeCandidate?.selectorHint || "inactive")
  useKeyboardShortcuts()

  useEffect(() => {
    const runScan = () => setCandidates(manager.listCandidates())
    runScan()
    const iv = window.setInterval(runScan, 1500)
    return () => window.clearInterval(iv)
  }, [])

  return (
    <>
      {candidates.map((candidate) => (
        <button
          key={candidate.id}
          type="button"
          className="fixed z-[999998] rounded bg-zinc-900/90 px-2 py-1 text-xs text-white"
          style={{ left: candidate.rect.left + 8, top: Math.max(8, candidate.rect.top - 28) }}
          onClick={() => setActiveCandidateId(candidate.id)}>
          Enable Overlay
        </button>
      ))}

      {activeCandidate && (
        <div
          style={{
            position: "fixed",
            left: activeCandidate.rect.left,
            top: activeCandidate.rect.top,
            width: activeCandidate.rect.width,
            height: activeCandidate.rect.height,
            zIndex: 999999,
            pointerEvents: "none"
          }}>
          <Toolbar />
          <button
            type="button"
            className="pointer-events-auto absolute right-2 top-2 rounded bg-zinc-900/90 px-2 py-1 text-xs text-white"
            onClick={() => setActiveCandidateId(null)}>
            Close
          </button>
          <OverlayCanvas width={activeCandidate.rect.width} height={activeCandidate.rect.height} />
        </div>
      )}
    </>
  )
}

export default Overlay
