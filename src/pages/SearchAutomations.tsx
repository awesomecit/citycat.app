import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Plus, Trash2, MapPin, Cat, Filter, Zap,
  ToggleLeft, ToggleRight,
} from "lucide-react";

interface Automation {
  id: string;
  label: string;
  breed?: string;
  gender?: string;
  maxAge?: number;
  maxDistance?: number;
  compatibility?: string[];
  active: boolean;
  matchCount: number;
}

const MOCK_AUTOMATIONS: Automation[] = [
  {
    id: "auto1",
    label: "Certosino maschio adulto vicino",
    breed: "Certosino",
    gender: "male",
    maxAge: 8,
    maxDistance: 30,
    active: true,
    matchCount: 2,
  },
  {
    id: "auto2",
    label: "Gatto compatibile con bambini",
    compatibility: ["children"],
    active: true,
    matchCount: 5,
  },
  {
    id: "auto3",
    label: "Maine Coon femmina",
    breed: "Maine Coon",
    gender: "female",
    active: false,
    matchCount: 0,
  },
];

const SearchAutomations = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [automations, setAutomations] = useState(MOCK_AUTOMATIONS);
  const [showCreate, setShowCreate] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newBreed, setNewBreed] = useState("");
  const [newMaxDist, setNewMaxDist] = useState(30);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAutomation = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  };

  const createAutomation = () => {
    if (!newLabel.trim()) return;
    setAutomations((prev) => [
      {
        id: `auto-${Date.now()}`,
        label: newLabel,
        breed: newBreed || undefined,
        maxDistance: newMaxDist,
        active: true,
        matchCount: 0,
      },
      ...prev,
    ]);
    setNewLabel("");
    setNewBreed("");
    setShowCreate(false);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("premium.automationsTitle")} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <p className="text-sm font-bold text-foreground">{t("premium.automationsDesc")}</p>
            </div>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> {t("premium.newAutomation")}
            </button>
          </div>

          {/* Create form */}
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border-2 border-primary/30 bg-card p-4 space-y-3"
            >
              <p className="text-xs font-bold text-foreground">{t("premium.createAutomation")}</p>
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder={t("premium.automationNamePlaceholder")}
                className="w-full rounded-xl border border-border bg-background p-3 text-sm"
              />
              <div className="flex gap-2">
                <input
                  value={newBreed}
                  onChange={(e) => setNewBreed(e.target.value)}
                  placeholder={t("premium.breedFilter")}
                  className="flex-1 rounded-xl border border-border bg-background p-3 text-sm"
                />
                <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    type="number"
                    value={newMaxDist}
                    onChange={(e) => setNewMaxDist(Number(e.target.value))}
                    className="w-12 bg-transparent text-sm text-center"
                  />
                  <span className="text-xs text-muted-foreground">km</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowCreate(false)} className="flex-1 rounded-xl border border-border py-2 text-xs font-bold text-muted-foreground">
                  {t("premium.cancel")}
                </button>
                <button onClick={createAutomation} className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground">
                  {t("premium.create")}
                </button>
              </div>
            </motion.div>
          )}

          {/* Automations list */}
          {automations.length === 0 ? (
            <div className="py-12 text-center">
              <Bell className="mx-auto h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">{t("premium.noAutomations")}</p>
            </div>
          ) : (
            automations.map((auto) => (
              <motion.div
                key={auto.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`rounded-2xl border bg-card p-4 space-y-2 ${auto.active ? "border-primary/20" : "border-border opacity-60"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{auto.label}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {auto.breed && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          <Cat className="inline h-2.5 w-2.5 mr-0.5" />{auto.breed}
                        </span>
                      )}
                      {auto.maxDistance && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          <MapPin className="inline h-2.5 w-2.5 mr-0.5" />≤{auto.maxDistance}km
                        </span>
                      )}
                      {auto.gender && (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {auto.gender === "male" ? "♂" : "♀"}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => toggleAutomation(auto.id)}>
                    {auto.active ? (
                      <ToggleRight className="h-6 w-6 text-primary" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {auto.matchCount > 0
                      ? t("premium.matchesFound", { count: auto.matchCount })
                      : t("premium.noMatchesYet")}
                  </span>
                  <button onClick={() => deleteAutomation(auto.id)} className="rounded-lg p-1.5 text-destructive/50 hover:text-destructive hover:bg-destructive/5 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default SearchAutomations;
