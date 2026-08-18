export type FieldKey =
  | "supplierName"
  | "invoiceNumber"
  | "invoiceDate"
  | "dueDate"
  | "currency"
  | "subtotal"
  | "tax"
  | "total";

export interface ExtractedField<T = string> {
  value: T;
  confidence: number; // 0-1
}

export interface InvoiceData {
  supplierName: ExtractedField;
  invoiceNumber: ExtractedField;
  invoiceDate: ExtractedField;
  dueDate: ExtractedField;
  currency: ExtractedField;
  subtotal: ExtractedField<number>;
  tax: ExtractedField<number>;
  total: ExtractedField<number>;
}

export type InvoiceRowStatus =
  | "queued"
  | "processing"
  | "done"
  | "error";

export interface InvoiceRow {
  id: string;
  fileName: string;
  fileSize: number;
  status: InvoiceRowStatus;
  data?: InvoiceData;
  error?: string;
}

export interface Batch {
  id: string;
  createdAt: string;
  rowCount: number;
  successCount: number;
  errorCount: number;
  rows: InvoiceRow[];
}

export const FIELD_LABELS: Record<FieldKey, string> = {
  supplierName: "Supplier Name",
  invoiceNumber: "Invoice Number",
  invoiceDate: "Invoice Date",
  dueDate: "Due Date",
  currency: "Currency",
  subtotal: "Subtotal",
  tax: "VAT / Tax",
  total: "Total Amount",
};
