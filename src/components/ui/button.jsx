import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-base font-semibold transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-primary/50 dark:focus-visible:ring-primary/70 aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/50 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-md hover:bg-primary-hover dark:bg-primary-dark dark:hover:bg-primary-dark-hover",
        destructive:
          "bg-destructive text-white shadow-md hover:bg-destructive-hover focus-visible:ring-destructive/30 dark:focus-visible:ring-destructive/60 dark:bg-destructive-dark dark:hover:bg-destructive-dark-hover",
        outline:
          "border border-gray-300 bg-transparent shadow-sm hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover dark:bg-secondary-dark dark:hover:bg-secondary-dark-hover",
        ghost:
          "bg-transparent hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-white",
        link:
          "text-primary underline-offset-4 hover:underline font-medium bg-transparent p-0",
      },
      size: {
        default: "h-11 px-5 has-[>svg]:px-4",
        sm: "h-9 rounded-md gap-1 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-lg px-7 has-[>svg]:px-5",
        icon: "w-10 h-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants };

