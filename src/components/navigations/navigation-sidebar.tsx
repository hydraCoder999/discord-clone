import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationActions } from "./navigation-actions";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { UserButton } from "@clerk/nextjs";

export const NavigationSidebar = async () => {
  const profile = await CurrentProfile();
  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });
  return (
    <div className="space-y-4 flex items-center flex-col justify-stert py-3 w-full h-full text-primary bg-[#E3E5E8] dark:bg-[#1E1F22]">
      <NavigationActions></NavigationActions>
      <Separator className="h-[2px] rounded-md bg-zinc-300 dark:bg-zinc-800 w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full ">
        {servers.map((server) => (
          <div key={server.id} className="my-3">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mx-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]",
            },
          }}
        />
      </div>
    </div>
  );
};
