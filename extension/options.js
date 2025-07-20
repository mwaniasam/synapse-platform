// Options page functionality for Synapse extension

document.addEventListener("DOMContentLoaded", () => {
  loadSettings()
  loadStatistics()
  setupEventListeners()
})

// Load saved settings
function loadSettings() {
  window.chrome.storage.sync.get(
    [
      "activityTracking",
      "focusScore",
      "dataFrequency",
      "workDuration",
      "shortBreak",
      "longBreak",
      "autoBreaks",
      "notifications",
      "soundAlerts",
      "syncData",
    ],
    (result) => {
      // Set toggle switches
      setToggle("activityTracking", result.activityTracking !== false)
      setToggle("focusScore", result.focusScore !== false)
      setToggle("autoBreaks", result.autoBreaks === true)
      setToggle("notifications", result.notifications !== false)
      setToggle("soundAlerts", result.soundAlerts !== false)
      setToggle("syncData", result.syncData !== false)

      // Set range inputs
      setRange("workDuration", result.workDuration || 25)
      setRange("shortBreak", result.shortBreak || 5)
      setRange("longBreak", result.longBreak || 15)

      // Set select inputs
      document.getElementById("dataFrequency").value = result.dataFrequency || "5"
    },
  )
}

// Load statistics
function loadStatistics() {
  window.chrome.storage.local.get(["focusSessions", "totalFocusTime", "currentStreak", "activities"], (result) => {
    const sessions = result.focusSessions || []
    const activities = result.activities || []

    // Calculate statistics
    const totalSessions = sessions.length
    const totalTime = sessions.reduce((sum, session) => sum + (session.actualTime || session.duration), 0)
    const currentStreak = calculateStreak(sessions)
    const avgFocus =
      activities.length > 0
        ? Math.round(activities.reduce((sum, activity) => sum + activity.focusScore, 0) / activities.length)
        : 0

    // Update display
    document.getElementById("totalSessions").textContent = totalSessions
    document.getElementById("totalTime").textContent = Math.round(totalTime / 60) + "h"
    document.getElementById("currentStreak").textContent = currentStreak
    document.getElementById("avgFocus").textContent = avgFocus + "%"
  })
}

// Calculate current streak
function calculateStreak(sessions) {
  if (sessions.length === 0) return 0

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  const currentDate = new Date(today)

  const sortedSessions = sessions
    .filter((session) => session.completed)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  for (let i = 0; i < 30; i++) {
    // Check last 30 days
    const dayStart = new Date(currentDate)
    const dayEnd = new Date(currentDate)
    dayEnd.setHours(23, 59, 59, 999)

    const hasSessionThisDay = sortedSessions.some((session) => {
      const sessionDate = new Date(session.createdAt)
      return sessionDate >= dayStart && sessionDate <= dayEnd
    })

    if (hasSessionThisDay) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

// Setup event listeners
function setupEventListeners() {
  // Toggle switches
  document.querySelectorAll(".toggle-switch").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const isActive = this.classList.contains("active")
      this.classList.toggle("active")

      const setting = {}
      setting[this.id] = !isActive
      window.chrome.storage.sync.set(setting)
    })
  })

  // Range inputs
  document.querySelectorAll(".range-input").forEach((range) => {
    range.addEventListener("input", function () {
      const value = this.value
      const valueSpan = document.getElementById(this.id + "Value")
      if (valueSpan) {
        valueSpan.textContent = value + " min"
      }

      const setting = {}
      setting[this.id] = Number.parseInt(value)
      window.chrome.storage.sync.set(setting)
    })
  })

  // Select inputs
  document.getElementById("dataFrequency").addEventListener("change", function () {
    window.chrome.storage.sync.set({ dataFrequency: this.value })
  })

  // Action buttons
  document.getElementById("exportData").addEventListener("click", exportData)
  document.getElementById("clearData").addEventListener("click", clearData)
}

// Helper functions
function setToggle(id, active) {
  const toggle = document.getElementById(id)
  if (toggle) {
    toggle.classList.toggle("active", active)
  }
}

function setRange(id, value) {
  const range = document.getElementById(id)
  const valueSpan = document.getElementById(id + "Value")

  if (range) {
    range.value = value
  }
  if (valueSpan) {
    valueSpan.textContent = value + " min"
  }
}

// Export data functionality
function exportData() {
  window.chrome.storage.local.get(null, (data) => {
    const exportData = {
      settings: {},
      activities: data.activities || [],
      focusSessions: data.focusSessions || [],
      exportDate: new Date().toISOString(),
    }

    window.chrome.storage.sync.get(null, (syncData) => {
      exportData.settings = syncData

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `synapse-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Show success message
      showNotification("Data exported successfully!", "success")
    })
  })
}

// Clear data functionality
function clearData() {
  if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
    window.chrome.storage.local.clear(() => {
      window.chrome.storage.sync.clear(() => {
        showNotification("All data cleared successfully!", "success")
        loadStatistics() // Refresh statistics display
      })
    })
  }
}

// Show notification
function showNotification(message, type = "info") {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === "success" ? "#4CAF50" : "#2196F3"};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 500;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.remove()
  }, 3000)
}
