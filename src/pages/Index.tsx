import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, Lock, User, Eye, EyeOff, Globe, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { findUser, emailExists, mockUsers } from "@/lib/mockUsers";
import { isDemoMode } from "@/api/client";
import { ROLE_META } from "@/lib/roles";
import { useAuthStore } from "@/stores/authStore";
import PageTransition from "@/components/PageTransition";
import { validateBetaCode } from "@/lib/betaCodes";
import PresentationViewer from "@/components/PresentationViewer";

import citycatLogo from "@/assets/citycat-logo.png";
import RoleFeaturesDialog from "@/components/RoleFeaturesDialog";
import type { MockUser } from "@/lib/mockUsers";

const Index = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [featuresUser, setFeaturesUser] = useState<MockUser | null>(null);
  const [betaCode, setBetaCode] = useState("");
  const [betaError, setBetaError] = useState("");
  const [betaUnlocked, setBetaUnlocked] = useState(false);
  const [presOpen, setPresOpen] = useState(false);

  const currentLang = i18n.language?.startsWith("it") ? "it" : "en";

  const toggleLang = () => {
    i18n.changeLanguage(currentLang === "it" ? "en" : "it");
  };

  const handleLogin = () => {
    if (!email.trim()) {
      return toast({ variant: "destructive", title: t("toast.loginErrorEmail"), description: t("toast.loginErrorEmailDesc") });
    }
    if (!password.trim()) {
      return toast({ variant: "destructive", title: t("toast.loginErrorPassword"), description: t("toast.loginErrorPasswordDesc") });
    }
    const user = findUser(email, password);
    if (!user) {
      return toast({ variant: "destructive", title: t("toast.loginErrorInvalid"), description: t("toast.loginErrorInvalidDesc") });
    }
    login(user);
    toast({ title: t("toast.loginSuccess"), description: t("toast.loginSuccessDesc", { name: user.name }) });
    setFeaturesUser(user);
  };

  const handleRegister = () => {
    if (!name.trim()) {
      return toast({ variant: "destructive", title: t("toast.registerErrorName"), description: t("toast.registerErrorNameDesc") });
    }
    if (!email.trim()) {
      return toast({ variant: "destructive", title: t("toast.registerErrorEmail"), description: t("toast.registerErrorEmailDesc") });
    }
    if (password.length < 6) {
      return toast({ variant: "destructive", title: t("toast.registerErrorPassword"), description: t("toast.registerErrorPasswordDesc") });
    }
    if (emailExists(email)) {
      return toast({ variant: "destructive", title: t("toast.registerErrorExists"), description: t("toast.registerErrorExistsDesc") });
    }
    const newUser: MockUser = { email, password, name, roles: ["adopter"], activeRole: "adopter" };
    login(newUser);
    toast({ title: t("toast.registerSuccess"), description: t("toast.registerSuccessDesc", { name }) });
    setFeaturesUser(newUser);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    isLogin ? handleLogin() : handleRegister();
  };

  const handleSocial = (provider: string) => {
    toast({ title: t("toast.socialInfo"), description: t("toast.socialInfoDesc", { provider }) });
  };

  const handleForgot = () => {
    toast({ title: t("toast.forgotInfo"), description: t("toast.forgotInfoDesc") });
  };

  const handleBetaCode = () => {
    setBetaError("");
    const normalized = betaCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (normalized.length !== 5) {
      setBetaError(t("auth.betaCodeErrorLength"));
      return;
    }
    const match = validateBetaCode(normalized);
    if (!match) {
      setBetaError(t("auth.betaCodeErrorInvalid"));
      return;
    }
    const betaUser: MockUser = {
      email: `beta-${match.code.toLowerCase()}@citycat.app`,
      password: "beta",
      name: `Beta Tester ${match.label}`,
      roles: [match.role],
      activeRole: match.role,
    };
    setBetaUnlocked(true);
    login(betaUser);
    toast({
      title: t("auth.betaCodeSuccess"),
      description: t("auth.betaCodeSuccessDesc", { role: match.label }),
    });
    setFeaturesUser(betaUser);
  };

  return (
    <PageTransition>
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        {/* Language toggle */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" />
            {currentLang === "it" ? "EN" : "IT"}
          </button>
        </div>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center overflow-hidden">
            <img src={citycatLogo} alt="City Cat logo" className="h-full w-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {t("app.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("app.subtitle")}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-secondary p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
              isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t("auth.login")}
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-bold transition-all ${
              !isLogin ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t("auth.register")}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("auth.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              placeholder={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <button type="button" onClick={handleForgot} className="text-xs font-semibold text-primary">
                {t("auth.forgotPassword")}
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
          >
            {isLogin ? t("auth.login") : t("auth.createAccount")}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">{t("auth.or")}</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Social */}
        <div className="flex gap-3">
          <button
            onClick={() => handleSocial("Google")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-input bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("auth.google")}
          </button>
          <button
            onClick={() => handleSocial("Apple")}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-input bg-card py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            {t("auth.apple")}
          </button>
        </div>

        {/* Beta Code Access */}
        <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
          <p className="mb-2 text-center text-xs font-bold text-foreground">
            {t("auth.betaCodeTitle")}
          </p>
          <p className="mb-3 text-center text-[10px] text-muted-foreground">
            {t("auth.betaCodeDesc")}
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("auth.betaCodePlaceholder")}
                value={betaCode}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
                  setBetaCode(val);
                  setBetaError("");
                }}
                maxLength={5}
                className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-4 text-center text-sm font-bold uppercase tracking-widest text-foreground placeholder:text-muted-foreground placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="button"
              onClick={handleBetaCode}
              disabled={betaCode.length !== 5}
              className="shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-40"
            >
              {t("auth.betaCodeSubmit")}
            </button>
          </div>
          {betaError && (
            <p className="mt-2 text-center text-xs font-semibold text-destructive">{betaError}</p>
          )}
        </div>

        {/* Demo quick access */}
        {betaUnlocked && isDemoMode() && (
          <div className="mt-6 rounded-xl border border-amber-400/30 bg-amber-50/50 p-3 dark:bg-amber-950/20">
            <p className="mb-2.5 text-center text-xs font-bold text-amber-700 dark:text-amber-400">
              ⚡ {t("auth.demoQuickAccess")}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {mockUsers.filter(u => u.email !== "test@test.com").map((u) => {
                const meta = ROLE_META[u.activeRole];
                return (
                  <button
                    key={u.email}
                    onClick={() => {
                      login(u);
                      toast({ title: t("toast.loginSuccess"), description: t("toast.loginSuccessDesc", { name: u.name }) });
                      setFeaturesUser(u);
                    }}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-2 text-left transition-colors hover:bg-secondary"
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm"
                      style={{ backgroundColor: `hsl(${meta.color} / 0.15)` }}
                    >
                      {meta.emoji}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-foreground">{u.name}</div>
                      <div className="truncate text-[10px] text-muted-foreground">{t(meta.labelKey)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Links About / Pricing */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate("/about")} className="text-sm font-semibold text-primary hover:underline">
            {t("auth.linkFeatures")}
          </button>
          <button onClick={() => navigate("/pricing")} className="text-sm font-semibold text-primary hover:underline">
            {t("auth.linkPricing")}
          </button>
          <button onClick={() => navigate("/roadmap")} className="text-sm font-semibold text-primary hover:underline">
            {t("auth.linkRoadmap")}
          </button>
          <button onClick={() => setPresOpen(true)} className="text-sm font-semibold text-primary hover:underline">
            {t("auth.linkPresentation")}
          </button>
        </div>

        {/* Tutorial links */}
        {isDemoMode() && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="w-full text-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">📖 Tutorial</span>
            <button onClick={() => navigate("/tutorial/adottante")} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent">
              🐱 {t("tutorialAdottante.title")}
            </button>
            <button onClick={() => navigate("/tutorial/ente")} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent">
              🏠 {t("tutorialEnte.title")}
            </button>
            <button onClick={() => navigate("/tutorial/volontario")} className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent">
              🤝 {t("tutorialVolontario.title")}
            </button>
          </div>
        )}

        <p className="mt-4 text-center text-xs text-muted-foreground">
          {t("auth.footer")}
        </p>

        <PresentationViewer open={presOpen} onOpenChange={setPresOpen} />
      </div>

      {/* Role features popup */}
      {featuresUser && (
        <RoleFeaturesDialog
          open={!!featuresUser}
          onOpenChange={(open) => {
            if (!open) {
              navigate("/dashboard");
              setFeaturesUser(null);
            }
          }}
          role={featuresUser.activeRole}
          userName={featuresUser.name}
        />
      )}
    </div>
    </PageTransition>
  );
};

export default Index;
