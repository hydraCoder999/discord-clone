import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    const profile = await CurrentProfile();
    const { searchParams } = new URL(req.url);
    if (!profile) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }

    const serverId = searchParams.get("serverId");
    if (!serverId) {
      return new NextResponse("Server Id Missing", {
        status: 400,
      });
    }

    if (name === "general") {
      return new NextResponse("Name Cannot be general", {
        status: 400,
      });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          create: {
            profileId: profile.id,
            name: name,
            type: type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[CHANNEL_ERRORS]", error);
    return new NextResponse("Internal Server Error ", {
      status: 500,
    });
  }
}
