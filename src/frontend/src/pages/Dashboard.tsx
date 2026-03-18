import type { Page } from "@/App";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RoutineType,
  useJournalEntries,
  useProducts,
  useRoutine,
} from "@/hooks/useQueries";
import {
  BookOpen,
  ChevronRight,
  Moon,
  Package,
  Sparkles,
  Star,
  Sun,
} from "lucide-react";
import { motion } from "motion/react";

function StarRating({ value }: { value: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= value ? "star-filled fill-current" : "star-empty"}`}
        />
      ))}
    </span>
  );
}

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: journal, isLoading: loadingJournal } = useJournalEntries();
  const { data: morningRoutine } = useRoutine(RoutineType.Morning);
  const { data: eveningRoutine } = useRoutine(RoutineType.Evening);

  const recentEntries = [...(journal ?? [])]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 3);

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="page-enter">
      {/* Hero */}
      <section
        className="relative h-52 md:h-64 overflow-hidden"
        style={{
          backgroundImage: "url('/assets/generated/glow-bg.dim_1200x800.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="dashboard.section"
      >
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 flex flex-col justify-end h-full px-6 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-white/80" />
            <span className="text-white/80 text-sm font-medium">
              {todayDate}
            </span>
          </div>
          <h1 className="font-display text-5xl text-white leading-none">
            GlowTrack
          </h1>
          <p className="text-white/75 text-sm mt-1">
            Your daily skincare journey
          </p>
        </div>
      </section>

      <div className="px-4 md:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className="glow-card border-border/60 cursor-pointer hover:glow-card-hover transition-shadow"
              onClick={() => onNavigate("products")}
              data-ocid="dashboard.products.card"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  {loadingProducts ? (
                    <Skeleton className="h-6 w-8 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {products?.length ?? 0}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card
              className="glow-card border-border/60 cursor-pointer hover:glow-card-hover transition-shadow"
              onClick={() => onNavigate("journal")}
              data-ocid="dashboard.journal.card"
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  {loadingJournal ? (
                    <Skeleton className="h-6 w-8 mb-1" />
                  ) : (
                    <p className="text-2xl font-bold text-foreground">
                      {journal?.length ?? 0}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Journal entries
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Today's Routines */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          data-ocid="dashboard.routines.section"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Today's Routines</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("routines")}
              className="text-primary text-xs h-7"
              data-ocid="dashboard.routines.link"
            >
              View all <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Card className="glow-card border-border/60">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" /> Morning
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-primary">
                  {morningRoutine?.length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">steps</p>
              </CardContent>
            </Card>
            <Card className="glow-card border-border/60">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-400" /> Evening
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-2xl font-bold text-primary">
                  {eveningRoutine?.length ?? 0}
                </p>
                <p className="text-xs text-muted-foreground">steps</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Recent Journal */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          data-ocid="dashboard.journal.section"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Recent Journal</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("journal")}
              className="text-primary text-xs h-7"
              data-ocid="dashboard.journal.link"
            >
              View all <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>

          {loadingJournal ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : recentEntries.length === 0 ? (
            <Card
              className="glow-card border-border/60"
              data-ocid="dashboard.journal.empty_state"
            >
              <CardContent className="py-8 text-center">
                <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No journal entries yet
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-primary"
                  onClick={() => onNavigate("journal")}
                  data-ocid="dashboard.journal.primary_button"
                >
                  Add your first entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentEntries.map((entry, idx) => (
                <Card
                  key={String(entry.id)}
                  className="glow-card border-border/60"
                  data-ocid={`dashboard.journal.item.${idx + 1}`}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {entry.date}
                      </p>
                      {entry.notes && (
                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                    <StarRating value={Number(entry.skinCondition)} />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.section>

        {/* Footer */}
        <footer className="text-center pt-2 pb-4">
          <p className="text-xs text-muted-foreground">
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
        </footer>
      </div>
    </div>
  );
}
