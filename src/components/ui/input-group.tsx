import * as React from "react"
import { cn } from "@/lib/utils"

interface InputGroupProps {
  children: React.ReactNode
  className?: string
}

export function InputGroup({ children, className }: InputGroupProps) {
  return (
    <div className={cn("relative flex items-center", className)}>
      {children}
    </div>
  )
}

interface InputAddonProps {
  children: React.ReactNode
  position: "left" | "right"
  className?: string
}

export function InputAddon({ children, position, className }: InputAddonProps) {
  return (
    <div
      className={cn(
        "absolute z-10 flex items-center justify-center text-muted-foreground/70",
        position === "left" ? "left-3" : "right-3",
        className
      )}
    >
      {children}
    </div>
  )
}
