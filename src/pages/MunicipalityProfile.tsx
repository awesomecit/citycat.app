import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useMunicipalityStore } from "@/stores/municipalityStore";
import { ROLE_META } from "@/lib/roles";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";
import {
  MapPin, Pencil, Check, X, Building2, ShieldCheck, Clock,
  ShieldAlert, Hash, Map, FileText, AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

type InstitutionalTier = "none" | "pending" | "active";

const MunicipalityProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUser } = useAuthStore();
  const { colonies, reports } = useMunicipalityStore();
  const { toast } = useToast();

  const [editingZone, setEditingZone] = useState(false);
  const [zoneValue, setZoneValue] = useState("");
  const [editingCode, setEditingCode] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [entityCode, setEntityCode] = useState("ISTAT-058091");
  const [tier, setTier] = useState<InstitutionalTier>("active");

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  const roleMeta = ROLE_META[user.activeRole];

  const saveZone = () => {
    updateUser({ zone: zoneValue.trim() });
    setEditingZone(false);
    toast({ title: t("settings.savedTitle"), description: t("municipalityProfile.zoneSaved") });
  };

  const saveCode = () => {
    if (!codeValue.trim()) return;
    setEntityCode(codeValue.trim());
    setEditingCode(false);
    if (tier === "none") setTier("pending");
    toast({
      title: t("municipalityProfile.codeSavedTitle"),
      description: t("municipalityProfile.codeSavedDesc"),
    });
  };

  const requestTier = () => {
    setTier("pending");
    toast({
      title: t("municipalityProfile.tierRequestedTitle"),
      description: t("municipalityProfile.tierRequestedDesc"),
    });
  };

  // Stats from store
  const totalColonies = colonies.length;
  const totalCats = colonies.reduce((s, c) => s + c.catCount, 0);
  const openReports = reports.filter((r) => ["open", "inProgress"].includes(r.status)).length;

  const tierBadge = () => {
    switch (tier) {
      case "active":
        return (
          <Badge className="bg-primary/10 text-primary gap-1">
            <ShieldCheck className="h-3 w-3" /> {t("municipalityProfile.tierActive")}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" /> {t("municipalityProfile.tierPending")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <ShieldAlert className="h-3 w-3" /> {t("municipalityProfile.tierNone")}
          </Badge>
        );
    }
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader />
        <main className="flex-1 p-4 pt-20 max-w-lg mx-auto space-y-4">
          {/* Header */}
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <div
              className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full text-3xl"
              style={{ backgroundColor: `hsl(${roleMeta.color} / 0.12)` }}
            >
              {roleMeta.emoji}
            </div>
            <h2 className="text-lg font-extrabold text-foreground">{user.name}</h2>
            <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
            {tierBadge()}
          </div>

          {/* Entity Code */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <Hash className="h-4 w-4 text-primary" />
              {t("municipalityProfile.entityCode")}
            </h3>
            {editingCode ? (
              <div className="flex items-center gap-2">
                <input
                  value={codeValue} onChange={(e) => setCodeValue(e.target.value)}
                  maxLength={30} placeholder={t("municipalityProfile.codePlaceholder")} autoFocus
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                />
                <button onClick={saveCode} className="text-primary"><Check className="h-4 w-4" /></button>
                <button onClick={() => setEditingCode(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono text-foreground">
                  {entityCode || <span className="text-muted-foreground italic">{t("municipalityProfile.noCode")}</span>}
                </span>
                <button onClick={() => { setCodeValue(entityCode); setEditingCode(true); }} className="text-muted-foreground hover:text-primary">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <p className="mt-2 text-[11px] text-muted-foreground">{t("municipalityProfile.codeHint")}</p>
          </section>

          {/* Zone */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <MapPin className="h-4 w-4 text-primary" />
              {t("municipalityProfile.zone")}
            </h3>
            {editingZone ? (
              <div className="flex items-center gap-2">
                <input
                  value={zoneValue} onChange={(e) => setZoneValue(e.target.value)}
                  maxLength={100} placeholder={t("municipalityProfile.zonePlaceholder")} autoFocus
                  className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button onClick={saveZone} className="text-primary"><Check className="h-4 w-4" /></button>
                <button onClick={() => setEditingZone(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">
                  {user.zone || <span className="text-muted-foreground italic">{t("municipalityProfile.noZone")}</span>}
                </span>
                <button onClick={() => { setZoneValue(user.zone || ""); setEditingZone(true); }} className="text-muted-foreground hover:text-primary">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>

          {/* Institutional Tier */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <Building2 className="h-4 w-4 text-primary" />
              {t("municipalityProfile.institutionalTier")}
            </h3>
            {tier === "active" ? (
              <div className="rounded-xl bg-primary/10 p-3 text-center">
                <ShieldCheck className="mx-auto h-6 w-6 text-primary mb-1" />
                <p className="text-sm font-semibold text-primary">{t("municipalityProfile.tierActive")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("municipalityProfile.tierActiveDesc")}</p>
              </div>
            ) : tier === "pending" ? (
              <div className="rounded-xl bg-accent/50 p-3 text-center">
                <Clock className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                <p className="text-sm font-semibold text-foreground">{t("municipalityProfile.tierPending")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("municipalityProfile.tierPendingDesc")}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-3">{t("municipalityProfile.tierNoneDesc")}</p>
                <button
                  onClick={requestTier}
                  disabled={!entityCode}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  <Building2 className="h-4 w-4" />
                  {t("municipalityProfile.requestTier")}
                </button>
              </div>
            )}
          </section>

          {/* Territory overview stats */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">{t("municipalityProfile.territoryOverview")}</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted/50 p-3">
                <Map className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">{totalColonies}</p>
                <p className="text-[10px] text-muted-foreground">{t("municipalityProfile.colonies")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <FileText className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">{totalCats}</p>
                <p className="text-[10px] text-muted-foreground">{t("municipalityProfile.catsMonitored")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <AlertTriangle className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">{openReports}</p>
                <p className="text-[10px] text-muted-foreground">{t("municipalityProfile.openReports")}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default MunicipalityProfile;
