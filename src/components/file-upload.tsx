"use client";
import { UploadDropzone } from "@/lib/uploadthings";

import "@uploadthing/react/styles.css";
import { X } from "lucide-react";
import Image from "next/image";

interface FiileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endPoint: "serverImage" | "messageFile";
}
export const FileUplod = ({ onChange, value, endPoint }: FiileUploadProps) => {
  const fileType = value.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative w-20 h-20 mt-5">
        <Image fill src={value} alt="server-img" className="rounded-full " />
        <button
          className="absolute top-0 right-0 bg-rose-500 text-white rounded-full p-1 "
          onClick={() => onChange("")}
        >
          <X className="h-3 w-4" />
        </button>
      </div>
    );
  }
  return (
    <UploadDropzone
      endpoint={endPoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
