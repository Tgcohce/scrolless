"use client"

import { useState, useEffect } from "react"
import { Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PageTransition from "@/components/layout/page-transition"
import { stakeDOT } from "@/lib/blockchain"
import { useToast } from "@/components/ui/use-toast"
import { ethers } from "ethers"

interface StakePageProps {
  balance?: number
  onStake?: (data: { amount: number; duration: number; limit: number }) => Promise<void>
}

export default function StakePage({ balance: propBalance, onStake }: StakePageProps) {
  const [amount, setAmount] = useState<string>("")
  const [duration, setDuration] = useState<string>("7")
  const [limit, setLimit] = useState<number>(120) // 2 hours in minutes
  const [isLoading, setIsLoading] = useState(false)
  const [potentialReward, setPotentialReward] = useState<number>(0)
  const [balance, setBalance] = useState<number>(propBalance || 0)
  const { toast } = useToast()

  // Get wallet balance if not provided as prop
  useEffect(() => {
    const fetchBalance = async () => {
      if (propBalance === undefined && typeof window !== "undefined" && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const balanceValue = await provider.getBalance(await signer.getAddress())
          setBalance(Number(ethers.formatEther(balanceValue)))
        } catch (error) {
          console.error("Error fetching balance:", error)
        }
      }
    }

    fetchBalance()
  }, [propBalance])

  // Calculate potential rewards (15% APR)
  useEffect(() => {
    const amountNum = Number.parseFloat(amount) || 0
    const durationNum = Number.parseInt(duration) || 7

    // Simple APR calculation: amount * (15% * duration / 365)
    const reward = amountNum * ((0.15 * durationNum) / 365)
    setPotentialReward(reward)
  }, [amount, duration])

  const handleStake = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setIsLoading(true)
    try {
      // Check if wallet is connected
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet connected. Please connect your wallet first.")
      }

      const amountValue = Number.parseFloat(amount)
      const durationValue = Number.parseInt(duration)

      // Use the provided callback or the imported function
      if (onStake) {
        await onStake({
          amount: amountValue,
          duration: durationValue,
          limit,
        })
      } else {
        // Get signer from connected wallet
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()

        await stakeDOT(signer, {
          amount: amountValue,
          duration: durationValue,
          limit,
        })
      }

      // Show success toast
      toast({
        title: "Stake Successful",
        description: `You've staked ${amount} DOT for ${duration} days with a ${formatTime(limit)} daily limit.`,
        duration: 5000,
      })

      // Reset form
      setAmount("")
    } catch (error: any) {
      console.error("Staking failed:", error)

      // Show error toast
      toast({
        title: "Staking Failed",
        description: error.message || "There was an error processing your stake. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <PageTransition>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Stake DOT</h1>

        <div className="mb-6">
          <p className="text-sm text-slate-500 mb-1">Available Balance</p>
          <p className="text-xl font-semibold flex items-center">
            <Coins className="w-5 h-5 text-scrolless-pink mr-1" />
            {balance.toFixed(2)} DOT
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">
              Stake Amount
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Coins className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
              />
            </div>
            {Number(amount) > balance && <p className="text-red-500 text-sm mt-1">Amount exceeds your balance</p>}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-1">
              Stake Duration
            </label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Daily Scroll Limit: {formatTime(limit)}
            </label>
            <Slider value={[limit]} min={30} max={240} step={15} onValueChange={(values) => setLimit(values[0])} />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>30m</span>
              <span>4h</span>
            </div>
          </div>

          <Card className="bg-scrolless-lightCyan border-scrolless-cyan">
            <CardHeader>
              <CardTitle className="text-scrolless-dark">Potential Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-scrolless-dark">15% APR</p>
                  <p className="text-sm text-scrolless-dark">{duration} days</p>
                </div>
                <p className="text-xl font-bold text-scrolless-pink">+{potentialReward.toFixed(4)} DOT</p>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleStake}
            disabled={!amount || Number.parseFloat(amount) <= 0 || Number(amount) > balance || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Staking..." : "Stake Now"}
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
