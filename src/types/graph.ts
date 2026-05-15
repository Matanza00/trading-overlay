export type GraphCandidate = {
  id: string
  score: number
  rect: DOMRect
  selectorHint: string
  element: HTMLElement
}

export type OverlaySession = {
  id: string
  candidateId: string
  urlKey: string
}
