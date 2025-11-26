import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export function AppLayout() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <NavBar />
      <main className="flex-1 flex justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-6">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
