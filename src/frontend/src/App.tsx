import { BottomNav } from "@/components/BottomNav";
import { Sidebar } from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import Routines from "@/pages/Routines";
import SkinJournal from "@/pages/SkinJournal";
import Tips from "@/pages/Tips";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export type Page = "dashboard" | "products" | "routines" | "journal" | "tips";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function GlowTrack() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const pageMap: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard onNavigate={setActivePage} />,
    products: <Products />,
    routines: <Routines />,
    journal: <SkinJournal />,
    tips: <Tips />,
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0 min-h-screen">
        {pageMap[activePage]}
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNav activePage={activePage} onNavigate={setActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlowTrack />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
