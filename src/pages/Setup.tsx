import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Cat, Bell, MapPin } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";

const steps = [
  { icon: Cat, key: "catProfile" },
  { icon: Bell, key: "notifications" },
  { icon: MapPin, key: "location" },
] as const;

const Setup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const step = steps[currentStep];
  const StepIcon = step.icon;
  const isLast = currentStep === steps.length - 1;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={`${t("setup.title")} (${currentStep + 1}/${steps.length})`} />

        {/* Progress */}
        <div className="mx-auto w-full max-w-lg px-4 pt-4">
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <StepIcon className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">
            {t(`setup.steps.${step.key}.title`)}
          </h2>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {t(`setup.steps.${step.key}.desc`)}
          </p>
          <span className="mt-4 rounded-full bg-accent/50 px-4 py-1.5 text-xs font-bold text-accent-foreground">
            Coming Soon
          </span>
        </div>

        {/* Navigation */}
        <div className="border-t border-border px-4 py-4">
          <div className="mx-auto flex max-w-lg gap-3">
            <button
              onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate("/dashboard")}
              className="flex-1 rounded-xl border border-input bg-card py-3 text-sm font-bold text-foreground transition-colors hover:bg-secondary"
            >
              {currentStep > 0 ? t("setup.back") : t("setup.skip")}
            </button>
            <button
              onClick={() => isLast ? navigate("/dashboard") : setCurrentStep(currentStep + 1)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
            >
              {isLast ? (
                <>
                  <Check className="h-4 w-4" />
                  {t("setup.finish")}
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

export default Setup;
