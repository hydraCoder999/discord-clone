"use client";
import { UploadDropzone } from "@/lib/uploadthings";

import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FiileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endPoint: "serverImage" | "messageFile";
}
export const FileUplod = ({ onChange, value, endPoint }: FiileUploadProps) => {
  const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState("");

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

  if (value && fileType === "pdf") {
    return (
      <div className="relative max-w-400 flex-wrap flex items-center p-2 rounded-md mt-2 bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2   text-sm text-indigo-500 daek:text-indigo-400 hover:underline"
        >
          {fileName}
        </a>
        <button
          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 "
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
        let filetype = res?.[0]?.name.split(".");
        setFileName(res?.[0]?.name);

        setFileType(filetype?.[filetype.length - 1] || "");
      }}
      onUploadError={(error: Error) => {
        console.log(error);
      }}
    />
  );
};
