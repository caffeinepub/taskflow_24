import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RoutineType,
  useProducts,
  useRoutine,
  useSetRoutine,
} from "@/hooks/useQueries";
import type { RoutineStep } from "@/hooks/useQueries";
import {
  GripVertical,
  Info,
  Loader2,
  Moon,
  Plus,
  Save,
  Sun,
  Trash2,
} from "lucide-react";
import { AnimatePresence, Reorder } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StepLocal extends RoutineStep {
  tempId: string;
}

export default function Routines() {
  const [activeTab, setActiveTab] = useState<RoutineType>(RoutineType.Morning);
  const { data: products } = useProducts();
  const { data: savedSteps, isLoading } = useRoutine(activeTab);
  const setRoutine = useSetRoutine();

  const [steps, setSteps] = useState<StepLocal[]>([]);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newProductId, setNewProductId] = useState("");
  const [newInstructions, setNewInstructions] = useState("");

  // Sync from backend when saved steps change
  useEffect(() => {
    if (savedSteps) {
      setSteps(
        [...savedSteps]
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map((s, i) => ({
            ...s,
            tempId: `${String(s.productId)}-${i}-${Math.random()}`,
          })),
      );
    }
  }, [savedSteps]);

  function addStep() {
    if (!newProductId) {
      toast.error("Please select a product");
      return;
    }
    const nextOrder = BigInt(steps.length);
    setSteps((prev) => [
      ...prev,
      {
        productId: BigInt(newProductId),
        instructions: newInstructions,
        order: nextOrder,
        tempId: `new-${Date.now()}`,
      },
    ]);
    setNewProductId("");
    setNewInstructions("");
    setAddDialogOpen(false);
  }

  function removeStep(tempId: string) {
    setSteps((prev) => prev.filter((s) => s.tempId !== tempId));
  }

  async function saveRoutine() {
    const stepsToSave: RoutineStep[] = steps.map((s, i) => ({
      productId: s.productId,
      instructions: s.instructions,
      order: BigInt(i),
    }));
    await setRoutine.mutateAsync({
      routineType: activeTab,
      steps: stepsToSave,
    });
    toast.success(`${activeTab} routine saved!`);
  }

  function getProductName(id: bigint): string {
    return products?.find((p) => p.id === id)?.name ?? `Product #${String(id)}`;
  }

  function getProductCategory(id: bigint) {
    return products?.find((p) => p.id === id)?.category ?? null;
  }

  return (
    <div className="page-enter">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Routines</h1>
            <p className="text-xs text-muted-foreground">
              Build your daily skincare steps
            </p>
          </div>
          <Button
            size="sm"
            onClick={saveRoutine}
            disabled={setRoutine.isPending}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            data-ocid="routines.save_button"
          >
            {setRoutine.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save
          </Button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            data-ocid="routines.morning.tab"
            onClick={() => setActiveTab(RoutineType.Morning)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === RoutineType.Morning
                ? "bg-amber-100 text-amber-700"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Sun className="w-4 h-4" /> Morning
          </button>
          <button
            type="button"
            data-ocid="routines.evening.tab"
            onClick={() => setActiveTab(RoutineType.Evening)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === RoutineType.Evening
                ? "bg-indigo-100 text-indigo-700"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <Moon className="w-4 h-4" /> Evening
          </button>
        </div>
      </header>

      <div className="px-4 md:px-6 py-4">
        {isLoading ? (
          <div className="space-y-3" data-ocid="routines.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {steps.length === 0 ? (
              <div
                className="text-center py-14"
                data-ocid="routines.empty_state"
              >
                {activeTab === RoutineType.Morning ? (
                  <Sun className="w-12 h-12 text-amber-200 mx-auto mb-3" />
                ) : (
                  <Moon className="w-12 h-12 text-indigo-200 mx-auto mb-3" />
                )}
                <p className="text-muted-foreground font-medium">
                  No steps yet
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Add products from your collection to build this routine
                </p>
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={steps}
                onReorder={setSteps}
                className="space-y-2 mb-4"
              >
                <AnimatePresence>
                  {steps.map((step, idx) => (
                    <Reorder.Item
                      key={step.tempId}
                      value={step}
                      data-ocid={`routines.item.${idx + 1}`}
                    >
                      <Card className="glow-card border-border/60 cursor-grab active:cursor-grabbing">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div
                            className="text-muted-foreground/40 shrink-0"
                            data-ocid={`routines.drag_handle.${idx + 1}`}
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>
                          <div className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs flex items-center justify-center font-semibold shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {getProductName(step.productId)}
                            </p>
                            {step.instructions && (
                              <p className="text-xs text-muted-foreground truncate">
                                {step.instructions}
                              </p>
                            )}
                          </div>
                          {getProductCategory(step.productId) && (
                            <Badge
                              variant="outline"
                              className="text-xs shrink-0"
                            >
                              {getProductCategory(step.productId)}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => removeStep(step.tempId)}
                            data-ocid={`routines.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            )}

            <Button
              variant="outline"
              className="w-full rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/5"
              onClick={() => setAddDialogOpen(true)}
              data-ocid="routines.add_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Step
            </Button>

            {(products?.length ?? 0) === 0 && (
              <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 rounded-xl text-amber-700">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs">
                  Add products to "My Products" first before building routines.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent
          className="rounded-2xl max-w-sm"
          data-ocid="routines.dialog"
        >
          <DialogHeader>
            <DialogTitle>Add Step</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Product</Label>
              <Select value={newProductId} onValueChange={setNewProductId}>
                <SelectTrigger data-ocid="routines.select">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {(products ?? []).map((p) => (
                    <SelectItem key={String(p.id)} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="step-instructions">Instructions (optional)</Label>
              <Input
                id="step-instructions"
                placeholder="e.g. Apply to damp skin, massage gently"
                value={newInstructions}
                onChange={(e) => setNewInstructions(e.target.value)}
                data-ocid="routines.input"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              data-ocid="routines.cancel_button"
            >
              Cancel
            </Button>
            <Button onClick={addStep} data-ocid="routines.submit_button">
              Add Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
