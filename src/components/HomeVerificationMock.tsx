import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Camera } from "lucide-react";

/** Mock viewfinder component for the About page (Feature G) */
const HomeVerificationMock = () => {
  const { t } = useTranslation();

  const sections = [
    { icon: "✅", label: t("homeVerif.sectionDoors"), status: "done" },
    { icon: "🔵", label: t("homeVerif.sectionWindows"), status: "active" },
    { icon: "⭕", label: t("homeVerif.sectionScreens"), status: "pending" },
    { icon: "⭕", label: t("homeVerif.sectionBalcony"), status: "pending" },
    { icon: "⭕", label: t("homeVerif.sectionOutdoor"), status: "pending" },
    { icon: "⭕", label: t("homeVerif.sectionResting"), status: "pending" },
  ];

  return (
    <Card className="overflow-hidden border-2 border-accent">
      <CardContent className="p-0">
        {/* Simulated viewfinder */}
        <div className="relative flex h-48 flex-col items-center justify-center bg-muted-foreground/90 text-card">
          {/* Corner brackets */}
          <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-card/70" />
          <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-card/70" />
          <div className="absolute bottom-14 left-4 h-8 w-8 border-b-2 border-l-2 border-card/70" />
          <div className="absolute bottom-14 right-4 h-8 w-8 border-b-2 border-r-2 border-card/70" />

          {/* Section indicator */}
          <div className="absolute left-0 right-0 top-0 bg-background/20 px-3 py-1.5 text-center backdrop-blur-sm">
            <span className="text-xs font-bold text-card">
              {t("homeVerif.sectionLabel", { current: 2, total: 6 })} · {t("homeVerif.sectionWindows")}
            </span>
          </div>

          {/* Instruction */}
          <Camera className="mb-2 h-8 w-8 text-card/60" />
          <p className="text-sm font-semibold text-card/90">{t("homeVerif.mockInstruction")}</p>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
            <Progress value={33} className="h-1.5" />
          </div>
        </div>

        {/* Section checklist */}
        <div className="space-y-1 px-4 py-3">
          {sections.map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${
                s.status === "active"
                  ? "bg-primary/10 font-bold text-foreground"
                  : s.status === "done"
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50"
              }`}
            >
              <span className="text-base">{s.icon}</span>
              <span>{s.label}</span>
              {s.status === "active" && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {t("homeVerif.inProgress")}
                </Badge>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="space-y-2 px-4 pb-4">
          <Button className="w-full" disabled>
            <Camera className="mr-2 h-4 w-4" />
            {t("homeVerif.captureBtn")}
          </Button>
          <p className="text-center text-[10px] text-muted-foreground">
            {t("homeVerif.naLink")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HomeVerificationMock;
