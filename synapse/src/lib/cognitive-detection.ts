interface InteractionData {
  timestamp: number
  type: "keypress" | "mousemove" | "scroll" | "click" | "focus" | "blur"
  data: any
}

interface CognitiveMetrics {
  typingSpeed: number
  typingRhythm: number
  mouseVelocity: number
  scrollPattern: number
  focusStability: number
  taskSwitching: number
}

export class CognitiveDetectionEngine {
  private interactions: InteractionData[] = []
  private readonly maxHistorySize = 1000
  private readonly analysisWindow = 30000 // 30 seconds

  constructor() {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    if (typeof window === "undefined") return

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      this.recordInteraction("keypress", {
        key: e.key,
        timestamp: Date.now(),
        interval: this.getLastKeypressInterval(),
      })
    })

    // Mouse events
    document.addEventListener("mousemove", (e) => {
      this.recordInteraction("mousemove", {
        x: e.clientX,
        y: e.clientY,
        velocity: this.calculateMouseVelocity(e),
      })
    })

    // Scroll events
    document.addEventListener("scroll", (e) => {
      this.recordInteraction("scroll", {
        scrollY: window.scrollY,
        direction: this.getScrollDirection(),
      })
    })

    // Focus events
    window.addEventListener("focus", () => {
      this.recordInteraction("focus", {})
    })

    window.addEventListener("blur", () => {
      this.recordInteraction("blur", {})
    })
  }

  private recordInteraction(type: InteractionData["type"], data: any) {
    this.interactions.push({
      timestamp: Date.now(),
      type,
      data,
    })

    // Maintain history size
    if (this.interactions.length > this.maxHistorySize) {
      this.interactions = this.interactions.slice(-this.maxHistorySize)
    }
  }

  private getLastKeypressInterval(): number {
    const keypresses = this.interactions.filter((i) => i.type === "keypress").slice(-2)

    if (keypresses.length < 2) return 0
    if (!keypresses[0] || !keypresses[1]) return 0
    return keypresses[1].timestamp - keypresses[0].timestamp
  }

  private calculateMouseVelocity(e: MouseEvent): number {
    const lastMouseMove = this.interactions.filter((i) => i.type === "mousemove").slice(-1)[0]

    if (!lastMouseMove) return 0

    const dx = e.clientX - lastMouseMove.data.x
    const dy = e.clientY - lastMouseMove.data.y
    const dt = Date.now() - lastMouseMove.timestamp

    return Math.sqrt(dx * dx + dy * dy) / dt
  }

  private getScrollDirection(): "up" | "down" | "none" {
    const scrollEvents = this.interactions.filter((i) => i.type === "scroll").slice(-2)

    if (scrollEvents.length < 2 || !scrollEvents[1] || !scrollEvents[0]) return "none"

    const current = scrollEvents[1].data?.scrollY
    const previous = scrollEvents[0].data?.scrollY

    return current > previous ? "down" : current < previous ? "up" : "none"
  }

  public analyzeCognitiveState(): {
    state: "focused" | "fatigued" | "distracted" | "receptive"
    confidence: number
    metrics: CognitiveMetrics
  } {
    const now = Date.now()
    const recentInteractions = this.interactions.filter((i) => now - i.timestamp <= this.analysisWindow)

    const metrics = this.calculateMetrics(recentInteractions)
    const state = this.classifyState(metrics)
    const confidence = this.calculateConfidence(metrics, recentInteractions.length)

    return { state, confidence, metrics }
  }

  private calculateMetrics(interactions: InteractionData[]): CognitiveMetrics {
    const keypresses = interactions.filter((i) => i.type === "keypress")
    const mouseMoves = interactions.filter((i) => i.type === "mousemove")
    const scrolls = interactions.filter((i) => i.type === "scroll")
    const focusEvents = interactions.filter((i) => i.type === "focus" || i.type === "blur")

    return {
      typingSpeed: this.calculateTypingSpeed(keypresses),
      typingRhythm: this.calculateTypingRhythm(keypresses),
      mouseVelocity: this.calculateAverageMouseVelocity(mouseMoves),
      scrollPattern: this.calculateScrollPattern(scrolls),
      focusStability: this.calculateFocusStability(focusEvents),
      taskSwitching: this.calculateTaskSwitching(focusEvents),
    }
  }

  private calculateTypingSpeed(keypresses: InteractionData[]): number {
    if (keypresses.length < 2) return 0

    const first = keypresses[0];
    const last = keypresses[keypresses.length - 1];
    if (!first || !last) return 0;

    const timeSpan = last.timestamp - first.timestamp;
    return (keypresses.length / timeSpan) * 60000 // WPM approximation
  }

  private calculateTypingRhythm(keypresses: InteractionData[]): number {
    if (keypresses.length < 3) return 0

    const intervals = keypresses.slice(1).map((kp, i) => {
      const prev = keypresses[i];
      return prev && kp ? kp.timestamp - prev.timestamp : 0;
    })

    const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length
    const variance = intervals.reduce((acc, interval) => acc + Math.pow(interval - mean, 2), 0) / intervals.length

    return Math.sqrt(variance) // Standard deviation as rhythm measure
  }

  private calculateAverageMouseVelocity(mouseMoves: InteractionData[]): number {
    if (mouseMoves.length === 0) return 0

    const velocities = mouseMoves.map((m) => m.data.velocity || 0)
    return velocities.reduce((a, b) => a + b, 0) / velocities.length
  }

  private calculateScrollPattern(scrolls: InteractionData[]): number {
    if (scrolls.length < 2) return 0

    let directionChanges = 0
    let totalDistance = 0

    for (let i = 1; i < scrolls.length; i++) {
      const current = scrolls[i].data?.scrollY ?? 0
      const previous = scrolls[i - 1].data?.scrollY ?? 0
      const distance = Math.abs(current - previous)

      totalDistance += distance

      if (i > 1) {
        const prevDirection = (scrolls[i - 1].data?.scrollY ?? 0) - (scrolls[i - 2].data?.scrollY ?? 0)
        const currDirection = current - previous

        if ((prevDirection > 0 && currDirection < 0) || (prevDirection < 0 && currDirection > 0)) {
          directionChanges++
        }
      }
    }

    return directionChanges / Math.max(totalDistance, 1) // Normalized erratic scrolling
  }

  private calculateFocusStability(focusEvents: InteractionData[]): number {
    const focusLosses = focusEvents.filter((e) => e.type === "blur").length
    const timeSpan = this.analysisWindow / 1000 // Convert to seconds

    return Math.max(0, 1 - focusLosses / timeSpan) // Stability score
  }

  private calculateTaskSwitching(focusEvents: InteractionData[]): number {
    return focusEvents.filter((e) => e.type === "blur").length
  }

  private classifyState(metrics: CognitiveMetrics): "focused" | "fatigued" | "distracted" | "receptive" {
    // Advanced classification logic based on multiple metrics
    const focusScore = this.calculateFocusScore(metrics)
    const fatigueScore = this.calculateFatigueScore(metrics)
    const distractionScore = this.calculateDistractionScore(metrics)

    const scores = {
      focused: focusScore,
      fatigued: fatigueScore,
      distracted: distractionScore,
      receptive: this.calculateReceptiveScore(metrics),
    }

    type StateKey = keyof typeof scores;
    const stateKeys: StateKey[] = Object.keys(scores) as StateKey[];
    const bestState = stateKeys.reduce((a, b) => (scores[a] > scores[b] ? a : b));
    return bestState;
  }

  private calculateFocusScore(metrics: CognitiveMetrics): number {
    return (
      (metrics.typingSpeed > 40 ? 0.3 : 0) +
      (metrics.typingRhythm < 100 ? 0.25 : 0) +
      (metrics.focusStability > 0.8 ? 0.25 : 0) +
      (metrics.taskSwitching < 3 ? 0.2 : 0)
    )
  }

  private calculateFatigueScore(metrics: CognitiveMetrics): number {
    return (
      (metrics.typingSpeed < 20 ? 0.3 : 0) +
      (metrics.typingRhythm > 200 ? 0.25 : 0) +
      (metrics.mouseVelocity < 0.1 ? 0.25 : 0) +
      (metrics.scrollPattern > 0.1 ? 0.2 : 0)
    )
  }

  private calculateDistractionScore(metrics: CognitiveMetrics): number {
    return (
      (metrics.taskSwitching > 5 ? 0.4 : 0) +
      (metrics.focusStability < 0.5 ? 0.3 : 0) +
      (metrics.scrollPattern > 0.2 ? 0.3 : 0)
    )
  }

  private calculateReceptiveScore(metrics: CognitiveMetrics): number {
    return (
      (metrics.typingSpeed > 20 && metrics.typingSpeed < 60 ? 0.3 : 0) +
      (metrics.mouseVelocity > 0.1 && metrics.mouseVelocity < 0.5 ? 0.3 : 0) +
      (metrics.focusStability > 0.6 ? 0.2 : 0) +
      (metrics.taskSwitching < 4 ? 0.2 : 0)
    )
  }

  private calculateConfidence(metrics: CognitiveMetrics, interactionCount: number): number {
    const dataQuality = Math.min(interactionCount / 50, 1) // More interactions = higher confidence
    const metricConsistency = this.calculateMetricConsistency(metrics)

    return dataQuality * 0.6 + metricConsistency * 0.4
  }

  private calculateMetricConsistency(metrics: CognitiveMetrics): number {
    // Simple consistency check - in a real implementation, this would be more sophisticated
    const normalizedMetrics = [
      Math.min(metrics.typingSpeed / 100, 1),
      Math.min(metrics.mouseVelocity, 1),
      metrics.focusStability,
      Math.max(0, 1 - metrics.taskSwitching / 10),
    ]

    const mean = normalizedMetrics.reduce((a, b) => a + b, 0) / normalizedMetrics.length
    const variance = normalizedMetrics.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / normalizedMetrics.length

    return Math.max(0, 1 - Math.sqrt(variance))
  }
}
