import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/stores/authStore";
import { useUsersStore } from "@/stores/usersStore";
import { useDelegationStore, type Affiliation } from "@/stores/delegationStore";
import { ROLES, ROLE_META, type UserRole } from "@/lib/roles";
import { DELEGABLE_PERMISSIONS, PERMISSION_META, type DelegablePermission } from "@/lib/permissions";
import type { MockUser } from "@/lib/mockUsers";
import { useToast } from "@/hooks/use-toast";
import GlobalHeader from "@/components/GlobalHeader";
import BottomNav from "@/components/BottomNav";
import PageTransition from "@/components/PageTransition";
import ListFilter, { emptyFilterState, type FilterChip, type FilterState } from "@/components/ListFilter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Shield, Pencil, Users, Handshake, UserPlus, Check, Mail } from "lucide-react";

const AdminUsers = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const currentUser = useAuthStore((s) => s.user);
  const { users, addUser, updateUserRoles, deleteUser } = useUsersStore();
  const { affiliations, invite, updatePermissions, removeAffiliation } = useDelegationStore();

  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<MockUser | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", roles: ["adopter"] as UserRole[] });
  const [tab, setTab] = useState<"users" | "delegations">("users");

  // Delegation state
  const [showInvite, setShowInvite] = useState(false);
  const [invEntityEmail, setInvEntityEmail] = useState("");
  const [invUserEmail, setInvUserEmail] = useState("");
  const [invPerms, setInvPerms] = useState<DelegablePermission[]>(["edit_cats"]);
  const [editAff, setEditAff] = useState<Affiliation | null>(null);
  const [editPerms, setEditPerms] = useState<DelegablePermission[]>([]);

  const isAdmin = currentUser?.activeRole === "admin";

  const chips: FilterChip[] = useMemo(() => [
    {
      key: "role",
      label: t("adminUsers.filterByRole"),
      options: ROLES.map((r) => ({
        value: r,
        label: t(ROLE_META[r].labelKey),
        color: ROLE_META[r].color,
      })),
    },
  ], [t]);

  const [filters, setFilters] = useState<FilterState>(emptyFilterState(chips));

  const resetForm = () => setForm({ name: "", email: "", password: "", roles: ["adopter"] });

  const handleCreate = () => {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
      return toast({ variant: "destructive", title: t("adminUsers.validationError"), description: t("adminUsers.validationErrorDesc") });
    }
    if (users.some((u) => u.email === form.email)) {
      return toast({ variant: "destructive", title: t("toast.registerErrorExists"), description: t("toast.registerErrorExistsDesc") });
    }
    addUser({ name: form.name, email: form.email, password: form.password, roles: form.roles, activeRole: form.roles[0] }, currentUser?.email || "admin");
    toast({ title: t("adminUsers.userCreated"), description: t("adminUsers.userCreatedDesc", { name: form.name }) });
    resetForm();
    setShowCreate(false);
  };

  const handleUpdateRoles = () => {
    if (!editUser || form.roles.length === 0) return;
    const activeRole = form.roles.includes(editUser.activeRole) ? editUser.activeRole : form.roles[0];
    updateUserRoles(editUser.email, form.roles, activeRole, currentUser?.email || "admin");
    toast({ title: t("adminUsers.rolesUpdated"), description: t("adminUsers.rolesUpdatedDesc", { name: editUser.name }) });
    setEditUser(null);
  };

  const handleDelete = (email: string, name: string) => {
    if (email === currentUser?.email) return;
    deleteUser(email, currentUser?.email || "admin");
    toast({ title: t("adminUsers.userDeleted"), description: t("adminUsers.userDeletedDesc", { name }) });
  };

  const toggleRole = (role: UserRole) => {
    setForm((f) => ({
      ...f,
      roles: f.roles.includes(role) ? f.roles.filter((r) => r !== role) : [...f.roles, role],
    }));
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false;
      }
      if (filters.chips.role && !u.roles.includes(filters.chips.role as UserRole)) return false;
      return true;
    });
  }, [users, filters]);

  if (!isAdmin) {
    return (
      <PageTransition>
        <GlobalHeader />
        <main className="px-4 pt-20 pb-24 text-center">
          <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">{t("adminUsers.noAccess")}</p>
        </main>
        <BottomNav />
      </PageTransition>
    );
  }

  const toggleInvPerm = (p: DelegablePermission) =>
    setInvPerms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const toggleEditPerm = (p: DelegablePermission) =>
    setEditPerms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const entities = users.filter((u) => u.roles.some((r) => r === "shelter" || r === "municipality"));

  const handleAdminInvite = () => {
    const entity = users.find((u) => u.email === invEntityEmail);
    const target = users.find((u) => u.email === invUserEmail);
    if (!entity || !target) return;
    invite({
      userEmail: target.email,
      userName: target.name,
      entityEmail: entity.email,
      entityName: entity.name,
      permissions: invPerms,
    });
    toast({ title: t("delegation.inviteSent"), description: t("delegation.inviteSentDesc", { name: target.name }) });
    setShowInvite(false);
    setInvEntityEmail("");
    setInvUserEmail("");
    setInvPerms(["edit_cats"]);
  };

  const handleAdminSavePerms = () => {
    if (!editAff) return;
    updatePermissions(editAff.id, editPerms);
    toast({ title: t("delegation.permsUpdated") });
    setEditAff(null);
  };

  return (
    <PageTransition>
      <GlobalHeader />
      <main className="px-4 pt-20 pb-24">
        {/* Tabs */}
        <div className="flex rounded-xl bg-secondary p-1 mb-4">
          <button onClick={() => setTab("users")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all ${tab === "users" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            <Users className="h-4 w-4" /> {t("adminUsers.title")}
          </button>
          <button onClick={() => setTab("delegations")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-bold transition-all ${tab === "delegations" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
            <Handshake className="h-4 w-4" /> {t("delegation.title")} ({affiliations.length})
          </button>
        </div>

        {tab === "users" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-extrabold text-foreground">{t("adminUsers.title")}</h1>
              <button
                onClick={() => { resetForm(); setShowCreate(true); }}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm"
              >
                <Plus className="h-4 w-4" /> {t("adminUsers.addUser")}
              </button>
            </div>

            <ListFilter
              chips={chips}
              value={filters}
              onChange={setFilters}
              resultCount={filtered.length}
              searchPlaceholder={t("filters.searchUsers")}
            />

            <div className="space-y-2">
              {filtered.map((u) => {
                const meta = ROLE_META[u.activeRole];
                return (
                  <div key={u.email} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
                      style={{ backgroundColor: `hsl(${meta.color} / 0.15)` }}
                    >
                      {meta.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-foreground">{u.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <Badge
                            key={r}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                            style={{
                              backgroundColor: `hsl(${ROLE_META[r].color} / 0.15)`,
                              color: `hsl(${ROLE_META[r].color})`,
                            }}
                          >
                            {t(ROLE_META[r].labelKey)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditUser(u);
                          setForm({ ...form, roles: [...u.roles] });
                        }}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {u.email !== currentUser?.email && (
                        <button
                          onClick={() => handleDelete(u.email, u.name)}
                          className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === "delegations" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-extrabold text-foreground">{t("delegation.title")}</h1>
              <button
                onClick={() => setShowInvite(true)}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-sm"
              >
                <UserPlus className="h-4 w-4" /> {t("delegation.inviteUser")}
              </button>
            </div>

            {affiliations.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{t("delegation.noAffiliations")}</p>
            ) : (
              <div className="space-y-2">
                {affiliations.map((aff) => (
                  <div key={aff.id} className="rounded-2xl border border-border bg-card p-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-extrabold text-primary">
                        {aff.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-foreground truncate">{aff.userName}</p>
                        <p className="text-[10px] text-muted-foreground truncate">
                          → {aff.entityName}
                        </p>
                      </div>
                      <Badge variant="secondary" className={`text-[10px] ${
                        aff.status === "accepted" ? "bg-primary/10 text-primary" :
                        aff.status === "pending" ? "bg-accent text-accent-foreground" :
                        "bg-destructive/10 text-destructive"
                      }`}>
                        {t(`delegation.status_${aff.status}`)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {aff.permissions.map((p) => (
                        <span key={p} className="rounded-lg bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground">
                          {PERMISSION_META[p].emoji} {t(PERMISSION_META[p].labelKey)}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditAff(aff); setEditPerms([...aff.permissions]); }}
                        className="flex-1 rounded-xl border border-input py-1.5 text-xs font-bold text-foreground hover:bg-secondary"
                      >
                        <Pencil className="inline h-3 w-3 mr-1" /> {t("delegation.editPerms")}
                      </button>
                      <button
                        onClick={() => { removeAffiliation(aff.id); toast({ title: t("delegation.removed") }); }}
                        className="rounded-xl border border-destructive/30 px-3 py-1.5 text-xs font-bold text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <BottomNav />

      {/* Create user dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("adminUsers.createUser")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <input type="text" placeholder={t("auth.name")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-input bg-card py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="email" placeholder={t("auth.email")} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-input bg-card py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <input type="password" placeholder={t("auth.password")} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-input bg-card py-2.5 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            <div>
              <p className="text-xs font-bold text-foreground mb-2">{t("adminUsers.assignRoles")}</p>
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((r) => (
                  <button key={r} onClick={() => toggleRole(r)} className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${form.roles.includes(r) ? "shadow-sm" : "opacity-40 hover:opacity-70"}`} style={{ backgroundColor: `hsl(${ROLE_META[r].color} / ${form.roles.includes(r) ? 0.2 : 0.08})`, color: `hsl(${ROLE_META[r].color})` }}>
                    {ROLE_META[r].emoji} {t(ROLE_META[r].labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowCreate(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary">{t("settings.cancel")}</button>
            <button onClick={handleCreate} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm">{t("adminUsers.create")}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit roles dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("adminUsers.editRoles")} — {editUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-1.5">
            {ROLES.map((r) => (
              <button key={r} onClick={() => toggleRole(r)} className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${form.roles.includes(r) ? "shadow-sm" : "opacity-40 hover:opacity-70"}`} style={{ backgroundColor: `hsl(${ROLE_META[r].color} / ${form.roles.includes(r) ? 0.2 : 0.08})`, color: `hsl(${ROLE_META[r].color})` }}>
                {ROLE_META[r].emoji} {t(ROLE_META[r].labelKey)}
              </button>
            ))}
          </div>
          <DialogFooter>
            <button onClick={() => setEditUser(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary">{t("settings.cancel")}</button>
            <button onClick={handleUpdateRoles} disabled={form.roles.length === 0} className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm disabled:opacity-50">{t("settings.save")}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admin invite dialog */}
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("delegation.inviteUser")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {/* Select entity */}
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">{t("adminUsers.selectEntity")}</label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {entities.map((e) => (
                  <button key={e.email} onClick={() => setInvEntityEmail(e.email)}
                    className={`flex w-full items-center gap-2 rounded-xl border p-2 text-left transition-colors ${invEntityEmail === e.email ? "border-primary bg-primary/5" : "border-input hover:bg-secondary"}`}>
                    <span className="flex-1 text-sm font-semibold text-foreground truncate">{e.name}</span>
                    {invEntityEmail === e.email && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Select user */}
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">{t("delegation.selectUser")}</label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {users.filter((u) => u.email !== invEntityEmail).map((u) => (
                  <button key={u.email} onClick={() => setInvUserEmail(u.email)}
                    className={`flex w-full items-center gap-2 rounded-xl border p-2 text-left transition-colors ${invUserEmail === u.email ? "border-primary bg-primary/5" : "border-input hover:bg-secondary"}`}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    {invUserEmail === u.email && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="text-xs font-bold text-foreground mb-1 block">{t("delegation.assignPerms")}</label>
              <div className="flex flex-wrap gap-1.5">
                {DELEGABLE_PERMISSIONS.map((p) => (
                  <button key={p} onClick={() => toggleInvPerm(p)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${invPerms.includes(p) ? "bg-primary/15 text-primary shadow-sm" : "bg-muted text-muted-foreground opacity-50 hover:opacity-70"}`}>
                    {PERMISSION_META[p].emoji} {t(PERMISSION_META[p].labelKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setShowInvite(false)} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary">{t("settings.cancel")}</button>
            <button onClick={handleAdminInvite} disabled={!invEntityEmail || !invUserEmail || invPerms.length === 0}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm disabled:opacity-50">
              <Mail className="inline h-3.5 w-3.5 mr-1" /> {t("delegation.sendInvite")}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit affiliation permissions dialog */}
      <Dialog open={!!editAff} onOpenChange={(o) => !o && setEditAff(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("delegation.editPerms")} — {editAff?.userName}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-wrap gap-1.5">
            {DELEGABLE_PERMISSIONS.map((p) => (
              <button key={p} onClick={() => toggleEditPerm(p)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${editPerms.includes(p) ? "bg-primary/15 text-primary shadow-sm" : "bg-muted text-muted-foreground opacity-50 hover:opacity-70"}`}>
                {PERMISSION_META[p].emoji} {t(PERMISSION_META[p].labelKey)}
              </button>
            ))}
          </div>
          <DialogFooter>
            <button onClick={() => setEditAff(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-secondary">{t("settings.cancel")}</button>
            <button onClick={handleAdminSavePerms} disabled={editPerms.length === 0}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm disabled:opacity-50">{t("settings.save")}</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default AdminUsers;
