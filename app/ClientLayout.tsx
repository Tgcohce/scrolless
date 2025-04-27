"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import BottomNav from "@/components/layout/bottom-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
// Use the updated blockchain.ts file
import { getBalance } from "@/lib/blockchain"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

interface ClientLayoutProps {
  children: React.ReactNode
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState<string | null>("Connecting to wallet...")
  const [error, setError] = useState<string | null>(null)

  // Mock connect wallet function (replace with actual implementation)
  const connectWallet = useCallback(async () => {
    setLoading("Connecting to wallet...")
    setError(null) // Clear any previous errors
    try {
      // Simulate connecting to a wallet (e.g., MetaMask)
      // In a real app, you'd use a library like ethers.js or web3.js
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate async

      // For this example, let's just set a mock address:
      const mockAddress = "0x1234567890abcdef"
      setUserAddress(mockAddress)

      // Get the signer.  In a real application this would come from the
      // connected wallet.  We'll use a mock signer for this example.
      const mockSigner = {
        getAddress: async () => mockAddress,
        provider: {
          getBalance: async (address: string) => {
            // Return a mock balance.  In a real application, this would
            // come from the blockchain.
            console.log("Getting balance for address:", address)
            return BigInt(1000000000000000000) // 1 DOT (1e18 Wei)
          },
        },
      } as any

      // Fetch initial data (balance)
      const fetchedBalance = await getBalance(mockSigner)
      setBalance(fetchedBalance)
      setLoading(null)
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet.")
      setLoading(null)
      setUserAddress(null) // Reset user address on error
      setBalance(null)
    }
  }, [])

  useEffect(() => {
    // Check if wallet is already connected on mount (optional)
    // In a real app, you might check if MetaMask is already connected
    // For this example, we won't auto-connect.  The user must click the button.
    // If you want auto-connect, you'd call connectWallet() here.
    setLoading(null) // Don't show loading on initial load, unless you auto-connect
  }, [connectWallet])

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
              "bg-gradient-to-r from-purple-500 to-blue-500 text-white",
              "hover:from-purple-600 hover:to-blue-600",
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

export default ClientLayout
