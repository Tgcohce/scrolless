"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageTransition from "@/components/layout/page-transition"
import { useActiveChallenge } from "@/lib/hooks"

interface DashboardPageProps {
  challenge?: {
    scrollUsage: number
    scrollLimit: number
    streak: number
    daysLeft: number
    progress: number
  }
}

export default function DashboardPage({ challenge }: DashboardPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Use the hook if no props are provided
  const { data: challengeData } = useActiveChallenge()

  // Use provided props or data from hook
  const activeChallenge = challenge ||
    challengeData || {
      scrollUsage: 45,
      scrollLimit: 120,
      streak: 5,
      daysLeft: 25,
      progress: 16.7,
    }

  const { scrollUsage, scrollLimit, streak, daysLeft, progress } = activeChallenge

  const handleSubmitProof = () => {
    setIsLoading(true)
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
      router.push("/proof")
    }, 500)
  }

  return (
    <PageTransition>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Today's Scroll Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={scrollUsage}
              max={scrollLimit}
              label="Screen Time"
              showValue
              indicatorClassName={scrollUsage > scrollLimit ? "bg-red-500" : ""}
            />
            <p className="mt-2 text-sm text-slate-600 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-scrolless-cyan" />
              {Math.floor(scrollUsage / 60)}h {scrollUsage % 60}m / {Math.floor(scrollLimit / 60)}h {scrollLimit % 60}m
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Streak</p>
                <div className="flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-scrolless-pink mr-1" />
                  <span className="text-2xl font-bold">{streak} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-1">Days Left</p>
                <div className="flex items-center justify-center">
                  <Clock className="w-5 h-5 text-scrolless-pink mr-1" />
                  <span className="text-2xl font-bold">{daysLeft}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Challenge Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} label="Completion" showValue />
            <div className="flex items-center mt-2">
              <Trophy className="w-5 h-5 text-scrolless-red mr-1" />
              <p className="text-sm text-slate-600">Keep going! You're doing great.</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button onClick={handleSubmitProof} className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Loading..." : "Submit Today's Proof"}
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => router.push("/rewards")}>
              View Rewards
            </Button>
            <Button variant="outline" onClick={() => router.push("/rewards?tab=badges")}>
              View Badges
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
