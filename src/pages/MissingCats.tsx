import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useMissingCatStore, type MissingCatReport, type Sighting } from "@/stores/missingCatStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle, MapPin, Clock, Eye, Share2, Plus,
  CheckCircle, ChevronRight, Phone, X, Send,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { it } from "date-fns/locale";

type Tab = "missing" | "found" | "map";

const statusColors: Record<string, string> = {
  missing: "0 60% 50%",
  found: "142 60% 45%",
  closed: "220 10% 60%",
};

const MissingCats = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { reports, sightings, addSighting } = useMissingCatStore();
  const { toast } = useToast();

  const [tab, setTab] = useState<Tab>("missing");
  const [selected, setSelected] = useState<string | null>(null);
  const [showSightingForm, setShowSightingForm] = useState(false);
  const [sightingText, setSightingText] = useState("");
  const [sightingAddress, setSightingAddress] = useState("");
  const [showReportForm, setShowReportForm] = useState(false);

  // New report form state
  const [newReport, setNewReport] = useState({
    catName: "", breed: "", color: "", description: "",
    lastSeenAddress: "", microchipId: "", reward: "",
  });

  const filtered = useMemo(() => {
    if (tab === "found") return reports.filter((r) => r.status === "found");
    return reports.filter((r) => r.status === "missing");
  }, [reports, tab]);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const selectedReport = reports.find((r) => r.id === selected);
  const selectedSightings = sightings
    .filter((s) => s.reportId === selected)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleShare = (report: MissingCatReport) => {
    const text = `🚨 ${t("missing.shareText", { name: report.catName, address: report.lastSeenAddress })}`;
    if (navigator.share) {
      navigator.share({ title: `${report.catName} — ${t("missing.title")}`, text });
    } else {
      navigator.clipboard.writeText(text);
      toast({ title: t("missing.linkCopied") });
    }
  };

  const handleAddSighting = () => {
    if (!sightingText.trim() || !sightingAddress.trim() || !selected) return;
    const newS: Sighting = {
      id: `s-${Date.now()}`,
      reportId: selected,
      description: sightingText,
      address: sightingAddress,
      lat: (selectedReport?.lastSeenLat || 41.9) + (Math.random() - 0.5) * 0.01,
      lng: (selectedReport?.lastSeenLng || 12.48) + (Math.random() - 0.5) * 0.01,
      date: new Date().toISOString(),
      reporterName: "Tu",
      confirmed: false,
    };
    addSighting(newS);
    setSightingText("");
    setSightingAddress("");
    setShowSightingForm(false);
    toast({ title: t("missing.sightingAdded") });
  };

  const handleNewReport = () => {
    if (!newReport.catName.trim() || !newReport.lastSeenAddress.trim()) return;
    const { addReport } = useMissingCatStore.getState();
    addReport({
      id: `mc-${Date.now()}`,
      catName: newReport.catName,
      breed: newReport.breed || "Non specificata",
      color: newReport.color || "Non specificato",
      description: newReport.description,
      lastSeenDate: new Date().toISOString().split("T")[0],
      lastSeenAddress: newReport.lastSeenAddress,
      lastSeenLat: 41.9 + (Math.random() - 0.5) * 0.05,
      lastSeenLng: 12.48 + (Math.random() - 0.5) * 0.05,
      ownerName: "Tu",
      status: "missing",
      createdAt: new Date().toISOString(),
      microchipId: newReport.microchipId || undefined,
      reward: newReport.reward || undefined,
    });
    setNewReport({ catName: "", breed: "", color: "", description: "", lastSeenAddress: "", microchipId: "", reward: "" });
    setShowReportForm(false);
    toast({ title: t("missing.reportCreated") });
  };

  // Detail view
  if (selectedReport) {
    return (
      <PageTransition>
        <div className="flex min-h-screen flex-col bg-background pb-16">
          <GlobalHeader title={selectedReport.catName} />
          <div className="mx-auto w-full max-w-lg space-y-4 p-4">
            {/* Status badge */}
            <div className="flex items-center justify-between">
              <Badge
                className="rounded-full px-3 py-1 text-xs font-bold text-primary-foreground"
                style={{ backgroundColor: `hsl(${statusColors[selectedReport.status]})` }}
              >
                {t(`missing.status_${selectedReport.status}`)}
              </Badge>
              <button onClick={() => handleShare(selectedReport)} className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                <Share2 className="h-3.5 w-3.5" /> {t("missing.share")}
              </button>
            </div>

            {/* Info card */}
            <section className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-[10px] text-muted-foreground">{t("missing.breed")}</p><p className="font-bold text-foreground">{selectedReport.breed}</p></div>
                <div><p className="text-[10px] text-muted-foreground">{t("missing.color")}</p><p className="font-bold text-foreground">{selectedReport.color}</p></div>
                {selectedReport.age && <div><p className="text-[10px] text-muted-foreground">{t("cats.ageLabel")}</p><p className="font-bold text-foreground">{selectedReport.age} {t("missing.years")}</p></div>}
                {selectedReport.microchipId && <div><p className="text-[10px] text-muted-foreground">{t("missing.microchip")}</p><p className="font-bold text-foreground text-[11px]">{selectedReport.microchipId}</p></div>}
              </div>
              <p className="text-sm text-foreground leading-relaxed">{selectedReport.description}</p>
              {selectedReport.reward && (
                <div className="rounded-xl bg-accent/30 p-2 text-center">
                  <span className="text-xs font-bold text-accent-foreground">🎁 {selectedReport.reward}</span>
                </div>
              )}
            </section>

            {/* Last seen */}
            <section className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-destructive" /> {t("missing.lastSeen")}
              </h3>
              <p className="text-sm text-foreground">{selectedReport.lastSeenAddress}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{format(new Date(selectedReport.lastSeenDate), "dd MMMM yyyy", { locale: it })}</p>
            </section>

            {/* Contact */}
            <section className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{t("missing.owner")}: <span className="font-bold text-foreground">{selectedReport.ownerName}</span></p>
              {selectedReport.ownerPhone && (
                <a href={`tel:${selectedReport.ownerPhone}`} className="mt-2 flex items-center gap-2 rounded-xl bg-primary/10 p-2 text-sm font-bold text-primary">
                  <Phone className="h-4 w-4" /> {selectedReport.ownerPhone}
                </a>
              )}
            </section>

            {/* Sightings map simulation */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" /> {t("missing.sightings")} ({selectedSightings.length})
                </h3>
                <button
                  onClick={() => setShowSightingForm(!showSightingForm)}
                  className="flex items-center gap-1 rounded-xl bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground"
                >
                  <Plus className="h-3 w-3" /> {t("missing.addSighting")}
                </button>
              </div>

              {/* Map visualization */}
              <div className="relative rounded-2xl border border-border bg-muted/30 overflow-hidden" style={{ height: 200 }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Grid background */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                    {/* Last seen pin */}
                    <div
                      className="absolute z-10 flex flex-col items-center"
                      style={{ left: "50%", top: "50%", transform: "translate(-50%, -100%)" }}
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive shadow-lg">
                        <AlertTriangle className="h-4 w-4 text-destructive-foreground" />
                      </div>
                      <div className="h-2 w-0.5 bg-destructive" />
                    </div>
                    {/* Sighting pins */}
                    {selectedSightings.map((s, i) => {
                      const offsetX = ((s.lng - selectedReport.lastSeenLng) * 8000);
                      const offsetY = -((s.lat - selectedReport.lastSeenLat) * 8000);
                      return (
                        <div
                          key={s.id}
                          className="absolute z-10 flex flex-col items-center"
                          style={{
                            left: `calc(50% + ${offsetX}px)`,
                            top: `calc(50% + ${offsetY}px)`,
                            transform: "translate(-50%, -100%)",
                          }}
                        >
                          <div className={`flex h-6 w-6 items-center justify-center rounded-full shadow-md text-[10px] font-bold text-primary-foreground ${s.confirmed ? "bg-primary" : "bg-accent"}`}>
                            {i + 1}
                          </div>
                          <div className={`h-1.5 w-0.5 ${s.confirmed ? "bg-primary" : "bg-accent"}`} />
                        </div>
                      );
                    })}
                    {/* Legend */}
                    <div className="absolute bottom-2 left-2 flex gap-2">
                      <span className="flex items-center gap-1 rounded-lg bg-background/80 px-2 py-0.5 text-[9px] text-foreground">
                        <span className="h-2 w-2 rounded-full bg-destructive" /> {t("missing.lastSeen")}
                      </span>
                      <span className="flex items-center gap-1 rounded-lg bg-background/80 px-2 py-0.5 text-[9px] text-foreground">
                        <span className="h-2 w-2 rounded-full bg-primary" /> {t("missing.confirmed")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sighting form */}
              {showSightingForm && (
                <div className="rounded-2xl border border-primary/20 bg-card p-3 space-y-2">
                  <textarea
                    value={sightingText}
                    onChange={(e) => setSightingText(e.target.value)}
                    placeholder={t("missing.sightingDescPlaceholder")}
                    rows={2}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                  <input
                    value={sightingAddress}
                    onChange={(e) => setSightingAddress(e.target.value)}
                    placeholder={t("missing.sightingAddressPlaceholder")}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowSightingForm(false)} className="flex-1 rounded-xl border border-border py-2 text-xs text-muted-foreground">{t("health.cancel")}</button>
                    <button onClick={handleAddSighting} className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground">
                      <Send className="h-3 w-3" /> {t("missing.send")}
                    </button>
                  </div>
                </div>
              )}

              {/* Sighting list */}
              {selectedSightings.map((s, i) => (
                <div key={s.id} className={`rounded-2xl border p-3 ${s.confirmed ? "border-primary/20 bg-primary/5" : "border-border bg-card"}`}>
                  <div className="flex items-start gap-2">
                    <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground ${s.confirmed ? "bg-primary" : "bg-muted text-muted-foreground"}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{s.description}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" /> {s.address}</span>
                        <span>{formatDistanceToNow(new Date(s.date), { addSuffix: true, locale: it })}</span>
                        <span>— {s.reporterName}</span>
                      </div>
                      {s.confirmed && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          <CheckCircle className="h-3 w-3" /> {t("missing.confirmed")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <button onClick={() => setSelected(null)} className="w-full text-sm text-muted-foreground py-2">{t("missing.backToList")}</button>
          </div>
        </div>
        <BottomNav />
      </PageTransition>
    );
  }

  // List view
  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("missing.title")} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {(["missing", "found"] as Tab[]).map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-colors ${
                  tab === tb ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {t(`missing.tab_${tb}`)} ({reports.filter((r) => r.status === (tb === "found" ? "found" : "missing")).length})
              </button>
            ))}
          </div>

          {/* New report button */}
          <button
            onClick={() => setShowReportForm(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-destructive/30 bg-destructive/5 py-3 text-sm font-bold text-destructive transition-colors hover:bg-destructive/10"
          >
            <AlertTriangle className="h-4 w-4" /> {t("missing.reportMissing")}
          </button>

          {/* New report form */}
          {showReportForm && (
            <div className="rounded-2xl border border-destructive/20 bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">{t("missing.newReport")}</h3>
                <button onClick={() => setShowReportForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              {[
                { key: "catName", placeholder: "missing.namePlaceholder", required: true },
                { key: "breed", placeholder: "missing.breedPlaceholder" },
                { key: "color", placeholder: "missing.colorPlaceholder" },
                { key: "lastSeenAddress", placeholder: "missing.addressPlaceholder", required: true },
                { key: "microchipId", placeholder: "missing.microchipPlaceholder" },
                { key: "reward", placeholder: "missing.rewardPlaceholder" },
              ].map(({ key, placeholder, required }) => (
                <input
                  key={key}
                  value={(newReport as any)[key]}
                  onChange={(e) => setNewReport({ ...newReport, [key]: e.target.value })}
                  placeholder={t(placeholder) + (required ? " *" : "")}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              ))}
              <textarea
                value={newReport.description}
                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                placeholder={t("missing.descriptionPlaceholder")}
                rows={3}
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <button
                onClick={handleNewReport}
                disabled={!newReport.catName.trim() || !newReport.lastSeenAddress.trim()}
                className="w-full rounded-xl bg-destructive py-2.5 text-sm font-bold text-destructive-foreground disabled:opacity-50 transition-transform active:scale-[0.98]"
              >
                {t("missing.submitReport")}
              </button>
            </div>
          )}

          {/* Report cards */}
          {filtered.map((report) => {
            const reportSightings = sightings.filter((s) => s.reportId === report.id);
            return (
              <button
                key={report.id}
                onClick={() => setSelected(report.id)}
                className="w-full rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-secondary/50"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg"
                    style={{ backgroundColor: `hsl(${statusColors[report.status]} / 0.12)`, color: `hsl(${statusColors[report.status]})` }}
                  >
                    {report.status === "found" ? "✅" : "🚨"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-foreground">{report.catName}</p>
                      <span className="text-[10px] text-muted-foreground">{report.breed}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {report.lastSeenAddress}
                    </p>
                    <div className="mt-1.5 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Clock className="h-3 w-3" /> {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true, locale: it })}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Eye className="h-3 w-3" /> {reportSightings.length} {t("missing.sightingsCount")}
                      </span>
                    </div>
                    {report.reward && (
                      <span className="mt-1 inline-block rounded-full bg-accent/30 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">🎁 {report.reward}</span>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground mt-1" />
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">{t("missing.noReports")}</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default MissingCats;
