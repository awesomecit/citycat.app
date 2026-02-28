import { useTranslation } from "react-i18next";
import { useState } from "react";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useMunicipalityStore, Report } from "@/stores/municipalityStore";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Cat, MapPin, MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react";

const categoryIcons: Record<string, typeof Cat> = {
  abandoned: Cat,
  injured: AlertTriangle,
  colony: MapPin,
  nuisance: MessageSquare,
  other: Clock,
};

const statusStyles: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  inProgress: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  closed: "bg-muted text-muted-foreground",
};

const MunicipalityReports = () => {
  const { t } = useTranslation();
  const { reports, updateReportStatus } = useMunicipalityStore();
  const { toast } = useToast();
  const [tab, setTab] = useState("open");
  const [selected, setSelected] = useState<Report | null>(null);
  const [notes, setNotes] = useState("");

  const filtered = tab === "all" ? reports : reports.filter((r) => r.status === tab);

  const handleAction = (action: "inProgress" | "resolved" | "closed") => {
    if (!selected) return;
    updateReportStatus(selected.id, action, notes || undefined);
    toast({
      title: t(`municipality.report${action.charAt(0).toUpperCase() + action.slice(1)}Toast`),
      description: selected.title,
    });
    setSelected(null);
    setNotes("");
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("municipality.reportsTitle")} />
        <main className="flex flex-1 flex-col gap-4 p-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="open">{t("municipality.statusOpen")}</TabsTrigger>
              <TabsTrigger value="inProgress">{t("municipality.statusInProgress")}</TabsTrigger>
              <TabsTrigger value="resolved">{t("municipality.statusResolved")}</TabsTrigger>
              <TabsTrigger value="all">{t("municipality.all")}</TabsTrigger>
            </TabsList>

            <TabsContent value={tab} className="mt-4 space-y-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-10 w-10 text-muted-foreground/40 mb-2" />
                  <p className="text-sm text-muted-foreground">{t("municipality.noReports")}</p>
                </div>
              ) : (
                filtered.map((report) => {
                  const Icon = categoryIcons[report.category] || Clock;
                  return (
                    <Card
                      key={report.id}
                      className="cursor-pointer hover:ring-1 hover:ring-primary/30 transition-all"
                      onClick={() => { setSelected(report); setNotes(report.notes || ""); }}
                    >
                      <CardContent className="flex gap-3 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-bold text-foreground truncate">{report.title}</p>
                            <Badge className={`shrink-0 text-[10px] ${statusStyles[report.status]}`}>
                              {t(`municipality.status${report.status.charAt(0).toUpperCase() + report.status.slice(1)}`)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{report.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
                            <span>{report.reporterName}</span>
                            <span>·</span>
                            <span>{new Date(report.createdAt).toLocaleDateString("it")}</span>
                            {report.address && (
                              <>
                                <span>·</span>
                                <span className="truncate">{report.address}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <BottomNav />

      {/* Report detail dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => { if (!open) { setSelected(null); setNotes(""); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">{selected?.title}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <Badge className={`${statusStyles[selected.status]}`}>
                {t(`municipality.status${selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}`)}
              </Badge>
              <p className="text-sm text-foreground">{selected.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div><span className="font-semibold text-foreground">{t("municipality.reporter")}:</span> {selected.reporterName}</div>
                <div><span className="font-semibold text-foreground">{t("municipality.date")}:</span> {new Date(selected.createdAt).toLocaleDateString("it")}</div>
                {selected.address && <div className="col-span-2"><span className="font-semibold text-foreground">{t("municipality.address")}:</span> {selected.address}</div>}
                <div className="col-span-2"><span className="font-semibold text-foreground">{t("municipality.category")}:</span> {t(`municipality.cat${selected.category.charAt(0).toUpperCase() + selected.category.slice(1)}`)}</div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground">{t("municipality.operatorNotes")}</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("municipality.notesPlaceholder")}
                  className="mt-1"
                  rows={2}
                />
              </div>

              {selected.status !== "closed" && (
                <div className="flex gap-2 pt-1">
                  {selected.status === "open" && (
                    <Button size="sm" className="flex-1" onClick={() => handleAction("inProgress")}>
                      <Clock className="mr-1 h-3.5 w-3.5" /> {t("municipality.takeCharge")}
                    </Button>
                  )}
                  {(selected.status === "open" || selected.status === "inProgress") && (
                    <Button size="sm" variant="outline" className="flex-1 text-green-700 border-green-300" onClick={() => handleAction("resolved")}>
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> {t("municipality.resolve")}
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => handleAction("closed")}>
                    <XCircle className="mr-1 h-3.5 w-3.5" /> {t("municipality.close")}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default MunicipalityReports;
