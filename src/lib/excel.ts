import ExcelJS from "exceljs";
import type { InvoiceRow } from "./types";

export async function buildInvoiceWorkbook(rows: InvoiceRow[]): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "InvoiceFlow AI";
  workbook.created = new Date();

  const sheet = workbook.addWorksheet("Invoices", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  sheet.columns = [
    { header: "File Name", key: "fileName", width: 28 },
    { header: "Supplier Name", key: "supplierName", width: 26 },
    { header: "Invoice Number", key: "invoiceNumber", width: 18 },
    { header: "Invoice Date", key: "invoiceDate", width: 14 },
    { header: "Due Date", key: "dueDate", width: 14 },
    { header: "Currency", key: "currency", width: 10 },
    { header: "Subtotal", key: "subtotal", width: 14 },
    { header: "VAT / Tax", key: "tax", width: 14 },
    { header: "Total Amount", key: "total", width: 16 },
    { header: "Status", key: "status", width: 12 },
  ];

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1E1B4B" },
  };
  headerRow.height = 22;
  headerRow.alignment = { vertical: "middle" };

  const successRows = rows.filter((r) => r.status === "done" && r.data);
  const errorRows = rows.filter((r) => r.status === "error");

  for (const row of successRows) {
    const d = row.data!;
    sheet.addRow({
      fileName: row.fileName,
      supplierName: d.supplierName.value,
      invoiceNumber: d.invoiceNumber.value,
      invoiceDate: d.invoiceDate.value,
      dueDate: d.dueDate.value,
      currency: d.currency.value,
      subtotal: d.subtotal.value,
      tax: d.tax.value,
      total: d.total.value,
      status: "Extracted",
    });
  }

  for (const row of errorRows) {
    const r = sheet.addRow({
      fileName: row.fileName,
      status: "Failed",
    });
    r.font = { color: { argb: "FFB91C1C" }, italic: true };
  }

  sheet.getColumn("subtotal").numFmt = "#,##0.00";
  sheet.getColumn("tax").numFmt = "#,##0.00";
  sheet.getColumn("total").numFmt = "#,##0.00";

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    row.eachCell((cell) => {
      cell.border = {
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    });
  });

  sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: sheet.columns.length },
  };

  const totalRow = sheet.addRow({
    fileName: "",
    supplierName: "",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    currency: "TOTAL",
    subtotal: { formula: `SUM(G2:G${successRows.length + 1})` },
    tax: { formula: `SUM(H2:H${successRows.length + 1})` },
    total: { formula: `SUM(I2:I${successRows.length + 1})` },
  });
  totalRow.font = { bold: true };
  totalRow.eachCell((cell) => {
    cell.border = { top: { style: "medium", color: { argb: "FF1E1B4B" } } };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
