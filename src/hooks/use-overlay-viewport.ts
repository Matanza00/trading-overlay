import { useEffect, useState } from "react"

export const useOverlayViewport = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    const ro = new ResizeObserver(() => requestAnimationFrame(update))
    ro.observe(document.documentElement)

    const mo = new MutationObserver(() => requestAnimationFrame(update))
    mo.observe(document.documentElement, { attributes: true, subtree: true, childList: true })

    window.addEventListener("resize", update)
    document.addEventListener("fullscreenchange", update)

    return () => {
      ro.disconnect()
      mo.disconnect()
      window.removeEventListener("resize", update)
      document.removeEventListener("fullscreenchange", update)
    }
  }, [])

  return size
}
