# 🐱 City Cat — L'Ecosistema Felino Digitale

> Concept & Architecture: **Antonio Cittadino** | 2026

City Cat è una piattaforma **web mobile-first** per la gestione di comunità feline urbane: adozioni, volontariato, staffette, colonie, segnalazioni e molto altro.

> 📖 **Stato dell'arte completo:** [`docs/stato-arte-ui.md`](docs/stato-arte-ui.md)
> 🔄 **Piano rimozione mock:** [`docs/piano-rimozione-mock.md`](docs/piano-rimozione-mock.md)
> 📋 **Spec UI per ruolo:** [`docs/SPEC_UI_ROLES.md`](docs/SPEC_UI_ROLES.md)

---

## 📐 Tech Stack

| Layer | Tecnologia | Note |
|---|---|---|
| Framework | **React 18 + TypeScript** | Web app (non React Native) |
| Build | Vite 5 | SWC, HMR |
| Styling | Tailwind CSS 3 + shadcn/ui | Radix UI primitives |
| State (UI/auth) | Zustand (persist) | 20 store — tutti con mock attivi |
| State (server) | TanStack Query | Installato — da usare per API reali |
| Routing | React Router v6 | 46 route |
| HTTP Client | Axios + apiRequest wrapper | Gated da `VITE_DEMO_MODE` |
| i18n | i18next + browser detection | IT/EN |
| Animations | Framer Motion | Page transitions |
| UI Components | shadcn/ui + Lucide | Full Radix set |
| Forms | react-hook-form + Zod | Validazione client-side |
| Charts | Recharts | Dashboard e statistiche |
| Testing | Vitest + Testing Library | Configurato, test da scrivere |

> ⚠️ **DEMO_MODE attivo**: `VITE_DEMO_MODE=true` nel `.env` → tutte le chiamate API ritornano dati mock locali. Nessuna chiamata raggiunge il backend. Vedere `docs/piano-rimozione-mock.md` per il percorso di integrazione.

---

## 🗂 Struttura Progetto

```
src/
├── api/
│   ├── client.ts          # apiRequest<T> con isDemoMode() gate e fallback
│   ├── index.ts           # Endpoint API organizzati per dominio
│   ├── mockData.ts        # Dati mock per DEMO_MODE (da rimuovere in Fase 9)
│   └── types.ts           # Tipi TypeScript: CatProfile, UserProfile, etc.
├── assets/                # Immagini gatti, logo, hero
├── components/
│   ├── BottomNav.tsx      # Nav bar mobile con filtro feature flags
│   ├── BetaFeedbackFab.tsx
│   ├── DemoBanner.tsx     # Indicatore DEMO_MODE visibile in UI
│   ├── GlobalHeader.tsx   # Header con switch ruolo + notifiche
│   ├── ListFilter.tsx     # Smart filter (search + chips + drawer)
│   ├── NotificationDrawer.tsx
│   ├── PageTransition.tsx
│   ├── RoleFeaturesDialog.tsx
│   ├── RoutineLine.tsx    # Timeline adozione
│   └── ui/                # shadcn components (Radix)
├── hooks/
│   ├── useFeatureFlagNav.ts
│   └── use-mobile.tsx
├── i18n/
│   └── locales/{it,en}.json
├── lib/
│   ├── mockUsers.ts       # ⚠️ 10 utenti hardcodati — rimosso in Fase 1
│   ├── roles.ts           # 12 ruoli: ROLES const, ROLE_META, ROLE_BOTTOM_NAV
│   ├── roleFeatures.ts    # Feature flags per ruolo con path mapping
│   ├── catPhotos.ts
│   └── utils.ts
├── pages/                 # 46 pagine (vedi sezione dedicata)
├── stores/                # 20 store Zustand (vedi sezione dedicata)
└── App.tsx                # Router con 46 route + AnimatedRoutes + QueryClientProvider
```

---

## 📄 Pagine Implementate (46)

### 🔐 Auth & Setup
| Pagina | File | Note |
|---|---|---|
| Login / Registrazione | `Index.tsx` | Mock auth — Fase 1 |
| Setup guidato | `Setup.tsx` | Wizard onboarding |
| Impostazioni | `Settings.tsx` | Profilo, lingua, password |

### 🐱 Catalogo Gatti
| Pagina | File | Note |
|---|---|---|
| Catalogo | `Cats.tsx` | Filtri: razza, sesso, vaccinazione |
| Dettaglio gatto | `CatDetail.tsx` | Profilo completo con behavioral profile |
| Cartella clinica | `CatHealthRecord.tsx` | Ruoli: vet, shelter |
| Gestione gatti (shelter) | `ShelterCatManagement.tsx` | CRUD rifugio |

### 💜 Adozione
| Pagina | File | Note |
|---|---|---|
| Wizard adozione | `AdoptionWizard.tsx` | 4 step: alloggio → stile → esperienza → motivazione |
| Le mie adozioni | `MyAdoptions.tsx` | Timeline + stato |
| Abbinamento | `MatchingWizard.tsx` | Algoritmo compatibilità |
| Automazioni ricerca | `SearchAutomations.tsx` | Alert email/push |
| Candidatura affido | `FosterApply.tsx` | Ruolo: fosterFamily |

### 🤝 Volontariato
| Pagina | File | Note |
|---|---|---|
| Task kanban | `VolunteerTasks.tsx` | Swipe gesture |
| Calendario | `VolunteerCalendar.tsx` | Disponibilità |
| Staffette | `RelayLegs.tsx` | Conferma leg + foto |
| Profilo volontario | `VolunteerProfile.tsx` | |

### 🏠 Rifugio
| Pagina | File | Note |
|---|---|---|
| Campagne adozione | `ShelterCampaigns.tsx` | Review domande |
| Profilo rifugio | `ShelterProfile.tsx` | |

### 🏛️ Comune
| Pagina | File | Note |
|---|---|---|
| Mappa territoriale | `TerritorialMap.tsx` | Colonie |
| Statistiche | `MunicipalityStats.tsx` | Recharts |
| Segnalazioni | `MunicipalityReports.tsx` | Gestione stati |
| Profilo comune | `MunicipalityProfile.tsx` | |

### 🗺️ Community
| Pagina | File | Note |
|---|---|---|
| Mappa esplorazione | `ExploreMap.tsx` | Gatti vicini |
| Feed community | `CommunityFeed.tsx` | |
| Gatti scomparsi | `MissingCats.tsx` | Segnalazione e ricerca |

### 💎 Premium
| Pagina | File | Note |
|---|---|---|
| Wallet spese | `PremiumWallet.tsx` | Tracciamento costi |
| Calendario premium | `PremiumCalendar.tsx` | Appuntamenti pagati |
| Programma loyalty | `LoyaltyProgram.tsx` | Punti e badge |
| Shop | `PremiumShop.tsx` | Prodotti |
| Servizi premium | `PremiumServices.tsx` | |
| Pricing | `Pricing.tsx` | Piani |

### ⚙️ Admin
| Pagina | File | Note |
|---|---|---|
| Gestione utenti | `AdminUsers.tsx` | CRUD + ruoli |
| Audit log | `AuditLog.tsx` | Log immutabile |
| Broadcast | `AdminBroadcast.tsx` | Notifiche di sistema |
| Feature flags | `FeatureFlags.tsx` | Toggle per ruolo |
| Feedback beta | `AdminFeedback.tsx` | Segnalazioni utenti |
| Deleghe enti | `EntityDelegation.tsx` | Shelter/Municipality |

### 👤 Profili per Ruolo
| Pagina | File | Note |
|---|---|---|
| Profilo adottante | `AdopterProfile.tsx` | |
| Profilo volontario | `VolunteerProfile.tsx` | |
| Profilo rifugio | `ShelterProfile.tsx` | |
| Profilo comune | `MunicipalityProfile.tsx` | |

### 📚 Info & Tutorial
| Pagina | File | Note |
|---|---|---|
| Dashboard | `Dashboard.tsx` | KPI + pipeline |
| About | `About.tsx` | Statica |
| Roadmap | `Roadmap.tsx` | Statica |
| Tutorial Ente | `TutorialEnte.tsx` | Statica |
| Tutorial Adottante | `TutorialAdottante.tsx` | Statica |
| Tutorial Volontario | `TutorialVolontario.tsx` | Statica |

> ~20 route puntano a `<ComingSoon />` — placeholder per sezioni future.

---

## 🗃️ Store Zustand (20)

| Store | Dominio | Mock density |
|---|---|---|
| `authStore` | Auth + ruoli | 🔴 mock — Fase 1 |
| `shelterCatStore` | Gatti rifugio | 🔴 DEMO_SHELTER_CATS |
| `adoptionStore` | Adozioni | 🟡 struttura ok |
| `usersStore` | Utenti | 🔴 da mockUsers |
| `volunteerStore` | Task + staffette | 🔴 DEMO data |
| `campaignStore` | Campagne | 🔴 MOCK |
| `municipalityStore` | Colonie + segnalazioni | 🔴 DEMO data |
| `shelterStore` | Profilo rifugio | 🟡 |
| `auditStore` | Log admin | 🟡 generato da azioni |
| `notificationStore` | Notifiche | 🔴 MOCK |
| `delegationStore` | Deleghe | 🔴 MOCK |
| `healthRecordStore` | Cartelle cliniche | 🔴 DEMO |
| `missingCatStore` | Gatti scomparsi | 🔴 MOCK |
| `matchingProfileStore` | Abbinamento | 🔴 MOCK |
| `homeVerificationStore` | Verifica domicilio | 🟡 |
| `walletStore` | Spese premium | 🔴 MOCK_EXPENSES |
| `loyaltyStore` | Loyalty | 🔴 MOCK |
| `tierStore` | Piani premium | 🟡 config |
| `featureFlagStore` | Feature toggle | 🟡 config |
| `feedbackStore` | Beta feedback | 🟡 locale |

---

## 👥 Ruoli (12)

`adopter` | `volunteer` | `shelter` | `municipality` | `veterinarian` | `behaviorist` | `catSitter` | `relayDriver` | `fosterFamily` | `breeder` | `artisan` | `admin`

Ogni ruolo ha: bottom nav filtrata, feature flags dedicati, tutorial specifico, profilo ruolo.

---

## 🧪 Utenti Mock per Test

| Email | Password | Ruolo principale |
|---|---|---|
| `admin@citycat.it` | `admin123` | admin |
| `mario@citycat.it` | `gatto123` | adopter, volunteer |
| `luna@citycat.it` | `micio456` | adopter |
| `rifugio@citycat.it` | `shelter1` | shelter |
| `comune@citycat.it` | `comune1` | municipality |
| `staffetta@citycat.it` | `relay123` | relayDriver |
| `vet@citycat.it` | `vet123` | veterinarian |
| `behav@citycat.it` | `behav123` | behaviorist |
| `sitter@citycat.it` | `sitter123` | catSitter |
| `test@citycat.it` | `test123` | adopter |

> Questi utenti esistono solo in `src/lib/mockUsers.ts` — eliminati in Fase 1 del piano rimozione mock.

---

## 🔧 Variabili d'Ambiente

| Variabile | Default | Descrizione |
|---|---|---|
| `VITE_DEMO_MODE` | `true` | `true` = dati mock locali, nessuna chiamata API |
| `VITE_API_BASE_URL` | `https://api.citycat.example` | Base URL backend REST |

---

## 🚀 Quick Start

```sh
git clone git@github-privato:awesomecit/citycat.app.git
cd citycat.app
npm install
npm run dev
# Apre su http://localhost:5173 con DEMO_MODE=true
```

---

## 📄 Licenza

Progetto proprietario — Concept & Architecture: Antonio Cittadino
