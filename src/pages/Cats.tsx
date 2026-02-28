import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Cat, Heart, ChevronRight, Sparkles, Filter } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import ListFilter, { emptyFilterState, type FilterChip, type FilterState } from "@/components/ListFilter";
import { getCatPhoto } from "@/lib/catPhotos";
import { useEffect, useState, useMemo } from "react";
import { mockCats } from "@/api/mockData";
import type { CatProfile } from "@/api/types";

const Cats = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [tab, setTab] = useState<"mine" | "adoption">("mine");

  const chips: FilterChip[] = useMemo(() => [
    {
      key: "gender",
      label: t("cats.gender"),
      options: [
        { value: "male", label: t("cats.male") },
        { value: "female", label: t("cats.female") },
      ],
    },
  ], [t]);

  const advancedFilters: FilterChip[] = useMemo(() => [
    {
      key: "vaccinated",
      label: t("cats.vaccinated"),
      options: [
        { value: "true", label: t("cats.yes") },
        { value: "false", label: t("cats.no") },
      ],
    },
    {
      key: "breed",
      label: t("cats.breed"),
      options: [...new Set(mockCats.map((c) => c.breed))].map((b) => ({ value: b, label: b })),
    },
    {
      key: "ageRange",
      label: t("cats.ageRange"),
      options: [
        { value: "0-1", label: "0-1" },
        { value: "2-4", label: "2-4" },
        { value: "5-8", label: "5-8" },
        { value: "9+", label: "9+" },
      ],
    },
    {
      key: "compatibility",
      label: t("cats.compatibility"),
      options: [
        { value: "children", label: t("cats.compatChildren") },
        { value: "cats", label: t("cats.compatCats") },
        { value: "dogs", label: t("cats.compatDogs") },
        { value: "elderly", label: t("cats.compatElderly") },
      ],
    },
    {
      key: "personality",
      label: t("cats.personality"),
      options: [
        { value: "calm", label: t("cats.calm") },
        { value: "playful", label: t("cats.playful") },
        { value: "affectionate", label: t("cats.affectionate") },
        { value: "independent", label: t("cats.independent") },
      ],
    },
    {
      key: "urgency",
      label: t("cats.urgency"),
      options: [
        { value: "urgent", label: t("cats.urgentOnly") },
      ],
    },
  ], [t]);

  const [filters, setFilters] = useState<FilterState>(emptyFilterState(chips, advancedFilters));

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const myCats = mockCats.filter((c) => c.ownerId === "u1");
  const adoptionCats = mockCats.filter((c) => c.status === "adoption");
  const baseCats = tab === "mine" ? myCats : adoptionCats;

  const filtered = baseCats.filter((cat) => {
    if (filters.search && !cat.name.toLowerCase().includes(filters.search.toLowerCase()) && !cat.breed.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.chips.gender && cat.gender !== filters.chips.gender) return false;
    if (filters.advanced.vaccinated && String(cat.vaccinated) !== filters.advanced.vaccinated) return false;
    if (filters.advanced.breed && cat.breed !== filters.advanced.breed) return false;
    return true;
  });

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("cats.title")} />
        <div className="mx-auto w-full max-w-lg px-4 pt-4">
          <div className="flex rounded-xl bg-secondary p-1 mb-4">
            <button onClick={() => setTab("mine")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all ${tab === "mine" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Cat className="h-4 w-4" /> {t("cats.mine")} ({myCats.length})
            </button>
            <button onClick={() => setTab("adoption")} className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all ${tab === "adoption" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Heart className="h-4 w-4" /> {t("cats.adoption")} ({adoptionCats.length})
            </button>
          </div>

          <ListFilter
            chips={chips}
            advancedFilters={advancedFilters}
            value={filters}
            onChange={setFilters}
            resultCount={filtered.length}
            searchPlaceholder={t("filters.searchCats")}
          />
        </div>
        <div className="mx-auto w-full max-w-lg space-y-3 px-4">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t("cats.empty")}</p>
          ) : (
            filtered.map((cat) => <CatCard key={cat.id} cat={cat} onClick={() => navigate(`/cats/${cat.id}`)} />)
          )}
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

const CatCard = ({ cat, onClick }: { cat: CatProfile; onClick: () => void }) => {
  const { t } = useTranslation();
  const photo = getCatPhoto(cat.id);
  const isHeart = cat.heartAdoption?.isHeartAdoption === true;

  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3 text-left transition-colors hover:bg-secondary">
      {photo ? (
        <img src={photo} alt={cat.name} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
          {cat.name.slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-bold text-foreground">{cat.name}</p>
          {isHeart && (
            <span className="rounded-full bg-destructive/15 px-1.5 py-0.5 text-[10px] font-bold text-destructive">❤️</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{cat.breed} · {t("cats.age", { count: cat.age })}</p>
      </div>
      {cat.status === "adoption" && (
        <span className="shrink-0 rounded-full bg-accent/50 px-2 py-0.5 text-[10px] font-bold text-accent-foreground">{t("cats.adoptionBadge")}</span>
      )}
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </button>
  );
};

export default Cats;
