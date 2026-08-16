import { LogOut } from "lucide-react";
import { logout } from "@/features/auth/lib/actions";

/** Sits in the sidebar footer, directly under "View Store". */
export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors duration-[var(--duration-fast)] hover:bg-red/8 hover:text-red"
      >
        <LogOut
          className="h-[18px] w-[18px] shrink-0 text-foreground/45"
          aria-hidden="true"
        />
        Logout
      </button>
    </form>
  );
}
