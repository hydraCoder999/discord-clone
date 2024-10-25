import { NavigationSidebar } from "@/components/navigations/navigation-sidebar";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full">
      <div className="w-0 md:flex h-full z-30 flex-col fixed inset-y-0 md:w-[75px] overflow-hidden ">
        <NavigationSidebar />
      </div>
      <main className="w-full md:pl-[75px]"> {children}</main>
    </div>
  );
}
