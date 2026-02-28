import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useFeedbackStore, type FeedbackCategory } from "@/stores/feedbackStore";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import { Shield, Bug, Lightbulb, Frown, AlertTriangle, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const CAT_META: Record<FeedbackCategory, { icon: typeof Bug; color: string; labelKey: string }> = {
  bug: { icon: Bug, color: "0 60% 50%", labelKey: "feedback.cat_bug" },
  feature: { icon: Lightbulb, color: "45 90% 50%", labelKey: "feedback.cat_feature" },
  ux: { icon: Frown, color: "270 55% 55%", labelKey: "feedback.cat_ux" },
  logic: { icon: AlertTriangle, color: "25 85% 55%", labelKey: "feedback.cat_logic" },
  domain: { icon: BookOpen, color: "175 55% 40%", labelKey: "feedback.cat_domain" },
};

const AdminFeedback = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const entries = useFeedbackStore((s) => s.entries);

  const [filterCat, setFilterCat] = useState<FeedbackCategory | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filterCat === "all") return entries;
    return entries.filter((e) => e.category === filterCat);
  }, [entries, filterCat]);

  if (!user || user.activeRole !== "admin") {
    return (
      <PageTransition>
        <GlobalHeader />
        <main className="pt-16 pb-24 px-4 text-center text-muted-foreground">
          <Shield className="mx-auto h-12 w-12 mb-3" />
          {t("adminUsers.noAccess")}
        </main>
        <BottomNav />
      </PageTransition>
    );
  }


  const categories: (FeedbackCategory | "all")[] = ["all", "bug", "feature", "ux", "logic", "domain"];

  return (
    <PageTransition>
      <GlobalHeader />
      <main className="pt-16 pb-24 px-4 max-w-lg mx-auto space-y-4">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Bug className="h-5 w-5 text-primary" />
          {t("feedback.adminTitle")}
        </h1>

        {/* Category chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => {
            const active = cat === filterCat;
            const count = cat === "all" ? entries.length : entries.filter((e) => e.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilterCat(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"
                }`}
              >
                {cat === "all" ? t("filters.all") : t(CAT_META[cat].labelKey)} ({count})
              </button>
            );
          })}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">{t("feedback.empty")}</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((entry) => {
              const meta = CAT_META[entry.category];
              const Icon = meta.icon;
              const isExpanded = expanded === entry.id;
              return (
                <div key={entry.id} className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : entry.id)}
                    className="w-full flex items-start gap-3 p-3 text-left"
                  >
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
                      style={{ backgroundColor: `hsl(${meta.color} / 0.12)` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: `hsl(${meta.color})` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-2">{entry.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-[10px]">{t(meta.labelKey)}</Badge>
                        <span className="text-[10px] text-muted-foreground">{entry.userName} · {format(new Date(entry.createdAt), "dd/MM HH:mm")}</span>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 mt-1" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />}
                  </button>
                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2 border-t border-border pt-2">
                      <div className="rounded-xl bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground space-y-0.5 font-mono">
                        <p>📍 {t("feedback.debugPath")}: {entry.currentPath}</p>
                        <p>👤 {entry.userEmail} ({entry.activeRole})</p>
                        <p>📐 {t("feedback.debugViewport")}: {entry.viewport.width}×{entry.viewport.height}</p>
                      </div>
                      <details className="text-[10px]">
                        <summary className="cursor-pointer text-muted-foreground font-semibold">{t("feedback.debugStore")}</summary>
                        <pre className="mt-1 max-h-40 overflow-auto rounded-lg bg-muted p-2 text-[9px] text-muted-foreground">
                          {JSON.stringify(entry.storeSnapshot, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </PageTransition>
  );
};

export default AdminFeedback;
