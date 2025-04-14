import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { cva, type VariantProps } from "class-variance-authority";

const fabVariants = cva(
  "fixed rounded-full shadow-lg hover:shadow-xl transition-all duration-200",
  {
    variants: {
      position: {
        "bottom-right": "bottom-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
        "top-right": "top-4 right-4",
        "top-left": "top-4 left-4",
      },
      size: {
        default: "p-4",
        sm: "p-2",
        lg: "p-6",
      },
    },
    defaultVariants: {
      position: "bottom-center",
      size: "default",
    },
  }
);

export interface FabProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  asChild?: boolean;
}

const Fab = React.forwardRef<HTMLButtonElement, FabProps>(
  ({ className, position, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        className={cn(fabVariants({ position, size, className }))}
        variant="default"
        size={size}
        ref={ref}
        {...props}
      />
    );
  }
);
Fab.displayName = "Fab";

export { Fab, fabVariants };
