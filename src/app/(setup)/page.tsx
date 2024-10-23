import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { InitialProfile } from "@/lib/initial-profile";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function SetupPage() {
  const profile = await InitialProfile();

  if ("id" in profile && typeof profile.id === "string") {
    // is profile have any server
    const server = await db.server.findFirst({
      where: {
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
    });

    if (server) {
      return redirect(`/server/${server.id}`);
    }
  } else {
    return redirectToSignIn();
  }

  return <InitialModal />;
}
