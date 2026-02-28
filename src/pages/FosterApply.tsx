import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Camera, FileText, CheckCircle, ArrowLeft, ArrowRight, Send,
  Ruler, PawPrint, Shield,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type FosterStep = 0 | 1 | 2 | 3;

const FosterApply = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { toast } = useToast();
  const [step, setStep] = useState<FosterStep>(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    roomSize: "",
    hasBalcony: false,
    hasSafeWindows: false,
    otherAnimals: "",
    experienceYears: 0,
    availability: "flexible",
    photos: [] as string[],
    motivation: "",
    acceptTerms: false,
  });

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  if (submitted) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col bg-background pb-16">
          <GlobalHeader title={t("premium.fosterTitle")} />
          <div className="mx-auto w-full max-w-lg p-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15">
                <CheckCircle className="h-10 w-10 text-primary" />
              </div>
            </motion.div>
            <h2 className="text-lg font-extrabold text-foreground">{t("premium.fosterSubmitted")}</h2>
            <p className="text-sm text-muted-foreground">{t("premium.fosterSubmittedDesc")}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              {t("premium.backHome")}
            </button>
          </div>
        </div>
        <BottomNav />
      </PageTransition>
    );
  }

  const steps = [
    // Step 0: Home info
    <div className="space-y-4" key="s0">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
          <Home className="h-5 w-5 text-primary" />
        </div>
        <p className="text-base font-bold text-foreground">{t("premium.fosterStep1Title")}</p>
      </div>
      <div className="space-y-3">
        <label className="block text-xs font-bold text-foreground">{t("premium.roomSize")}</label>
        <div className="flex gap-2">
          {["small", "medium", "large"].map((s) => (
            <button
              key={s}
              onClick={() => setForm({ ...form, roomSize: s })}
              className={`flex-1 rounded-xl border-2 py-3 text-xs font-bold transition-all ${
                form.roomSize === s ? "border-primary bg-primary/10 text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {t(`premium.room_${s}`)}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setForm({ ...form, hasBalcony: !form.hasBalcony })}
            className={`flex-1 rounded-xl border-2 p-3 text-xs font-bold transition-all ${form.hasBalcony ? "border-primary bg-primary/10" : "border-border"}`}
          >
            🌿 {t("premium.hasBalcony")}
          </button>
          <button
            onClick={() => setForm({ ...form, hasSafeWindows: !form.hasSafeWindows })}
            className={`flex-1 rounded-xl border-2 p-3 text-xs font-bold transition-all ${form.hasSafeWindows ? "border-primary bg-primary/10" : "border-border"}`}
          >
            🪟 {t("premium.safeWindows")}
          </button>
        </div>
      </div>
    </div>,
    // Step 1: Experience
    <div className="space-y-4" key="s1">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
          <PawPrint className="h-5 w-5 text-primary" />
        </div>
        <p className="text-base font-bold text-foreground">{t("premium.fosterStep2Title")}</p>
      </div>
      <div className="space-y-3">
        <label className="block text-xs font-bold text-foreground">{t("premium.otherAnimals")}</label>
        <textarea
          value={form.otherAnimals}
          onChange={(e) => setForm({ ...form, otherAnimals: e.target.value })}
          placeholder={t("premium.otherAnimalsPlaceholder")}
          className="w-full rounded-xl border border-border bg-background p-3 text-sm resize-none h-20"
        />
        <label className="block text-xs font-bold text-foreground">{t("premium.experienceYears")}</label>
        <input
          type="range" min={0} max={20} value={form.experienceYears}
          onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <p className="text-xs text-primary font-bold text-center">{form.experienceYears} {t("premium.years")}</p>
      </div>
    </div>,
    // Step 2: Photos
    <div className="space-y-4" key="s2">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
          <Camera className="h-5 w-5 text-primary" />
        </div>
        <p className="text-base font-bold text-foreground">{t("premium.fosterStep3Title")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <button key={i} className="flex h-28 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-secondary/30 text-muted-foreground hover:border-primary/30 transition-colors">
            <Camera className="h-6 w-6 mb-1 opacity-40" />
            <span className="text-[10px] font-bold">{t("premium.addPhoto")}</span>
          </button>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground text-center">{t("premium.photosHint")}</p>
    </div>,
    // Step 3: Motivation + Terms
    <div className="space-y-4" key="s3">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <p className="text-base font-bold text-foreground">{t("premium.fosterStep4Title")}</p>
      </div>
      <textarea
        value={form.motivation}
        onChange={(e) => setForm({ ...form, motivation: e.target.value })}
        placeholder={t("premium.motivationPlaceholder")}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm resize-none h-28"
      />
      <button
        onClick={() => setForm({ ...form, acceptTerms: !form.acceptTerms })}
        className={`flex items-center gap-3 w-full rounded-xl border-2 p-3 text-left text-xs transition-all ${
          form.acceptTerms ? "border-primary bg-primary/10" : "border-border"
        }`}
      >
        <Shield className={`h-5 w-5 ${form.acceptTerms ? "text-primary" : "text-muted-foreground"}`} />
        <span className="font-bold text-foreground">{t("premium.acceptFosterTerms")}</span>
      </button>
    </div>,
  ];

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("premium.fosterTitle")} />
        <div className="mx-auto w-full max-w-lg p-4 space-y-6">
          {/* Progress */}
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-primary" : "bg-secondary"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
              {steps[step]}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={() => setStep((s) => (s - 1) as FosterStep)} className="flex items-center gap-1.5 rounded-2xl border border-border px-5 py-3 text-sm font-bold text-muted-foreground">
                <ArrowLeft className="h-4 w-4" /> {t("matching.back")}
              </button>
            )}
            <button
              onClick={() => {
                if (step < 3) setStep((s) => (s + 1) as FosterStep);
                else {
                  setSubmitted(true);
                  toast({ title: t("premium.fosterSubmitted") });
                }
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md active:scale-[0.98]"
            >
              {step === 3 ? (
                <><Send className="h-4 w-4" /> {t("premium.submitApplication")}</>
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

export default FosterApply;
