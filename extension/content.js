class SynapseContentScript {
  constructor() {
    this.isActive = false
    this.settings = {}
    this.chrome = window.chrome

    // Enhanced activity tracking
    this.activityData = {
      mouseMovements: 0,
      keystrokes: 0,
      scrollEvents: 0,
      clickEvents: 0,
      timeOnPage: 0,
      readingTime: 0,
      typingSpeed: 0,
      scrollSpeed: 0,
      focusTime: 0,
      distractionCount: 0,
      pageInteractions: 0,
    }

    // Advanced metrics
    this.typingMetrics = {
      keyTimes: [],
      currentWPM: 0,
      averageWPM: 0,
      burstCount: 0,
      accuracy: 100,
      corrections: 0,
    }

    this.scrollMetrics = {
      scrollTimes: [],
      scrollPositions: [],
      currentSpeed: 0,
      averageSpeed: 0,
      direction: 0,
      totalDistance: 0,
    }

    this.focusMetrics = {
      focusStartTime: Date.now(),
      lastActivityTime: Date.now(),
      tabSwitchCount: 0,
      idleTime: 0,
      deepFocusTime: 0,
      distractionEvents: [],
    }

    this.readingMetrics = {
      wordsRead: 0,
      readingSpeed: 0,
      comprehensionScore: 0,
      timeSpentReading: 0,
      scrollBehavior: "normal",
    }

    this.startTime = Date.now()
    this.keywords = new Set()
    this.conceptFrequency = new Map()
    this.currentTheme = "auto"

    // UI elements
    this.activityIndicator = null
    this.typingIndicator = null
    this.scrollIndicator = null
    this.alertOverlay = null
    this.readingProgress = null
    this.conceptTooltip = null

    // Performance optimization
    this.throttledEvents = new Map()
    this.debounceTimers = new Map()

    this.initialize()
  }

  async initialize() {
    try {
      const response = await this.sendMessage({ action: "getSettings" })
      if (response && response.success) {
        this.settings = response.data
        this.isActive = this.settings.adaptationEnabled
        this.currentTheme = this.settings.theme || "auto"
      }

      if (this.isActive) {
        this.setupEventListeners()
        this.startActivityTracking()
        this.extractKeywords()
        this.applyTheme()
        this.createUIElements()
        this.startAdvancedTracking()
        this.initializeReadingProgress()
      }
    } catch (error) {
      console.error("Synapse initialization error:", error)
    }
  }

  setupEventListeners() {
    // Enhanced mouse movement tracking with velocity and patterns
    let lastMouseTime = Date.now()
    let lastMousePos = { x: 0, y: 0 }
    const mouseVelocities = []

    document.addEventListener(
      "mousemove",
      this.throttle((e) => {
        const now = Date.now()
        const timeDiff = now - lastMouseTime
        const distance = Math.sqrt(Math.pow(e.clientX - lastMousePos.x, 2) + Math.pow(e.clientY - lastMousePos.y, 2))

        this.activityData.mouseMovements++
        this.updateLastActivity()

        if (timeDiff > 0) {
          const velocity = distance / timeDiff
          mouseVelocities.push(velocity)
          if (mouseVelocities.length > 10) mouseVelocities.shift()

          this.processMouseVelocity(velocity, mouseVelocities)
        }

        lastMouseTime = now
        lastMousePos = { x: e.clientX, y: e.clientY }
      }, 50),
    )

    // Advanced keyboard tracking with typing patterns
    document.addEventListener("keydown", (e) => {
      this.activityData.keystrokes++
      this.updateLastActivity()
      this.processKeystroke(e)
    })

    // Backspace tracking for accuracy
    document.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" || e.key === "Delete") {
        this.typingMetrics.corrections++
      }
    })

    // Advanced scroll tracking with reading behavior analysis
    let lastScrollTime = Date.now()
    let lastScrollPos = window.pageYOffset
    const scrollPauses = []

    document.addEventListener(
      "scroll",
      this.throttle(() => {
        const now = Date.now()
        const currentPos = window.pageYOffset
        const timeDiff = now - lastScrollTime
        const distance = Math.abs(currentPos - lastScrollPos)

        this.activityData.scrollEvents++
        this.updateLastActivity()

        if (timeDiff > 0) {
          const speed = distance / timeDiff
          const direction = currentPos > lastScrollPos ? 1 : -1

          // Detect reading pauses
          if (speed < 0.1 && timeDiff > 2000) {
            scrollPauses.push({ time: now, position: currentPos })
          }

          this.processScrollMetrics(speed, direction, currentPos, scrollPauses)
        }

        this.updateReadingProgress()
        lastScrollTime = now
        lastScrollPos = currentPos
      }, 100),
    )

    // Enhanced click tracking with interaction analysis
    document.addEventListener("click", (e) => {
      this.activityData.clickEvents++
      this.activityData.pageInteractions++
      this.updateLastActivity()
      this.processClick(e)
    })

    // Text selection tracking for comprehension analysis
    document.addEventListener("selectionchange", () => {
      const selection = window.getSelection()
      if (selection.toString().length > 10) {
        this.processTextSelection(selection.toString())
      }
    })

    // Copy/paste tracking
    document.addEventListener("copy", (e) => {
      const copiedText = e.clipboardData?.getData("text") || ""
      if (copiedText.length > 5) {
        this.processCopyEvent(copiedText)
      }
    })

    // Focus and blur tracking with detailed analysis
    window.addEventListener("focus", () => {
      this.focusMetrics.focusStartTime = Date.now()
      this.updateFocusIndicator()
    })

    window.addEventListener("blur", () => {
      this.focusMetrics.tabSwitchCount++
      this.focusMetrics.distractionEvents.push({
        type: "tab_switch",
        timestamp: Date.now(),
      })
      this.checkProductivityAlert()
    })

    // Visibility change tracking
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.focusMetrics.tabSwitchCount++
        this.focusMetrics.distractionEvents.push({
          type: "visibility_change",
          timestamp: Date.now(),
        })
        this.checkProductivityAlert()
      } else {
        this.focusMetrics.focusStartTime = Date.now()
      }
    })

    // Page unload tracking
    window.addEventListener("beforeunload", () => {
      this.sendActivityData(true) // Force send on page unload
    })

    // Listen for settings changes
    if (this.chrome && this.chrome.runtime) {
      this.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "settingsUpdated") {
          this.settings = request.settings
          this.applyTheme()
          this.updateUIElements()
        } else if (request.action === "startFocusMode") {
          this.enableFocusMode(request.duration)
        } else if (request.action === "endFocusMode") {
          this.disableFocusMode()
        }
      })
    }
  }

  startAdvancedTracking() {
    // Real-time metrics calculation
    setInterval(() => {
      this.calculateTypingSpeed()
      this.calculateScrollSpeed()
      this.calculateReadingMetrics()
      this.updateActivityIndicator()
      this.updateTypingIndicator()
      this.updateScrollIndicator()
    }, 1000)

    // Productivity monitoring
    setInterval(() => {
      this.checkProductivityStatus()
      this.analyzeReadingBehavior()
    }, 30000)

    // Focus session tracking
    setInterval(() => {
      this.updateFocusMetrics()
    }, 5000)

    // Keyword extraction refresh
    setInterval(() => {
      this.extractKeywords()
    }, 60000)
  }

  processKeystroke(event) {
    const now = Date.now()

    if (this.isTypingKey(event.key)) {
      this.typingMetrics.keyTimes.push(now)

      // Keep only last 100 keystrokes for analysis
      if (this.typingMetrics.keyTimes.length > 100) {
        this.typingMetrics.keyTimes.shift()
      }

      // Calculate typing accuracy
      this.calculateTypingAccuracy()
      this.showTypingIndicator()
    }
  }

  calculateTypingSpeed() {
    const keyTimes = this.typingMetrics.keyTimes
    if (keyTimes.length < 10) return

    const now = Date.now()
    const recentKeys = keyTimes.filter((time) => now - time < 60000) // Last minute

    if (recentKeys.length > 0) {
      const timeSpan = (now - recentKeys[0]) / 1000 / 60 // minutes
      const wordsTyped = recentKeys.length / 5 // Average 5 characters per word
      this.typingMetrics.currentWPM = Math.round(wordsTyped / timeSpan)
      this.activityData.typingSpeed = this.typingMetrics.currentWPM

      // Update average WPM
      if (this.typingMetrics.averageWPM === 0) {
        this.typingMetrics.averageWPM = this.typingMetrics.currentWPM
      } else {
        this.typingMetrics.averageWPM = Math.round(
          this.typingMetrics.averageWPM * 0.9 + this.typingMetrics.currentWPM * 0.1,
        )
      }
    }
  }

  calculateTypingAccuracy() {
    const totalKeystrokes = this.typingMetrics.keyTimes.length
    const corrections = this.typingMetrics.corrections

    if (totalKeystrokes > 0) {
      this.typingMetrics.accuracy = Math.max(0, Math.round(((totalKeystrokes - corrections) / totalKeystrokes) * 100))
    }
  }

  processScrollMetrics(speed, direction, position, scrollPauses) {
    const now = Date.now()

    this.scrollMetrics.scrollTimes.push(now)
    this.scrollMetrics.scrollPositions.push({
      time: now,
      position,
      speed,
      direction,
    })

    // Keep only last 50 scroll events
    if (this.scrollMetrics.scrollTimes.length > 50) {
      this.scrollMetrics.scrollTimes.shift()
      this.scrollMetrics.scrollPositions.shift()
    }

    this.scrollMetrics.currentSpeed = speed
    this.scrollMetrics.direction = direction
    this.scrollMetrics.totalDistance += Math.abs(position - (this.scrollMetrics.lastPosition || 0))
    this.scrollMetrics.lastPosition = position

    // Analyze reading behavior from scroll patterns
    this.analyzeScrollBehavior(scrollPauses)
    this.showScrollIndicator()
  }

  analyzeScrollBehavior(scrollPauses) {
    if (scrollPauses.length > 3) {
      const avgPauseTime =
        scrollPauses.reduce((sum, pause, i) => {
          if (i === 0) return 0
          return sum + (pause.time - scrollPauses[i - 1].time)
        }, 0) /
        (scrollPauses.length - 1)

      if (avgPauseTime > 5000) {
        // 5+ seconds between pauses
        this.readingMetrics.scrollBehavior = "careful"
      } else if (avgPauseTime < 2000) {
        // Less than 2 seconds
        this.readingMetrics.scrollBehavior = "scanning"
      } else {
        this.readingMetrics.scrollBehavior = "normal"
      }
    }
  }

  calculateScrollSpeed() {
    const positions = this.scrollMetrics.scrollPositions
    if (positions.length < 3) return

    const now = Date.now()
    const recentScrolls = positions.filter((pos) => now - pos.time < 10000) // Last 10 seconds

    if (recentScrolls.length > 0) {
      const avgSpeed = recentScrolls.reduce((sum, pos) => sum + pos.speed, 0) / recentScrolls.length
      this.scrollMetrics.averageSpeed = avgSpeed
      this.activityData.scrollSpeed = Math.round(avgSpeed * 1000) // pixels per second
    }
  }

  calculateReadingMetrics() {
    const textContent = document.body.innerText || ""
    const words = textContent.split(/\s+/).length

    // Estimate words read based on scroll position
    const scrollPercent = window.pageYOffset / (document.body.scrollHeight - window.innerHeight)
    this.readingMetrics.wordsRead = Math.round(words * scrollPercent)

    // Calculate reading speed (words per minute)
    const timeSpent = (Date.now() - this.startTime) / 60000 // minutes
    if (timeSpent > 0) {
      this.readingMetrics.readingSpeed = Math.round(this.readingMetrics.wordsRead / timeSpent)
    }

    // Update reading time
    const timeSinceLastActivity = Date.now() - this.focusMetrics.lastActivityTime
    if (timeSinceLastActivity < 5000) {
      // Active in last 5 seconds
      this.activityData.readingTime += 1000
      this.readingMetrics.timeSpentReading += 1000
    }
  }

  processTextSelection(selectedText) {
    // Analyze selected text for comprehension indicators
    const words = selectedText.split(/\s+/)
    if (words.length > 3) {
      // Extract potential key concepts from selection
      words.forEach((word) => {
        const cleanWord = word.toLowerCase().replace(/[^\w]/g, "")
        if (cleanWord.length > 4 && !this.isStopWord(cleanWord)) {
          this.keywords.add(cleanWord)
          this.conceptFrequency.set(cleanWord, (this.conceptFrequency.get(cleanWord) || 0) + 1)
        }
      })
    }
  }

  processCopyEvent(copiedText) {
    // Track copy events as engagement indicators
    this.activityData.pageInteractions++

    // Extract concepts from copied text
    const words = copiedText.split(/\s+/)
    words.forEach((word) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "")
      if (cleanWord.length > 4 && !this.isStopWord(cleanWord)) {
        this.conceptFrequency.set(cleanWord, (this.conceptFrequency.get(cleanWord) || 0) + 2) // Higher weight for copied text
      }
    })
  }

  processClick(event) {
    const target = event.target

    // Analyze click targets for engagement patterns
    if (target.tagName === "A") {
      this.focusMetrics.distractionEvents.push({
        type: "link_click",
        timestamp: Date.now(),
        href: target.href,
      })
    } else if (target.closest("button, input, select, textarea")) {
      this.activityData.pageInteractions++
    }
  }

  checkProductivityAlert() {
    if (!this.settings.productivityAlerts) return

    const now = Date.now()
    const timeSinceLastActivity = now - this.focusMetrics.lastActivityTime
    const currentDomain = window.location.hostname

    // Check if on unproductive site
    if (this.isUnproductiveDomain(currentDomain)) {
      const timeOnUnproductiveSite = now - this.focusMetrics.focusStartTime

      if (timeOnUnproductiveSite > 5 * 60 * 1000) {
        // 5 minutes
        this.showProductivityAlert({
          type: "unproductive",
          domain: currentDomain,
          timeSpent: Math.round(timeOnUnproductiveSite / 60000),
        })
      }
    }

    // Check for excessive tab switching
    if (this.focusMetrics.tabSwitchCount > 10) {
      this.showProductivityAlert({
        type: "distraction",
        switchCount: this.focusMetrics.tabSwitchCount,
      })
      this.focusMetrics.tabSwitchCount = 0 // Reset counter
    }

    // Check for rapid scrolling (possible distraction)
    if (this.scrollMetrics.currentSpeed > 5 && this.readingMetrics.scrollBehavior === "scanning") {
      this.showProductivityAlert({
        type: "rapid_scrolling",
        speed: this.scrollMetrics.currentSpeed,
      })
    }
  }

  isUnproductiveDomain(domain) {
    const unproductiveDomains = [
      "facebook.com",
      "twitter.com",
      "instagram.com",
      "tiktok.com",
      "youtube.com",
      "netflix.com",
      "reddit.com",
      "pinterest.com",
      "snapchat.com",
      "twitch.tv",
      "discord.com",
      "9gag.com",
      "buzzfeed.com",
      "dailymail.co.uk",
    ]

    const userUnproductive = this.settings.unproductiveDomains || []
    const allUnproductive = [...unproductiveDomains, ...userUnproductive]

    return allUnproductive.some((unproductiveDomain) => domain.includes(unproductiveDomain))
  }

  createUIElements() {
    this.createActivityIndicator()
    this.createTypingIndicator()
    this.createScrollIndicator()
    this.createAlertOverlay()
    this.createConceptTooltip()
    this.createReadingProgress()
  }

  createActivityIndicator() {
    if (this.activityIndicator) return

    this.activityIndicator = document.createElement("div")
    this.activityIndicator.className = "synapse-activity-indicator"
    this.activityIndicator.innerHTML = "<span>Detecting...</span>"
    document.body.appendChild(this.activityIndicator)
  }

  createTypingIndicator() {
    if (this.typingIndicator) return

    this.typingIndicator = document.createElement("div")
    this.typingIndicator.className = "synapse-typing-indicator"
    document.body.appendChild(this.typingIndicator)
  }

  createScrollIndicator() {
    if (this.scrollIndicator) return

    this.scrollIndicator = document.createElement("div")
    this.scrollIndicator.className = "synapse-scroll-indicator"
    this.scrollIndicator.innerHTML = '<div class="synapse-scroll-progress"></div>'
    document.body.appendChild(this.scrollIndicator)
  }

  createAlertOverlay() {
    if (this.alertOverlay) return

    this.alertOverlay = document.createElement("div")
    this.alertOverlay.className = "synapse-alert-overlay"
    this.alertOverlay.innerHTML = `
      <div class="synapse-alert-content">
        <div class="synapse-alert-icon"></div>
        <div class="synapse-alert-title"></div>
        <div class="synapse-alert-message"></div>
        <div class="synapse-alert-buttons">
          <button class="synapse-alert-btn primary">Focus Now</button>
          <button class="synapse-alert-btn secondary">Remind Later</button>
        </div>
      </div>
    `
    document.body.appendChild(this.alertOverlay)

    // Add event listeners
    const buttons = this.alertOverlay.querySelectorAll(".synapse-alert-btn")
    buttons[0].addEventListener("click", () => this.hideProductivityAlert(true))
    buttons[1].addEventListener("click", () => this.hideProductivityAlert(false))
  }

  createConceptTooltip() {
    if (this.conceptTooltip) return

    this.conceptTooltip = document.createElement("div")
    this.conceptTooltip.className = "synapse-concept-tooltip"
    document.body.appendChild(this.conceptTooltip)
  }

  createReadingProgress() {
    if (this.readingProgress) return

    this.readingProgress = document.createElement("div")
    this.readingProgress.className = "synapse-reading-progress"
    document.body.appendChild(this.readingProgress)
  }

  initializeReadingProgress() {
    this.updateReadingProgress()
  }

  updateReadingProgress() {
    if (!this.readingProgress) return

    const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100
    this.readingProgress.style.width = `${Math.min(Math.max(scrollPercent, 0), 100)}%`
  }

  updateActivityIndicator() {
    if (!this.activityIndicator) return

    const activityLevel = this.calculateActivityLevel()
    const typingSpeed = this.typingMetrics.currentWPM || 0
    const focusScore = this.calculateFocusScore()

    this.activityIndicator.className = `synapse-activity-indicator ${activityLevel}-activity`
    this.activityIndicator.innerHTML = `
      <span>${this.getActivityText(activityLevel)}</span>
    `
  }

  showTypingIndicator() {
    if (!this.typingIndicator || this.typingMetrics.currentWPM === 0) return

    this.typingIndicator.textContent = `${this.typingMetrics.currentWPM}`
    this.typingIndicator.classList.add("show")

    // Hide after 3 seconds of no typing
    clearTimeout(this.typingTimeout)
    this.typingTimeout = setTimeout(() => {
      this.typingIndicator.classList.remove("show")
    }, 3000)
  }

  showScrollIndicator() {
    if (!this.scrollIndicator) return

    const scrollPercent = (window.pageYOffset / (document.body.scrollHeight - window.innerHeight)) * 100
    const progressBar = this.scrollIndicator.querySelector(".synapse-scroll-progress")

    progressBar.style.height = `${Math.min(Math.max(scrollPercent, 0), 100)}%`
    this.scrollIndicator.classList.add("show")

    // Hide after 2 seconds of no scrolling
    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(() => {
      this.scrollIndicator.classList.remove("show")
    }, 2000)
  }

  showProductivityAlert(alertData) {
    if (!this.alertOverlay) return

    const icon = this.alertOverlay.querySelector(".synapse-alert-icon")
    const title = this.alertOverlay.querySelector(".synapse-alert-title")
    const message = this.alertOverlay.querySelector(".synapse-alert-message")

    if (alertData.type === "unproductive") {
      icon.textContent = "⚠️"
      title.textContent = "Productivity Alert"
      message.textContent = `You've been on ${alertData.domain} for ${alertData.timeSpent} minutes. Time to refocus?`
    } else if (alertData.type === "distraction") {
      icon.textContent = "🎯"
      title.textContent = "Focus Alert"
      message.textContent = `You've switched tabs ${alertData.switchCount} times recently. Consider taking a break or focusing on one task.`
    } else if (alertData.type === "rapid_scrolling") {
      icon.textContent = "📖"
      title.textContent = "Reading Alert"
      message.textContent = "You seem to be scrolling quickly. Take time to absorb the content for better learning."
    }

    this.alertOverlay.classList.add("show")

    // Auto-hide after 10 seconds
    setTimeout(() => {
      this.hideProductivityAlert(false)
    }, 10000)
  }

  hideProductivityAlert(focusMode = false) {
    if (!this.alertOverlay) return

    this.alertOverlay.classList.remove("show")

    if (focusMode) {
      this.enableFocusMode(25 * 60 * 1000) // 25 minutes
    }
  }

  enableFocusMode(duration = 25 * 60 * 1000) {
    // Create focus mode indicator
    const focusBar = document.createElement("div")
    focusBar.className = "synapse-focus-mode active"
    document.body.appendChild(focusBar)

    // Create focus overlay for distracting elements
    const focusOverlay = document.createElement("div")
    focusOverlay.className = "synapse-focus-overlay active"
    document.body.appendChild(focusOverlay)

    // Apply focus mode styles
    document.body.classList.add("synapse-focus-active")

    // Remove focus mode after duration
    setTimeout(() => {
      focusBar.remove()
      focusOverlay.remove()
      document.body.classList.remove("synapse-focus-active")

      // Show completion notification
      this.showFocusCompletionNotification()
    }, duration)

    // Send focus session start to background
    this.sendMessage({
      action: "startFocusSession",
      duration: duration,
    })
  }

  disableFocusMode() {
    const focusElements = document.querySelectorAll(".synapse-focus-mode, .synapse-focus-overlay")
    focusElements.forEach((el) => el.remove())
    document.body.classList.remove("synapse-focus-active")
  }

  showFocusCompletionNotification() {
    // Create temporary notification
    const notification = document.createElement("div")
    notification.className = "synapse-focus-completion"
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #10b981, #059669);
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 100002;
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        animation: slideIn 0.3s ease;
      ">
        🎉 Focus session completed! Great work!
      </div>
    `
    document.body.appendChild(notification)

    setTimeout(() => {
      notification.remove()
    }, 5000)
  }

  applyTheme() {
    const body = document.body

    // Remove existing theme classes
    body.classList.remove("synapse-light-mode", "synapse-dark-mode")

    if (this.currentTheme === "light") {
      body.classList.add("synapse-light-mode")
    } else if (this.currentTheme === "dark") {
      body.classList.add("synapse-dark-mode")
    }
    // 'auto' uses CSS media queries
  }

  updateUIElements() {
    this.updateActivityIndicator()
    this.applyAdaptations()
  }

  calculateActivityLevel() {
    const now = Date.now()
    const timeSinceLastActivity = now - this.focusMetrics.lastActivityTime

    // If idle for more than 30 seconds
    if (timeSinceLastActivity > 30000) return "idle"

    const total =
      this.activityData.mouseMovements +
      this.activityData.keystrokes +
      this.activityData.scrollEvents +
      this.activityData.clickEvents

    const typingBonus = this.typingMetrics.currentWPM > 30 ? 50 : 0
    const scrollBonus = this.scrollMetrics.currentSpeed > 0.5 ? 25 : 0
    const interactionBonus = this.activityData.pageInteractions * 10

    const adjustedTotal = total + typingBonus + scrollBonus + interactionBonus

    if (adjustedTotal > 200) return "high"
    if (adjustedTotal > 100) return "medium"
    if (adjustedTotal > 30) return "low"
    return "idle"
  }

  calculateFocusScore() {
    const now = Date.now()
    const sessionTime = now - this.focusMetrics.focusStartTime

    if (sessionTime < 60000) return 0 // Need at least 1 minute

    let score = 50 // Base score

    // Activity level bonus
    const activityLevel = this.calculateActivityLevel()
    const activityBonus = {
      high: 25,
      medium: 15,
      low: 5,
      idle: -20,
    }
    score += activityBonus[activityLevel] || 0

    // Typing performance bonus
    if (this.typingMetrics.currentWPM > 40) score += 15
    if (this.typingMetrics.accuracy > 95) score += 10

    // Tab switching penalty
    const switchRate = this.focusMetrics.tabSwitchCount / (sessionTime / 60000) // switches per minute
    if (switchRate > 2) score -= 20
    else if (switchRate > 1) score -= 10

    // Reading behavior bonus
    if (this.readingMetrics.scrollBehavior === "careful") score += 15
    else if (this.readingMetrics.scrollBehavior === "scanning") score -= 10

    // Consistency bonus (less variation in activity)
    const activityVariation = this.calculateActivityVariation()
    if (activityVariation < 0.3) score += 10

    return Math.max(0, Math.min(100, Math.round(score)))
  }

  calculateActivityVariation() {
    // Calculate coefficient of variation for activity levels
    const recentActivities = []
    const now = Date.now()

    // Sample activity levels over the last 10 minutes
    for (let i = 0; i < 10; i++) {
      const timePoint = now - i * 60000 // Every minute
      const activity = this.getActivityAtTime(timePoint)
      recentActivities.push(activity)
    }

    if (recentActivities.length < 3) return 1

    const mean = recentActivities.reduce((sum, val) => sum + val, 0) / recentActivities.length
    const variance = recentActivities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentActivities.length
    const stdDev = Math.sqrt(variance)

    return mean > 0 ? stdDev / mean : 1
  }

  getActivityAtTime(timestamp) {
    // Simplified activity level calculation for a specific time
    // In a real implementation, this would look at historical data
    const levelMap = { idle: 0, low: 1, medium: 2, high: 3 }
    return levelMap[this.calculateActivityLevel()] || 0
  }

  getActivityText(level) {
    const texts = {
      high: "🔥 Highly Active",
      medium: "⚡ Active",
      low: "📖 Reading",
      idle: "😴 Idle",
    }
    return texts[level] || "Unknown"
  }

  extractKeywords() {
    if (!this.settings.keywordHighlighting) return

    try {
      const textContent = document.body.innerText.toLowerCase()
      const sentences = textContent.split(/[.!?]+/)
      const words = textContent.match(/\b\w{4,}\b/g) || []
      const wordCount = {}

      words.forEach((word) => {
        if (!this.isStopWord(word) && !this.isCommonWord(word)) {
          wordCount[word] = (wordCount[word] || 0) + 1
        }
      })

      // Prioritize words that appear in multiple sentences
      const sentenceWords = sentences.map((sentence) => sentence.match(/\b\w{4,}\b/g) || [])

      Object.keys(wordCount).forEach((word) => {
        const sentenceCount = sentenceWords.filter((words) => words.includes(word)).length

        if (sentenceCount > 1) {
          wordCount[word] *= 2 // Boost score for cross-sentence words
        }

        // Boost score for words in headings
        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")
        headings.forEach((heading) => {
          if (heading.textContent.toLowerCase().includes(word)) {
            wordCount[word] *= 1.5
          }
        })
      })

      const sortedWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 30)
        .map((entry) => ({ word: entry[0], frequency: entry[1] }))

      sortedWords.forEach(({ word, frequency }) => {
        this.keywords.add(word)
        this.conceptFrequency.set(word, frequency)
      })

      if (this.settings.keywordHighlighting) {
        this.highlightKeywords(sortedWords.slice(0, 15))
      }
    } catch (error) {
      console.error("Error extracting keywords:", error)
    }
  }

  highlightKeywords(keywords) {
    if (keywords.length === 0) return

    try {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentElement
            if (!parent) return NodeFilter.FILTER_REJECT

            const tagName = parent.tagName.toLowerCase()
            const excludedTags = ["script", "style", "noscript", "textarea", "input", "code", "pre"]

            // Don't highlight if already highlighted
            if (parent.classList.contains("synapse-highlight")) {
              return NodeFilter.FILTER_REJECT
            }

            return excludedTags.includes(tagName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT
          },
        },
        false,
      )

      const textNodes = []
      let node

      while ((node = walker.nextNode())) {
        if (node.textContent.trim().length > 0) {
          textNodes.push(node)
        }
      }

      textNodes.forEach((textNode) => {
        let text = textNode.textContent
        let modified = false

        keywords.forEach(({ word, frequency }) => {
          const regex = new RegExp(`\\b${this.escapeRegex(word)}\\b`, "gi")
          if (regex.test(text)) {
            text = text.replace(
              regex,
              `<mark class="synapse-highlight" data-frequency="${frequency}" data-concept="${word}">${word}</mark>`,
            )
            modified = true
          }
        })

        if (modified) {
          const wrapper = document.createElement("span")
          wrapper.innerHTML = text

          // Add hover events to highlighted concepts
          wrapper.querySelectorAll(".synapse-highlight").forEach((highlight) => {
            highlight.addEventListener("mouseenter", (e) => {
              this.showConceptTooltip(e, highlight.dataset.concept, highlight.dataset.frequency)
            })

            highlight.addEventListener("mouseleave", () => {
              this.hideConceptTooltip()
            })
          })

          textNode.parentNode.replaceChild(wrapper, textNode)
        }
      })
    } catch (error) {
      console.error("Error highlighting keywords:", error)
    }
  }

  showConceptTooltip(event, concept, frequency) {
    if (!this.conceptTooltip) return

    const domains = this.getConceptDomains(concept)
    const relatedConcepts = this.getRelatedConcepts(concept)

    this.conceptTooltip.innerHTML = `
      <div><strong>${concept}</strong></div>
      <div>Frequency: ${frequency}</div>
      ${domains.length > 0 ? `<div>Also seen on: ${domains.slice(0, 2).join(", ")}</div>` : ""}
      ${relatedConcepts.length > 0 ? `<div>Related: ${relatedConcepts.slice(0, 3).join(", ")}</div>` : ""}
    `

    const rect = event.target.getBoundingClientRect()
    this.conceptTooltip.style.left = `${rect.left + window.scrollX}px`
    this.conceptTooltip.style.top = `${rect.bottom + window.scrollY + 5}px`
    this.conceptTooltip.classList.add("show")
  }

  hideConceptTooltip() {
    if (this.conceptTooltip) {
      this.conceptTooltip.classList.remove("show")
    }
  }

  getConceptDomains(concept) {
    // In a real implementation, this would query stored data
    return ["example.com", "wikipedia.org"]
  }

  getRelatedConcepts(concept) {
    // Simple related concept detection based on co-occurrence
    const related = []
    const conceptWords = Array.from(this.keywords)

    conceptWords.forEach((word) => {
      if (word !== concept && word.length > 3) {
        // Simple similarity check (could be enhanced with NLP)
        if (this.calculateWordSimilarity(concept, word) > 0.3) {
          related.push(word)
        }
      }
    })

    return related.slice(0, 3)
  }

  calculateWordSimilarity(word1, word2) {
    // Simple Jaccard similarity based on character n-grams
    const getNGrams = (str, n = 2) => {
      const grams = []
      for (let i = 0; i <= str.length - n; i++) {
        grams.push(str.substr(i, n))
      }
      return new Set(grams)
    }

    const grams1 = getNGrams(word1)
    const grams2 = getNGrams(word2)

    const intersection = new Set([...grams1].filter((x) => grams2.has(x)))
    const union = new Set([...grams1, ...grams2])

    return intersection.size / union.size
  }

  applyAdaptations() {
    if (!this.settings.adaptationEnabled) return

    try {
      const activityLevel = this.calculateActivityLevel()

      if (this.settings.readingModeEnabled) {
        this.applyReadingMode(activityLevel)
      }

      this.applyActivityAdaptations(activityLevel)
    } catch (error) {
      console.error("Error applying adaptations:", error)
    }
  }

  applyReadingMode(activityLevel) {
    try {
      // Remove existing reading mode
      document.querySelectorAll(".synapse-reading-mode").forEach((el) => {
        el.classList.remove("synapse-reading-mode")
      })

      const contentSelectors = [
        "article",
        "main",
        ".content",
        ".post",
        ".entry",
        ".article-content",
        ".post-content",
        ".entry-content",
        '[role="main"]',
        ".main-content",
      ]

      contentSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (this.isMainContent(el)) {
            el.classList.add("synapse-reading-mode")

            if (activityLevel === "low" || activityLevel === "idle") {
              el.classList.add("synapse-low-activity")
            } else {
              el.classList.remove("synapse-low-activity")
            }
          }
        })
      })

      // Apply to paragraphs if no main content containers found
      if (!document.querySelector(".synapse-reading-mode")) {
        const paragraphs = document.querySelectorAll("p")
        if (paragraphs.length > 3) {
          paragraphs.forEach((p) => {
            if (this.isMainContent(p)) {
              p.classList.add("synapse-reading-mode")
            }
          })
        }
      }
    } catch (error) {
      console.error("Error applying reading mode:", error)
    }
  }

  applyActivityAdaptations(activityLevel) {
    try {
      const body = document.body

      body.classList.remove("synapse-high-activity", "synapse-medium-activity", "synapse-low-activity", "synapse-idle")
      body.classList.add(`synapse-${activityLevel}-activity`)
    } catch (error) {
      console.error("Error applying activity adaptations:", error)
    }
  }

  isMainContent(element) {
    const text = element.innerText || ""
    const minLength = 100

    if (text.length < minLength) return false
    if (this.isNavigationElement(element)) return false

    // Check if element contains mostly text (not just links/buttons)
    const textRatio = text.length / (element.innerHTML.length || 1)
    if (textRatio < 0.3) return false

    // Check for content indicators
    const contentIndicators = ["article", "main", "content", "post", "entry", "text", "body"]

    const className = element.className.toLowerCase()
    const hasContentIndicator = contentIndicators.some((indicator) => className.includes(indicator))

    return hasContentIndicator || textRatio > 0.6
  }

  isNavigationElement(element) {
    const navTags = ["nav", "header", "footer", "aside", "menu"]
    const navClasses = ["nav", "menu", "sidebar", "header", "footer", "toolbar", "breadcrumb"]

    if (navTags.includes(element.tagName.toLowerCase())) return true

    const className = element.className.toLowerCase()
    return navClasses.some((navClass) => className.includes(navClass))
  }

  analyzeReadingBehavior() {
    const now = Date.now()
    const sessionTime = now - this.startTime

    if (sessionTime < 60000) return // Need at least 1 minute of data

    // Analyze scroll patterns for reading comprehension
    const scrollEvents = this.scrollMetrics.scrollPositions.length
    const avgScrollSpeed = this.scrollMetrics.averageSpeed

    let comprehensionScore = 50 // Base score

    // Slower, more deliberate scrolling indicates better comprehension
    if (avgScrollSpeed < 1) comprehensionScore += 20
    else if (avgScrollSpeed > 5) comprehensionScore -= 15

    // More scroll pauses indicate careful reading
    if (this.readingMetrics.scrollBehavior === "careful") comprehensionScore += 15
    else if (this.readingMetrics.scrollBehavior === "scanning") comprehensionScore -= 10

    // Text selection and copying indicates engagement
    if (this.activityData.pageInteractions > 0) comprehensionScore += 10

    // Consistent activity indicates focus
    const activityVariation = this.calculateActivityVariation()
    if (activityVariation < 0.4) comprehensionScore += 10

    this.readingMetrics.comprehensionScore = Math.max(0, Math.min(100, comprehensionScore))
  }

  sendActivityData(forceSync = false) {
    const activityLevel = this.calculateActivityLevel()
    const focusScore = this.calculateFocusScore()

    const data = {
      ...this.activityData,
      activityLevel: activityLevel,
      focusScore: focusScore,
      keywords: Array.from(this.keywords),
      conceptFrequency: Object.fromEntries(this.conceptFrequency),
      typingMetrics: {
        currentWPM: this.typingMetrics.currentWPM,
        averageWPM: this.typingMetrics.averageWPM,
        accuracy: this.typingMetrics.accuracy,
      },
      scrollMetrics: {
        averageSpeed: this.scrollMetrics.averageSpeed,
        totalDistance: this.scrollMetrics.totalDistance,
        behavior: this.readingMetrics.scrollBehavior,
      },
      readingMetrics: {
        wordsRead: this.readingMetrics.wordsRead,
        readingSpeed: this.readingMetrics.readingSpeed,
        comprehensionScore: this.readingMetrics.comprehensionScore,
        timeSpentReading: this.readingMetrics.timeSpentReading,
      },
      focusMetrics: {
        tabSwitches: this.focusMetrics.tabSwitchCount,
        distractionEvents: this.focusMetrics.distractionEvents.length,
        sessionTime: Date.now() - this.focusMetrics.focusStartTime,
      },
      domain: window.location.hostname,
      url: window.location.href,
      title: document.title,
      timestamp: Date.now(),
      forceSync: forceSync,
    }

    this.sendMessage({ action: "trackActivity", data: data })
      .then(() => {
        // Reset counters
        this.activityData.mouseMovements = 0
        this.activityData.keystrokes = 0
        this.activityData.scrollEvents = 0
        this.activityData.clickEvents = 0
        this.activityData.pageInteractions = 0
        this.focusMetrics.distractionEvents = []
      })
      .catch((error) => {
        console.error("Error sending activity data:", error)
      })
  }

  startActivityTracking() {
    // Send activity data every 30 seconds
    setInterval(() => {
      this.sendActivityData()
    }, 30000)

    // Track time on page
    setInterval(() => {
      this.activityData.timeOnPage = Date.now() - this.startTime
      this.calculateReadingTime()
    }, 1000)
  }

  calculateReadingTime() {
    const timeSinceLastActivity = Date.now() - this.focusMetrics.lastActivityTime
    if (timeSinceLastActivity < 5000) {
      this.activityData.readingTime += 1000
    }
  }

  updateLastActivity() {
    this.focusMetrics.lastActivityTime = Date.now()
  }

  updateFocusMetrics() {
    const now = Date.now()
    const timeSinceLastActivity = now - this.focusMetrics.lastActivityTime

    if (timeSinceLastActivity < 5000) {
      // Active in last 5 seconds
      this.activityData.focusTime += 5000

      // Deep focus time (sustained activity for 5+ minutes)
      if (timeSinceLastActivity < 1000) {
        this.focusMetrics.deepFocusTime += 5000
      }
    } else {
      this.focusMetrics.idleTime += 5000
      this.focusMetrics.deepFocusTime = 0 // Reset deep focus counter
    }
  }

  updateFocusIndicator() {
    // Update any focus-related UI elements
    if (this.activityIndicator) {
      this.updateActivityIndicator()
    }
  }

  checkProductivityStatus() {
    const now = Date.now()
    const sessionTime = now - this.startTime

    if (sessionTime < 300000) return // Need at least 5 minutes

    const focusScore = this.calculateFocusScore()
    const activityLevel = this.calculateActivityLevel()

    // Send productivity insights to background script
    this.sendMessage({
      action: "updateProductivityStatus",
      data: {
        focusScore: focusScore,
        activityLevel: activityLevel,
        sessionTime: sessionTime,
        readingMetrics: this.readingMetrics,
        domain: window.location.hostname,
      },
    })
  }

  // Utility methods
  isTypingKey(key) {
    const nonTypingKeys = [
      "Shift",
      "Control",
      "Alt",
      "Meta",
      "CapsLock",
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "PageUp",
      "PageDown",
      "Insert",
      "Delete",
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
      "F6",
      "F7",
      "F8",
      "F9",
      "F10",
      "F11",
      "F12",
      "Escape",
      "PrintScreen",
      "ScrollLock",
      "Pause",
    ]
    return !nonTypingKeys.includes(key) && key.length === 1
  }

  isStopWord(word) {
    const stopWords = [
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "up",
      "about",
      "into",
      "through",
      "during",
      "before",
      "after",
      "above",
      "below",
      "between",
      "among",
      "this",
      "that",
      "these",
      "those",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "can",
      "shall",
      "ought",
      "need",
      "dare",
    ]
    return stopWords.includes(word)
  }

  isCommonWord(word) {
    const commonWords = [
      "that",
      "with",
      "have",
      "this",
      "will",
      "your",
      "from",
      "they",
      "know",
      "want",
      "been",
      "good",
      "much",
      "some",
      "time",
      "very",
      "when",
      "come",
      "here",
      "just",
      "like",
      "long",
      "make",
      "many",
      "over",
      "such",
      "take",
      "than",
      "them",
      "well",
      "were",
      "what",
      "year",
      "work",
      "world",
      "would",
      "write",
      "could",
      "should",
      "might",
      "shall",
      "must",
      "ought",
      "also",
      "back",
      "call",
      "came",
      "each",
      "even",
      "find",
      "give",
      "hand",
      "high",
      "keep",
      "last",
      "left",
      "life",
      "live",
      "look",
      "made",
      "most",
      "move",
      "name",
      "need",
      "next",
      "open",
      "part",
      "play",
      "said",
      "same",
      "seem",
      "show",
      "side",
      "tell",
      "turn",
      "used",
      "want",
      "ways",
      "week",
      "went",
      "word",
      "work",
      "year",
      "young",
    ]
    return commonWords.includes(word)
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  throttle(func, limit) {
    let inThrottle
    return function () {
      const args = arguments
      
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => {
          inThrottle = false
        }, limit)
      }
    }
  }

  debounce(func, delay) {
    return function () {
      const args = arguments
      
      clearTimeout(this.debounceTimers.get(func))
      this.debounceTimers.set(
        func,
        setTimeout(() => {
          func.apply(this, args)
        }, delay),
      )
    }
  }

  sendMessage(message) {
    return new Promise((resolve) => {
      if (this.chrome && this.chrome.runtime) {
        this.chrome.runtime.sendMessage(message, (response) => {
          if (this.chrome.runtime.lastError) {
            console.error("Message sending error:", this.chrome.runtime.lastError)
            resolve({ success: false, error: this.chrome.runtime.lastError.message })
          } else {
            resolve(response || { success: false })
          }
        })
      } else {
        resolve({ success: false, error: "Chrome runtime not available" })
      }
    })
  }
}

// Initialize enhanced content script
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new SynapseContentScript()
  })
} else {
  new SynapseContentScript()
}
