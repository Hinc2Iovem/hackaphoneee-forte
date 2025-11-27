import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useAuth } from "@/features/Auth/providers/AuthProvider";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const fullName = user?.fullName ?? "Пользователь";
  const email = user?.username ?? "";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <header
      className="
        sticky top-0 z-20
        flex items-center justify-between whitespace-nowrap
        px-6 sm:px-10 py-3
        bg-card
        shadow-[0_4px_4px_rgba(0,0,0,0.1)]
      "
    >
      <Link
        to={HK_ROUTES.private.CASES.BASE}
        className="cursor-pointer flex items-center gap-3 text-gray-800 dark:text-gray-200"
      >
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-primary">
          AI Бизнес - аналитик
        </h2>
      </Link>

      <div className="relative flex items-center gap-4" ref={menuRef}>
        <span className="hidden sm:block text-sm font-semibold tracking-[0.015em]">
          {fullName}
        </span>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="
            flex items-center justify-center
            rounded-full size-10
            bg-primary/10 text-primary
            border border-primary/20
            shadow-[0_2px_4px_rgba(0,0,0,0.08)]
            hover:bg-primary/15 transition-colors
          "
        >
          <span className="text-sm font-semibold select-none">{initials}</span>
        </button>

        {open && (
          <div
            className="
              absolute right-0 top-full mt-2 w-64
              rounded-xl bg-card
              shadow-[0_4px_8px_rgba(0,0,0,0.12)]
              border border-border
              p-3
            "
          >
            <div className="flex items-center gap-3 pb-3 border-b border-border/70">
              <div className="flex items-center justify-center rounded-full size-9 bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {fullName}
                </span>
                {email && (
                  <span className="text-xs text-muted-foreground truncate">
                    {email}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await logout();
              }}
              className="
                mt-3 w-full text-left text-sm
                px-3 py-2 rounded-lg
                text-destructive hover:bg-destructive/5
                flex items-center gap-2 cursor-pointer
              "
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span>Выйти</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
