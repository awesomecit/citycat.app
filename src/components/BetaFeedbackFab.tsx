import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useFeedbackStore, type FeedbackCategory } from "@/stores/feedbackStore";
import { useToast } from "@/hooks/use-toast";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { MessageSquarePlus, Bug, Lightbulb, Frown, AlertTriangle, BookOpen, Send } from "lucide-react";

const CATEGORIES: { value: FeedbackCategory; icon: typeof Bug; color: string; labelKey: string }[] = [
  { value: "bug", icon: Bug, color: "0 60% 50%", labelKey: "feedback.cat_bug" },
  { value: "feature", icon: Lightbulb, color: "45 90% 50%", labelKey: "feedback.cat_feature" },
  { value: "ux", icon: Frown, color: "270 55% 55%", labelKey: "feedback.cat_ux" },
  { value: "logic", icon: AlertTriangle, color: "25 85% 55%", labelKey: "feedback.cat_logic" },
  { value: "domain", icon: BookOpen, color: "175 55% 40%", labelKey: "feedback.cat_domain" },
];

const BetaFeedbackFab = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const addEntry = useFeedbackStore((s) => s.addEntry);

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory>("bug");
  const [message, setMessage] = useState("");

  if (!user) return null;

  const canSend = message.trim().length >= 10;

  const handleSend = () => {
    if (!canSend) return;

    // Capture debug context automatically
    const storeSnapshot: Record<string, unknown> = {};
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith("citycat-")) {
          try {
            storeSnapshot[key] = JSON.parse(localStorage.getItem(key) || "{}");
          } catch { /* skip */ }
        }
      }
    } catch { /* skip */ }

    addEntry({
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString(),
      category,
      message: message.trim(),
      userEmail: user.email,
      userName: user.name,
      activeRole: user.activeRole,
      currentPath: location.pathname,
      viewport: { width: window.innerWidth, height: window.innerHeight },
      storeSnapshot,
    });

    toast({ title: t("feedback.sentTitle"), description: t("feedback.sentDesc") });
    setMessage("");
    setCategory("bug");
    setOpen(false);
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95 transition-transform"
        aria-label={t("feedback.fabLabel")}
      >
        <MessageSquarePlus className="h-5 w-5" />
      </button>

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <MessageSquarePlus className="h-5 w-5 text-primary" />
              {t("feedback.title")}
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 space-y-4 pb-2">
            {/* Debug info pill */}
            <div className="rounded-xl bg-muted/50 px-3 py-2 text-[10px] text-muted-foreground space-y-0.5">
              <p>📍 {location.pathname} · 👤 {user.name} ({user.activeRole})</p>
              <p>📐 {window.innerWidth}×{window.innerHeight}</p>
            </div>

            {/* Category chips */}
            <div>
              <label className="text-xs font-bold text-foreground mb-2 block">{t("feedback.categoryLabel")}</label>
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      category === cat.value ? "shadow-sm" : "opacity-40 hover:opacity-70"
                    }`}
                    style={{
                      backgroundColor: `hsl(${cat.color} / ${category === cat.value ? 0.15 : 0.06})`,
                      color: `hsl(${cat.color})`,
                    }}
                  >
                    <cat.icon className="h-3.5 w-3.5" />
                    {t(cat.labelKey)}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-xs font-bold text-foreground mb-1.5 block">{t("feedback.messageLabel")}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder={t("feedback.messagePlaceholder")}
                rows={3}
                className="w-full rounded-xl border border-input bg-card py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className="mt-1 text-[10px] text-muted-foreground text-right">{message.length}/500</p>
            </div>
          </div>

          <DrawerFooter>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all active:scale-[0.98] disabled:opacity-40"
            >
              <Send className="h-4 w-4" /> {t("feedback.send")}
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BetaFeedbackFab;
