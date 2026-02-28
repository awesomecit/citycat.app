import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useShelterStore } from "@/stores/shelterStore";
import { ROLE_META } from "@/lib/roles";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState } from "react";
import {
  MapPin, Pencil, Check, X, Camera, Phone, Globe, ShieldCheck,
  ShieldAlert, Clock, FileText, Upload, Cat, Heart, Megaphone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const ShelterProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUser } = useAuthStore();
  const { profileData, verificationStatus, updateProfileData, requestVerification } = useShelterStore();
  const { toast } = useToast();

  const [editingDesc, setEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState("");
  const [editingZone, setEditingZone] = useState(false);
  const [zoneValue, setZoneValue] = useState("");
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [editingWebsite, setEditingWebsite] = useState(false);
  const [websiteValue, setWebsiteValue] = useState("");
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [docName, setDocName] = useState("");

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn || !user) return null;

  const roleMeta = ROLE_META[user.activeRole];

  const saveField = (field: string, value: string, setter: (v: boolean) => void) => {
    updateProfileData({ [field]: value.trim() });
    setter(false);
    toast({ title: t("settings.savedTitle"), description: t("shelterProfile.fieldSaved") });
  };

  const handleVerify = () => {
    if (!docName.trim()) return;
    requestVerification(docName.trim(), user.email, user.name);
    setShowVerifyForm(false);
    setDocName("");
    toast({
      title: t("shelterProfile.verificationSentTitle"),
      description: t("shelterProfile.verificationSentDesc"),
    });
  };

  const verificationBadge = () => {
    switch (verificationStatus) {
      case "verified":
        return (
          <Badge className="bg-primary/10 text-primary gap-1">
            <ShieldCheck className="h-3 w-3" /> {t("shelterProfile.verified")}
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" /> {t("shelterProfile.verificationPending")}
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <ShieldAlert className="h-3 w-3" /> {t("shelterProfile.verificationRejected")}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <ShieldAlert className="h-3 w-3" /> {t("shelterProfile.unverified")}
          </Badge>
        );
    }
  };

  const InlineEdit = ({
    editing, value, onChange, onSave, onCancel, placeholder, multiline = false,
  }: {
    editing: boolean; value: string; onChange: (v: string) => void;
    onSave: () => void; onCancel: () => void; placeholder: string; multiline?: boolean;
  }) =>
    editing ? (
      <div className={multiline ? "space-y-2" : "flex items-center gap-2"}>
        {multiline ? (
          <textarea
            value={value} onChange={(e) => onChange(e.target.value.slice(0, 500))}
            rows={3} placeholder={placeholder} autoFocus
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        ) : (
          <input
            value={value} onChange={(e) => onChange(e.target.value)} maxLength={200}
            placeholder={placeholder} autoFocus
            className="flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        )}
        <div className={multiline ? "flex justify-end gap-1.5" : "flex gap-1"}>
          <button onClick={onCancel} className="text-muted-foreground"><X className="h-4 w-4" /></button>
          <button onClick={onSave} className="text-primary"><Check className="h-4 w-4" /></button>
        </div>
      </div>
    ) : null;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader />
        <main className="flex-1 p-4 pt-20 max-w-lg mx-auto space-y-4">
          {/* Header card */}
          <div className="rounded-2xl border border-border bg-card p-5 text-center">
            <div className="relative mx-auto mb-3">
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl"
                style={{ backgroundColor: `hsl(${roleMeta.color} / 0.12)` }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <span>{roleMeta.emoji}</span>
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
            <p className="text-xs text-muted-foreground mb-2">{user.email}</p>
            {verificationBadge()}
          </div>

          {/* Description */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <FileText className="h-4 w-4 text-primary" />
              {t("shelterProfile.description")}
            </h3>
            <InlineEdit
              editing={editingDesc} value={descValue}
              onChange={setDescValue} multiline
              onSave={() => saveField("description", descValue, setEditingDesc)}
              onCancel={() => setEditingDesc(false)}
              placeholder={t("shelterProfile.descPlaceholder")}
            />
            {!editingDesc && (
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-foreground">{profileData.description}</p>
                <button onClick={() => { setDescValue(profileData.description); setEditingDesc(true); }} className="text-muted-foreground hover:text-primary shrink-0">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </section>

          {/* Zone + Contact */}
          <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
            {/* Zone */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                <MapPin className="h-4 w-4 text-primary" />
                {t("shelterProfile.zone")}
              </h3>
              <InlineEdit
                editing={editingZone} value={zoneValue}
                onChange={setZoneValue}
                onSave={() => saveField("zone", zoneValue, setEditingZone)}
                onCancel={() => setEditingZone(false)}
                placeholder={t("shelterProfile.zonePlaceholder")}
              />
              {!editingZone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{profileData.zone || <span className="text-muted-foreground italic">{t("shelterProfile.noZone")}</span>}</span>
                  <button onClick={() => { setZoneValue(profileData.zone); setEditingZone(true); }} className="text-muted-foreground hover:text-primary">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Phone */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                <Phone className="h-4 w-4 text-primary" />
                {t("shelterProfile.phone")}
              </h3>
              <InlineEdit
                editing={editingPhone} value={phoneValue}
                onChange={setPhoneValue}
                onSave={() => saveField("phone", phoneValue, setEditingPhone)}
                onCancel={() => setEditingPhone(false)}
                placeholder={t("shelterProfile.phonePlaceholder")}
              />
              {!editingPhone && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{profileData.phone || "—"}</span>
                  <button onClick={() => { setPhoneValue(profileData.phone); setEditingPhone(true); }} className="text-muted-foreground hover:text-primary">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Website */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                <Globe className="h-4 w-4 text-primary" />
                {t("shelterProfile.website")}
              </h3>
              <InlineEdit
                editing={editingWebsite} value={websiteValue}
                onChange={setWebsiteValue}
                onSave={() => saveField("website", websiteValue, setEditingWebsite)}
                onCancel={() => setEditingWebsite(false)}
                placeholder={t("shelterProfile.websitePlaceholder")}
              />
              {!editingWebsite && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground truncate">{profileData.website || "—"}</span>
                  <button onClick={() => { setWebsiteValue(profileData.website); setEditingWebsite(true); }} className="text-muted-foreground hover:text-primary">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Verification */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t("shelterProfile.verification")}
            </h3>

            {verificationStatus === "unverified" || verificationStatus === "rejected" ? (
              showVerifyForm ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">{t("shelterProfile.verifyHint")}</p>
                  <input
                    value={docName} onChange={(e) => setDocName(e.target.value)} maxLength={100}
                    placeholder={t("shelterProfile.docNamePlaceholder")}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    onClick={() => toast({ title: t("adopterProfile.photoComingSoon") })}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-input py-3 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {t("shelterProfile.uploadDoc")}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setShowVerifyForm(false)} className="flex-1 rounded-xl border border-input bg-card py-2.5 text-sm font-bold text-foreground hover:bg-secondary">
                      {t("settings.cancel")}
                    </button>
                    <button onClick={handleVerify} disabled={!docName.trim()} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-sm disabled:opacity-50">
                      {t("shelterProfile.sendVerification")}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">{t("shelterProfile.verifyDesc")}</p>
                  <button
                    onClick={() => setShowVerifyForm(true)}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    {t("shelterProfile.requestVerification")}
                  </button>
                </div>
              )
            ) : verificationStatus === "pending" ? (
              <div className="rounded-xl bg-accent/50 p-3 text-center">
                <Clock className="mx-auto h-6 w-6 text-muted-foreground mb-1" />
                <p className="text-sm font-semibold text-foreground">{t("shelterProfile.verificationPending")}</p>
                <p className="text-xs text-muted-foreground mt-1">{t("shelterProfile.pendingHint")}</p>
              </div>
            ) : (
              <div className="rounded-xl bg-primary/10 p-3 text-center">
                <ShieldCheck className="mx-auto h-6 w-6 text-primary mb-1" />
                <p className="text-sm font-semibold text-primary">{t("shelterProfile.verified")}</p>
              </div>
            )}
          </section>

          {/* Stats */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">{t("shelterProfile.stats")}</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-muted/50 p-3">
                <Cat className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">{profileData.totalCats}</p>
                <p className="text-[10px] text-muted-foreground">{t("shelterProfile.totalCats")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <Heart className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">{profileData.totalAdoptions}</p>
                <p className="text-[10px] text-muted-foreground">{t("shelterProfile.totalAdoptions")}</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-3">
                <Megaphone className="mx-auto mb-1 h-5 w-5 text-primary" />
                <p className="text-xl font-extrabold text-foreground">{profileData.activeCampaigns}</p>
                <p className="text-[10px] text-muted-foreground">{t("shelterProfile.activeCampaigns")}</p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default ShelterProfile;
