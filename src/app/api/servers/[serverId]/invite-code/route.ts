import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await CurrentProfile();
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 400 });
    }

    if (!params.serverId) {
      return new NextResponse("Server Id is Missing", { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: params?.serverId,
        profileId: profile.id,
      },
      data: {
        inviteUrl: uuidv4(),
      },
    });

    if (!server) {
      return new NextResponse("Server is Missing", { status: 400 });
    }

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_INVITE_CODE] : ", error);
    return new NextResponse("Internal Server Error ", { status: 500 });
  }
}
