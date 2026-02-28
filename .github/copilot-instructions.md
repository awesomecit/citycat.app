# Copilot Instructions — City Cat App

> Stack: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + Zustand + TanStack Query
> Stato: Web app mobile-first (NON React Native). DEMO_MODE attivo — nessun backend reale.
> Spec UI: `docs/SPEC_UI_ROLES.md` | Stato arte: `docs/stato-arte-ui.md` | Piano mock: `docs/piano-rimozione-mock.md`

---

## Clarification: Stack

Questa è una **React 18 + Vite web app**, non React Native.
"Mobile-first" si riferisce al design CSS e alla bottom navigation, non a un bundle nativo.
Ogni proposta che menziona Expo, React Native CLI, o bundle iOS/Android è fuori scope.

---

## Regola principale: NESSUN NUOVO MOCK

> **Non aggiungere mai nuove costanti `MOCK_*`, `DEMO_*`, array hardcodati negli store, o utenti in `mockUsers.ts`.**
> Se una feature richiede dati di test, documentare il contratto API necessario — non emularlo in-memory.

---

## Principi operativi (adattati dal Manifesto)

### KISS — La soluzione più semplice

Prima di implementare qualsiasi cosa, rispondere a entrambe:
1. Perché questa soluzione è necessaria?
2. Perché una soluzione più semplice **non** funzionerebbe?

Se non si riesce ad articolare (2), la soluzione è troppo complessa. Proporre l'alternativa più semplice.

### YAGNI — Solo ciò che serve oggi

Implementare solo ciò che la storia corrente richiede.
- Non aggiungere parametri di configurazione con un solo caso d'uso reale.
- Non costruire sistemi di retry per operazioni che non falliscono mai in dev.
- Non astrarre componenti con un solo consumer.

### Antagonist Mode (default)

Quando viene proposta una decisione architetturale o di design, **trovare prima i difetti**.

1. Applicare KISS e YAGNI esplicitamente prima di validare.
2. Proporre almeno una alternativa più semplice prima di concordare.
3. Se non si trovano difetti, spiegare concretamente perché la proposta regge.

---

## Architettura corrente — regole di navigazione

### Flusso dati corretto (target)

```
Component (UI)
  └─► TanStack Query (useQuery / useMutation)  ← server state
        └─► api/index.ts  →  api/client.ts  →  Backend
  └─► Zustand store  ← solo UI state + auth state
```

### Flusso dati da evitare (legacy, da eliminare)

```
Component → Store ← MOCK_* constants hardcodate  ← NON aggiungere
```

### Regola store Zustand

| Tipo di state | Dove va |
|---|---|
| Auth (token, currentUser, activeRole) | Zustand (`authStore`) |
| UI preferences (lingua, dark mode, feature flags) | Zustand |
| Server data (gatti, adozioni, task) | TanStack Query |
| Form state | react-hook-form locale al componente |

Non usare Zustand per cachare dati del server. Usare TanStack Query.

### Regola API

Ogni nuova chiamata al backend:
1. Va definita in `src/api/index.ts` come `api.<dominio>.<metodo>()`
2. Usa `apiRequest<T>(config, fallback)` per mantenere compatibilità DEMO_MODE
3. Il tipo di ritorno corrisponde a un tipo in `src/api/types.ts`

---

## Convenzioni di naming

| Scope | Convenzione | Esempio |
|---|---|---|
| Componenti | `PascalCase` | `CatDetailCard`, `AdoptionTimeline` |
| Hooks | `camelCase` con `use` prefix | `useCatDetails`, `useActiveRole` |
| Store actions | `camelCase` verbo + sostantivo | `setActiveRole`, `submitAdoption` |
| File componenti | `PascalCase.tsx` | `CatDetailCard.tsx` |
| File utils/hooks | `kebab-case.ts` | `use-cat-details.ts`, `format-date.ts` |
| Costanti | `UPPER_SNAKE_CASE` | `MAX_ADOPTION_STEPS`, `DEFAULT_ROLE` |
| Tipi/Interface | `PascalCase` | `CatProfile`, `AdoptionApplication` |
| Enum | `PascalCase` membri | `AdoptionStatus.Pending` |

**Lingua nel codice:** inglese per tutto (variabili, funzioni, commenti, test descriptions).
**Italiano:** solo per UI text (i18n keys), commenti di dominio nei tipi, spec BDD.

---

## Complessità e dimensioni

- **Cognitive complexity ≤ 15** per funzione/componente
- **Componenti > 200 righe** → valutare split in sub-componenti
- **Store actions > 30 righe** → estrarre in helper puri testabili
- **Hooks > 50 righe** → segnalare e proporre decomposizione

---

## Pattern shadcn/ui

- Usare **sempre** componenti shadcn/ui (`Button`, `Card`, `Dialog`, etc.) invece di HTML raw
- Per layout mobile-first: `flex flex-col min-h-screen` sul container principale
- Bottom safe area: usare `pb-safe` o padding-bottom per iOS/Android PWA
- **Non creare componenti custom** se shadcn/ui ha già il primitivo — applicare YAGNI

---

## Gestione ruoli

- I ruoli sono definiti in `src/lib/roles.ts` — non aggiungere nuovi ruoli senza aggiornare anche `ROLE_META` e `ROLE_BOTTOM_NAV`
- La guardia di accesso a una pagina va in `App.tsx` nella route definition, non nel componente pagina
- Le feature flags per ruolo sono in `featureFlagStore` + `roleFeatures.ts`

---

## Testing

- **Vitest** per unit test, **Testing Library** per component test
- Test file: `ComponentName.test.tsx` (co-located con il componente) o in `src/test/`
- Mock network: **MSW** (`msw`) — non mockare moduli axios direttamente
- Coprire: ogni store action, ogni custom hook, ogni componente con logica condizionale
- Descrizioni test in inglese: `describe('authStore')` → `it('logs out and clears user state')`

---

## Commit convention

```
<type>(<scope>): description

# types: feat | fix | refactor | test | docs | chore | perf
# scopes validi: auth | cats | adoption | volunteer | shelter | municipality
#                admin | premium | ui | config | docs | release
```

Esempi:
```
feat(auth): replace mockUsers login with real JWT endpoint
fix(cats): handle empty catalog state when API returns 404
refactor(adoption): migrate adoptionStore to TanStack Query
test(auth): add MSW handlers for login/logout endpoints
docs(config): update .env.example with staging API URL
```

---

## Piano di lavoro (fasi)

Riferimento: `docs/piano-rimozione-mock.md`

**Fase 0** (setup/qualità) → **Fase 1** (auth reale) → **Fase 2** (catalogo gatti) → ...

Non saltare fasi. Ogni fase ha acceptance criteria esplicite nel piano.
Prima di iniziare una fase, verificare che quella precedente sia green in staging.

---

## Antipattern da rifiutare immediatamente

- ❌ Aggiungere nuove costanti `MOCK_*` o `DEMO_*`
- ❌ Inizializzare uno store con array hardcodati come initial state
- ❌ Chiamare store Zustand da un altro store (coupling orizzontale)
- ❌ Passare dati dal server come props drilling oltre 2 livelli — usare TanStack Query
- ❌ Duplicare tipi già definiti in `src/api/types.ts`
- ❌ Creare un componente UI custom quando shadcn/ui ha già il primitivo
- ❌ Aggiungere logica di business nei componenti pagina — estrarre in hooks

---

## BMAD — Sviluppo guidato da agente

Quando un chatmode BMAD è attivo (`.github/chatmodes/`), le istruzioni BMAD hanno priorità su queste.

Documenti di dominio rilevanti:
- `docs/SPEC_UI_ROLES.md` — spec completa per ruolo (956 righe) — fonte della verità per UX
- `docs/stato-arte-ui.md` — inventario attuale di pagine, store, mock
- `docs/piano-rimozione-mock.md` — ordine di integrazione backend

---

## Repository e Git

Remote: `git@github-privato:awesomecit/citycat.app.git`
Alias SSH: `github-privato` (definito in `~/.ssh/config`)
Branch principale: `main`
