import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Construction } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useAuthStore } from "@/stores/authStore";

const ComingSoon = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuthStore();

  // Extract a readable name from the path
  const sectionName = pathname.slice(1).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Section";

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        {isLoggedIn && <GlobalHeader title={sectionName} />}
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Construction className="h-7 w-7 text-muted-foreground" />
          </div>
          <h1 className="text-xl font-extrabold text-foreground">{sectionName}</h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {t("comingSoon.dashboardDesc")}
          </p>
          <span className="mt-4 inline-block rounded-full bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground">
            Coming Soon 🚀
          </span>
        </main>
      </div>
      {isLoggedIn && <BottomNav />}
    </PageTransition>
  );
};

export default ComingSoon;
