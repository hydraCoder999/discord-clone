"use client";

import { Plus } from "lucide-react";
import ActionToolTip from "../action-tooltip";
import { useModal } from "@/hooks/use-model-provider";

export const NavigationActions = () => {
  const { onOpen } = useModal();
  return (
    <>
      <ActionToolTip label="Create a New Server" side="right" align="center">
        <button
          onClick={() => onOpen("createServer", {})}
          className="group flex items-center"
        >
          <div className="flex items-center justify-center mx-3 h-[49px] w-[49px] rounded-[24px] group-hover:rounded-[16px]  transition-all  bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition-all  text-emerald-500"
              size={30}
            />
          </div>
        </button>
      </ActionToolTip>
    </>
  );
};
