import type { Product } from "@/backend.d";
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
import { Textarea } from "@/components/ui/textarea";
import {
  ProductCategory,
  useAddProduct,
  useDeleteProduct,
  useProducts,
  useUpdateProduct,
} from "@/hooks/useQueries";
import { Loader2, Package, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = Object.values(ProductCategory);

const categoryColors: Record<ProductCategory, string> = {
  [ProductCategory.Cleanser]: "bg-blue-50 text-blue-700 border-blue-200",
  [ProductCategory.Toner]: "bg-teal-50 text-teal-700 border-teal-200",
  [ProductCategory.Serum]: "bg-purple-50 text-purple-700 border-purple-200",
  [ProductCategory.Moisturizer]: "bg-rose-50 text-rose-700 border-rose-200",
  [ProductCategory.SPF]: "bg-amber-50 text-amber-700 border-amber-200",
  [ProductCategory.Other]: "bg-gray-50 text-gray-600 border-gray-200",
};

interface ProductFormData {
  name: string;
  brand: string;
  category: ProductCategory;
  notes: string;
}

const defaultForm: ProductFormData = {
  name: "",
  brand: "",
  category: ProductCategory.Cleanser,
  notes: "",
};

export default function Products() {
  const { data: products, isLoading } = useProducts();
  const addProduct = useAddProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [filterCategory, setFilterCategory] = useState<ProductCategory | "All">(
    "All",
  );
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<bigint | null>(null);

  const filtered = (products ?? []).filter((p) => {
    const matchCategory =
      filterCategory === "All" || p.category === filterCategory;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  function openAdd() {
    setEditingProduct(null);
    setForm(defaultForm);
    setDialogOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      brand: product.brand,
      category: product.category,
      notes: product.notes,
    });
    setDialogOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, ...form });
      toast.success("Product updated!");
    } else {
      await addProduct.mutateAsync(form);
      toast.success("Product added!");
    }
    setDialogOpen(false);
  }

  async function handleDelete(id: bigint) {
    await deleteProduct.mutateAsync(id);
    toast.success("Product removed");
    setDeleteConfirmId(null);
  }

  const isPending = addProduct.isPending || updateProduct.isPending;

  return (
    <div className="page-enter">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">My Products</h1>
            <p className="text-xs text-muted-foreground">
              {products?.length ?? 0} items in your collection
            </p>
          </div>
          <Button
            size="sm"
            onClick={openAdd}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
            data-ocid="products.add_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl bg-muted/50 border-border/60"
            data-ocid="products.search_input"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              type="button"
              key={cat}
              data-ocid={`products.${cat.toLowerCase()}.tab`}
              onClick={() => setFilterCategory(cat as ProductCategory | "All")}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 md:px-6 py-4">
        {isLoading ? (
          <div className="space-y-3" data-ocid="products.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="products.empty_state">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No products found
            </p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Add your first skincare product to get started
            </p>
            <Button
              onClick={openAdd}
              className="mt-4 rounded-xl"
              data-ocid="products.empty.primary_button"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {filtered.map((product, idx) => (
                <motion.div
                  key={String(product.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ delay: idx * 0.04 }}
                  data-ocid={`products.item.${idx + 1}`}
                >
                  <Card className="glow-card border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate">
                              {product.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${categoryColors[product.category]}`}
                            >
                              {product.category}
                            </Badge>
                          </div>
                          {product.brand && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {product.brand}
                            </p>
                          )}
                          {product.notes && (
                            <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">
                              {product.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 ml-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => openEdit(product)}
                            data-ocid={`products.edit_button.${idx + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeleteConfirmId(product.id)}
                            data-ocid={`products.delete_button.${idx + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="rounded-2xl max-w-sm"
          data-ocid="products.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="prod-name">Name *</Label>
              <Input
                id="prod-name"
                placeholder="e.g. Gentle Foaming Cleanser"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="products.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-brand">Brand</Label>
              <Input
                id="prod-brand"
                placeholder="e.g. CeraVe"
                value={form.brand}
                onChange={(e) =>
                  setForm((f) => ({ ...f, brand: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, category: v as ProductCategory }))
                }
              >
                <SelectTrigger data-ocid="products.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="prod-notes">Notes</Label>
              <Textarea
                id="prod-notes"
                placeholder="Usage tips, skin type, etc."
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                rows={3}
                data-ocid="products.textarea"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="products.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              data-ocid="products.submit_button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingProduct ? "Save" : "Add Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent
          className="rounded-2xl max-w-xs"
          data-ocid="products.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle>Remove product?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove the product from your collection.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmId(null)}
              data-ocid="products.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirmId !== null && handleDelete(deleteConfirmId)
              }
              disabled={deleteProduct.isPending}
              data-ocid="products.delete.confirm_button"
            >
              {deleteProduct.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
