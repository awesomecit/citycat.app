# Piano di Rimozione Mock — City Cat App

> Documento di pianificazione tecnica. Data: 2026-02-28
> Prerequisito: esistenza di un backend REST compatibile (Fastify/Platformatic o altro)
> Riferimento: `docs/stato-arte-ui.md` per inventario completo

---

## Principi guida

- **Incrementale:** ogni fase ha una acceptance criteria verificabile
- **Senza rotture:** ogni step mantiene l'app funzionante (DEMO_MODE fallback garantisce)
- **Un dominio alla volta:** no big-bang, una categoria di dati per sprint
- **Gate espliciti:** nessuna fase inizia prima che la precedente sia green in staging

---

## Panoramica fasi

```
FASE 0  Setup: quality gates, package rename, .env     (no backend)
FASE 1  Auth: login reale, JWT, profilo utente          (sblocca tutto)
FASE 2  Catalogo gatti: CRUD gatti, shelter view        (dominio core)
FASE 3  Adozione: flusso completo adopter               (dominio core)
FASE 4  Volontariato: task, calendario, staffette       (dominio operativo)
FASE 5  Rifugio + Comune: dashboard operativa           (dominio operativo)
FASE 6  Admin: user management, audit, broadcast        (trasversale)
FASE 7  Feature avanzate: matching, mappa, missing cats (differenziante)
FASE 8  Premium: wallet, loyalty, shop, tier            (monetizzazione)
FASE 9  Pulizia finale: rimozione DEMO_MODE flag        (solo dopo FASE 8)
```

---

## Fase 0 — Setup qualità (nessun backend richiesto)

**Trigger:** Subito — questo documento è il trigger.

### Step 0.1 — Rinomina package

| Azione | File | Da | A |
|---|---|---|---|
| Rinomina | `package.json` | `vite_react_shadcn_ts` | `city-cat-app` |
| Rimuovi devDep | `package.json` | `lovable-tagger` | — |
| Pulisci import | `vite.config.ts` | import lovable-tagger | — |

### Step 0.2 — Git hooks (porta da manifesto)

Installare e configurare:
- `husky` — pre-commit, commit-msg, pre-push
- `commitlint` con `@commitlint/config-conventional`
- `lint-staged` — eslint --fix + prettier --write su `*.{ts,tsx}`
- **Valid scopes:** `auth | cats | adoption | volunteer | shelter | municipality | admin | premium | ui | config | docs`

### Step 0.3 — `.env` espliciti

Creare `.env.example`:
```dotenv
VITE_DEMO_MODE=true          # Mettere a false per chiamate API reali
VITE_API_BASE_URL=http://localhost:3042
```

**Acceptance criteria Fase 0:**
- [ ] `npm run build` completa senza errori
- [ ] `git commit --allow-empty -m "chore(config): test"` passa commitlint
- [ ] `package.json` name = `city-cat-app`
- [ ] `lovable-tagger` rimosso da devDependencies e da `vite.config.ts`
- [ ] `.env.example` committato (senza segreti)

---

## Fase 1 — Autenticazione reale (sblocca tutto)

**Trigger:** Backend espone `POST /auth/login`, `POST /auth/register`, `GET /auth/me`.
**Impatta:** tutti gli altri store dipendono dall'utente autenticato reale.

### Step 1.1 — Aggiungere endpoint auth a `src/api/index.ts`

```typescript
auth: {
  login: (email: string, password: string) =>
    apiRequest<{ token: string; user: UserProfile }>(
      { method: 'POST', url: '/auth/login', data: { email, password } },
      null
    ),
  me: () =>
    apiRequest<UserProfile>({ method: 'GET', url: '/auth/me' }, null),
  logout: () =>
    apiRequest<void>({ method: 'POST', url: '/auth/logout' }, undefined),
},
```

### Step 1.2 — Aggiornare `src/stores/authStore.ts`

- Rimuovere `import { findUser, MockUser } from '@/lib/mockUsers'`
- Sostituire `findUser(email, password)` con `await api.auth.login(email, password)`
- Il token va salvato in `authStore` (o cookie HttpOnly — decisione da ADR)
- `currentUser` diventa `UserProfile` da `api/types.ts` (non `MockUser`)
- Mantenere `VITE_DEMO_MODE=true` come fallback durante la transizione

### Step 1.3 — Aggiornare `src/pages/Index.tsx`

- Rimuovere ogni import diretto da `mockUsers.ts`
- Il login chiama `authStore.login()` che chiama `api.auth.login()`

### Step 1.4 — `src/lib/mockUsers.ts` marcato `@deprecated`

NON eliminare ancora — serve come fallback per le fasi successive.
Aggiungere commento:
```typescript
/** @deprecated — rimosso in Fase 1 Step 1.5. Non aggiungere nuovi utenti qui. */
```

### Step 1.5 — Eliminazione `mockUsers.ts` (solo dopo che tutto passa)

Eliminare `src/lib/mockUsers.ts` solo quando:
- Login funziona con backend reale
- Nessun altro file lo importa (verificare con grep)

**Acceptance criteria Fase 1:**
- [ ] Login con credenziali reali funziona end-to-end
- [ ] `GET /auth/me` restituisce il profilo utente reale
- [ ] Logout invalida il token
- [ ] `mockUsers.ts` non è più importato da nessun file
- [ ] `authStore.test.ts` copre login/logout/me con Vitest + MSW

---

## Fase 2 — Catalogo gatti

**Trigger:** Backend espone `GET /cats`, `GET /cats/:id`, `POST /cats` (shelter), `PUT /cats/:id`.
**Dipende da:** Fase 1 completata.
**Impatta:** `Cats.tsx`, `CatDetail.tsx`, `ShelterCatManagement.tsx`

### Step 2.1 — Aggiungere endpoint `cats` completi a `src/api/index.ts`

```typescript
cats: {
  list:   (filters?) => apiRequest<CatProfile[]>({ method: 'GET', url: '/cats', params: filters }, mockCats),
  get:    (id)       => apiRequest<CatProfile>  ({ method: 'GET', url: `/cats/${id}` }, mockCats[0]),
  create: (data)     => apiRequest<CatProfile>  ({ method: 'POST', url: '/cats', data }, null),
  update: (id, data) => apiRequest<CatProfile>  ({ method: 'PUT', url: `/cats/${id}`, data }, null),
  delete: (id)       => apiRequest<void>         ({ method: 'DELETE', url: `/cats/${id}` }, undefined),
}
```

### Step 2.2 — Aggiornare `src/stores/shelterCatStore.ts`

- Rimuovere `DEMO_SHELTER_CATS` come initial state
- `fetchCats()` action → chiama `api.cats.list()`
- Usare `TanStack Query` se il componente è read-only:
  ```typescript
  const { data: cats } = useQuery({ queryKey: ['cats'], queryFn: () => api.cats.list() })
  ```

### Step 2.3 — Aggiornare pagine

- `Cats.tsx`: useQuery per lista, nessun import da store per dati read
- `CatDetail.tsx`: useQuery(`['cats', id]`) con `api.cats.get(id)`
- `ShelterCatManagement.tsx`: mutations per create/update/delete

**Acceptance criteria Fase 2:**
- [ ] Catalogo carica da API reale con `VITE_DEMO_MODE=false`
- [ ] DEMO_MODE=true continua a mostrare dati mock (non si rompe)
- [ ] `CatProfile` del backend corrisponde al tipo in `api/types.ts` (validare con Zod)
- [ ] `DEMO_SHELTER_CATS` rimosso da `shelterCatStore.ts`
- [ ] `mockData.ts` non importato da `shelterCatStore.ts`

---

## Fase 3 — Flusso adozione

**Trigger:** Backend espone endpoint adozione CRUD + gestione status.
**Dipende da:** Fase 1 + Fase 2.
**Impatta:** `AdoptionWizard.tsx`, `MyAdoptions.tsx`, `adoptionStore.ts`

### Step 3.1 — Endpoint adozione

```typescript
adoptions: {
  list:       ()         => apiRequest<Adoption[]>({ method: 'GET', url: '/adoptions/me' }, []),
  create:     (data)     => apiRequest<Adoption>({ method: 'POST', url: '/adoptions', data }, null),
  updateStatus: (id, s) => apiRequest<Adoption>({ method: 'PATCH', url: `/adoptions/${id}/status`, data: { status: s } }, null),
  getDocuments: (id)     => apiRequest<Doc[]>({ method: 'GET', url: `/adoptions/${id}/documents` }, []),
}
```

### Step 3.2 — Aggiornare `adoptionStore.ts`

- `submitApplication()` → chiama `api.adoptions.create()`
- `loadMyAdoptions()` → chiama `api.adoptions.list()`
- Rimuovere dati initial state mock

**Acceptance criteria Fase 3:**
- [ ] `AdoptionWizard` sottomette al backend reale
- [ ] `MyAdoptions` carica da API
- [ ] Status transitions (pending → approved/rejected) riflesse in tempo reale
- [ ] `adoptionStore` non contiene array mock hardcodati

---

## Fase 4 — Volontariato

**Trigger:** Backend espone task, calendario turni, staffette relay.
**Dipende da:** Fase 1.
**Impatta:** `VolunteerTasks.tsx`, `VolunteerCalendar.tsx`, `RelayLegs.tsx`, `volunteerStore.ts`

### Step 4.1 — Endpoint volontariato

```typescript
volunteer: {
  tasks:  { list: (), update: (id, status) }
  shifts: { list: (), signup: (id), cancel: (id) }
  relays: { list: (), acceptLeg: (id) }
}
```

### Step 4.2 — Aggiornare `volunteerStore.ts`

- Rimuovere DEMO tasks/relays/shifts
- Actions chiamano api.volunteer.*

**Acceptance criteria Fase 4:**
- [ ] Task kanban funziona con dati reali
- [ ] Iscrizione turno salva a backend
- [ ] `volunteerStore` senza costanti DEMO_*

---

## Fase 5 — Rifugio e Comune

**Trigger:** Backend espone dashboard rifugio + municipalità.
**Dipende da:** Fase 2.
**Impatta:** Store `municipalityStore`, `shelterStore`, `campaignStore`, `notificationStore`

### Step 5.1 — Endpoint rifugio

```typescript
shelter: {
  profile: { get: (), update: () }
  campaigns: { list: (), create: (), update: (id) }
  stats: { get: () }
}
```

### Step 5.2 — Endpoint comune

```typescript
municipality: {
  colonies:   { list: (), create: (), update: (id) }
  reports:    { list: (), create: (), resolve: (id) }
  stats:      { get: () }
}
```

**Acceptance criteria Fase 5:**
- [ ] Dashboard rifugio mostra dati reali
- [ ] Dashboard comune mostra colonie/segnalazioni reali
- [ ] Campagne adozione create dal backend
- [ ] Store `municipalityStore` e `shelterStore` senza DEMO_*

---

## Fase 6 — Admin

**Trigger:** Backend espone endpoint admin (solo super_admin/admin).
**Dipende da:** Fase 1 (RBAC obbligatorio lato server).
**Impatta:** `AdminUsers.tsx`, `AuditLog.tsx`, `AdminBroadcast.tsx`, `usersStore.ts`, `auditStore.ts`

### Endpoint admin

```typescript
admin: {
  users: { list: (filters?), get: (id), update: (id, data), deactivate: (id) }
  audit: { list: (filters?) }
  broadcast: { send: (message, roles?) }
}
```

**Acceptance criteria Fase 6:**
- [ ] AdminUsers carica utenti reali con paginazione
- [ ] Audit log persiste su backend
- [ ] Broadcast invia notifiche reali
- [ ] `usersStore` non inizializza da `mockUsers`

---

## Fase 7 — Feature avanzate

**Trigger:** Backend espone matching algorithm, mappe, gatti scomparsi.
**Dipende da:** Fase 1 + Fase 2 + Fase 3.

| Feature | Store | Endpoint |
|---|---|---|
| Matching wizard | `matchingProfileStore` | `POST /matching/profile`, `GET /matching/suggestions` |
| Gatti scomparsi | `missingCatStore` | `GET/POST /missing-cats`, `PUT /missing-cats/:id/found` |
| Mappa esplora | (locale + API) | `GET /locations/areas`, `GET /cats?lat=&lng=&radius=` |
| Deleghe enti | `delegationStore` | `POST /delegations`, `PUT /delegations/:id/accept` |
| Cartella clinica | `healthRecordStore` | `GET/POST /cats/:id/health-records` |

**Acceptance criteria Fase 7:**
- [ ] Ogni store di questa fase senza MOCK_* hardcodati
- [ ] Mappa mostra posizioni reali da API

---

## Fase 8 — Premium e monetizzazione

**Trigger:** Backend e sistema di pagamento pronti.
**Dipende da:** Fase 1 + decisione ADR su payment provider.

| Feature | Store | Note |
|---|---|---|
| Wallet spese | `walletStore` | Tracciamento spese adopter |
| Loyalty program | `loyaltyStore` | Punti, badge, livelli |
| Tier system | `tierStore` | Piano freemium/premium |
| Shop | (api) | Prodotti e ordini |
| Calendario premium | (api) | Appuntamenti pagati |

**Acceptance criteria Fase 8:**
- [ ] Ogni store premium senza MOCK_EXPENSES
- [ ] Tier verificato lato server (non solo lato client)

---

## Fase 9 — Pulizia finale

**Trigger:** Tutte le fasi 1–8 hanno acceptance criteria green in produzione.

### Step 9.1 — Rimuovere `VITE_DEMO_MODE`

- `client.ts`: rimuovere `isDemoMode()`, rendere `apiRequest` unconditional
- `.env`: rimuovere `VITE_DEMO_MODE=true`
- `.env.example`: documentare solo `VITE_API_BASE_URL`

### Step 9.2 — Eliminare file mock

```
src/api/mockData.ts        ← eliminare
src/lib/mockUsers.ts       ← già eliminato in Fase 1
```

### Step 9.3 — Aggiornare `src/api/index.ts`

Rimuovere tutti i parametri `fallback` di `apiRequest` (non più necessari).

### Step 9.4 — Aggiornare `.env.example`

```dotenv
VITE_API_BASE_URL=https://api.citycat.app
```

**Acceptance criteria Fase 9:**
- [ ] `VITE_DEMO_MODE` non esiste più nel codebase (grep zero results)
- [ ] `mockData.ts` e `mockUsers.ts` eliminati
- [ ] App funziona in produzione con API reale

---

## Regola inviolabile durante la transizione

> **NON aggiungere mai nuove costanti `MOCK_*`, `DEMO_*` o array hardcodati come initial state negli store.**
> Se un feature richiede dati di test, usare il backend in staging, non mock nel codice.

---

## Dipendenze tra fasi (grafo)

```
Fase 0 → (no dep)
Fase 1 → Fase 0
Fase 2 → Fase 1
Fase 3 → Fase 1 + Fase 2
Fase 4 → Fase 1
Fase 5 → Fase 2
Fase 6 → Fase 1
Fase 7 → Fase 1 + Fase 2 + Fase 3
Fase 8 → Fase 1
Fase 9 → Fase 1..8 complete
```
