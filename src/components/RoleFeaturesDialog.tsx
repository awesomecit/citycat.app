import { useTranslation } from "react-i18next";
import { ROLE_META, type UserRole } from "@/lib/roles";
import { ROLE_FEATURES } from "@/lib/roleFeatures";
import { useFeatureFlagStore } from "@/stores/featureFlagStore";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Ban } from "lucide-react";

interface RoleFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: UserRole;
  userName: string;
}

const RoleFeaturesDialog = ({ open, onOpenChange, role, userName }: RoleFeaturesDialogProps) => {
  const { t } = useTranslation();
  const meta = ROLE_META[role];
  const features = ROLE_FEATURES[role];
  const flags = useFeatureFlagStore((s) => s.flags);

  const isFlagDisabled = (labelKey: string) => {
    const flag = flags.find((f) => f.role === role && f.labelKey === labelKey);
    return flag ? !flag.enabled : false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: `hsl(${meta.color} / 0.12)` }}
          >
            {meta.emoji}
          </div>
          <DialogTitle className="text-lg">
            {t("roleFeatures.welcomeTitle", { name: userName })}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {t("roleFeatures.welcomeDesc", { role: t(meta.labelKey) })}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 max-h-[50vh] space-y-1.5 overflow-y-auto pr-1">
          {features.map((f, i) => {
            const disabled = isFlagDisabled(f.labelKey);
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 rounded-lg border border-border px-3 py-2 ${
                  disabled ? "opacity-50" : ""
                }`}
              >
                <span className="text-base">{f.emoji}</span>
                <span className={`flex-1 text-sm font-medium ${
                  disabled ? "line-through text-muted-foreground" : "text-foreground"
                }`}>
                  {t(f.labelKey)}
                </span>
                {disabled ? (
                  <Badge
                    variant="destructive"
                    className="text-[10px] gap-0.5"
                  >
                    <Ban className="h-2.5 w-2.5" />
                    {t("roleFeatures.disabled")}
                  </Badge>
                ) : (
                  <Badge
                    variant={f.available ? "default" : "secondary"}
                    className="text-[10px]"
                    style={f.available ? {
                      backgroundColor: `hsl(${meta.color} / 0.15)`,
                      color: `hsl(${meta.color})`,
                    } : undefined}
                  >
                    {f.available ? t("roleFeatures.active") : t("roleFeatures.comingSoon")}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="mt-3 w-full rounded-xl py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-transform active:scale-[0.98]"
          style={{ backgroundColor: `hsl(${meta.color})` }}
        >
          {t("roleFeatures.letsGo")} 🚀
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default RoleFeaturesDialog;
