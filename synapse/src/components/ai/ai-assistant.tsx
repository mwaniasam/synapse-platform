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
  Alert,
} from "@mui/material"
import { AutoAwesome, Send, ExpandMore, Psychology, QuestionAnswer, Summarize, Route } from "@mui/icons-material"
import { GeminiClient } from "@/lib/gemini-client"

interface AIResponse {
  type: "recommendation" | "summary" | "answer" | "path"
  data: any
  timestamp: Date
}

export function AIAssistant() {
  const [question, setQuestion] = useState("")
  const [responses, setResponses] = useState<AIResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"chat" | "recommendations" | "summary" | "path">("chat")

  const geminiClient = new GeminiClient()

  const handleAskQuestion = async () => {
    if (!question.trim()) return

    setLoading(true)
    try {
      const response = await geminiClient.answerQuestion(
        question,
        "Current learning context", // This would come from actual context
        ["JavaScript", "React", "Web Development"], // This would come from user profile
      )

      setResponses((prev) => [
        ...prev,
        {
          type: "answer",
          data: response,
          timestamp: new Date(),
        },
      ])

      setQuestion("")
    } catch (error) {
      console.error("Error asking question:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      const recommendations = await geminiClient.generatePersonalizedRecommendations({
        cognitiveState: "focused", // This would come from cognitive detection
        learningHistory: ["JavaScript basics", "React components"],
        currentTopic: "React Hooks",
        knowledgeGaps: ["State management", "Performance optimization"],
      })

      setResponses((prev) => [
        ...prev,
        {
          type: "recommendation",
          data: recommendations,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error generating recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSummary = async () => {
    setLoading(true)
    try {
      const summary = await geminiClient.summarizeContent(
        "Sample content to summarize", // This would come from current page content
        "focused", // Current cognitive state
        "moderate",
      )

      setResponses((prev) => [
        ...prev,
        {
          type: "summary",
          data: summary,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error generating summary:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateLearningPath = async () => {
    setLoading(true)
    try {
      const path = await geminiClient.generateLearningPath(
        ["JavaScript", "HTML", "CSS"],
        ["Master React", "Learn Node.js"],
        20, // 20 hours available
        "focused",
      )

      setResponses((prev) => [
        ...prev,
        {
          type: "path",
          data: path,
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error generating learning path:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderResponse = (response: AIResponse) => {
    switch (response.type) {
      case "answer":
        return (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <QuestionAnswer sx={{ mr: 1 }} />
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
            {response.data.relatedConcepts.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Related Concepts:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {response.data.relatedConcepts.map((concept: string, index: number) => (
                    <Chip key={index} label={concept} size="small" />
                  ))}
                </Box>
              </Box>
            )}
            {response.data.followUpQuestions.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Follow-up Questions:
                </Typography>
                <List dense>
                  {response.data.followUpQuestions.map((q: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={q} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        )

      case "recommendation":
        return (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Psychology sx={{ mr: 1 }} />
              Personalized Recommendations
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {response.data.reasoning}
            </Typography>
            <List>
              {response.data.recommendations.map((rec: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={rec} />
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
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Summarize sx={{ mr: 1 }} />
              Content Summary
            </Typography>
            <Typography variant="body1" paragraph>
              {response.data.summary}
            </Typography>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">Key Points</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {response.data.keyPoints.map((point: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={point} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle2">Understanding Check</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {response.data.questions.map((q: string, index: number) => (
                    <ListItem key={index}>
                      <ListItemText primary={q} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        )

      case "path":
        return (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              <Route sx={{ mr: 1 }} />
              Learning Path
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {response.data.reasoning}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
              Total Duration: {response.data.totalDuration} hours
            </Typography>
            {response.data.path.map((step: any, index: number) => (
              <Accordion key={index}>
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
                        <ListItemText primary={resource} />
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
        </Box>

        {/* Chat Interface */}
        <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask me anything about your learning..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
            disabled={loading}
          />
          <Button
            variant="contained"
            onClick={handleAskQuestion}
            disabled={loading || !question.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
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
