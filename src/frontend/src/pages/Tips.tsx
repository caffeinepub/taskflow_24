import { SkinType } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTips } from "@/hooks/useQueries";
import { Lightbulb, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const SKIN_TYPES = ["All", ...Object.values(SkinType)] as const;

const skinTypeBadgeColor: Record<string, string> = {
  All: "bg-rose-50 text-rose-600 border-rose-200",
  Oily: "bg-blue-50 text-blue-600 border-blue-200",
  Dry: "bg-amber-50 text-amber-600 border-amber-200",
  Combination: "bg-purple-50 text-purple-600 border-purple-200",
  Sensitive: "bg-pink-50 text-pink-600 border-pink-200",
};

const FALLBACK_TIPS = [
  {
    id: BigInt(1),
    title: "Double Cleanse at Night",
    content:
      "Use an oil-based cleanser to remove sunscreen and makeup, followed by a water-based cleanser to clean your skin. This ensures all traces of product are removed without stripping your skin's natural oils.",
    skinType: SkinType.All,
  },
  {
    id: BigInt(2),
    title: "Hydrate From the Inside Out",
    content:
      "Drinking at least 8 glasses of water a day helps maintain skin elasticity, flushes out toxins, and gives your complexion a natural glow. Pair with hyaluronic acid-based serums for maximum hydration.",
    skinType: SkinType.Dry,
  },
  {
    id: BigInt(3),
    title: "Never Skip SPF",
    content:
      "Sun protection is the single most effective anti-aging step you can take. Apply SPF 30+ every morning — even on cloudy days — and reapply every 2 hours if you're outdoors.",
    skinType: SkinType.All,
  },
  {
    id: BigInt(4),
    title: "Don't Over-Exfoliate Oily Skin",
    content:
      "Over-exfoliating can strip the skin's moisture barrier, causing it to produce even more oil to compensate. Limit chemical exfoliation to 2-3 times a week and avoid scrubbing aggressively.",
    skinType: SkinType.Oily,
  },
  {
    id: BigInt(5),
    title: "Layer Thin to Thick",
    content:
      "Always apply skincare products from thinnest to thickest: toner, essence, serum, moisturizer, oil, then SPF. This ensures each layer absorbs properly.",
    skinType: SkinType.All,
  },
  {
    id: BigInt(6),
    title: "Patch Test New Products",
    content:
      "Before adding any new product to your routine, apply a small amount to the inside of your wrist for 24-48 hours. Especially important for sensitive skin types prone to reactions.",
    skinType: SkinType.Sensitive,
  },
  {
    id: BigInt(7),
    title: "Balance Your T-Zone",
    content:
      "For combination skin, try multi-masking: apply a clay mask to oily areas and a hydrating mask to dry areas simultaneously. This targets both concerns without over-treating any zone.",
    skinType: SkinType.Combination,
  },
];

export default function Tips() {
  const { data: backendTips, isLoading } = useTips();
  const [filterType, setFilterType] = useState<string>("All");

  const tips =
    backendTips && backendTips.length > 0 ? backendTips : FALLBACK_TIPS;

  const filtered = tips.filter(
    (t) =>
      filterType === "All" ||
      t.skinType === filterType ||
      t.skinType === SkinType.All,
  );

  return (
    <div className="page-enter">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Skincare Tips</h1>
            <p className="text-xs text-muted-foreground">
              Expert advice for your skin type
            </p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {SKIN_TYPES.map((type) => (
            <button
              type="button"
              key={type}
              data-ocid={`tips.${type.toLowerCase()}.tab`}
              onClick={() => setFilterType(type)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                filterType === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      <div className="px-4 md:px-6 py-4">
        {isLoading ? (
          <div className="space-y-3" data-ocid="tips.loading_state">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="tips.empty_state">
            <Lightbulb className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No tips for this skin type yet
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((tip, idx) => (
              <motion.div
                key={String(tip.id)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                data-ocid={`tips.item.${idx + 1}`}
              >
                <Card className="glow-card border-border/60">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-semibold text-foreground leading-snug">
                        <Lightbulb className="w-4 h-4 text-primary inline mr-1.5 -mt-0.5" />
                        {tip.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={`text-xs shrink-0 ${skinTypeBadgeColor[tip.skinType] ?? skinTypeBadgeColor.All}`}
                      >
                        {tip.skinType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tip.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
