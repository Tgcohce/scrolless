"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Award, Calendar, Gift } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageTransition from "@/components/layout/page-transition"
import { useQuery } from "@/lib/hooks"

interface Reward {
  id: string
  name: string
  image: string
  date: string
  type: "token" | "nft" | "badge"
}

interface RewardsPageProps {
  rewards?: Reward[]
}

export default function RewardsPage({ rewards: propRewards }: RewardsPageProps) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>("rewards")

  // Use the hook if no props are provided
  const { data: queryRewards } = useQuery<Reward[]>("rewards")

  // Use provided props or data from hook
  const rewards = propRewards ||
    queryRewards || [
      {
        id: "1",
        name: "Weekly Reward",
        image: "/digital-token-network.png",
        date: "2023-04-20",
        type: "token",
      },
      {
        id: "2",
        name: "Consistency Badge",
        image: "/metallic-badge-with-star.png",
        date: "2023-04-15",
        type: "badge",
      },
      {
        id: "3",
        name: "Digital Detox NFT",
        image: "/abstract-nft-concept.png",
        date: "2023-04-10",
        type: "nft",
      },
      {
        id: "4",
        name: "Milestone Achievement",
        image: "/metallic-badge-with-star.png",
        date: "2023-04-05",
        type: "badge",
      },
    ]

  // Set active tab from URL params if available
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "badges") {
      setActiveTab("badges")
    }
  }, [searchParams])

  const tokens = rewards.filter((reward) => reward.type === "token" || reward.type === "nft")
  const badges = rewards.filter((reward) => reward.type === "badge")

  return (
    <PageTransition>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Rewards & Badges</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rewards" className="flex items-center">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center">
              <Award className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rewards" className="mt-4">
            {tokens.length > 0 ? (
              <div className="space-y-4">
                {tokens.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Gift} title="No Rewards Yet" description="Complete your challenges to earn rewards." />
            )}
          </TabsContent>

          <TabsContent value="badges" className="mt-4">
            {badges.length > 0 ? (
              <div className="space-y-4">
                {badges.map((badge) => (
                  <RewardCard key={badge.id} reward={badge} />
                ))}
              </div>
            ) : (
              <EmptyState icon={Award} title="No Badges Yet" description="Earn badges by achieving milestones." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  )
}

interface RewardCardProps {
  reward: Reward
}

function RewardCard({ reward }: RewardCardProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center">
        <img
          src={reward.image || "/placeholder.svg"}
          alt={reward.name}
          className="w-16 h-16 rounded-lg object-cover mr-4"
        />
        <div>
          <h3 className="font-medium">{reward.name}</h3>
          <p className="text-sm text-slate-500 flex items-center mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(reward.date).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-8">
      <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-medium mb-1">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  )
}
