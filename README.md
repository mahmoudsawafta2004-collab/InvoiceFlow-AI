# InvoiceFlow AI

Bulk Invoice PDF → Excel Converter. Upload up to 50 invoice PDFs, let AI extract
the key fields, review and correct the results, then export a clean `.xlsx`
file in one click.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Google Gemini API for invoice field extraction
- ExcelJS for `.xlsx` generation
- Local browser storage for history and settings (no database required)

## Getting started

```bash
npm install
cp .env.local.example .env.local   # add your Gemini API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

You can also add a Gemini API key from within the app (Settings page) instead
of using an environment variable — it's stored in the browser only and sent
per-request to `/api/extract`.

Get a free Gemini API key at https://aistudio.google.com/apikey.

## Try it

`samples/` contains six synthetic invoice PDFs covering different layouts,
currencies, and a case with no VAT and no due date. Drop them onto the
Convert page to see the full flow. `samples/README.md` lists the correct
values for verifying extraction accuracy.

## Documentation

[DOCUMENTATION.md](./DOCUMENTATION.md) covers deployment, customization
(adding fields, changing the model, tuning batch speed), where data is
stored, error handling, and known limits.

## Project structure

```
src/
  app/
    page.tsx            Landing page
    workspace/          Upload → AI Extraction → Review & Export flow
    dashboard/          Aggregate stats across past batches
    history/            Past batches, stored locally
    settings/           Gemini API key management
    api/extract/        Server route that calls Gemini and returns structured data
  components/           UI primitives and feature components
  lib/                  Types, Excel export, extraction client, local storage
```

## Scripts

- `npm run dev` – start the dev server
- `npm run build` – production build
- `npm run lint` – lint the project
