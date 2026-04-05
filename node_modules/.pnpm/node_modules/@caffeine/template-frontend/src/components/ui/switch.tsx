"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Larger, more clickable, clear border and color
        "peer relative inline-flex h-6 w-12 items-center rounded-full border-2 border-gray-300 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand-pink/40 focus-visible:border-brand-pink bg-gray-200 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#F1267A] data-[state=checked]:to-[#9B59B6] data-[state=checked]:border-brand-pink data-[state=unchecked]:bg-gray-200 data-[state=unchecked]:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // Thumb is bigger, white, with shadow and clear movement
          "block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-0 border border-gray-300",
        )}
      />
      {/* Visual check/cross icons for clarity */}
      <span className="absolute left-1 text-xs text-gray-400 select-none pointer-events-none" aria-hidden="true">✗</span>
      <span className="absolute right-1 text-xs text-white select-none pointer-events-none" aria-hidden="true">✓</span>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
