/**
 * Canonical dictionary. Every other locale's shape is checked against this
 * one via `satisfies Dictionary`, so a missing key fails the build instead of
 * silently falling back to English at runtime.
 */
const en = {
  nav: {
    convert: "Convert",
    convertHint: "Upload invoices and export",
    dashboard: "Dashboard",
    dashboardHint: "Totals across your batches",
    history: "History",
    historyHint: "Re-download past exports",
    backToHome: "Back to home",
    menu: "Menu",
    language: "Language",
  },
  landing: {
    nav: {
      tryFree: "Try it free",
    },
    hero: {
      kicker: "Made for the last week of the month",
      headline1: "Fifty invoice PDFs in.",
      headlineAccent: "One clean spreadsheet",
      headlineEnd: " out.",
      sub: "Drop a stack of invoices and get every supplier, date, tax figure and total extracted into Excel — with a confidence score on each field so you know exactly what to double-check.",
      ctaPrimary: "Convert your first batch",
      ctaSecondary: "See it work",
      note: "No sign-up · No credit card · A full batch of 50 in about 3 minutes",
    },
    preview: {
      url: "invoiceflow.ai/workspace",
      extracting: "Extracting invoice data…",
      extracted: (n: number) => `${n} invoices extracted`,
      note: "Low-confidence fields are flagged, not guessed — the 72% row is an invoice with no due date printed on it.",
      columns: { file: "File", supplier: "Supplier", number: "Invoice #", date: "Date", total: "Total" },
    },
    howItWorks: {
      kicker: "How it works",
      titleStart: "Four steps from folder to",
      titleAccent: "spreadsheet",
      steps: [
        { title: "Upload", body: "Drag in 1 to 50 invoice PDFs at once. No templates to configure, no mapping to set up." },
        { title: "Extract", body: "Each invoice is read for supplier, numbers, dates, currency, tax and totals — in parallel." },
        { title: "Review", body: "Every field carries a confidence score. Click any value to correct it before you export." },
        { title: "Export", body: "One click produces a formatted .xlsx with column totals, ready for your ledger." },
      ],
    },
    features: {
      kicker: "Why teams keep it",
      titleStart: "Built around the part that actually",
      titleAccent: "takes time",
      sub: "Reading an invoice is quick. Typing forty of them into a spreadsheet is not. That is the only problem this solves, and it solves it properly.",
      cards: [
        { title: "Confidence on every field", body: "The extractor reports how sure it is, field by field. Anything uncertain is flagged in amber so you review the three values that matter instead of re-checking all forty." },
        { title: "Batches, not one-offs", body: "Up to 50 invoices per run, processed in parallel with a live progress read-out." },
        { title: "Excel that's actually usable", body: "Typed number columns, frozen headers, filters and a totals row with live formulas." },
        { title: "Nothing stored", body: "Invoices are held in memory only long enough to read them. No database, no files at rest." },
        { title: "Mixed currencies", body: "Reads EUR, GBP, USD, JOD, AED and more — inferred from symbols when unlabelled." },
      ],
    },
    closingCta: {
      titleStart: "Stop retyping invoices into",
      titleAccent: "spreadsheets",
      sub: "Upload a batch and watch the table fill itself. It takes about as long as reading this page.",
      cta: "Convert your first batch",
    },
    footer: {
      rights: (year: number) => `© ${year} InvoiceFlow`,
    },
  },
  workspace: {
    title: "Convert Invoices",
    subtitle: "Upload, extract, review, and export — all in one place.",
    startOver: "Start over",
    steps: { upload: "Upload", extraction: "AI Extraction", review: "Review & Export" },
    unavailable: {
      title: "Extraction is temporarily unavailable",
      body: "You can still upload files. Please try extracting again shortly.",
    },
    filesReady: (n: number) => `${n} file${n === 1 ? "" : "s"} ready`,
    extractButton: (n: number) => `Extract ${n} invoice${n === 1 ? "" : "s"}`,
    extracting: "Extracting invoice data…",
    extracted: (n: number) => `${n} extracted`,
    failed: (n: number) => `${n} failed`,
    download: "Download Excel (.xlsx)",
    exporting: "Exporting…",
    retryingExtraction: "Retrying extraction…",
    toasts: {
      duplicatesSkipped: (n: number) => `Skipped ${n} file${n === 1 ? "" : "s"} already in the queue.`,
      overflowKept: (n: number) => `Only the first 50 files were kept — ${n} were not added.`,
      exportSuccessTitle: "Excel file exported",
      exportSuccessDesc: (n: number) => `${n} invoices included.`,
      exportError: "Export failed. Please try again.",
    },
    errors: {
      fileGone: "The original file is no longer available.",
      extractionFailed: "Extraction failed.",
    },
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "An overview of your invoice processing activity.",
    newBatch: "New batch",
    stats: {
      totalInvoices: "Total invoices processed",
      batchesRun: "Batches run",
      successRate: "Success rate",
      avgConfidence: "Avg. confidence",
    },
    recentBatches: "Recent batches",
    viewAll: "View all",
    empty: {
      title: "No activity yet",
      body: "Run your first batch to see stats and history here.",
      cta: "Convert invoices",
    },
    batchLabel: (id: string) => `Batch #${id}`,
    invoicesCount: (n: number) => `${n} invoices`,
    ok: (n: number) => `${n} ok`,
    failedCount: (n: number) => `${n} failed`,
  },
  history: {
    title: "History",
    subtitle: "Every batch you have processed, stored in this browser.",
    clearHistory: "Clear history",
    empty: {
      title: "No batches yet",
      body: "Batches you export from the Convert page will show up here.",
    },
    table: { batch: "Batch", date: "Date", invoices: "Invoices", status: "Status" },
    toasts: { downloaded: "Excel file downloaded", cleared: "History cleared" },
  },
  dropzone: {
    dragActive: "Drop to add them",
    dragIdle: "Drag & drop invoice PDFs",
    hint: (max: number) => `or click to browse — up to ${max} files, 15MB each`,
    errors: {
      tooMany: (max: number) => `You can upload up to ${max} files at once.`,
      tooBig: "Each file must be smaller than 15MB.",
      wrongType: "Only PDF files are supported.",
      generic: "Some files could not be added.",
    },
  },
  reviewTable: {
    columns: {
      supplier: "Supplier",
      invoiceNumber: "Invoice #",
      invoiceDate: "Invoice Date",
      dueDate: "Due Date",
      currency: "Currency",
      subtotal: "Subtotal",
      tax: "VAT / Tax",
      total: "Total",
    },
    retrying: "Retrying extraction…",
    file: "File",
    retry: "Retry extraction",
    remove: "Remove",
    confidenceTooltip: "AI confidence — click the value to correct it",
    extractionFailedFallback: "Extraction failed.",
  },
};

export default en;
