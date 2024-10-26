import { cn } from "@/lib/utils";
import { Avatar, AvatarImage } from "./ui/avatar";

interface UserAvatarProps {
  src?: string;
  className?: string;
}

export const UserAvatar = ({ src, className }: UserAvatarProps) => {
  return (
    <Avatar>
      <AvatarImage
        className={cn("h-7 w-7 md:h-10 w-10", className)}
        src={src}
      />
    </Avatar>
  );
};
