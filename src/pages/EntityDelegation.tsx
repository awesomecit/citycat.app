import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useDelegationStore, type Affiliation } from "@/stores/delegationStore";
import { useUsersStore } from "@/stores/usersStore";
import { DELEGABLE_PERMISSIONS, PERMISSION_META, type DelegablePermission } from "@/lib/permissions";
import PageTransition from "@/components/PageTransition";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, UserPlus, Check, X, Shield, ChevronDown, Mail } from "lucide-react";

const EntityDelegation = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);
  const { affiliations, invite, updatePermissions, removeAffiliation } = useDelegationStore();
  const { users } = useUsersStore();

  const [showInvite, setShowInvite] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<DelegablePermission[]>(["edit_cats"]);
  const [editAff, setEditAff] = useState<Affiliation | null>(null);
  const [editPerms, setEditPerms] = useState<DelegablePermission[]>([]);

  const isEntity = user?.activeRole === "shelter" || user?.activeRole === "municipality" || user?.activeRole === "admin";

  // Affiliations for this entity
  const myAffiliations = useMemo(() =>
    user ? affiliations.filter((a) => a.entityEmail === user.email) : [],
    [affiliations, user]
  );

  // Users that can be invited (not already affiliated)
  const affiliatedEmails = new Set(myAffiliations.map((a) => a.userEmail));
  const invitableUsers = users.filter(
    (u) => user && u.email !== user.email && !affiliatedEmails.has(u.email)
  );

  if (!user) return null;

  const togglePerm = (perm: DelegablePermission, list: DelegablePermission[], setter: (p: DelegablePermission[]) => void) => {
    setter(list.includes(perm) ? list.filter((p) => p !== perm) : [...list, perm]);
  };

  const handleInvite = () => {
    if (!selectedEmail) return;
    const target = users.find((u) => u.email === selectedEmail);
    if (!target) return;

    invite({
      userEmail: target.email,
      userName: target.name,
      entityEmail: user.email,
      entityName: user.name,
      permissions: selectedPerms,
    });

    toast({
      title: t("delegation.inviteSent"),
      description: t("delegation.inviteSentDesc", { name: target.name }),
    });
    setShowInvite(false);
    setSelectedEmail("");
    setSelectedPerms(["edit_cats"]);
  };

  const handleSavePerms = () => {
    if (!editAff) return;
    updatePermissions(editAff.id, editPerms);
    toast({ title: t("delegation.permsUpdated") });
    setEditAff(null);
  };

  const handleRemove = (aff: Affiliation) => {
    removeAffiliation(aff.id);
    toast({
      title: t("delegation.removed"),
      description: t("delegation.removedDesc", { name: aff.userName }),
    });
  };

  const statusBadge = (status: Affiliation["status"]) => {
    switch (status) {
      case "accepted": return "bg-primary/10 text-primary";
      case "pending": return "bg-accent text-accent-foreground";
      case "rejected": return "bg-destructive/10 text-destructive";
    }
  };

  if (!isEntity) {
    return (
      <PageTransition>
        <GlobalHeader />
        <main className="px-4 pt-20 pb-24 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("delegation.noAccess")}</p>
        </main>
        <BottomNav />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <GlobalHeader title={t("delegation.title")} />
      <main className="px-4 pt-20 pb-24 max-w-lg mx-auto space-y-4">
        {/* Invite button */}
        <button
          onClick={() => setShowInvite(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" /> {t("delegation.inviteUser")}
        </button>

        {/* Current affiliations */}
        {myAffiliations.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t("delegation.noAffiliations")}</p>
        ) : (
          myAffiliations.map((aff) => (
            <div key={aff.id} className="rounded-2xl border border-border bg-card p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                  {aff.userName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground truncate">{aff.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{aff.userEmail}</p>
                </div>
                <Badge variant="secondary" className={`text-[10px] ${statusBadge(aff.status)}`}>
                  {t(`delegation.status_${aff.status}`)}
                </Badge>
              </div>

              {/* Permissions */}
              <div className="flex flex-wrap gap-1.5">
                {aff.permissions.map((p) => (
                  <span
                    key={p}
                    className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground"
                  >
                    {PERMISSION_META[p].emoji} {t(PERMISSION_META[p].labelKey)}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditAff(aff); setEditPerms([...aff.permissions]); }}
                  className="flex-1 rounded-xl border border-input py-2 text-xs font-bold text-foreground hover:bg-secondary"
                >
                  {t("delegation.editPerms")}
                </button>
                <button
                  onClick={() => handleRemove(aff)}
                  className="rounded-xl border border-destructive/30 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </main>
      <BottomNav />

      {/* Invite dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("delegation.inviteUser")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">{t("delegation.selectUser")}</label>
              {invitableUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("delegation.noUsersAvailable")}</p>
              ) : (
                <div className="max-h-40 overflow-y-auto space-y-1.5">
                  {invitableUsers.map((u) => (
                    <button
                      key={u.email}
                      onClick={() => setSelectedEmail(u.email)}
                      className={`flex w-full items-center gap-2 rounded-xl border p-2.5 text-left transition-colors ${
                        selectedEmail === u.email ? "border-primary bg-primary/5" : "border-input hover:bg-secondary"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                      {selectedEmail === u.email && <Check className="h-4 w-4 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">{t("delegation.assignPerms")}</label>
              <div className="flex flex-wrap gap-1.5">
                {DELEGABLE_PERMISSIONS.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePerm(p, selectedPerms, setSelectedPerms)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      selectedPerms.includes(p) ? "bg-primary/15 text-primary shadow-sm" : "bg-muted text-muted-foreground opacity-50 hover:opacity-70"
                    }`}
                  >
                    {PERMISSION_META[p].emoji} {t(PERMISSION_META[p].labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowInvite(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary">
              {t("settings.cancel")}
            </button>
            <button onClick={handleInvite} disabled={!selectedEmail || selectedPerms.length === 0}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm disabled:opacity-50">
              <Mail className="inline h-3.5 w-3.5 mr-1" /> {t("delegation.sendInvite")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit permissions dialog */}
      <Dialog open={!!editAff} onOpenChange={(o) => !o && setEditAff(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("delegation.editPerms")} — {editAff?.userName}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-1.5">
            {DELEGABLE_PERMISSIONS.map((p) => (
              <button
                key={p}
                onClick={() => togglePerm(p, editPerms, setEditPerms)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  editPerms.includes(p) ? "bg-primary/15 text-primary shadow-sm" : "bg-muted text-muted-foreground opacity-50 hover:opacity-70"
                }`}
              >
                {PERMISSION_META[p].emoji} {t(PERMISSION_META[p].labelKey)}
              </button>
            ))}
          </div>
          <DialogFooter>
            <button onClick={() => setEditAff(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary">
              {t("settings.cancel")}
            </button>
            <button onClick={handleSavePerms} disabled={editPerms.length === 0}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm disabled:opacity-50">
              {t("settings.save")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default EntityDelegation;
