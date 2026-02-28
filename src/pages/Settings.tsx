import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Bell, Shield, Globe, Pencil, Check, X, Eye, EyeOff, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { useDelegationStore } from "@/stores/delegationStore";
import { PERMISSION_META } from "@/lib/permissions";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, updateUser, updatePassword } = useAuthStore();
  const { affiliations, respondInvite } = useDelegationStore();
  const [notifications, setNotifications] = useState(false);
  const { toast } = useToast();

  const pendingInvites = useMemo(
    () => user ? affiliations.filter((a) => a.userEmail === user.email && a.status === "pending") : [],
    [affiliations, user]
  );

  // Edit profile state
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  // Change password state
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  const currentLang = i18n.language?.startsWith("it") ? "it" : "en";

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const startEditName = () => {
    setNameValue(user?.name || "");
    setEditingName(true);
  };

  const saveName = () => {
    const trimmed = nameValue.trim();
    if (!trimmed || trimmed.length > 100) {
      return toast({ variant: "destructive", title: t("settings.errorNameInvalid") });
    }
    updateUser({ name: trimmed });
    setEditingName(false);
    toast({ title: t("settings.savedTitle"), description: t("settings.savedName") });
  };

  const startEditEmail = () => {
    setEmailValue(user?.email || "");
    setEditingEmail(true);
  };

  const saveEmail = () => {
    const trimmed = emailValue.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmed || !emailRegex.test(trimmed) || trimmed.length > 255) {
      return toast({ variant: "destructive", title: t("settings.errorEmailInvalid") });
    }
    updateUser({ email: trimmed });
    setEditingEmail(false);
    toast({ title: t("settings.savedTitle"), description: t("settings.savedEmail") });
  };

  const handleChangePassword = () => {
    if (currentPw !== user?.password) {
      return toast({ variant: "destructive", title: t("settings.errorCurrentPw") });
    }
    if (newPw.length < 6) {
      return toast({ variant: "destructive", title: t("settings.errorNewPwShort") });
    }
    if (newPw !== confirmPw) {
      return toast({ variant: "destructive", title: t("settings.errorPwMismatch") });
    }
    updatePassword(newPw);
    setShowPwForm(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    toast({ title: t("settings.savedTitle"), description: t("settings.savedPassword") });
  };

  if (!isLoggedIn) return null;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("settings.title")} />

        <div className="mx-auto w-full max-w-lg space-y-6 p-4">
          {/* Profile */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <User className="h-4 w-4 text-primary" />
              {t("settings.profile")}
            </h2>
            <div className="space-y-3">
              {/* Name */}
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">{t("settings.name")}</span>
                {editingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      value={nameValue}
                      onChange={(e) => setNameValue(e.target.value)}
                      maxLength={100}
                      className="w-36 rounded-lg border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      autoFocus
                    />
                    <button onClick={saveName} className="text-primary"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingName(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{user?.name}</span>
                    <button onClick={startEditName} className="text-muted-foreground hover:text-primary"><Pencil className="h-3.5 w-3.5" /></button>
                  </div>
                )}
              </div>
              <div className="h-px bg-border" />
              {/* Email */}
              <div className="flex items-center justify-between gap-2">
                <span className="shrink-0 text-sm text-muted-foreground">{t("settings.email")}</span>
                {editingEmail ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="email"
                      value={emailValue}
                      onChange={(e) => setEmailValue(e.target.value)}
                      maxLength={255}
                      className="w-44 rounded-lg border border-input bg-background px-2 py-1 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      autoFocus
                    />
                    <button onClick={saveEmail} className="text-primary"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingEmail(false)} className="text-muted-foreground"><X className="h-4 w-4" /></button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-foreground">{user?.email}</span>
                    <button onClick={startEditEmail} className="text-muted-foreground hover:text-primary"><Pencil className="h-3.5 w-3.5" /></button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Pending Invites */}
          {pendingInvites.length > 0 && (
            <section className="rounded-2xl border border-primary/30 bg-primary/5 p-4">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                <UserPlus className="h-4 w-4 text-primary" />
                {t("delegation.pendingInvites")} ({pendingInvites.length})
              </h2>
              <div className="space-y-2">
                {pendingInvites.map((inv) => (
                  <div key={inv.id} className="rounded-xl border border-border bg-card p-3 space-y-2">
                    <p className="text-sm font-bold text-foreground">
                      {t("delegation.inviteFrom", { name: inv.entityName })}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {inv.permissions.map((p) => (
                        <span key={p} className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground">
                          {PERMISSION_META[p].emoji} {t(PERMISSION_META[p].labelKey)}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { respondInvite(inv.id, true); toast({ title: t("delegation.accepted") }); }}
                        className="flex-1 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground"
                      >
                        {t("delegation.accept")}
                      </button>
                      <button
                        onClick={() => { respondInvite(inv.id, false); toast({ title: t("delegation.rejected") }); }}
                        className="flex-1 rounded-xl border border-input py-2 text-xs font-bold text-foreground hover:bg-secondary"
                      >
                        {t("delegation.reject")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Preferences */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              {t("settings.preferences")}
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("settings.language")}</span>
              <button
                onClick={() => i18n.changeLanguage(currentLang === "it" ? "en" : "it")}
                className="rounded-lg bg-secondary px-3 py-1 text-xs font-bold text-foreground"
              >
                {currentLang === "it" ? "🇮🇹 Italiano" : "🇬🇧 English"}
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <Bell className="h-4 w-4 text-primary" />
              {t("settings.notifications")}
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t("settings.pushNotifications")}</span>
              <button
                onClick={() => {
                  const next = !notifications;
                  setNotifications(next);
                  if (next) {
                    toast({ title: t("settings.pushComingSoonTitle"), description: t("settings.pushComingSoonDesc") });
                  }
                }}
                className={`relative h-6 w-11 rounded-full transition-colors ${notifications ? "bg-primary" : "bg-muted"}`}
              >
                <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </section>

          {/* Security */}
          <section className="rounded-2xl border border-border bg-card p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
              <Shield className="h-4 w-4 text-primary" />
              {t("settings.security")}
            </h2>
            {showPwForm ? (
              <div className="space-y-3">
                {/* Current password */}
                <div className="relative">
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    placeholder={t("settings.currentPassword")}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background py-2.5 pl-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* New password */}
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    placeholder={t("settings.newPassword")}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background py-2.5 pl-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Confirm */}
                <input
                  type="password"
                  placeholder={t("settings.confirmPassword")}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background py-2.5 pl-3 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowPwForm(false); setCurrentPw(""); setNewPw(""); setConfirmPw(""); }}
                    className="flex-1 rounded-xl border border-input bg-card py-2.5 text-sm font-semibold text-foreground"
                  >
                    {t("settings.cancel")}
                  </button>
                  <button
                    onClick={handleChangePassword}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
                  >
                    {t("settings.save")}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowPwForm(true)}
                className="w-full rounded-xl bg-secondary py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                {t("settings.changePassword")}
              </button>
            )}
          </section>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/30 py-3 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            {t("comingSoon.logout")}
          </button>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default Settings;
