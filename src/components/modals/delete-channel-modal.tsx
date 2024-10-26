"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";

import { useModal } from "@/hooks/use-model-provider";

import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import qs from "query-string";

export const DeleteChannelModal = (): React.ReactNode => {
  const router = useRouter();

  const { type, isOpen, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "deletChannel";

  const { server, channel } = data;
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteChannel = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      const response = await axios.delete(url);
      router.refresh();
      onClose();
      router.push(`/server/${server?.id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden  border-2 border-[#000] dark:border-0">
        <DialogHeader className="py-3 w-[300px] md:w-[420px]">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 text-center pt-2">
            Are You want to do this ? <br />
            <span className="font-semibold text-sm text-rose-500">
              # {channel?.name}
            </span>{" "}
            this will permanently deleted
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="px-0 ">
          <div className="flex items-center justify-between w-full px-6 py-2 bg-zinc-300 mt-5">
            <Button variant={"ghost"} disabled={isLoading} onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant={"primary"}
              disabled={isLoading}
              onClick={onDeleteChannel}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
