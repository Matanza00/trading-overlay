import type { GraphCandidate } from "~src/types/graph"

export const attachOverlayToCandidate = (candidate: GraphCandidate, host: HTMLElement) => {
  const parent = candidate.element.parentElement ?? document.body
  const parentStyle = window.getComputedStyle(parent)
  if (parentStyle.position === "static") parent.style.position = "relative"

  host.style.position = "absolute"
  host.style.left = `${candidate.element.offsetLeft}px`
  host.style.top = `${candidate.element.offsetTop}px`
  host.style.width = `${candidate.element.clientWidth}px`
  host.style.height = `${candidate.element.clientHeight}px`
  host.style.zIndex = "999999"
  host.style.pointerEvents = "none"

  parent.appendChild(host)

  const sync = () => {
    host.style.left = `${candidate.element.offsetLeft}px`
    host.style.top = `${candidate.element.offsetTop}px`
    host.style.width = `${candidate.element.clientWidth}px`
    host.style.height = `${candidate.element.clientHeight}px`
  }

  const ro = new ResizeObserver(sync)
  ro.observe(candidate.element)
  window.addEventListener("scroll", sync, true)
  window.addEventListener("resize", sync)

  return () => {
    ro.disconnect()
    window.removeEventListener("scroll", sync, true)
    window.removeEventListener("resize", sync)
    host.remove()
  }
}
