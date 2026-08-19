# Sample invoices

Six synthetic invoice PDFs for testing and demos. No real supplier or
customer data — safe to use in screen recordings and public demos.

They deliberately cover the cases that break naive extractors:

| File | Supplier | Currency | Notable case |
|------|----------|----------|--------------|
| invoice-01.pdf | Nimbus Cloud Services Ltd | EUR | Standard layout, 19% VAT |
| invoice-02.pdf | Cedar Wood Furniture | JOD | A4 page size, 16% VAT |
| invoice-03.pdf | Meridian Legal Partners | GBP | Minimal header layout, single line item |
| invoice-04.pdf | TechnoParts Trading Co. | USD | **No due date and no VAT line** |
| invoice-05.pdf | Sahara Logistics FZE | AED | Non-Latin currency code, 5% VAT |
| invoice-06.pdf | Blue Ridge Marketing | USD | Minimal layout, fractional 7.5% VAT |

## Expected values

Use these to verify extraction accuracy after any change to the prompt or model.

| File | Invoice # | Invoice date | Due date | Subtotal | VAT | Total |
|------|-----------|--------------|----------|----------|-----|-------|
| 01 | NCS-2026-0881 | 2026-07-03 | 2026-08-02 | 980.00 | 186.20 | 1166.20 |
| 02 | CWF/4471 | 2026-06-15 | 2026-07-15 | 1182.00 | 189.12 | 1371.12 |
| 03 | INV 90233 | 2026-08-01 | 2026-08-31 | 2160.00 | 432.00 | 2592.00 |
| 04 | TP-55120 | 2026-05-22 | *(none)* | 1707.50 | 0.00 | 1707.50 |
| 05 | SL2026/331 | 2026-07-28 | 2026-09-11 | 3650.00 | 182.50 | 3832.50 |
| 06 | BRM-0042 | 2026-08-09 | 2026-09-08 | 2875.00 | 215.62 | 3090.62 |

On the last verified run, all 48 fields were extracted correctly. Invoice 04's
missing due date was correctly returned empty with a low confidence score,
which is the intended behaviour — low confidence flags a field for review
rather than inventing a value.
