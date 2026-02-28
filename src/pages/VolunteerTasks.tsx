import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useMotionValue, useTransform, animate, PanInfo } from "framer-motion";
import { CheckCircle2, Clock, Circle, Cat, Building2 } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useAuthStore } from "@/stores/authStore";
import { useVolunteerStore, type TaskStatus, type VolunteerTask } from "@/stores/volunteerStore";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-primary/10 text-primary",
  low: "bg-muted text-muted-foreground",
};

const STATUS_ORDER: TaskStatus[] = ["todo", "inProgress", "done"];

const SwipeableTaskCard = ({
  task,
  onSwipeLeft,
  onSwipeRight,
}: {
  task: VolunteerTask;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) => {
  const { t } = useTranslation();
  const x = useMotionValue(0);
  const bgLeft = useTransform(x, [-120, 0], [1, 0]);
  const bgRight = useTransform(x, [0, 120], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -80) {
      animate(x, -300, { duration: 0.2 });
      setTimeout(onSwipeLeft, 200);
    } else if (info.offset.x > 80) {
      animate(x, 300, { duration: 0.2 });
      setTimeout(onSwipeRight, 200);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  const statusIdx = STATUS_ORDER.indexOf(task.status);

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background layers */}
      {statusIdx > 0 && (
        <motion.div
          style={{ opacity: bgRight }}
          className="absolute inset-0 flex items-center justify-start bg-accent px-4 rounded-xl"
        >
          <span className="text-xs font-bold text-accent-foreground">
            ← {t(`volunteerTasks.status_${STATUS_ORDER[statusIdx - 1]}`)}
          </span>
        </motion.div>
      )}
      {statusIdx < 2 && (
        <motion.div
          style={{ opacity: bgLeft }}
          className="absolute inset-0 flex items-center justify-end bg-primary/15 px-4 rounded-xl"
        >
          <span className="text-xs font-bold text-primary">
            {t(`volunteerTasks.status_${STATUS_ORDER[statusIdx + 1]}`)} →
          </span>
        </motion.div>
      )}

      <motion.div
        style={{ x }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        onDragEnd={handleDragEnd}
        className="relative z-10 rounded-xl border border-border bg-card p-3.5 shadow-sm cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground">{t(task.title)}</p>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{t(task.description)}</p>
          </div>
          <Badge className={`shrink-0 text-[10px] ${PRIORITY_COLORS[task.priority]}`}>
            {t(`volunteerTasks.priority_${task.priority}`)}
          </Badge>
        </div>

        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
          {task.catName && (
            <span className="flex items-center gap-1">
              <Cat className="h-3 w-3" /> {task.catName}
            </span>
          )}
          {task.shelterName && (
            <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" /> {task.shelterName}
            </span>
          )}
          {task.dueDate && (
            <span className="ml-auto flex items-center gap-1">
              <Clock className="h-3 w-3" /> {new Date(task.dueDate).toLocaleDateString("it")}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const VolunteerTasks = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuthStore();
  const { tasks, updateTaskStatus } = useVolunteerStore();
  const [tab, setTab] = useState<TaskStatus>("todo");

  const movePrev = (task: VolunteerTask) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    if (idx > 0) updateTaskStatus(task.id, STATUS_ORDER[idx - 1]);
  };

  const moveNext = (task: VolunteerTask) => {
    const idx = STATUS_ORDER.indexOf(task.status);
    if (idx < 2) updateTaskStatus(task.id, STATUS_ORDER[idx + 1]);
  };

  const filtered = tasks.filter((t) => t.status === tab);

  const StatusIcon = tab === "done" ? CheckCircle2 : tab === "inProgress" ? Clock : Circle;

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        {isLoggedIn && <GlobalHeader title={t("volunteerTasks.title")} />}
        <main className="flex-1 p-4">
          <Tabs value={tab} onValueChange={(v) => setTab(v as TaskStatus)}>
            <TabsList className="w-full">
              <TabsTrigger value="todo" className="flex-1 text-xs">
                <Circle className="mr-1 h-3 w-3" /> {t("volunteerTasks.status_todo")} ({tasks.filter(t => t.status === "todo").length})
              </TabsTrigger>
              <TabsTrigger value="inProgress" className="flex-1 text-xs">
                <Clock className="mr-1 h-3 w-3" /> {t("volunteerTasks.status_inProgress")} ({tasks.filter(t => t.status === "inProgress").length})
              </TabsTrigger>
              <TabsTrigger value="done" className="flex-1 text-xs">
                <CheckCircle2 className="mr-1 h-3 w-3" /> {t("volunteerTasks.status_done")} ({tasks.filter(t => t.status === "done").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <p className="mt-3 mb-2 text-[11px] text-muted-foreground text-center">
            {t("volunteerTasks.swipeHint")}
          </p>

          <div className="mt-1 flex flex-col gap-2.5">
            {filtered.length === 0 ? (
              <div className="mt-10 flex flex-col items-center text-muted-foreground">
                <StatusIcon className="h-8 w-8 mb-2" />
                <p className="text-sm">{t("volunteerTasks.empty")}</p>
              </div>
            ) : (
              filtered.map((task) => (
                <SwipeableTaskCard
                  key={task.id}
                  task={task}
                  onSwipeLeft={() => moveNext(task)}
                  onSwipeRight={() => movePrev(task)}
                />
              ))
            )}
          </div>
        </main>
      </div>
      {isLoggedIn && <BottomNav />}
    </PageTransition>
  );
};

export default VolunteerTasks;
