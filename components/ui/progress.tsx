"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface ProgressProps {
  value: number
  max?: number
  className?: string
  indicatorClassName?: string
  label?: string
  showValue?: boolean
}

export function Progress({ value, max = 100, className, indicatorClassName, label, showValue = false }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          {showValue && <span className="text-sm font-medium text-slate-700">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn("h-2 w-full bg-slate-200 rounded-full overflow-hidden", className)}>
        <motion.div
          className={cn("h-full bg-scrolless-pink rounded-full", indicatorClassName)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
