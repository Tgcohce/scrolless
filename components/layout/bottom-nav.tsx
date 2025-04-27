"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Wallet, LayoutDashboard, Upload, Gift } from "lucide-react"

const navItems = [
  { name: "Welcome", href: "/", icon: Home },
  { name: "Stake", href: "/stake", icon: Wallet },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Proof", href: "/proof", icon: Upload },
  { name: "Rewards", href: "/rewards", icon: Gift },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto">
        <ul className="flex justify-between px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <li key={item.name} className="relative">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center pt-2 pb-1 px-3 ${
                    isActive ? "text-scrolless-pink" : "text-slate-500"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -top-1 left-0 right-0 mx-auto w-12 h-1 bg-scrolless-pink rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon className="w-6 h-6" />
                  <span className="text-xs mt-1">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
