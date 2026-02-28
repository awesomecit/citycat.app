import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useWalletStore, type ExpenseCategory } from "@/stores/walletStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wallet, Camera, FileText, AlertTriangle, TrendingUp,
  Stethoscope, UtensilsCrossed, ShoppingBag, Scissors, Shield, MoreHorizontal,
  ChevronDown, ChevronUp, Download,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

const catIcons: Record<ExpenseCategory, React.ReactNode> = {
  veterinary: <Stethoscope className="h-4 w-4" />,
  food: <UtensilsCrossed className="h-4 w-4" />,
  accessories: <ShoppingBag className="h-4 w-4" />,
  grooming: <Scissors className="h-4 w-4" />,
  insurance: <Shield className="h-4 w-4" />,
  other: <MoreHorizontal className="h-4 w-4" />,
};

const catColors: Record<ExpenseCategory, string> = {
  veterinary: "175 55% 40%",
  food: "25 85% 55%",
  accessories: "270 55% 55%",
  grooming: "330 50% 45%",
  insurance: "220 70% 55%",
  other: "0 0% 50%",
};

const PremiumWallet = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { expenses, budgetAlerts } = useWalletStore();
  const [showOcr, setShowOcr] = useState(false);
  const [groupBy, setGroupBy] = useState<"date" | "category">("date");

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const totalMonth = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);

  if (!isLoggedIn) return null;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("premium.walletTitle")} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Total card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t("premium.monthlySpend")}</p>
                <p className="text-3xl font-extrabold text-foreground">€{totalMonth}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                <Wallet className="h-7 w-7 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setShowOcr(true)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground"
              >
                <Camera className="h-3.5 w-3.5" /> {t("premium.scanReceipt")}
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground">
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
            </div>
          </motion.div>

          {/* OCR mock modal */}
          {showOcr && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border-2 border-dashed border-primary/30 bg-card p-6 text-center space-y-3"
            >
              <Camera className="mx-auto h-10 w-10 text-primary/40" />
              <p className="text-sm font-bold text-foreground">{t("premium.ocrTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("premium.ocrDesc")}</p>
              <div className="rounded-xl bg-secondary/50 p-3 text-left space-y-1">
                <p className="text-[10px] text-muted-foreground">{t("premium.ocrPreview")}</p>
                <p className="text-xs font-mono text-foreground">Clinica Vet Roma Nord</p>
                <p className="text-xs font-mono text-foreground">Vaccino RCP ......... €45,00</p>
                <p className="text-xs font-mono text-foreground">IVA 22% ............. €9,90</p>
                <p className="text-xs font-mono font-bold text-foreground">TOTALE .............. €54,90</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowOcr(false)}
                  className="flex-1 rounded-xl border border-border py-2 text-xs font-bold text-muted-foreground"
                >
                  {t("premium.cancel")}
                </button>
                <button
                  onClick={() => setShowOcr(false)}
                  className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground"
                >
                  {t("premium.confirmSave")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Budget alerts */}
          {budgetAlerts.filter((a) => a.currentSpend >= a.monthlyLimit).length > 0 && (
            <section className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <AlertTriangle className="h-4 w-4 text-destructive" /> {t("premium.budgetAlerts")}
              </h3>
              {budgetAlerts
                .filter((a) => a.currentSpend >= a.monthlyLimit)
                .map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${catColors[a.category]} / 0.15)`, color: `hsl(${catColors[a.category]})` }}>
                      {catIcons[a.category]}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">{t(`premium.cat_${a.category}`)}</p>
                      <p className="text-[10px] text-destructive">€{a.currentSpend} / €{a.monthlyLimit}</p>
                    </div>
                    <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-bold text-destructive">
                      +{Math.round(((a.currentSpend - a.monthlyLimit) / a.monthlyLimit) * 100)}%
                    </span>
                  </div>
                ))}
            </section>
          )}

          {/* Category breakdown */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <TrendingUp className="h-4 w-4 text-muted-foreground" /> {t("premium.breakdown")}
            </h3>
            <div className="space-y-2">
              {byCategory.map(([cat, amount]) => {
                const pct = Math.round((amount / totalAll) * 100);
                return (
                  <div key={cat} className="rounded-xl bg-card border border-border p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ backgroundColor: `hsl(${catColors[cat as ExpenseCategory]} / 0.15)`, color: `hsl(${catColors[cat as ExpenseCategory]})` }}>
                        {catIcons[cat as ExpenseCategory]}
                      </div>
                      <span className="text-xs font-bold text-foreground flex-1">{t(`premium.cat_${cat}`)}</span>
                      <span className="text-xs font-bold text-foreground">€{amount}</span>
                      <span className="text-[10px] text-muted-foreground">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: `hsl(${catColors[cat as ExpenseCategory]})` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent expenses */}
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">{t("premium.recentExpenses")}</h3>
              <div className="flex rounded-lg bg-secondary p-0.5 text-[10px]">
                <button onClick={() => setGroupBy("date")} className={`px-2 py-1 rounded-md font-bold transition-all ${groupBy === "date" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                  {t("premium.byDate")}
                </button>
                <button onClick={() => setGroupBy("category")} className={`px-2 py-1 rounded-md font-bold transition-all ${groupBy === "category" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
                  {t("premium.byCategory")}
                </button>
              </div>
            </div>
            {expenses.slice(0, 8).map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${catColors[e.category]} / 0.15)`, color: `hsl(${catColors[e.category]})` }}>
                  {catIcons[e.category]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{e.description}</p>
                  <p className="text-[10px] text-muted-foreground">{format(new Date(e.date), "dd MMM", { locale: it })}{e.ocrExtracted ? " · 📸 OCR" : ""}</p>
                </div>
                <span className="text-sm font-extrabold text-foreground">€{e.amount}</span>
              </div>
            ))}
          </section>

          {/* Export buttons */}
          <div className="flex gap-2">
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-3 text-xs font-bold text-muted-foreground">
              <FileText className="h-3.5 w-3.5" /> {t("premium.exportMonthly")}
            </button>
            <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-3 text-xs font-bold text-muted-foreground">
              <FileText className="h-3.5 w-3.5" /> {t("premium.exportAnnual")}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default PremiumWallet;
