import * as React from "react";
import { cn } from "@/lib/utils";

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   // return (
//   //   <input
//   //     type={type}
//   //     data-slot="input"
//   //     className={cn(
//   //       "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//   //       "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//   //       "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//   //       className
//   //     )}
//   //     {...props}
//   //   />
//   // )

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "ghost" | "filled";
  inputSize?: "sm" | "md" | "lg";
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, variant = "default", inputSize = "md", error, ...props },
    ref
  ) => {
    const baseStyles =
      "w-full font-medium transition-all duration-200 ease-in-out placeholder:text-muted-foreground/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
      default:
        "bg-background border border-border hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20",
      ghost:
        "bg-transparent border-0 border-b-2 border-border hover:border-border/80 focus:border-primary rounded-none px-0",
      filled:
        "bg-muted/50 border border-transparent hover:bg-muted/70 focus:bg-background focus:border-primary focus:ring-2 focus:ring-primary/20",
    };

    const sizes = {
      sm: "h-8 px-3 py-1 text-sm rounded-md",
      md: "h-10 px-3 py-2 text-sm rounded-md",
      lg: "h-12 px-4 py-3 text-base rounded-lg",
    };

    const errorStyles = error
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "";

    return (
      <input
        type={type}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[inputSize],
          errorStyles,
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
