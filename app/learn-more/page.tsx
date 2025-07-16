"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight,
  Moon,
  Sun,
  Menu,
  X,
  Check,
  Users,
  Award,
  BookOpen,
  BarChart3,
  Lightbulb,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LearnMore() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-effect">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Synapse Learning Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How it Works
              </Link>
              <Link href="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 animate-slide-up">
              <Link href="/#features" className="block text-sm font-medium hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/#how-it-works" className="block text-sm font-medium hover:text-primary transition-colors">
                How it Works
              </Link>
              <Link href="/#pricing" className="block text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/auth">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Back to Home */}
      <div className="pt-20 pb-8 px-6">
        <div className="container mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]" />

        <div className="container mx-auto relative">
          <div className="text-center space-y-8 animate-slide-up max-w-4xl mx-auto">
            <Badge className="w-fit bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              The Future of Learning is Here
            </Badge>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                About
                <span className="gradient-text block">Synapse Learning Pro</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Discover how our revolutionary AI-powered platform adapts to your unique cognitive patterns,
                transforming the way you learn, focus, and retain information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-fit mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="science">The Science</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-12">
              {/* What is Synapse */}
              <div className="text-center space-y-6 animate-slide-up">
                <h2 className="text-3xl font-bold">What is Synapse Learning Pro?</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Synapse Learning Pro is an intelligent learning companion that uses advanced AI to understand your
                  cognitive state in real-time and adapts content accordingly. It's like having a personal tutor that
                  knows exactly when you're focused, distracted, or fatigued.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Brain,
                    title: "Cognitive Awareness",
                    description:
                      "Real-time detection of your mental state through behavioral analysis and interaction patterns.",
                    stats: "25% better focus",
                  },
                  {
                    icon: Zap,
                    title: "Adaptive Learning",
                    description:
                      "Content automatically adjusts complexity, pacing, and presentation based on your cognitive capacity.",
                    stats: "30% improved retention",
                  },
                  {
                    icon: Target,
                    title: "Personalized Insights",
                    description:
                      "Deep analytics reveal your optimal learning times, patterns, and areas for improvement.",
                    stats: "40% less distraction",
                  },
                ].map((benefit, index) => (
                  <Card
                    key={index}
                    className="text-center border-0 shadow-lg glass-effect animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <benefit.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground mb-4">{benefit.description}</p>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        {benefit.stats}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* How It Works */}
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-center">How Synapse Works</h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {[
                    {
                      step: "01",
                      title: "Observe",
                      description: "Monitors your reading speed, click patterns, and interaction behaviors",
                      icon: BarChart3,
                    },
                    {
                      step: "02",
                      title: "Analyze",
                      description: "AI algorithms process patterns to determine your current cognitive state",
                      icon: Brain,
                    },
                    {
                      step: "03",
                      title: "Adapt",
                      description: "Content automatically adjusts font size, complexity, and visual elements",
                      icon: Zap,
                    },
                    {
                      step: "04",
                      title: "Learn",
                      description: "You experience optimized learning tailored to your mental capacity",
                      icon: Lightbulb,
                    },
                  ].map((step, index) => (
                    <Card key={index} className="text-center border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                          {step.step}
                        </div>
                        <step.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="science" className="space-y-12">
              <div className="text-center space-y-6 animate-slide-up">
                <h2 className="text-3xl font-bold">The Science Behind Synapse</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Our approach is grounded in decades of cognitive science research and cutting-edge neuroscience
                  findings.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-6 h-6 text-primary" />
                      Cognitive Load Theory
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Based on John Sweller's research, we understand that learning is most effective when cognitive
                      load is optimized. Synapse dynamically adjusts content complexity to match your current mental
                      capacity.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Intrinsic load management
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Extraneous load reduction
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Germane load optimization
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      Attention Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Drawing from attention research by Posner and Petersen, we track focus patterns and predict
                      attention lapses before they occur, allowing proactive content adaptation.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Sustained attention monitoring
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Selective attention enhancement
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Executive attention support
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-6 h-6 text-primary" />
                      Spaced Repetition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Implementing Hermann Ebbinghaus's forgetting curve research, Synapse schedules content review at
                      optimal intervals to maximize long-term retention.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Personalized review schedules
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Difficulty-based intervals
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Retention curve optimization
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-6 h-6 text-primary" />
                      Flow State Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Based on Mihaly Csikszentmihalyi's flow theory, we identify and maintain optimal challenge-skill
                      balance to keep you in peak learning states.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Challenge-skill matching
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Immediate feedback loops
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        Distraction elimination
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technology" className="space-y-12">
              <div className="text-center space-y-6 animate-slide-up">
                <h2 className="text-3xl font-bold">Advanced Technology Stack</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Synapse leverages cutting-edge AI, machine learning, and web technologies to deliver a seamless
                  learning experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    category: "AI & Machine Learning",
                    technologies: [
                      "Natural Language Processing",
                      "Computer Vision",
                      "Behavioral Pattern Recognition",
                      "Predictive Analytics",
                      "Deep Learning Models",
                    ],
                    icon: Brain,
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    category: "Real-time Processing",
                    technologies: [
                      "WebRTC for Eye Tracking",
                      "WebSocket Connections",
                      "Edge Computing",
                      "Stream Processing",
                      "Low-latency Analytics",
                    ],
                    icon: Zap,
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    category: "Privacy & Security",
                    technologies: [
                      "Local Data Processing",
                      "End-to-end Encryption",
                      "Zero-knowledge Architecture",
                      "GDPR Compliance",
                      "Federated Learning",
                    ],
                    icon: Shield,
                    color: "from-green-500 to-emerald-500",
                  },
                ].map((tech, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 bg-gradient-to-r ${tech.color} rounded-lg flex items-center justify-center`}
                        >
                          <tech.icon className="w-5 h-5 text-white" />
                        </div>
                        {tech.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tech.technologies.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Architecture Diagram */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>System Architecture</CardTitle>
                  <CardDescription>How Synapse components work together</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                          <Users className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold">User Interface</h4>
                        <p className="text-sm text-muted-foreground">
                          Browser extension and web app capture user interactions
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                          <Brain className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold">AI Engine</h4>
                        <p className="text-sm text-muted-foreground">
                          Machine learning models process behavioral data in real-time
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="font-semibold">Adaptation Layer</h4>
                        <p className="text-sm text-muted-foreground">
                          Content modifications applied instantly based on cognitive state
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact" className="space-y-12">
              <div className="text-center space-y-6 animate-slide-up">
                <h2 className="text-3xl font-bold">Real-World Impact</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  See how Synapse Learning Pro is transforming education and professional development across various
                  fields.
                </p>
              </div>

              {/* Success Stories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle>University Students</CardTitle>
                        <CardDescription>Enhanced academic performance</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Students using Synapse showed significant improvements in comprehension and retention rates.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">35%</div>
                          <div className="text-sm text-blue-700">Better grades</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">50%</div>
                          <div className="text-sm text-green-700">Less study time</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <CardTitle>Professionals</CardTitle>
                        <CardDescription>Accelerated skill development</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Working professionals report faster skill acquisition and better knowledge retention.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">60%</div>
                          <div className="text-sm text-purple-700">Faster learning</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">40%</div>
                          <div className="text-sm text-orange-700">Better focus</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Use Cases */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center">Perfect For</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Students",
                      description: "Improve study efficiency and academic performance",
                      icon: BookOpen,
                      examples: ["Research papers", "Textbook reading", "Online courses", "Exam preparation"],
                    },
                    {
                      title: "Professionals",
                      description: "Accelerate skill development and knowledge acquisition",
                      icon: Award,
                      examples: [
                        "Technical documentation",
                        "Industry reports",
                        "Training materials",
                        "Certification prep",
                      ],
                    },
                    {
                      title: "Researchers",
                      description: "Process complex information more effectively",
                      icon: Brain,
                      examples: ["Academic papers", "Literature reviews", "Data analysis", "Grant writing"],
                    },
                    {
                      title: "Lifelong Learners",
                      description: "Optimize personal learning and development",
                      icon: Lightbulb,
                      examples: ["Online articles", "Educational videos", "Skill tutorials", "Language learning"],
                    },
                  ].map((useCase, index) => (
                    <Card key={index} className="border-0 shadow-lg">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <useCase.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold mb-2">{useCase.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{useCase.description}</p>
                        <ul className="text-xs space-y-1">
                          {useCase.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex} className="text-muted-foreground">
                              • {example}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto text-center animate-slide-up">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners who have already enhanced their cognitive potential with Synapse Learning Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/#pricing">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-blue-600"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">Synapse Learning Pro</span>
            </Link>
            <div className="text-sm text-muted-foreground">© 2024 Synapse Learning Pro. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
