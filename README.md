# 🐱 City Cat — L'Ecosistema Felino Digitale

> Concept & Architecture: **Antonio Cittadino** | 2026

City Cat è una piattaforma mobile-first per la gestione di comunità feline urbane: adozioni, volontariato, grifoni, colonie, segnalazioni e molto altro.

---

## 📐 Tech Stack

| Layer | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| State | Zustand (persist) |
| Routing | React Router v6 |
| HTTP Client | Axios |
| i18n | i18next + browser detection |
| Animations | Framer Motion |
| UI Components | shadcn/ui + Lucide icons |

---

## 🗂 Struttura Progetto

```
src/
├── api/              # Client HTTP, tipi TypeSafe, mock data
├── assets/           # Immagini gatti, logo, hero
├── components/
│   ├── BottomNav.tsx          # Nav bar mobile con filtro feature flags
│   ├── BetaFeedbackFab.tsx    # FAB segnalazioni beta (tutte le viste)
│   ├── DemoBanner.tsx         # Indicatore DEMO_MODE
│   ├── GlobalHeader.tsx       # Header con switch ruolo + notifiche
│   ├── ListFilter.tsx         # Smart filter riutilizzabile (search + chips + drawer)
│   ├── NotificationDrawer.tsx # Drawer notifiche
│   ├── PageTransition.tsx     # Animazioni pagina
│   ├── RoleFeaturesDialog.tsx # Dialog benvenuto ruolo con stato feature flags
│   ├── RoutineLine.tsx        # Timeline adozione
│   └── ui/                    # shadcn components
├── hooks/
│   ├── useFeatureFlagNav.ts   # Hook filtro navigazione per feature flags
│   └── use-mobile.tsx
├── i18n/
│   └── locales/{it,en}.json   # Traduzioni IT/EN
├── lib/
│   ├── catPhotos.ts       # Mapping foto gatti
│   ├── mockUsers.ts       # Utenti mock multi-ruolo
│   ├── roleFeatures.ts   # Feature per ruolo con path mapping
│   ├── roles.ts           # 12 ruoli, nav configs, colori
│   └── utils.ts
├── stores/
│   ├── authStore.ts           # Auth + switch ruolo (persist)
│   ├── usersStore.ts          # CRUD utenti + audit log
│   ├── adoptionStore.ts       # Domande adozione
│   ├── auditStore.ts          # Log immutabile azioni admin
│   ├── featureFlagStore.ts    # Feature flags per ruolo (persist)
│   ├── feedbackStore.ts       # Segnalazioni beta con debug context
│   ├── municipalityStore.ts   # Colonie + segnalazioni
│   ├── notificationStore.ts   # Notifiche + broadcast
│   └── volunteerStore.ts      # Task volontari
├── pages/
│   ├── Index.tsx              # Login / Registrazione + Quick Demo
│   ├── Dashboard.tsx          # Dashboard admin con KPI + default ruolo
│   ├── Cats.tsx / CatDetail.tsx # Catalogo gatti + dettaglio
│   ├── AdoptionWizard.tsx     # Wizard adozione 4 step
│   ├── MyAdoptions.tsx        # Le mie adozioni con timeline
│   ├── ShelterCampaigns.tsx   # Campagne rifugio + review domande
│   ├── VolunteerTasks.tsx     # Kanban task volontari (swipe)
│   ├── VolunteerCalendar.tsx  # Calendario disponibilità
│   ├── RelayLegs.tsx          # Staffette con conferma + foto
│   ├── TerritorialMap.tsx     # Mappa colonie feline
│   ├── MunicipalityStats.tsx  # Statistiche comune
│   ├── MunicipalityReports.tsx # Gestione segnalazioni
│   ├── AdminUsers.tsx         # Gestione utenti (CRUD + ruoli)
│   ├── AuditLog.tsx           # Log audit admin
│   ├── AdminBroadcast.tsx     # Annunci broadcast + storico
│   ├── AdminFeedback.tsx      # Viewer segnalazioni beta
│   ├── FeatureFlags.tsx       # Feature flags per ruolo
│   ├── Settings.tsx           # Profilo, lingua, password
│   ├── Setup.tsx              # Wizard setup guidato
│   └── ComingSoon.tsx         # Placeholder sezioni future
└── App.tsx                    # Router + BetaFeedbackFab globale
```

---

## 🚦 Feature Implementate

### 🔐 Autenticazione & Ruoli
- Login/Register mock con validazione e toast
- 12 ruoli: Adottante, Volontario, Rifugio, Comune, Veterinario, Comportamentalista, Cat Sitter, Staffettista, Famiglia Affido, Allevatore, Artigiano, Admin
- Switch ruolo in-app dal header
- Quick Demo Access per test rapido ruoli
- Navigazione filtrata per ruolo (bottom nav + expanded grid)

### 🐱 Gestione Gatti
- Catalogo con foto reali, filtri (razza, sesso, vaccinazione)
- Dettaglio gatto completo
- Wizard adozione 4 step (Alloggio → Stile di vita → Esperienza → Motivazione)
- Le mie adozioni con timeline visiva

### 👥 Volontariato
- Kanban task con swipe gesture (Todo → In Progress → Done)
- Calendario disponibilità interattivo
- Staffette con conferma leg + upload foto

### 🏛️ Comune
- Mappa territoriale colonie
- Statistiche con grafici Recharts
- Gestione segnalazioni con stati e note operatore

### 🏠 Rifugio
- Dashboard campagne adozione
- Review e approvazione/rifiuto domande

### ⚙️ Amministrazione
- **Gestione utenti**: CRUD con assegnazione ruoli
- **Audit log**: Log immutabile di tutte le azioni admin
- **Broadcast**: Annunci di sistema con targeting per ruolo + storico con filtri data/tipo
- **Feature flags**: Toggle feature per ruolo con effetto su navigazione e dialog
- **Feedback beta viewer**: Lista segnalazioni con debug context espandibile
- **Dashboard admin**: KPI (utenti, gatti, adozioni, segnalazioni, feedback) + pipeline adozioni + stato colonie

### 🔔 Sistema Segnalazioni Beta
- FAB flottante su ogni vista per tutti gli utenti
- 5 categorie: Bug, Feature, UX scarsa, Errore logico, Dominio
- Cattura automatica debug context (path, ruolo, viewport, snapshot Zustand)
- Archiviazione locale (mock, pronto per invio BE)

### 🌍 i18n & UX
- Italiano/Inglese con detection automatica
- Transizioni pagina Framer Motion
- Design mobile-first con bottom nav adattiva
- Smart filter riutilizzabile (search + chips + drawer avanzato)
- Notifiche con drawer + badge contatore

---

## 🧪 Utenti Mock per Test

| Email | Password | Ruoli |
|---|---|---|
| `admin@citycat.it` | `admin123` | Admin |
| `mario@citycat.it` | `gatto123` | Adottante, Volontario |
| `luna@citycat.it` | `micio456` | Adottante |
| `rifugio@citycat.it` | `shelter1` | Rifugio |
| `comune@citycat.it` | `comune1` | Comune |
| `staffetta@citycat.it` | `relay123` | Staffettista |

---

## 🔧 Variabili d'Ambiente

| Variabile | Default | Descrizione |
|---|---|---|
| `VITE_DEMO_MODE` | `true` | Abilita fallback dati mock |
| `VITE_API_BASE_URL` | `https://api.citycat.example` | Base URL API backend |

---

## 🚀 Quick Start

```sh
git clone <YOUR_GIT_URL>
cd city-cat
npm install
npm run dev
```

---

## 📄 Licenza

Progetto proprietario — Concept & Architecture: Antonio Cittadino
