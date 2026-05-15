import { useEffect } from "react"

import { STORAGE_KEY } from "~src/constants/storage"
import { useOverlayStore } from "~src/store/overlay-store"
import type { OverlayShape } from "~src/types/shapes"
import { pageKey } from "~src/utils/dom"

export const usePersistence = (scopeKey: string) => {
  const setShapes = useOverlayStore((s) => s.setShapes)

  useEffect(() => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      const map = (result[STORAGE_KEY] || {}) as Record<string, OverlayShape[]>
      setShapes(map[`${pageKey()}::${scopeKey}`] || [])
    })
  }, [scopeKey, setShapes])

  useEffect(() => {
    const unsub = useOverlayStore.subscribe((state) => {
      chrome.storage.local.get([STORAGE_KEY], (result) => {
        const map = (result[STORAGE_KEY] || {}) as Record<string, OverlayShape[]>
        map[`${pageKey()}::${scopeKey}`] = state.shapes
        chrome.storage.local.set({ [STORAGE_KEY]: map })
      })
    })
    return () => unsub()
  }, [scopeKey])
}
