import Link from "next/link";
import {
  ArrowRight,
  UploadCloud,
  ScanEye,
  ClipboardCheck,
  Download,
  Gauge,
  ShieldCheck,
  Zap,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/footer";

const steps = [
  {
    icon: UploadCloud,
    title: "Upload",
    description:
      "Drag and drop 1 to 50 invoice PDFs at once. No formatting or setup required.",
  },
  {
    icon: ScanEye,
    title: "AI Extraction",
    description:
      "Our AI reads every invoice and pulls supplier, dates, tax, and totals automatically.",
  },
  {
    icon: ClipboardCheck,
    title: "Review",
    description:
      "Check the results in a clean table, edit anything, and see a confidence score per field.",
  },
  {
    icon: Download,
    title: "Export",
    description:
      "One click and you get a structured .xlsx file, ready for your accounting workflow.",
  },
];

const features = [
  {
    icon: Zap,
    title: "Minutes, not hours",
    description: "Process a stack of 50 invoices in the time it takes to make coffee.",
  },
  {
    icon: Gauge,
    title: "Confidence scoring",
    description: "Know exactly which fields to double-check before you trust the numbers.",
  },
  {
    icon: ShieldCheck,
    title: "Built for accountants",
    description: "Clean exports that map directly onto the columns your workflow expects.",
  },
];

const fields = [
  "Supplier Name",
  "Invoice Number",
  "Invoice Date",
  "Due Date",
  "Currency",
  "Subtotal",
  "VAT / Tax",
  "Total Amount",
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,rgba(79,70,229,0.08),transparent)]" />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-20 text-center sm:pt-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            AI-powered invoice extraction
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-neutral-900 sm:text-5xl">
            Turn a stack of invoice PDFs into a clean Excel file — in seconds
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-neutral-500">
            Upload up to 50 invoices at once. InvoiceFlow AI reads, extracts, and
            organizes every line so you never re-type an invoice again.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/workspace">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Start converting free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View live demo
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-neutral-400">
            No credit card required · A full batch of 50 invoices in about 3 minutes
          </p>
        </div>

        {/* Preview card */}
        <div className="mx-auto max-w-5xl px-6 pb-24">
          <Card className="overflow-hidden border-neutral-200 shadow-xl shadow-neutral-900/5">
            <div className="flex items-center gap-1.5 border-b border-neutral-100 bg-neutral-50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
              <span className="ml-3 text-xs text-neutral-400">invoiceflow.ai/workspace</span>
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 divide-y divide-neutral-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="p-6">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-400">
                    Extracted fields
                  </p>
                  <ul className="space-y-2.5">
                    {fields.map((f) => (
                      <li key={f} className="flex items-center justify-between text-sm">
                        <span className="text-neutral-600">{f}</span>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center gap-4 bg-neutral-50/60 p-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                      Batch summary
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-neutral-900">42 / 42</p>
                    <p className="text-sm text-neutral-500">invoices extracted successfully</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                    <Gauge className="h-4 w-4" />
                    96% average confidence
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-neutral-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
              How it works
            </h2>
            <p className="mt-3 text-neutral-500">
              Four steps between a folder of PDFs and a spreadsheet your team can use.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50">
                  <step.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="mt-4 text-xs font-semibold text-indigo-600">
                  STEP {i + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="border-neutral-200">
                <CardContent className="p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900">
                    <f.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-neutral-900">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-neutral-200 bg-neutral-900 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Stop typing invoices into spreadsheets by hand
          </h2>
          <p className="mt-3 text-neutral-400">
            Upload your first batch and see the extracted results in minutes.
          </p>
          <Link href="/workspace">
            <Button size="lg" className="mt-8 bg-white text-neutral-900 hover:bg-neutral-100">
              Try InvoiceFlow AI free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
