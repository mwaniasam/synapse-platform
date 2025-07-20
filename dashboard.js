// Dashboard script for Synapse extension
class SynapseDashboard {
  constructor() {
    this.analytics = {}
    this.chrome = window.chrome // Declare the chrome variable
    this.initialize()
  }

  async initialize() {
    await this.loadData()
    this.updateUI()
    this.startPeriodicUpdates()
  }

  async loadData() {
    try {
      const response = await this.sendMessage({ action: "getAnalytics" })
      if (response.success) {
        this.analytics = response.data
      }
    } catch (error) {
      console.error("Error loading analytics:", error)
    }
  }

  updateUI() {
    this.updateTodayStats()
    this.updateKeywords()
    this.updateRecentPages()
    this.updateActivityChart()
  }

  updateTodayStats() {
    const visits = this.analytics.visits || []
    const activities = this.analytics.activities || []
    const today = new Date().toDateString()

    // Today's pages
    const todayVisits = visits.filter((v) => new Date(v.timestamp).toDateString() === today)
    document.getElementById("todayPages").textContent = todayVisits.length

    // Today's reading time
    const todayActivities = activities.filter((a) => new Date(a.timestamp).toDateString() === today)
    const totalReadingTime = todayActivities.reduce((total, activity) => {
      return total + (activity.readingTime || 0)
    }, 0)
    document.getElementById("todayReading").textContent = `${Math.floor(totalReadingTime / 60000)}m`

    // Today's keywords
    const todayKeywords = new Set()
    todayActivities.forEach((activity) => {
      if (activity.keywords) {
        activity.keywords.forEach((keyword) => todayKeywords.add(keyword))
      }
    })
    document.getElementById("todayKeywords").textContent = todayKeywords.size

    // Average activity level
    const activityLevels = todayActivities.map((a) => a.activityLevel).filter(Boolean)
    const avgActivity = this.calculateAverageActivity(activityLevels)
    document.getElementById("avgActivity").textContent = avgActivity
  }

  calculateAverageActivity(levels) {
    if (levels.length === 0) return "-"

    const levelValues = { idle: 0, low: 1, medium: 2, high: 3 }
    const avgValue = levels.reduce((sum, level) => sum + levelValues[level], 0) / levels.length

    if (avgValue >= 2.5) return "High"
    if (avgValue >= 1.5) return "Medium"
    if (avgValue >= 0.5) return "Low"
    return "Idle"
  }

  updateKeywords() {
    const activities = this.analytics.activities || []
    const today = new Date().toDateString()
    const todayActivities = activities.filter((a) => new Date(a.timestamp).toDateString() === today)

    const keywordCount = {}
    todayActivities.forEach((activity) => {
      if (activity.keywords) {
        activity.keywords.forEach((keyword) => {
          keywordCount[keyword] = (keywordCount[keyword] || 0) + 1
        })
      }
    })

    const sortedKeywords = Object.entries(keywordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 15)

    const keywordsCloud = document.getElementById("keywordsCloud")
    keywordsCloud.innerHTML = ""

    if (sortedKeywords.length === 0) {
      keywordsCloud.innerHTML = '<div class="keyword-tag">No concepts detected today</div>'
      return
    }

    sortedKeywords.forEach(([keyword, count]) => {
      const tag = document.createElement("div")
      tag.className = "keyword-tag"
      tag.textContent = `${keyword} (${count})`
      keywordsCloud.appendChild(tag)
    })
  }

  updateRecentPages() {
    const visits = this.analytics.visits || []
    const recentVisits = visits.slice(0, 20)

    const recentPages = document.getElementById("recentPages")
    recentPages.innerHTML = ""

    if (recentVisits.length === 0) {
      recentPages.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📖</div>
          <p>No recent pages found</p>
        </div>
      `
      return
    }

    recentVisits.forEach((visit) => {
      const pageItem = document.createElement("div")
      pageItem.className = "page-item"

      const favicon = document.createElement("img")
      favicon.className = "page-favicon"
      favicon.src = `https://www.google.com/s2/favicons?domain=${visit.domain}`
      favicon.onerror = () => {
        favicon.src =
          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect width="16" height="16" fill="%23e5e7eb"/><text x="8" y="12" text-anchor="middle" font-size="12" fill="%236b7280">📄</text></svg>'
      }

      const pageInfo = document.createElement("div")
      pageInfo.className = "page-info"

      const pageTitle = document.createElement("div")
      pageTitle.className = "page-title"
      pageTitle.textContent = visit.title || "Untitled"

      const pageUrl = document.createElement("div")
      pageUrl.className = "page-url"
      pageUrl.textContent = visit.url

      const pageTime = document.createElement("div")
      pageTime.className = "page-time"
      pageTime.textContent = this.formatTimeAgo(visit.timestamp)

      pageInfo.appendChild(pageTitle)
      pageInfo.appendChild(pageUrl)

      pageItem.appendChild(favicon)
      pageItem.appendChild(pageInfo)
      pageItem.appendChild(pageTime)

      recentPages.appendChild(pageItem)
    })
  }

  updateActivityChart() {
    const activities = this.analytics.activities || []
    const today = new Date().toDateString()
    const todayActivities = activities.filter((a) => new Date(a.timestamp).toDateString() === today)

    const activityChart = document.getElementById("activityChart")

    if (todayActivities.length === 0) {
      activityChart.innerHTML = "No activity data available for today"
      return
    }

    // Simple text-based activity summary
    const levelCounts = { idle: 0, low: 0, medium: 0, high: 0 }
    todayActivities.forEach((activity) => {
      if (activity.activityLevel) {
        levelCounts[activity.activityLevel]++
      }
    })

    const total = Object.values(levelCounts).reduce((sum, count) => sum + count, 0)

    activityChart.innerHTML = `
      <div style="text-align: center;">
        <div style="margin-bottom: 15px; font-size: 14px; color: #374151;">Activity Distribution</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 200px;">
          <div style="padding: 8px; background: #fef3c7; border-radius: 4px; font-size: 12px;">
            <div style="font-weight: 600;">High</div>
            <div>${Math.round((levelCounts.high / total) * 100)}%</div>
          </div>
          <div style="padding: 8px; background: #fed7aa; border-radius: 4px; font-size: 12px;">
            <div style="font-weight: 600;">Medium</div>
            <div>${Math.round((levelCounts.medium / total) * 100)}%</div>
          </div>
          <div style="padding: 8px; background: #fecaca; border-radius: 4px; font-size: 12px;">
            <div style="font-weight: 600;">Low</div>
            <div>${Math.round((levelCounts.low / total) * 100)}%</div>
          </div>
          <div style="padding: 8px; background: #e5e7eb; border-radius: 4px; font-size: 12px;">
            <div style="font-weight: 600;">Idle</div>
            <div>${Math.round((levelCounts.idle / total) * 100)}%</div>
          </div>
        </div>
      </div>
    `
  }

  formatTimeAgo(timestamp) {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  startPeriodicUpdates() {
    // Update dashboard every 30 seconds
    setInterval(() => {
      this.loadData().then(() => this.updateUI())
    }, 30000)
  }

  sendMessage(message) {
    return new Promise((resolve) => {
      this.chrome.runtime.sendMessage(message, resolve)
    })
  }
}

// Initialize dashboard when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new SynapseDashboard()
})
