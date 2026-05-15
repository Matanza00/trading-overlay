import { useEffect } from "react"

import { STORAGE_KEY } from "~src/constants/storage"
import { useOverlayStore } from "~src/store/overlay-store"
import type { OverlayShape } from "~src/types/shapes"

export const usePersistence = () => {
  const setShapes = useOverlayStore((s) => s.setShapes)

  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const saved = result[STORAGE_KEY] as OverlayShape[] | undefined
      if (Array.isArray(saved)) setShapes(saved)
    })
  }, [setShapes])

  useEffect(() => {
    const unsub = useOverlayStore.subscribe((state) => {
      chrome.storage.local.set({ [STORAGE_KEY]: state.shapes })
    })
    return () => unsub()
  }, [])
}
