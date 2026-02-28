import { useState } from "react";
import PresentationViewer from "@/components/PresentationViewer";
import { useNavigate } from "react-router-dom";
import { buildBetaMailto } from "@/lib/betaMailto";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles, Heart, ClipboardList, Users, Shield, CheckCircle2,
  ArrowRight, Calendar, MapPin, Stethoscope, ShoppingBag, BarChart3,
  Cat, Home, Wallet, Brain, Car, Handshake,
  ChevronRight, Camera, Star, Video,
} from "lucide-react";
import HomeVerificationMock from "@/components/HomeVerificationMock";

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/30 to-background px-4 pb-12 pt-8 text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
      >
        {t("about.heroTitle")}
      </motion.h1>
      <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("about.heroDesc")}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Badge variant="secondary" className="text-sm">{t("about.badge9roles")}</Badge>
        <Badge variant="secondary" className="text-sm">{t("about.badgeE2E")}</Badge>
        <Badge variant="secondary" className="text-sm">{t("about.badgeAnonymous")}</Badge>
      </div>
    </section>
  );
};

const RolesGrid = () => {
  const { t } = useTranslation();
  const roles = [
    { emoji: "👤", nameKey: "about.roleAdopter", price: "Free / €29 premium" },
    { emoji: "🙋", nameKey: "about.roleVolunteer", price: "Free" },
    { emoji: "🏠", nameKey: "about.roleShelter", price: "da €99/anno" },
    { emoji: "🏛️", nameKey: "about.roleMunicipality", price: "€299/anno" },
    { emoji: "🩺", nameKey: "about.roleVet", price: "Free / €79 pro" },
    { emoji: "🧠", nameKey: "about.roleBehaviorist", price: "€27/anno" },
    { emoji: "🏡", nameKey: "about.roleCatSitter", price: "€15/anno" },
    { emoji: "🚗", nameKey: "about.roleRelay", price: "Free" },
    { emoji: "🤝", nameKey: "about.roleFoster", price: "Free" },
  ];
  return (
    <section className="px-4 py-10">
      <h2 className="mb-6 text-center text-2xl font-bold text-foreground">{t("about.rolesTitle")}</h2>
      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.nameKey} className="text-center">
            <CardContent className="p-4">
              <span className="text-3xl">{r.emoji}</span>
              <p className="mt-1 font-semibold text-foreground">{t(r.nameKey)}</p>
              <Badge variant="outline" className="mt-1 text-xs">{r.price}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const CatProfileMock = () => {
  const { t } = useTranslation();
  const sliders = [
    { label: t("about.sociabilityHumans"), value: 80 },
    { label: t("about.sociabilityCats"), value: 60 },
    { label: t("about.energyLevel"), value: 40 },
  ];
  return (
    <Card className="border-2 border-accent">
      <CardContent className="space-y-3 p-4">
        <div className="flex h-24 w-full items-center justify-center rounded-lg bg-accent text-5xl">🐱</div>
        <div>
          <p className="font-bold text-foreground">Luna · Femmina · 3 anni</p>
          <p className="text-xs text-muted-foreground">Sterilizzata ✓ · Microchippata ✓</p>
        </div>
        <Badge className="bg-primary/15 text-primary">{t("about.catProfileComplete")}</Badge>
        {sliders.map((s) => (
          <div key={s.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-semibold text-foreground">{s.value / 20}/5</span>
            </div>
            <Progress value={s.value} className="h-2" />
          </div>
        ))}
        <div className="flex text-xs text-muted-foreground">
          <span>{t("about.aloneTolerance")}: <b>8 h</b></span>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">{t("about.indoor")}</Badge>
          <Badge variant="secondary">{t("about.okChildren")}</Badge>
          <Badge variant="secondary">{t("about.okDogs")}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

const FeatureCatProfile = () => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <CatProfileMock />
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">{t("about.catProfileTitle")}</h3>
        <p className="text-muted-foreground">{t("about.catProfileDesc")}</p>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>{t("about.catProfileFeat1")}</li>
          <li>{t("about.catProfileFeat2")}</li>
          <li>{t("about.catProfileFeat3")}</li>
        </ul>
        <Badge className="bg-primary/15 text-primary">{t("about.catProfileBadge")}</Badge>
      </div>
    </div>
  );
};

const MatchingWizardMock = () => {
  const { t } = useTranslation();
  return (
    <Card className="border-2 border-accent">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Progress value={50} className="h-2 flex-1" />
          <span className="font-semibold">3/6</span>
        </div>
        <p className="font-bold text-foreground">{t("about.matchingQuestion")}</p>
        {[t("about.matchingOpt1"), t("about.matchingOpt2"), t("about.matchingOpt3"), t("about.matchingOpt4")].map((o, i) => (
          <div key={i} className={`rounded-lg border p-3 text-sm ${i === 1 ? "border-primary bg-primary/10 font-semibold text-foreground" : "border-border text-muted-foreground"}`}>
            {o}
          </div>
        ))}
        <p className="text-xs italic text-muted-foreground">{t("about.matchingHint")}</p>
        <Card className="mt-2 bg-accent/40">
          <CardContent className="p-3">
            <p className="font-bold text-foreground">{t("about.matchingResult")}</p>
            <Progress value={94} className="my-1 h-2" />
            <ul className="space-y-0.5 text-xs text-muted-foreground">
              <li>✓ {t("about.matchingR1")}</li>
              <li>✓ {t("about.matchingR2")}</li>
              <li>✓ {t("about.matchingR3")}</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

const FeatureMatchingWizard = () => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <div className="order-2 md:order-1 space-y-3">
        <h3 className="text-xl font-bold text-foreground">{t("about.matchingTitle")}</h3>
        <p className="text-muted-foreground">{t("about.matchingDesc")}</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>📌 {t("about.matchingRule1")}</p>
          <p>📌 {t("about.matchingRule2")}</p>
          <p>📌 {t("about.matchingRule3")}</p>
        </div>
        <Badge className="bg-primary/15 text-primary">{t("about.matchingBadge")}</Badge>
      </div>
      <div className="order-1 md:order-2"><MatchingWizardMock /></div>
    </div>
  );
};

const HeartAdoptionMock = () => {
  const { t } = useTranslation();
  return (
    <Card className="border-2 border-destructive/40 bg-destructive/5">
      <CardContent className="space-y-3 p-4">
        <Badge className="bg-destructive/20 text-destructive">❤️ {t("about.heartBadge")}</Badge>
        <div className="flex h-20 w-full items-center justify-center rounded-lg bg-accent text-4xl">🐱</div>
        <p className="font-bold text-foreground">Romeo · Maschio · 11 anni · FIV+</p>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="story">
            <AccordionTrigger className="text-sm">{t("about.heartStory")}</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground">{t("about.heartStoryText")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="patience">
            <AccordionTrigger className="text-sm">{t("about.heartPatience")}</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground">{t("about.heartPatienceText")}</AccordionContent>
          </AccordionItem>
          <AccordionItem value="wins">
            <AccordionTrigger className="text-sm">{t("about.heartVictories")}</AccordionTrigger>
            <AccordionContent className="text-xs text-muted-foreground">{t("about.heartVictoriesText")}</AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button size="sm" className="w-full">{t("about.heartCta")}</Button>
      </CardContent>
    </Card>
  );
};

const FeatureHeartAdoptions = () => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <HeartAdoptionMock />
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">{t("about.heartTitle")}</h3>
        <p className="text-muted-foreground">{t("about.heartDesc")}</p>
        <p className="text-sm text-muted-foreground">{t("about.heartDesc2")}</p>
      </div>
    </div>
  );
};

const RoutineLineMock = () => {
  const { t } = useTranslation();
  const steps = [
    { icon: "✅", label: t("about.rl_step1"), status: t("about.rl_completed"), date: "3 gen 14:30" },
    { icon: "✅", label: t("about.rl_step2"), status: t("about.rl_completed"), date: "4 gen 09:15" },
    { icon: "✅", label: t("about.rl_step3"), status: t("about.rl_completed"), date: "5 gen 16:00" },
    { icon: "🔵", label: t("about.rl_step4"), status: t("about.rl_inProgress"), date: "scadenza: 12 gen" },
    { icon: "⭕", label: t("about.rl_step5"), status: t("about.rl_notStarted"), date: "" },
    { icon: "⭕", label: t("about.rl_step6"), status: t("about.rl_notStarted"), date: "" },
    { icon: "⭕", label: t("about.rl_step7"), status: t("about.rl_notStarted"), date: "" },
    { icon: "⭕", label: t("about.rl_step8"), status: t("about.rl_notStarted"), date: "" },
    { icon: "⭕", label: t("about.rl_step9"), status: t("about.rl_notStarted"), date: "" },
    { icon: "⭕", label: t("about.rl_step10"), status: t("about.rl_notStarted"), date: "" },
  ];
  return (
    <Card className="border-2 border-accent">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("about.routineCardTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 p-4 pt-0">
        {steps.map((s, i) => (
          <div key={i} className={`relative flex items-start gap-3 border-l-2 py-2 pl-4 ${s.status === t("about.rl_inProgress") ? "border-primary bg-primary/5 rounded-r-lg" : s.status === t("about.rl_completed") ? "border-green-500" : "border-muted"}`}>
            <span className="text-base">{s.icon}</span>
            <div className="flex-1">
              <p className={`text-sm ${s.status === t("about.rl_inProgress") ? "font-bold text-foreground" : s.status === t("about.rl_completed") ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{s.label}</p>
              {s.date && <p className="text-xs text-muted-foreground">{s.date}</p>}
              {s.status === t("about.rl_inProgress") && (
                <p className="mt-1 text-xs text-muted-foreground">{t("about.rl_assignedTo")}</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const FeatureRoutineLine = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-4">
      <div className="mx-auto max-w-lg"><RoutineLineMock /></div>
      <div className="space-y-3 text-center">
        <h3 className="text-xl font-bold text-foreground">{t("about.routineTitle")}</h3>
        <p className="mx-auto max-w-xl text-muted-foreground">{t("about.routineDesc")}</p>
      </div>
    </div>
  );
};

const TaskBoardMock = () => {
  const { t } = useTranslation();
  const tasks = [
    { label: t("about.task1"), ente: t("about.task1Ente"), urgency: t("about.task1Urgency"), color: "border-destructive/60 bg-destructive/5" },
    { label: t("about.task2"), ente: t("about.task2Ente"), urgency: t("about.task2Urgency"), color: "border-yellow-500/50 bg-yellow-500/5" },
    { label: t("about.task3"), ente: t("about.task3Ente"), urgency: t("about.task3Urgency"), color: "border-green-500/50 bg-green-500/5" },
  ];
  return (
    <Card className="mx-auto max-w-xs border-2 border-accent">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("about.taskCardTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {tasks.map((tt, i) => (
          <div key={i} className={`rounded-lg border-l-4 p-3 ${tt.color}`}>
            <p className="text-sm font-semibold text-foreground">{tt.label}</p>
            <p className="text-xs text-muted-foreground">{tt.ente}</p>
            <p className="mt-1 text-xs font-bold">{tt.urgency}</p>
          </div>
        ))}
        <p className="text-center text-xs text-muted-foreground">{t("about.taskSwipeHint")}</p>
      </CardContent>
    </Card>
  );
};

const FeatureTaskBoard = () => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">{t("about.taskTitle")}</h3>
        <p className="text-muted-foreground">{t("about.taskDesc")}</p>
      </div>
      <TaskBoardMock />
    </div>
  );
};

const CandidatureMock = () => {
  const { t } = useTranslation();
  const candidates = [
    { name: "Marco R.", date: "2 gen", score: 87, status: t("about.candidatureInReview"), badge: false },
    { name: "Sara M.", date: "3 gen", score: 92, status: t("about.candidatureWaiting"), badge: true },
    { name: "Luca B.", date: "4 gen", score: 71, status: t("about.candidatureNew"), badge: false },
  ];
  return (
    <Card className="border-2 border-accent">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t("about.candidatureCardTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0">
        {candidates.map((c, i) => (
          <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {c.name} {c.badge && <Badge variant="secondary" className="ml-1 text-[10px]">{t("about.candidatureVerified")}</Badge>}
              </p>
              <p className="text-xs text-muted-foreground">{c.date} · Score {c.score}/100 · {c.status}</p>
            </div>
            {i === 0 && (
              <div className="flex gap-1">
                <Button size="sm" variant="default" className="h-7 text-xs">{t("about.candidatureApprove")}</Button>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const FeatureCandidature = () => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-foreground">{t("about.candidatureTitle")}</h3>
        <p className="text-muted-foreground">{t("about.candidatureDesc")}</p>
        <p className="text-sm text-muted-foreground">{t("about.candidatureDesc2")}</p>
      </div>
      <CandidatureMock />
    </div>
  );
};

const FeatureHomeVerification = () => {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <div className="order-2 md:order-1 space-y-3">
        <h3 className="text-xl font-bold text-foreground">{t("homeVerif.featureTitle")}</h3>
        <p className="text-muted-foreground">{t("homeVerif.featureDesc")}</p>
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>{t("homeVerif.featureBullet1")}</li>
          <li>{t("homeVerif.featureBullet2")}</li>
          <li>{t("homeVerif.featureBullet3")}</li>
          <li>{t("homeVerif.featureBullet4")}</li>
        </ul>
        <Badge className="bg-primary/15 text-primary">{t("homeVerif.featureBadge")}</Badge>
      </div>
      <div className="order-1 md:order-2"><HomeVerificationMock /></div>
    </div>
  );
};

const ProfessionalCard = ({ name, spec, badge, chips, desc, cta, updateText }: {
  name: string; spec: string; badge: string; chips: string[]; desc: string; cta: string; updateText?: string;
}) => {
  const { t } = useTranslation();
  return (
    <Card className="flex flex-col overflow-hidden border-2 border-accent">
      <CardContent className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-xl">
            {spec.includes("Vet") || spec.includes("Veterina") ? "🩺" : spec.includes("Comporta") || spec.includes("Behav") ? "🧠" : "🏡"}
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{name}</p>
            <p className="text-xs text-muted-foreground">{spec} · <Star className="inline h-3 w-3 text-primary" /> 4.9</p>
          </div>
        </div>
        <Badge variant="secondary" className="mb-2 w-fit text-[10px]">{badge}</Badge>
        <div className="mb-3 flex flex-wrap gap-1">
          {chips.map((c) => <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>)}
        </div>
        {updateText && (
          <div className="mb-3 rounded-lg border border-border bg-secondary/50 p-2 text-xs text-muted-foreground">
            {updateText}
          </div>
        )}
        <p className="flex-1 text-xs text-muted-foreground">{desc}</p>
        <Button className="mt-3 w-full" disabled>
          {cta}
          <Badge variant="secondary" className="ml-2 text-[10px]">{t("about.comingSoonLabel")}</Badge>
        </Button>
      </CardContent>
    </Card>
  );
};

const FeatureProfessionals = () => {
  const { t } = useTranslation();
  return (
    <section className="px-4 py-10">
      <div className="mb-6 text-center">
        <Badge className="bg-accent text-accent-foreground">{t("about.featureProBadge")}</Badge>
        <h2 className="mt-2 text-2xl font-bold text-foreground">{t("about.featureProTitle")}</h2>
      </div>
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
        <ProfessionalCard
          name={t("about.vetName")} spec={t("about.vetSpec")} badge={t("about.vetBadge")}
          chips={[t("about.vetChip1"), t("about.vetChip2"), t("about.vetChip3")]}
          desc={t("about.vetDesc")} cta={t("about.vetPrice")}
        />
        <ProfessionalCard
          name={t("about.behName")} spec={t("about.behSpec")} badge={t("about.behBadge")}
          chips={[t("about.behChip1"), t("about.behChip2")]}
          desc={t("about.behDesc")} cta={t("about.bookSession")}
        />
        <ProfessionalCard
          name={t("about.sitterName")} spec={t("about.sitterSpec")} badge={t("about.sitterBadge")}
          chips={[t("about.sitterChip1"), t("about.sitterChip2"), t("about.sitterChip3")]}
          desc={t("about.sitterDesc")} cta={t("about.bookStay")}
          updateText={t("about.sitterUpdate")}
        />
      </div>
    </section>
  );
};

const FeatureHealthModal = () => {
  const { t } = useTranslation();
  return (
    <Card className="border-2 border-primary/20 mx-auto max-w-2xl">
      <CardContent className="p-5 text-center">
        <Badge variant="outline" className="mb-2">{t("about.featureHealthDate")}</Badge>
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">💊</div>
        <h3 className="text-lg font-bold text-foreground">{t("about.featureHealthTitle")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t("about.featureHealthDesc")}</p>
      </CardContent>
    </Card>
  );
};

const ComingSoonSection = () => {
  const { t } = useTranslation();
  const comingSoon = [
    { date: "Maggio 2026", titleKey: "about.cs_missingTitle", descKey: "about.cs_missingDesc", icon: MapPin },
    { date: "Giugno 2026", titleKey: "about.cs_proTitle", descKey: "about.cs_proDesc", icon: Stethoscope },
    { date: "Luglio 2026", titleKey: "about.cs_healthTitle", descKey: "about.cs_healthDesc", icon: Wallet },
    { date: "Settembre 2026", titleKey: "about.cs_marketTitle", descKey: "about.cs_marketDesc", icon: ShoppingBag },
    { date: "Ottobre 2026", titleKey: "about.cs_dashTitle", descKey: "about.cs_dashDesc", icon: BarChart3 },
    { date: "2027", titleKey: "about.cs_matchingTitle", descKey: "about.cs_matchingDesc", icon: Brain },
  ];
  return (
    <section className="px-4 py-10">
      <h2 className="mb-2 text-center text-2xl font-bold text-foreground">{t("about.comingSoonTitle")}</h2>
      <p className="mb-6 text-center text-sm text-muted-foreground">{t("about.comingSoonDesc")}</p>
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {comingSoon.map((cs) => {
          const Icon = cs.icon;
          return (
            <Card key={cs.titleKey} className="relative overflow-hidden">
              <CardContent className="p-4">
                <Badge variant="outline" className="mb-2 text-xs">{cs.date}</Badge>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <Icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t(cs.titleKey)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{t(cs.descKey)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

const PricingSnapshot = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-accent/30 px-4 py-10 text-center">
      <h2 className="mb-6 text-2xl font-bold text-foreground">{t("about.pricingSnapTitle")}</h2>
      <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-3">
        {[
          { role: t("about.pricingSnapAdopter"), price: "€29/anno", desc: t("about.pricingSnapAdopterDesc") },
          { role: t("about.pricingSnapShelter"), price: "da €99/anno", desc: t("about.pricingSnapShelterDesc") },
          { role: t("about.pricingSnapPro"), price: "da €15/anno", desc: t("about.pricingSnapProDesc") },
        ].map((p) => (
          <Card key={p.role} className="text-center">
            <CardContent className="p-5">
              <p className="text-lg font-bold text-foreground">{p.role}</p>
              <p className="text-2xl font-extrabold text-primary">{p.price}</p>
              <p className="mt-2 text-xs text-muted-foreground">{p.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

const FinalCTA = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("it") ? "it" : "en";
  return (
    <section className="px-4 py-12 text-center">
      <h2 className="text-2xl font-bold text-foreground">{t("about.ctaTitle")}</h2>
      <p className="mt-2 text-muted-foreground">{t("about.ctaSpots")}</p>
      <Button size="lg" className="mt-5" asChild>
        <a href={buildBetaMailto(lang)} target="_blank" rel="noopener noreferrer">
          {t("about.ctaButton")} <ArrowRight className="ml-2 h-4 w-4" />
        </a>
      </Button>
      <p className="mt-2 text-xs text-muted-foreground">{t("about.ctaNote")}</p>
    </section>
  );
};

const About = () => {
  const { t } = useTranslation();
  const [presOpen, setPresOpen] = useState(false);
  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <GlobalHeader />
        <Hero />
        {/* Presentation CTA */}
        <div className="flex justify-center px-4 py-4">
          <Button variant="outline" size="lg" onClick={() => setPresOpen(true)} className="gap-2 font-bold">
            {t("presentation.openBtn")}
          </Button>
        </div>
        <RolesGrid />
        <section className="space-y-10 px-4 py-10">
          <div className="text-center">
            <Badge className="bg-primary/20 text-primary">{t("about.block1Badge")}</Badge>
            <h2 className="mt-2 text-2xl font-bold text-foreground">{t("about.block1Title")}</h2>
          </div>
          <div className="mx-auto max-w-4xl space-y-14">
            <FeatureCatProfile />
            <FeatureMatchingWizard />
            <FeatureHeartAdoptions />
            <FeatureRoutineLine />
            <FeatureTaskBoard />
            <FeatureCandidature />
            <FeatureHomeVerification />
          </div>
        </section>
        <section className="bg-accent/20 px-4 py-10 text-center">
          <Badge variant="outline">{t("about.matchingEngineBadge")}</Badge>
          <h2 className="mt-2 text-xl font-bold text-foreground">{t("about.matchingEngineTitle")}</h2>
          <div className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { from: t("about.me_pregnancy"), to: t("about.me_pregnancyResult") },
              { from: t("about.me_hours"), to: t("about.me_hoursResult") },
              { from: t("about.me_budget"), to: t("about.me_budgetResult") },
            ].map((r) => (
              <Card key={r.from}>
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-semibold text-foreground">{r.from}</p>
                  <ChevronRight className="mx-auto my-1 h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">{r.to}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        <FeatureProfessionals />
        <div className="px-4 py-10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-foreground">{t("about.featureHealthTitle")}</h2>
          </div>
          <FeatureHealthModal />
        </div>
        <ComingSoonSection />
        <PricingSnapshot />
        <FinalCTA />
        <PresentationViewer open={presOpen} onOpenChange={setPresOpen} />
        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default About;
