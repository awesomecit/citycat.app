import { useTranslation } from "react-i18next";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useMunicipalityStore, CatColony } from "@/stores/municipalityStore";
import { MapPin, Cat, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const statusConfig = {
  active: { label: "Attiva", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  monitored: { label: "Monitorata", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  critical: { label: "Critica", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

const TerritorialMap = () => {
  const { t } = useTranslation();
  const { colonies } = useMunicipalityStore();
  const [selected, setSelected] = useState<CatColony | null>(null);

  const totalCats = colonies.reduce((a, c) => a + c.catCount, 0);
  const totalSterilized = colonies.reduce((a, c) => a + c.sterilized, 0);
  const sterilizationRate = totalCats > 0 ? Math.round((totalSterilized / totalCats) * 100) : 0;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("municipality.mapTitle")} />
        <main className="flex flex-1 flex-col gap-4 p-4">
          {/* Map placeholder */}
          <Card className="relative overflow-hidden">
            <div className="relative h-64 bg-accent/30 flex items-center justify-center">
              {/* Simulated map grid */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute border-b border-foreground/20 w-full" style={{ top: `${(i + 1) * 12.5}%` }} />
                ))}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute border-r border-foreground/20 h-full" style={{ left: `${(i + 1) * 12.5}%` }} />
                ))}
              </div>

              {/* Colony pins */}
              {colonies.map((colony, idx) => {
                const positions = [
                  { left: "30%", top: "25%" },
                  { left: "55%", top: "40%" },
                  { left: "20%", top: "60%" },
                  { left: "70%", top: "20%" },
                  { left: "45%", top: "70%" },
                ];
                const pos = positions[idx % positions.length];
                const isSelected = selected?.id === colony.id;
                const pinColor = colony.status === "critical"
                  ? "text-destructive"
                  : colony.status === "monitored"
                    ? "text-yellow-500"
                    : "text-primary";

                return (
                  <button
                    key={colony.id}
                    className={`absolute transition-transform ${isSelected ? "scale-125 z-10" : "hover:scale-110"}`}
                    style={{ left: pos.left, top: pos.top }}
                    onClick={() => setSelected(isSelected ? null : colony)}
                  >
                    <div className="flex flex-col items-center">
                      <MapPin className={`h-7 w-7 ${pinColor} drop-shadow-md`} fill="currentColor" />
                      <span className="mt-0.5 rounded-full bg-card px-1.5 py-0.5 text-[10px] font-bold shadow-sm text-foreground">
                        {colony.catCount}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Summary bar */}
            <div className="flex items-center justify-around border-t bg-card p-3 text-center">
              <div>
                <p className="text-lg font-extrabold text-foreground">{colonies.length}</p>
                <p className="text-[10px] text-muted-foreground">{t("municipality.colonies")}</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-foreground">{totalCats}</p>
                <p className="text-[10px] text-muted-foreground">{t("municipality.totalCats")}</p>
              </div>
              <div>
                <p className="text-lg font-extrabold text-primary">{sterilizationRate}%</p>
                <p className="text-[10px] text-muted-foreground">{t("municipality.sterilized")}</p>
              </div>
            </div>
          </Card>

          {/* Selected colony detail */}
          {selected && (
            <Card className="animate-in slide-in-from-bottom-2">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{selected.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("municipality.lastCensus")}: {new Date(selected.lastCensus).toLocaleDateString("it")}
                    </p>
                  </div>
                  <Badge className={statusConfig[selected.status].className}>
                    {statusConfig[selected.status].label}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-muted p-2">
                    <Cat className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
                    <p className="text-sm font-bold text-foreground">{selected.catCount}</p>
                    <p className="text-[10px] text-muted-foreground">{t("municipality.cats")}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <CheckCircle2 className="mx-auto h-4 w-4 text-primary mb-1" />
                    <p className="text-sm font-bold text-foreground">{selected.sterilized}</p>
                    <p className="text-[10px] text-muted-foreground">{t("municipality.sterilized")}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-2">
                    <AlertTriangle className="mx-auto h-4 w-4 text-yellow-500 mb-1" />
                    <p className="text-sm font-bold text-foreground">{selected.catCount - selected.sterilized}</p>
                    <p className="text-[10px] text-muted-foreground">{t("municipality.toSterilize")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Colony list */}
          <h2 className="text-sm font-bold text-foreground mt-2">{t("municipality.allColonies")}</h2>
          <div className="space-y-2">
            {colonies.map((colony) => (
              <Card
                key={colony.id}
                className={`cursor-pointer transition-colors ${selected?.id === colony.id ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelected(selected?.id === colony.id ? null : colony)}
              >
                <CardContent className="flex items-center gap-3 p-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      colony.status === "critical" ? "bg-destructive/10" : colony.status === "monitored" ? "bg-yellow-100 dark:bg-yellow-900/20" : "bg-primary/10"
                    }`}
                  >
                    <MapPin className={`h-5 w-5 ${
                      colony.status === "critical" ? "text-destructive" : colony.status === "monitored" ? "text-yellow-500" : "text-primary"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{colony.name}</p>
                    <p className="text-xs text-muted-foreground">{colony.catCount} {t("municipality.cats")} · {colony.sterilized} {t("municipality.sterilized")}</p>
                  </div>
                  <Badge className={`text-[10px] ${statusConfig[colony.status].className}`}>
                    {statusConfig[colony.status].label}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default TerritorialMap;
