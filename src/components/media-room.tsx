"use client";
import qs from "query-string";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";

import { useEffect, useState } from "react";
import { Track } from "livekit-client";

import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface MediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

export const MediaRoom = ({ chatId, video, audio }: MediaRoomProps) => {
  const { user } = useUser();

  const [token, setToken] = useState("");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isVideo = searchParams?.get("video");

  const onDisconnected = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true }
    );
    router.push(url);
  };

  useEffect(() => {
    if (!user?.firstName || !user.lastName) return;

    const name = `${user.firstName} ${user.lastName}`;

    (async () => {
      try {
        const res = await fetch(
          `/api/get-participant-token?room=${chatId}&username=${name}`
        );
        const data = await res.json();
        setToken(data.token);
      } catch (error) {
        console.log("Error", error);
      }
    })();
  }, [user?.firstName, user?.lastName, chatId]);

  if (token === "") {
    return (
      <div className="flex flex-1 flex-col justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: "100dvh" }}
      onDisconnected={onDisconnected}
    >
      <VideoConference />
    </LiveKitRoom>
  );
};
