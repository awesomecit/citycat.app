import { useTranslation } from "react-i18next";
import { Check, Circle, Loader2 } from "lucide-react";
import type { RoutineStep } from "@/stores/adoptionStore";
import { formatDistanceToNow } from "date-fns";
import { it, enUS } from "date-fns/locale";

interface RoutineLineProps {
  steps: RoutineStep[];
  onStepClick?: (step: RoutineStep) => void;
}

const statusIcons = {
  done: <Check className="h-4 w-4 text-primary-foreground" />,
  inProgress: <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />,
  pending: <Circle className="h-3 w-3 text-muted-foreground" />,
};

const RoutineLine = ({ steps, onStepClick }: RoutineLineProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "it" ? it : enUS;

  return (
    <div className="relative space-y-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const isDone = step.status === "done";
        const isActive = step.status === "inProgress";

        return (
          <div key={step.id} className="relative flex gap-3">
            {/* Vertical line */}
            {!isLast && (
              <div
                className={`absolute left-[15px] top-8 h-full w-0.5 ${
                  isDone ? "bg-primary" : "bg-border"
                }`}
              />
            )}

            {/* Status circle */}
            <div
              className={`relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                isDone
                  ? "bg-primary"
                  : isActive
                  ? "bg-primary shadow-md shadow-primary/30"
                  : "border-2 border-border bg-card"
              }`}
            >
              {statusIcons[step.status]}
            </div>

            {/* Content */}
            <button
              onClick={() => onStepClick?.(step)}
              disabled={step.status === "pending"}
              className={`mb-4 flex flex-1 flex-col rounded-xl p-3 text-left transition-colors ${
                isActive
                  ? "border border-primary/20 bg-primary/5"
                  : "hover:bg-secondary/50"
              }`}
            >
              <span
                className={`text-sm font-bold ${
                  isDone ? "text-foreground" : isActive ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {t(step.title)}
              </span>
              <span className="mt-0.5 text-[10px] text-muted-foreground">
                {t(step.roleKey)}
                {step.completedAt && (
                  <>
                    {" · "}
                    {formatDistanceToNow(new Date(step.completedAt), { addSuffix: true, locale })}
                  </>
                )}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default RoutineLine;
