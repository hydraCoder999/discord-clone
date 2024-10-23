import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { name, imageUrl } = await req.json();
    const profile = await CurrentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", {
        status: 400,
      });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteUrl: uuid(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.error("[SERVER_ERRORS]", error);
    return new NextResponse("Internal Server Error ", {
      status: 500,
    });
  }
}
