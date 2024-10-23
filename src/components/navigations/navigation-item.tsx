"use client";

import { cn } from "@/lib/utils";
import ActionToolTip from "../action-tooltip";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

interface NavigationItemProps {
  id: string;
  name: string;
  imageUrl: string;
}
export const NavigationItem = ({ id, name, imageUrl }: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/server/${id}`);
  };
  return (
    <ActionToolTip label={name} side="right" align="center">
      <button
        onClick={handleClick}
        className="group relative flex items-ceneter"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-full transition-all w-[4px]",
            params?.serverid !== id && "group-hover:h-[50px]",
            params?.serverid === id ? "h-[50px]" : "h-[0px]"
          )}
        />
        <div
          className={cn(
            "relative flex mx-3 h-[48px] w-[48px] rounded[25px] group-hover:rounded-[16px] transition-all overflow-hidden",
            params.serverid === id &&
              "bg-primary/10 text-primary rounded-[16px]"
          )}
        >
          <Image fill src={imageUrl} alt={name} />
        </div>
      </button>
    </ActionToolTip>
  );
};
