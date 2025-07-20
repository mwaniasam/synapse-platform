class SynapsePopup {
  constructor() {
    this.settings = {}
    this.analytics = {}
    this.realTimeData = {}
    this.updateInterval = null
    this.chrome = window.chrome // Declare the chrome variable
    this.initialize()
  }

  async initialize() {
    try {
      await this.loadData()
      this.setupEventListeners()
      this.updateUI()
      this.startRealTimeUpdates()
    } catch (error) {
      console.error("Popup initialization error:", error)
      this.showNotification("Error loading data", "error")
    }
  }

  async loadData() {
    try {
      const [settingsResponse, analyticsResponse] = await Promise.all([
        this.sendMessage({ action: "getSettings" }),
        this.sendMessage({ action: "getAnalytics" }),
      ])

      if (settingsResponse?.success) {
        this.settings = settingsResponse.data
      }

      if (analyticsResponse?.success) {
        this.analytics = analyticsResponse.data
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  setupEventListeners() {
    // Control buttons
    document.getElementById("readingMode").addEventListener("click", () => {
      this.toggleSetting("readingModeEnabled")
    })

    document.getElementById("focusMode").addEventListener("click", () => {
      this.toggleFocusMode()
    })

    document.getElementById("highlights").addEventListener("click", () => {
      this.toggleSetting("keywordHighlighting")
    })

    // Action buttons
    document.getElementById("settingsBtn").addEventListener("click", () => {
      this.chrome.runtime.openOptionsPage()
    })

    document.getElementById("dashboardBtn").addEventListener("click", () => {
      this.chrome.tabs.create({
        url: "https://synapse-dashboard.vercel.app/dashboard",
      })
    })

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "f" && e.ctrlKey) {
        e.preventDefault()
        this.toggleFocusMode()
      }
    })
  }

  async toggleSetting(settingKey) {
    try {
      this.settings[settingKey] = !this.settings[settingKey]

      await this.sendMessage({
        action: "updateSettings",
        settings: { [settingKey]: this.settings[settingKey] },
      })

      // Update active tab
      const tabs = await this.chrome.tabs.query({ active: true, currentWindow: true })
      if (tabs[0]) {
        this.chrome.tabs
          .sendMessage(tabs[0].id, {
            action: "settingsUpdated",
            settings: this.settings,
          })
          .catch(() => {}) // Ignore errors for inactive tabs
      }

      this.updateControlButtons()
      this.showNotification(`${settingKey} ${this.settings[settingKey] ? "enabled" : "disabled"}`)
    } catch (error) {
      console.error("Error toggling setting:", error)
      this.showNotification("Error updating setting", "error")
    }
  }

  async toggleFocusMode() {
    try {
      const isActive = !this.settings.focusModeActive

      await this.sendMessage({
        action: "updateSettings",
        settings: { focusModeActive: isActive },
      })

      if (isActive) {
        // Start focus session
        await this.sendMessage({
          action: "startFocusSession",
          duration: 25 * 60 * 1000, // 25 minutes
        })
        this.showNotification("Focus mode activated for 25 minutes")
      } else {
        await this.sendMessage({ action: "endFocusSession" })
        this.showNotification("Focus mode deactivated")
      }

      this.settings.focusModeActive = isActive
      this.updateControlButtons()
    } catch (error) {
      console.error("Error toggling focus mode:", error)
    }
  }

  updateUI() {
    this.updateMetrics()
    this.updateTodaySummary()
    this.updateKeywords()
    this.updateControlButtons()
    this.updateActivityStatus()
  }

  updateMetrics() {
    const activities = this.analytics.activities || []
    const recentActivity = activities.find((a) => Date.now() - a.timestamp < 60000)

    // Typing speed
    const typingSpeed = recentActivity?.data?.typingSpeed || 0
    document.getElementById("typingSpeed").textContent = typingSpeed

    // Focus score
    const focusScore = this.calculateFocusScore(activities)
    document.getElementById("focusScore").textContent = `${focusScore}%`

    // Activity level
    const activityLevel = recentActivity?.data?.activityLevel || "idle"
    document.getElementById("activityLevel").textContent =
      activityLevel.charAt(0).toUpperCase() + activityLevel.slice(1)

    // Session time
    const sessionTime = this.calculateSessionTime()
    document.getElementById("sessionTime").textContent = `${sessionTime}m`
  }

  updateTodaySummary() {
    const visits = this.analytics.visits || []
    const activities = this.analytics.activities || []
    const today = new Date().toDateString()

    // Today's pages
    const todayVisits = visits.filter((v) => new Date(v.timestamp).toDateString() === today)
    document.getElementById("pagesCount").textContent = todayVisits.length

    // Reading time
    const todayActivities = activities.filter((a) => new Date(a.timestamp).toDateString() === today)
    const totalReadingTime = todayActivities.reduce((total, activity) => total + (activity.data?.readingTime || 0), 0)
    document.getElementById("readingTime").textContent = `${Math.floor(totalReadingTime / 3600000)}h`

    // Concepts learned
    const todayKeywords = new Set()
    todayActivities.forEach((activity) => {
      if (activity.data?.keywords) {
        activity.data.keywords.forEach((keyword) => todayKeywords.add(keyword))
      }
    })
    document.getElementById("conceptsCount").textContent = todayKeywords.size

    // Daily progress (towards 8-hour goal)
    const dailyGoal = 8 * 60 * 60 * 1000 // 8 hours in milliseconds
    const progress = Math.min((totalReadingTime / dailyGoal) * 100, 100)
    document.getElementById("dailyProgress").style.width = `${progress}%`

    // Streak
    const streak = this.calculateStreak(visits)
    document.getElementById("streakCount").textContent = `${streak} day${streak !== 1 ? "s" : ""} streak`
  }

  updateKeywords() {
    const activities = this.analytics.activities || []
    const recentActivities = activities.filter(
      (a) => Date.now() - a.timestamp < 3600000, // Last hour
    )

    const keywordCount = {}
    recentActivities.forEach((activity) => {
      if (activity.data?.keywords) {
        activity.data.keywords.forEach((keyword) => {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1
        })
      }
    })

    const sortedKeywords = Object.entries(keywordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12)

    const keywordTags = document.getElementById("keywordTags")
    keywordTags.innerHTML = ""

    if (sortedKeywords.length === 0) {
      keywordTags.innerHTML = '<div class="keyword-tag">No concepts detected</div>'
      return
    }

    sortedKeywords.forEach(([keyword, count]) => {
      const tag = document.createElement("div")
      tag.className = "keyword-tag"
      tag.textContent = count > 1 ? `${keyword} (${count})` : keyword
      tag.title = `Encountered ${count} time${count !== 1 ? "s" : ""}`
      keywordTags.appendChild(tag)
    })
  }

  updateControlButtons() {
    // Reading mode
    const readingBtn = document.getElementById("readingMode")
    readingBtn.classList.toggle("active", this.settings.readingModeEnabled)

    // Focus mode
    const focusBtn = document.getElementById("focusMode")
    focusBtn.classList.toggle("active", this.settings.focusModeActive)

    // Highlights
    const highlightsBtn = document.getElementById("highlights")
    highlightsBtn.classList.toggle("active", this.settings.keywordHighlighting)
  }

  updateActivityStatus() {
    const activities = this.analytics.activities || []
    const recentActivity = activities.find((a) => Date.now() - a.timestamp < 30000)

    const statusDot = document.getElementById("statusDot")
    const statusText = document.getElementById("statusText")

    if (recentActivity) {
      const level = recentActivity.data?.activityLevel || "idle"
      statusDot.className = `status-dot ${level}`

      const statusTexts = {
        high: "Highly Active",
        medium: "Active",
        low: "Reading",
        idle: "Idle",
      }

      statusText.textContent = statusTexts[level] || "Unknown"
    } else {
      statusDot.className = "status-dot idle"
      statusText.textContent = "Idle"
    }
  }

  calculateFocusScore(activities) {
    const recentActivities = activities.filter(
      (a) => Date.now() - a.timestamp < 3600000, // Last hour
    )

    if (recentActivities.length === 0) return 0

    let totalScore = 0
    recentActivities.forEach((activity) => {
      const data = activity.data || {}
      let score = 50 // Base score

      // Activity level bonus
      const activityBonus = {
        high: 25,
        medium: 15,
        low: 5,
        idle: -10,
      }
      score += activityBonus[data.activityLevel] || 0

      // Typing speed bonus
      if (data.typingSpeed > 40) score += 15
      else if (data.typingSpeed > 20) score += 10

      // Tab switching penalty
      if (data.tabSwitches > 5) score -= 15

      // Focus time bonus
      if (data.focusTime > 300000) score += 10 // 5+ minutes

      totalScore += Math.max(0, Math.min(100, score))
    })

    return Math.round(totalScore / recentActivities.length)
  }

  calculateSessionTime() {
    const visits = this.analytics.visits || []
    if (visits.length === 0) return 0

    const sortedVisits = visits.sort((a, b) => b.timestamp - a.timestamp)
    let sessionStart = sortedVisits[0].timestamp

    // Find session start (gap > 30 minutes indicates new session)
    for (let i = 1; i < sortedVisits.length; i++) {
      const timeDiff = sortedVisits[i - 1].timestamp - sortedVisits[i].timestamp
      if (timeDiff > 30 * 60 * 1000) break // 30 minutes
      sessionStart = sortedVisits[i].timestamp
    }

    return Math.floor((Date.now() - sessionStart) / 60000)
  }

  calculateStreak(visits) {
    if (visits.length === 0) return 0

    const dailyVisits = {}
    visits.forEach((visit) => {
      const date = new Date(visit.timestamp).toDateString()
      dailyVisits[date] = true
    })

    let streak = 0
    const today = new Date()

    for (let i = 0; i < 365; i++) {
      // Check up to a year
      const checkDate = new Date(today)
      checkDate.setDate(today.getDate() - i)
      const dateStr = checkDate.toDateString()

      if (dailyVisits[dateStr]) {
        streak++
      } else {
        break
      }
    }

    return streak
  }

  startRealTimeUpdates() {
    // Update every 5 seconds
    this.updateInterval = setInterval(() => {
      this.loadData().then(() => {
        this.updateUI()
      })
    }, 5000)
  }

  showNotification(message, type = "success") {
    const notification = document.getElementById("notification")
    notification.textContent = message
    notification.className = `notification ${type}`
    notification.classList.add("show")

    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }

  sendMessage(message) {
    return new Promise((resolve) => {
      this.chrome.runtime.sendMessage(message, (response) => {
        if (this.chrome.runtime.lastError) {
          console.error("Message error:", this.chrome.runtime.lastError)
          resolve({ success: false, error: this.chrome.runtime.lastError.message })
        } else {
          resolve(response || { success: false })
        }
      })
    })
  }
}

// Initialize popup when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new SynapsePopup()
})
