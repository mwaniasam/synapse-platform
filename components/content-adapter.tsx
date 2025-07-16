"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Settings, Eye, Highlighter, Brain } from "lucide-react"

interface AdaptationSettings {
  cognitiveDetectionEnabled: boolean
  contentAdaptationEnabled: boolean
  adaptationIntensity: number
  preferredFontSize: number
  preferredLineHeight: number
  highlightKeyTerms: boolean
  showVisualCues: boolean
}

export default function ContentAdapter() {
  const [settings, setSettings] = useState<AdaptationSettings>({
    cognitiveDetectionEnabled: true,
    contentAdaptationEnabled: true,
    adaptationIntensity: 70,
    preferredFontSize: 16,
    preferredLineHeight: 1.6,
    highlightKeyTerms: true,
    showVisualCues: true,
  })
  const [cognitiveState, setCognitiveState] = useState("focused")
  const [adaptationsApplied, setAdaptationsApplied] = useState<string[]>([])

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (settings.contentAdaptationEnabled) {
      applyAdaptations()
    } else {
      removeAdaptations()
    }
  }, [settings, cognitiveState])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    }
  }

  const updateSettings = async (newSettings: Partial<AdaptationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSettings),
      })
    } catch (error) {
      console.error("Failed to update settings:", error)
    }
  }

  const applyAdaptations = () => {
    const adaptations: string[] = []

    // Remove existing adaptations
    removeAdaptations()

    // Create new style element
    const style = document.createElement("style")
    style.id = "synapse-adaptations"

    let css = `
      .synapse-adapted {
        font-size: ${settings.preferredFontSize}px !important;
        line-height: ${settings.preferredLineHeight} !important;
        transition: all 0.3s ease !important;
      }
    `

    // State-specific adaptations
    switch (cognitiveState) {
      case "focused":
        if (settings.highlightKeyTerms) {
          css += `
            .synapse-highlight {
              background-color: rgba(255, 255, 0, 0.3) !important;
              padding: 1px 2px !important;
              border-radius: 2px !important;
            }
          `
          adaptations.push("Key term highlighting")
        }
        break

      case "distracted":
        css += `
          .synapse-adapted {
            font-size: ${settings.preferredFontSize + 2}px !important;
            line-height: ${settings.preferredLineHeight + 0.2} !important;
          }
          .synapse-focus-aid {
            border-left: 3px solid #3b82f6 !important;
            padding-left: 10px !important;
            margin: 10px 0 !important;
          }
        `
        adaptations.push("Increased font size", "Focus aids")
        break

      case "fatigued":
        css += `
          .synapse-adapted {
            font-size: ${settings.preferredFontSize + 4}px !important;
            line-height: ${settings.preferredLineHeight + 0.4} !important;
            color: #1f2937 !important;
          }
        `
        adaptations.push("Larger text", "Enhanced contrast")
        break
    }

    style.textContent = css
    document.head.appendChild(style)

    // Apply classes to content
    document.querySelectorAll("p, article, .content, main").forEach((element) => {
      if (element.textContent && element.textContent.trim().length > 50) {
        element.classList.add("synapse-adapted")
      }
    })

    setAdaptationsApplied(adaptations)
  }

  const removeAdaptations = () => {
    const existingStyle = document.getElementById("synapse-adaptations")
    if (existingStyle) {
      existingStyle.remove()
    }

    document.querySelectorAll(".synapse-adapted").forEach((element) => {
      element.classList.remove("synapse-adapted")
    })

    setAdaptationsApplied([])
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Content Adaptation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="text-sm font-medium">Cognitive Detection</span>
            </div>
            <Switch
              checked={settings.cognitiveDetectionEnabled}
              onCheckedChange={(checked) => updateSettings({ cognitiveDetectionEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">Content Adaptation</span>
            </div>
            <Switch
              checked={settings.contentAdaptationEnabled}
              onCheckedChange={(checked) => updateSettings({ contentAdaptationEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Highlighter className="w-4 h-4" />
              <span className="text-sm font-medium">Highlight Key Terms</span>
            </div>
            <Switch
              checked={settings.highlightKeyTerms}
              onCheckedChange={(checked) => updateSettings({ highlightKeyTerms: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Adaptation Intensity</span>
              <span className="text-sm text-muted-foreground">{settings.adaptationIntensity}%</span>
            </div>
            <Slider
              value={[settings.adaptationIntensity]}
              onValueChange={([value]) => updateSettings({ adaptationIntensity: value })}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Font Size</span>
              <span className="text-sm text-muted-foreground">{settings.preferredFontSize}px</span>
            </div>
            <Slider
              value={[settings.preferredFontSize]}
              onValueChange={([value]) => updateSettings({ preferredFontSize: value })}
              min={12}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Line Height</span>
              <span className="text-sm text-muted-foreground">{settings.preferredLineHeight}</span>
            </div>
            <Slider
              value={[settings.preferredLineHeight]}
              onValueChange={([value]) => updateSettings({ preferredLineHeight: value })}
              min={1.2}
              max={2.5}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {adaptationsApplied.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Active Adaptations:</span>
            <div className="flex flex-wrap gap-1">
              {adaptationsApplied.map((adaptation, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {adaptation}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
