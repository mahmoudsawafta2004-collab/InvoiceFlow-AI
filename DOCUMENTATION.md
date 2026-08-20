# InvoiceFlow — Owner's Documentation

Everything you need to run, deploy, customize, and operate this product.

---

## 1. What this product does

InvoiceFlow converts batches of invoice PDFs into a structured Excel file.

1. The user drops up to 50 invoice PDFs onto the page.
2. Each PDF is sent to Google Gemini, which returns eight structured fields
   plus a confidence score for each one.
3. Results appear in an editable table where any value can be corrected.
4. One click exports a formatted `.xlsx` file with totals.

Extracted fields: Supplier Name, Invoice Number, Invoice Date, Due Date,
Currency, Subtotal, VAT/Tax, Total Amount.

---

## 2. Running it locally

Requires Node.js 20 or newer.

```bash
npm install
cp .env.local.example .env.local    # then edit it, see section 3
npm run dev
```

The app runs at http://localhost:3000.

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Lint the codebase |

Sample invoices for testing live in `samples/` — see `samples/README.md`
for the expected extraction values.

---

## 3. The API key

The app runs entirely on **your** Gemini key. Visitors never see or supply one —
there is no key field anywhere in the interface.

Set `GEMINI_API_KEY` in the environment:

```
GEMINI_API_KEY=AIza...
```

Locally that goes in `.env.local`. On Vercel it goes in **Settings →
Environment Variables**, and you must redeploy afterwards for it to take effect.

The key is read only in `src/app/api/extract/route.ts`, server-side, and is
never sent to the browser. `GET /api/config` reports whether a key is
configured — a boolean only, never the key itself — so the interface can
disable extraction gracefully if it is missing.

Get a key at https://aistudio.google.com/apikey.

**Because every visitor spends your quota, treat the public URL as a cost
surface.** For an unlisted demo this is fine. Before promoting the site widely,
add rate limiting or put the app behind a login — otherwise anyone who finds
the URL can consume your Gemini budget.

---

## 4. Deploying to Vercel

1. Push the repository to GitHub.
2. At vercel.com, choose **Add New → Project** and import the repository.
3. Vercel detects Next.js automatically — leave the build settings alone.
4. Before deploying, open **Environment Variables** and add `GEMINI_API_KEY`
   with your key as the value.
5. Deploy.

Pushes to the default branch then redeploy production automatically, and
pushes to any other branch produce a preview URL.

The extraction route is configured with `maxDuration = 60` seconds, which fits
within Vercel's Hobby plan limit. If you move to a plan with a longer limit and
want to allow bigger PDFs, raise that value in
`src/app/api/extract/route.ts`.

---

## 5. Project structure

```
src/
  app/
    page.tsx              Landing page
    workspace/page.tsx    The main flow: upload → extract → review → export
    dashboard/page.tsx    Aggregate stats across past batches
    history/page.tsx      Past batches with re-download
    api/extract/route.ts  Server route that calls Gemini
    api/config/route.ts   Reports whether a Gemini key is configured
  components/
    ui/                   Button, Card, Badge, Dialog, Input, Progress, …
    dropzone.tsx          Drag & drop with file validation
    invoice-review-table.tsx  Editable results table
    editable-cell.tsx     Click-to-edit cell
    confidence-badge.tsx  Colour-coded confidence indicator
    step-indicator.tsx    Upload → Extraction → Review progress header
    navbar.tsx, footer.tsx
    landing/pricing.tsx    Pricing cards, reading live plans
    auth/                  Sign-in, sign-up, forgot/update-password forms
    admin/                 Plan editor, subscriber table
  lib/
    types.ts              Shared types, including the field list
    excel.ts              .xlsx generation via ExcelJS
    extract.ts            Client wrapper around /api/extract
    storage.ts            Local-storage batch history, as a React hook
    use-server-key.ts     Reads /api/config so the UI knows extraction is live
    pool.ts               Bounded-concurrency runner
    utils.ts              Formatting helpers and `cn`
    auth.ts               Server-side: current user, admin check, usage/plan lookup
    admin.ts              Server-side: data for the admin dashboard
    stripe.ts              Lazy Stripe client
    plans.ts, get-public-plans.ts   Plan formatting and the public plans read
    supabase/              client.ts (browser), server.ts (SSR), admin.ts (service role)
proxy.ts                   Session refresh + route protection (renamed from
                            middleware.ts — Next.js 16 convention)
supabase/migrations/       SQL to run in the Supabase SQL Editor
samples/                  Six synthetic invoices for testing and demos
```

---

## 6. Common customizations

### Change which fields are extracted

Four files must stay in sync:

1. `src/lib/types.ts` — add the key to `FieldKey` and `InvoiceData`.
2. `src/app/api/extract/route.ts` — add it to `responseSchema` (with the right
   `SchemaType`), to the `required` array, and describe it in `PROMPT`. The
   prompt wording is what drives extraction quality, so be specific about the
   format you expect.
3. `src/components/invoice-review-table.tsx` — add it to the `columns` array.
   If it is numeric, also add it to `numericFields`.
4. `src/lib/excel.ts` — add a column to `sheet.columns` and a matching entry in
   the `sheet.addRow({ … })` call. If it is numeric, set its `numFmt` and
   extend the totals row.

### Change the batch size limit

The limit of 50 appears in three places: `MAX_FILES` in
`src/components/dropzone.tsx`, the `.slice(0, 50)` cap in
`src/app/workspace/page.tsx`, and the landing page copy.

### Change extraction speed

`src/app/workspace/page.tsx` calls `runWithConcurrency(rowIds, 4, …)`. The `4`
is how many invoices are processed in parallel.

Raising it makes batches faster but increases the requests-per-minute rate
against Gemini. On a free-tier key, values above 4 will start hitting rate
limits, which surface as "Gemini rate limit reached". On a paid key
with higher limits you can raise it.

Measured: 6 invoices in 24 seconds at concurrency 4, which is roughly 3 minutes
for a full 50-invoice batch.

### Change the AI model

The model name is in `src/app/api/extract/route.ts`. It is currently
`gemini-3.6-flash`. Google retires older model names over time — if extraction
starts failing with a 404 mentioning a model that is "no longer available", the
fix is to update this string to the model the error message names.

### Change the branding

The name appears in `src/components/navbar.tsx`, `src/components/footer.tsx`,
and the `metadata` block in `src/app/layout.tsx`. The accent colour is Tailwind's
`indigo-600`, used consistently across buttons, icons, and highlights.

---

## 7. Where data is stored

There is no database. Batch history lives in the browser's local storage, so it
is per-browser and clears when site data is cleared. The Gemini key lives only
in the server environment and never reaches the browser. Uploaded PDFs are held in memory for the duration of the session and
are never written to disk on the server — the extraction route holds a file in
memory only long enough to forward it to Gemini.

This keeps hosting free and avoids handling customer financial documents at
rest. If a buyer needs shared multi-user history, that is where a database
would be added: `src/lib/storage.ts` is the only file that reads or writes
history, so it is the single integration point.

---

## 8. Error handling

The extraction route returns specific messages rather than generic failures:

| Condition | Response |
|-----------|----------|
| No key configured on the server | 503, neutral "not available right now" |
| Key rejected by Google | 503, same neutral message (no key details leak) |
| Rate limit hit | 429, asks the user to wait |
| Gemini overloaded | 503, asks the user to retry |
| File is not a real PDF | 400, header bytes are checked, not just the extension |
| Empty or oversized file | 400, with the size limit named |
| Malformed AI response | 502, asks the user to retry that invoice |

A failed invoice does not fail the batch. It appears as a red row in the review
table with a retry button, and the rest of the batch still exports.

---

## 9. Known limits

Worth knowing before promising anything to a customer.

- **Scanned images.** Gemini reads scanned invoices, but accuracy on low
  quality scans is lower than on digital PDFs. Confidence scores drop
  accordingly, which is the signal to review those rows.
- **Multi-page invoices.** The whole PDF is sent, so multi-page invoices work,
  but only one set of totals is returned per file. A PDF containing several
  separate invoices will be read as one.
- **Line items.** Only invoice-level totals are extracted, not individual line
  items. Extracting line items would mean an array field in the schema and a
  different table layout.
- **Rate limits.** On a free-tier key, large batches can hit Gemini's
  requests-per-minute cap. Affected invoices show a rate-limit message and can
  be retried.
- **Interface language.** The core app (landing, workspace, dashboard,
  history) is localized into English, Spanish, Arabic, French, and German —
  see `src/lib/i18n/`. The accounts/billing/admin surfaces added later
  (sign-in, sign-up, pricing cards, /admin) are English only; translating
  them means adding matching entries to each dictionary in
  `src/lib/i18n/dictionaries/`.

### Invoice languages

Non-English invoices work with no configuration. Verified against Arabic,
French, German and Spanish samples in `samples/international/`, where all 32
fields extracted correctly, including day-first dates (`12/06/2026` →
`2026-06-12`), comma decimal separators (`1.245,00` → `1245`), and a currency
named only in words ("دينار أردني" → `JOD`).

Adding a language needs no code. If a specific market matters, the one thing
worth tuning is the date guidance in `PROMPT` inside
`src/app/api/extract/route.ts`, since ambiguous dates like `03/04/2026` can
only be resolved by convention.

---

## 10. Costs to run

- **Hosting:** free on Vercel's Hobby plan for this workload.
- **AI:** billed per request by Google. Gemini Flash models are inexpensive per
  invoice, and Google's free tier covers development and demo use. Check
  current pricing at https://ai.google.dev/pricing — rates change.
- **Database:** free on Supabase's free tier for this workload.
- **Payments:** Stripe takes a percentage per transaction — no fixed cost.

Gemini usage is the cost that scales directly with invoices processed. If
accounts aren't configured (no Supabase env vars), the app runs exactly as
described above with no database and no billing — see section 11.

---

## 11. Accounts, billing, and the admin panel

Everything in this section is optional and additive. Leave the Supabase env
vars unset and the app runs exactly as described in sections 1–10: no
sign-in, no limits, one shared Gemini key. Set them and the app switches on
accounts, plan limits, Stripe checkout, and `/admin` — no code changes
either way, `isSupabaseConfigured()` / `isStripeConfigured()` gate all of it.

### 11.1 Set up Supabase (accounts + database)

1. Create a project at https://supabase.com (free tier is enough to run this).
2. **SQL Editor** → paste the entire contents of
   `supabase/migrations/0001_init.sql` → **Run**. This creates every table,
   the row-level security policies, and seeds the four default plans.
3. **Project Settings → API** → copy `Project URL`, `anon public` key, and
   `service_role` key (secret — server only) into your env as
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`.
4. **Authentication → URL Configuration** — this step is mandatory, not
   optional, and skipping it is the single most common cause of the
   confirmation link redirecting to `localhost` with `otp_expired` in the
   URL instead of your real site: Supabase validates every redirect against
   this list, and silently falls back to **Site URL** (which defaults to
   `http://localhost:3000` on a new project) when the actual link doesn't
   match anything here.
   - **Site URL** → your production domain, e.g. `https://invoiceflow.app`
     (use your real Vercel domain, not a per-deployment preview URL — Project
     → Settings → Domains shows the stable one).
   - **Redirect URLs** → add `{that same domain}/auth/callback`. If you also
     test locally, add `http://localhost:3000/auth/callback` as a second
     entry — both can coexist.
5. **Authentication → Email Templates** — Supabase's default emails are
   unbranded ("Confirm your email address", sent from
   `noreply@mail.app.supabase.io"). Two ready-to-paste branded templates
   ship in `supabase/email-templates/`: open **Confirm signup**, replace the
   body with `confirm-signup.html`, then do the same for **Reset Password**
   with `reset-password.html`. For production volume beyond Supabase's
   shared sending limits, you'll eventually also want your own SMTP
   provider under this same section.

### 11.2 Turn on "Sign in with Google"

The "Continue with Google" button is hidden by default — attempting Google
sign-in against a project that hasn't had the provider enabled doesn't fail
gracefully (supabase-js navigates straight to Supabase's authorize endpoint
regardless, landing on a raw `{"error_code":"validation_failed"}` JSON
page), so the button only renders once you've confirmed setup is done:

1. In [Google Cloud Console](https://console.cloud.google.com/), create (or
   reuse) a project → **APIs & Services → OAuth consent screen** → fill in
   app name, support email, and the Privacy Policy / Terms URLs
   (`/privacy` and `/terms` on your domain — see 11.5).
2. **Credentials → Create Credentials → OAuth client ID** → type **Web
   application**.
3. Authorized redirect URI: your Supabase project's callback, shown on the
   Google provider screen in Supabase (**Authentication → Providers →
   Google**) — looks like `https://<project-ref>.supabase.co/auth/v1/callback`.
4. Copy the generated **Client ID** and **Client Secret** into that same
   Supabase screen, and toggle the provider on.
5. Set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` in your environment and
   redeploy. Only then does the Google button appear on `/login` and
   `/signup` — leave it unset (or `false`) until steps 1–4 are actually done.

### 11.3 Give yourself (or anyone) free admin access

Set `ADMIN_EMAILS` to a comma-separated list:

```
ADMIN_EMAILS=you@example.com,cofounder@example.com
```

Sign up (or sign in) with one of those addresses and that account gets
unlimited extraction and a link to `/admin` in the menu — no subscription,
no Stripe involved. This is enforced server-side on every request in
`src/lib/auth.ts::isAdminEmail`, so it can't be spoofed from the browser.

### 11.4 Connect Stripe (real billing)

1. Create a [Stripe](https://stripe.com) account. You can do everything
   below in **Test mode** first — the toggle is in the dashboard sidebar —
   and switch to live keys later with no code changes.
2. **Developers → API keys** → copy the **Secret key** into
   `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint**:
   URL: `https://yourdomain.com/api/stripe/webhook`
   Events to send: `checkout.session.completed`,
   `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.payment_failed`.
4. Copy the endpoint's **Signing secret** into `STRIPE_WEBHOOK_SECRET`.
5. Test it: use a plan's checkout button, pay with Stripe's test card
   `4242 4242 4242 4242` (any future date, any CVC). The subscription should
   appear in **Stripe → Customers** and in `/admin` within seconds.

**Prices are never stored in Stripe.** Checkout builds the price at the
moment of purchase from `price_cents` in the `plans` table
(`price_data`, not a pre-created Stripe Price object) — so editing a price
in `/admin` changes what the *next* checkout charges immediately, with
nothing to update on Stripe's side. Stripe only ever sees the number you
already approved in `/admin`.

### 11.5 Fill in the legal pages

`/terms` and `/privacy` (`src/app/terms/page.tsx`,
`src/app/privacy/page.tsx`) are templates with `[COMPANY NAME]`,
`[JURISDICTION]`, `[CONTACT EMAIL]`, and `[DATE]` placeholders. Both the
Google OAuth consent screen and Stripe ask for these URLs, so fill them in
— and have an actual lawyer check them — before sending either application
for review or taking real payments.

### 11.6 How enforcement actually works

- Every extraction request checks `/lib/auth.ts::getUsageInfo` server-side
  in `api/extract/route.ts` — a user who has used their plan's monthly
  quota gets a 402 with `code: "USAGE_LIMIT"`, before the file ever reaches
  Gemini. This can't be bypassed from the client; the check is the only
  place usage is enforced.
- Usage isn't a counter that can drift — it's a `count()` over
  `usage_events` rows within the current billing period, so it's always
  exactly right and every extraction is individually visible in `/admin`.
- Admins (`ADMIN_EMAILS`) skip the check entirely (`limit: null`).
- Row Level Security means a signed-in user can only ever read their *own*
  profile, subscription, and usage rows — `subscriptions` and `plans`
  writes are blocked for everyone except the service-role key, which only
  server code (webhook, admin actions) holds.

### 11.7 What's still worth adding

Real, but deliberately out of scope for this pass — pick these up as the
product grows:

- **Free-trial abuse.** Nothing currently stops the same person from
  signing up repeatedly for a fresh free quota. Fine at small scale; add
  device fingerprinting or phone verification if it becomes a problem.
- **Account deletion self-service.** `/admin` can view every account, but a
  user can't yet delete their own from the UI — for now, handle deletion
  requests (see the Privacy Policy) manually via the Supabase dashboard.
- **Localizing the new surfaces.** Sign-in/up, pricing, and `/admin` are
  English only, unlike the rest of the app — see 8's note above.
- **Custom email sender.** Confirmation and reset emails come from
  Supabase's shared address by default; production volume needs your own
  SMTP configured in Supabase.
