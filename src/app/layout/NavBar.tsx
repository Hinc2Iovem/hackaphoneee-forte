import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HK_ROUTES } from "@/consts/HK_ROUTES";
import { useAuth } from "@/features/Auth/providers/AuthProvider";
import { Link } from "react-router-dom";

export function NavBar() {
  const { user, logout } = useAuth();

  const fullName = user?.fullName ?? "Пользователь";
  const email = user?.username ?? "";

  const initials =
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U";

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

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm font-semibold tracking-[0.015em]">
                {fullName}
              </span>

              <button
                type="button"
                className="
              flex items-center justify-center
              rounded-full size-10
              bg-primary/10 text-primary
              border border-primary/20
                shadow-[0_2px_4px_rgba(0,0,0,0.08)]
                hover:bg-primary/15 transition-colors
                "
              >
                <span className="text-sm font-semibold select-none">
                  {initials}
                </span>
              </button>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-64 rounded-xl bg-card shadow-[0_4px_8px_rgba(0,0,0,0.12)] border border-border p-0"
          >
            <DropdownMenuLabel className="px-3 py-3">
              <div className="flex items-center gap-3">
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
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {user?.role && user.role === "AUTHORITY" ? (
              <DropdownMenuItem asChild>
                <Link
                  to={HK_ROUTES.private.REGISTER.BASE}
                  className="
                w-full text-sm
                px-3 py-2
                flex items-center gap-2
                cursor-pointer
                "
                >
                  <span className="material-symbols-outlined text-base">
                    person_add
                  </span>
                  <span>Создать пользователя</span>
                </Link>
              </DropdownMenuItem>
            ) : null}

            <DropdownMenuItem
              onClick={async () => {
                await logout();
              }}
              className="
                text-destructive focus:text-destructive
                px-3 py-2 flex items-center gap-2 cursor-pointer
              "
            >
              <span className="material-symbols-outlined text-base">
                logout
              </span>
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
