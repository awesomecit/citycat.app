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
import { ArrowLeft, ArrowRight, Check, ChevronRight } from "lucide-react";

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
  const [wizStep, setWizStep] = useState(0);
  const wizardSteps = [
    { title: t("tutorialAdottante.s1q1"), options: [t("tutorialAdottante.s1q1o1"), t("tutorialAdottante.s1q1o2"), t("tutorialAdottante.s1q1o3"), t("tutorialAdottante.s1q1o4")] },
    { title: t("tutorialAdottante.s1q2"), options: [t("tutorialAdottante.s1q2o1"), t("tutorialAdottante.s1q2o2"), t("tutorialAdottante.s1q2o3"), t("tutorialAdottante.s1q2o4")] },
    { title: t("tutorialAdottante.s1q3"), options: [t("tutorialAdottante.s1q3o1"), t("tutorialAdottante.s1q3o2"), t("tutorialAdottante.s1q3o3"), t("tutorialAdottante.s1q3o4")] },
    { title: t("tutorialAdottante.s1q4"), options: [t("tutorialAdottante.s1q4o1"), t("tutorialAdottante.s1q4o2"), t("tutorialAdottante.s1q4o3"), t("tutorialAdottante.s1q4o4")] },
    { title: t("tutorialAdottante.s1q5"), options: [t("tutorialAdottante.s1q5o1"), t("tutorialAdottante.s1q5o2"), t("tutorialAdottante.s1q5o3"), t("tutorialAdottante.s1q5o4")] },
    { title: t("tutorialAdottante.s1q6"), options: [t("tutorialAdottante.s1q6o1"), t("tutorialAdottante.s1q6o2"), t("tutorialAdottante.s1q6o3"), t("tutorialAdottante.s1q6o4")] },
  ];
  const ws = wizardSteps[wizStep];
  const [selected, setSelected] = useState<number[]>([1, 2, 1, 0, 2, 1]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialAdottante.s1Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialAdottante.s1Desc")}</p>
      </div>
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Progress value={((wizStep + 1) / 6) * 100} className="h-2 flex-1" />
            <span className="font-semibold">{wizStep + 1}/6</span>
          </div>
          <p className="font-bold text-foreground">{ws.title}</p>
          {ws.options.map((o, i) => (
            <div key={i} onClick={() => { const ns = [...selected]; ns[wizStep] = i; setSelected(ns); }}
              className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors ${i === selected[wizStep] ? "border-primary bg-primary/10 font-semibold text-foreground" : "border-border text-muted-foreground hover:bg-secondary"}`}>
              {o}
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" disabled={wizStep === 0} onClick={() => setWizStep(wizStep - 1)}>{t("tutorialAdottante.s1Back")}</Button>
            <Button size="sm" onClick={() => setWizStep(Math.min(5, wizStep + 1))} disabled={wizStep === 5}>{t("tutorialAdottante.s1Next")}</Button>
          </div>
          {wizStep === 5 && <div className="mt-2 rounded-lg bg-primary/10 p-3 text-center text-sm font-semibold text-primary">{t("tutorialAdottante.s1Complete")}</div>}
        </CardContent>
      </Card>
    </div>
  );
};

const Step2 = () => {
  const { t } = useTranslation();
  const results = [
    { name: "Luna", score: 94, reasons: [t("tutorialAdottante.s2R1"), t("tutorialAdottante.s2R2"), t("tutorialAdottante.s2R3")], heart: false },
    { name: "Micio", score: 88, reasons: [t("tutorialAdottante.s2R4"), t("tutorialAdottante.s2R5"), t("tutorialAdottante.s2R6")], heart: false },
    { name: "Pallina", score: 81, reasons: [t("tutorialAdottante.s2R7"), t("tutorialAdottante.s2R8"), t("tutorialAdottante.s2R9")], heart: true },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialAdottante.s2Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialAdottante.s2Desc")}</p>
      </div>
      <div className="space-y-3">
        {results.map((r) => (
          <Card key={r.name} className={r.heart ? "border-destructive/30" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">{r.name} {r.heart && <span className="text-destructive">❤️</span>}</p>
                <Badge className="bg-primary/15 text-primary">{r.score}%</Badge>
              </div>
              <Progress value={r.score} className="my-2 h-2" />
              <ul className="space-y-0.5 text-xs text-muted-foreground">{r.reasons.map((re) => <li key={re}>✓ {re}</li>)}</ul>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-accent/30">
        <CardContent className="p-3 text-center text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("tutorialAdottante.s2PremiumHint") }} />
      </Card>
    </div>
  );
};

const Step3 = () => {
  const { t } = useTranslation();
  const sliders = [
    { label: t("about.sociabilityHumans"), value: 80 },
    { label: t("about.sociabilityCats"), value: 60 },
    { label: t("about.energyLevel"), value: 40 },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialAdottante.s3Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialAdottante.s3Desc")}</p>
      </div>
      <Card className="border-2 border-accent">
        <CardContent className="space-y-3 p-4">
          <div className="flex h-24 w-full items-center justify-center rounded-lg bg-accent text-5xl">🐱</div>
          <p className="font-bold text-foreground">Luna · Femmina · 3 anni</p>
          <p className="text-xs text-muted-foreground">Sterilizzata ✓ · Microchippata ✓ · Vaccinazioni complete ✓</p>
          <Badge className="bg-primary/15 text-primary">{t("tutorialAdottante.s3Compatible")}</Badge>
          {sliders.map((s) => (
            <div key={s.label} className="space-y-1">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">{s.label}</span><span className="font-semibold text-foreground">{s.value / 20}/5</span></div>
              <Progress value={s.value} className="h-2" />
            </div>
          ))}
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">{t("tutorialAdottante.s3AloneBadge")}</Badge>
            <Badge variant="secondary">{t("about.indoor")}</Badge>
            <Badge variant="secondary">{t("about.okChildren")}</Badge>
          </div>
          <Button className="w-full">{t("tutorialAdottante.s3CTA")}</Button>
        </CardContent>
      </Card>
    </div>
  );
};

const Step4 = () => {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const wizSteps = [
    { title: t("tutorialAdottante.s4ws1"), fields: ["Appartamento con balcone", "75 mq", "Piano 3", "Rete di sicurezza ✓"] },
    { title: t("tutorialAdottante.s4ws2"), fields: ["2 adulti", "Nessun bambino", "Nessun altro animale", "8h assenza/giorno"] },
    { title: t("tutorialAdottante.s4ws3"), fields: ["Gatto di recente", "Patologie lievi OK", "Budget €30-80/mese"] },
    { title: t("tutorialAdottante.s4ws4"), fields: ["\"Cerchiamo una compagna tranquilla per le nostre serate...\""] },
    { title: t("tutorialAdottante.s4ws5"), fields: [] },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialAdottante.s4Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialAdottante.s4Desc")}</p>
      </div>
      <Card>
        <CardContent className="space-y-3 p-4">
          {wizSteps.map((ws, i) => (
            <div key={i} className="rounded-lg border border-border p-3">
              <p className="text-xs font-semibold text-foreground">Step {i + 1}: {ws.title}</p>
              {ws.fields.length > 0 ? (
                <div className="mt-1 flex flex-wrap gap-1">{ws.fields.map((f) => <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>)}</div>
              ) : (
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Check className="h-3 w-3 text-primary" /> {t("tutorialAdottante.s4Confirmed")}
                  <span className="ml-auto text-[10px]">{t("tutorialAdottante.s4GDPR")}</span>
                </div>
              )}
            </div>
          ))}
          {!sent ? <Button className="w-full" onClick={() => setSent(true)}>{t("tutorialAdottante.s4Send")}</Button>
            : <div className="rounded-lg bg-primary/10 p-3 text-center text-sm font-semibold text-primary">{t("tutorialAdottante.s4Sent")}</div>}
        </CardContent>
      </Card>
      {/* Home verification CTA */}
      <Card className="border-accent bg-accent/20">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">{t("tutorialAdottante.s4VerifBlock")}</p>
          <div className="mt-3 space-y-2">
            <Button className="w-full" variant="outline" disabled>
              📷 {t("tutorialAdottante.s4VerifCta")}
            </Button>
            <Button className="w-full" variant="ghost" size="sm" disabled>
              {t("tutorialAdottante.s4VerifSkip")}
            </Button>
            <Badge className="bg-primary/15 text-primary text-[10px]">{t("tutorialAdottante.s4VerifScoreBadge")}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Step5 = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const steps = [
    { icon: "🔵", label: t("tutorialAdottante.s5Sent"), status: t("tutorialAdottante.s5InReview") },
    { icon: "⭕", label: t("tutorialAdottante.s5Review"), status: "" },
    { icon: "⭕", label: t("tutorialAdottante.s5Interview"), status: "" },
    { icon: "⭕", label: t("tutorialAdottante.s5PreVisit"), status: "" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialAdottante.s5Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialAdottante.s5Desc")}</p>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t("tutorialAdottante.s5CardTitle")}</CardTitle></CardHeader>
        <CardContent className="space-y-0 p-4 pt-0">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 border-l-2 py-2 pl-4 ${i === 0 ? "border-primary" : "border-muted"}`}>
              <span>{s.icon}</span>
              <span className={`text-sm ${i === 0 ? "font-bold text-foreground" : "text-muted-foreground/60"}`}>{s.label}</span>
              {s.status && <Badge variant="secondary" className="ml-auto text-[10px]">{s.status}</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
      <Card className="bg-accent/30"><CardContent className="p-4 text-sm text-muted-foreground">{t("tutorialAdottante.s5Result")}</CardContent></Card>
      <div className="space-y-2">
        <Button className="w-full" asChild>
          <a href={buildBetaMailto(i18n.language?.startsWith("it") ? "it" : "en")} target="_blank" rel="noopener noreferrer">
            {t("tutorialAdottante.s5CtaBeta")}
          </a>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-xs" onClick={() => navigate("/pricing")}>{t("tutorialAdottante.s5CtaPricing")}</Button>
          <Button variant="outline" className="flex-1 text-xs" onClick={() => navigate("/tutorial/ente")}>{t("tutorialAdottante.s5CtaEnte")}</Button>
        </div>
      </div>
    </div>
  );
};

const TutorialAdottante = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const STEPS = [t("tutorialAdottante.step1"), t("tutorialAdottante.step2"), t("tutorialAdottante.step3"), t("tutorialAdottante.step4"), t("tutorialAdottante.step5")];

  const renderStep = () => {
    switch (step) { case 0: return <Step1 />; case 1: return <Step2 />; case 2: return <Step3 />; case 3: return <Step4 />; case 4: return <Step5 />; default: return null; }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <GlobalHeader />
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">{t("tutorialAdottante.pageTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("tutorialAdottante.pageDesc")}</p>
          </div>
          <StepNav step={step} setStep={setStep} steps={STEPS} breadcrumb={t("tutorialAdottante.breadcrumb")} breadcrumbRole={t("tutorialAdottante.breadcrumbRole")} />
          {renderStep()}
          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}><ArrowLeft className="mr-1 h-4 w-4" /> {t("tutorialAdottante.prev")}</Button>
            {step < STEPS.length - 1 && <Button onClick={() => setStep(step + 1)}>{t("tutorialAdottante.next")} <ArrowRight className="ml-1 h-4 w-4" /></Button>}
          </div>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default TutorialAdottante;
