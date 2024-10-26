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

export const DeleteServerModal = (): React.ReactNode => {
  const router = useRouter();
  const { type, isOpen, onClose, data } = useModal();

  const isModalOpen = isOpen && type === "deleteServer";

  const { server } = data;
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteServer = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/servers/${server?.id}`);
      router.refresh();
      onClose();
      router.push("/");
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
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 text-center pt-2">
            Are You want to do this ? <br />
            <span className="font-semibold text-sm text-rose-500">
              {server?.name}
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
              variant={"destructive"}
              disabled={isLoading}
              onClick={onDeleteServer}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
