import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useVolunteerStore } from "@/stores/volunteerStore";
import { ROLE_META } from "@/lib/roles";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";
import {
  User, MapPin, Pencil, Check, X, Camera, Building2, CalendarDays,
  ClipboardList, Clock, Send, CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const DEMO_SHELTERS = [
  { id: "s1", name: "Rifugio Micilandia", zone: "Roma Sud" },
  { id: "s2", name: "Oasi Felina Roma", zone: "Roma Est" },
  { id: "s3", name: "Gattile Comunale", zone: "Roma Centro" },
];

const VolunteerProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUser } = useAuthStore();
  const { tasks, availability, affiliations, requestAffiliation } = useVolunteerStore();
  const { toast } = useToast();

  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [editingZone, setEditingZone] = useState(false);
  const [zoneValue, setZoneValue] = useState("");
  const [showShelterPicker, setShowShelterPicker] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  const roleMeta = ROLE_META[user.activeRole];

  const saveBio = () => {
    updateUser({ bio: bioValue.trim() });
    setEditingBio(false);
    toast({ title: t("settings.savedTitle"), description: t("volunteerProfile.bioSaved") });
  };

  const saveZone = () => {
    updateUser({ zone: zoneValue.trim() });
    setEditingZone(false);
    toast({ title: t("settings.savedTitle"), description: t("volunteerProfile.zoneSaved") });
  };

  const handleAffiliate = (shelterId: string, shelterName: string) => {
    requestAffiliation(shelterId, shelterName);
    setShowShelterPicker(false);
    toast({
      title: t("volunteerProfile.affiliationSentTitle"),
      description: t("volunteerProfile.affiliationSentDesc", { shelter: shelterName }),
    });
  };

  // Stats
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const availableDays = availability.filter((a) => a.available).length;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader />
        <main className="flex-1 p-4 pt-20 max-w-lg mx-auto space-y-4">
          {/* Avatar + Name */}
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="relative mx-auto mb-3">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl"
                style={{ backgroundColor: `hsl(${roleMeta.color} / 0.12)` }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button
                className="absolute bottom-0 right-1/2 translate-x-8 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md"
                onClick={() => toast({ title: t("adopterProfile.photoComingSoon") })}
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <h2 className="text-lg font-extrabold text-foreground">{user.name}</h2>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <div
              className="mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: `hsl(${roleMeta.color} / 0.12)`, color: `hsl(${roleMeta.color})` }}
            >
              {roleMeta.emoji} {t(roleMeta.labelKey)}
            </div>
          </div>

          {/* Zone */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              {t("volunteerProfile.zone")}
            </h3>
            {editingZone ? (
              <div className="flex items-center gap-2">
                <input
                  value={zoneValue}
                  onChange={(e) => setZoneValue(e.target.value)}
                  maxLength={100}
                  placeholder={t("volunteerProfile.zonePlaceholder")}
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <button onClick={saveZone} className="text-primary"><Check className="h-4 w-4" /></button>
                <button onClick={() => setEditingZone(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {user.zone || <span className="text-muted-foreground italic">{t("volunteerProfile.noZone")}</span>}
                </span>
                <button onClick={() => { setZoneValue(user.zone || ""); setEditingZone(true); }} className="text-muted-foreground hover:text-primary">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="mt-2 text-[11px] text-muted-foreground">{t("volunteerProfile.zoneHint")}</p>
          </section>

          {/* Bio */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <User className="h-4 w-4 text-primary" />
              {t("volunteerProfile.bio")}
            </h3>
            {editingBio ? (
              <div className="space-y-2">
                <textarea
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value.slice(0, 300))}
                  rows={3}
                  placeholder={t("volunteerProfile.bioPlaceholder")}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">{bioValue.length}/300</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => setEditingBio(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                    <button onClick={saveBio} className="text-primary"><Check className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground">
                  {user.bio || <span className="text-muted-foreground italic">{t("volunteerProfile.noBio")}</span>}
                </p>
                <button onClick={() => { setBioValue(user.bio || ""); setEditingBio(true); }} className="text-muted-foreground hover:text-primary shrink-0">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>

          {/* Shelter Affiliation */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <Building2 className="h-4 w-4 text-primary" />
              {t("volunteerProfile.affiliation")}
            </h3>

            {affiliations.length > 0 ? (
              <div className="space-y-2 mb-3">
                {affiliations.map((a) => (
                  <div key={a.shelterId} className="flex items-center justify-between rounded-xl bg-muted/50 px-3 py-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{a.shelterName}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {t(`volunteerProfile.status_${a.status}`)}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        a.status === "approved"
                          ? "bg-primary/10 text-primary"
                          : a.status === "pending"
                          ? "bg-accent text-accent-foreground"
                          : "bg-destructive/10 text-destructive"
                      }
                    >
                      {a.status === "approved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                      {a.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                      {t(`volunteerProfile.status_${a.status}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-3">{t("volunteerProfile.noAffiliation")}</p>
            )}

            {showShelterPicker ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">{t("volunteerProfile.pickShelter")}</p>
                {DEMO_SHELTERS.filter(
                  (s) => !affiliations.some((a) => a.shelterId === s.id)
                ).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleAffiliate(s.id, s.name)}
                    className="flex w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-secondary"
                  >
                    <div className="text-left">
                      <p className="font-semibold">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground">{s.zone}</p>
                    </div>
                    <Send className="h-3.5 w-3.5 text-primary" />
                  </button>
                ))}
                <button
                  onClick={() => setShowShelterPicker(false)}
                  className="w-full text-xs text-muted-foreground underline"
                >
                  {t("settings.cancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowShelterPicker(true)}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
              >
                <Building2 className="h-4 w-4" />
                {t("volunteerProfile.requestAffiliation")}
              </button>
            )}
          </section>

          {/* Stats */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">{t("volunteerProfile.stats")}</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted/50 p-3">
                <ClipboardList className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">{doneTasks}</p>
                <p className="text-[10px] text-muted-foreground">{t("volunteerProfile.tasksDone")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <CalendarDays className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">{availableDays}</p>
                <p className="text-[10px] text-muted-foreground">{t("volunteerProfile.daysAvailable")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <Building2 className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">
                  {affiliations.filter((a) => a.status === "approved").length}
                </p>
                <p className="text-[10px] text-muted-foreground">{t("volunteerProfile.shelters")}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default VolunteerProfile;
