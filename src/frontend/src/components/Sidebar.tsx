import type { Page } from "@/App";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  LayoutDashboard,
  Lightbulb,
  Package,
  RefreshCw,
  Sparkles,
} from "lucide-react";

const navItems = [
  { id: "dashboard" as Page, label: "Dashboard", icon: LayoutDashboard },
  { id: "products" as Page, label: "My Products", icon: Package },
  { id: "routines" as Page, label: "Routines", icon: RefreshCw },
  { id: "journal" as Page, label: "Skin Journal", icon: BookOpen },
  { id: "tips" as Page, label: "Tips", icon: Lightbulb },
];

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-30">
      {/* Brand */}
      <div className="px-6 py-8 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-3xl text-primary">GlowTrack</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 font-body">
          Your skincare companion
        </p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-4 py-6 space-y-1" aria-label="Main navigation">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            data-ocid={`nav.${id}.link`}
            onClick={() => onNavigate(id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
              activePage === id
                ? "bg-primary/10 text-primary font-semibold"
                : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4",
                activePage === id ? "text-primary" : "text-muted-foreground",
              )}
            />
            {label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()}. Built with ♥ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );
}
