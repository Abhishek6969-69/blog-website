import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl focus-visible:ring-indigo-500",
        destructive:
          "bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl focus-visible:ring-red-500",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 shadow-sm hover:shadow-md focus-visible:ring-indigo-500",
        secondary:
          "bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-sm hover:shadow-md focus-visible:ring-gray-500",
        ghost: "hover:bg-gray-100 text-gray-900 focus-visible:ring-indigo-500",
        link: "text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline focus-visible:ring-indigo-500",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
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
