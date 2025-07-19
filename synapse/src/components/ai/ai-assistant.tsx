"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert, // Ensure Alert is imported
} from "@mui/material"
import {
  AutoAwesome,
  Send,
  ExpandMore,
  Psychology,
  QuestionAnswer,
  Summarize,
  Route,
  School,
} from "@mui/icons-material"
import { GrokClient } from "@/lib/grok-client"
import { useSession } from "next-auth/react"

interface AIResponse {
  type: "recommendation" | "summary" | "answer" | "path" | "lesson"
  data: any
  timestamp: Date
}

export function AIAssistant() {
  const { data: session } = useSession()
  const [question, setQuestion] = useState("")
  const [responses, setResponses] = useState<AIResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [isTeachingMode, setIsTeachingMode] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null) // New state for API errors
  const [aiClient] = useState<GrokClient>(() => new GrokClient())

  const handleAskQuestion = async () => {
    if (!question.trim()) return

    setLoading(true)
    setApiError(null) // Clear previous errors
    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "question",
          data: {
            question: question,
            context: "Current learning context", // This would come from actual context
            userKnowledge: ["JavaScript", "React", "Web Development"], // This would come from user profile
            isTeachingMode: isTeachingMode,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get AI response.")
      }

      const data = await response.json()

      setResponses((prev) => [
        ...prev,
        {
          type: isTeachingMode ? "lesson" : "answer",
          data: data,
          timestamp: new Date(),
        },
      ])

      setQuestion("")
    } catch (error: any) {
      console.error("Error asking question:", error)
      setApiError(error.message || "An unexpected error occurred while asking the AI.")
      setResponses((prev) => [
        ...prev,
        {
          type: "answer",
          data: { answer: "Sorry, I couldn't process that request.", confidence: 0 },
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const generateRecommendations = async () => {
    setLoading(true)
    setApiError(null) // Clear previous errors
    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "recommendation",
          data: {
            // These would be dynamically fetched from user's cognitive state and knowledge
            cognitiveState: "focused",
            learningHistory: ["JavaScript basics", "React components"],
            currentTopic: "React Hooks",
            knowledgeGaps: ["State management", "Performance optimization"],
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get recommendations.")
      }
      const data = await response.json()

      setResponses((prev) => [
        ...prev,
        {
          type: "recommendation",
          data: data,
          timestamp: new Date(),
        },
      ])
    } catch (error: any) {
      console.error("Error generating recommendations:", error)
      setApiError(error.message || "An unexpected error occurred while generating recommendations.")
    } finally {
      setLoading(false)
    }
  }

  const generateSummary = async () => {
    setLoading(true)
    setApiError(null) // Clear previous errors
    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          data: {
            content:
              "Sample content to summarize: Artificial Intelligence (AI) is rapidly transforming various industries. Machine learning, a subset of AI, enables systems to learn from data without explicit programming. Deep learning, a further specialization, uses neural networks with many layers to model complex patterns. These technologies are driving innovations in healthcare, finance, and autonomous systems.",
            cognitiveState: "focused",
            complexity: "moderate",
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get summary.")
      }
      const data = await response.json()

      setResponses((prev) => [
        ...prev,
        {
          type: "summary",
          data: data,
          timestamp: new Date(),
        },
      ])
    } catch (error: any) {
      console.error("Error generating summary:", error)
      setApiError(error.message || "An unexpected error occurred while generating the summary.")
    } finally {
      setLoading(false)
    }
  }

  const generateLearningPath = async () => {
    setLoading(true)
    setApiError(null) // Clear previous errors
    try {
      const response = await fetch("/api/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "path",
          data: {
            currentKnowledge: ["JavaScript", "HTML", "CSS"],
            learningGoals: ["Master React", "Learn Node.js"],
            timeAvailable: 20, // 20 hours available
            cognitiveState: "focused",
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get learning path.")
      }
      const data = await response.json()

      setResponses((prev) => [
        ...prev,
        {
          type: "path",
          data: data,
          timestamp: new Date(),
        },
      ])
    } catch (error: any) {
      console.error("Error generating learning path:", error)
      setApiError(error.message || "An unexpected error occurred while generating the learning path.")
    } finally {
      setLoading(false)
    }
  }

  const renderResponse = (response: AIResponse) => {
    switch (response.type) {
      case "answer":
        return (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <QuestionAnswer sx={{ mr: 1 }} color="primary" />
              AI Answer
            </Typography>
            <Typography variant="body1" paragraph>
              {response.data.answer}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Confidence: {Math.round(response.data.confidence * 100)}%
              </Typography>
            </Box>
            {response.data.relatedConcepts?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Related Concepts:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {response.data.relatedConcepts.map((concept: string, index: number) => (
                    <Chip key={index} label={concept} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            )}
            {response.data.followUpQuestions?.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Follow-up Questions:
                </Typography>
                <List dense>
                  {response.data.followUpQuestions.map((q: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={q} primaryTypographyProps={{ component: "div" }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        )

      case "lesson":
        return (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <School sx={{ mr: 1 }} color="secondary" />
              AI Teacher: Step-by-Step Lesson
            </Typography>
            <Typography variant="body1" paragraph>
              {response.data.answer}
            </Typography>
            {response.data.steps?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Steps:
                </Typography>
                <List dense>
                  {response.data.steps.map((step: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${index + 1}. ${step}`} primaryTypographyProps={{ component: "div" }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
            {response.data.followUpQuestions?.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Next Steps / Questions:
                </Typography>
                <List dense>
                  {response.data.followUpQuestions.map((q: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={q} primaryTypographyProps={{ component: "div" }} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        )

      case "recommendation":
        return (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Psychology sx={{ mr: 1 }} color="info" />
              Personalized Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {response.data.reasoning}
            </Typography>
            <List>
              {response.data.recommendations.map((rec: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={rec} primaryTypographyProps={{ component: "div" }} />
                </ListItem>
              ))}
            </List>
            {response.data.adaptedContent && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Content Adaptation:</Typography>
                <Typography variant="body2">{response.data.adaptedContent}</Typography>
              </Alert>
            )}
          </Paper>
        )

      case "summary":
        return (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Summarize sx={{ mr: 1 }} color="success" />
              Content Summary
            </Typography>
            <Typography variant="body1" paragraph>
              {response.data.summary}
            </Typography>
            <Accordion sx={{ boxShadow: "none", "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">Key Points</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {response.data.keyPoints.map((point: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={point} primaryTypographyProps={{ component: "div" }} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion sx={{ boxShadow: "none", "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">Understanding Check</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {response.data.questions.map((q: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={q} primaryTypographyProps={{ component: "div" }} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        )

      case "path":
        return (
          <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Route sx={{ mr: 1 }} color="warning" />
              Learning Path
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {response.data.reasoning}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Total Duration: {response.data.totalDuration} hours
            </Typography>
            {response.data.path.map((step: any, index: number) => (
              <Accordion key={index} sx={{ boxShadow: "none", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="subtitle1">{step.topic}</Typography>
                    <Chip label={step.difficulty} size="small" />
                    <Typography variant="caption">{step.duration}h</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {step.prerequisites.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Prerequisites:</Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {step.prerequisites.map((prereq: string, i: number) => (
                          <Chip key={i} label={prereq} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                  <Typography variant="subtitle2">Resources:</Typography>
                  <List dense>
                    {step.resources.map((resource: string, i: number) => (
                      <ListItem key={i}>
                        <ListItemText primary={resource} primaryTypographyProps={{ component: "div" }} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <AutoAwesome />
          AI Learning Assistant
        </Typography>

        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}

        {/* Quick Actions */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={generateRecommendations}
            disabled={loading}
            startIcon={<Psychology />}
          >
            Get Recommendations
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={generateSummary}
            disabled={loading}
            startIcon={<Summarize />}
          >
            Summarize Content
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={generateLearningPath}
            disabled={loading}
            startIcon={<Route />}
          >
            Create Learning Path
          </Button>
          <Button
            variant={isTeachingMode ? "contained" : "outlined"}
            size="small"
            onClick={() => setIsTeachingMode(!isTeachingMode)}
            disabled={loading}
            startIcon={<School />}
            color={isTeachingMode ? "secondary" : "primary"}
          >
            {isTeachingMode ? "Exit Teacher Mode" : "Enter Teacher Mode"}
          </Button>
        </Box>

        {/* Chat Interface */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={isTeachingMode ? "Ask me to teach you something..." : "Ask me anything about your learning..."}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
          >
            Ask
          </Button>
        </Box>

        {/* Responses */}
        <Box sx={{ maxHeight: 600, overflowY: "auto" }}>
          {responses.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center", bgcolor: "grey.50" }}>
              <AutoAwesome sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                Ask me questions or use the quick actions above to get AI-powered learning assistance!
              </Typography>
            </Paper>
          ) : (
            responses.map((response, index) => <Box key={index}>{renderResponse(response)}</Box>)
          )}
        </Box>
      </CardContent>
    </Card>
  )
}
