// Popup script for Synapse extension

var synapsePopup = {
  settings: {},
  analytics: {},

  initialize: function () {
    
    this.loadData().then(() => {
      this.setupEventListeners()
      this.updateUI()
      this.startPeriodicUpdates()
    })
  },

  loadData: function () {
    
    return Promise.all([this.sendMessage({ action: "getSettings" }), this.sendMessage({ action: "getAnalytics" })])
      .then((responses) => {
        if (responses[0] && responses[0].success) {
          this.settings = responses[0].data
        }
        if (responses[1] && responses[1].success) {
          this.analytics = responses[1].data
        }
      })
      .catch((error) => {
        console.error("Error loading data:", error)
      })
  },

  setupEventListeners: function () {
    

    document.getElementById("adaptationToggle").addEventListener("click", () => {
      this.toggleSetting("readingModeEnabled")
    })

    document.getElementById("highlightToggle").addEventListener("click", () => {
      this.toggleSetting("keywordHighlighting")
    })

    document.getElementById("settingsBtn").addEventListener("click", () => {
      window.chrome.runtime.openOptionsPage()
    })

    document.getElementById("dashboardBtn").addEventListener("click", () => {
      window.chrome.tabs.create({ url: window.chrome.runtime.getURL("dashboard.html") })
    })
  },

  toggleSetting: function (settingKey) {
    
    this.settings[settingKey] = !this.settings[settingKey]

    var updateData = {}
    updateData[settingKey] = this.settings[settingKey]

    this.sendMessage({
      action: "updateSettings",
      settings: updateData,
    })
      .then(() => window.chrome.tabs.query({ active: true, currentWindow: true }))
      .then((tabs) => {
        if (tabs[0]) {
          window.chrome.tabs.sendMessage(tabs[0].id, {
            action: "settingsUpdated",
            settings: this.settings,
          })
        }
        this.updateUI()
      })
      .catch((error) => {
        console.error("Error updating settings:", error)
      })
  },

  updateUI: function () {
    var adaptationToggle = document.getElementById("adaptationToggle")
    var highlightToggle = document.getElementById("highlightToggle")

    if (this.settings.readingModeEnabled) {
      adaptationToggle.classList.add("active")
    } else {
      adaptationToggle.classList.remove("active")
    }

    if (this.settings.keywordHighlighting) {
      highlightToggle.classList.add("active")
    } else {
      highlightToggle.classList.remove("active")
    }

    this.updateActivityStatus()
    this.updateStatistics()
    this.updateKeywords()
  },

  updateActivityStatus: function () {
    var activities = this.analytics.activities || []
    var recentActivity = activities.find((a) => Date.now() - a.timestamp < 60000)

    var activityLevel = recentActivity ? recentActivity.activityLevel : "idle"
    var activityDot = document.getElementById("activityDot")
    var activityStatus = document.getElementById("activityStatus")

    activityDot.className = "status-dot " + activityLevel

    var statusText = {
      high: "Highly Active",
      medium: "Moderately Active",
      low: "Low Activity",
      idle: "Idle",
    }

    activityStatus.textContent = statusText[activityLevel] || "Unknown"

    var sessionStart = this.getSessionStart()
    var sessionDuration = sessionStart ? Math.floor((Date.now() - sessionStart) / 60000) : 0
    var readingTime = this.getTotalReadingTime()

    document.getElementById("sessionInfo").textContent =
      "Session: " + sessionDuration + "m | Reading: " + Math.floor(readingTime / 60000) + "m"
  },

  updateStatistics: function () {
    var visits = this.analytics.visits || []
    var today = new Date().toDateString()
    var todayVisits = visits.filter((v) => new Date(v.timestamp).toDateString() === today)

    document.getElementById("pagesVisited").textContent = todayVisits.length

    var totalReadingTime = this.getTotalReadingTime()
    document.getElementById("readingTime").textContent = Math.floor(totalReadingTime / 60000) + "m"
  },

  updateKeywords: function () {
    var activities = this.analytics.activities || []
    var recentActivities = activities.filter((a) => Date.now() - a.timestamp < 3600000)

    var allKeywords = new Set()
    recentActivities.forEach((activity) => {
      if (activity.keywords) {
        activity.keywords.forEach((keyword) => {
          allKeywords.add(keyword)
        })
      }
    })

    var keywordTags = document.getElementById("keywordTags")
    keywordTags.innerHTML = ""

    if (allKeywords.size === 0) {
      keywordTags.innerHTML = '<div class="keyword-tag">No concepts detected</div>'
      return
    }

    Array.from(allKeywords)
      .slice(0, 8)
      .forEach((keyword) => {
        var tag = document.createElement("div")
        tag.className = "keyword-tag"
        tag.textContent = keyword
        keywordTags.appendChild(tag)
      })
  },

  getSessionStart: function () {
    var visits = this.analytics.visits || []
    if (visits.length === 0) return null

    var sortedVisits = visits.sort((a, b) => b.timestamp - a.timestamp)
    var sessionStart = sortedVisits[0].timestamp

    for (var i = 1; i < sortedVisits.length; i++) {
      var timeDiff = sortedVisits[i - 1].timestamp - sortedVisits[i].timestamp
      if (timeDiff > 30 * 60 * 1000) {
        break
      }
      sessionStart = sortedVisits[i].timestamp
    }

    return sessionStart
  },

  getTotalReadingTime: function () {
    var activities = this.analytics.activities || []
    var today = new Date().toDateString()
    var todayActivities = activities.filter((a) => new Date(a.timestamp).toDateString() === today)

    return todayActivities.reduce((total, activity) => total + (activity.readingTime || 0), 0)
  },

  startPeriodicUpdates: function () {
    
    setInterval(() => {
      this.loadData().then(() => {
        this.updateUI()
      })
    }, 10000)
  },

  sendMessage: (message) =>
    new Promise((resolve) => {
      window.chrome.runtime.sendMessage(message, resolve)
    }),
}

document.addEventListener("DOMContentLoaded", () => {
  synapsePopup.initialize()
})
