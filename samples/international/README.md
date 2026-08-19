# Non-English sample invoices

Four synthetic invoices in Arabic, French, German and Spanish. No real
supplier data — safe for demos and screen recordings.

They exist to demonstrate something the product does without any extra
configuration: the extractor reads invoices in languages other than English,
and normalises what it finds into a single consistent output.

## Verified results

All 32 fields extracted correctly on the last run.

| File | Supplier | Invoice # | Currency | Subtotal | Tax | Total |
|------|----------|-----------|----------|----------|-----|-------|
| ar-invoice.pdf | شركة الأفق للتجارة العامة | 2026/447-ب | JOD | 3150 | 504 | 3654 |
| fr-invoice.pdf | Imprimerie Lumière SARL | FR-2026-3391 | EUR | 1840 | 368 | 2208 |
| de-invoice.pdf | Bergmann Werkzeuge GmbH | DE-88214 | EUR | 1245 | 236.55 | 1481.55 |
| es-invoice.pdf | Cerámicas del Sur S.L. | ES/2026/0562 | EUR | 2960 | 621.60 | 3581.60 |

## What these prove

The interesting part is not that the text was read, but that it was
**normalised** — three conventions that trip up naive extractors were handled
correctly:

- **Date order.** The French invoice prints `12/06/2026` and the German one
  `03.08.2026`. Both came back as ISO dates with day and month the right way
  round — `2026-06-12` and `2026-08-03`. A parser that assumed US ordering
  would have silently returned the wrong month.
- **Decimal separators.** German and Spanish invoices write `1.245,00` where
  the dot groups thousands and the comma marks decimals — the reverse of
  English. Both produced the correct numbers.
- **Currency naming.** The Arabic invoice never prints a currency code; it
  says "دينار أردني" in words. It was resolved to `JOD`.

Right-to-left Arabic text is returned as-is and lands correctly in the Excel
export, which handles RTL strings natively.

## A limitation worth knowing

The interface itself is English only. These samples show that *invoice*
language is not a constraint; they do not mean the UI is translated.
