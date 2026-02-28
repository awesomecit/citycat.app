import { useTranslation } from "react-i18next";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useMunicipalityStore } from "@/stores/municipalityStore";
import { Card, CardContent } from "@/components/ui/card";
import { Cat, MapPin, AlertTriangle, CheckCircle2, TrendingUp, FileText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const CHART_COLORS = [
  "hsl(15 85% 55%)",   // primary
  "hsl(142 60% 45%)",  // green
  "hsl(200 60% 50%)",  // accent blue
  "hsl(270 55% 55%)",  // purple
  "hsl(42 75% 50%)",   // yellow
];

const MunicipalityStats = () => {
  const { t } = useTranslation();
  const { colonies, reports } = useMunicipalityStore();

  const totalCats = colonies.reduce((a, c) => a + c.catCount, 0);
  const totalSterilized = colonies.reduce((a, c) => a + c.sterilized, 0);
  const sterilizationRate = totalCats > 0 ? Math.round((totalSterilized / totalCats) * 100) : 0;
  const openReports = reports.filter((r) => r.status === "open").length;
  const criticalColonies = colonies.filter((c) => c.status === "critical").length;

  const barData = colonies.map((c) => ({
    name: c.name.replace("Colonia ", ""),
    gatti: c.catCount,
    sterilizzati: c.sterilized,
  }));

  const statusData = [
    { name: t("municipality.statusActive"), value: colonies.filter((c) => c.status === "active").length },
    { name: t("municipality.statusMonitored"), value: colonies.filter((c) => c.status === "monitored").length },
    { name: t("municipality.statusCritical"), value: colonies.filter((c) => c.status === "critical").length },
  ].filter((d) => d.value > 0);

  const reportCategoryData = [
    { name: t("municipality.catAbandoned"), value: reports.filter((r) => r.category === "abandoned").length },
    { name: t("municipality.catInjured"), value: reports.filter((r) => r.category === "injured").length },
    { name: t("municipality.catColony"), value: reports.filter((r) => r.category === "colony").length },
    { name: t("municipality.catNuisance"), value: reports.filter((r) => r.category === "nuisance").length },
    { name: t("municipality.catOther"), value: reports.filter((r) => r.category === "other").length },
  ].filter((d) => d.value > 0);

  const kpis = [
    { icon: MapPin, label: t("municipality.colonies"), value: colonies.length, color: "text-primary" },
    { icon: Cat, label: t("municipality.totalCats"), value: totalCats, color: "text-primary" },
    { icon: CheckCircle2, label: t("municipality.sterilizationRate"), value: `${sterilizationRate}%`, color: "text-green-600" },
    { icon: AlertTriangle, label: t("municipality.criticalColonies"), value: criticalColonies, color: "text-destructive" },
    { icon: FileText, label: t("municipality.openReports"), value: openReports, color: "text-yellow-600" },
    { icon: TrendingUp, label: t("municipality.totalReports"), value: reports.length, color: "text-muted-foreground" },
  ];

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("municipality.statsTitle")} />
        <main className="flex flex-1 flex-col gap-4 p-4">
          {/* KPI Grid */}
          <div className="grid grid-cols-3 gap-2">
            {kpis.map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="flex flex-col items-center p-3 text-center">
                  <kpi.icon className={`h-5 w-5 ${kpi.color} mb-1`} />
                  <p className="text-lg font-extrabold text-foreground">{kpi.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bar chart — cats per colony */}
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">{t("municipality.catsPerColony")}</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={barData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} width={25} />
                  <Bar dataKey="gatti" fill="hsl(15 85% 55%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sterilizzati" fill="hsl(142 60% 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" /> {t("municipality.totalCats")}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "hsl(142 60% 45%)" }} /> {t("municipality.sterilized")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Pie charts row */}
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-bold text-foreground mb-2 text-center">{t("municipality.colonyStatus")}</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={45} innerRadius={25}>
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={["hsl(142 60% 45%)", "hsl(42 75% 50%)", "hsl(0 84% 60%)"][i]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5">
                  {statusData.map((d, i) => (
                    <span key={d.name} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ["hsl(142 60% 45%)", "hsl(42 75% 50%)", "hsl(0 84% 60%)"][i] }} />
                      {d.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <h3 className="text-xs font-bold text-foreground mb-2 text-center">{t("municipality.reportCategories")}</h3>
                <ResponsiveContainer width="100%" height={120}>
                  <PieChart>
                    <Pie data={reportCategoryData} dataKey="value" cx="50%" cy="50%" outerRadius={45} innerRadius={25}>
                      {reportCategoryData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5">
                  {reportCategoryData.map((d, i) => (
                    <span key={d.name} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                      {d.name}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default MunicipalityStats;
