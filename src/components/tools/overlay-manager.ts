import type { GraphCandidate } from "~src/types/graph"

import { GraphDetectionEngine } from "./graph-detection-engine"

export class OverlayManager {
  private engine = new GraphDetectionEngine()

  listCandidates(): GraphCandidate[] {
    return this.engine.detect()
  }
}
