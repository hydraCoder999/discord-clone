import { NextApiRequest } from "next";
import { CurrentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIO } from "../../../../../types";
import { redisPublisher } from "@/lib/redis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await CurrentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    if (!conversationId) {
      return res.status(400).json({
        error: "Conversation Id Missing",
      });
    }

    if (!content) {
      return res.status(400).json({
        error: "Content Missing",
      });
    }
    console.log(profile, conversationId);

    const Conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            MemberOne: {
              profileId: profile.id,
            },
          },
          {
            MemberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        MemberOne: {
          include: {
            profile: true,
          },
        },
        MemberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    console.log("Conversation is ", Conversation);

    if (!Conversation) {
      return res.status(400).json({
        error: "Conversation Not Found",
      });
    }
    console.log(Conversation);

    const member =
      Conversation.MemberOne.profileId === profile.id
        ? Conversation?.MemberOne
        : Conversation?.MemberTwo;

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl: fileUrl as string,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;
    try {
      await redisPublisher.publish(
        "MESSAGES",
        JSON.stringify({ socketEmmitKey: channelKey, message })
      );
    } catch (error) {
      console.log(error);
      res?.socket?.server?.io?.emit(channelKey, message);
    }
    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST] ", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
