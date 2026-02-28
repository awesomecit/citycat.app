import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buildBetaMailto } from "@/lib/betaMailto";
import PageTransition from "@/components/PageTransition";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Camera } from "lucide-react";

const StepNav = ({ step, setStep, steps, breadcrumb, breadcrumbRole }: { step: number; setStep: (s: number) => void; steps: string[]; breadcrumb: string; breadcrumbRole: string }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>{breadcrumb}</span> <ChevronRight className="h-3 w-3" /> <span className="font-semibold text-foreground">{breadcrumbRole}</span>
    </div>
    <Progress value={((step + 1) / steps.length) * 100} className="h-2" />
    <div className="flex gap-1 overflow-x-auto">
      {steps.map((s, i) => (
        <button key={i} onClick={() => setStep(i)} className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
          {i + 1}. {s}
        </button>
      ))}
    </div>
  </div>
);

const Step1 = () => {
  const { t } = useTranslation();
  const tasks = [
    { label: t("tutorialVolontario.s1Task1"), ente: t("tutorialVolontario.s1Task1Ente"), urgency: t("tutorialVolontario.s1Task1Urgency"), color: "border-destructive/60 bg-destructive/5" },
    { label: t("tutorialVolontario.s1Task2"), ente: t("tutorialVolontario.s1Task2Ente"), urgency: t("tutorialVolontario.s1Task2Urgency"), color: "border-yellow-500/50 bg-yellow-500/5" },
    { label: t("tutorialVolontario.s1Task3"), ente: t("tutorialVolontario.s1Task3Ente"), urgency: t("tutorialVolontario.s1Task3Urgency"), color: "border-primary/30 bg-primary/5" },
    { label: t("tutorialVolontario.s1Task4"), ente: t("tutorialVolontario.s1Task4Ente"), urgency: t("tutorialVolontario.s1Task4Urgency"), color: "border-primary/30 bg-primary/5" },
    { label: t("tutorialVolontario.s1Task5"), ente: t("tutorialVolontario.s1Task5Ente"), urgency: t("tutorialVolontario.s1Task5Urgency"), color: "border-muted" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialVolontario.s1Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialVolontario.s1Desc")}</p>
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t("tutorialVolontario.s1CardTitle", { count: tasks.length })}</CardTitle></CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          {tasks.map((tt, i) => (
            <div key={i} className={`rounded-lg border-l-4 p-3 ${tt.color}`}>
              <p className="text-sm font-semibold text-foreground">{tt.label}</p>
              <p className="text-xs text-muted-foreground">{tt.ente}</p>
              <p className="mt-1 text-xs font-bold">{tt.urgency}</p>
            </div>
          ))}
          <p className="text-center text-xs text-muted-foreground">{t("tutorialVolontario.s1SwipeHint")}</p>
        </CardContent>
      </Card>
      <Card className="bg-accent/30">
        <CardContent className="p-3 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("tutorialVolontario.s1Instruction") }} />
      </Card>
    </div>
  );
};

const Step2 = () => {
  const { t } = useTranslation();
  const [completed, setCompleted] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialVolontario.s2Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialVolontario.s2Desc")}</p>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t("tutorialVolontario.s2TaskTitle")}</CardTitle></CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Badge className="bg-destructive/15 text-destructive">{t("tutorialVolontario.s2Urgent")}</Badge>
            <span>Gatto Libero Milano</span>
          </div>
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary">
            <div className="text-center text-muted-foreground"><Camera className="mx-auto h-6 w-6" /><p className="mt-1 text-xs">{t("tutorialVolontario.s2PhotoHint")}</p></div>
          </div>
          <div className="rounded-lg border border-input bg-card p-2 text-sm text-muted-foreground">{t("tutorialVolontario.s2Notes")}</div>
          {!completed ? <Button className="w-full" onClick={() => setCompleted(true)}>{t("tutorialVolontario.s2Confirm")}</Button> : (
            <div className="space-y-2">
              <div className="rounded-lg bg-primary/10 p-3 text-center text-sm font-semibold text-primary">{t("tutorialVolontario.s2Completed")}</div>
              <Card className="bg-accent/30"><CardContent className="p-3 text-sm text-muted-foreground">{t("tutorialVolontario.s2Result")}</CardContent></Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Step3 = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialVolontario.s3Title")}</h2>
        <Badge variant="outline" className="mt-1">{t("tutorialVolontario.s3Badge")}</Badge>
        <p className="mt-2 text-sm text-muted-foreground">{t("tutorialVolontario.s3Desc")}</p>
      </div>
      <Card className="opacity-80">
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t("tutorialVolontario.s3CardTitle")}</CardTitle></CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><span>{t("tutorialVolontario.s3Legs")}</span></div>
          {[
            { from: t("tutorialVolontario.s3Leg1From"), to: t("tutorialVolontario.s3Leg1To"), note: t("tutorialVolontario.s3Leg1Note"), you: true },
            { from: t("tutorialVolontario.s3Leg2From"), to: t("tutorialVolontario.s3Leg2To"), note: t("tutorialVolontario.s3Leg2Note"), you: false },
          ].map((tt, i) => (
            <div key={i} className={`rounded-lg border p-3 ${tt.you ? "border-primary/30 bg-primary/5" : "border-border"}`}>
              <p className="text-sm font-semibold text-foreground">{tt.from} → {tt.to}</p>
              <p className="text-xs text-muted-foreground">{tt.note}</p>
            </div>
          ))}
          <Button className="w-full" disabled>{t("tutorialVolontario.s3AcceptLeg")}</Button>
        </CardContent>
      </Card>
      <Card className="bg-accent/30"><CardContent className="p-3 text-sm text-muted-foreground">{t("tutorialVolontario.s3FutureDesc")}</CardContent></Card>
    </div>
  );
};

const Step4 = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">{t("tutorialVolontario.s4Title")}</h2>
      <Card className="bg-primary/5"><CardContent className="p-4 text-center"><p className="text-lg font-bold text-foreground">{t("tutorialVolontario.s4FreeMsg")}</p></CardContent></Card>
      <Card>
        <CardContent className="space-y-2 p-4">
          <p className="text-xs font-semibold text-muted-foreground">{t("tutorialVolontario.s4AvailableNow")}</p>
          {[t("tutorialVolontario.s4Feat1"), t("tutorialVolontario.s4Feat2"), t("tutorialVolontario.s4Feat3"), t("tutorialVolontario.s4Feat4")].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /><span className="text-foreground">{f}</span></div>
          ))}
          <div className="my-2 h-px bg-border" />
          <p className="text-xs font-semibold text-muted-foreground">{t("tutorialVolontario.s4ComingSoon")}</p>
          {[t("tutorialVolontario.s4Coming1"), t("tutorialVolontario.s4Coming2")].map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm"><span className="h-4 w-4 shrink-0 text-center text-xs text-muted-foreground">⭕</span><span className="text-muted-foreground">{f}</span></div>
          ))}
        </CardContent>
      </Card>
      <div className="space-y-2">
        <Button className="w-full" asChild>
          <a href={buildBetaMailto(i18n.language?.startsWith("it") ? "it" : "en")} target="_blank" rel="noopener noreferrer">
            {t("tutorialVolontario.s4CtaBeta")}
          </a>
        </Button>
        <Button variant="outline" className="w-full text-xs" onClick={() => navigate("/pricing")}>{t("tutorialVolontario.s4CtaPro")}</Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-xs" onClick={() => navigate("/tutorial/adottante")}>{t("tutorialVolontario.s4CtaAdopter")}</Button>
          <Button variant="outline" className="flex-1 text-xs" onClick={() => navigate("/tutorial/ente")}>{t("tutorialVolontario.s4CtaEnte")}</Button>
        </div>
      </div>
    </div>
  );
};

const TutorialVolontario = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const STEPS = [t("tutorialVolontario.step1"), t("tutorialVolontario.step2"), t("tutorialVolontario.step3"), t("tutorialVolontario.step4")];

  const renderStep = () => {
    switch (step) { case 0: return <Step1 />; case 1: return <Step2 />; case 2: return <Step3 />; case 3: return <Step4 />; default: return null; }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <GlobalHeader />
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">{t("tutorialVolontario.pageTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("tutorialVolontario.pageDesc")}</p>
          </div>
          <StepNav step={step} setStep={setStep} steps={STEPS} breadcrumb={t("tutorialVolontario.breadcrumb")} breadcrumbRole={t("tutorialVolontario.breadcrumbRole")} />
          {renderStep()}
          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}><ArrowLeft className="mr-1 h-4 w-4" /> {t("tutorialVolontario.prev")}</Button>
            {step < STEPS.length - 1 && <Button onClick={() => setStep(step + 1)}>{t("tutorialVolontario.next")} <ArrowRight className="ml-1 h-4 w-4" /></Button>}
          </div>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default TutorialVolontario;
