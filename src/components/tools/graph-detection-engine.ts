import type { GraphCandidate } from "~src/types/graph"

import { GraphCandidateScanner } from "./graph-candidate-scanner"

export class GraphDetectionEngine {
  private scanner = new GraphCandidateScanner()

  detect(): GraphCandidate[] {
    return this.scanner.scan()
  }
}
