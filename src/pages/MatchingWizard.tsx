import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useShelterCatStore } from "@/stores/shelterCatStore";
import { mockCats } from "@/api/mockData";
import { matchAllCats, type LifestyleAnswers, type MatchResult } from "@/lib/matchingAlgorithm";
import { getCatPhoto } from "@/lib/catPhotos";
import { isHeartAdoption } from "@/lib/heartAdoption";
import { useTierStore, FREE_LIMITS } from "@/stores/tierStore";
import { useMatchingProfileStore } from "@/stores/matchingProfileStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Clock, Baby, Cat, Dog, Home, Zap,
  GraduationCap, Wallet, Volume2, Heart, ChevronRight,
  ArrowLeft, ArrowRight, Check, RotateCcw, Lock, Crown,
  Bell, Save, X,
} from "lucide-react";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const defaultAnswers: LifestyleAnswers = {
  hoursAway: 4,
  hasChildren: false,
  hasOtherCats: false,
  hasOtherDogs: false,
  livingSpace: "medium",
  energyPreference: "moderate",
  experienceLevel: "some",
  monthlyBudget: "medium",
  specialSituation: "none",
  noisePreference: "normal",
};

const MatchingWizard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { cats: shelterCats } = useShelterCatStore();
  const tier = useTierStore((s) => s.tier);
  const { savedProfile, alerts, saveProfile, markAlertRead } = useMatchingProfileStore();

  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<LifestyleAnswers>(savedProfile || defaultAnswers);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [direction, setDirection] = useState(1);
  const [showAlerts, setShowAlerts] = useState(false);
  const isFree = tier === "free";
  const unreadAlerts = alerts.filter((a) => !a.read);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const allCats = [...shelterCats, ...mockCats];

  const next = () => {
    if (step < 5) {
      setDirection(1);
      setStep((s) => (s + 1) as Step);
    } else {
      // Calculate results
      const res = matchAllCats(answers, allCats);
      setResults(res);
    }
  };

  const prev = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1) as Step);
  };

  const reset = () => {
    setAnswers(defaultAnswers);
    setStep(0);
    setResults(null);
  };

  const setA = (partial: Partial<LifestyleAnswers>) => setAnswers({ ...answers, ...partial });

  // Option button helper
  const Opt = ({ selected, onClick, children, icon }: {
    selected: boolean; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-2xl border-2 p-3.5 text-left transition-all ${
        selected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-card hover:border-primary/30"
      }`}
    >
      {icon && <span className={`text-lg ${selected ? "opacity-100" : "opacity-50"}`}>{icon}</span>}
      <span className={`text-sm font-semibold ${selected ? "text-foreground" : "text-muted-foreground"}`}>{children}</span>
      {selected && <Check className="ml-auto h-4 w-4 text-primary" />}
    </button>
  );

  // Slider with value display
  const SliderQ = ({ value, onChange, min, max, unit, label }: {
    value: number; onChange: (v: number) => void; min: number; max: number; unit: string; label: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-lg font-extrabold text-primary">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary h-2 rounded-full appearance-none bg-secondary cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );

  // Toggle
  const Toggle = ({ value, onChange, label, icon }: {
    value: boolean; onChange: (v: boolean) => void; label: string; icon: React.ReactNode;
  }) => (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-3 rounded-2xl border-2 p-3.5 transition-all w-full ${
        value ? "border-primary bg-primary/10" : "border-border bg-card"
      }`}
    >
      <span className={`text-lg ${value ? "opacity-100" : "opacity-40"}`}>{icon}</span>
      <span className={`text-sm font-semibold flex-1 text-left ${value ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
      <div className={`h-6 w-11 rounded-full p-0.5 transition-colors ${value ? "bg-primary" : "bg-muted"}`}>
        <div className={`h-5 w-5 rounded-full bg-background shadow-sm transition-transform ${value ? "translate-x-5" : "translate-x-0"}`} />
      </div>
    </button>
  );

  const stepContent: Record<Step, React.ReactNode> = {
    // Step 0: Time away + household
    0: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15"><Clock className="h-5 w-5 text-primary" /></div>
          <div><p className="text-base font-bold text-foreground">{t("matching.q_hoursAway")}</p><p className="text-xs text-muted-foreground">{t("matching.q_hoursAwaySub")}</p></div>
        </div>
        <SliderQ value={answers.hoursAway} onChange={(v) => setA({ hoursAway: v })} min={0} max={12} unit="h" label={t("matching.hoursPerDay")} />
      </div>
    ),
    // Step 1: Family composition
    1: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15"><Home className="h-5 w-5 text-primary" /></div>
          <p className="text-base font-bold text-foreground">{t("matching.q_family")}</p>
        </div>
        <Toggle value={answers.hasChildren} onChange={(v) => setA({ hasChildren: v })} label={t("matching.hasChildren")} icon={<Baby className="h-5 w-5" />} />
        <Toggle value={answers.hasOtherCats} onChange={(v) => setA({ hasOtherCats: v })} label={t("matching.hasOtherCats")} icon={<Cat className="h-5 w-5" />} />
        <Toggle value={answers.hasOtherDogs} onChange={(v) => setA({ hasOtherDogs: v })} label={t("matching.hasOtherDogs")} icon={<Dog className="h-5 w-5" />} />
      </div>
    ),
    // Step 2: Living space
    2: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15"><Home className="h-5 w-5 text-primary" /></div>
          <p className="text-base font-bold text-foreground">{t("matching.q_space")}</p>
        </div>
        <div className="space-y-2">
          <Opt selected={answers.livingSpace === "small"} onClick={() => setA({ livingSpace: "small" })} icon="🏢">{t("matching.space_small")}</Opt>
          <Opt selected={answers.livingSpace === "medium"} onClick={() => setA({ livingSpace: "medium" })} icon="🏠">{t("matching.space_medium")}</Opt>
          <Opt selected={answers.livingSpace === "large"} onClick={() => setA({ livingSpace: "large" })} icon="🏡">{t("matching.space_large")}</Opt>
        </div>
      </div>
    ),
    // Step 3: Energy + noise preference
    3: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15"><Zap className="h-5 w-5 text-primary" /></div>
          <p className="text-base font-bold text-foreground">{t("matching.q_energy")}</p>
        </div>
        <div className="space-y-2">
          <Opt selected={answers.energyPreference === "calm"} onClick={() => setA({ energyPreference: "calm" })} icon="🧘">{t("matching.energy_calm")}</Opt>
          <Opt selected={answers.energyPreference === "moderate"} onClick={() => setA({ energyPreference: "moderate" })} icon="😸">{t("matching.energy_moderate")}</Opt>
          <Opt selected={answers.energyPreference === "active"} onClick={() => setA({ energyPreference: "active" })} icon="⚡">{t("matching.energy_active")}</Opt>
        </div>
        <div className="pt-2">
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Volume2 className="h-3.5 w-3.5" /> {t("matching.q_noise")}</p>
          <div className="space-y-2">
            <Opt selected={answers.noisePreference === "silent"} onClick={() => setA({ noisePreference: "silent" })} icon="🤫">{t("matching.noise_silent")}</Opt>
            <Opt selected={answers.noisePreference === "normal"} onClick={() => setA({ noisePreference: "normal" })} icon="😺">{t("matching.noise_normal")}</Opt>
            <Opt selected={answers.noisePreference === "noMatter"} onClick={() => setA({ noisePreference: "noMatter" })} icon="🎵">{t("matching.noise_noMatter")}</Opt>
          </div>
        </div>
      </div>
    ),
    // Step 4: Experience + budget
    4: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15"><GraduationCap className="h-5 w-5 text-primary" /></div>
          <p className="text-base font-bold text-foreground">{t("matching.q_experience")}</p>
        </div>
        <div className="space-y-2">
          <Opt selected={answers.experienceLevel === "first"} onClick={() => setA({ experienceLevel: "first" })} icon="🌱">{t("matching.exp_first")}</Opt>
          <Opt selected={answers.experienceLevel === "some"} onClick={() => setA({ experienceLevel: "some" })} icon="🐱">{t("matching.exp_some")}</Opt>
          <Opt selected={answers.experienceLevel === "expert"} onClick={() => setA({ experienceLevel: "expert" })} icon="🏆">{t("matching.exp_expert")}</Opt>
        </div>
        <div className="pt-2">
          <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5" /> {t("matching.q_budget")}</p>
          <div className="space-y-2">
            <Opt selected={answers.monthlyBudget === "low"} onClick={() => setA({ monthlyBudget: "low" })} icon="💰">{t("matching.budget_low")}</Opt>
            <Opt selected={answers.monthlyBudget === "medium"} onClick={() => setA({ monthlyBudget: "medium" })} icon="💰💰">{t("matching.budget_medium")}</Opt>
            <Opt selected={answers.monthlyBudget === "high"} onClick={() => setA({ monthlyBudget: "high" })} icon="💰💰💰">{t("matching.budget_high")}</Opt>
          </div>
        </div>
      </div>
    ),
    // Step 5: Special situations
    5: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15"><Heart className="h-5 w-5 text-primary" /></div>
          <div><p className="text-base font-bold text-foreground">{t("matching.q_special")}</p><p className="text-xs text-muted-foreground">{t("matching.q_specialSub")}</p></div>
        </div>
        <div className="space-y-2">
          <Opt selected={answers.specialSituation === "none"} onClick={() => setA({ specialSituation: "none" })} icon="✅">{t("matching.special_none")}</Opt>
          <Opt selected={answers.specialSituation === "pregnancy"} onClick={() => setA({ specialSituation: "pregnancy" })} icon="🤰">{t("matching.special_pregnancy")}</Opt>
          <Opt selected={answers.specialSituation === "elderly"} onClick={() => setA({ specialSituation: "elderly" })} icon="👴">{t("matching.special_elderly")}</Opt>
          <Opt selected={answers.specialSituation === "disability"} onClick={() => setA({ specialSituation: "disability" })} icon="♿">{t("matching.special_disability")}</Opt>
        </div>
      </div>
    ),
  };

  // RESULTS VIEW
  if (results) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col bg-background pb-16">
          <GlobalHeader title={t("matching.resultsTitle")} />
          <div className="mx-auto w-full max-w-lg space-y-4 p-4">
            {/* Alerts banner */}
            {unreadAlerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-primary/30 bg-primary/5 p-3 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <p className="text-xs font-bold text-foreground flex-1">{t("matching.newAlerts", { count: unreadAlerts.length })}</p>
                  <button onClick={() => setShowAlerts(!showAlerts)} className="text-[10px] font-bold text-primary">
                    {showAlerts ? t("premium.hide") : t("premium.show")}
                  </button>
                </div>
                {showAlerts && unreadAlerts.map((a) => (
                  <div key={a.id} className="flex items-center gap-2 rounded-xl bg-card border border-border p-2">
                    <span className="text-xs">🐱</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">{a.catName}</p>
                      <p className="text-[10px] text-primary">{t("matching.alertScore", { score: a.score })}</p>
                    </div>
                    <button onClick={() => { markAlertRead(a.id); navigate(`/cats/${a.catId}`); }} className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                      {t("matching.viewProfile")}
                    </button>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Save profile button */}
            {!isFree && (
              <button
                onClick={() => saveProfile(answers)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2 text-xs font-bold text-muted-foreground hover:bg-secondary/80 transition-colors"
              >
                <Save className="h-3.5 w-3.5" /> {t("matching.saveProfile")}
              </button>
            )}

            <div className="text-center mb-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold text-primary">{results.length} {t("matching.catsAnalyzed")}</span>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground">{t("matching.noMatches")}</p>
              </div>
            ) : (
              <>
                {(isFree ? results.slice(0, FREE_LIMITS.matchingResults) : results).map((m, i) => {
                  const photo = getCatPhoto(m.cat.id);
                  const isHeart = isHeartAdoption(m.cat);
                  const scoreColor = m.score >= 75 ? "142 60% 45%" : m.score >= 50 ? "45 90% 50%" : "0 60% 50%";

                  return (
                    <motion.div
                      key={m.cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="rounded-2xl border border-border bg-card overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center gap-3">
                          {photo ? (
                            <img src={photo} alt={m.cat.name} className="h-14 w-14 rounded-xl object-cover" />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-xl font-extrabold text-primary">
                              {m.cat.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              {i === 0 && <span className="text-xs">🏆</span>}
                              <p className="text-sm font-bold text-foreground">{m.cat.name}</p>
                              {isHeart && <span className="rounded-full bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive">❤️</span>}
                            </div>
                            <p className="text-xs text-muted-foreground">{m.cat.breed} · {m.cat.age} {t("missing.years")}</p>
                          </div>
                          {/* Score circle */}
                          <div className="relative flex h-14 w-14 items-center justify-center">
                            <svg className="h-14 w-14 -rotate-90" viewBox="0 0 48 48">
                              <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                              <circle
                                cx="24" cy="24" r="20" fill="none"
                                stroke={`hsl(${scoreColor})`}
                                strokeWidth="3"
                                strokeDasharray={`${(m.score / 100) * 125.6} 125.6`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <span className="absolute text-sm font-extrabold" style={{ color: `hsl(${scoreColor})` }}>{m.score}%</span>
                          </div>
                        </div>

                        {/* Reasons */}
                        <div className="mt-3 space-y-1.5">
                          {m.reasons.map((r, ri) => (
                            <div key={ri} className="flex items-start gap-2">
                              <span className={`mt-0.5 text-xs ${r.positive ? "text-primary" : "text-destructive"}`}>
                                {r.positive ? "✓" : "✗"}
                              </span>
                              <span className="text-xs text-foreground">{t(r.key)}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => navigate(`/cats/${m.cat.id}`)}
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/15"
                        >
                          {t("matching.viewProfile")} <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Free tier paywall */}
                {isFree && results.length > FREE_LIMITS.matchingResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: FREE_LIMITS.matchingResults * 0.08 }}
                    className="rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-b from-primary/5 to-primary/10 p-6 text-center space-y-3"
                  >
                    <div className="flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {t("matching.premiumTitle", { count: results.length - FREE_LIMITS.matchingResults })}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">{t("matching.premiumDesc")}</p>
                    </div>
                    {/* Blurred preview of next results */}
                    <div className="space-y-2 opacity-40 blur-[2px] pointer-events-none">
                      {results.slice(FREE_LIMITS.matchingResults, FREE_LIMITS.matchingResults + 2).map((m) => (
                        <div key={m.cat.id} className="flex items-center gap-3 rounded-xl bg-card p-3">
                          <div className="h-10 w-10 rounded-lg bg-muted" />
                          <div className="flex-1">
                            <div className="h-3 w-20 rounded bg-muted" />
                            <div className="mt-1 h-2 w-14 rounded bg-muted" />
                          </div>
                          <div className="h-10 w-10 rounded-full bg-muted" />
                        </div>
                      ))}
                    </div>
                    <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98]">
                      <Crown className="h-4 w-4" /> {t("matching.upgradeCta")}
                    </button>
                    <p className="text-[10px] text-muted-foreground">{t("matching.freeTierNote")}</p>
                  </motion.div>
                )}
              </>
            )}

            <button
              onClick={reset}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-3 text-sm font-bold text-muted-foreground hover:bg-secondary/50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> {t("matching.retake")}
            </button>
          </div>
        </div>
        <BottomNav />
      </PageTransition>
    );
  }

  // WIZARD VIEW
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("matching.title")} />
        <div className="mx-auto w-full max-w-lg p-4 space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{t("matching.step", { current: step + 1, total: 6 })}</span>
              <span>{Math.round(((step + 1) / 6) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${((step + 1) / 6) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {/* Content with animation */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.2 }}
            >
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <button onClick={prev} className="flex items-center gap-1.5 rounded-2xl border border-border px-5 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-secondary">
                <ArrowLeft className="h-4 w-4" /> {t("matching.back")}
              </button>
            )}
            <button
              onClick={next}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
            >
              {step === 5 ? (
                <><Sparkles className="h-4 w-4" /> {t("matching.findMatches")}</>
              ) : (
                <>{t("matching.next")} <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default MatchingWizard;
