import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Camera, CheckCircle2, Clock, Circle, ArrowRight, Send } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import BottomNav from "@/components/BottomNav";
import GlobalHeader from "@/components/GlobalHeader";
import { useAuthStore } from "@/stores/authStore";
import { useVolunteerStore, type RelayLeg } from "@/stores/volunteerStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_CONFIG = {
  pending: { icon: Circle, color: "text-muted-foreground", bg: "bg-muted" },
  confirmed: { icon: Clock, color: "text-primary", bg: "bg-primary/10" },
  completed: { icon: CheckCircle2, color: "text-accent-foreground", bg: "bg-accent" },
};

const RelayLegs = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const { relayLegs, confirmRelayLeg } = useVolunteerStore();
  const [confirmDialog, setConfirmDialog] = useState<RelayLeg | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [tab, setTab] = useState("all");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = () => {
    if (!confirmDialog || !photoPreview) return;
    confirmRelayLeg(confirmDialog.id, photoPreview, notes);
    toast({
      title: t("relayLegs.confirmedTitle"),
      description: t("relayLegs.confirmedDesc", { catName: confirmDialog.catName }),
    });
    setConfirmDialog(null);
    setPhotoPreview(null);
    setNotes("");
  };

  const filtered = tab === "all" ? relayLegs : relayLegs.filter((l) => l.status === tab);

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col bg-background pb-16">
        {isLoggedIn && <GlobalHeader title={t("relayLegs.title")} />}
        <main className="flex-1 p-4">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1 text-xs">{t("relayLegs.all")}</TabsTrigger>
              <TabsTrigger value="pending" className="flex-1 text-xs">{t("relayLegs.statusPending")}</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 text-xs">{t("relayLegs.statusCompleted")}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="mt-3 flex flex-col gap-3">
            {filtered.length === 0 ? (
              <div className="mt-10 flex flex-col items-center text-muted-foreground">
                <MapPin className="h-8 w-8 mb-2" />
                <p className="text-sm">{t("relayLegs.empty")}</p>
              </div>
            ) : (
              filtered.map((leg) => {
                const cfg = STATUS_CONFIG[leg.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={leg.id} className="rounded-xl border border-border bg-card p-3.5 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-foreground">🐱 {leg.catName}</span>
                          <Badge className={`text-[10px] ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon className="h-3 w-3 mr-0.5" />
                            {t(`relayLegs.status${leg.status.charAt(0).toUpperCase() + leg.status.slice(1)}`)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{leg.from}</span>
                          <ArrowRight className="h-3 w-3" />
                          <span>{leg.to}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {new Date(leg.date).toLocaleDateString("it", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>

                      {leg.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => setConfirmDialog(leg)}
                          className="shrink-0"
                        >
                          <Camera className="h-4 w-4 mr-1" />
                          {t("relayLegs.confirm")}
                        </Button>
                      )}
                    </div>

                    {leg.status === "completed" && leg.photoUrl && (
                      <div className="mt-2.5">
                        <img
                          src={leg.photoUrl}
                          alt={`${leg.catName} relay`}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        {leg.notes && (
                          <p className="mt-1.5 text-xs text-muted-foreground italic">"{leg.notes}"</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
      {isLoggedIn && <BottomNav />}

      {/* Confirm dialog with photo upload */}
      <Dialog open={!!confirmDialog} onOpenChange={() => { setConfirmDialog(null); setPhotoPreview(null); setNotes(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("relayLegs.confirmTitle")}</DialogTitle>
          </DialogHeader>
          {confirmDialog && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/50 p-3 text-sm">
                <p className="font-bold">🐱 {confirmDialog.catName}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {confirmDialog.from} → {confirmDialog.to}
                </p>
              </div>

              {/* Photo upload */}
              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">
                  {t("relayLegs.photo")} *
                </label>
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Preview" className="h-40 w-full rounded-lg object-cover" />
                    <button
                      onClick={() => setPhotoPreview(null)}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-background/80 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <Camera className="h-8 w-8 text-muted-foreground mb-1" />
                    <span className="text-xs text-muted-foreground">{t("relayLegs.uploadPhoto")}</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>

              <div>
                <label className="text-sm font-bold text-foreground block mb-1.5">
                  {t("relayLegs.notes")}
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("relayLegs.notesPlaceholder")}
                  className="resize-none"
                  rows={2}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleConfirm} disabled={!photoPreview} className="w-full">
              <Send className="h-4 w-4 mr-1" />
              {t("relayLegs.confirmSend")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default RelayLegs;
