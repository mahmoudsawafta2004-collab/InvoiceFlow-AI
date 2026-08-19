# InvoiceFlow AI — Owner's Documentation

Everything you need to run, deploy, customize, and operate this product.

---

## 1. What this product does

InvoiceFlow AI converts batches of invoice PDFs into a structured Excel file.

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

The app needs a Google Gemini API key. There are two ways to supply one, and
both work at the same time.

**Server-side (recommended for production).** Set `GEMINI_API_KEY` in the
environment. Every visitor then uses your key, and you pay for usage.

```
GEMINI_API_KEY=AIza...
```

**Per-user (recommended for a free demo).** A visitor enters their own key on
the Settings page. It is stored in their browser's local storage and sent with
each extraction request. They pay for their own usage.

The lookup order is in `src/app/api/extract/route.ts`: a key sent from the
browser wins, and the environment variable is the fallback. If you want to
force everyone onto your key, delete the `x-gemini-key` header read in that
file.

Get a key at https://aistudio.google.com/apikey. Google's free tier is enough
for development and light demo use.

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
    settings/page.tsx     API key management
    api/extract/route.ts  Server route that calls Gemini
  components/
    ui/                   Button, Card, Badge, Dialog, Input, Progress, …
    dropzone.tsx          Drag & drop with file validation
    invoice-review-table.tsx  Editable results table
    editable-cell.tsx     Click-to-edit cell
    confidence-badge.tsx  Colour-coded confidence indicator
    step-indicator.tsx    Upload → Extraction → Review progress header
    navbar.tsx, footer.tsx
  lib/
    types.ts              Shared types, including the field list
    excel.ts              .xlsx generation via ExcelJS
    extract.ts            Client wrapper around /api/extract
    storage.ts            Local-storage history and API key, as React hooks
    pool.ts               Bounded-concurrency runner
    utils.ts              Formatting helpers and `cn`
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
limits, which surface to the user as "Gemini rate limit reached". On a paid key
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

There is no database. Batch history and the user's API key live in the
browser's local storage, so history is per-browser and clears when site data is
cleared. Uploaded PDFs are held in memory for the duration of the session and
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
| No API key configured | 400, prompts the user to add one |
| Key rejected by Google | 401, "Your Gemini API key was rejected" |
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

---

## 10. Costs to run

- **Hosting:** free on Vercel's Hobby plan for this workload.
- **AI:** billed per request by Google. Gemini Flash models are inexpensive per
  invoice, and Google's free tier covers development and demo use. Check
  current pricing at https://ai.google.dev/pricing — rates change.
- **Database:** none.

The only variable cost is Gemini usage, and it scales with invoices processed.
