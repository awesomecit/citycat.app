import { useState, useMemo, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";

export interface FilterChip {
  key: string;
  label: string;
  options: { value: string; label: string; color?: string }[];
}

export interface FilterState {
  search: string;
  chips: Record<string, string>; // chip key -> selected value ("" = all)
  advanced: Record<string, string>;
}

interface ListFilterProps {
  /** Quick-access chip filters shown below search */
  chips: FilterChip[];
  /** Advanced filters shown in drawer */
  advancedFilters?: FilterChip[];
  /** Current state */
  value: FilterState;
  /** State setter */
  onChange: (state: FilterState) => void;
  /** Result count to display */
  resultCount?: number;
  /** Search placeholder override */
  searchPlaceholder?: string;
}

export const emptyFilterState = (chips: FilterChip[], advanced: FilterChip[] = []): FilterState => ({
  search: "",
  chips: Object.fromEntries(chips.map((c) => [c.key, ""])),
  advanced: Object.fromEntries(advanced.map((c) => [c.key, ""])),
});

const ListFilter = ({
  chips,
  advancedFilters = [],
  value,
  onChange,
  resultCount,
  searchPlaceholder,
}: ListFilterProps) => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const activeAdvancedCount = useMemo(
    () => Object.values(value.advanced).filter(Boolean).length,
    [value.advanced]
  );

  const setChip = (key: string, val: string) =>
    onChange({ ...value, chips: { ...value.chips, [key]: val } });

  const setAdvanced = (key: string, val: string) =>
    onChange({ ...value, advanced: { ...value.advanced, [key]: val } });

  const clearAll = () =>
    onChange(emptyFilterState(chips, advancedFilters));

  const hasActiveFilters = value.search || Object.values(value.chips).some(Boolean) || activeAdvancedCount > 0;

  return (
    <>
      {/* Search bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          placeholder={searchPlaceholder || t("filters.search")}
          className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {hasActiveFilters && (
            <button onClick={clearAll} className="rounded-lg p-1 text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {advancedFilters.length > 0 && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative rounded-lg p-1 text-muted-foreground hover:text-foreground"
            >
              <SlidersHorizontal className="h-4 w-4" />
              {activeAdvancedCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                  {activeAdvancedCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Quick filter chips */}
      {chips.length > 0 && (
        <div className="mb-3 space-y-2">
          {chips.map((chip) => (
            <div key={chip.key} className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setChip(chip.key, "")}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  !value.chips[chip.key]
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {t("filters.all")}
              </button>
              {chip.options.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setChip(chip.key, value.chips[chip.key] === opt.value ? "" : opt.value)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                    value.chips[chip.key] === opt.value
                      ? "shadow-sm"
                      : "opacity-60 hover:opacity-90"
                  }`}
                  style={
                    opt.color
                      ? {
                          backgroundColor: `hsl(${opt.color} / ${value.chips[chip.key] === opt.value ? 0.2 : 0.08})`,
                          color: `hsl(${opt.color})`,
                        }
                      : value.chips[chip.key] === opt.value
                      ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                      : undefined
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Result count */}
      {resultCount !== undefined && (
        <p className="mb-2 text-[11px] font-medium text-muted-foreground">
          {resultCount} {t("filters.results")}
        </p>
      )}

      {/* Advanced filters drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{t("filters.advancedFilters")}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {advancedFilters.map((filter) => (
              <div key={filter.key}>
                <p className="text-xs font-bold text-foreground mb-2">{filter.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setAdvanced(filter.key, "")}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                      !value.advanced[filter.key]
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {t("filters.all")}
                  </button>
                  {filter.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAdvanced(filter.key, value.advanced[filter.key] === opt.value ? "" : opt.value)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                        value.advanced[filter.key] === opt.value
                          ? "shadow-sm"
                          : "opacity-60 hover:opacity-90"
                      }`}
                      style={
                        opt.color
                          ? {
                              backgroundColor: `hsl(${opt.color} / ${value.advanced[filter.key] === opt.value ? 0.2 : 0.08})`,
                              color: `hsl(${opt.color})`,
                            }
                          : value.advanced[filter.key] === opt.value
                          ? { backgroundColor: "hsl(var(--primary))", color: "hsl(var(--primary-foreground))" }
                          : undefined
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DrawerFooter>
            <button
              onClick={() => {
                onChange({ ...value, advanced: Object.fromEntries(advancedFilters.map((f) => [f.key, ""])) });
                setDrawerOpen(false);
              }}
              className="w-full rounded-xl bg-secondary py-2.5 text-sm font-bold text-foreground"
            >
              {t("filters.reset")}
            </button>
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-sm"
            >
              {t("filters.apply")}
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ListFilter;
