"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import BottomNav from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Mock connect wallet function (replace with actual implementation)
  const connectWallet = useCallback(async () => {
    setLoading("Connecting to wallet...")
    setError(null) // Clear any previous errors
    try {
      // Simulate connecting to a wallet
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock data
      setUserAddress("0x1234...5678")
      setBalance(100)
      setLoading(null)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.")
      setLoading(null)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <header className="py-4 px-6 border-b border-gray-200 flex justify-between items-center max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900">Scrolless</h1>
        {userAddress ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 truncate max-w-[150px]">{userAddress}</span>
            {balance !== null && <span className="text-sm text-gray-700">Balance: {balance} DOT</span>}
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            className={cn(
              "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
              "hover:from-blue-600 hover:to-blue-700",
            )}
            disabled={!!loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {loading}
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </>
            )}
          </Button>
        )}
      </header>
      <main className="flex-1 pb-16 max-w-md mx-auto w-full">
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
        {children}
      </main>
      <BottomNav />
    </ThemeProvider>
  )
}
