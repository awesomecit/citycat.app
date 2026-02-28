import { useNavigate } from "react-router-dom";
import { buildBetaMailto } from "@/lib/betaMailto";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, CheckCircle2, Circle, Loader2 } from "lucide-react";

interface Milestone {
  dateKey: string;
  titleKey: string;
  status: "done" | "in-progress" | "planned";
  statusLabelKey: string;
  featureKeys: string[];
  roleKeys: string[];
}

const MILESTONES: Milestone[] = [
  { dateKey: "roadmap.block0Date", titleKey: "roadmap.block0Title", status: "done", statusLabelKey: "roadmap.statusDone",
    featureKeys: ["roadmap.block0Feat1","roadmap.block0Feat2","roadmap.block0Feat3","roadmap.block0Feat4","roadmap.block0Feat5","roadmap.block0Feat6"],
    roleKeys: ["roadmap.block0Roles"] },
  { dateKey: "roadmap.block1Date", titleKey: "roadmap.block1Title", status: "in-progress", statusLabelKey: "roadmap.block1Status",
    featureKeys: ["roadmap.block1Feat1","roadmap.block1Feat2","roadmap.block1Feat3","roadmap.block1Feat4","roadmap.block1Feat5","roadmap.block1Feat6","roadmap.block1Feat7","roadmap.block1Feat8","roadmap.block1Feat9"],
    roleKeys: ["about.roleAdopter","about.roleShelter","about.roleVolunteer"] },
  { dateKey: "roadmap.block2Date", titleKey: "roadmap.block2Title", status: "planned", statusLabelKey: "roadmap.block2Status",
    featureKeys: ["roadmap.block2Feat1","roadmap.block2Feat2","roadmap.block2Feat3","roadmap.block2Feat4","roadmap.block2Feat5","roadmap.block2Feat6"],
    roleKeys: ["about.roleVolunteer","about.roleRelay","about.roleFoster","about.roleAdopter"] },
  { dateKey: "roadmap.block3Date", titleKey: "roadmap.block3Title", status: "planned", statusLabelKey: "roadmap.block3Status",
    featureKeys: ["roadmap.block3Feat1","roadmap.block3Feat2","roadmap.block3Feat3","roadmap.block3Feat4","roadmap.block3Feat5","roadmap.block3Feat6"],
    roleKeys: ["about.roleVet","about.roleBehaviorist","about.roleCatSitter"] },
  { dateKey: "roadmap.block4Date", titleKey: "roadmap.block4Title", status: "planned", statusLabelKey: "roadmap.block4Status",
    featureKeys: ["roadmap.block4Feat1","roadmap.block4Feat2","roadmap.block4Feat3","roadmap.block4Feat4","roadmap.block4Feat5","roadmap.block4Feat6"],
    roleKeys: ["about.roleAdopter"] },
  { dateKey: "roadmap.block5Date", titleKey: "roadmap.block5Title", status: "planned", statusLabelKey: "roadmap.block5Status",
    featureKeys: ["roadmap.block5Feat1","roadmap.block5Feat2","roadmap.block5Feat3","roadmap.block5Feat4","roadmap.block5Feat5"],
    roleKeys: ["about.roleAdopter","roles.artisan","about.roleShelter"] },
  { dateKey: "roadmap.block6Date", titleKey: "roadmap.block6Title", status: "planned", statusLabelKey: "roadmap.block6Status",
    featureKeys: ["roadmap.block6Feat1","roadmap.block6Feat2","roadmap.block6Feat3","roadmap.block6Feat4","roadmap.block6Feat5"],
    roleKeys: ["about.roleMunicipality","about.roleShelter","roles.breeder"] },
];

const CHANGELOG = [
  { version: "v0.1.0", date: "Febbraio 2026", items: "Design system · App shell · Pricing page · About page · Tutorial guidati · Roadmap pubblica" },
  { version: "v0.2.0", date: "Aprile 2026", items: "Blocco 1 completo · Matching Wizard · RoutineLine live" },
  { version: "v0.3.0", date: "Maggio 2026", items: "Blocco 2 · Staffette · Gatti scomparsi" },
];

const statusConfig = {
  done: { icon: CheckCircle2, badgeClass: "bg-primary/15 text-primary", lineClass: "border-primary", dotClass: "bg-primary" },
  "in-progress": { icon: Loader2, badgeClass: "bg-accent text-accent-foreground", lineClass: "border-accent-foreground", dotClass: "bg-accent-foreground" },
  planned: { icon: Circle, badgeClass: "bg-muted text-muted-foreground", lineClass: "border-muted", dotClass: "bg-muted-foreground" },
};

const Roadmap = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <GlobalHeader />

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/30 to-background px-4 pb-10 pt-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("roadmap.heroTitle")}
          </motion.h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("roadmap.heroDesc")}</p>
          <Badge variant="secondary" className="mt-4 text-sm">{t("roadmap.heroBadge")}</Badge>
        </section>

        {/* Timeline */}
        <section className="mx-auto max-w-3xl px-4 py-10">
          <div className="relative">
            {MILESTONES.map((m, idx) => {
              const cfg = statusConfig[m.status];
              const Icon = cfg.icon;
              const isLast = idx === MILESTONES.length - 1;
              return (
                <div key={idx} className="relative flex gap-4 pb-8">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-card ${cfg.lineClass}`}>
                      <Icon className={`h-4 w-4 ${m.status === "in-progress" ? "animate-spin text-accent-foreground" : m.status === "done" ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    {!isLast && <div className={`w-0.5 flex-1 ${cfg.lineClass} border-l-2`} />}
                  </div>
                  <div className="flex-1 pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">{t(m.dateKey)}</span>
                      <Badge variant="outline" className={`text-[10px] ${cfg.badgeClass}`}>{t(m.statusLabelKey)}</Badge>
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-foreground">{t(m.titleKey)}</h3>
                    <Card className="mt-3">
                      <CardContent className="p-4">
                        <ul className="space-y-1.5">
                          {m.featureKeys.map((fk) => (
                            <li key={fk} className="flex items-start gap-2 text-sm">
                              <span className="mt-0.5 shrink-0">{m.status === "done" ? "✅" : m.status === "in-progress" ? "🔵" : "⭕"}</span>
                              <span className={m.status === "done" ? "text-muted-foreground" : "text-foreground"}>{t(fk)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 flex flex-wrap gap-1">
                          {m.roleKeys.map((rk) => (
                            <Badge key={rk} variant="secondary" className="text-[10px]">{t(rk)}</Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Changelog */}
        <section className="mx-auto max-w-3xl px-4 pb-10">
          <Accordion type="single" collapsible>
            <AccordionItem value="changelog">
              <AccordionTrigger className="text-base font-bold">{t("roadmap.changelogTitle")}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  {CHANGELOG.map((c) => (
                    <div key={c.version} className="rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">{c.version}</Badge>
                        <span className="text-xs text-muted-foreground">{c.date}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{c.items}</p>
                    </div>
                  ))}
                  <p className="text-xs italic text-muted-foreground">{t("roadmap.changelogGithub")}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA */}
        <section className="px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-foreground">{t("roadmap.ctaTitle")}</h2>
          <p className="mt-2 text-muted-foreground">{t("roadmap.ctaDesc")}</p>
          <Button size="lg" className="mt-5" asChild>
            <a href={buildBetaMailto(i18n.language?.startsWith("it") ? "it" : "en")} target="_blank" rel="noopener noreferrer">
              {t("roadmap.ctaButton")} <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </section>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Roadmap;
