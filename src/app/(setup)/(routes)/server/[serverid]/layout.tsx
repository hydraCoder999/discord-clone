import ServerSideBar from "@/components/server/server-sidebar";
import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) {
  const profile = await CurrentProfile();
  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params?.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <div className="h-full">
      <div className="w-0 md:flex fixed h-full md:w-60 z-20 flex-col inset-y-0 overflow-hidden">
        <ServerSideBar serverId={params?.serverId} />
      </div>

      <div className="h-screen md:pl-60">{children}</div>
    </div>
  );
}
