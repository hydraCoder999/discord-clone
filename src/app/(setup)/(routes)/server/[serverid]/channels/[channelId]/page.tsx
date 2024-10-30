import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-meessages";
import { MediaRoom } from "@/components/media-room";
import { CurrentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs/server";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  const profile = await CurrentProfile();
  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
      serverId: params?.serverId,
    },
  });
  const memeber = await db.member.findFirst({
    where: {
      serverId: params?.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !memeber) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex   flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          {" "}
          <ChatMessages
            member={memeber}
            name={channel.name}
            chatId={channel.id}
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramkey={"channelId"}
            paramValue={channel.id}
            type={"channel"}
          />{" "}
          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
          />{" "}
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <>
          <MediaRoom chatId={channel.id} audio={true} video={false} />
        </>
      )}
      {channel.type === ChannelType.VIDEO && (
        <>
          <MediaRoom chatId={channel.id} audio={true} video={true} />
        </>
      )}
    </div>
  );
};

export default ChannelIdPage;
