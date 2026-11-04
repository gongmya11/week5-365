import * as React from "react"
import { cn } from "cn"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "bordered"
}

// 1. Root Component
export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-card text-card-foreground border-border/80 shadow-xs",
    muted: "bg-muted/40 text-foreground border-border/60",
    bordered: "bg-transparent border-dashed border-border",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// 2. Sub-components (Compound Components)
function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 p-5 pb-2 sm:p-6 sm:pb-3",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-bold tracking-tight text-foreground sm:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-xs text-muted-foreground sm:text-sm", className)}
      {...props}
    >
      {children}
    </p>
  )
}

function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pt-0 sm:p-6 sm:pt-0", className)} {...props}>
      {children}
    </div>
  )
}

function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-t border-border/60 p-4 sm:p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Gắn các sub-component vào Root theo chuẩn Compound Component Pattern
Card.Header = CardHeader
Card.Title = CardTitle
Card.Description = CardDescription
Card.Content = CardContent
Card.Footer = CardFooter
