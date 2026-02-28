import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useHealthRecordStore, getUpcomingReminders } from "@/stores/healthRecordStore";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays, Syringe, Stethoscope, Pill, Bell, Gift,
  FileText, Video, ChevronLeft, ChevronRight,
} from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from "date-fns";
import { it } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: "vaccine" | "checkup" | "medication" | "anniversary" | "document" | "videocall";
  catName?: string;
}

const MOCK_EVENTS: CalendarEvent[] = [
  { id: "ce1", date: "2026-03-08", title: "Richiamo Trivalente RCP", type: "vaccine", catName: "Micio" },
  { id: "ce2", date: "2026-03-01", title: "Antiparassitario esterno", type: "medication", catName: "Micio" },
  { id: "ce3", date: "2026-03-15", title: "Visita controllo annuale", type: "checkup", catName: "Luna" },
  { id: "ce4", date: "2026-03-20", title: "Anniversario adozione 🎂", type: "anniversary", catName: "Micio" },
  { id: "ce5", date: "2026-03-10", title: "Scadenza microchip", type: "document", catName: "Luna" },
  { id: "ce6", date: "2026-03-12", title: "Video call Dr. Verdi", type: "videocall", catName: "Micio" },
  { id: "ce7", date: "2026-04-15", title: "Sverminazione", type: "medication", catName: "Micio" },
  { id: "ce8", date: "2026-02-25", title: "Farmaco giornaliero", type: "medication", catName: "Luna" },
  { id: "ce9", date: "2026-02-26", title: "Farmaco giornaliero", type: "medication", catName: "Luna" },
  { id: "ce10", date: "2026-02-27", title: "Farmaco giornaliero", type: "medication", catName: "Luna" },
];

const eventIcons: Record<string, React.ReactNode> = {
  vaccine: <Syringe className="h-3.5 w-3.5" />,
  checkup: <Stethoscope className="h-3.5 w-3.5" />,
  medication: <Pill className="h-3.5 w-3.5" />,
  anniversary: <Gift className="h-3.5 w-3.5" />,
  document: <FileText className="h-3.5 w-3.5" />,
  videocall: <Video className="h-3.5 w-3.5" />,
};

const eventColors: Record<string, string> = {
  vaccine: "175 55% 40%",
  checkup: "220 70% 55%",
  medication: "270 55% 55%",
  anniversary: "25 85% 55%",
  document: "45 90% 50%",
  videocall: "142 60% 45%",
};

const WEEKDAYS = ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"];

const PremiumCalendar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = (getDay(monthStart) + 6) % 7; // Monday-based

  const eventsForDate = (d: Date) =>
    MOCK_EVENTS.filter((e) => isSameDay(new Date(e.date), d));

  const selectedEvents = selectedDate ? eventsForDate(selectedDate) : [];
  const today = new Date();

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("premium.calendarTitle")} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Month nav */}
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="rounded-xl p-2 hover:bg-secondary">
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <p className="text-sm font-bold text-foreground capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: it })}
            </p>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="rounded-xl p-2 hover:bg-secondary">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Calendar grid */}
          <div className="rounded-2xl border border-border bg-card p-3">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}
              {days.map((day) => {
                const dayEvents = eventsForDate(day);
                const isToday = isSameDay(day, today);
                const isSelected = selectedDate && isSameDay(day, selectedDate);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={`relative flex h-10 flex-col items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : isToday
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {day.getDate()}
                    {dayEvents.length > 0 && (
                      <div className="absolute bottom-0.5 flex gap-0.5">
                        {dayEvents.slice(0, 3).map((e, i) => (
                          <div
                            key={i}
                            className="h-1 w-1 rounded-full"
                            style={{ backgroundColor: isSelected ? "currentColor" : `hsl(${eventColors[e.type]})` }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected day events */}
          {selectedDate && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <h3 className="text-sm font-bold text-foreground">
                {format(selectedDate, "EEEE d MMMM", { locale: it })}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="text-xs text-muted-foreground py-4 text-center">{t("premium.noEvents")}</p>
              ) : (
                selectedEvents.map((e) => (
                  <div key={e.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `hsl(${eventColors[e.type]} / 0.15)`, color: `hsl(${eventColors[e.type]})` }}
                    >
                      {eventIcons[e.type]}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-foreground">{e.title}</p>
                      {e.catName && <p className="text-[10px] text-muted-foreground">🐱 {e.catName}</p>}
                    </div>
                    {e.type === "videocall" && (
                      <button className="rounded-lg bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                        {t("premium.join")}
                      </button>
                    )}
                  </div>
                ))
              )}
            </motion.section>
          )}

          {/* Upcoming reminders summary */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Bell className="h-4 w-4 text-primary" /> {t("premium.upcomingReminders")}
            </h3>
            {MOCK_EVENTS.filter((e) => new Date(e.date) >= today).slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `hsl(${eventColors[e.type]} / 0.15)`, color: `hsl(${eventColors[e.type]})` }}
                >
                  {eventIcons[e.type]}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">{e.title}</p>
                  <p className="text-[10px] text-muted-foreground">{e.catName} · {format(new Date(e.date), "dd MMM", { locale: it })}</p>
                </div>
              </div>
            ))}
          </section>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default PremiumCalendar;
