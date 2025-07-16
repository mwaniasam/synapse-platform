"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, Settings, Sliders, Type, Palette, Lightbulb, Download, Share } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import Navigation from "@/components/navigation"

export default function AdaptContentStudio() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("synapse_auth")
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Content Adaptation Studio</h1>
          <p className="text-gray-600">Fine-tune how content adapts to your cognitive states</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Adaptation Controls */}
          <div className="lg:col-span-1 space-y-4 overflow-y-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Cognitive State
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select defaultValue="focused">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="focused">Focused</SelectItem>
                    <SelectItem value="receptive">Receptive</SelectItem>
                    <SelectItem value="fatigued">Fatigued</SelectItem>
                    <SelectItem value="distracted">Distracted</SelectItem>
                  </SelectContent>
                </Select>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-900">Focused State</span>
                  </div>
                  <p className="text-xs text-green-700">Optimal for complex content and deep learning</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  Typography
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Font Size</Label>
                  <Slider defaultValue={[16]} max={24} min={12} step={1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>12px</span>
                    <span>24px</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Line Height</Label>
                  <Slider defaultValue={[1.6]} max={2.5} min={1.2} step={0.1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1.2</span>
                    <span>2.5</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Letter Spacing</Label>
                  <Slider defaultValue={[0]} max={2} min={-1} step={0.1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>-1px</span>
                    <span>2px</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Visual Enhancements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Highlight Key Terms</Label>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Highlight Intensity</Label>
                  <Slider defaultValue={[70]} max={100} min={0} step={10} />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Add Visual Cues</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Simplify Complex Sentences</Label>
                  <Switch />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Content Density</Label>
                  <Slider defaultValue={[60]} max={100} min={20} step={10} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Sparse</span>
                    <span>Dense</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Smart Features
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Auto-summarize</Label>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Concept Linking</Label>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm">Progress Indicators</Label>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <Button className="w-full">Apply to Current Page</Button>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Split Preview */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Original Content */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Original Content
                </CardTitle>
                <CardDescription>How the content appears normally</CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)] overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <h2>Machine Learning Fundamentals</h2>
                  <p>
                    Machine learning is a subset of artificial intelligence (AI) that provides systems the ability to
                    automatically learn and improve from experience without being explicitly programmed. Machine
                    learning focuses on the development of computer programs that can access data and use it to learn
                    for themselves.
                  </p>
                  <p>
                    The process of learning begins with observations or data, such as examples, direct experience, or
                    instruction, in order to look for patterns in data and make better decisions in the future based on
                    the examples that we provide. The primary aim is to allow the computers to learn automatically
                    without human intervention or assistance and adjust actions accordingly.
                  </p>
                  <h3>Types of Machine Learning</h3>
                  <p>
                    Machine learning algorithms are typically categorized as supervised or unsupervised. Supervised
                    machine learning algorithms can apply what has been learned in the past to new data using labeled
                    examples to predict future events. Starting from the analysis of a known training dataset, the
                    learning algorithm produces an inferred function to make predictions about the output values.
                  </p>
                  <p>
                    Unsupervised machine learning algorithms are used when the information used to train is neither
                    classified nor labeled. Unsupervised learning studies how systems can infer a function to describe a
                    hidden structure from unlabeled data. The system doesn't figure out the right output, but it
                    explores the data and can draw inferences from datasets to describe hidden structures from unlabeled
                    data.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Adapted Content */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sliders className="w-5 h-5" />
                  Adapted Content
                </CardTitle>
                <CardDescription>
                  Content optimized for
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    Focused State
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-100px)] overflow-y-auto">
                <div className="prose prose-sm max-w-none space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 border-l-4 border-blue-500 pl-3">
                    Machine Learning Fundamentals
                  </h2>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-base leading-relaxed">
                      <span className="bg-yellow-200 px-1 rounded">Machine learning</span> is a subset of{" "}
                      <span className="bg-yellow-200 px-1 rounded">artificial intelligence (AI)</span> that provides
                      systems the ability to automatically{" "}
                      <span className="font-semibold text-blue-800">learn and improve from experience</span> without
                      being explicitly programmed.
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-base leading-relaxed">
                      The <span className="font-semibold">learning process</span> begins with:
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Observations or data</li>
                      <li>• Examples and direct experience</li>
                      <li>• Pattern recognition</li>
                      <li>• Future decision making</li>
                    </ul>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 border-l-4 border-green-500 pl-3">
                    Types of Machine Learning
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">Supervised Learning</h4>
                      <p className="text-sm text-green-800 leading-relaxed">
                        Uses <span className="bg-green-200 px-1 rounded">labeled examples</span> to predict future
                        events from known training data.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-900 mb-2">Unsupervised Learning</h4>
                      <p className="text-sm text-purple-800 leading-relaxed">
                        Finds <span className="bg-purple-200 px-1 rounded">hidden patterns</span> in unlabeled data
                        without knowing the correct output.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
