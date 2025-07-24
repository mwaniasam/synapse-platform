import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Brain, 
  Timer, 
  BookOpen, 
  TrendingUp, 
  Zap, 
  Target,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Rocket
} from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Cognitive Detection",
      description: "AI-powered analysis of your learning patterns and cognitive load to optimize study sessions."
    },
    {
      icon: <Timer className="h-8 w-8" />,
      title: "Smart Pomodoro",
      description: "Adaptive timer that adjusts based on your focus levels and learning performance."
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Curated Resources",
      description: "Access thousands of educational materials tailored to your learning level and goals."
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Progress Tracking",
      description: "Comprehensive analytics and insights into your learning journey and achievements."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Adaptive Content",
      description: "Content difficulty automatically adjusts based on your comprehension and performance."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Knowledge Mapping",
      description: "Visual representation of your knowledge connections and learning pathways."
    }
  ]

  const benefits = [
    "Personalized learning experience",
    "Improved focus and productivity", 
    "Data-driven insights",
    "Adaptive difficulty levels",
    "Progress visualization",
    "Cognitive load optimization"
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl floating-animation" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-12 relative z-10">
            <Badge variant="outline" className="mb-6 px-4 py-2 text-sm font-medium border-primary/20 bg-primary/5">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Learning Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold gradient-text leading-tight tracking-tight">
              Adaptive Learning with
              <br />
              Cognitive Intelligence
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light">
              Synapse Platform revolutionizes education with AI-powered cognitive detection, 
              personalized content delivery, and intelligent productivity tools that adapt to your unique learning style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button size="lg" className="px-10 py-6 text-lg font-semibold rounded-2xl glow-effect hover:scale-105 transition-all duration-300" asChild>
                <Link href="/auth/signup">
                  <Rocket className="mr-3 h-5 w-5" />
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-10 py-6 text-lg font-semibold rounded-2xl border-2 hover:scale-105 transition-all duration-300" asChild>
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Intelligent Features for Modern Learning
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light">
              Our platform combines cutting-edge AI with proven learning methodologies 
              to create the most effective educational experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-3 group">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-4 bg-gradient-to-r from-primary/5 to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
                  Why Choose Synapse Platform?
                </h2>
                <p className="text-xl text-muted-foreground mb-10 font-light">
                  Experience the future of education with our scientifically-backed approach 
                  to personalized learning and cognitive optimization.
                </p>
              </div>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-lg font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="mt-12 px-10 py-6 text-lg font-semibold rounded-2xl glow-effect hover:scale-105 transition-all duration-300" asChild>
                <Link href="/auth/signup">
                  <Rocket className="mr-3 h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] glass-card rounded-3xl border-2 border-dashed border-primary/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10"></div>
                <div className="text-center space-y-4">
                  <Brain className="h-20 w-20 text-primary mx-auto floating-animation" />
                  <p className="text-muted-foreground text-lg font-medium">Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 bg-gradient-to-r from-primary via-primary to-accent text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto max-w-5xl text-center space-y-12 relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold">
            Transform Your Learning Journey Today
          </h2>
          <p className="text-2xl opacity-90 max-w-3xl mx-auto font-light">
            Join thousands of learners who have already discovered the power of 
            adaptive learning with cognitive intelligence.
          </p>
          <Button size="lg" variant="secondary" className="px-12 py-6 text-xl font-semibold rounded-2xl hover:scale-105 transition-all duration-300" asChild>
            <Link href="/auth/signup">
              <Rocket className="mr-3 h-6 w-6" />
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-border/50 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-10 w-10 text-primary" />
              <span className="font-bold text-2xl gradient-text">Synapse Platform</span>
            </div>
            <p className="text-muted-foreground">
              © 2025 Synapse Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}