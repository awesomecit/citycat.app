import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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

const Step1 = ({ onNext }: { onNext: (h: boolean) => void }) => {
  const { t } = useTranslation();
  const [heartPrompt, setHeartPrompt] = useState(false);
  const sliders = [
    { label: t("tutorialEnte.s1SociabilityHumans"), val: 3 },
    { label: t("tutorialEnte.s1SociabilityCats"), val: 2 },
    { label: t("tutorialEnte.s1Energy"), val: 2 },
    { label: t("tutorialEnte.s1Alone"), val: "6h" },
    { label: t("tutorialEnte.s1Affection"), val: t("tutorialEnte.s1AffectionVal") },
    { label: t("tutorialEnte.s1Vocality"), val: t("tutorialEnte.s1VocalityVal") },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialEnte.s1Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialEnte.s1Desc")}</p>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t("tutorialEnte.s1CardTitle")}</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            {[[t("tutorialEnte.s1Name"), "Romeo"], [t("tutorialEnte.s1Sex"), t("tutorialEnte.s1Male")], [t("tutorialEnte.s1AgeEst"), "11 anni"], [t("tutorialEnte.s1Sterilized"), "Sì ✓"], [t("tutorialEnte.s1Microchip"), "Sì ✓"], [t("tutorialEnte.s1FIV"), t("tutorialEnte.s1Positive")]].map(([l, v]) => (
              <div key={l} className="rounded-lg bg-secondary p-2">
                <span className="text-xs text-muted-foreground">{l}</span>
                <p className="font-semibold text-foreground">{v}</p>
              </div>
            ))}
          </div>
          <Badge className="bg-destructive/15 text-destructive">{t("tutorialEnte.s1FIVBadge")}</Badge>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t("tutorialEnte.s1BehavioralTitle")}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sliders.map((s) => (
            <div key={s.label} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-semibold text-foreground">
                {typeof s.val === "number" ? (
                  <span className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (<span key={i} className={`inline-block h-2 w-4 rounded-sm ${i < (s.val as number) ? "bg-primary" : "bg-muted"}`} />))}
                    <span className="ml-1 text-xs">{s.val}/5</span>
                  </span>
                ) : s.val}
              </span>
            </div>
          ))}
          <Badge className="bg-primary/15 text-primary">{t("tutorialEnte.s1ProfileComplete")}</Badge>
        </CardContent>
      </Card>
      {!heartPrompt ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-semibold text-foreground">{t("tutorialEnte.s1HeartTrigger")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("tutorialEnte.s1HeartQuestion")}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Button size="sm" onClick={() => { setHeartPrompt(true); onNext(true); }}>{t("tutorialEnte.s1HeartYes")}</Button>
              <Button size="sm" variant="outline" onClick={() => { setHeartPrompt(true); onNext(false); }}>{t("tutorialEnte.s1HeartNo")}</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg bg-primary/10 p-3 text-center text-sm font-semibold text-primary">{t("tutorialEnte.s1HeartRegistered")}</div>
      )}
    </div>
  );
};

const Step2 = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialEnte.s2Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialEnte.s2Desc")}</p>
      </div>
      <Card className="border-2 border-destructive/30">
        <CardContent className="space-y-3 p-4">
          <Badge className="bg-destructive/15 text-destructive">❤️ {t("about.heartBadge")}</Badge>
          {[
            { label: t("tutorialEnte.s2Story"), text: t("tutorialEnte.s2StoryText") },
            { label: t("tutorialEnte.s2Patience"), text: t("tutorialEnte.s2PatienceText") },
            { label: t("tutorialEnte.s2Victories"), text: t("tutorialEnte.s2VictoriesText") },
            { label: t("tutorialEnte.s2LookingFor"), text: t("tutorialEnte.s2LookingForText") },
          ].map((f) => (
            <div key={f.label} className="space-y-1">
              <label className="text-xs font-semibold text-foreground">{f.label}</label>
              <div className="rounded-lg border border-input bg-card p-2 text-sm text-muted-foreground">{f.text}</div>
            </div>
          ))}
          <Button className="w-full">{t("tutorialEnte.s2Publish")}</Button>
        </CardContent>
      </Card>
      <div className="rounded-lg bg-primary/10 p-3 text-sm text-primary">{t("tutorialEnte.s2Published")}</div>
    </div>
  );
};

const Step3 = () => {
  const { t } = useTranslation();
  const [approved, setApproved] = useState(false);
  const candidates = [
    { name: "Marco R.", date: "2 gen", score: 87, status: t("tutorialEnte.s3InReview"), badge: false },
    { name: "Sara M.", date: "3 gen", score: 92, status: t("tutorialEnte.s3Waiting"), badge: true },
    { name: "Luca B.", date: "4 gen", score: 71, status: t("tutorialEnte.s3New"), badge: false },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialEnte.s3Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialEnte.s3Desc")}</p>
      </div>
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">{t("tutorialEnte.s3CardTitle")}</CardTitle></CardHeader>
        <CardContent className="space-y-2 p-4 pt-0">
          {candidates.map((c, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{c.name} {c.badge && <Badge variant="secondary" className="ml-1 text-[10px]">{t("tutorialEnte.s3Verified")}</Badge>}</p>
                <p className="text-xs text-muted-foreground">{c.date} · Score {c.score}/100 · {c.status}</p>
              </div>
              {i === 1 && !approved && <Button size="sm" className="h-7 text-xs" onClick={() => setApproved(true)}>{t("tutorialEnte.s3Approve")}</Button>}
              {i === 1 && approved && <Badge className="bg-primary/15 text-primary">{t("tutorialEnte.s3Approved")}</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>
      {approved && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">{t("tutorialEnte.s3ApprovedMsg")}</p>
            <p className="mt-1">{t("tutorialEnte.s3NotifMsg")}</p>
          </CardContent>
        </Card>
      )}
      {/* Home verification info box */}
      <Card className="border-accent bg-accent/20">
        <CardContent className="p-4 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-lg">🏠</span>
            <p className="text-muted-foreground">{t("tutorialEnte.s3VerifInfo")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Step4 = () => {
  const { t } = useTranslation();
  const [assigned, setAssigned] = useState(false);
  const steps = [
    { icon: "✅", label: t("tutorialEnte.s4Step1"), done: true },
    { icon: "✅", label: t("tutorialEnte.s4Step2"), done: true },
    { icon: "✅", label: t("tutorialEnte.s4Step3"), done: true },
    { icon: "🔵", label: t("tutorialEnte.s4Step4"), done: false, active: true },
    { icon: "⭕", label: t("tutorialEnte.s4Step5"), done: false },
    { icon: "⭕", label: t("tutorialEnte.s4Step6"), done: false },
    { icon: "⭕", label: t("tutorialEnte.s4Step7"), done: false },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">{t("tutorialEnte.s4Title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tutorialEnte.s4Desc")}</p>
      </div>
      <Card>
        <CardContent className="space-y-0 p-4">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-start gap-3 border-l-2 py-2 pl-4 ${(s as any).active ? "border-primary bg-primary/5 rounded-r-lg" : s.done ? "border-primary/40" : "border-muted"}`}>
              <span>{s.icon}</span>
              <div className="flex-1">
                <p className={`text-sm ${(s as any).active ? "font-bold text-foreground" : s.done ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{s.label}</p>
                {(s as any).active && !assigned && (
                  <div className="mt-2 flex items-center gap-2">
                    <select className="rounded-lg border border-input bg-card px-2 py-1 text-xs"><option>Sara B.</option><option>Marco F.</option><option>Giulia T.</option></select>
                    <Button size="sm" className="h-7 text-xs" onClick={() => setAssigned(true)}>{t("tutorialEnte.s4Assign")}</Button>
                  </div>
                )}
                {(s as any).active && assigned && <p className="mt-1 text-xs text-primary font-semibold">{t("tutorialEnte.s4Assigned")}</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      {assigned && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 text-sm text-muted-foreground">{t("tutorialEnte.s4NotifMsg")}</CardContent>
        </Card>
      )}
    </div>
  );
};

const Step5 = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const completed = [t("tutorialEnte.s5Done1"), t("tutorialEnte.s5Done2"), t("tutorialEnte.s5Done3"), t("tutorialEnte.s5Done4")];
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-foreground">{t("tutorialEnte.s5Title")}</h2>
      <Card>
        <CardContent className="space-y-2 p-4">
          {completed.map((c) => (<div key={c} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-primary" /><span className="text-foreground">{c}</span></div>))}
        </CardContent>
      </Card>
      <Card className="bg-accent/30"><CardContent className="p-4 text-sm text-muted-foreground">{t("tutorialEnte.s5Result")}</CardContent></Card>
      <div className="space-y-2">
        <Button className="w-full" onClick={() => navigate("/pricing")}>{t("tutorialEnte.s5CtaShelter")}</Button>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-xs" onClick={() => navigate("/tutorial/adottante")}>{t("tutorialEnte.s5CtaAdopter")}</Button>
          <Button variant="outline" className="flex-1 text-xs" onClick={() => navigate("/tutorial/volontario")}>{t("tutorialEnte.s5CtaVolunteer")}</Button>
        </div>
      </div>
    </div>
  );
};

const TutorialEnte = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [, setHeartActivated] = useState(false);
  const STEPS = [t("tutorialEnte.step1"), t("tutorialEnte.step2"), t("tutorialEnte.step3"), t("tutorialEnte.step4"), t("tutorialEnte.step5")];

  const renderStep = () => {
    switch (step) {
      case 0: return <Step1 onNext={(h) => { setHeartActivated(h); setStep(h ? 1 : 2); }} />;
      case 1: return <Step2 />;
      case 2: return <Step3 />;
      case 3: return <Step4 />;
      case 4: return <Step5 />;
      default: return null;
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <GlobalHeader />
        <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">{t("tutorialEnte.pageTitle")}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("tutorialEnte.pageDesc")}</p>
          </div>
          <StepNav step={step} setStep={setStep} steps={STEPS} breadcrumb={t("tutorialEnte.breadcrumb")} breadcrumbRole={t("tutorialEnte.breadcrumbRole")} />
          {renderStep()}
          <div className="flex justify-between pt-4">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(Math.max(0, step - 1))}>
              <ArrowLeft className="mr-1 h-4 w-4" /> {t("tutorialEnte.prev")}
            </Button>
            {step < STEPS.length - 1 && (
              <Button onClick={() => setStep(step + 1)}>{t("tutorialEnte.next")} <ArrowRight className="ml-1 h-4 w-4" /></Button>
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default TutorialEnte;
