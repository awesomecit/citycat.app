# City Cat — Stato dell'Arte UI

> Documento di analisi tecnica. Data: 2026-02-28
> Autore: Antonio Cittadino

---

## 1. Chiarimento stack tecnologico

> ⚠️ **Nota critica**: L'app è una **React 18 + Vite web app mobile-first**, NON React Native.
> Non ci sono moduli nativi, nessun Expo, nessun bundle iOS/Android.
> Il termine "mobile-first" si riferisce al design CSS responsivo e alla bottom navigation.
> Questo è rilevante per ogni decisione futura: si tratta di una PWA, non di un'app store.

| Layer | Tecnologia | Versione | Stato |
|---|---|---|---|
| Framework | React 18 | ^18.x | ✅ in uso |
| Build | Vite | ^5.x | ✅ in uso |
| TypeScript | TS 5 | strict | ✅ in uso |
| Styling | Tailwind CSS 3 | ^3.x | ✅ in uso |
| UI Components | shadcn/ui + Radix | latest | ✅ in uso |
| State | Zustand (persist) | ^5.x | ✅ in uso — **20 store, tutti in-memory mock** |
| Routing | React Router v6 | ^6.x | ✅ in uso |
| Server state | TanStack Query | ^5.x | ⚠️ installato, raramente usato |
| HTTP Client | Axios | ^1.x | ⚠️ installato, quasi mai chiamato realmente |
| i18n | i18next + browser-det | ^23.x | ✅ IT/EN |
| Animations | Framer Motion | ^11.x | ✅ page transitions |
| Icons | Lucide React | latest | ✅ in uso |
| Forms | react-hook-form + Zod | ^7.x | ✅ in uso |
| Charts | Recharts | ^2.x | ✅ in uso in Dashboard e MunicipalityStats |
| Testing | Vitest + jsdom + Testing Library | latest | ⚠️ installato, test non scritti |

---

## 2. Architettura corrente

### Flusso dati

```
User Interaction
      │
      ▼
React Component (pages/ o components/)
      │
      ├──► Zustand Store (stores/) ← MOCK data hardcodata in DEMO_*/MOCK_* constants
      │         └── localStorage (persist middleware)
      │
      └──► api/ (raramente usato)
                ├── client.ts → isDemoMode() → se true ritorna fallback SEMPRE
                └── index.ts  → wrappa apiRequest con mockData.ts come fallback
```

**Problema strutturale:** Le pagine leggono quasi sempre direttamente gli store Zustand,
bypassando il layer `api/`. Il layer `api/` è architetturalmente corretto ma sottoutilizzato.
La transizione verso il backend richiede di re-routing il flusso dati:
store ← api/client ← backend (invece di store ← MOCK constant).

### Autenticazione

- `src/lib/mockUsers.ts` — 10 utenti hardcodati con **password in chiaro**
- `src/stores/authStore.ts` — legge mockUsers, persiste in localStorage
- Non esiste JWT, cookie session, né nessun token reale
- `MockUser` è il tipo principale — va sostituito con `User` dal backend

---

## 3. Inventario pagine (46 totali)

| Pagina | File | Ruoli | Stato mock | Priorità backend |
|---|---|---|---|---|
| Login/Register | `Index.tsx` | tutti | 🔴 mockUsers auth | P1 |
| Dashboard | `Dashboard.tsx` | tutti | 🟡 KPI da store | P2 |
| Setup wizard | `Setup.tsx` | tutti | 🟡 locale | P3 |
| Impostazioni | `Settings.tsx` | tutti | 🟡 authStore | P1 |
| **CATALOGO GATTI** | | | | |
| Catalogo | `Cats.tsx` | tutti | 🔴 shelterCatStore DEMO | P1 |
| Dettaglio gatto | `CatDetail.tsx` | tutti | 🔴 shelterCatStore DEMO | P1 |
| Cartella clinica | `CatHealthRecord.tsx` | vet/shelter | 🔴 healthRecordStore DEMO | P4 |
| **ADOZIONE** | | | | |
| Wizard adozione | `AdoptionWizard.tsx` | adopter | 🔴 adoptionStore | P2 |
| Le mie adozioni | `MyAdoptions.tsx` | adopter | 🔴 adoptionStore MOCK | P2 |
| Abbinamento | `MatchingWizard.tsx` | adopter | 🔴 matchingProfileStore MOCK | P3 |
| Automazioni ricerca | `SearchAutomations.tsx` | adopter | 🔴 MOCK | P4 |
| **AFFIDO** | | | | |
| Candidatura affido | `FosterApply.tsx` | fosterFamily | 🟡 locale | P4 |
| **VOLONTARIATO** | | | | |
| Task kanban | `VolunteerTasks.tsx` | volunteer | 🔴 volunteerStore DEMO | P2 |
| Calendario | `VolunteerCalendar.tsx` | volunteer | 🔴 volunteerStore DEMO | P2 |
| Staffette | `RelayLegs.tsx` | relayDriver | 🔴 volunteerStore DEMO | P3 |
| Profilo volontario | `VolunteerProfile.tsx` | volunteer | 🟡 authStore + MOCK | P3 |
| **RIFUGIO** | | | | |
| Gestione gatti rifugio | `ShelterCatManagement.tsx` | shelter | 🔴 shelterCatStore DEMO | P1 |
| Campagne adozione | `ShelterCampaigns.tsx` | shelter | 🔴 campaignStore MOCK | P2 |
| Profilo rifugio | `ShelterProfile.tsx` | shelter | 🟡 authStore | P3 |
| **COMUNE** | | | | |
| Mappa territoriale | `TerritorialMap.tsx` | municipality | 🔴 municipalityStore DEMO | P3 |
| Statistiche | `MunicipalityStats.tsx` | municipality | 🔴 municipalityStore DEMO | P3 |
| Segnalazioni | `MunicipalityReports.tsx` | municipality | 🔴 municipalityStore DEMO | P3 |
| Profilo comune | `MunicipalityProfile.tsx` | municipality | 🟡 authStore | P3 |
| **COMMUNITY** | | | | |
| Mappa esplorazione | `ExploreMap.tsx` | tutti | 🔴 MOCK locations | P3 |
| Feed community | `CommunityFeed.tsx` | tutti | 🔴 MOCK posts | P4 |
| Gatti scomparsi | `MissingCats.tsx` | tutti | 🔴 missingCatStore MOCK | P4 |
| **PREMIUM** | | | | |
| Wallet spese | `PremiumWallet.tsx` | adopter | 🔴 walletStore MOCK | P5 |
| Calendario premium | `PremiumCalendar.tsx` | adopter/catSitter | 🔴 MOCK | P5 |
| Programma loyalty | `LoyaltyProgram.tsx` | tutti | 🔴 loyaltyStore MOCK | P5 |
| Shop premium | `PremiumShop.tsx` | tutti | 🔴 MOCK products | P5 |
| Servizi premium | `PremiumServices.tsx` | tutti | 🟡 statica | P5 |
| **ADMIN** | | | | |
| Gestione utenti | `AdminUsers.tsx` | admin | 🔴 usersStore MOCK | P2 |
| Audit log | `AuditLog.tsx` | admin | 🔴 auditStore | P3 |
| Broadcast | `AdminBroadcast.tsx` | admin | 🔴 notificationStore | P3 |
| Feature flags | `FeatureFlags.tsx` | admin | 🟡 featureFlagStore | P4 |
| Feedback beta | `AdminFeedback.tsx` | admin | 🟡 feedbackStore | P4 |
| Deleghe enti | `EntityDelegation.tsx` | shelter/municipality | 🔴 delegationStore MOCK | P4 |
| **META/INFO** | | | | |
| Profilo adottante | `AdopterProfile.tsx` | adopter | 🟡 authStore | P2 |
| About | `About.tsx` | tutti | ✅ statica | — |
| Pricing | `Pricing.tsx` | tutti | ✅ statica | P5 |
| Roadmap | `Roadmap.tsx` | tutti | ✅ statica | — |
| Tutorial Ente | `TutorialEnte.tsx` | shelter/mun | ✅ statica | — |
| Tutorial Adottante | `TutorialAdottante.tsx` | adopter | ✅ statica | — |
| Tutorial Volontario | `TutorialVolontario.tsx` | volunteer | ✅ statica | — |
| **PLACEHOLDER** | | | | |
| Coming Soon | `ComingSoon.tsx` | vari | ✅ placeholder | — |

**Legenda stato:** 🔴 dati mock hardcodati | 🟡 parzialmente mockata | ✅ statica/ok

**Routes `/agenda` `/records` `/patients` `/sessions` `/followup` `/stays` `/payments` `/my-legs` `/history` `/fostered-cats` `/journal` `/cattery` `/kittens` `/transactions` `/shop` `/orders` `/earnings` `/marketplace` `/shelters` `/volunteers` `/drives` `/fundraising` `/analytics` `/verification`** → tutte `<ComingSoon />` — non prioritarie.

---

## 4. Inventario store Zustand (20 totali)

| Store | File | Mock density | Dipende da auth | Priorità |
|---|---|---|---|---|
| `authStore` | authStore.ts | 🔴 mockUsers hardcoded | — | P1 |
| `shelterCatStore` | shelterCatStore.ts | 🔴 DEMO_SHELTER_CATS (5+ gatti) | ✅ | P1 |
| `adoptionStore` | adoptionStore.ts | 🟡 struttura ok, dati vuoti | ✅ | P2 |
| `usersStore` | usersStore.ts | 🔴 inizializzato da mockUsers | ✅ | P2 |
| `volunteerStore` | volunteerStore.ts | 🔴 DEMO tasks/relays | ✅ | P2 |
| `campaignStore` | campaignStore.ts | 🔴 MOCK campagne | ✅ | P2 |
| `municipalityStore` | municipalityStore.ts | 🔴 DEMO colonie/segnalazioni | ✅ | P3 |
| `auditStore` | auditStore.ts | 🟡 generato da azioni | ✅ | P3 |
| `notificationStore` | notificationStore.ts | 🔴 MOCK notifications | ✅ | P3 |
| `delegationStore` | delegationStore.ts | 🔴 MOCK affiliations | ✅ | P4 |
| `healthRecordStore` | healthRecordStore.ts | 🔴 DEMO records | ✅ | P4 |
| `missingCatStore` | missingCatStore.ts | 🔴 MOCK reports | ✅ | P4 |
| `matchingProfileStore` | matchingProfileStore.ts | 🔴 MOCK profiles | ✅ | P4 |
| `homeVerificationStore` | homeVerificationStore.ts | 🟡 struttura ok | ✅ | P4 |
| `walletStore` | walletStore.ts | 🔴 MOCK_EXPENSES | ✅ | P5 |
| `loyaltyStore` | loyaltyStore.ts | 🔴 MOCK | ✅ | P5 |
| `tierStore` | tierStore.ts | 🟡 configurazione | — | P5 |
| `shelterStore` | shelterStore.ts | 🟡 struttura ok | ✅ | P3 |
| `featureFlagStore` | featureFlagStore.ts | 🟡 config locale | — | P4 |
| `feedbackStore` | feedbackStore.ts | 🟡 locale (beta) | ✅ | P4 |

---

## 5. Layer API (`src/api/`)

| File | Stato | Note |
|---|---|---|
| `client.ts` | ✅ architettura corretta | `isDemoMode()` + `apiRequest<T>` con fallback |
| `types.ts` | ✅ types completi | `CatProfile`, `UserProfile`, `Notification`, `LocationArea` + 10+ tipi estesi |
| `mockData.ts` | 🔴 da rimuovere | 5 gatti, 1 utente, 2 notifiche, 2 location — sostituire con API reale |
| `index.ts` | 🟡 struttura ok | Solo `cats`, `user`, `notifications`, `locations` — espandere per ogni dominio |

**Pattern corretto esistente:**
```typescript
export async function apiRequest<T>(config, fallback: T): Promise<ApiResponse<T>>
// Se DEMO_MODE → fallback immediato
// Se API fallisce → fallback con message "fallback:error"
```
Questo pattern deve essere adottato da **tutti** gli store invece delle DEMO_ constants.

---

## 6. Gap README vs Realtà

| Area | README dice | Realtà |
|---|---|---|
| Framework | React 18 (ok) | React 18 + Vite — **non React Native** |
| Pagine elencate | ~20 pagine | 46 pagine implementate |
| Store Zustand | 9 store | 20 store |
| Mock users | 6 | 10 (inclusi vet, behaviorist, catSitter, test) |
| Feature Premium | non citate | Wallet, Shop, Loyalty, Calendar, Services, Pricing |
| Features mancanti | — | MatchingWizard, MissingCats, CommunityFeed, ExploreMap, EntityDelegation, CatHealthRecord, FosterApply, SearchAutomations, Tutorial pages, About, Roadmap, profili ruolo |
| Testing | non menzionato | Vitest installato, 0 test scritti |
| `package.json` name | — | `"vite_react_shadcn_ts"` (placeholder Lovable) da aggiornare |

---

## 7. Dipendenze mock — file impattati

30 file con dipendenze dirette da mock:

**`src/api/`** (2): `client.ts`, `index.ts`
**`src/lib/`** (1): `mockUsers.ts`
**`src/pages/`** (14): `AdminUsers`, `AdoptionWizard`, `CatDetail`, `CatHealthRecord`, `Cats`, `CommunityFeed`, `Dashboard`, `ExploreMap`, `Index`, `MatchingWizard`, `MyAdoptions`, `PremiumCalendar`, `PremiumShop`, `SearchAutomations`, `VolunteerProfile`
**`src/stores/`** (11): `adoptionStore`, `authStore`, `campaignStore`, `healthRecordStore`, `loyaltyStore`, `matchingProfileStore`, `missingCatStore`, `notificationStore`, `shelterCatStore`, `usersStore`, `volunteerStore`, `walletStore`

---

## 8. Qualità del codice

- **TypeScript**: strict, buon uso dei tipi — `CatProfile` e derivati ben definiti
- **Nomi**: camelCase/PascalCase rispettati, chiaro e leggibile
- **Complessità**: alcune pagine superano 300 righe (da monitorare)
- **Test**: Vitest + Testing Library installati, **0 test scritti**
- **ESLint**: configurato, alcune regole react-hooks attive
- **i18n**: IT/EN coerente, namespace `translation`, chiavi organizzate
- **Accessibilità**: shadcn/ui garantisce a11y base via Radix primitives
- **Lovable artifacts**: `package.json` name = `vite_react_shadcn_ts`, `vite.config.ts` importa `lovable-tagger` (devDependency da rimuovere)

---

## 9. Punti di forza da preservare

1. **Layer `api/` con pattern `apiRequest<T>` + fallback** — architettura giusta, va esteso
2. **Tipi completi in `api/types.ts`** — `CatProfile` con behavioral profile, heart adoption, health è già production-ready
3. **12 ruoli e nav system** — `roles.ts` + `roleFeatures.ts` + `featureFlagStore` è un RBAC lato client maturo
4. **i18n completo** — IT/EN con detection automatica, facile da estendere
5. **shadcn/ui** — componenti accessibili e themeable, nessun lock-in UI
6. **Zustand persist** — la struttura store→localStorage è il bridge naturale verso TanStack Query

---

## 10. Decisioni aperte

| Decisione | Opzioni | Impatto |
|---|---|---|
| Backend URL | Manifesto (Fastify/Platformatic) vs altro | Alto — impatta tutte le fasi |
| Auth JWT | Cookie HttpOnly vs localStorage | Sicurezza |
| TanStack Query vs Zustand | Graduale: Q rimpiazza store per server state | Medio — fase per fase |
| PWA vs App Store | Attuale: web only | Strategico |
| `package.json` name | Aggiornare a `city-cat-app` | Basso |
