import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Counter = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ ...props }, ref) => {
  return (
    <Input
      {...props}
      ref={ref || null}
      type="number"
      className={cn("text-center", props.className || "w-16")}
    />
  );
});

Counter.displayName = "Counter";
