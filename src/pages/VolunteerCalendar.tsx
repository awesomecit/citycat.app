import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useAuthStore } from "@/stores/authStore";
import { useVolunteerStore } from "@/stores/volunteerStore";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, CalendarDays } from "lucide-react";
import { format } from "date-fns";

const VolunteerCalendar = () => {
  const { t } = useTranslation();
  const { isLoggedIn } = useAuthStore();
  const { availability, toggleAvailability } = useVolunteerStore();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const availableDates = availability.filter((a) => a.available).map((a) => a.date);

  const handleDayClick = (day: Date | undefined) => {
    if (!day) return;
    setSelectedDate(day);
    const dateStr = format(day, "yyyy-MM-dd");
    toggleAvailability(dateStr);
  };

  const isAvailable = (day: Date) => {
    const dateStr = format(day, "yyyy-MM-dd");
    return availableDates.includes(dateStr);
  };

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        {isLoggedIn && <GlobalHeader title={t("volunteerCalendar.title")} />}
        <main className="flex-1 p-4">
          <p className="mb-3 text-sm text-muted-foreground text-center">
            {t("volunteerCalendar.hint")}
          </p>

          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDayClick}
              className="p-3 pointer-events-auto rounded-xl border border-border bg-card shadow-sm"
              modifiers={{ available: (day) => isAvailable(day) }}
              modifiersClassNames={{
                available: "!bg-primary/20 !text-primary font-bold",
              }}
            />
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-bold text-foreground mb-2">
              {t("volunteerCalendar.selectedDays")}
            </h3>
            {availableDates.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("volunteerCalendar.noDays")}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableDates.sort().map((date) => (
                  <Badge
                    key={date}
                    variant="secondary"
                    className="flex items-center gap-1 bg-primary/10 text-primary"
                  >
                    <CalendarDays className="h-3 w-3" />
                    {new Date(date + "T00:00:00").toLocaleDateString("it", {
                      day: "numeric",
                      month: "short",
                    })}
                    <button
                      onClick={() => toggleAvailability(date)}
                      className="ml-1 rounded-full hover:bg-primary/20"
                    >
                      <XCircle className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 rounded-xl border border-border bg-card p-3.5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">{t("volunteerCalendar.legend")}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-sm bg-primary/20" /> {t("volunteerCalendar.available")}
              </span>
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 rounded-sm bg-muted" /> {t("volunteerCalendar.unavailable")}
              </span>
            </div>
          </div>
        </main>
      </div>
      {isLoggedIn && <BottomNav />}
    </PageTransition>
  );
};

export default VolunteerCalendar;
