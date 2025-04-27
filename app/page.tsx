"use client"

import { motion } from "framer-motion"
import { PhoneOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageTransition from "@/components/layout/page-transition"
import { useRouter } from "next/navigation"

export default function WelcomePage() {
  const router = useRouter()

  return (
    <PageTransition>
      <div className="flex flex-col items-center justify-center min-h-[90vh] px-4 text-center">
        <div className="relative mb-8">
          <motion.div
            className="absolute inset-0 rounded-full bg-scrolless-cyan breathing-circle -z-10"
            initial={{ scale: 0.9, opacity: 0.7 }}
          />
          <div className="bg-white rounded-full p-6 shadow-lg">
            <PhoneOff className="w-16 h-16 text-scrolless-pink" />
          </div>
        </div>

        <motion.h1
          className="text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Scrolless
        </motion.h1>

        <motion.p
          className="text-xl text-slate-600 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Stake DOT. Scroll Less. Earn More.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Button size="lg" onClick={() => router.push("/stake")}>
            Get Started
          </Button>
        </motion.div>
      </div>
    </PageTransition>
  )
}
