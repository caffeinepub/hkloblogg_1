import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useIsAdmin } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { LogIn, LogOut, PenLine, ShieldCheck } from "lucide-react";

export function SiteHeader({ onNewPost }: { onNewPost?: () => void }) {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const isLoggedIn = !!identity;

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <span className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors">
            HKLO<span className="text-accent">Blogg</span>
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {onNewPost && (
            <Button
              variant="default"
              size="sm"
              onClick={onNewPost}
              className="gap-1.5"
              data-ocid="header.open_modal_button"
            >
              <PenLine className="h-3.5 w-3.5" />
              Nytt inlägg
            </Button>
          )}

          {isAdmin && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              Admin
            </span>
          )}

          {isLoggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clear}
              className="gap-1.5 text-muted-foreground"
              data-ocid="header.button"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logga ut
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={login}
              disabled={isLoggingIn}
              className="gap-1.5 text-muted-foreground"
              data-ocid="auth.button"
            >
              <LogIn className="h-3.5 w-3.5" />
              {isLoggingIn ? "Loggar in..." : "Admin"}
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
