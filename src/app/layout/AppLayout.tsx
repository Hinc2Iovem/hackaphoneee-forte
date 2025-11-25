import type { PropsWithChildren } from "react";
import { NavBar } from "./NavBar";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <NavBar />
      <main className="flex-1 flex justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-6">
        <div className="w-full max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
