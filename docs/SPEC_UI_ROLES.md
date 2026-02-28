# 🐱 City Cat — UI Roles & Mockup Specification

> Internal document — Antonio Cittadino © 2026
> Version: 2.0 | February 2026
> Format: structural guidelines for mockup — no code

---

## 📌 Mockup Notes

This document describes all views, roles, permissions, and demo flows needed to validate the prototype. Each section is organized by role. The designer receives indications on what to show, to whom, and in which context.

**Guiding principle:** The app is the same for everyone, but each role sees different views, tabs, actions, and information. There are no "separate apps" — there is a permission system that shapes the interface based on who is logged in.

**View convention:** Every described view always includes three levels:
1. **Content** — what the user sees
2. **Input / configuration mode** — forms, fields, attachments, validations
3. **Minimum demo** — minimum sequence to validate the flow in the beta demo

**Existing UI stack:**
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand (state), React Router v6 (routing)
- Framer Motion (animations), i18next (IT/EN)
- Bottom navigation with 4 tabs — working mock auth

---

## 🧭 Global Navigation

### Bottom Navigation — Behavior

Two states:

**Collapsed (default):**
Shows 4 main items always visible, selectable with a tap.

**Expanded (slide up on upward touch on the bar):**
The bar rises revealing a grid of all available sections for that role — organized by category. A second downward swipe or tap outside closes it.

The 4 fixed items vary by role (see role sections). The expanded grid shows everything else.

### Global Header

Every page has a minimal header with:
- Logo / section name on the left
- User avatar + role badge on the right (tap → quick profile)
- Notifications (bell) with numeric badge if there are unread notifications

### Notifications

Side drawer (slide from right). Chronological list with notification-type icon, text, timestamp, and read/unread status. Tap on notification → navigates to relevant screen.

---

## 👥 Roles & Identifying Colors

Each role has a primary color used consistently on badges, section headers, and status icons.

| Role | Emoji | Color | English Key |
|------|-------|-------|-------------|
| Adopter | 👤 | Blue | `adopter` |
| Volunteer | 🙋 | Green | `volunteer` |
| Shelter | 🏠 | Orange | `shelter` |
| Municipality / ASL | 🏛️ | Purple | `municipality` |
| Veterinarian | 🩺 | Teal | `veterinarian` |
| Behaviorist | 🧠 | Dark Pink | `behaviorist` |
| Cat Sitter | 🏡 | Gold / Amber | `catSitter` |
| Relay Driver | 🚗 | Light Orange | `relayDriver` |
| Foster Family | 🤝 | Light Green | `fosterFamily` |
| Breeder | 🐾 | Dark Teal | `breeder` |
| Artisan | 🎨 | Pink | `artisan` |
| Admin City Cat | ⚙️ | Dark Red | `admin` |

The role badge always appears on the avatar in the header and on the public profile card.

---

## 🔑 Common Features — All Authenticated Roles

These items are always present, regardless of role. They form the app's foundation.

| Feature | Key |
|---------|-----|
| Registration / Login — email, Google, Apple ID | `auth` |
| Personal profile — photo, bio, geographic zone, inline edit | `profile` |
| Notifications — push and in-app, configurable by category | `notifications` |
| Explore map — public cats, colonies, shelters in the area | `exploreMap` |
| Community feed — posts, adoption stories, updates | `communityFeed` |
| Donations — contribute to active fundraisers | `donations` |
| Marketplace — browse products, used items, artisans | `marketplace` |
| In-app chat — direct messages after connection or booking | `chat` |
| Universal search — cat, shelter, professional, product, zone | `universalSearch` |
| Settings — language (IT/EN), privacy, consents, notifications, logout | `settings` |
| Wallet — available for adopters and owners | `wallet` |
| Missing cats — report and board by zone | `missingCats` |
| Propose home as foster — open candidacy for all users | `fosterCandidacy` |

---

## 🆘 Missing Cats Module — All Roles

Accessible to all authenticated users via the expanded bottom nav grid or from a fixed "+" button on the map. Cross-cutting across all roles.

### Module Logic

A user reports a missing cat. The report generates a public board by zone. Anyone in the zone (users, volunteers, shelters) can contribute by uploading photos of spotted cats. The system sends push notifications to all users subscribed in the circumscribed zones (configurable radius: 1 / 3 / 5 km). Shelters and volunteers in the zone receive a high-priority notification.

### Missing Cats Board View

**Content:**
- Active reports in the zone, sorted by distance from user and date
- Each card: main photo, cat name, disappearance date, zone, distance, n. reported sightings, status (active / resolved / archived)
- Urgency badge: hours since disappearance (green <24h / yellow 24-72h / red >72h)
- Filters: zone, breed, coat color, date, status
- "Report missing" button — always visible top right
- "I saw a similar cat" button on each card — opens sighting form

### New Missing Report Form

| Field | Type | Required |
|-------|------|----------|
| Photos | Upload (min 1, max 8) — gallery or camera | ✓ |
| Cat name | Text | ✓ |
| Breed | Select from list or "unknown" | ✓ |
| Primary coat color | Color palette selection | ✓ |
| Secondary coat color | Color palette selection | |
| Sex | Select | |
| Neutered | Yes / No / Unknown | |
| Microchip | Yes (with number) / No / Unknown | |
| Last seen date & time | Date picker + time picker | ✓ |
| Last seen location | Map pin | ✓ |
| Notification radius | Slider: 1 / 3 / 5 km | ✓ |
| Descriptive notes | Text (collar, marks, etc.) | |
| Owner contact | Phone and/or email | ✓ (at least one) |
| Consent to publish contact | Toggle | ✓ |
| Link to existing City Cat profile | Search | |

### Sighting Form (Anyone)

| Field | Type | Required |
|-------|------|----------|
| Photo | Upload (min 1) | ✓ |
| Sighting location | Map pin | ✓ |
| Date & time | Default: now, editable | ✓ |
| Notes | Text | |

> Deliberately very short form to lower contribution barrier.

### Report Detail View

- Photo gallery (horizontal swipe)
- All report information
- Map with: last seen point (star), reported sightings (pins colored by date)
- Sighting timeline: chronological list with photo, location, time, notes
- "I saw a similar cat" button always visible
- "Cat found" button — only for the reporting owner
- "Share" button — generates public link and image for social
- If user is shelter or volunteer: "Take charge" button → notification to owner

### Report Closure

1. Owner taps "Cat found"
2. Optional note (how/where found)
3. Report becomes "Resolved" on the board
4. Auto notification to all users who contributed sightings: "Good news! [Cat name] has been found"

### Module Notifications

| Trigger | Recipients | Priority |
|---------|-----------|----------|
| New report | All users in the zone | Normal (push with photo + distance) |
| New report | Shelters & volunteers in zone | High |
| New sighting uploaded | Owner | Normal |
| Status update | Users who uploaded sightings | Normal |

### Notification Settings (User)

- Toggle: receive missing cat notifications in my zone
- Interest radius: 1 / 3 / 5 / 10 km
- Frequency: immediate / daily digest

---

## 🏡 Foster Candidacy — All Roles

Any authenticated user can propose themselves as a foster family. Accessible from:
- Expanded bottom nav grid → "Become foster"
- "Support network" section on home
- CTA on a cat's card that needs urgent foster

### Foster Candidacy Flow (4-Step Wizard)

**Step 1 — Home Information:**

| Field | Type | Required |
|-------|------|----------|
| Housing type | Select: apartment / villa / house with garden / other | ✓ |
| Approximate area | Slider: <40sqm / 40-80 / 80-120 / >120sqm | ✓ |
| Garden or outdoor space | Toggle + description | ✓ |
| Floor | Number | ✓ |
| Photos of spaces | Upload (min 2: living area + rest area) | ✓ |

**Step 2 — Family Composition:**

| Field | Type | Required |
|-------|------|----------|
| Cohabiting adults | Number | ✓ |
| Children (ages) | Number + ages | |
| Other animals in house | Yes (type + n.) / No | ✓ |
| Average daily absence hours | Slider | ✓ |
| Willing to host FIV/FeLV positive | Toggle | |
| Willing to host special needs / elderly | Toggle | |

**Step 3 — Foster Preferences:**

| Field | Type | Required |
|-------|------|----------|
| Preferred cat age | Kitten / Adult / Elderly / No preference | ✓ |
| Max simultaneous cats | 1 / 2 / 3+ | ✓ |
| Temporal availability | Summer only / Year-round / Weekends / Flexible | ✓ |
| Availability zone | Confirm or modify profile zone | ✓ |
| Available for urgent fosters | Toggle (enables urgency notifications) | |

**Step 4 — Experience & Motivation:**

| Field | Type | Required |
|-------|------|----------|
| Previous cat experience | Never / Have/had cats / Already fostered | ✓ |
| Motivation | Text (min 100 chars) | ✓ |
| References | Contact of a shelter previously collaborated with | |

**Confirmation & Matching:**
- Candidacy summary with home photos
- Submit → notification to shelters in the zone looking for foster families
- Shelter can view candidacy, contact family in-app, assign a cat
- Family receives notification for each foster request from a shelter

**Foster Candidacy Status (visible in profile):**
- `pending` — Awaiting approval (shelter verifies)
- `active` — Available for fosters
- `occupied` — Foster in progress (n. cats hosted)
- `paused` — Temporarily unavailable

---

## 📋 Role Details

### 👤 ADOPTER

**Who:** Person who adopts or wants to adopt a cat. Free access. Default role on registration.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 🏠 | Home | `home` |
| 🐱 | Explore Cats | `exploreCats` |
| ❤️ | My Adoptions | `myAdoptions` |
| 👤 | Profile | `profile` |

**Expanded grid:**
Wallet, Community, Marketplace, Missing Cats, Become Foster, Notifications, Settings

#### Home View
- Personalized feed: cats for adoption in their zone (card with photo, name, breed, age, distance)
- "Urgent" section: cats with expiring campaigns or critical situations
- Updates from already adopted cats
- Shortcuts: "Apply for adoption", "See latest stories", "Missing cats near you"
- **Config:** Zone of interest in profile settings (map pin + radius slider), feed preference toggles

#### Explore Cats View
- Grid of cat cards available for adoption
- Filters: breed, age, sex, zone, character, compatibility with children/other animals
- **Config:** Filters as bottom drawer, each filter is a selectable chip or slider (age). Save favorite filters → auto-alert for new matching cats. Sort: distance / newest / urgent first

#### Cat Detail View
- Photo gallery (horizontal swipe)
- Name, breed, age, sex, neutered, microchipped
- Cat's story (narrative text)
- Character (tags)
- Managing shelter (tap → shelter profile)
- Health status summary
- Button: "Apply for adoption" / "Save"
- "Report incorrect info" → form with text field, sent to shelter

#### Adoption Application Module
- Structured form: housing, area, absence hours, other animals, experience, children
- Upload ID document (optional beta)
- **Config:** Step wizard with progress bar (4 steps), each field with explanatory tooltip, attachments (ID upload JPG/PDF max 5MB), motivation letter (text min 50 chars, suggested 200+), summary review before submission with ability to edit previous steps, auto-save draft every 30s

#### My Adoptions View
- List: completed, in progress, awaiting response
- Tap on active adoption → RoutineLine with tasks and status
- Pending tasks highlighted
- Completed adoption history
- **Config:** Task completion (tap → detail with description, completion confirmation + optional note + optional photo), post-adoption update ("Add update" → required photo + text + toggle "Share in community")

#### Cat Wallet View
- Monthly expense dashboard by category (donut chart)
- Expense list with date, category, amount, note
- Exportable PDF report
- Configurable budget alert per category
- Insurance section: partner quotes, active policy
- **Config:** Manual expense entry (category select, amount numeric, date picker default today, optional note, attachment photo/PDF), receipt OCR (photo → extract amount + suggested category → confirm/correct), budget setup (slider/numeric per category), budget alert toggles (80% + 100%), customizable categories

#### Adopter Profile
- Avatar, name, zone, "Verified Adopter" badge
- Reputation history (visible only to self)
- Inline edit
- **Config:** Photo upload with circular crop, zone map pin (only city/neighborhood shown publicly), bio text max 280 chars with counter, identity verification (front/back document + selfie → manual review 48h)

#### Exclusive Features
- Adoption candidacy with eligibility form
- Personal reputation score
- Wallet per adopted cat
- Post-adoption update linked to follow-up
- Insurance quotes from wallet
- Foster candidacy (accessible to all but highlighted here)

#### Cannot
- Publish cats for adoption
- Access campaign panel or volunteer management
- See other adopters' reputation scores
- Modify cat health records

#### Demo — Minimum Validation Cases
1. Registration → profile completion with geographic zone
2. Search cat by zone → open cat detail
3. Fill adoption application → send to shelter
4. Receive "application approved" notification
5. Complete first RoutineLine task
6. Add manual expense in cat wallet
7. Upload post-adoption update with photo
8. Report missing cat with map pin

---

### 🙋 VOLUNTEER

**Who:** Person who supports one or more shelters in operational adoption management. Free. The digital desk for those who currently work on WhatsApp.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 📋 | Tasks | `tasks` |
| 📅 | Calendar | `calendar` |
| 🚗 | Relays | `relays` |
| 👤 | Profile | `profile` |

**Expanded grid:**
Followed Cats, Affiliated Shelters, Missing Cats, Community, Notifications, Settings

#### Task Board View
- Assigned task list, grouped by campaign
- Each task: title, cat, deadline, priority, status
- Filter: today / this week / all
- Tap → task detail
- Swipe: complete / postpone / report issue
- **Config:** Completion (tap → description, notes text, optional photo, "Mark completed"), problem report (type select: adopter unresponsive / cat concerning condition / logistics issue / other, description, optional photo → immediate shelter notification), postpone (date picker + mandatory note if >24h), filter drawer with status/priority/shelter/date toggles

#### Calendar View
- Weekly view with appointments colored by type
- Tap on slot → appointment detail
- **Config:** Publish availability (multi-select calendar for days/time slots, activity type: home visit / on-site visit / video call / relay, additional notes for shelter), confirm/decline received appointment with reason or propose alternative time

#### Relays View
- Tab "Assigned" / "Available in my zone"
- Leg detail with departure, destination, time, contacts
- **Config:** Check-in departure (big button + auto geolocation + timestamp), check-out delivery (mandatory cat photo + optional notes + on-screen signature + geolocation), transport problem report (photo + description + type → immediate shelter alert)

#### Volunteer Public Profile
- Name, photo, zone, availability, ratings, badges
- **Config:** Weekly availability grid (days × time slots morning/afternoon/evening), operating radius slider in km, skills tag selection (transport / home visits / vet assistance / kitten socialization, etc.), shelter affiliation search + request

#### Demo — Minimum Validation Cases
1. Login → task dashboard with highlighted urgencies
2. Accept task with completion note
3. Publish available slot for visit
4. Complete task → RoutineLine update
5. Confirm relay leg: check-in + photo check-out

---

### 🏠 SHELTER

**Who:** Association or cat shelter. Main paying customer (subscription). Manages cats, campaigns, volunteers, collection drives, funds.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 📊 | Dashboard | `dashboard` |
| 🐱 | Cats | `cats` |
| 📣 | Campaigns | `campaigns` |
| ⚙️ | Management | `management` |

**Expanded grid:**
Volunteers, Collection Drives, Fundraising, Missing Cats (zone management), Analytics, B2B Marketplace, Public Shelter Profile, Shelter Settings

#### Shelter Dashboard
- KPIs: active cats, ongoing campaigns, unassigned tasks, donations 7 days, urgencies
- Recent activity feed
- Quick actions: "Add cat", "Open campaign", "Create collection drive"
- **Config:** Widget customization (long press to reorder, toggle show/hide), urgency threshold settings (hours for pending application default 48h, days without cat update default 7)

#### Cat Management View
- Complete list with filters by status, breed, age
- Cat card with colored status
- **Config — Cat creation (3-step wizard):**

  **Step 1 — Basic Info:** name, breed (list + custom), sex, estimated birth date (picker), neutered, microchip (toggle + number field), coat color

  **Step 2 — Health:** vaccinations (list with dates), ongoing treatments, known conditions, reference vet (link to City Cat vet optional), clinical file attachment (PDF max 10MB)

  **Step 3 — Story & Photos:** narrative description (text), character (multi-select tags), compatibility (children / other cats / dogs — toggles), photos (min 1, max 15, drag-sortable)

- Inline edit: tap any field → direct edit with confirm
- Status change: context menu (long press on card) → select new status with date
- Archive: left swipe on card → archive with reason (adopted / deceased / transferred)

#### Adoption Campaigns View
- Active campaign list with RoutineLine, applications, % completion
- **Config — Open campaign:** select cat (from those without active campaign), configure RoutineLine (select steps from template or custom), campaign expiry date (optional), custom eligibility criteria (toggle each + weight in score)
- **Application management:** each shows auto-score + adopter history → actions: approve (select + notify) / reject (mandatory reason field sent to adopter) / waitlist
- **Task assignment:** drag application to volunteer or menu → "Assign to" with available volunteer list
- **RoutineLine templates:** save config as reusable template

#### Collection Drives View
- Drive list with status
- **Config — Create drive:**
  - Name, date, start/end time
  - Location: map pin + text address + access description
  - Needs list: add item (product name, target quantity, unit, priority high/medium/low), sortable, deletable
  - Manager: select from affiliated volunteers
  - Municipal authorization attachment: upload PDF/JPG
  - Accept monetary donations: toggle → generates virtual POS QR code
  - **Live management:** +/- buttons per item to register incoming donations, optional "donor" field, auto-close on target reached
  - Edit needs after opening (real-time QR code update)

#### Fundraising View
- Campaigns with goal and status
- **Config — Create campaign:** type (medical care / structural / urgency / general fund), title, description (text), goal amount (numeric), deadline (date picker), main image (upload), attachments (mandatory vet diagnosis PDF for medical care), destination vet facility (medical care only — search City Cat or manual entry)
- **Intermediate updates:** add update with text + photo → auto notification to donors
- **Manual closure:** before expiry with closing note

#### Shelter Analytics
- Charts and KPIs
- **Config:** Period selection (presets 7d/30d/3m/1y or custom range), indicator selection (toggles for adoptions/applications/avg completion time/zones/professionals), export PDF (formal report) or CSV (raw data) — background generation with notification

#### Demo — Minimum Validation Cases
1. Create cat profile with photos and story
2. Open campaign with RoutineLine
3. Approve application → notify adopter
4. Assign task to volunteer
5. Create collection drive with QR code
6. Close campaign → cat adopted

---

### 🏛️ MUNICIPALITY / ASL

**Who:** Institutional entity. Anonymized territorial dashboard. Annual B2G license.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 🗺️ | Territorial Map | `territorialMap` |
| 📊 | Statistics | `statistics` |
| 📄 | Reports | `reports` |
| 👤 | Entity Profile | `entityProfile` |

#### Territorial Map View
- Map with layers: censused cats, colonies, sterilizations, adoptions, authorized drives
- Filter by period and zone
- **Config:** Layer selector panel with toggles + color intensity, zone filter (draw custom polygon or select from districts/ZIP), save views for quick access

#### Statistics View
- KPIs, trends, zone comparison
- **Config:** Period selection, multi-zone comparison on overlaid line chart, regional benchmark toggle (anonymized City Cat average as reference line)

#### Reports View
- Generation and export
- **Config:** Report configuration (period, section toggles, municipal logo upload PNG for header, additional notes text), auto-report scheduling (monthly/quarterly, multi-email recipients, auto-send)

#### Demo — Minimum Validation Cases
1. Login → map with active layers
2. Filter by district and period
3. View authorized drive report
4. Generate and download PDF report

---

### 🩺 VETERINARIAN

**Who:** Bookable veterinarian who updates health records. Listing + booking commission.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 📅 | Agenda | `agenda` |
| 📋 | Records | `records` |
| 👥 | Patients | `patients` |
| 👤 | Profile | `profile` |

#### Agenda View
- Weekly calendar with appointments
- **Config:** Publish availability (select days and time slots, slot duration 15/30/45/60 min, accepted visit type: routine / urgency / specialist / video, rate per type), block dates (unavailable days), confirm/reject booking (accept with optional note / reject with mandatory reason / propose alternative with date picker), auto-reminder config (24h before, 1h before — toggles)

#### Records View
- Cat list with registered visits
- **Visit registration:**

| Field | Type | Required |
|-------|------|----------|
| Date & time | Default now, editable | ✓ |
| Visit type | Select: routine / urgency / check / specialist / vaccination / surgery | ✓ |
| Diagnosis | Text (min 20 chars) | ✓ |
| Prescribed medications | Add row: drug name, dosage, duration, notes | |
| Vaccination | Vaccine name, batch, next dose date (generates owner reminder) | |
| Antiparasitic | Type, next dose date | |
| Attachments | Report PDF (max 20MB), diagnostic images (JPG/PNG) | |
| Private notes | Text (visible only to vet) | |
| Digital signature | Tap button → document checksum | |

- **Config:** Add via "+" on cat record, edit existing entry (tap → edit mode with confirm, generates new version, previous archived in log), owner consent required before record modification (notification + tap confirm from user)

#### Vet Public Profile
- Office, hours, specializations, reviews, booking
- **Config:** Office data (name, address map, phone, website), office photos (1-6), specializations (list + custom), hours (weekly grid), indicative rates (visit type + price, mandatory), verification document (upload Vet Order certificate PDF → City Cat review 48h → badge activated), home visit service radius (km slider, optional)

#### Demo — Minimum Validation Cases
1. Complete profile with specializations and hours
2. Receive booking → confirm
3. Register visit with diagnosis and attachment
4. Owner sees visit in cat's record

---

### 🧠 BEHAVIORIST

**Who:** Feline behavior specialist. In-person/video consultations. Listing + booking fee.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 📅 | Agenda | `agenda` |
| 🗂️ | Sessions | `sessions` |
| 📋 | Follow-up | `followUp` |
| 👤 | Profile | `profile` |

Structure analogous to veterinarian with these specifics:

- **Session creation:** client + cat selection, type (in-person / video), pre-session notes (text)
- **Post-session notes:** structured text (observed behavior / interpretation / work plan), attachments (short videos max 30sec / photos), visibility (professional only / share with owner)
- **Follow-up task creation for owner:** title, detailed description, deadline, verification type required (text / photo / short video)
- **Video call link:** URL entry (Meet/Zoom/Teams) or auto-generation via City Cat integration
- **Publish availability:** identical to vet + toggle for "accept urgent sessions" with dedicated slots

#### Demo — Minimum Validation Cases
1. Consultation booking → confirm + generated video link
2. Post-session note shared with owner
3. Follow-up task assigned to owner
4. Owner sees and completes task

---

### 🏡 CAT SITTER

**Who:** Hosts cats for payment. Verified identity, escrow, included liability insurance, mandatory daily updates.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 🏠 | Stays | `stays` |
| 📅 | Calendar | `calendar` |
| 💳 | Payments | `payments` |
| 👤 | Profile | `profile` |

#### Stays View
- List of hosted cats with days elapsed and daily update button
- **Config — Daily update (mandatory if stay active):** required photo (1 min, 3 max), text, health toggle ("all ok" / "noticed something" → text field). System shows push reminder at 20:00 if not submitted.
- **Urgent problem report:** quick form with type (health / escape / damage / aggressive behavior), description, photo, direct owner contact button

#### Calendar View
- Availability and bookings
- **Config:** Set availability (multi-select calendar to open/close dates, toggle "accept last-minute bookings" within 24h), receive booking (cat profile card with name/breed/age/health notes/photo, requested period, auto-calculated rates, owner notes → accept / reject / ask info), contract signing (on acceptance → PDF contract generation → on-screen signature from both parties before confirmed)

#### Cat Sitter Public Profile
- Home photos, capacity, rates, zone, reviews
- **Config:** Home photos (min 2: living area + cat sleeping area, max 8), rates (per night numeric, additional cat rate, medical care daily rate optional), description (text with suggested structure), identity verification (front/back ID + selfie), references (send reference request to previous owners via link)

#### Demo — Minimum Validation Cases
1. Complete profile with home photos and rate
2. Receive booking → accept → signed contract
3. Send daily update with photo
4. End of stay → confirmed payment unlock

---

### 🚗 RELAY DRIVER

**Who:** Volunteer who transports cats on assigned legs.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 🚗 | Relays | `relays` |
| 📍 | My Legs | `myLegs` |
| 📜 | History | `history` |
| 👤 | Profile | `profile` |

- **Vehicle profile:** type (car / motorcycle / van / bicycle), available cat spots (1-4+), urgent transport availability (toggle)
- **Zone availability:** select usual regions/provinces + availability for extra routes on request
- **Temporal availability:** weekly grid like volunteer
- **Check-in:** tap button → auto geolocation + mandatory cat photo at pickup
- **Check-out:** mandatory cat photo at delivery + on-screen signature from receiver + geolocation + timestamp
- **Report:** quick form + photo + problem type → immediate shelter notification

#### Demo — Minimum Validation Cases
1. View available relays in zone
2. Accept leg → route detail
3. Check-in with photo → check-out with signature and photo

---

### 🤝 FOSTER FAMILY

**Who:** Temporarily hosts cats awaiting adoption. Free.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 🐱 | Fostered Cats | `fosteredCats` |
| 📔 | Journal | `journal` |
| 📥 | Matching | `matching` |
| 👤 | Foster Profile | `fosterProfile` |

#### Fostered Cats View
- List of hosted cats, assigned care tasks

#### Journal View
- Chronological update feed per cat
- **Config — Journal entry:** photo (min 1) + text + health field (all ok / noticed something with text) + behavior field (selectable tags: playful / reserved / eats well / nervous / progressing)

#### Matching View
- Adoption applications for the hosted cat with ability to express opinion
- **Adopter opinion:** text (max 500 chars) + general rating (positive / neutral / negative) — visible only to shelter

#### Foster Profile
- Capacity, preferences, availability, history

#### Foster Candidacy
- Any City Cat user can start the "Propose home as foster" flow from expanded grid or from a cat needing urgent foster
- Flow is the 4-step wizard described in the "Foster Candidacy — All Roles" section
- Once approved by a shelter, the role is activated (multiple roles can coexist)

#### Support Request
- Report need to shelter (food supply / urgent vet visit / concerning behavior) with description + optional photo

#### Demo — Minimum Validation Cases
1. Foster candidacy via 4-step wizard
2. Accept foster request from shelter → receive cat card
3. Insert journal entry with photo and behavior tags
4. Express opinion on adopter candidate

---

### 🐾 BREEDER

**Who:** ANFI/WCF certified breeder. Monthly listing + transaction commission.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 🏠 | My Cattery | `myCattery` |
| 🐱 | Kittens | `kittens` |
| 💳 | Transactions | `transactions` |
| 👤 | Profile | `profile` |

#### Kitten Card Creation

| Field | Type | Required |
|-------|------|----------|
| Name (or pre-name code) | Text | ✓ |
| Sex | Select | ✓ |
| Coat color | Select | ✓ |
| Birth date | Date picker | ✓ |
| Sequential photos | Upload per week (UI shows photo timeline from birth) | |
| Family tree | Manual entry parent 1 & 2 (name/breed/registry number), FIFe file import | |
| Microchip | Number (editable after procedure) | |
| Vaccinations | Add entry (type, date, batch, vet) | |
| Health certificate | Upload signed vet PDF (mandatory for publication) | ✓ |
| Genetic tests | Add test (type, result, lab, date) with report PDF upload | |
| Price | Numeric + currency, negotiation notes optional | ✓ |
| Accept reservation with deposit | Toggle + deposit amount + cancellation conditions | |

- **Breeder verification:** upload ANFI/WCF certificate + VAT/Tax ID + ID document → City Cat review 72h
- **Purchase request response:** accept / reject (reason field) / ask info (in-app chat opens)
- **Kitten relay request:** form with departure (cattery address), destination (buyer address), desired delivery date/time, notes

#### Demo — Minimum Validation Cases
1. Create kitten card with photos and certificate
2. Receive purchase request → accept → generated contract
3. Escrow payment → delivery confirmation → funds release
4. Relay request for transport

---

### 🎨 ARTISAN

**Who:** Sells handmade cat products in the marketplace. 12% commission on sales.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 🛍️ | My Shop | `myShop` |
| 📦 | Orders | `orders` |
| 💳 | Earnings | `earnings` |
| 👤 | Profile | `profile` |

#### Product Creation

| Field | Type | Required |
|-------|------|----------|
| Product name | Text (max 60 chars) | ✓ |
| Category | Select: blankets / scratchers / toys / collars / snacks / gadgets / other | ✓ |
| Description | Text (min 50 chars, suggestions: materials, sizes, crafting time) | ✓ |
| Photos | Upload (min 3: front, material detail, in-use context), max 8, sortable | ✓ |
| Price | Numeric | ✓ |
| Stock | Quantity or toggle "made to order" | ✓ |
| Estimated production time | Select: 1-3d / 3-7d / 1-2wk / 2+wk | If made to order |
| Shipping | Included (toggle) or additional cost, shipping zones | ✓ |
| Customization | Accept custom requests (toggle) + options description | |

- **Order management:** confirm receipt → update status (in production → shipped → delivered) → insert tracking number
- **Dispute:** if customer reports problem → response form with photo of state at shipping

#### Demo — Minimum Validation Cases
1. Create product with 3 photos and description
2. Receive order → update status to "shipped" with tracking
3. Delivery confirmation → verify net earnings

---

### ⚙️ ADMIN CITY CAT

**Who:** Internal team. Full access.

**Bottom nav (4 fixed items):**
| Icon | Label | Key |
|------|-------|-----|
| 📊 | Global Dashboard | `globalDashboard` |
| 👥 | Users | `users` |
| 🚨 | Moderation | `moderation` |
| ⚙️ | System | `system` |

- **User management:** every profile field is admin-editable with automatic modification log (who, when, previous value)
- **Moderation:** each report has a resolution form (action type: remove content / warn user / suspend 7d / suspend 30d / permanent ban / ignore + mandatory internal note)
- **Professional verification:** received documents checklist, review notes field, approve/reject button with reason → automatic email to professional
- **Feature flags:** toggle with "reason description" field + activation/expiry date + target user selection (all / beta only / specific role / email list)
- **System announcement:** title + text + publication date/time + display duration + target roles → preview before publication
- **Missing cats management:** can close/archive reports, add internal notes, escalate to competent shelters with one click

#### Demo — Minimum Validation Cases
1. Login → dashboard with global KPIs
2. Search user → modify role with log
3. Approve veterinarian verification
4. Resolve report with action and note

---

## 📊 Permission Matrix — Summary

Legend: ✓ = can do | · = cannot

| Feature | 👤 | 🙋 | 🏠 | 🏛️ | 🩺 | 🧠 | 🏡 | 🚗 | 🤝 | 🐾 | 🎨 | ⚙️ |
|---------|----|----|----|----|----|----|----|----|----|----|----|----|
| Publish cat profile | · | · | ✓ | · | · | · | · | · | · | ✓ | · | ✓ |
| Apply for adoption | ✓ | · | · | · | · | · | · | · | · | · | · | · |
| Approve applications | · | · | ✓ | · | · | · | · | · | · | · | · | ✓ |
| Manage adoption tasks | · | ✓ | ✓ | · | · | · | · | · | · | · | · | ✓ |
| Update health record | · | · | · | · | ✓ | · | · | · | · | · | · | ✓ |
| Personal cat wallet | ✓ | · | · | · | · | · | · | · | · | · | · | · |
| Territorial dashboard | · | · | · | ✓ | · | · | · | · | · | · | · | ✓ |
| Confirm relay leg | · | ✓ | · | · | · | · | · | ✓ | · | · | · | ✓ |
| Foster journal update | · | · | · | · | · | · | · | · | ✓ | · | · | ✓ |
| Certified breed sale | · | · | · | · | · | · | · | · | · | ✓ | · | · |
| Handmade product sale | · | · | · | · | · | · | · | · | · | · | ✓ | · |
| Moderation & admin | · | · | · | · | · | · | · | · | · | · | · | ✓ |
| Receive escrow payment | · | · | · | · | · | ✓ | ✓ | · | · | ✓ | ✓ | · |
| Shelter analytics | · | · | ✓ | · | · | · | · | · | · | · | · | ✓ |
| Create collection drive | · | · | ✓ | · | · | · | · | · | · | · | · | ✓ |
| Create fundraiser | · | · | ✓ | · | · | · | · | · | · | · | · | ✓ |
| Donate to fundraiser | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · |
| Community post | ✓ | ✓ | ✓ | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | · |
| Report missing cat | ✓ | ✓ | ✓ | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Upload cat sighting | ✓ | ✓ | ✓ | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Take charge of missing report | · | ✓ | ✓ | · | · | · | · | · | · | · | · | ✓ |
| Foster candidacy | ✓ | ✓ | · | · | · | · | · | · | · | · | · | · |
| Manage foster candidacies | · | · | ✓ | · | · | · | · | · | · | · | · | ✓ |

---

## 🧩 Recurring UI Patterns

### Cat Card
- Photo (or colored initials if absent)
- Name, breed, age, sex
- Status badge: "For adoption" / "In foster" / "Adopted" / "In care" / "Missing" — each with different color
- Reference shelter badge (small logo + name)
- Contextual action based on viewer's role

### Task Card
- Short title
- Linked cat (mini avatar)
- Deadline with color (green / yellow / red by urgency)
- Assignee (avatar)
- Swipe left: complete | swipe right: postpone

### RoutineLine
- Vertical step visualization (timeline style)
- Each step: responsible role icon, action title, status (done / in progress / not started), timestamp if completed
- Active step highlighted with role color
- Tap on step → detail and available actions

### Sighting Card (Missing Module)
- Sighting photo thumbnail
- Distance from disappearance point
- Timestamp
- Brief note
- Badge: "Verified by shelter" if a shelter or volunteer confirmed relevance

### Professional Profile
- Header with photo, name, verified badge, average stars
- Chips for specializations / breeds / zones
- Inline availability calendar
- Primary button: "Book" — starts in-app booking flow

### Booking Flow (vet / behaviorist / cat sitter)
1. Select date and time from published availability
2. Confirm details (visit type / selected cat / notes)
3. Summary with amount and cancellation conditions
4. Confirmation and escrow payment
5. Notification to both parties with details and, if video, call link

### Escrow Payment Status
- `pending` (orange): Funds held, service not yet completed
- `processing` (yellow): Service completed, awaiting client confirmation (48h)
- `available` (green): Funds released, ready for withdrawal
- `disputed` (red): Dispute open, funds blocked until resolution

### Attachment Upload (Common Pattern)
- Tap upload area → bottom sheet with two options: "Take photo" / "Choose from gallery"
- For PDF: third option "Choose file"
- Loaded attachment preview with remove button
- Upload progress indicator (linear bar)
- Size limit shown before upload, clear error if exceeded

### Form Validation
- Inline errors under each field (not global alert)
- Red border on error field + descriptive message
- Submit button disabled while errors exist
- Auto-save draft every 30 seconds on long forms

---

## 🔜 Implementation Priority for Demo

### Search & Filter Design Principles
- Easy, granular filters based on user type
- Recap metrics at the top of search results
- List-oriented layout optimized for tablet and smartphone
- User-friendly, no unnecessary frills
- Filter drawer from bottom with chips and sliders
- Saved search capability with auto-alerts

---

## ✅ Implementation Checklist

### Sprint 0 — Foundation (Current)
- [x] React 18 + TypeScript + Vite setup
- [x] Tailwind CSS + shadcn/ui design system
- [x] Zustand persisted auth store
- [x] React Router v6 with animated routes
- [x] i18next (IT/EN)
- [x] Bottom navigation (4 tabs)
- [x] Mock auth (login/register)
- [x] Settings page (profile edit, password change, language, notifications placeholder)
- [x] Cat list page with tabs (mine / adoption)
- [x] Cat detail page
- [x] Setup wizard (3-step placeholder)
- [x] Demo mode banner
- [ ] Role system in auth store (multi-role support)
- [ ] Role-based bottom nav (collapsed + expanded grid)
- [ ] Global header (logo, avatar+role badge, notification bell)
- [ ] Notification drawer (slide from right)

### Sprint 1 — Core Adoption Flow (Adopter + Shelter)
- [ ] Complete cat card with status badges and photos
- [ ] Adoption application wizard (4 steps)
- [ ] Shelter: cat creation wizard (3 steps)
- [ ] Shelter: campaign management with RoutineLine
- [ ] Application approval flow (shelter side)
- [ ] Notifications between roles
- [ ] Adopter: "My Adoptions" view with task list
- [ ] Adopter: post-adoption update flow
- [ ] Search/filter cats with granular filters + recap metrics

### Sprint 2 — Volunteer Operations
- [ ] Task board with swipe actions and completion form
- [ ] Calendar with availability publishing
- [ ] Relay leg confirmation with photo check-in/out
- [ ] Volunteer profile with skills and availability grid

### Sprint 3 — Missing Cats + Foster
- [ ] Missing cat report form (full fields + map pin)
- [ ] Missing cats board by zone with filters
- [ ] Sighting upload form (minimal)
- [ ] Report detail with sighting timeline + map
- [ ] Foster candidacy wizard (4 steps)
- [ ] Foster journal with behavior tags

### Sprint 4 — Professionals
- [ ] Professional public profile (vet / behaviorist / cat sitter)
- [ ] Booking flow with availability calendar
- [ ] Vet: visit registration form
- [ ] Behaviorist: session notes + follow-up tasks
- [ ] Cat sitter: mandatory daily update
- [ ] Mock escrow payment flow

### Sprint 5 — Data & Community
- [ ] Cat wallet with manual entry + OCR
- [ ] Community feed with post-adoption updates
- [ ] Shelter analytics dashboard (basic)
- [ ] Breeder: kitten card with photo timeline
- [ ] Breeder: purchase request flow

### Sprint 6 — Institutional & Marketplace
- [ ] Municipality territorial dashboard with map layers
- [ ] Artisan: product listing and shop
- [ ] Artisan: order management
- [ ] Shelter: collection drive with QR code live
- [ ] Shelter: fundraising campaigns

### Sprint 7 — Admin & Polish
- [ ] Admin: global dashboard with KPIs
- [ ] Admin: user management with role editing + audit log
- [ ] Admin: moderation panel
- [ ] Admin: professional verification workflow
- [ ] Admin: feature flags and system announcements
- [ ] Admin: missing cats management (close/archive/escalate)

---

> Version 2.0 — Antonio Cittadino — City Cat © 2026 — internal use only
