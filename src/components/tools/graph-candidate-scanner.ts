import { GRAPH_KEYWORDS, MIN_GRAPH_HEIGHT, MIN_GRAPH_WIDTH } from "~src/constants/detection"
import type { GraphCandidate } from "~src/types/graph"
import { createId } from "~src/utils/id"
import { getSelectorHint, isVisible } from "~src/utils/dom"

const hasKeyword = (el: Element) => {
  const token = `${(el as HTMLElement).className || ""} ${(el as HTMLElement).id || ""}`.toLowerCase()
  return GRAPH_KEYWORDS.some((k) => token.includes(k))
}

const scoreCandidate = (el: HTMLElement, rect: DOMRect) => {
  let score = rect.width * rect.height
  if (el.tagName.toLowerCase() === "canvas") score *= 1.25
  if (el.tagName.toLowerCase() === "svg") score *= 1.15
  if (hasKeyword(el)) score *= 1.35
  return score
}

export class GraphCandidateScanner {
  scan(): GraphCandidate[] {
    const nodes = Array.from(document.querySelectorAll("canvas,svg,[class*='chart'],[class*='graph'],[class*='trading']"))
    const candidates: GraphCandidate[] = []

    for (const node of nodes) {
      const el = node as HTMLElement
      if (!isVisible(el)) continue
      const rect = el.getBoundingClientRect()
      if (rect.width < MIN_GRAPH_WIDTH || rect.height < MIN_GRAPH_HEIGHT) continue
      candidates.push({
        id: createId(),
        score: scoreCandidate(el, rect),
        rect,
        selectorHint: getSelectorHint(el),
        element: el
      })
    }

    return candidates.sort((a, b) => b.score - a.score).slice(0, 8)
  }
}
