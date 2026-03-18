import type { Page } from "@/App";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  LayoutDashboard,
  Lightbulb,
  Package,
  RefreshCw,
} from "lucide-react";

const navItems = [
  { id: "dashboard" as Page, label: "Home", icon: LayoutDashboard },
  { id: "products" as Page, label: "Products", icon: Package },
  { id: "routines" as Page, label: "Routines", icon: RefreshCw },
  { id: "journal" as Page, label: "Journal", icon: BookOpen },
  { id: "tips" as Page, label: "Tips", icon: Lightbulb },
];

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-30 safe-bottom"
      aria-label="Bottom navigation"
    >
      <div className="flex items-stretch">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            data-ocid={`bottom_nav.${id}.link`}
            onClick={() => onNavigate(id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-0.5 py-3 px-1 transition-all duration-200 relative",
              activePage === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("w-5 h-5", activePage === id && "scale-110")} />
            <span
              className={cn(
                "text-[10px] font-medium",
                activePage === id && "font-semibold",
              )}
            >
              {label}
            </span>
            {activePage === id && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
