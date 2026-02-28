import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAdoptionStore, type AdoptionApplication } from "@/stores/adoptionStore";
import { useCampaignStore, DEFAULT_ROUTINE_TEMPLATE, type AdoptionCampaign, type CampaignRoutineTemplate } from "@/stores/campaignStore";
import { useShelterCatStore } from "@/stores/shelterCatStore";
import { getCatPhoto } from "@/lib/catPhotos";
import { calculateScore, scoreColor, scoreBgColor, type ScoringResult } from "@/lib/adoptionScoring";
import PageTransition from "@/components/PageTransition";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import RoutineLine from "@/components/RoutineLine";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState, useMemo } from "react";
import {
  CheckCircle2, XCircle, ChevronDown, Plus, Megaphone,
  Pause, Play, Trash2, GripVertical, X, Check, Eye, BarChart3, Clock, MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ShelterCampaigns = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const { applications, routineSteps, updateApplicationStatus, updateRoutineStep } = useAdoptionStore();
  const { campaigns, createCampaign, updateCampaignStatus, deleteCampaign } = useCampaignStore();
  const { cats: shelterCats } = useShelterCatStore();
  const { toast } = useToast();

  const [tab, setTab] = useState<"campaigns" | "applications">("campaigns");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [showScoreDetail, setShowScoreDetail] = useState<string | null>(null);

  // Decision dialog state
  const [decisionApp, setDecisionApp] = useState<AdoptionApplication | null>(null);
  const [decisionAction, setDecisionAction] = useState<"approved" | "rejected" | "waitlisted">("approved");
  const [decisionNote, setDecisionNote] = useState("");

  // Campaign creation state
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [routineTemplate, setRoutineTemplate] = useState<CampaignRoutineTemplate[]>(
    DEFAULT_ROUTINE_TEMPLATE.map((s) => ({ ...s }))
  );

  // Scoring - must be before early return
  const pendingApps = applications.filter((a) => a.status !== "completed" && a.status !== "rejected");
  const scoredApps = useMemo(() => {
    return pendingApps
      .map((app) => ({ app, scoring: calculateScore(app) }))
      .sort((a, b) => b.scoring.total - a.scoring.total);
  }, [pendingApps]);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!user) return null;

  // Cats without a campaign
  const catsWithCampaign = new Set(campaigns.map((c) => c.catId));
  const availableCats = shelterCats.filter(
    (c) => (c.status === "adoption" || c.status === "sheltered") && !catsWithCampaign.has(c.id)
  );

  const toggleStep = (stepId: string) => {
    setRoutineTemplate((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, mandatory: !s.mandatory } : s))
    );
  };

  const removeStep = (stepId: string) => {
    setRoutineTemplate((prev) => prev.filter((s) => s.id !== stepId));
  };

  const handleCreate = () => {
    if (!selectedCatId) return;
    const cat = shelterCats.find((c) => c.id === selectedCatId);
    if (!cat) return;

    const activeSteps = routineTemplate.filter((s) => s.mandatory || routineTemplate.includes(s));

    const campaign: AdoptionCampaign = {
      id: `camp-${Date.now()}`,
      catId: selectedCatId,
      catName: cat.name,
      shelterName: user.name,
      status: "active",
      createdAt: new Date().toISOString(),
      routineTemplate: activeSteps,
      applicationsCount: 0,
    };

    createCampaign(campaign);
    setShowCreate(false);
    setSelectedCatId(null);
    setRoutineTemplate(DEFAULT_ROUTINE_TEMPLATE.map((s) => ({ ...s })));
    toast({
      title: t("shelterCampaigns.createdTitle"),
      description: t("shelterCampaigns.createdDesc", { name: cat.name }),
    });
  };

  const openDecision = (app: AdoptionApplication, action: "approved" | "rejected" | "waitlisted") => {
    setDecisionApp(app);
    setDecisionAction(action);
    setDecisionNote("");
  };

  const handleConfirmDecision = () => {
    if (!decisionApp || !decisionNote.trim()) return;

    updateApplicationStatus(decisionApp.id, decisionAction, decisionNote.trim());

    if (decisionAction === "approved") {
      const steps = routineSteps[decisionApp.id] || [];
      const currentStep = steps.find((s) => s.status === "inProgress");
      if (currentStep) {
        updateRoutineStep(decisionApp.id, currentStep.id, "done");
        const nextStep = steps.find((s) => s.status === "pending");
        if (nextStep) updateRoutineStep(decisionApp.id, nextStep.id, "inProgress");
      }
    }

    const toastKeys: Record<string, { title: string; desc: string }> = {
      approved: { title: "campaigns.approvedTitle", desc: "campaigns.approvedDesc" },
      rejected: { title: "campaigns.rejectedTitle", desc: "campaigns.rejectedDesc" },
      waitlisted: { title: "campaigns.waitlistedTitle", desc: "campaigns.waitlistedDesc" },
    };
    const k = toastKeys[decisionAction];
    toast({ title: t(k.title), description: t(k.desc, { name: decisionApp.applicantName }) });
    setDecisionApp(null);
  };

  const statusColor = (status: AdoptionCampaign["status"]) => {
    switch (status) {
      case "active": return "bg-primary/10 text-primary";
      case "paused": return "bg-accent text-accent-foreground";
      case "closed": return "bg-muted text-muted-foreground";
    }
  };

  // Campaign creation form
  if (showCreate) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col bg-background pb-16">
          <GlobalHeader title={t("shelterCampaigns.newCampaign")} />
          <main className="flex-1 p-4 pt-20 max-w-lg mx-auto space-y-4">
            {/* Select cat */}
            <section className="rounded-2xl border border-border bg-card p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">{t("shelterCampaigns.selectCat")}</h3>
              {availableCats.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("shelterCampaigns.noCatsAvailable")}</p>
              ) : (
                <div className="space-y-2">
                  {availableCats.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCatId(cat.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${
                        selectedCatId === cat.id
                          ? "border-primary bg-primary/5"
                          : "border-input hover:bg-secondary"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-extrabold text-primary">
                        {cat.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">{cat.name}</p>
                        <p className="text-xs text-muted-foreground">{cat.breed} · {cat.gender === "female" ? "♀" : "♂"} · {t("cats.age", { count: cat.age })}</p>
                      </div>
                      {selectedCatId === cat.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Configure RoutineLine */}
            {selectedCatId && (
              <section className="rounded-2xl border border-border bg-card p-4">
                <h3 className="text-sm font-bold text-foreground mb-2">{t("shelterCampaigns.configureRoutine")}</h3>
                <p className="text-xs text-muted-foreground mb-3">{t("shelterCampaigns.routineHint")}</p>

                <div className="space-y-2">
                  {routineTemplate.map((step, i) => {
                    const isFirst = i === 0;
                    const isLast = i === routineTemplate.length - 1;
                    const isFixed = isFirst || isLast; // first & last steps can't be removed

                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 transition-colors ${
                          step.mandatory ? "border-primary/30 bg-primary/5" : "border-input"
                        }`}
                      >
                        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{t(step.title)}</p>
                          <p className="text-[10px] text-muted-foreground">{t(step.roleKey)}</p>
                        </div>
                        <button
                          onClick={() => toggleStep(step.id)}
                          className={`rounded-lg px-2 py-1 text-[10px] font-bold transition-colors ${
                            step.mandatory
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.mandatory ? t("shelterCampaigns.mandatory") : t("shelterCampaigns.optional")}
                        </button>
                        {!isFixed && (
                          <button onClick={() => removeStep(step.id)} className="text-muted-foreground hover:text-destructive">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Preview */}
                <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-3">
                  <p className="text-xs font-bold text-muted-foreground mb-2">{t("shelterCampaigns.preview")}</p>
                  <RoutineLine
                    steps={routineTemplate.map((s, i) => ({
                      id: s.id,
                      title: s.title,
                      roleKey: s.roleKey,
                      status: i === 0 ? "done" as const : i === 1 ? "inProgress" as const : "pending" as const,
                    }))}
                  />
                </div>
              </section>
            )}

            {/* Actions */}
            <div className="flex gap-3 pb-4">
              <button onClick={() => { setShowCreate(false); setSelectedCatId(null); }}
                className="flex-1 rounded-xl border border-input bg-card py-3 text-sm font-bold text-foreground hover:bg-secondary">
                {t("settings.cancel")}
              </button>
              <button onClick={handleCreate} disabled={!selectedCatId}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm disabled:opacity-50">
                <Megaphone className="h-4 w-4" /> {t("shelterCampaigns.openCampaign")}
              </button>
            </div>
          </main>
        </div>
        <BottomNav />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("campaigns.title")} />
        <div className="mx-auto w-full max-w-lg p-4 space-y-4">
          {/* Tabs */}
          <div className="flex rounded-xl bg-secondary p-1">
            <button onClick={() => setTab("campaigns")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all ${tab === "campaigns" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Megaphone className="h-4 w-4" /> {t("shelterCampaigns.campaignsTab")} ({campaigns.length})
            </button>
            <button onClick={() => setTab("applications")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all ${tab === "applications" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Eye className="h-4 w-4" /> {t("shelterCampaigns.applicationsTab")} ({pendingApps.length})
            </button>
          </div>

          {tab === "campaigns" && (
            <>
              {/* New campaign button */}
              <button onClick={() => setShowCreate(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]">
                <Plus className="h-4 w-4" /> {t("shelterCampaigns.newCampaign")}
              </button>

              {/* Campaign list */}
              {campaigns.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t("shelterCampaigns.noCampaigns")}</p>
              ) : (
                campaigns.map((campaign) => {
                  const isExpanded = expandedCampaign === campaign.id;
                  return (
                    <div key={campaign.id} className="rounded-2xl border border-border bg-card">
                      <button
                        onClick={() => setExpandedCampaign(isExpanded ? null : campaign.id)}
                        className="flex w-full items-center gap-3 p-3 text-left"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-extrabold text-primary">
                          {campaign.catName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground">{campaign.catName}</p>
                          <p className="text-xs text-muted-foreground">
                            {campaign.routineTemplate.length} {t("shelterCampaigns.steps")} · {campaign.applicationsCount} {t("shelterCampaigns.applications")}
                          </p>
                        </div>
                        <Badge variant="secondary" className={statusColor(campaign.status)}>
                          {t(`shelterCampaigns.status_${campaign.status}`)}
                        </Badge>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border p-3 space-y-3">
                          {/* RoutineLine preview */}
                          <RoutineLine
                            steps={campaign.routineTemplate.map((s, i) => ({
                              id: s.id,
                              title: s.title,
                              roleKey: s.roleKey,
                              status: "pending" as const,
                            }))}
                          />

                          {/* Campaign actions */}
                          <div className="flex gap-2">
                            {campaign.status === "active" ? (
                              <button onClick={() => updateCampaignStatus(campaign.id, "paused")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-input py-2 text-sm font-bold text-foreground hover:bg-secondary">
                                <Pause className="h-3.5 w-3.5" /> {t("shelterCampaigns.pause")}
                              </button>
                            ) : campaign.status === "paused" ? (
                              <button onClick={() => updateCampaignStatus(campaign.id, "active")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-primary/30 py-2 text-sm font-bold text-primary hover:bg-primary/5">
                                <Play className="h-3.5 w-3.5" /> {t("shelterCampaigns.resume")}
                              </button>
                            ) : null}
                            <button onClick={() => updateCampaignStatus(campaign.id, "closed")}
                              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-destructive/30 py-2 text-sm font-bold text-destructive hover:bg-destructive/10">
                              <XCircle className="h-3.5 w-3.5" /> {t("shelterCampaigns.close")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}

          {tab === "applications" && (
            <>
              {scoredApps.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">{t("campaigns.noApplications")}</p>
              ) : (
                scoredApps.map(({ app, scoring }) => {
                  const steps = routineSteps[app.id] || [];
                  const isExpanded = expandedApp === app.id;
                  const isScoreOpen = showScoreDetail === app.id;

                  return (
                    <div key={app.id} className="rounded-2xl border border-border bg-card">
                      <button
                        onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                        className="flex w-full items-center gap-3 p-3 text-left"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                          {app.applicantName.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-foreground">{app.applicantName}</p>
                          <p className="text-xs text-muted-foreground">{t("campaigns.from")} — Cat #{app.catId}</p>
                        </div>
                        {/* Score badge */}
                        <div className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-extrabold ${scoreBgColor(scoring.total)} ${scoreColor(scoring.total)}`}>
                          <BarChart3 className="h-3 w-3" />
                          {scoring.total}
                        </div>
                        <Badge className="bg-accent text-[10px] text-accent-foreground">
                          {t(`adoption.status_${app.status}`)}
                        </Badge>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="border-t border-border p-3 space-y-3">
                          {/* Score breakdown */}
                          <div className="rounded-xl border border-border bg-secondary/30 p-3">
                            <button
                              onClick={() => setShowScoreDetail(isScoreOpen ? null : app.id)}
                              className="flex w-full items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs font-bold text-foreground">{t("scoring.title")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-lg font-extrabold ${scoreColor(scoring.total)}`}>{scoring.total}<span className="text-xs font-normal text-muted-foreground">/100</span></span>
                                <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isScoreOpen ? "rotate-180" : ""}`} />
                              </div>
                            </button>

                            {isScoreOpen && (
                              <div className="mt-3 space-y-2.5">
                                {scoring.criteria.map((c) => (
                                  <div key={c.id}>
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs text-foreground">{t(c.labelKey)}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {c.score} × {c.weight}% = <span className="font-bold text-foreground">{c.weightedScore}</span>
                                      </span>
                                    </div>
                                    <Progress value={c.score} className="h-1.5" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Application summary */}
                          <div className="space-y-2 rounded-xl bg-secondary/50 p-3">
                            <p className="text-xs font-bold text-muted-foreground">{t("campaigns.applicationSummary")}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div><span className="text-muted-foreground">{t("adoption.housingType")}:</span> <span className="font-semibold text-foreground">{t(`adoption.housing_${app.housingType}`)}</span></div>
                              <div><span className="text-muted-foreground">{t("adoption.absenceHours")}:</span> <span className="font-semibold text-foreground">{app.absenceHours}h</span></div>
                              <div><span className="text-muted-foreground">{t("adoption.catExperience")}:</span> <span className="font-semibold text-foreground">{t(`adoption.exp_${app.catExperience}`)}</span></div>
                              <div><span className="text-muted-foreground">{t("adoption.adultsCount")}:</span> <span className="font-semibold text-foreground">{app.adultsCount}</span></div>
                            </div>
                            {app.motivation && (
                              <div className="mt-2">
                                <p className="text-xs text-muted-foreground">{t("adoption.motivation")}:</p>
                                <p className="mt-0.5 text-xs italic text-foreground">&ldquo;{app.motivation}&rdquo;</p>
                              </div>
                            )}
                          </div>

                          <RoutineLine steps={steps} />

                          {(app.status === "submitted" || app.status === "reviewing") && (
                            <div className="mt-3 flex gap-2">
                              <button onClick={() => openDecision(app, "rejected")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-destructive/30 py-2.5 text-xs font-bold text-destructive hover:bg-destructive/10">
                                <XCircle className="h-3.5 w-3.5" /> {t("campaigns.reject")}
                              </button>
                              <button onClick={() => openDecision(app, "waitlisted")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-xs font-bold text-accent-foreground hover:bg-accent">
                                <Clock className="h-3.5 w-3.5" /> {t("campaigns.waitlist")}
                              </button>
                              <button onClick={() => openDecision(app, "approved")}
                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-md active:scale-[0.98]">
                                <CheckCircle2 className="h-3.5 w-3.5" /> {t("campaigns.approve")}
                              </button>
                            </div>
                          )}

                          {/* Show decision note if already decided */}
                          {app.decisionNote && (app.status === "approved" || app.status === "rejected" || app.status === "waitlisted") && (
                            <div className="mt-2 rounded-xl border border-border bg-secondary/30 p-2.5">
                              <div className="flex items-center gap-1.5 mb-1">
                                <MessageSquare className="h-3 w-3 text-muted-foreground" />
                                <span className="text-[10px] font-bold text-muted-foreground">{t("campaigns.decisionNote")}</span>
                              </div>
                              <p className="text-xs text-foreground italic">&ldquo;{app.decisionNote}&rdquo;</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
      {/* Decision modal */}
      {decisionApp && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">
                {decisionAction === "approved" && t("campaigns.approveTitle")}
                {decisionAction === "rejected" && t("campaigns.rejectTitle")}
                {decisionAction === "waitlisted" && t("campaigns.waitlistTitle")}
              </h3>
              <button onClick={() => setDecisionApp(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              {t("campaigns.decisionFor", { name: decisionApp.applicantName })}
            </p>

            <div>
              <label className="text-xs font-semibold text-foreground">{t("campaigns.motivationLabel")} *</label>
              <textarea
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value.slice(0, 500))}
                rows={3}
                placeholder={t("campaigns.motivationPlaceholder")}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">{decisionNote.length}/500 · {t("campaigns.motivationRequired")}</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setDecisionApp(null)}
                className="flex-1 rounded-xl border border-input py-2.5 text-sm font-bold text-foreground hover:bg-secondary">
                {t("settings.cancel")}
              </button>
              <button
                onClick={handleConfirmDecision}
                disabled={!decisionNote.trim()}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold shadow-sm disabled:opacity-40 ${
                  decisionAction === "rejected"
                    ? "bg-destructive text-destructive-foreground"
                    : decisionAction === "waitlisted"
                    ? "bg-accent text-accent-foreground border border-border"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {decisionAction === "approved" && <><CheckCircle2 className="h-4 w-4" /> {t("campaigns.confirmApprove")}</>}
                {decisionAction === "rejected" && <><XCircle className="h-4 w-4" /> {t("campaigns.confirmReject")}</>}
                {decisionAction === "waitlisted" && <><Clock className="h-4 w-4" /> {t("campaigns.confirmWaitlist")}</>}
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </PageTransition>
  );
};

export default ShelterCampaigns;
