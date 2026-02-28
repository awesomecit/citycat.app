import { useState } from "react";
import { buildBetaMailto } from "@/lib/betaMailto";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Check, Star } from "lucide-react";

type TabKey = "adottanti" | "enti" | "professionisti" | "volontari" | "comuni";

interface PlanCard {
  name: string;
  price: string;
  sub?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
  note?: string;
}

const Pricing = () => {
  const [tab, setTab] = useState<TabKey>("adottanti");
  const { t, i18n } = useTranslation();

  const TABS: { key: TabKey; label: string }[] = [
    { key: "adottanti", label: t("pricing.tabAdopters") },
    { key: "enti", label: t("pricing.tabShelters") },
    { key: "professionisti", label: t("pricing.tabPro") },
    { key: "volontari", label: t("pricing.tabVolunteers") },
    { key: "comuni", label: t("pricing.tabMunicipalities") },
  ];

  const PLANS: Record<TabKey, PlanCard[]> = {
    adottanti: [
      {
        name: t("pricing.adopterFree"), price: "€0", sub: t("pricing.forever"),
        features: [t("pricing.adopterFreeFeat1"), t("pricing.adopterFreeFeat2"), t("pricing.adopterFreeFeat3"), t("pricing.adopterFreeFeat4"), t("pricing.adopterFreeFeat5"), t("pricing.adopterFreeFeat6")],
        cta: t("pricing.startFree"),
      },
      {
        name: t("pricing.adopterPremium"), price: "€29/anno", sub: t("pricing.adopterPremiumSub"),
        highlighted: true, badge: t("pricing.mostPopular"),
        features: [t("pricing.adopterPremiumFeat1"), t("pricing.adopterPremiumFeat2"), t("pricing.adopterPremiumFeat3"), t("pricing.adopterPremiumFeat4"), t("pricing.adopterPremiumFeat5"), t("pricing.adopterPremiumFeat6"), t("pricing.adopterPremiumFeat7"), t("pricing.adopterPremiumFeat8"), t("pricing.adopterPremiumFeat9"), t("pricing.adopterPremiumFeat10")],
        cta: t("pricing.betaApply"),
      },
    ],
    enti: [
      { name: t("pricing.shelterBase"), price: "€99/anno", features: [t("pricing.shelterBaseFeat1"), t("pricing.shelterBaseFeat2"), t("pricing.shelterBaseFeat3"), t("pricing.shelterBaseFeat4"), t("pricing.shelterVerifNote")], cta: t("pricing.apply") },
      { name: t("pricing.shelterPro"), price: "€199/anno", highlighted: true, badge: t("pricing.recommended"), features: [t("pricing.shelterProFeat1"), t("pricing.shelterProFeat2"), t("pricing.shelterProFeat3"), t("pricing.shelterProFeat4"), t("pricing.shelterProFeat5"), t("pricing.shelterProFeat6"), t("pricing.shelterVerifNote")], cta: t("pricing.betaApply") },
      { name: t("pricing.enterprise"), price: "€399/anno", features: [t("pricing.enterpriseFeat1"), t("pricing.enterpriseFeat2"), t("pricing.enterpriseFeat3"), t("pricing.enterpriseFeat4"), t("pricing.enterpriseFeat5"), t("pricing.shelterVerifNote")], cta: t("pricing.contactUs") },
    ],
    professionisti: [
      { name: t("pricing.vetPro"), price: "€79/anno", features: [t("pricing.vetFeat1"), t("pricing.vetFeat2"), t("pricing.vetFeat3"), t("pricing.vetFeat4")], cta: t("pricing.apply") },
      { name: t("pricing.behaviorist"), price: "€27/anno", features: [t("pricing.behavioristFeat1"), t("pricing.behavioristFeat2"), t("pricing.behavioristFeat3")], cta: t("pricing.apply") },
      { name: t("pricing.catSitter"), price: "€15/anno", features: [t("pricing.catSitterFeat1"), t("pricing.catSitterFeat2"), t("pricing.catSitterFeat3")], cta: t("pricing.apply") },
    ],
    volontari: [
      { name: t("pricing.volunteer"), price: "€0", sub: t("pricing.forever"), features: [t("pricing.volunteerFeat1"), t("pricing.volunteerFeat2"), t("pricing.volunteerFeat3"), t("pricing.volunteerFeat4")], cta: t("pricing.startFree") },
      { name: t("pricing.volunteerPro"), price: "€9/anno", highlighted: true, badge: t("pricing.newBadge"), features: [t("pricing.volunteerProFeat1"), t("pricing.volunteerProFeat2"), t("pricing.volunteerProFeat3"), t("pricing.volunteerProFeat4")], cta: t("pricing.apply") },
      { name: t("pricing.fosterFamily"), price: "€0", sub: t("pricing.fosterAlwaysFree"), features: [t("pricing.fosterFeat1"), t("pricing.fosterFeat2"), t("pricing.fosterFeat3"), t("pricing.fosterVerifNote")], cta: t("pricing.startFree"), note: t("pricing.fosterFeat3") },
      { name: t("pricing.relay"), price: "€0", sub: t("pricing.relaySub"), features: [t("pricing.relayFeat1"), t("pricing.relayFeat2"), t("pricing.relayFeat3")], cta: t("pricing.startFree") },
    ],
    comuni: [
      { name: t("pricing.b2g"), price: "€299/anno", sub: t("pricing.b2gFlat"), highlighted: true, features: [t("pricing.b2gFeat1"), t("pricing.b2gFeat2"), t("pricing.b2gFeat3"), t("pricing.b2gFeat4")], cta: t("pricing.contactUs"), note: t("pricing.b2gNote") },
    ],
  };

  const FAQS = [
    { q: t("pricing.faq1q"), a: t("pricing.faq1a") },
    { q: t("pricing.faq2q"), a: t("pricing.faq2a") },
    { q: t("pricing.faq3q"), a: t("pricing.faq3a") },
    { q: t("pricing.faq4q"), a: t("pricing.faq4a") },
    { q: t("pricing.faq5q"), a: t("pricing.faq5a") },
    { q: t("pricing.faq6q"), a: t("pricing.faq6a") },
  ];

  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <GlobalHeader />

        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/30 to-background px-4 pb-10 pt-8 text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("pricing.heroTitle")}
          </motion.h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("pricing.heroDesc")}</p>
          <Badge variant="secondary" className="mt-4 text-sm">{t("pricing.heroBadge")}</Badge>
        </section>

        {/* Tab selector */}
        <div className="sticky top-0 z-20 overflow-x-auto border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl gap-1 px-4 py-2">
            {TABS.map((tt) => (
              <button key={tt.key} onClick={() => setTab(tt.key)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === tt.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`}>
                {tt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <section className="px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className={`mx-auto grid max-w-4xl gap-4 ${PLANS[tab].length === 1 ? "max-w-lg" : PLANS[tab].length === 2 ? "sm:grid-cols-2" : PLANS[tab].length >= 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3"}`}>
              {PLANS[tab].map((plan) => (
                <Card key={plan.name} className={`relative flex flex-col overflow-hidden ${plan.highlighted ? "border-2 border-primary shadow-lg" : ""}`}>
                  {plan.badge && (
                    <div className="absolute right-3 top-3">
                      <Badge className="bg-primary text-primary-foreground"><Star className="mr-1 h-3 w-3" /> {plan.badge}</Badge>
                    </div>
                  )}
                  <CardContent className="flex flex-1 flex-col p-5">
                    <p className="text-lg font-bold text-foreground">{plan.name}</p>
                    <p className="text-3xl font-extrabold text-primary">{plan.price}</p>
                    {plan.sub && <p className="mt-0.5 text-xs text-muted-foreground">{plan.sub}</p>}
                    <ul className="mt-4 flex-1 space-y-2">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    {plan.note && <p className="mt-3 rounded-lg bg-accent/50 p-2 text-xs text-muted-foreground">{plan.note}</p>}
                    <Button className="mt-4 w-full" variant={plan.highlighted ? "default" : "outline"}>{plan.cta}</Button>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Beta Guarantee */}
        <section className="mx-auto max-w-3xl px-4 py-10">
          <Card className="border-2 border-primary/30 bg-primary/5">
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-bold text-foreground">{t("pricing.guaranteeTitle")}</h2>
              <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">{t("pricing.guaranteeDesc")}</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: t("pricing.guaranteeRatio"), value: "1:2,5" },
                  { label: t("pricing.guaranteeLocked"), value: t("pricing.guaranteeForever") },
                  { label: t("pricing.guaranteeSpots"), value: "50" },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-background p-3">
                    <p className="text-xl font-extrabold text-primary">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-2xl px-4 py-10">
          <h2 className="mb-6 text-center text-2xl font-bold text-foreground">{t("pricing.faqTitle")}</h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-sm font-semibold">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* Final CTA */}
        <section className="px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-foreground">{t("pricing.ctaTitle")}</h2>
          <p className="mt-2 text-muted-foreground">{t("pricing.ctaSpots")}</p>
          <Button size="lg" className="mt-5" asChild>
            <a href={buildBetaMailto(i18n.language?.startsWith("it") ? "it" : "en")} target="_blank" rel="noopener noreferrer">
              {t("pricing.ctaButton")} <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">{t("pricing.ctaNote")}</p>
        </section>

        <BottomNav />
      </div>
    </PageTransition>
  );
};

export default Pricing;
