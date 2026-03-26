import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  BarChart3,
  Bell,
  BrainCircuit,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Search,
  Settings,
  Users,
} from "lucide-react";

type Page = "dashboard" | "employees" | "records" | "analytics" | "management";

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const navTabs: { id: Page; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "employees", label: "Employees" },
  { id: "records", label: "Records" },
  { id: "analytics", label: "Analytics" },
  { id: "management", label: "Management" },
];

const sidebarIcons: { id: Page; icon: React.ElementType; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "employees", icon: Users, label: "Employees" },
  { id: "records", icon: ClipboardList, label: "Records" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "management", icon: Settings, label: "Management" },
];

export default function AttendLayout({
  activePage,
  onNavigate,
  children,
}: Props) {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Top Bar */}
        <header className="top-bar fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-6">
          <div className="flex items-center gap-2 min-w-[160px]">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BrainCircuit className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-[15px] text-foreground tracking-tight">
              AttendAI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navTabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                data-ocid={`nav.${tab.id}.link`}
                onClick={() => onNavigate(tab.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activePage === tab.id
                    ? "bg-accent text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              data-ocid="topbar.search_input"
            >
              <Search className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 relative"
              data-ocid="topbar.bell.button"
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-foreground leading-none">
                  Admin User
                </p>
                <p className="text-[10px] text-muted-foreground">Admin</p>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
            </div>
          </div>
        </header>

        <div className="flex flex-1 pt-14">
          <aside className="sidebar-rail fixed left-0 top-14 bottom-0 w-14 flex flex-col items-center py-3 gap-1 z-40">
            {sidebarIcons.map(({ id, icon: Icon, label }) => (
              <Tooltip key={id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    data-ocid={`sidebar.${id}.link`}
                    onClick={() => onNavigate(id)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      activePage === id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="text-xs">{label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </aside>

          <main className="flex-1 ml-14 min-h-screen">
            <div className="page-enter">{children}</div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
