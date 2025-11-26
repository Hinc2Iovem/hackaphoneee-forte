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
        <div className="size-6 text-primary">
          <svg
            fill="currentColor"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
          AI Business Analyst Assistant
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
