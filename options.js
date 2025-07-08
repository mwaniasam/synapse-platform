// Options page script for Synapse extension
class SynapseOptions {
  constructor() {
    this.settings = {}
    this.analytics = {}
    this.chrome = window.chrome // Declare the chrome variable
    this.initialize()
  }

  async initialize() {
    await this.loadData()
    this.setupEventListeners()
    this.updateUI()
  }

  async loadData() {
    try {
      // Get settings
      const settingsResponse = await this.sendMessage({ action: "getSettings" })
      if (settingsResponse.success) {
        this.settings = settingsResponse.data
      }

      // Get analytics for data stats
      const analyticsResponse = await this.sendMessage({ action: "getAnalytics" })
      if (analyticsResponse.success) {
        this.analytics = analyticsResponse.data
      }
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }

  setupEventListeners() {
    // Toggle switches
    document.querySelectorAll(".toggle-switch").forEach((toggle) => {
      toggle.addEventListener("click", (e) => {
        const setting = e.target.dataset.setting
        this.toggleSetting(setting)
      })
    })

    // Select controls
    document.querySelectorAll(".select-control").forEach((select) => {
      select.addEventListener("change", (e) => {
        const setting = e.target.dataset.setting
        const value = e.target.value
        this.updateSetting(setting, value)
      })
    })

    // Data management buttons
    document.getElementById("exportData").addEventListener("click", () => {
      this.exportData()
    })

    document.getElementById("clearData").addEventListener("click", () => {
      this.clearData()
    })
  }

  async toggleSetting(settingKey) {
    this.settings[settingKey] = !this.settings[settingKey]
    await this.saveSetting(settingKey, this.settings[settingKey])
    this.updateUI()
  }

  async updateSetting(settingKey, value) {
    this.settings[settingKey] = value
    await this.saveSetting(settingKey, value)
    this.updateUI()
  }

  async saveSetting(key, value) {
    try {
      await this.sendMessage({
        action: "updateSettings",
        settings: { [key]: value },
      })
      this.showSaveIndicator()
    } catch (error) {
      console.error("Error saving setting:", error)
    }
  }

  updateUI() {
    // Update toggle switches
    document.querySelectorAll(".toggle-switch").forEach((toggle) => {
      const setting = toggle.dataset.setting
      const isActive = this.settings[setting]
      toggle.classList.toggle("active", isActive)
    })

    // Update select controls
    document.querySelectorAll(".select-control").forEach((select) => {
      const setting = select.dataset.setting
      const value = this.settings[setting]
      if (value) {
        select.value = value
      }
    })

    // Update data statistics
    this.updateDataStats()
  }

  updateDataStats() {
    const visits = this.analytics.visits || []
    const activities = this.analytics.activities || []

    // Count total visits
    document.getElementById("totalVisits").textContent = visits.length

    // Count unique keywords
    const allKeywords = new Set()
    activities.forEach((activity) => {
      if (activity.keywords) {
        activity.keywords.forEach((keyword) => allKeywords.add(keyword))
      }
    })
    document.getElementById("totalKeywords").textContent = allKeywords.size

    // Estimate storage usage
    const dataSize = JSON.stringify({ visits, activities, settings: this.settings }).length
    const sizeKB = Math.round(dataSize / 1024)
    document.getElementById("storageUsed").textContent = `${sizeKB} KB`
  }

  showSaveIndicator() {
    const indicator = document.getElementById("saveIndicator")
    indicator.classList.add("show")
    setTimeout(() => {
      indicator.classList.remove("show")
    }, 2000)
  }

  async exportData() {
    try {
      const data = {
        settings: this.settings,
        visits: this.analytics.visits || [],
        activities: this.analytics.activities || [],
        exportDate: new Date().toISOString(),
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `synapse-data-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("Error exporting data. Please try again.")
    }
  }

  async clearData() {
    if (!confirm("Are you sure you want to clear all Synapse data? This action cannot be undone.")) {
      return
    }

    try {
      // Clear local storage
      await this.chrome.storage.local.clear()

      // Reset settings to defaults
      await this.sendMessage({
        action: "updateSettings",
        settings: {
          adaptationEnabled: true,
          readingModeEnabled: true,
          keywordHighlighting: true,
          activityTracking: true,
          adaptationIntensity: "medium",
          theme: "light",
        },
      })

      // Reload data and UI
      await this.loadData()
      this.updateUI()

      alert("All data has been cleared successfully.")
    } catch (error) {
      console.error("Error clearing data:", error)
      alert("Error clearing data. Please try again.")
    }
  }

  sendMessage(message) {
    return new Promise((resolve) => {
      this.chrome.runtime.sendMessage(message, resolve)
    })
  }
}

// Initialize options page when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new SynapseOptions()
})
