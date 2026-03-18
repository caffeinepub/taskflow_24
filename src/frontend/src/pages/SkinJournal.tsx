import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddJournalEntry,
  useDeleteJournalEntry,
  useJournalEntries,
} from "@/hooks/useQueries";
import { BookOpen, Loader2, Plus, Star, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

function StarRatingInput({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
          data-ocid={`journal.rating_star.${i}`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              i <= value ? "star-filled fill-current" : "star-empty"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function conditionLabel(v: number) {
  return ["Very Poor", "Poor", "Okay", "Good", "Glowing"][v - 1] ?? "";
}

function conditionColor(v: number) {
  const colors = [
    "text-red-500",
    "text-orange-400",
    "text-yellow-500",
    "text-green-500",
    "text-emerald-500",
  ];
  return colors[v - 1] ?? "";
}

export default function SkinJournal() {
  const { data: entries, isLoading } = useJournalEntries();
  const addEntry = useAddJournalEntry();
  const deleteEntry = useDeleteJournalEntry();

  const today = new Date().toISOString().split("T")[0];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [date, setDate] = useState(today);
  const [condition, setCondition] = useState(3);
  const [notes, setNotes] = useState("");
  const [concerns, setConcerns] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const sortedEntries = [...(entries ?? [])].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  async function handleAdd() {
    await addEntry.mutateAsync({
      date,
      skinCondition: BigInt(condition),
      notes,
      concerns,
    });
    toast.success("Journal entry added!");
    setDialogOpen(false);
    setDate(today);
    setCondition(3);
    setNotes("");
    setConcerns("");
  }

  async function handleDelete(id: bigint) {
    await deleteEntry.mutateAsync(id);
    toast.success("Entry deleted");
    setDeleteConfirmId(null);
  }

  return (
    <div className="page-enter">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Skin Journal</h1>
            <p className="text-xs text-muted-foreground">
              {entries?.length ?? 0} entries
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            data-ocid="journal.add_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Log Today
          </Button>
        </div>
      </header>

      {/* List */}
      <div className="px-4 md:px-6 py-4">
        {isLoading ? (
          <div className="space-y-3" data-ocid="journal.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : sortedEntries.length === 0 ? (
          <div className="text-center py-16" data-ocid="journal.empty_state">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Start your skin journey
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Track how your skin feels day by day
            </p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="mt-4 rounded-xl"
              data-ocid="journal.empty.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Log Today
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {sortedEntries.map((entry, idx) => (
                <motion.div
                  key={String(entry.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: idx * 0.04 }}
                  data-ocid={`journal.item.${idx + 1}`}
                >
                  <Card className="glow-card border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {entry.date}
                          </p>
                          <span
                            className={`text-xs font-medium ${conditionColor(Number(entry.skinCondition))}`}
                          >
                            {conditionLabel(Number(entry.skinCondition))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i <= Number(entry.skinCondition)
                                    ? "star-filled fill-current"
                                    : "star-empty"
                                }`}
                              />
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteConfirmId(entry.id)}
                            data-ocid={`journal.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="text-xs text-foreground/80 mb-1">
                          {entry.notes}
                        </p>
                      )}
                      {entry.concerns && (
                        <p className="text-xs text-muted-foreground italic">
                          {entry.concerns}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {/* Add Entry Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="rounded-2xl max-w-sm"
          data-ocid="journal.dialog"
        >
          <DialogHeader>
            <DialogTitle>Log Your Skin Today</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="entry-date">Date</Label>
              <Input
                id="entry-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="journal.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Skin Condition</Label>
              <StarRatingInput value={condition} onChange={setCondition} />
              <p className={`text-xs font-medium ${conditionColor(condition)}`}>
                {conditionLabel(condition)}
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="entry-notes">Notes</Label>
              <Textarea
                id="entry-notes"
                placeholder="How does your skin feel today?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                data-ocid="journal.textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="entry-concerns">Concerns</Label>
              <Input
                id="entry-concerns"
                placeholder="e.g. Dry patches, breakout on chin"
                value={concerns}
                onChange={(e) => setConcerns(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="journal.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addEntry.isPending}
              data-ocid="journal.submit_button"
            >
              {addEntry.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent
          className="rounded-2xl max-w-xs"
          data-ocid="journal.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle>Delete entry?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This journal entry will be permanently deleted.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              data-ocid="journal.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirmId !== null && handleDelete(deleteConfirmId)
              }
              disabled={deleteEntry.isPending}
              data-ocid="journal.delete.confirm_button"
            >
              {deleteEntry.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
