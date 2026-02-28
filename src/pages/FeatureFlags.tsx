import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useFeatureFlagStore } from "@/stores/featureFlagStore";
import { ROLES, ROLE_META, type UserRole } from "@/lib/roles";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, ToggleLeft, ToggleRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FeatureFlags = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const { flags, toggle, toggleAllForRole, resetDefaults } = useFeatureFlagStore();
  const { toast } = useToast();

  const [selectedRole, setSelectedRole] = useState<UserRole>("adopter");

  if (!user || user.activeRole !== "admin") {
    return (
      <PageTransition>
        <GlobalHeader />
        <main className="pt-16 pb-24 px-4 text-center text-muted-foreground">
          {t("adminUsers.noAccess")}
        </main>
        <BottomNav />
      </PageTransition>
    );
  }

  const roleFlags = flags.filter((f) => f.role === selectedRole);
  const enabledCount = roleFlags.filter((f) => f.enabled).length;
  const allEnabled = enabledCount === roleFlags.length;

  return (
    <PageTransition>
      <GlobalHeader />
      <main className="pt-16 pb-24 px-4 max-w-lg mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{t("featureFlags.title")}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetDefaults(user.email);
              toast({ title: t("featureFlags.resetDone") });
            }}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            {t("featureFlags.reset")}
          </Button>
        </div>

        {/* Role chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ROLES.filter((r) => r !== "admin").map((role) => {
            const meta = ROLE_META[role];
            const active = role === selectedRole;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  active
                    ? "text-white shadow-md"
                    : "bg-muted text-muted-foreground"
                }`}
                style={active ? { backgroundColor: `hsl(${meta.color})` } : undefined}
              >
                {meta.emoji} {t(meta.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Bulk toggle */}
        <div className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2">
          <span className="text-sm font-medium">
            {enabledCount}/{roleFlags.length} {t("featureFlags.active")}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toggleAllForRole(selectedRole, !allEnabled, user.email);
              toast({
                title: allEnabled
                  ? t("featureFlags.allDisabled")
                  : t("featureFlags.allEnabled"),
              });
            }}
          >
            {allEnabled ? (
              <ToggleLeft className="w-4 h-4 mr-1" />
            ) : (
              <ToggleRight className="w-4 h-4 mr-1" />
            )}
            {allEnabled ? t("featureFlags.disableAll") : t("featureFlags.enableAll")}
          </Button>
        </div>

        {/* Feature list */}
        <div className="space-y-1">
          {roleFlags.map((flag) => (
            <div
              key={flag.id}
              className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{flag.emoji}</span>
                <span className="text-sm font-medium">{t(flag.labelKey)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={flag.enabled ? "default" : "secondary"}
                  className="text-[10px] px-1.5"
                >
                  {flag.enabled ? t("featureFlags.on") : t("featureFlags.off")}
                </Badge>
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={() => toggle(flag.id, user.email)}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
      <BottomNav />
    </PageTransition>
  );
};

export default FeatureFlags;
