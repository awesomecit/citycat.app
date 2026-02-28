import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAdoptionStore } from "@/stores/adoptionStore";
import { mockCats } from "@/api/mockData";
import { getCatPhoto } from "@/lib/catPhotos";
import PageTransition from "@/components/PageTransition";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import RoutineLine from "@/components/RoutineLine";
import ListFilter, { emptyFilterState, type FilterChip, type FilterState } from "@/components/ListFilter";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";
import { ChevronRight, Clock, FileCheck } from "lucide-react";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  submitted: "bg-amber-100 text-amber-800",
  reviewing: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-primary/10 text-primary",
};

const MyAdoptions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const { applications, routineSteps } = useAdoptionStore();

  const chips: FilterChip[] = useMemo(() => [
    {
      key: "status",
      label: t("filters.status"),
      options: ["submitted", "reviewing", "approved", "rejected", "completed"].map((s) => ({
        value: s,
        label: t(`adoption.status_${s}`),
      })),
    },
  ], [t]);

  const [filters, setFilters] = useState<FilterState>(emptyFilterState(chips));

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!user) return null;

  const myApps = applications.filter((a) => a.applicantEmail === user.email);
  const filtered = myApps.filter((a) => {
    if (filters.search) {
      const cat = mockCats.find((c) => c.id === a.catId);
      const q = filters.search.toLowerCase();
      if (!cat?.name.toLowerCase().includes(q) && !a.applicantName.toLowerCase().includes(q)) return false;
    }
    if (filters.chips.status && a.status !== filters.chips.status) return false;
    return true;
  });

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("adoption.myAdoptionsTitle")} />

        <div className="mx-auto w-full max-w-lg p-4">
          {myApps.length > 0 && (
            <ListFilter
              chips={chips}
              value={filters}
              onChange={setFilters}
              resultCount={filtered.length}
              searchPlaceholder={t("filters.searchAdoptions")}
            />
          )}

          <div className="space-y-4">
            {filtered.length === 0 && myApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FileCheck className="mb-3 h-12 w-12 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">{t("adoption.noApplications")}</p>
                <button onClick={() => navigate("/cats")} className="mt-4 text-sm font-bold text-primary">
                  {t("adoption.exploreCats")}
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("cats.empty")}</p>
            ) : (
              filtered.map((app) => {
                const cat = mockCats.find((c) => c.id === app.catId);
                const photo = getCatPhoto(app.catId);
                const steps = routineSteps[app.id] || [];

                return (
                  <div key={app.id} className="rounded-2xl border border-border bg-card">
                    <div className="flex items-center gap-3 border-b border-border p-3">
                      {photo ? (
                        <img src={photo} alt={cat?.name} className="h-12 w-12 rounded-xl object-cover" />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                          {cat?.name.slice(0, 2)}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-bold text-foreground">{cat?.name}</p>
                        <p className="text-xs text-muted-foreground">{cat?.breed}</p>
                      </div>
                      <Badge className={`text-[10px] ${statusColors[app.status]}`}>
                        {t(`adoption.status_${app.status}`)}
                      </Badge>
                    </div>
                    {steps.length > 0 && (
                      <div className="p-3">
                        <RoutineLine steps={steps} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default MyAdoptions;
