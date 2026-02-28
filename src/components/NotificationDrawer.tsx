import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCheck, Circle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNotificationStore, type AppNotification } from "@/stores/notificationStore";
import { formatDistanceToNow } from "date-fns";
import { it, enUS } from "date-fns/locale";
import { useTranslation as useI18n } from "react-i18next";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const typeColors: Record<AppNotification["type"], string> = {
  info: "text-primary",
  success: "text-green-500",
  warning: "text-amber-500",
  urgent: "text-destructive",
};

const NotificationDrawer = ({ open, onOpenChange }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllRead, unreadCount } = useNotificationStore();

  const locale = i18n.language === "it" ? it : enUS;

  const handleTap = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.targetPath) {
      onOpenChange(false);
      navigate(notif.targetPath);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-80 flex-col gap-0 p-0 sm:w-96">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-4 py-3">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            {t("notifications.title")}
          </SheetTitle>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              {t("notifications.markAllRead")}
            </button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Bell className="mb-3 h-10 w-10 opacity-30" />
              <p className="text-sm">{t("notifications.empty")}</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((notif) => (
                <li key={notif.id}>
                  <button
                    onClick={() => handleTap(notif)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/50 ${
                      !notif.read ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Unread dot */}
                    <div className="mt-1.5 flex-shrink-0">
                      {!notif.read ? (
                        <Circle className={`h-2.5 w-2.5 fill-current ${typeColors[notif.type]}`} />
                      ) : (
                        <div className="h-2.5 w-2.5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${!notif.read ? "font-bold text-foreground" : "font-medium text-foreground/80"}`}>
                        {notif.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {notif.body}
                      </p>
                      <p className="mt-1 text-[10px] text-muted-foreground/70">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale })}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationDrawer;
