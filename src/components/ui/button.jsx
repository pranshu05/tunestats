import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-green-500 text-white hover:bg-green-600",
                destructive: "bg-red-500 text-white hover:bg-red-600",
                outline: "border border-zinc-800 bg-transparent hover:bg-zinc-800 hover:text-white",
                secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
                ghost: "hover:bg-zinc-800 hover:text-white",
                link: "text-white underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp className={buttonVariants({ variant, size, className })} ref={ref}{...props} />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }