import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronUp, X } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { ROLE_BOTTOM_NAV, ROLE_EXPANDED_GRID, ROLE_META } from "@/lib/roles";
import { useFilteredNav } from "@/hooks/useFeatureFlagNav";
import { AnimatePresence, motion } from "framer-motion";

const BottomNav = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  const [expanded, setExpanded] = useState(false);

  const role = user?.activeRole ?? "adopter";
  const rawNavItems = ROLE_BOTTOM_NAV[role];
  const rawGridItems = ROLE_EXPANDED_GRID[role];

  const navItems = useFilteredNav(role, rawNavItems);
  const gridItems = useFilteredNav(role, rawGridItems);

  if (!user) return null;

  const roleMeta = ROLE_META[role];

  const isActive = (path: string) =>
    pathname === path || (path !== "/" && pathname.startsWith(path));

  return (
    <>
      {/* Expanded grid overlay */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-[56px] z-50 rounded-t-2xl border-t border-border bg-card p-4 pb-2 shadow-xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t("nav.allSections")}
                </span>
                <button
                  onClick={() => setExpanded(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-secondary"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {gridItems.map(({ path, icon: Icon, labelKey }) => (
                  <button
                    key={path}
                    onClick={() => {
                      setExpanded(false);
                      navigate(path);
                    }}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2.5 text-[10px] font-bold transition-colors ${
                      isActive(path)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="line-clamp-1 text-center">{t(labelKey)}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Fixed bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center">
          {navItems.map(({ path, icon: Icon, labelKey }) => {
            const active = isActive(path);
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-bold transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
                {t(labelKey)}
              </button>
            );
          })}
          {gridItems.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2.5 text-[10px] font-bold transition-colors ${
                expanded ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <ChevronUp
                className={`h-5 w-5 transition-transform ${expanded ? "rotate-180" : ""}`}
              />
              {t("nav.more")}
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
