import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return <div className={cn("bg-white rounded-2xl shadow-md p-4 border border-slate-100", className)}>{children}</div>
}

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("mb-2", className)}>{children}</div>
}

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export function CardTitle({ children, className }: CardTitleProps) {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>
}

interface CardDescriptionProps {
  children: ReactNode
  className?: string
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
}

interface CardContentProps {
  children: ReactNode
  className?: string
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn("", className)}>{children}</div>
}

interface CardFooterProps {
  children: ReactNode
  className?: string
}

export function CardFooter({ children, className }: CardFooterProps) {
  return <div className={cn("mt-4", className)}>{children}</div>
}
