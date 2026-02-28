import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useUsersStore } from "@/stores/usersStore";
import { useAdoptionStore } from "@/stores/adoptionStore";
import { useMunicipalityStore } from "@/stores/municipalityStore";
import { useFeedbackStore } from "@/stores/feedbackStore";
import { useShelterCatStore } from "@/stores/shelterCatStore";
import { useHealthRecordStore, getUpcomingReminders } from "@/stores/healthRecordStore";
import { useMatchingProfileStore } from "@/stores/matchingProfileStore";
import { mockCats } from "@/api/mockData";
import { isHeartAdoption } from "@/lib/heartAdoption";
import { getCatPhoto } from "@/lib/catPhotos";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect } from "react";
import { ROLE_META } from "@/lib/roles";
import { motion } from "framer-motion";
import {
  Users, Cat, Heart, AlertTriangle, TrendingUp, MessageSquarePlus,
  Sparkles, Bell, Syringe, CalendarDays, ChevronRight,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const users = useUsersStore((s) => s.users);
  const applications = useAdoptionStore((s) => s.applications);
  const { colonies, reports } = useMunicipalityStore();
  const feedbackEntries = useFeedbackStore((s) => s.entries);

  const totalUsers = users.length;
  const totalCats = mockCats.length + colonies.reduce((sum, c) => sum + c.catCount, 0);
  const activeAdoptions = applications.filter((a) => ["submitted", "reviewing"].includes(a.status)).length;
  const openReports = reports.filter((r) => ["open", "inProgress"].includes(r.status)).length;
  const totalFeedback = feedbackEntries.length;

  const kpis = [
    { icon: Users, label: t("adminDashboard.registeredUsers"), value: totalUsers, color: "220 70% 55%", trend: "+3" },
    { icon: Cat, label: t("adminDashboard.activeCats"), value: totalCats, color: "25 85% 55%", trend: "+12" },
    { icon: Heart, label: t("adminDashboard.activeAdoptions"), value: activeAdoptions, color: "340 60% 50%", trend: null },
    { icon: AlertTriangle, label: t("adminDashboard.openReports"), value: openReports, color: "45 90% 50%", trend: null },
    { icon: MessageSquarePlus, label: t("adminDashboard.betaFeedback"), value: totalFeedback, color: "270 55% 55%", trend: null, path: "/feedback" },
  ];

  const adoptionsByStatus = {
    submitted: applications.filter((a) => a.status === "submitted").length,
    reviewing: applications.filter((a) => a.status === "reviewing").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    completed: applications.filter((a) => a.status === "completed").length,
  };

  const colonyStats = {
    active: colonies.filter((c) => c.status === "active").length,
    monitored: colonies.filter((c) => c.status === "monitored").length,
    critical: colonies.filter((c) => c.status === "critical").length,
  };

  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {kpis.map((kpi) => {
          const Wrapper = kpi.path ? Link : "div";
          const wrapperProps = kpi.path ? { to: kpi.path } : {};
          return (
            <Wrapper
              key={kpi.label}
              {...(wrapperProps as any)}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm block"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `hsl(${kpi.color} / 0.12)` }}
                >
                  <kpi.icon className="h-4.5 w-4.5" style={{ color: `hsl(${kpi.color})` }} />
                </div>
                {kpi.trend && (
                  <span className="flex items-center gap-0.5 text-[10px] font-bold" style={{ color: "hsl(142 60% 45%)" }}>
                    <TrendingUp className="h-3 w-3" /> {kpi.trend}
                  </span>
                )}
              </div>
              <p className="text-2xl font-extrabold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{kpi.label}</p>
            </Wrapper>
          );
        })}
      </div>

      {/* Adoption pipeline */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-3">{t("adminDashboard.adoptionPipeline")}</h3>
        <div className="space-y-2">
          {Object.entries(adoptionsByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t(`adoption.status_${status}`)}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${applications.length ? (count / applications.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-foreground w-5 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colony status */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="text-sm font-bold text-foreground mb-3">{t("adminDashboard.colonyStatus")}</h3>
        <div className="flex gap-2">
          {[
            { key: "active", count: colonyStats.active, color: "142 60% 45%" },
            { key: "monitored", count: colonyStats.monitored, color: "45 90% 50%" },
            { key: "critical", count: colonyStats.critical, color: "0 60% 50%" },
          ].map((s) => (
            <div
              key={s.key}
              className="flex-1 rounded-xl p-3 text-center"
              style={{ backgroundColor: `hsl(${s.color} / 0.1)` }}
            >
              <p className="text-lg font-extrabold" style={{ color: `hsl(${s.color})` }}>{s.count}</p>
              <p className="text-[10px] font-medium text-muted-foreground">{t(`municipality.status${s.key.charAt(0).toUpperCase() + s.key.slice(1)}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdopterDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cats: shelterCats } = useShelterCatStore();
  const { events } = useHealthRecordStore();
  const { alerts } = useMatchingProfileStore();

  const allCats = [...shelterCats, ...mockCats];
  const heartCats = allCats.filter(isHeartAdoption);
  const myCatIds = mockCats.filter((c) => c.ownerId === "u1").map((c) => c.id);
  const reminders = getUpcomingReminders(events, myCatIds, 30);
  const unreadAlerts = alerts.filter((a) => !a.read);

  return (
    <div className="space-y-4">
      {/* Matching CTA */}
      <motion.button
        onClick={() => navigate("/matching")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-primary/15 to-accent/10 border border-primary/20 p-4 text-left"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">{t("dashboard.matchingCta")}</p>
          <p className="text-[10px] text-muted-foreground">{t("dashboard.matchingCtaDesc")}</p>
        </div>
        <ChevronRight className="h-5 w-5 text-primary" />
      </motion.button>

      {/* Match alerts */}
      {unreadAlerts.length > 0 && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <p className="text-xs font-bold text-foreground">{t("dashboard.newMatches", { count: unreadAlerts.length })}</p>
          </div>
          {unreadAlerts.slice(0, 2).map((a) => (
            <button key={a.id} onClick={() => navigate(`/cats/${a.catId}`)} className="flex w-full items-center gap-2 rounded-xl bg-card border border-border p-2 text-left hover:bg-secondary/50 transition-colors">
              <span className="text-sm">🐱</span>
              <div className="flex-1">
                <p className="text-xs font-bold text-foreground">{a.catName}</p>
                <p className="text-[10px] text-primary">{t("matching.alertScore", { score: a.score })}</p>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {/* Health reminders */}
      {reminders.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Syringe className="h-4 w-4 text-primary" /> {t("dashboard.healthReminders")}
          </h3>
          {reminders.slice(0, 3).map((r) => {
            const daysLeft = differenceInDays(new Date(r.nextDueDate!), new Date());
            const cat = allCats.find((c) => c.id === r.catId);
            return (
              <button key={r.id} onClick={() => navigate(`/cats/${r.catId}/health`)} className="flex w-full items-center gap-2 rounded-xl bg-secondary/50 p-2.5 text-left hover:bg-secondary transition-colors">
                <Syringe className="h-3.5 w-3.5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">{r.title}</p>
                  <p className="text-[10px] text-muted-foreground">{cat?.name} · {t("health.dueIn", { days: daysLeft })}</p>
                </div>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      )}

      {/* Heart Adoptions priority */}
      {heartCats.length > 0 && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
            <Heart className="h-4 w-4 text-destructive" /> {t("dashboard.heartAdoptions")}
          </h3>
          <p className="text-[10px] text-muted-foreground">{t("dashboard.heartAdoptionsDesc")}</p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {heartCats.slice(0, 4).map((cat) => {
              const photo = getCatPhoto(cat.id);
              return (
                <button key={cat.id} onClick={() => navigate(`/cats/${cat.id}`)} className="shrink-0 w-28 rounded-xl border border-border bg-card overflow-hidden text-center hover:shadow-md transition-shadow">
                  {photo ? (
                    <img src={photo} alt={cat.name} className="h-20 w-full object-cover" />
                  ) : (
                    <div className="flex h-20 items-center justify-center bg-destructive/10 text-2xl font-extrabold text-destructive/30">
                      {cat.name.slice(0, 2)}
                    </div>
                  )}
                  <div className="p-2">
                    <p className="text-xs font-bold text-foreground">{cat.name}</p>
                    <p className="text-[10px] text-muted-foreground">{cat.breed}</p>
                    <span className="mt-1 inline-block rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">❤️</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const DefaultDashboard = ({ roleMeta }: { roleMeta: { emoji: string; color: string; labelKey: string } }) => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
        style={{ backgroundColor: `hsl(${roleMeta.color} / 0.12)` }}
      >
        {roleMeta.emoji}
      </div>
      <p className="mb-1 text-sm text-muted-foreground">
        {t("comingSoon.welcome", { name: user?.name })}
      </p>
      <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
        {t("comingSoon.dashboardTitle")}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {t("comingSoon.dashboardDesc")}
      </p>
      <span
        className="mt-5 inline-block rounded-full px-5 py-2 text-sm font-bold"
        style={{
          backgroundColor: `hsl(${roleMeta.color} / 0.12)`,
          color: `hsl(${roleMeta.color})`,
        }}
      >
        {t(roleMeta.labelKey)} — Coming Soon 🚀
      </span>
    </main>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  const roleMeta = ROLE_META[user.activeRole];
  const isAdmin = user.activeRole === "admin";
  const isAdopter = user.activeRole === "adopter";

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader />
        {isAdmin ? (
          <main className="flex-1 p-4 pt-20">
            <p className="mb-1 text-sm text-muted-foreground">
              {t("comingSoon.welcome", { name: user.name })}
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground mb-4">
              {t("adminDashboard.title")}
            </h1>
            <AdminDashboard />
          </main>
        ) : isAdopter ? (
          <main className="flex-1 p-4 pt-20 max-w-lg mx-auto">
            <p className="mb-1 text-sm text-muted-foreground">
              {t("comingSoon.welcome", { name: user.name })}
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground mb-4">
              {t("dashboard.adopterTitle")}
            </h1>
            <AdopterDashboard />
          </main>
        ) : (
          <DefaultDashboard roleMeta={roleMeta} />
        )}
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default Dashboard;
