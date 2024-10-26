"use client";

import React, { useState } from "react";
import { Dialog, DialogHeader } from "../ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";

import { useModal } from "@/hooks/use-model-provider";
import { useOrigin } from "@/hooks/use-origin";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";

export const InviteModal = (): React.ReactNode => {
  const { type, isOpen, onClose, data, onOpen } = useModal();

  const origin = useOrigin();

  const InviteLink = `${origin}/invite/${data?.server?.inviteUrl}`;

  const isModalOpen = isOpen && type === "invite";

  const [copied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const copyToClipBoard = () => {
    window.navigator.clipboard.writeText(InviteLink);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  const generateNewLink = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${data?.server?.id}/invite-code`
      );
      onOpen("invite", {
        server: response.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-6  border-2 border-[#000] dark:border-0">
        <DialogHeader className="py-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite a new Friend
          </DialogTitle>
        </DialogHeader>

        <div className="w-full md:w-[400px] mt-3">
          <Label className="uppercase text-sm text-zinc-500 font-bold dark-text-zinc-400/10">
            SERVER INVITE LINK
          </Label>

          <div className="flex items-center w-full mt-2 gap-x-2">
            <Input
              disabled={isLoading}
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0  "
              readOnly
              value={InviteLink}
            />
            <Button
              disabled={isLoading}
              onClick={copyToClipBoard}
              size={"icon"}
            >
              {copied ? (
                <Check className="w-4 h-4" color="green" />
              ) : (
                <Copy className="w-4 h-4 cursor-pointer" />
              )}
            </Button>
          </div>

          <Button
            disabled={isLoading}
            variant={"link"}
            size={"sm"}
            className="text-xs text-zinc-500 mt-4 "
            onClick={generateNewLink}
          >
            generate a new invite link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
