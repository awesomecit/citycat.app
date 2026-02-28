import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, Wand2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { ROLE_META, type UserRole } from "@/lib/roles";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import citycatLogo from "@/assets/citycat-logo.png";
import NotificationDrawer from "./NotificationDrawer";

interface GlobalHeaderProps {
  title?: string;
}

const GlobalHeader = ({ title }: GlobalHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, switchRole, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) return null;

  const roleMeta = ROLE_META[user.activeRole];
  const initials = user.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur-md">
        {/* Left: logo + title */}
        <div className="flex items-center gap-2.5">
          <img src={citycatLogo} alt="City Cat" className="h-8 w-8 rounded-lg object-contain" />
          <span className="text-base font-extrabold tracking-tight text-foreground">
            {title || t("app.title")}
          </span>
        </div>

        {/* Right: notification bell + avatar */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button
            onClick={() => setNotifOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-secondary"
            aria-label={t("nav.notifications")}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Avatar + role badge dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-full pl-0.5 pr-1 transition-colors hover:bg-secondary">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className="text-xs font-bold"
                      style={{
                        backgroundColor: `hsl(${roleMeta.color} / 0.15)`,
                        color: `hsl(${roleMeta.color})`,
                      }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Role emoji badge */}
                  <span
                    className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] leading-none shadow-sm"
                    style={{ backgroundColor: `hsl(${roleMeta.color})` }}
                  >
                    {roleMeta.emoji}
                  </span>
                </div>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span className="text-sm font-bold">{user.name}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Role switcher (only if multi-role) */}
              {user.roles.length > 1 && (
                <>
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    {t("header.switchRole")}
                  </DropdownMenuLabel>
                  {user.roles.map((role) => {
                    const meta = ROLE_META[role];
                    const isActive = role === user.activeRole;
                    return (
                      <DropdownMenuItem
                        key={role}
                        onClick={() => switchRole(role)}
                        className={isActive ? "font-bold" : ""}
                      >
                        <span className="mr-2">{meta.emoji}</span>
                        {t(meta.labelKey)}
                        {isActive && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-[10px]"
                            style={{
                              backgroundColor: `hsl(${meta.color} / 0.15)`,
                              color: `hsl(${meta.color})`,
                            }}
                          >
                            {t("header.active")}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem onClick={() => navigate("/profile")}>
                {t("header.profile")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                {t("nav.settings")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/setup")}>
                <Wand2 className="mr-2 h-4 w-4" />
                {t("setup.title")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/about")}>
                Funzionalità
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/pricing")}>
                Prezzi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/roadmap")}>
                Roadmap
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => { logout(); navigate("/"); }}
                className="text-destructive focus:text-destructive"
              >
                {t("comingSoon.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Notification drawer */}
      <NotificationDrawer open={notifOpen} onOpenChange={setNotifOpen} />
    </>
  );
};

export default GlobalHeader;
