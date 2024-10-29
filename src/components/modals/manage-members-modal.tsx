"use client";

import React, { useState } from "react";
import { Dialog, DialogDescription, DialogHeader } from "../ui/dialog";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";

import { useModal } from "@/hooks/use-model-provider";
import { ServerWithMembersWithProfile } from "../../../types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { MemberRole } from "@prisma/client";

import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

const RolesIcon = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

export const ManageMembersModal = (): React.ReactNode => {
  const router = useRouter();
  const { type, isOpen, onClose, data, onOpen } = useModal();

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfile };

  const [loadingId, setloadingId] = useState("");

  const onKick = async (memberId: string) => {
    try {
      setloadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const respose = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: respose.data });
    } catch (error) {
      console.log(error);
    } finally {
      setloadingId("");
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setloadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const respose = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: respose.data });
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setloadingId("");
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]    bg-white text-black overflow-hidden p-6  border-2 border-[#000] dark:border-0">
        <DialogHeader className="py-2 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-zinc-400">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <div className="py-5 px-0">
          <ScrollArea>
            {server?.members?.map((member) => (
              <div
                key={member.id}
                className="max-h-[420px] my-3 flex items-center gap-x-2 "
              >
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="flex gap-2 text-sm font-semibold items-center  capitalize">
                    {member.profile.name}
                    {RolesIcon[member?.role]}
                  </div>
                  <p className="text-zinc-400 text-xs">
                    {" "}
                    {member?.profile.email}
                  </p>
                </div>

                {loadingId === member.id ? (
                  <Loader2 className="animate-spin text-zinc-400 ml-auto w-4 h-4" />
                ) : (
                  <>
                    {server.profileId !== member.profileId &&
                      loadingId !== member.id && (
                        <div className="ml-auto ">
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <MoreVertical className="h-4 w-4 text-zinc-500" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              side="left"
                              style={{ zIndex: 1000, pointerEvents: "auto" }}
                              className="p-2"
                            >
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="flex items-center">
                                  <ShieldQuestion className="h-4 w-4 mr-2" />
                                  <span>Role</span>
                                </DropdownMenuSubTrigger>

                                <DropdownMenuSubContent
                                  style={{ zIndex: 1000 }}
                                >
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onRoleChange(member.id, "GUEST")
                                    }
                                  >
                                    <Shield className="mr-2 w-4 h-4" /> Guest{" "}
                                    {member.role === "GUEST" && (
                                      <Check
                                        className="w-4 h-4 ml-auto text-green-100"
                                        color="green"
                                      />
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      onRoleChange(member.id, "MODERATOR")
                                    }
                                  >
                                    <ShieldCheck className="mr-2 w-4 h-4" />{" "}
                                    Moderator{" "}
                                    {member.role === "MODERATOR" && (
                                      <Check
                                        className="w-4 h-4 ml-auto text-green-100"
                                        color="green"
                                      />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>

                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => onKick(member.id)}
                                className="text-rose-500"
                              >
                                <Gavel className="h-4 w-4 mr-2" color="red" />
                                Kick
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                  </>
                )}
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};
