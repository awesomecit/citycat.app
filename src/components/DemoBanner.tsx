import { isDemoMode } from "@/api/client";
import { useTranslation } from "react-i18next";
import { FlaskConical } from "lucide-react";

const DemoBanner = () => {
  const { t } = useTranslation();

  if (!isDemoMode()) return null;

  return (
    <div className="fixed bottom-14 left-2 z-30 flex items-center gap-1 rounded-full bg-amber-500/80 px-2 py-0.5 text-[9px] font-bold text-amber-950 backdrop-blur-sm">
      <FlaskConical className="h-2.5 w-2.5" />
      DEMO
    </div>
  );
};

export default DemoBanner;
