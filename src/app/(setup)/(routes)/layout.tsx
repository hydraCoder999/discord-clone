import { NavigationSidebar } from "@/components/navigations/navigation-sidebar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full">
      <div className="hidden md:flex h-full z-30 flex-col fixed inset-y-0 w-[75px] ">
        <NavigationSidebar />
      </div>
      <main className="w-full md:pl-[75px]">{children}</main>
    </div>
  );
}
