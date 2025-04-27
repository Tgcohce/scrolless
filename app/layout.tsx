import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./client-layout"
import { Toaster } from "@/components/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scrolless",
  description: "Stake DOT. Scroll Less. Earn More.",
  manifest: "/manifest.json",
  themeColor: "#3b82f6",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Scrolless",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-slate-900 flex flex-col min-h-screen`}>
        <ClientLayout>{children}</ClientLayout>
        <Toaster />
      </body>
    </html>
  )
}
