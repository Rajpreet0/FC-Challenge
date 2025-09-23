# FC-Challenge

Eine kleine, schnelle Web-App, um **Challenges** zu erstellen, **Teilnehmer:innen** einzuladen und **Fortschrittseinträge** (Werte + optional Foto/Video) zu tracken.  
Perfekt, um mit Freund:innen zu konkurrieren 💪


---

## ✨ Features

- **Challenges erstellen**
  - Titel, Beschreibung, Startdatum, Dauer (Tage), Public/Private
  - Automatische Generierung von **Slug** + **Invite-Token** (+ QR-Code auf der Success-Seite)
- **Beitreten / Login**
  - Auf der Home per **Slug oder Token** direkt zur Challenge
  - In der Challenge per **Nickname** „einloggen“ (Cookie per `participant_<slug>`)
- **Entries erfassen**
  - Wert + Datum
  - **Drag & Drop Upload** von Bild/Video in **Supabase Storage**
  - Anzeige im **Leaderboard**
- **Öffentliche Challenges**
  - Home zeigt Card-Grid aller **isPublic** Challenges
- **Filter**
  - Leaderboard nach **Datum** filtern (mobilfreundlich via Popover)

---

## 🧱 Tech-Stack

- **Next.js (App Router)** + React + TypeScript
- **Prisma** mit **PostgreSQL**
- **Supabase Storage** (Uploads mit Public URLs)
- **ShadCN/UI** (Button, Input, Table, Popover, …)
- **lucide-react** Icons
- **Tailwind CSS**
- **sonner** für Toasts
- **next-qrcode** (QR auf Success-Seite)

---

## 🗃️ Datenmodell (Prisma)

```prisma
model Challenge {
  id           String        @id @default(cuid())
  slug         String        @unique
  title        String
  description  String?
  startAt      DateTime?
  endAt        DateTime?
  isPublic     Boolean       @default(false)
  inviteToken  String        @unique
  participants Participant[]
  createdAt    DateTime      @default(now())
}

model Participant {
  id          String     @id @default(cuid())
  challenge   Challenge  @relation(fields: [challengeId], references: [id])
  challengeId String
  nickname    String
  createdAt   DateTime   @default(now())
  entries     Entry[]
}

model Entry {
  id            String       @id @default(cuid())
  participant   Participant  @relation(fields: [participantId], references: [id])
  participantId String
  value         Float
  proofUrl      String?
  createdAt     DateTime @default(now())
}
```

---

## 🚀 Lokal starten

### 1) Repo klonen & Abhängigkeiten

```bash
git clone https://github.com/Rajpreet0/FC-Challenge
cd FC-Challenge
# wähle einen Paketmanager
npm i
# oder
yarn
# oder
pnpm i
```

### 2) .env anlegen

```env
# Next.js Base URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Prisma / Postgres
DATABASE_URL=postgresql://<user>:<pass>@<host>:<port>/<db>
DIRECT_URL=postgresql://<user>:<pass>@<host>:<port>/<db>

# Supabase (Client-Uploads)
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# (optional – nur wenn du serverseitige Upload-Route verwenden willst)
# SUPABASE_SERVICE_ROLE_KEY=...
```

### 3) Prisma migrieren & Client generieren

```bash
npx prisma migrate dev
npx prisma generate
```

### 4) Dev-Server starten

```bash
npm run dev
# oder
yarn dev
# oder
pnpm dev
```

→ App läuft unter **http://localhost:3000**

---

## 📦 Supabase Storage einrichten

1. **Bucket anlegen:** `challenge-media`  
2. **RLS Policies** für Uploads und Lesen erlauben (öffentlicher Bucket):

**Insert (Upload):**
```sql
create policy "Allow uploads for all users"
on storage.objects
for insert
to public
with check (bucket_id = 'challenge-media');
```

**Select (Read):**
```sql
create policy "Allow read for all users"
on storage.objects
for select
to public
using (bucket_id = 'challenge-media');
```

> Optional restriktiver: Pfadregeln (z. B. nur Uploads in `${slug}/${participantId}_*.ext`).

---

## 🧩 Wichtige Pfade & Komponenten

- **Startseite:** `src/modules/home/ui/views/HomeView.tsx`  
  - Slug/Token-Input → `/api/challenges/find` → Redirect `/c/[slug]` oder `/c/[slug]?t=TOKEN`  
  - Listet öffentliche Challenges via `/api/challenges/public`

- **Neue Challenge:** `src/modules/challenge/ui/views/new-challenge-view.tsx`  
  - POST `/api/challenges` → zeigt **Success** (QR, Link, Slug kopieren)

- **Challenge Page (Server):** `src/app/c/[slug]/page.tsx`  
  - lädt Challenge JSON (inkl. optional `t`)

- **Challenge Page (Client):** `src/modules/challenge/ui/views/challenge-view.tsx`  
  - `useParticipant(slug)` lädt/joint Teilnehmer  
  - Zeigt **ChallengeViewLogged** wenn eingeloggt

- **ChallengeViewLogged:** `src/modules/challenge/ui/views/challenge-view-logged.tsx`  
  - Form: Wert + Datum  
  - **Drag & Drop** Upload nach **Supabase**  
  - POST `/api/challenges/[slug]/entries` (inkl. `proofUrl`)  
  - GET `/api/challenges/[slug]/entries` → Leaderboard  
  - **Popover Date-Filter** für Tabelle

- **Success Screen:** `src/modules/challenge/ui/components/success.tsx`  
  - QR + Copy Buttons (Invite-URL, Slug)

---

## 🔌 API-Routen (Auszug)

- `POST /api/challenges`  
  **Body:** `{ title, description?, startAt?, numberOfDays?, isPublic }`  
  **Res:** `{ inviteUrl, challenge: { slug, title } }`

- `POST /api/challenges/find`  
  **Body:** `{ input }` // slug **oder** inviteToken  
  **Res:** `{ slug, inviteToken }`

- `GET /api/challenges/public`  
  **Res:** `{ challenges: [{ slug, title, description?, startAt?, endAt? }] }`

- `POST /api/challenges/[slug]/join`  
  **Body:** `{ nickname }`  
  **Setzt Cookie:** `participant_<slug>`  
  **Res:** `{ participant }`

- `GET /api/challenges/[slug]/me`  
  **Liest Cookie:** `participant_<slug>`  
  **Res:** `{ participant | null }`

- `GET /api/challenges/[slug]/entries`  
  **Res:** `{ entries: [{ id, nickname, value, createdAt, proofUrl? }] }`

- `POST /api/challenges/[slug]/entries`  
  **Body:** `{ participantId, value, date?, proofUrl? }`  
  **Res:** `{ entry }`

---

## 🧭 Flows

### Challenge erstellen
1. **Create** → Success → **Invite-URL** / **Slug** / **QR**  
2. Freunde gehen zu `/c/<slug>` (oder per Token `/c/<slug>?t=<token>`)

### Beitreten & Eintragen
1. In Challenge **Nickname** eingeben → Cookie gesetzt  
2. Entry speichern: Wert + Datum (+ optional Foto/Video → Supabase)  
3. Leaderboard zeigt alle Einträge (mit Datum-Filter)

---

## 🧪 Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "prisma:studio": "prisma studio"
  }
}
```



---

## 🤝 Contribution

PRs willkommen!  
Bitte Prettier/ESLint laufen lassen und sinnvolle Commits schreiben.

---

## 📄 Lizenz

MIT
