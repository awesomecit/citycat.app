import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROLE_META } from "@/lib/roles";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";
import { User, MapPin, Pencil, Check, X, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdopterProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUser } = useAuthStore();
  const { toast } = useToast();

  const [editingBio, setEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState("");
  const [editingZone, setEditingZone] = useState(false);
  const [zoneValue, setZoneValue] = useState("");

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  const roleMeta = ROLE_META[user.activeRole];

  const saveBio = () => {
    updateUser({ bio: bioValue.trim() } as any);
    setEditingBio(false);
    toast({ title: t("settings.savedTitle"), description: t("adopterProfile.bioSaved") });
  };

  const saveZone = () => {
    updateUser({ zone: zoneValue.trim() } as any);
    setEditingZone(false);
    toast({ title: t("settings.savedTitle"), description: t("adopterProfile.zoneSaved") });
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader />
        <main className="flex-1 p-4 pt-20 max-w-lg mx-auto space-y-4">
          {/* Avatar + Name card */}
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
            <div className="mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold"
              style={{ backgroundColor: `hsl(${roleMeta.color} / 0.12)`, color: `hsl(${roleMeta.color})` }}
            >
              {roleMeta.emoji} {t(roleMeta.labelKey)}
            </div>
          </div>

          {/* Zone */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              {t("adopterProfile.zone")}
            </h3>
            {editingZone ? (
              <div className="flex items-center gap-2">
                <input
                  value={zoneValue}
                  onChange={(e) => setZoneValue(e.target.value)}
                  maxLength={100}
                  placeholder={t("adopterProfile.zonePlaceholder")}
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <button onClick={saveZone} className="text-primary"><Check className="h-4 w-4" /></button>
                <button onClick={() => setEditingZone(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {(user as any).zone || <span className="text-muted-foreground italic">{t("adopterProfile.noZone")}</span>}
                </span>
                <button onClick={() => { setZoneValue((user as any).zone || ""); setEditingZone(true); }} className="text-muted-foreground hover:text-primary">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="mt-2 text-[11px] text-muted-foreground">{t("adopterProfile.zoneHint")}</p>
          </section>

          {/* Bio */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <User className="h-4 w-4 text-primary" />
              {t("adopterProfile.bio")}
            </h3>
            {editingBio ? (
              <div className="space-y-2">
                <textarea
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value.slice(0, 300))}
                  rows={3}
                  placeholder={t("adopterProfile.bioPlaceholder")}
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
                  {(user as any).bio || <span className="text-muted-foreground italic">{t("adopterProfile.noBio")}</span>}
                </p>
                <button onClick={() => { setBioValue((user as any).bio || ""); setEditingBio(true); }} className="text-muted-foreground hover:text-primary shrink-0">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>

          {/* Stats placeholder */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">{t("adopterProfile.reputation")}</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xl font-extrabold text-foreground">0</p>
                <p className="text-[10px] text-muted-foreground">{t("adopterProfile.adoptions")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xl font-extrabold text-foreground">—</p>
                <p className="text-[10px] text-muted-foreground">{t("adopterProfile.verified")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xl font-extrabold text-primary">⭐</p>
                <p className="text-[10px] text-muted-foreground">{t("adopterProfile.reviews")}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default AdopterProfile;
