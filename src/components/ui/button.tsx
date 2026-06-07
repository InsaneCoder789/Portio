import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex min-h-[3.55rem] items-center justify-center gap-2 whitespace-nowrap rounded-[1.15rem] border px-6 py-3 text-sm font-bold uppercase tracking-[0.03em] ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-slate-950 bg-slate-950 text-white hover:-translate-y-px hover:bg-slate-900 dark:border-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-slate-950/15 bg-white/75 text-slate-950 hover:-translate-y-px hover:border-slate-950/25 hover:bg-white dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:border-white/40 dark:hover:bg-white/[0.1]",
        secondary:
          "border-slate-950/10 bg-slate-950/[0.04] text-slate-950 hover:-translate-y-px hover:bg-slate-950/[0.08] dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:hover:bg-white/[0.1]",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[3.55rem] px-6 py-3",
        sm: "min-h-[2.85rem] rounded-[0.95rem] px-4 py-2 text-xs",
        lg: "min-h-[4rem] rounded-[1.25rem] px-8 py-4",
        icon: "h-[3.55rem] w-[3.55rem] rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
