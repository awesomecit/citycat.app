import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useAuditStore, type AuditAction } from "@/stores/auditStore";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import ListFilter, { emptyFilterState, type FilterChip, type FilterState } from "@/components/ListFilter";
import { Shield, UserPlus, Trash2, RefreshCw, LogIn, Clock } from "lucide-react";
import { format } from "date-fns";

const ACTION_ICONS: Record<AuditAction, typeof UserPlus> = {
  user_created: UserPlus,
  user_deleted: Trash2,
  roles_updated: RefreshCw,
  role_switched: RefreshCw,
  user_login: LogIn,
};

const ACTION_COLORS: Record<AuditAction, string> = {
  user_created: "142 60% 45%",
  user_deleted: "0 60% 50%",
  roles_updated: "220 70% 55%",
  role_switched: "270 55% 55%",
  user_login: "25 85% 55%",
};

const AuditLog = () => {
  const { t } = useTranslation();
  const currentUser = useAuthStore((s) => s.user);
  const entries = useAuditStore((s) => s.entries);
  const isAdmin = currentUser?.activeRole === "admin";

  const chips: FilterChip[] = useMemo(() => [
    {
      key: "action",
      label: t("audit.filterByAction"),
      options: [
        { value: "user_created", label: t("audit.action_user_created"), color: ACTION_COLORS.user_created },
        { value: "user_deleted", label: t("audit.action_user_deleted"), color: ACTION_COLORS.user_deleted },
        { value: "roles_updated", label: t("audit.action_roles_updated"), color: ACTION_COLORS.roles_updated },
      ],
    },
  ], [t]);

  const [filters, setFilters] = useState<FilterState>(emptyFilterState(chips));

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !e.details.toLowerCase().includes(q) &&
          !e.performedBy.toLowerCase().includes(q) &&
          !(e.targetUser?.toLowerCase().includes(q))
        ) return false;
      }
      if (filters.chips.action && e.action !== filters.chips.action) return false;
      return true;
    });
  }, [entries, filters]);

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
      <main className="px-4 pt-20 pb-24">
        <h1 className="text-xl font-extrabold text-foreground mb-4">{t("audit.title")}</h1>

        <ListFilter
          chips={chips}
          value={filters}
          onChange={setFilters}
          resultCount={filtered.length}
          searchPlaceholder={t("audit.searchPlaceholder")}
        />

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Clock className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{t("audit.empty")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((entry) => {
              const Icon = ACTION_ICONS[entry.action] || RefreshCw;
              const color = ACTION_COLORS[entry.action] || "220 70% 55%";
              return (
                <div key={entry.id} className="rounded-xl border border-border bg-card p-3">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5"
                      style={{ backgroundColor: `hsl(${color} / 0.12)` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: `hsl(${color})` }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                          style={{
                            backgroundColor: `hsl(${color} / 0.12)`,
                            color: `hsl(${color})`,
                          }}
                        >
                          {t(`audit.action_${entry.action}`)}
                        </span>
                        <span className="shrink-0 text-[10px] text-muted-foreground">
                          {format(new Date(entry.timestamp), "dd/MM HH:mm:ss")}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-foreground leading-relaxed">{entry.details}</p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {t("audit.by")} <span className="font-semibold">{entry.performedBy}</span>
                        {entry.targetUser && (
                          <> → <span className="font-semibold">{entry.targetUser}</span></>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </PageTransition>
  );
};

export default AuditLog;
