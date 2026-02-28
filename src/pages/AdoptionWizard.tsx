import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Home, Users, Heart, FileText } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useAdoptionStore, type AdoptionApplication } from "@/stores/adoptionStore";
import { mockCats } from "@/api/mockData";
import { getCatPhoto } from "@/lib/catPhotos";
import PageTransition from "@/components/PageTransition";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import { useToast } from "@/hooks/use-toast";

const STEPS = [
  { icon: Home, labelKey: "adoption.step1Title" },
  { icon: Users, labelKey: "adoption.step2Title" },
  { icon: Heart, labelKey: "adoption.step3Title" },
  { icon: FileText, labelKey: "adoption.step4Title" },
];

const AdoptionWizard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: catId } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { submitApplication } = useAdoptionStore();
  const { toast } = useToast();
  const [step, setStep] = useState(0);

  // Form state
  const [form, setForm] = useState({
    housingType: "",
    housingArea: "",
    hasGarden: false,
    floor: "",
    adultsCount: 1,
    childrenAges: "",
    otherAnimals: "none",
    absenceHours: 8,
    catExperience: "",
    previousAdoptions: false,
    motivation: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const cat = mockCats.find((c) => c.id === catId);
  if (!cat || !user) return null;

  const catPhoto = getCatPhoto(cat.id);

  const updateField = (key: string, value: any) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!form.housingType) newErrors.housingType = t("adoption.required");
      if (!form.housingArea) newErrors.housingArea = t("adoption.required");
      if (!form.floor) newErrors.floor = t("adoption.required");
    } else if (step === 1) {
      if (form.adultsCount < 1) newErrors.adultsCount = t("adoption.required");
    } else if (step === 2) {
      if (!form.catExperience) newErrors.catExperience = t("adoption.required");
    } else if (step === 3) {
      if (form.motivation.length < 50) newErrors.motivation = t("adoption.motivationMin");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleSubmit = () => {
    const app: AdoptionApplication = {
      id: `app-${Date.now()}`,
      catId: cat.id,
      applicantEmail: user.email,
      applicantName: user.name,
      status: "submitted",
      createdAt: new Date().toISOString(),
      ...form,
    };
    submitApplication(app);
    toast({
      title: t("adoption.submittedTitle"),
      description: t("adoption.submittedDesc", { catName: cat.name }),
    });
    navigate("/adoptions");
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="mt-1 text-xs text-destructive">{errors[field]}</p> : null;

  const selectClass = (active: boolean) =>
    `rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
      active ? "border-primary bg-primary/10 text-primary" : "border-input bg-card text-foreground"
    }`;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("adoption.title")} />

        {/* Cat mini card */}
        <div className="mx-auto flex w-full max-w-lg items-center gap-3 border-b border-border px-4 py-3">
          {catPhoto ? (
            <img src={catPhoto} alt={cat.name} className="h-10 w-10 rounded-xl object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
              {cat.name.slice(0, 2)}
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-foreground">{cat.name}</p>
            <p className="text-xs text-muted-foreground">{cat.breed} · {t("cats.age", { count: cat.age })}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mx-auto w-full max-w-lg px-4 pt-4">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            {(() => { const StepIcon = STEPS[step].icon; return <StepIcon className="h-4 w-4 text-primary" />; })()}
            <span className="text-sm font-bold text-foreground">{t(STEPS[step].labelKey)}</span>
            <span className="ml-auto text-xs text-muted-foreground">{step + 1}/4</span>
          </div>
        </div>

        {/* Step content */}
        <div className="mx-auto w-full max-w-lg flex-1 space-y-4 p-4">
          {step === 0 && (
            <>
              {/* Housing Type */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.housingType")}</label>
                <div className="flex flex-wrap gap-2">
                  {["apartment", "house", "houseGarden", "other"].map((type) => (
                    <button key={type} onClick={() => updateField("housingType", type)} className={selectClass(form.housingType === type)}>
                      {t(`adoption.housing_${type}`)}
                    </button>
                  ))}
                </div>
                <FieldError field="housingType" />
              </div>
              {/* Area */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.housingArea")}</label>
                <div className="flex flex-wrap gap-2">
                  {["<40", "40-80", "80-120", ">120"].map((area) => (
                    <button key={area} onClick={() => updateField("housingArea", area)} className={selectClass(form.housingArea === area)}>
                      {area} m²
                    </button>
                  ))}
                </div>
                <FieldError field="housingArea" />
              </div>
              {/* Garden */}
              <div className="flex items-center justify-between rounded-xl border border-input bg-card p-3">
                <span className="text-sm text-foreground">{t("adoption.hasGarden")}</span>
                <button
                  onClick={() => updateField("hasGarden", !form.hasGarden)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.hasGarden ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${form.hasGarden ? "translate-x-5" : ""}`} />
                </button>
              </div>
              {/* Floor */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.floor")}</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={form.floor}
                  onChange={(e) => updateField("floor", e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0"
                />
                <FieldError field="floor" />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              {/* Adults */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.adultsCount")}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button key={n} onClick={() => updateField("adultsCount", n)} className={selectClass(form.adultsCount === n)}>
                      {n}{n === 4 ? "+" : ""}
                    </button>
                  ))}
                </div>
                <FieldError field="adultsCount" />
              </div>
              {/* Children */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.childrenAges")}</label>
                <input
                  type="text"
                  value={form.childrenAges}
                  onChange={(e) => updateField("childrenAges", e.target.value)}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("adoption.childrenPlaceholder")}
                />
              </div>
              {/* Other animals */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.otherAnimals")}</label>
                <div className="flex flex-wrap gap-2">
                  {["none", "cats", "dogs", "other"].map((type) => (
                    <button key={type} onClick={() => updateField("otherAnimals", type)} className={selectClass(form.otherAnimals === type)}>
                      {t(`adoption.animals_${type}`)}
                    </button>
                  ))}
                </div>
              </div>
              {/* Absence hours */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.absenceHours")}</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={12}
                    value={form.absenceHours}
                    onChange={(e) => updateField("absenceHours", Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="w-8 text-center text-sm font-bold text-foreground">{form.absenceHours}h</span>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              {/* Cat experience */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.catExperience")}</label>
                <div className="space-y-2">
                  {["never", "haveCats", "hadCats", "fostered"].map((exp) => (
                    <button
                      key={exp}
                      onClick={() => updateField("catExperience", exp)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${
                        form.catExperience === exp
                          ? "border-primary bg-primary/5 font-bold text-foreground"
                          : "border-input bg-card text-foreground"
                      }`}
                    >
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        form.catExperience === exp ? "border-primary bg-primary" : "border-input"
                      }`}>
                        {form.catExperience === exp && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      {t(`adoption.exp_${exp}`)}
                    </button>
                  ))}
                </div>
                <FieldError field="catExperience" />
              </div>
              {/* Previous adoptions */}
              <div className="flex items-center justify-between rounded-xl border border-input bg-card p-3">
                <span className="text-sm text-foreground">{t("adoption.previousAdoptions")}</span>
                <button
                  onClick={() => updateField("previousAdoptions", !form.previousAdoptions)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.previousAdoptions ? "bg-primary" : "bg-muted"}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${form.previousAdoptions ? "translate-x-5" : ""}`} />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Motivation */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.motivation")}</label>
                <textarea
                  value={form.motivation}
                  onChange={(e) => updateField("motivation", e.target.value)}
                  rows={5}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("adoption.motivationPlaceholder")}
                />
                <div className="mt-1 flex justify-between">
                  <FieldError field="motivation" />
                  <span className={`text-[10px] ${form.motivation.length >= 50 ? "text-primary" : "text-muted-foreground"}`}>
                    {form.motivation.length}/50 min
                  </span>
                </div>
              </div>
              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted-foreground">{t("adoption.additionalNotes")}</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder={t("adoption.notesPlaceholder")}
                />
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="border-t border-border px-4 py-4">
          <div className="mx-auto flex max-w-lg gap-3">
            <button
              onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)}
              className="flex-1 rounded-xl border border-input bg-card py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              {step > 0 ? t("setup.back") : t("settings.cancel")}
            </button>
            <button
              onClick={handleNext}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
            >
              {step === 3 ? (
                <>
                  <Check className="h-4 w-4" />
                  {t("adoption.submit")}
                </>
              ) : (
                <>
                  {t("setup.next")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default AdoptionWizard;
