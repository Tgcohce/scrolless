"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import BottomNav from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Wallet, Loader2, AlertTriangle, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { getBalance } from "@/lib/blockchain"
import { truncateAddress } from "@/lib/utils"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [userAddress, setUserAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const { toast } = useToast()

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Check if ethereum object exists (MetaMask or other wallet)
        if (typeof window !== "undefined" && window.ethereum) {
          // Get the provider
          const ethersProvider = new ethers.BrowserProvider(window.ethereum)
          setProvider(ethersProvider)

          // Check if already connected by getting accounts
          const accounts = await ethersProvider.listAccounts()

          if (accounts.length > 0) {
            const currentSigner = await ethersProvider.getSigner()
            setSigner(currentSigner)

            const address = await currentSigner.getAddress()
            setUserAddress(address)

            // Get balance
            const balanceValue = await getBalance(currentSigner)
            setBalance(balanceValue)

            toast({
              title: "Wallet Connected",
              description: `Connected to ${truncateAddress(address)}`,
              duration: 3000,
            })
          }
        }
      } catch (err: any) {
        console.error("Error checking wallet connection:", err)
        // Don't show error on initial load
      }
    }

    checkConnection()
  }, [toast])

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setUserAddress(null)
          setSigner(null)
          setBalance(null)
          toast({
            title: "Wallet Disconnected",
            description: "Your wallet has been disconnected",
            variant: "destructive",
          })
        } else {
          // Account changed
          try {
            if (provider) {
              const newSigner = await provider.getSigner()
              setSigner(newSigner)

              const address = await newSigner.getAddress()
              setUserAddress(address)

              // Get balance
              const balanceValue = await getBalance(newSigner)
              setBalance(balanceValue)

              toast({
                title: "Account Changed",
                description: `Connected to ${truncateAddress(address)}`,
              })
            }
          } catch (err) {
            console.error("Error handling account change:", err)
          }
        }
      }

      const handleChainChanged = () => {
        // Reload the page when the chain changes
        window.location.reload()
      }

      // Subscribe to events
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // Cleanup
      return () => {
        if (window.ethereum.removeListener) {
          window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
          window.ethereum.removeListener("chainChanged", handleChainChanged)
        }
      }
    }
  }, [provider, toast])

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    setLoading("Connecting to wallet...")
    setError(null)

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask or another compatible wallet.")
      }

      // Create provider
      const ethersProvider = new ethers.BrowserProvider(window.ethereum)
      setProvider(ethersProvider)

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Get signer
      const walletSigner = await ethersProvider.getSigner()
      setSigner(walletSigner)

      // Get address
      const address = await walletSigner.getAddress()
      setUserAddress(address)

      // Get balance
      const balanceValue = await getBalance(walletSigner)
      setBalance(balanceValue)

      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${truncateAddress(address)}`,
      })

      setLoading(null)
    } catch (err: any) {
      console.error("Wallet connection error:", err)

      // Handle specific errors
      if (err.code === 4001) {
        // User rejected the connection request
        setError("Connection request was rejected. Please try again.")
      } else if (err.code === -32002) {
        // Request already pending
        setError("A connection request is already pending. Please check your wallet.")
      } else {
        setError(err.message || "Failed to connect wallet. Please try again.")
      }

      setLoading(null)
    }
  }, [toast])

  // Function to open MetaMask installation page
  const installMetaMask = () => {
    window.open("https://metamask.io/download/", "_blank")
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
      <header className="py-4 px-6 border-b border-gray-200 flex justify-between items-center max-w-md mx-auto w-full">
        <h1 className="text-2xl font-bold text-gray-900">Scrolless</h1>
        {userAddress ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700 truncate max-w-[150px]">{truncateAddress(userAddress)}</span>
            {balance !== null && <span className="text-sm font-medium text-gray-700">{balance.toFixed(2)} DOT</span>}
          </div>
        ) : (
          <Button
            onClick={connectWallet}
            className={cn(
              "bg-gradient-to-r from-scrolless-pink to-scrolless-cyan text-white",
              "hover:from-scrolless-pink hover:to-scrolless-lightCyan",
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
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="flex flex-col">
                <span>{error}</span>
                {error.includes("No Ethereum wallet found") && (
                  <Button variant="outline" size="sm" className="mt-2 self-start" onClick={installMetaMask}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Install MetaMask
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}
        {!userAddress && !error && typeof window !== "undefined" && !window.ethereum && (
          <div className="p-4">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">Wallet Required</AlertTitle>
              <AlertDescription className="text-amber-600">
                <p className="mb-2">You need a blockchain wallet to use Scrolless. We recommend MetaMask.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  onClick={installMetaMask}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Install MetaMask
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}
        {children}
      </main>
      <BottomNav />
    </ThemeProvider>
  )
}
