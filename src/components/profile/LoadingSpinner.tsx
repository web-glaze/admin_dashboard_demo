"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

type SpinnerSize = "sm" | "md" | "lg"

const sizeMap: Record<SpinnerSize, string> = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
  center?: boolean
}

const LoadingSpinner = ({
  label = "Loading...",
  size = "md",
  fullScreen = false,
  className,
  ...props
}: LoadingSpinnerProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        fullScreen ? "min-h-[40vh]" : "",
        className,
      )}
      {...props}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeMap[size])} aria-hidden="true" />
      {label ? <p className="mt-3 text-sm text-muted-foreground">{label}</p> : <span className="sr-only">Loading</span>}
    </div>
  )
}

export default LoadingSpinner
