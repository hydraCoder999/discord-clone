import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-[100vh] w-full flex items-center justify-center ">
      {children}
    </div>
  );
}
