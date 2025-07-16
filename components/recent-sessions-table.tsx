"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Clock } from "lucide-react"

interface Session {
  id: string
  date: string
  duration: string
  topic: string
  performance: "Excellent" | "Good" | "Average" | "Poor"
}

interface RecentSessionsTableProps {
  sessions: Session[]
}

export function RecentSessionsTable({ sessions }: RecentSessionsTableProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const getPerformanceBadgeVariant = (performance: Session["performance"]) => {
    switch (performance) {
      case "Excellent":
        return "default"
      case "Good":
        return "secondary"
      case "Average":
        return "outline"
      case "Poor":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="w-full bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Recent Sessions</CardTitle>
          <Clock className="h-6 w-6 text-gray-600" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead className="text-right">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.date}</TableCell>
                  <TableCell>{session.duration}</TableCell>
                  <TableCell>{session.topic}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getPerformanceBadgeVariant(session.performance)}>{session.performance}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  )
}
