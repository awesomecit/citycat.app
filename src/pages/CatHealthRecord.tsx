import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useHealthRecordStore, getUpcomingReminders } from "@/stores/healthRecordStore";
import { useShelterCatStore } from "@/stores/shelterCatStore";
import { mockCats } from "@/api/mockData";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { getCatPhoto } from "@/lib/catPhotos";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Syringe, Stethoscope, Scissors, Pill, FlaskConical, Bug,
  Bell, CalendarPlus, Clock, ChevronDown, ChevronUp, MapPin, Plus,
} from "lucide-react";
import { formatDistanceToNow, format, isPast, differenceInDays } from "date-fns";
import { it } from "date-fns/locale";
import type { HealthEventType } from "@/stores/healthRecordStore";

const typeIcons: Record<HealthEventType, React.ReactNode> = {
  vaccine: <Syringe className="h-4 w-4" />,
  checkup: <Stethoscope className="h-4 w-4" />,
  surgery: <Scissors className="h-4 w-4" />,
  treatment: <Pill className="h-4 w-4" />,
  labTest: <FlaskConical className="h-4 w-4" />,
  deworming: <Bug className="h-4 w-4" />,
  flea: <Bug className="h-4 w-4" />,
};

const typeColors: Record<HealthEventType, string> = {
  vaccine: "175 55% 40%",
  checkup: "220 70% 55%",
  surgery: "0 60% 50%",
  treatment: "270 55% 55%",
  labTest: "45 90% 50%",
  deworming: "25 85% 55%",
  flea: "142 60% 45%",
};

const CatHealthRecord = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuthStore();
  const { events, bookings, addBooking } = useHealthRecordStore();
  const { cats: shelterCats } = useShelterCatStore();
  const { toast } = useToast();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) navigate("/", { replace: true });
  }, [isLoggedIn, navigate]);

  const cat = shelterCats.find((c) => c.id === id) || mockCats.find((c) => c.id === id);
  if (!isLoggedIn || !cat) return null;

  const catEvents = events.filter((e) => e.catId === cat.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const reminders = getUpcomingReminders(events, [cat.id], 60);
  const catBookings = bookings.filter((b) => b.catId === cat.id && b.status !== "cancelled");
  const photo = getCatPhoto(cat.id);

  const handleQuickBook = (eventId: string, reason: string, clinic: string) => {
    const newBooking = {
      id: `vb-${Date.now()}`,
      catId: cat.id,
      healthEventId: eventId,
      vetClinic: clinic || "Clinica Veterinaria Roma Nord",
      date: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      time: "10:00",
      reason,
      status: "pending" as const,
    };
    addBooking(newBooking);
    setShowBooking(null);
    toast({ title: t("health.bookingConfirmed"), description: t("health.bookingDesc") });
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        <GlobalHeader title={t("health.title")} />
        <div className="mx-auto w-full max-w-lg space-y-4 p-4">
          {/* Cat header */}
          <div className="flex items-center gap-3">
            {photo ? (
              <img src={photo} alt={cat.name} className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-extrabold text-primary">
                {cat.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-foreground">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{cat.breed} · {t("cats.age", { count: cat.age })}</p>
            </div>
          </div>

          {/* Upcoming Reminders */}
          {reminders.length > 0 && (
            <section className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Bell className="h-4 w-4 text-destructive" /> {t("health.reminders")}
              </h3>
              {reminders.map((r) => {
                const dueDate = new Date(r.nextDueDate!);
                const daysLeft = differenceInDays(dueDate, new Date());
                const isOverdue = isPast(dueDate);
                const existingBooking = catBookings.find((b) => b.healthEventId === r.id);

                return (
                  <div
                    key={r.id}
                    className={`rounded-2xl border p-3 space-y-2 ${
                      isOverdue
                        ? "border-destructive/40 bg-destructive/5"
                        : daysLeft <= 7
                        ? "border-accent bg-accent/10"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-xl"
                          style={{ backgroundColor: `hsl(${typeColors[r.type]} / 0.15)`, color: `hsl(${typeColors[r.type]})` }}
                        >
                          {typeIcons[r.type]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{r.title}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {r.vetClinic && `${r.vetClinic} · `}
                            {isOverdue
                              ? t("health.overdue", { days: Math.abs(daysLeft) })
                              : t("health.dueIn", { days: daysLeft })}
                          </p>
                        </div>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isOverdue ? "bg-destructive/15 text-destructive" : "bg-primary/10 text-primary"
                      }`}>
                        {format(dueDate, "dd MMM", { locale: it })}
                      </span>
                    </div>

                    {existingBooking ? (
                      <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-2">
                        <CalendarPlus className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs text-primary font-semibold">
                          {t("health.booked")}: {format(new Date(existingBooking.date), "dd MMM", { locale: it })} {existingBooking.time}
                        </span>
                      </div>
                    ) : showBooking === r.id ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleQuickBook(r.id, r.title, r.vetClinic || "")}
                          className="w-full rounded-xl bg-primary py-2 text-xs font-bold text-primary-foreground transition-transform active:scale-[0.98]"
                        >
                          {t("health.confirmBooking")} — {r.vetClinic || "Clinica Veterinaria"}
                        </button>
                        <button
                          onClick={() => setShowBooking(null)}
                          className="w-full text-xs text-muted-foreground"
                        >
                          {t("health.cancel")}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowBooking(r.id)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 py-2 text-xs font-bold text-primary transition-colors hover:bg-primary/10"
                      >
                        <CalendarPlus className="h-3.5 w-3.5" />
                        {t("health.bookVet")}
                      </button>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {/* Upcoming Bookings */}
          {catBookings.length > 0 && (
            <section className="space-y-2">
              <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                <CalendarPlus className="h-4 w-4 text-primary" /> {t("health.appointments")}
              </h3>
              {catBookings.map((b) => (
                <div key={b.id} className="rounded-2xl border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">{b.reason}</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {b.vetClinic}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">{format(new Date(b.date), "dd MMM", { locale: it })}</p>
                      <p className="text-[10px] text-muted-foreground">{b.time}</p>
                    </div>
                  </div>
                  <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    b.status === "confirmed" ? "bg-primary/15 text-primary" : "bg-accent/50 text-accent-foreground"
                  }`}>
                    {t(`health.status_${b.status}`)}
                  </span>
                </div>
              ))}
            </section>
          )}

          {/* Event Timeline */}
          <section className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" /> {t("health.history")}
            </h3>
            {catEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">{t("health.noEvents")}</p>
            ) : (
              <div className="relative space-y-0">
                {catEvents.map((ev, i) => {
                  const isLast = i === catEvents.length - 1;
                  const isOpen = expanded === ev.id;
                  const color = typeColors[ev.type];

                  return (
                    <div key={ev.id} className="relative flex gap-3">
                      {/* Vertical line */}
                      {!isLast && (
                        <div className="absolute left-[15px] top-8 h-full w-0.5 bg-border" />
                      )}
                      {/* Icon circle */}
                      <div
                        className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `hsl(${color} / 0.15)`, color: `hsl(${color})` }}
                      >
                        {typeIcons[ev.type]}
                      </div>
                      {/* Content */}
                      <button
                        onClick={() => setExpanded(isOpen ? null : ev.id)}
                        className="mb-3 flex flex-1 flex-col rounded-xl p-3 text-left transition-colors hover:bg-secondary/50"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-sm font-bold text-foreground">{ev.title}</span>
                          {isOpen ? <ChevronUp className="h-3 w-3 text-muted-foreground" /> : <ChevronDown className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(ev.date), "dd MMMM yyyy", { locale: it })}
                          {ev.vetName && ` · ${ev.vetName}`}
                        </span>

                        {isOpen && (
                          <div className="mt-2 space-y-1.5 border-t border-border pt-2">
                            {ev.description && <p className="text-xs text-foreground">{ev.description}</p>}
                            {ev.vetClinic && (
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {ev.vetClinic}
                              </p>
                            )}
                            {ev.cost != null && (
                              <p className="text-[10px] text-muted-foreground">💰 €{ev.cost}</p>
                            )}
                            {ev.notes && (
                              <p className="text-[10px] text-muted-foreground italic">📝 {ev.notes}</p>
                            )}
                            {ev.nextDueDate && (
                              <p className="text-[10px] font-semibold text-primary">
                                🔔 {t("health.nextDue")}: {format(new Date(ev.nextDueDate), "dd MMM yyyy", { locale: it })}
                              </p>
                            )}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
      <BottomNav />
    </PageTransition>
  );
};

export default CatHealthRecord;
