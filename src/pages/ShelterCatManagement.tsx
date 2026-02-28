import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useShelterCatStore } from "@/stores/shelterCatStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import BehavioralProfileForm, { emptyBehavioralProfile } from "@/components/BehavioralProfileForm";
import { useEffect, useState, useMemo } from "react";
import {
  Plus, Cat, Search, ChevronRight, Heart, Shield, Stethoscope,
  X, Check, Pencil, Trash2, Camera, Brain, Sparkles, AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getCatPhoto } from "@/lib/catPhotos";
import { detectHeartAdoptionTriggers } from "@/lib/heartAdoption";
import type { CatProfile, CatCompatibility, CatPersonality, CatHealthStatus, CatStatus, CatBehavioralProfile, HeartAdoptionData } from "@/api/types";

const PERSONALITIES: CatPersonality[] = ["playful", "calm", "shy", "independent", "affectionate", "curious"];
const COMPATIBILITIES: CatCompatibility[] = ["cats", "dogs", "children", "elderly"];
const HEALTH_STATUSES: CatHealthStatus[] = ["healthy", "treatment", "chronic", "recovery"];
const CAT_STATUSES: CatStatus[] = ["sheltered", "adoption", "foster"];

const emptyCat = (): Partial<CatProfile> => ({
  name: "", breed: "", age: 0, gender: "male", status: "sheltered",
  vaccinated: false, sterilized: false, microchipped: false,
  healthStatus: "healthy", personality: [], compatibility: [],
  description: "", backstory: "", color: "", weight: 0,
  ownerId: "shelter1", shelterName: "Rifugio Felino Roma",
});

const ShelterCatManagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();
  const { cats, addCat, updateCat, deleteCat } = useShelterCatStore();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<CatProfile>>(emptyCat());
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  const filtered = cats.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.breed.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => {
    setForm(emptyCat());
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (cat: CatProfile) => {
    setForm({ ...cat });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name?.trim() || !form.breed?.trim()) {
      toast({ title: t("shelterCats.validationError"), description: t("shelterCats.validationErrorDesc"), variant: "destructive" });
      return;
    }
    if (editingId) {
      updateCat(editingId, form);
      toast({ title: t("shelterCats.updated"), description: t("shelterCats.updatedDesc", { name: form.name }) });
    } else {
      const newCat: CatProfile = {
        ...form as CatProfile,
        id: `sc-${Date.now()}`,
        arrivalDate: new Date().toISOString().split("T")[0],
      };
      addCat(newCat);
      toast({ title: t("shelterCats.created"), description: t("shelterCats.createdDesc", { name: form.name }) });
    }
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    const cat = cats.find((c) => c.id === id);
    deleteCat(id);
    setConfirmDelete(null);
    toast({ title: t("shelterCats.deleted"), description: t("shelterCats.deletedDesc", { name: cat?.name }) });
  };

  const toggleArray = <T extends string>(arr: T[] | undefined, val: T): T[] => {
    const list = arr || [];
    return list.includes(val) ? list.filter((v) => v !== val) : [...list, val];
  };

  const healthColor = (s?: CatHealthStatus) => {
    switch (s) {
      case "healthy": return "bg-primary/10 text-primary";
      case "treatment": return "bg-accent text-accent-foreground";
      case "chronic": return "bg-destructive/10 text-destructive";
      case "recovery": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Form view
  if (showForm) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col bg-background pb-16">
          <GlobalHeader title={editingId ? t("shelterCats.editCat") : t("shelterCats.addCat")} />
          <main className="flex-1 p-4 pt-20 max-w-lg mx-auto space-y-4">
            {/* Basic info */}
            <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground">{t("shelterCats.basicInfo")}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">{t("shelterCats.name")}</label>
                  <input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">{t("shelterCats.breed")}</label>
                  <input value={form.breed || ""} onChange={(e) => setForm({ ...form, breed: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">{t("shelterCats.age")}</label>
                  <input type="number" min={0} max={30} value={form.age || 0} onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">{t("cats.gender")}</label>
                  <div className="flex gap-2 mt-1">
                    {(["male", "female"] as const).map((g) => (
                      <button key={g} onClick={() => setForm({ ...form, gender: g })}
                        className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-colors ${form.gender === g ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"}`}>
                        {g === "male" ? "♂" : "♀"} {t(`cats.${g}`)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">{t("shelterCats.color")}</label>
                  <input value={form.color || ""} onChange={(e) => setForm({ ...form, color: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">{t("shelterCats.weight")}</label>
                  <input type="number" step={0.1} min={0} max={20} value={form.weight || 0} onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("shelterCats.status")}</label>
                <div className="flex gap-2 mt-1">
                  {CAT_STATUSES.map((s) => (
                    <button key={s} onClick={() => setForm({ ...form, status: s })}
                      className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-colors ${form.status === s ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"}`}>
                      {t(`shelterCats.status_${s}`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo placeholder */}
              <button onClick={() => toast({ title: t("adopterProfile.photoComingSoon") })}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-input py-3 text-sm text-muted-foreground hover:bg-secondary transition-colors">
                <Camera className="h-4 w-4" /> {t("shelterCats.uploadPhoto")}
              </button>
            </section>

            {/* Health */}
            <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" /> {t("shelterCats.health")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(["vaccinated", "sterilized", "microchipped"] as const).map((field) => (
                  <button key={field} onClick={() => setForm({ ...form, [field]: !form[field] })}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${form[field] ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"}`}>
                    {form[field] ? "✓" : "○"} {t(`shelterCats.${field}`)}
                  </button>
                ))}
              </div>
              {form.microchipped && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("shelterCats.microchipId")}</label>
                  <input value={form.microchipId || ""} onChange={(e) => setForm({ ...form, microchipId: e.target.value })}
                    placeholder="380260000..." className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground">{t("shelterCats.healthStatus")}</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {HEALTH_STATUSES.map((s) => (
                    <button key={s} onClick={() => setForm({ ...form, healthStatus: s })}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${form.healthStatus === s ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"}`}>
                      {t(`shelterCats.health_${s}`)}
                    </button>
                  ))}
                </div>
              </div>
              {(form.healthStatus === "chronic" || form.healthStatus === "treatment") && (
                <div>
                  <label className="text-xs text-muted-foreground">{t("shelterCats.healthNotes")}</label>
                  <textarea value={form.healthNotes || ""} onChange={(e) => setForm({ ...form, healthNotes: e.target.value })}
                    rows={2} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
              )}
            </section>

            {/* Personality & Compatibility */}
            <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground">{t("shelterCats.personality")}</h3>
              <div className="flex flex-wrap gap-2">
                {PERSONALITIES.map((p) => (
                  <button key={p} onClick={() => setForm({ ...form, personality: toggleArray(form.personality, p) })}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${form.personality?.includes(p) ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"}`}>
                    {t(`shelterCats.personality_${p}`)}
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-bold text-foreground mt-2">{t("shelterCats.compatibility")}</h3>
              <div className="flex flex-wrap gap-2">
                {COMPATIBILITIES.map((c) => (
                  <button key={c} onClick={() => setForm({ ...form, compatibility: toggleArray(form.compatibility, c) })}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-colors ${form.compatibility?.includes(c) ? "border-primary bg-primary/10 text-primary" : "border-input text-muted-foreground"}`}>
                    {t(`shelterCats.compat_${c}`)}
                  </button>
                ))}
              </div>
            </section>

            {/* Behavioral Profile */}
            <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> {t("behavioral.title")}
              </h3>
              <p className="text-[10px] text-muted-foreground">{t("behavioral.formHint")}</p>
              <BehavioralProfileForm
                profile={form.behavioralProfile || emptyBehavioralProfile()}
                onChange={(bp) => setForm({ ...form, behavioralProfile: bp })}
              />
            </section>

            {/* Story */}
            <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <h3 className="text-sm font-bold text-foreground">{t("shelterCats.story")}</h3>
              <div>
                <label className="text-xs text-muted-foreground">{t("shelterCats.description")}</label>
                <textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, 500) })}
                  rows={2} placeholder={t("shelterCats.descPlaceholder")}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">{t("shelterCats.backstory")}</label>
                <textarea value={form.backstory || ""} onChange={(e) => setForm({ ...form, backstory: e.target.value.slice(0, 500) })}
                  rows={2} placeholder={t("shelterCats.backstoryPlaceholder")}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
            </section>

            {/* Heart Adoption */}
            {(() => {
              const triggers = detectHeartAdoptionTriggers(form as CatProfile);
              const ha = form.heartAdoption || { isHeartAdoption: false };
              const setHa = (data: Partial<HeartAdoptionData>) => setForm({ ...form, heartAdoption: { ...ha, ...data } as HeartAdoptionData });
              return (
                <section className={`rounded-2xl border p-4 space-y-3 ${ha.isHeartAdoption ? "border-destructive/40 bg-destructive/5" : "border-border bg-card"}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Heart className="h-4 w-4 text-destructive" /> {t("heartAdoption.title")}
                    </h3>
                    <button
                      onClick={() => setHa({ isHeartAdoption: !ha.isHeartAdoption })}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                        ha.isHeartAdoption
                          ? "bg-destructive/15 text-destructive"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {ha.isHeartAdoption ? "❤️ " + t("heartAdoption.active") : t("heartAdoption.activate")}
                    </button>
                  </div>

                  {/* Auto-suggestion banner */}
                  {triggers.length > 0 && !ha.isHeartAdoption && (
                    <div className="rounded-xl border border-accent bg-accent/30 p-3 space-y-1.5">
                      <p className="flex items-center gap-1.5 text-xs font-bold text-accent-foreground">
                        <Sparkles className="h-3.5 w-3.5" /> {t("heartAdoption.autoSuggestion")}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {triggers.map((r) => (
                          <span key={r} className="rounded-lg bg-background/60 px-2 py-0.5 text-[10px] font-semibold text-foreground">
                            {t(r)}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => setHa({ isHeartAdoption: true, autoSuggested: true, suggestedReasons: triggers })}
                        className="mt-1 w-full rounded-xl bg-destructive/10 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 transition-colors"
                      >
                        {t("heartAdoption.acceptSuggestion")}
                      </button>
                    </div>
                  )}

                  {ha.isHeartAdoption && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground">{t("heartAdoption.narrative")}</label>
                        <textarea value={ha.narrative || ""} onChange={(e) => setHa({ narrative: e.target.value.slice(0, 800) })}
                          rows={3} placeholder={t("heartAdoption.narrativePlaceholder")}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">{t("heartAdoption.challenges")}</label>
                        <textarea value={ha.challenges || ""} onChange={(e) => setHa({ challenges: e.target.value.slice(0, 500) })}
                          rows={2} placeholder={t("heartAdoption.challengesPlaceholder")}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">{t("heartAdoption.lookingFor")}</label>
                        <textarea value={ha.lookingFor || ""} onChange={(e) => setHa({ lookingFor: e.target.value.slice(0, 500) })}
                          rows={2} placeholder={t("heartAdoption.lookingForPlaceholder")}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">{t("heartAdoption.smallVictories")}</label>
                        <textarea value={ha.smallVictories || ""} onChange={(e) => setHa({ smallVictories: e.target.value.slice(0, 500) })}
                          rows={2} placeholder={t("heartAdoption.smallVictoriesPlaceholder")}
                          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Actions */}
            <div className="flex gap-3 pb-4">
              <button onClick={() => setShowForm(false)}
                className="flex-1 rounded-xl border border-input bg-card py-3 text-sm font-bold text-foreground hover:bg-secondary">
                {t("settings.cancel")}
              </button>
              <button onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm">
                <Check className="h-4 w-4" /> {t("settings.save")}
              </button>
            </div>
          </main>
        </div>
        <BottomNav />
      </PageTransition>
    );
  }

  // Detect cats needing attention
  const catsNeedingProfile = cats.filter((c) => !c.behavioralProfile && (c.status === "adoption" || c.status === "sheltered"));
  const heartCandidates = cats.filter((c) => {
    if (c.heartAdoption?.isHeartAdoption) return false;
    return detectHeartAdoptionTriggers(c).length > 0;
  });

  // List view
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("shelterCats.title")} />
        <main className="flex-1 p-4 pt-20 max-w-lg mx-auto space-y-3">
          {/* Heart Adoption task banner */}
          {heartCandidates.length > 0 && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-destructive" />
                <p className="text-xs font-bold text-foreground flex-1">
                  {t("shelterCats.heartTask", { count: heartCandidates.length })}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground">{t("shelterCats.heartTaskDesc")}</p>
              <div className="space-y-1.5">
                {heartCandidates.slice(0, 3).map((c) => {
                  const triggers = detectHeartAdoptionTriggers(c);
                  return (
                    <button
                      key={c.id}
                      onClick={() => openEdit(c)}
                      className="flex w-full items-center gap-2 rounded-xl bg-card border border-border p-2 text-left hover:bg-secondary/50 transition-colors"
                    >
                      <span className="text-sm">❤️</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground">{c.name}</p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {triggers.slice(0, 2).map((r) => (
                            <span key={r} className="rounded bg-destructive/10 px-1 py-0.5 text-[9px] font-bold text-destructive">{t(r)}</span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Behavioral profile completion banner */}
          {catsNeedingProfile.length > 0 && (
            <div className="rounded-2xl border border-accent bg-accent/10 p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-accent-foreground" />
                <p className="text-xs font-bold text-foreground flex-1">
                  {t("shelterCats.profileTask", { count: catsNeedingProfile.length })}
                </p>
              </div>
              <p className="text-[10px] text-muted-foreground">{t("shelterCats.profileTaskDesc")}</p>
              <div className="flex flex-wrap gap-1.5">
                {catsNeedingProfile.slice(0, 4).map((c) => (
                  <button key={c.id} onClick={() => openEdit(c)} className="rounded-lg bg-card border border-border px-2 py-1 text-[10px] font-bold text-foreground hover:bg-secondary/50 transition-colors">
                    🐱 {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search + Add */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder={t("filters.searchCats")}
                className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button onClick={openNew}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]">
              <Plus className="h-4 w-4" /> {t("shelterCats.add")}
            </button>
          </div>

          {/* Stats bar */}
          <div className="flex gap-2 text-center">
            {[
              { label: t("shelterCats.status_sheltered"), count: cats.filter((c) => c.status === "sheltered").length, color: "bg-secondary text-secondary-foreground" },
              { label: t("shelterCats.status_adoption"), count: cats.filter((c) => c.status === "adoption").length, color: "bg-primary/10 text-primary" },
              { label: t("shelterCats.status_foster"), count: cats.filter((c) => c.status === "foster").length, color: "bg-accent text-accent-foreground" },
            ].map((s) => (
              <div key={s.label} className={`flex-1 rounded-xl p-2 ${s.color}`}>
                <p className="text-lg font-extrabold">{s.count}</p>
                <p className="text-[10px] font-medium">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Cat list */}
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("cats.empty")}</p>
          ) : (
            filtered.map((cat) => (
              <div key={cat.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                {/* Profile completion indicator */}
                <div className="relative">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
                    {cat.name.slice(0, 2).toUpperCase()}
                  </div>
                  {!cat.behavioralProfile && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-card" title={t("shelterCats.noProfile")} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-sm font-bold text-foreground">{cat.name}</p>
                    {cat.heartAdoption?.isHeartAdoption && (
                      <span className="rounded-full bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive">❤️</span>
                    )}
                    <Badge variant="secondary" className={healthColor(cat.healthStatus)}>
                      {t(`shelterCats.health_${cat.healthStatus || "healthy"}`)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {cat.breed} · {cat.gender === "female" ? "♀" : "♂"} · {t("cats.age", { count: cat.age })}
                    {cat.color ? ` · ${cat.color}` : ""}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {cat.personality?.slice(0, 3).map((p) => (
                      <span key={p} className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {t(`shelterCats.personality_${p}`)}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button onClick={() => openEdit(cat)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-primary">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  {confirmDelete === cat.id ? (
                    <div className="flex gap-1">
                      <button onClick={() => handleDelete(cat.id)} className="rounded-lg p-1.5 text-destructive hover:bg-destructive/10">
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setConfirmDelete(cat.id)} className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default ShelterCatManagement;
