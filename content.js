// Content script for Synapse extension

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
    }

    // Advanced metrics
    this.typingMetrics = {
      keyTimes: [],
      currentWPM: 0,
      averageWPM: 0,
      burstCount: 0,
    }

    this.scrollMetrics = {
      scrollTimes: [],
      scrollPositions: [],
      currentSpeed: 0,
      averageSpeed: 0,
      direction: 0,
    }

    this.focusMetrics = {
      focusStartTime: Date.now(),
      lastActivityTime: Date.now(),
      tabSwitchCount: 0,
      idleTime: 0,
    }

    this.startTime = Date.now()
    this.keywords = new Set()
    this.currentTheme = "auto"

    // UI elements
    this.activityIndicator = null
    this.typingIndicator = null
    this.scrollIndicator = null
    this.alertOverlay = null

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
      }
    } catch (error) {
      console.error("Synapse initialization error:", error)
    }
  }

  setupEventListeners() {
    // Enhanced mouse movement tracking with velocity
    let lastMouseTime = Date.now()
    let lastMousePos = { x: 0, y: 0 }

    document.addEventListener(
      "mousemove",
      this.throttle((e) => {
        const now = Date.now()
        const timeDiff = now - lastMouseTime
        const distance = Math.sqrt(Math.pow(e.clientX - lastMousePos.x, 2) + Math.pow(e.clientY - lastMousePos.y, 2))

        this.activityData.mouseMovements++
        this.updateLastActivity()

        // Calculate mouse velocity
        if (timeDiff > 0) {
          const velocity = distance / timeDiff
          this.processMouseVelocity(velocity)
        }

        lastMouseTime = now
        lastMousePos = { x: e.clientX, y: e.clientY }
      }, 50),
    )

    // Enhanced keyboard tracking with typing speed
    document.addEventListener("keydown", (e) => {
      this.activityData.keystrokes++
      this.updateLastActivity()
      this.processKeystroke(e)
    })

    // Advanced scroll tracking with speed and direction
    let lastScrollTime = Date.now()
    let lastScrollPos = window.pageYOffset

    document.addEventListener(
      "scroll",
      this.throttle(() => {
        const now = Date.now()
        const currentPos = window.pageYOffset
        const timeDiff = now - lastScrollTime
        const distance = Math.abs(currentPos - lastScrollPos)

        this.activityData.scrollEvents++
        this.updateLastActivity()

        // Calculate scroll speed and direction
        if (timeDiff > 0) {
          const speed = distance / timeDiff
          const direction = currentPos > lastScrollPos ? 1 : -1
          this.processScrollMetrics(speed, direction, currentPos)
        }

        lastScrollTime = now
        lastScrollPos = currentPos
      }, 100),
    )

    // Enhanced click tracking
    document.addEventListener("click", (e) => {
      this.activityData.clickEvents++
      this.updateLastActivity()
      this.processClick(e)
    })

    // Focus and blur tracking
    window.addEventListener("focus", () => {
      this.focusMetrics.focusStartTime = Date.now()
      this.updateFocusIndicator()
    })

    window.addEventListener("blur", () => {
      this.focusMetrics.tabSwitchCount++
      this.checkProductivityAlert()
    })

    // Visibility change tracking
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.focusMetrics.tabSwitchCount++
        this.checkProductivityAlert()
      } else {
        this.focusMetrics.focusStartTime = Date.now()
      }
    })

    // Listen for settings changes
    if (this.chrome && this.chrome.runtime) {
      this.chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "settingsUpdated") {
          this.settings = request.settings
          this.applyTheme()
          this.updateUIElements()
        }
      })
    }
  }

  startAdvancedTracking() {
    // Real-time metrics calculation
    setInterval(() => {
      this.calculateTypingSpeed()
      this.calculateScrollSpeed()
      this.updateActivityIndicator()
      this.updateTypingIndicator()
      this.updateScrollIndicator()
    }, 1000)

    // Productivity monitoring
    setInterval(() => {
      this.checkProductivityStatus()
    }, 30000) // Check every 30 seconds

    // Focus session tracking
    setInterval(() => {
      this.updateFocusMetrics()
    }, 5000)
  }

  processKeystroke(event) {
    const now = Date.now()

    // Only count actual typing (not navigation keys)
    if (this.isTypingKey(event.key)) {
      this.typingMetrics.keyTimes.push(now)

      // Keep only last 50 keystrokes for WPM calculation
      if (this.typingMetrics.keyTimes.length > 50) {
        this.typingMetrics.keyTimes.shift()
      }

      // Show typing indicator
      this.showTypingIndicator()
    }
  }

  calculateTypingSpeed() {
    const keyTimes = this.typingMetrics.keyTimes
    if (keyTimes.length < 5) return

    const now = Date.now()
    const recentKeys = keyTimes.filter((time) => now - time < 60000) // Last minute

    if (recentKeys.length > 0) {
      const timeSpan = (now - recentKeys[0]) / 1000 / 60 // minutes
      const wordsTyped = recentKeys.length / 5 // Average 5 characters per word
      this.typingMetrics.currentWPM = Math.round(wordsTyped / timeSpan)
      this.activityData.typingSpeed = this.typingMetrics.currentWPM
    }
  }

  processScrollMetrics(speed, direction, position) {
    const now = Date.now()

    this.scrollMetrics.scrollTimes.push(now)
    this.scrollMetrics.scrollPositions.push({ time: now, position, speed, direction })

    // Keep only last 20 scroll events
    if (this.scrollMetrics.scrollTimes.length > 20) {
      this.scrollMetrics.scrollTimes.shift()
      this.scrollMetrics.scrollPositions.shift()
    }

    this.scrollMetrics.currentSpeed = speed
    this.scrollMetrics.direction = direction

    // Show scroll indicator
    this.showScrollIndicator()
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
  }

  createActivityIndicator() {
    if (this.activityIndicator) return

    this.activityIndicator = document.createElement("div")
    this.activityIndicator.className = "synapse-indicator"
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

  updateActivityIndicator() {
    if (!this.activityIndicator) return

    const activityLevel = this.calculateActivityLevel()
    const typingSpeed = this.typingMetrics.currentWPM || 0
    const scrollSpeed = Math.round(this.scrollMetrics.currentSpeed * 1000) || 0

    this.activityIndicator.className = `synapse-indicator ${activityLevel}-activity`
    this.activityIndicator.innerHTML = `
      <span>${this.getActivityText(activityLevel)}</span>
    `
  }

  showTypingIndicator() {
    if (!this.typingIndicator || this.typingMetrics.currentWPM === 0) return

    this.typingIndicator.textContent = `${this.typingMetrics.currentWPM} WPM`
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

    progressBar.style.height = `${Math.min(scrollPercent, 100)}%`
    this.scrollIndicator.classList.add("show")

    // Hide after 2 seconds of no scrolling
    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(() => {
      this.scrollIndicator.classList.remove("show")
    }, 2000)
  }

  showProductivityAlert(alertData) {
    if (!this.alertOverlay) return

    const title = this.alertOverlay.querySelector(".synapse-alert-title")
    const message = this.alertOverlay.querySelector(".synapse-alert-message")

    if (alertData.type === "unproductive") {
      title.textContent = "⚠️ Productivity Alert"
      message.textContent = `You've been on ${alertData.domain} for ${alertData.timeSpent} minutes. Time to refocus?`
    } else if (alertData.type === "distraction") {
      title.textContent = "🎯 Focus Alert"
      message.textContent = `You've switched tabs ${alertData.switchCount} times recently. Consider taking a break or focusing on one task.`
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
      this.enableFocusMode()
    }
  }

  enableFocusMode() {
    // Create focus mode indicator
    const focusBar = document.createElement("div")
    focusBar.className = "synapse-focus-mode active"
    document.body.appendChild(focusBar)

    // Enable focus mode for 25 minutes (Pomodoro)
    setTimeout(
      () => {
        focusBar.remove()
      },
      25 * 60 * 1000,
    )
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

  // Enhanced activity level calculation
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

    const adjustedTotal = total + typingBonus + scrollBonus

    if (adjustedTotal > 150) return "high"
    if (adjustedTotal > 75) return "medium"
    if (adjustedTotal > 20) return "low"
    return "idle"
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

  isTypingKey(key) {
    // Exclude navigation and modifier keys
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
    ]

    return !nonTypingKeys.includes(key) && key.length === 1
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
    } else {
      this.focusMetrics.idleTime += 5000
    }
  }

  // Enhanced data sending with new metrics
  sendActivityData() {
    const activityLevel = this.calculateActivityLevel()
    const data = {
      ...this.activityData,
      activityLevel: activityLevel,
      keywords: Array.from(this.keywords),
      typingSpeed: this.typingMetrics.currentWPM,
      scrollSpeed: this.activityData.scrollSpeed,
      focusTime: this.activityData.focusTime,
      tabSwitches: this.focusMetrics.tabSwitchCount,
      domain: window.location.hostname,
      url: window.location.href,
      title: document.title,
    }

    this.sendMessage({ action: "trackActivity", data: data })
      .then(() => {
        // Reset counters
        this.activityData.mouseMovements = 0
        this.activityData.keystrokes = 0
        this.activityData.scrollEvents = 0
        this.activityData.clickEvents = 0
        this.activityData.focusTime = 0
        this.focusMetrics.tabSwitchCount = 0
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

  // Enhanced keyword extraction with better filtering
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
      })

      const sortedWords = Object.entries(wordCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 25)
        .map((entry) => entry[0])

      sortedWords.forEach((word) => {
        this.keywords.add(word)
      })

      if (this.settings.keywordHighlighting) {
        this.highlightKeywords(sortedWords.slice(0, 15))
      }
    } catch (error) {
      console.error("Error extracting keywords:", error)
    }
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
    ]
    return commonWords.includes(word)
  }

  // Enhanced highlighting with better performance
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
            const excludedTags = ["script", "style", "noscript", "textarea", "input"]

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

        keywords.forEach((keyword) => {
          const regex = new RegExp(`\\b${keyword}\\b`, "gi")
          if (regex.test(text)) {
            text = text.replace(regex, `<mark class="synapse-highlight">${keyword}</mark>`)
            modified = true
          }
        })

        if (modified) {
          const wrapper = document.createElement("span")
          wrapper.innerHTML = text
          textNode.parentNode.replaceChild(wrapper, textNode)
        }
      })
    } catch (error) {
      console.error("Error highlighting keywords:", error)
    }
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
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
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
    return textRatio > 0.3
  }

  isNavigationElement(element) {
    const navTags = ["nav", "header", "footer", "aside", "menu"]
    const navClasses = ["nav", "menu", "sidebar", "header", "footer", "toolbar"]

    if (navTags.includes(element.tagName.toLowerCase())) return true

    const className = element.className.toLowerCase()
    return navClasses.some((navClass) => className.includes(navClass))
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
    ]
    return stopWords.includes(word)
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

  sendMessage(message) {
    return new Promise((resolve) => {
      if (this.chrome && this.chrome.runtime) {
        this.chrome.runtime.sendMessage(message, (response) => {
          if (this.chrome.runtime.lastError) {
            console.error("Message sending error:", this.chrome.runtime.lastError)
            resolve({ success: false, error: this.chrome.runtime.lastError.message })
          } else {
            resolve(response)
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
