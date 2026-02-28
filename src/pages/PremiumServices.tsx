import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Video, FileText, Cat, Calendar, Instagram, Download,
  Shield, Phone, Star, Crown, ExternalLink, Clock,
} from "lucide-react";

interface ServiceSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: { label: string; status: "available" | "coming" }[];
}

const PremiumServices = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [expandedSection, setExpandedSection] = useState<string | null>("videocall");

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const sections: ServiceSection[] = [
    {
      id: "videocall",
      icon: <Video className="h-5 w-5" />,
      title: t("premium.videocallTitle"),
      description: t("premium.videocallDesc"),
      items: [
        { label: t("premium.vc_booking"), status: "available" },
        { label: t("premium.vc_recording"), status: "available" },
        { label: t("premium.vc_notes"), status: "coming" },
      ],
    },
    {
      id: "catsitter",
      icon: <Cat className="h-5 w-5" />,
      title: t("premium.catsitterTitle"),
      description: t("premium.catsitterDesc"),
      items: [
        { label: t("premium.cs_search"), status: "available" },
        { label: t("premium.cs_contract"), status: "available" },
        { label: t("premium.cs_payment"), status: "coming" },
      ],
    },
    {
      id: "documents",
      icon: <FileText className="h-5 w-5" />,
      title: t("premium.documentsTitle"),
      description: t("premium.documentsDesc"),
      items: [
        { label: t("premium.doc_vet"), status: "available" },
        { label: t("premium.doc_municipal"), status: "available" },
        { label: t("premium.doc_adoption_export"), status: "available" },
      ],
    },
    {
      id: "social",
      icon: <Instagram className="h-5 w-5" />,
      title: t("premium.socialTitle"),
      description: t("premium.socialDesc"),
      items: [
        { label: t("premium.social_connect"), status: "available" },
        { label: t("premium.social_auto_post"), status: "coming" },
        { label: t("premium.social_stories"), status: "coming" },
      ],
    },
  ];

  // Mock vet bookings
  const mockBookings = [
    { id: "mb1", professional: "Dr. Marco Verdi", type: "veterinarian", date: "2026-03-12", time: "15:00", canRecord: true },
    { id: "mb2", professional: "Dr.ssa Elena Rossi", type: "behaviorist", date: "2026-03-18", time: "10:30", canRecord: false },
  ];

  // Mock cat sitter profiles
  const mockSitters = [
    { id: "ms1", name: "Sara B.", rating: 4.9, reviews: 47, price: 20, emoji: "🏡", verified: true },
    { id: "ms2", name: "Luca M.", rating: 4.7, reviews: 23, price: 15, emoji: "🐱", verified: true },
    { id: "ms3", name: "Giulia T.", rating: 4.8, reviews: 35, price: 18, emoji: "😺", verified: false },
  ];

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("premium.servicesTitle")} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Service sections */}
          {sections.map((section) => {
            const isOpen = expandedSection === section.id;
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border bg-card overflow-hidden"
              >
                <button
                  onClick={() => setExpandedSection(isOpen ? null : section.id)}
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{section.title}</p>
                    <p className="text-[10px] text-muted-foreground">{section.description}</p>
                  </div>
                  <Crown className="h-4 w-4 text-primary" />
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    className="border-t border-border px-4 pb-4 space-y-2"
                  >
                    {section.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 pt-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${item.status === "available" ? "bg-primary" : "bg-muted-foreground"}`} />
                        <span className="text-xs text-foreground flex-1">{item.label}</span>
                        <span className={`text-[10px] font-bold ${item.status === "available" ? "text-primary" : "text-muted-foreground"}`}>
                          {item.status === "available" ? "✓" : t("premium.comingSoon")}
                        </span>
                      </div>
                    ))}

                    {/* Extra content per section */}
                    {section.id === "videocall" && (
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("premium.upcomingCalls")}</p>
                        {mockBookings.map((b) => (
                          <div key={b.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                            <Video className="h-4 w-4 text-primary" />
                            <div className="flex-1">
                              <p className="text-xs font-bold text-foreground">{b.professional}</p>
                              <p className="text-[10px] text-muted-foreground">{b.date} · {b.time}</p>
                            </div>
                            <button className="rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground">
                              {t("premium.join")}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.id === "catsitter" && (
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("premium.nearYou")}</p>
                        {mockSitters.map((s) => (
                          <div key={s.id} className="flex items-center gap-3 rounded-xl bg-secondary/50 p-3">
                            <span className="text-xl">{s.emoji}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-bold text-foreground">{s.name}</p>
                                {s.verified && <Shield className="h-3 w-3 text-primary" />}
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-accent" fill="currentColor" />
                                <span className="text-[10px] text-foreground">{s.rating} ({s.reviews})</span>
                              </div>
                            </div>
                            <span className="text-xs font-extrabold text-foreground">€{s.price}/g</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {section.id === "documents" && (
                      <div className="mt-3 space-y-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{t("premium.availableDocs")}</p>
                        {[
                          { name: t("premium.doc_health_export"), icon: <FileText className="h-3.5 w-3.5" /> },
                          { name: t("premium.doc_adoption_cert"), icon: <Shield className="h-3.5 w-3.5" /> },
                          { name: t("premium.doc_municipal_form"), icon: <FileText className="h-3.5 w-3.5" /> },
                        ].map((d, i) => (
                          <button key={i} className="flex w-full items-center gap-3 rounded-xl bg-secondary/50 p-3 text-left hover:bg-secondary transition-colors">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">{d.icon}</div>
                            <span className="text-xs font-bold text-foreground flex-1">{d.name}</span>
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    )}

                    {section.id === "social" && (
                      <div className="mt-3 space-y-2">
                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[hsl(330_50%_45%)] to-[hsl(25_85%_55%)] py-3 text-xs font-bold text-white">
                          <Instagram className="h-4 w-4" /> {t("premium.connectInstagram")}
                        </button>
                        <p className="text-[10px] text-muted-foreground text-center">{t("premium.socialNote")}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Adoption history export */}
          <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{t("premium.adoptionHistoryTitle")}</p>
                <p className="text-[10px] text-muted-foreground">{t("premium.adoptionHistoryDesc")}</p>
              </div>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-xs font-bold text-muted-foreground hover:bg-secondary/50 transition-colors">
              <Download className="h-4 w-4" /> {t("premium.downloadHistory")}
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default PremiumServices;
