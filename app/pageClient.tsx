"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

interface PageClientProps {
  children: React.ReactNode
}

const PageClient = ({ children }: PageClientProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white text-slate-900 flex flex-col min-h-screen`}>{children}</body>
    </html>
  )
}

export default PageClient
