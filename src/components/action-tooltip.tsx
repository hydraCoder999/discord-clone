"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import React from "react";

interface ActionToolTipProps {
  label: string;
  side?: "top" | "left" | "bottom" | "right";
  align?: "center" | "start" | "end";
  children: React.ReactNode;
}

export default function ActionToolTip({
  label,
  side,
  align,
  children,
}: ActionToolTipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="text-sm text-primary  font-semibold capitalize  bg-zinc-300 dark:bg-[#000] p-2">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
