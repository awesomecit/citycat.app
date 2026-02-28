import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore, type AppNotification } from "@/stores/notificationStore";
import { useAuditStore } from "@/stores/auditStore";
import { ROLES, ROLE_META, type UserRole } from "@/lib/roles";
import { useToast } from "@/hooks/use-toast";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import { Shield, Send, Eye, Megaphone, Bell, AlertTriangle, CheckCircle, Info, ScrollText, Calendar as CalendarIcon } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

type NotifType = AppNotification["type"];

const TYPE_OPTIONS: { value: NotifType; icon: typeof Info; color: string }[] = [
  { value: "info", icon: Info, color: "220 70% 55%" },
  { value: "success", icon: CheckCircle, color: "142 60% 45%" },
  { value: "warning", icon: AlertTriangle, color: "45 90% 50%" },
  { value: "urgent", icon: Bell, color: "0 60% 50%" },
];

/* ─── Compose Tab ─── */
const ComposeTab = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const currentUser = useAuthStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);
  const auditLog = useAuditStore((s) => s.log);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<NotifType>("info");
  const [targetAll, setTargetAll] = useState(true);
  const [targetRoles, setTargetRoles] = useState<UserRole[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const toggleRole = (role: UserRole) => {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const canSend = title.trim().length >= 3 && body.trim().length >= 5 && (targetAll || targetRoles.length > 0);

  const handleSend = () => {
    if (!canSend || !currentUser) return;

    const notif: AppNotification = {
      id: `broadcast-${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      read: false,
      createdAt: new Date().toISOString(),
      type,
      broadcast: true,
      targetRoles: targetAll ? undefined : targetRoles,
      sentBy: currentUser.email,
    };

    addNotification(notif);
    auditLog({
      action: "user_created",
      performedBy: currentUser.email,
      details: `Broadcast sent: "${title.trim()}" to ${targetAll ? "all users" : targetRoles.join(", ")}`,
    });

    toast({
      title: t("broadcast.sentTitle"),
      description: t("broadcast.sentDesc", { target: targetAll ? t("broadcast.allUsers") : targetRoles.map((r) => t(ROLE_META[r].labelKey)).join(", ") }),
    });

    setTitle(""); setBody(""); setType("info"); setTargetAll(true); setTargetRoles([]); setShowPreview(false);
  };

  const selectedType = TYPE_OPTIONS.find((o) => o.value === type)!;

  return (
    <>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-xs font-bold text-foreground mb-1.5 block">{t("broadcast.notifTitle")}</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value.slice(0, 100))} placeholder={t("broadcast.titlePlaceholder")} className="w-full rounded-xl border border-input bg-card py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          <p className="mt-1 text-[10px] text-muted-foreground text-right">{title.length}/100</p>
        </div>

        {/* Body */}
        <div>
          <label className="text-xs font-bold text-foreground mb-1.5 block">{t("broadcast.bodyLabel")}</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value.slice(0, 500))} placeholder={t("broadcast.bodyPlaceholder")} rows={3} className="w-full rounded-xl border border-input bg-card py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          <p className="mt-1 text-[10px] text-muted-foreground text-right">{body.length}/500</p>
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-bold text-foreground mb-2 block">{t("broadcast.typeLabel")}</label>
          <div className="flex gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setType(opt.value)} className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${type === opt.value ? "shadow-sm" : "opacity-40 hover:opacity-70"}`} style={{ backgroundColor: `hsl(${opt.color} / ${type === opt.value ? 0.15 : 0.06})`, color: `hsl(${opt.color})` }}>
                <opt.icon className="h-4 w-4" />
                {t(`broadcast.type_${opt.value}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Target */}
        <div>
          <label className="text-xs font-bold text-foreground mb-2 block">{t("broadcast.targetLabel")}</label>
          <div className="flex gap-2 mb-2">
            <button onClick={() => { setTargetAll(true); setTargetRoles([]); }} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${targetAll ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground"}`}>{t("broadcast.allUsers")}</button>
            <button onClick={() => setTargetAll(false)} className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${!targetAll ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground"}`}>{t("broadcast.byRole")}</button>
          </div>
          {!targetAll && (
            <div className="flex flex-wrap gap-1.5">
              {ROLES.filter((r) => r !== "admin").map((r) => (
                <button key={r} onClick={() => toggleRole(r)} className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${targetRoles.includes(r) ? "shadow-sm" : "opacity-40 hover:opacity-70"}`} style={{ backgroundColor: `hsl(${ROLE_META[r].color} / ${targetRoles.includes(r) ? 0.2 : 0.08})`, color: `hsl(${ROLE_META[r].color})` }}>
                  {ROLE_META[r].emoji} {t(ROLE_META[r].labelKey)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button onClick={() => setShowPreview(true)} disabled={!canSend} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-3 text-sm font-bold text-foreground transition-all hover:bg-secondary disabled:opacity-40">
            <Eye className="h-4 w-4" /> {t("broadcast.preview")}
          </button>
          <button onClick={handleSend} disabled={!canSend} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all active:scale-[0.98] disabled:opacity-40">
            <Send className="h-4 w-4" /> {t("broadcast.send")}
          </button>
        </div>
      </div>

      {/* Preview Drawer */}
      <Drawer open={showPreview} onOpenChange={setShowPreview}>
        <DrawerContent>
          <DrawerHeader><DrawerTitle>{t("broadcast.previewTitle")}</DrawerTitle></DrawerHeader>
          <div className="px-4 pb-2">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${selectedType.color} / 0.12)` }}>
                  <selectedType.icon className="h-4 w-4" style={{ color: `hsl(${selectedType.color})` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground">{title || t("broadcast.titlePlaceholder")}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{body || t("broadcast.bodyPlaceholder")}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="rounded-md px-1.5 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `hsl(${selectedType.color} / 0.12)`, color: `hsl(${selectedType.color})` }}>{t(`broadcast.type_${type}`)}</span>
                    <span className="text-[10px] text-muted-foreground">→ {targetAll ? t("broadcast.allUsers") : targetRoles.map((r) => t(ROLE_META[r].labelKey)).join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <button onClick={() => setShowPreview(false)} className="w-full rounded-xl bg-secondary py-2.5 text-sm font-bold text-foreground">{t("broadcast.backToEdit")}</button>
            <button onClick={handleSend} className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-sm">
              <Send className="inline h-4 w-4 mr-1.5" /> {t("broadcast.confirmSend")}
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

/* ─── History Tab ─── */
const HistoryTab = () => {
  const { t } = useTranslation();
  const notifications = useNotificationStore((s) => s.notifications);
  const broadcasts = useMemo(() => notifications.filter((n) => n.broadcast), [notifications]);

  const [filterType, setFilterType] = useState<NotifType | "all">("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const filtered = useMemo(() => {
    let result = broadcasts;
    if (filterType !== "all") result = result.filter((n) => n.type === filterType);
    if (dateFrom) result = result.filter((n) => isAfter(new Date(n.createdAt), startOfDay(dateFrom)));
    if (dateTo) result = result.filter((n) => isBefore(new Date(n.createdAt), endOfDay(dateTo)));
    return result;
  }, [broadcasts, filterType, dateFrom, dateTo]);

  return (
    <div className="space-y-3">
      {/* Type filter chips */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {(["all", ...TYPE_OPTIONS.map((o) => o.value)] as (NotifType | "all")[]).map((v) => {
          const active = v === filterType;
          return (
            <button key={v} onClick={() => setFilterType(v)} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${active ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground"}`}>
              {v === "all" ? t("filters.all") : t(`broadcast.type_${v}`)}
            </button>
          );
        })}
      </div>

      {/* Date filters */}
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("flex-1 justify-start text-xs", !dateFrom && "text-muted-foreground")}>
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {dateFrom ? format(dateFrom, "dd/MM/yyyy") : t("broadcast.dateFrom")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className={cn("flex-1 justify-start text-xs", !dateTo && "text-muted-foreground")}>
              <CalendarIcon className="h-3.5 w-3.5 mr-1" />
              {dateTo ? format(dateTo, "dd/MM/yyyy") : t("broadcast.dateTo")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={dateTo} onSelect={setDateTo} className={cn("p-3 pointer-events-auto")} />
          </PopoverContent>
        </Popover>
        {(dateFrom || dateTo) && (
          <Button variant="ghost" size="sm" onClick={() => { setDateFrom(undefined); setDateTo(undefined); }} className="text-xs px-2">✕</Button>
        )}
      </div>

      {/* Results */}
      <p className="text-xs text-muted-foreground">{filtered.length} {t("filters.results")}</p>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">{t("broadcast.noHistory")}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const typeOpt = TYPE_OPTIONS.find((o) => o.value === n.type)!;
            return (
              <div key={n.id} className="rounded-2xl border border-border bg-card p-3 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `hsl(${typeOpt.color} / 0.12)` }}>
                    <typeOpt.icon className="h-4 w-4" style={{ color: `hsl(${typeOpt.color})` }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{n.body}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="secondary" className="text-[10px]">{t(`broadcast.type_${n.type}`)}</Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {n.sentBy} · {format(new Date(n.createdAt), "dd/MM/yyyy HH:mm")}
                      </span>
                    </div>
                    {n.targetRoles && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {n.targetRoles.map((r) => (
                          <span key={r} className="rounded px-1 py-0.5 text-[9px] font-bold" style={{ backgroundColor: `hsl(${ROLE_META[r].color} / 0.1)`, color: `hsl(${ROLE_META[r].color})` }}>
                            {t(ROLE_META[r].labelKey)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Main ─── */
const AdminBroadcast = () => {
  const { t } = useTranslation();
  const currentUser = useAuthStore((s) => s.user);
  const isAdmin = currentUser?.activeRole === "admin";
  const [tab, setTab] = useState<"compose" | "history">("compose");

  if (!isAdmin) {
    return (
      <PageTransition>
        <GlobalHeader />
        <main className="px-4 pt-20 pb-24 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("adminUsers.noAccess")}</p>
        </main>
        <BottomNav />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <GlobalHeader />
      <main className="px-4 pt-20 pb-24 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-extrabold text-foreground">{t("broadcast.title")}</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button onClick={() => setTab("compose")} className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${tab === "compose" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground"}`}>
            <Send className="h-3.5 w-3.5" /> {t("broadcast.composeTab")}
          </button>
          <button onClick={() => setTab("history")} className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${tab === "history" ? "bg-primary text-primary-foreground shadow-sm" : "bg-secondary text-muted-foreground"}`}>
            <ScrollText className="h-3.5 w-3.5" /> {t("broadcast.historyTab")}
          </button>
        </div>

        {tab === "compose" ? <ComposeTab /> : <HistoryTab />}
      </main>
      <BottomNav />
    </PageTransition>
  );
};

export default AdminBroadcast;
