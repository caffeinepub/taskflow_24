import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { backendInterface as SkincareActor } from "../backend.d";
import { ProductCategory, RoutineType } from "../backend.d";
import { useActor } from "./useActor";

export { ProductCategory, RoutineType };
export type { RoutineStep } from "../backend.d";

// Helper to get actor typed correctly for the skincare backend
function useSkincareActor() {
  const { actor, isFetching } = useActor();
  return { actor: actor as unknown as SkincareActor | null, isFetching };
}

// ── Products ──────────────────────────────────────────────────────────────────

export function useProducts() {
  const { actor, isFetching } = useSkincareActor();
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddProduct() {
  const { actor } = useSkincareActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      name: string;
      brand: string;
      category: ProductCategory;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addProduct(vars.name, vars.brand, vars.category, vars.notes);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useSkincareActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: bigint;
      name: string;
      brand: string;
      category: ProductCategory;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(
        vars.id,
        vars.name,
        vars.brand,
        vars.category,
        vars.notes,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useSkincareActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

// ── Routines ──────────────────────────────────────────────────────────────────

export function useRoutine(routineType: RoutineType) {
  const { actor, isFetching } = useSkincareActor();
  return useQuery({
    queryKey: ["routine", routineType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRoutine(routineType);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetRoutine() {
  const { actor } = useSkincareActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      routineType: RoutineType;
      steps: import("../backend.d").RoutineStep[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.setRoutine(vars.routineType, vars.steps);
    },
    onSuccess: (_data, vars) =>
      qc.invalidateQueries({ queryKey: ["routine", vars.routineType] }),
  });
}

// ── Journal ───────────────────────────────────────────────────────────────────

export function useJournalEntries() {
  const { actor, isFetching } = useSkincareActor();
  return useQuery({
    queryKey: ["journal"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllJournalEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddJournalEntry() {
  const { actor } = useSkincareActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      date: string;
      skinCondition: bigint;
      notes: string;
      concerns: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addJournalEntry(
        vars.date,
        vars.skinCondition,
        vars.notes,
        vars.concerns,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] }),
  });
}

export function useDeleteJournalEntry() {
  const { actor } = useSkincareActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteJournalEntry(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["journal"] }),
  });
}

// ── Tips ──────────────────────────────────────────────────────────────────────

export function useTips() {
  const { actor, isFetching } = useSkincareActor();
  return useQuery({
    queryKey: ["tips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTips();
    },
    enabled: !!actor && !isFetching,
  });
}
