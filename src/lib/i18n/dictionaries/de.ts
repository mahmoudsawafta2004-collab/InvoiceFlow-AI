import type { Dictionary } from "../dictionary-type";

const de: Dictionary = {
  nav: {
    convert: "Konvertieren",
    convertHint: "Rechnungen hochladen und exportieren",
    dashboard: "Dashboard",
    dashboardHint: "Summen über Ihre Stapel",
    history: "Verlauf",
    historyHint: "Frühere Exporte erneut herunterladen",
    backToHome: "Zurück zur Startseite",
    menu: "Menü",
    language: "Sprache",
    terms: "AGB",
    privacy: "Datenschutz",
    admin: "Admin",
    signOut: "Abmelden",
  },
  landing: {
    nav: {
      tryFree: "Kostenlos testen",
    },
    hero: {
      kicker: "Gemacht für die letzte Woche des Monats",
      headline1: "Fünfzig Rechnungs-PDFs rein.",
      headlineAccent: "Eine saubere Tabelle",
      headlineEnd: " raus.",
      sub: "Legen Sie einen Stapel Rechnungen ab und erhalten Sie jeden Lieferanten, jedes Datum, jeden Steuerbetrag und jede Summe in Excel — mit einem Konfidenzwert pro Feld, damit Sie genau wissen, was Sie prüfen müssen.",
      ctaPrimary: "Ersten Stapel konvertieren",
      ctaSecondary: "In Aktion sehen",
      note: "Keine Anmeldung · Keine Kreditkarte · Ein voller Stapel von 50 in etwa 3 Minuten",
    },
    preview: {
      url: "InvoiceFlow",
      extracting: "Rechnungsdaten werden extrahiert…",
      extracted: (n) => `${n} Rechnungen extrahiert`,
      note: "Felder mit geringer Konfidenz werden markiert, nicht geraten — die Zeile mit 72% ist eine Rechnung ohne aufgedrucktes Fälligkeitsdatum.",
      columns: { file: "Datei", supplier: "Lieferant", number: "Rechnungsnr.", date: "Datum", total: "Summe" },
    },
    howItWorks: {
      kicker: "So funktioniert's",
      titleStart: "Vier Schritte vom Ordner zur",
      titleAccent: "Tabelle",
      steps: [
        { title: "Hochladen", body: "Ziehen Sie 1 bis 50 Rechnungs-PDFs auf einmal hinein. Keine Vorlagen zu konfigurieren, kein Mapping einzurichten." },
        { title: "Extrahieren", body: "Jede Rechnung wird auf Lieferant, Nummern, Daten, Währung, Steuer und Summen gelesen — parallel." },
        { title: "Prüfen", body: "Jedes Feld trägt einen Konfidenzwert. Klicken Sie auf einen Wert, um ihn vor dem Export zu korrigieren." },
        { title: "Exportieren", body: "Ein Klick erzeugt eine formatierte .xlsx mit Spaltensummen, bereit für Ihre Buchhaltung." },
      ],
    },
    features: {
      kicker: "Warum Teams dabei bleiben",
      titleStart: "Gebaut um den Teil, der wirklich",
      titleAccent: "Zeit kostet",
      sub: "Eine Rechnung zu lesen geht schnell. Vierzig davon in eine Tabelle zu tippen nicht. Genau dieses Problem wird hier gelöst — und zwar richtig.",
      cards: [
        { title: "Konfidenz für jedes Feld", body: "Der Extraktor gibt Feld für Feld an, wie sicher er sich ist. Unsicheres wird gelb markiert, damit Sie die drei entscheidenden Werte prüfen statt aller vierzig." },
        { title: "Stapel, keine Einzelfälle", body: "Bis zu 50 Rechnungen pro Durchlauf, parallel verarbeitet mit Live-Fortschrittsanzeige." },
        { title: "Ein Excel, das wirklich nutzbar ist", body: "Typisierte Zahlenspalten, fixierte Kopfzeilen, Filter und eine Summenzeile mit aktiven Formeln." },
        { title: "Nichts wird gespeichert", body: "Rechnungen bleiben nur so lange im Arbeitsspeicher, wie sie zum Lesen gebraucht werden. Keine Datenbank, keine gespeicherten Dateien." },
        { title: "Gemischte Währungen", body: "Liest EUR, GBP, USD, JOD, AED und mehr — bei fehlender Kennzeichnung aus dem Symbol abgeleitet." },
      ],
    },
    pricing: {
      kicker: "Preise",
      titleStart: "Kostenlos starten.",
      titleAccent: "Skalieren",
      titleEnd: "wenn es sich lohnt.",
      sub: "Jeder Plan bietet dieselbe Extraktionsqualität — der Unterschied ist, wie viele Rechnungen Sie monatlich verarbeiten können.",
      featureInvoices: (n: number) => `${n.toLocaleString()} Rechnungen / Monat`,
      featureConfidence: "Extraktion mit Konfidenzwert",
      featureExcel: "Excel-Export mit Summen",
      mostPopular: "Meistgewählt",
      startFree: "Kostenlos starten",
      choose: (name: string) => `${name} wählen`,
      perMonth: "/Monat",
      note: "Preise in USD. Jederzeit im Dashboard kündbar.",
    },
    closingCta: {
      titleStart: "Hören Sie auf, Rechnungen erneut in",
      titleAccent: "Tabellen",
      sub: "Laden Sie einen Stapel hoch und sehen Sie zu, wie sich die Tabelle von selbst füllt. Das dauert etwa so lange wie das Lesen dieser Seite.",
      cta: "Ersten Stapel konvertieren",
    },
    footer: {
      rights: (year) => `© ${year} InvoiceFlow`,
    },
  },
  workspace: {
    title: "Rechnungen konvertieren",
    subtitle: "Hochladen, extrahieren, prüfen und exportieren — alles an einem Ort.",
    startOver: "Neu starten",
    steps: { upload: "Hochladen", extraction: "KI-Extraktion", review: "Prüfen & exportieren" },
    unavailable: {
      title: "Extraktion vorübergehend nicht verfügbar",
      body: "Sie können weiterhin Dateien hochladen. Versuchen Sie die Extraktion in Kürze erneut.",
    },
    filesReady: (n) => `${n} Datei${n === 1 ? "" : "en"} bereit`,
    extractButton: (n) => `${n} Rechnung${n === 1 ? "" : "en"} extrahieren`,
    extracting: "Rechnungsdaten werden extrahiert…",
    extracted: (n) => `${n} extrahiert`,
    failed: (n) => `${n} fehlgeschlagen`,
    download: "Excel herunterladen (.xlsx)",
    exporting: "Wird exportiert…",
    retryingExtraction: "Extraktion wird erneut versucht…",
    toasts: {
      duplicatesSkipped: (n) => `${n} Datei${n === 1 ? "" : "en"} bereits in der Warteschlange übersprungen.`,
      overflowKept: (n) => `Nur die ersten 50 Dateien wurden behalten — ${n} wurden nicht hinzugefügt.`,
      exportSuccessTitle: "Excel-Datei exportiert",
      exportSuccessDesc: (n) => `${n} Rechnungen enthalten.`,
      exportError: "Export fehlgeschlagen. Bitte erneut versuchen.",
    },
    errors: {
      fileGone: "Die Originaldatei ist nicht mehr verfügbar.",
      extractionFailed: "Extraktion fehlgeschlagen.",
    },
  },
  dashboard: {
    title: "Dashboard",
    subtitle: "Ein Überblick über Ihre Rechnungsverarbeitung.",
    newBatch: "Neuer Stapel",
    stats: {
      totalInvoices: "Verarbeitete Rechnungen insgesamt",
      batchesRun: "Ausgeführte Stapel",
      successRate: "Erfolgsquote",
      avgConfidence: "Ø Konfidenz",
    },
    recentBatches: "Letzte Stapel",
    viewAll: "Alle anzeigen",
    empty: {
      title: "Noch keine Aktivität",
      body: "Führen Sie Ihren ersten Stapel aus, um hier Statistiken und Verlauf zu sehen.",
      cta: "Rechnungen konvertieren",
    },
    batchLabel: (id) => `Stapel #${id}`,
    invoicesCount: (n) => `${n} Rechnungen`,
    ok: (n) => `${n} ok`,
    failedCount: (n) => `${n} fehlgeschlagen`,
  },
  history: {
    title: "Verlauf",
    subtitle: "Jeder Stapel, den Sie verarbeitet haben, gespeichert in diesem Browser.",
    clearHistory: "Verlauf löschen",
    empty: {
      title: "Noch keine Stapel",
      body: "Stapel, die Sie über die Konvertieren-Seite exportieren, erscheinen hier.",
    },
    table: { batch: "Stapel", date: "Datum", invoices: "Rechnungen", status: "Status" },
    toasts: { downloaded: "Excel-Datei heruntergeladen", cleared: "Verlauf gelöscht" },
  },
  dropzone: {
    dragActive: "Zum Hinzufügen ablegen",
    dragIdle: "Rechnungs-PDFs per Drag & Drop ablegen",
    hint: (max) => `oder klicken zum Durchsuchen — bis zu ${max} Dateien, je 15MB`,
    errors: {
      tooMany: (max) => `Sie können bis zu ${max} Dateien auf einmal hochladen.`,
      tooBig: "Jede Datei muss kleiner als 15MB sein.",
      wrongType: "Nur PDF-Dateien werden unterstützt.",
      generic: "Einige Dateien konnten nicht hinzugefügt werden.",
    },
  },
  reviewTable: {
    columns: {
      supplier: "Lieferant",
      invoiceNumber: "Rechnungsnr.",
      invoiceDate: "Rechnungsdatum",
      dueDate: "Fälligkeitsdatum",
      currency: "Währung",
      subtotal: "Zwischensumme",
      tax: "MwSt. / Steuer",
      total: "Summe",
    },
    retrying: "Extraktion wird erneut versucht…",
    file: "Datei",
    retry: "Extraktion wiederholen",
    remove: "Entfernen",
    confidenceTooltip: "KI-Konfidenz — auf den Wert klicken, um ihn zu korrigieren",
    extractionFailedFallback: "Extraktion fehlgeschlagen.",
  },
  legal: {
    backToHome: "Zurück zur Startseite",
    lastUpdated: (date: string) => `Zuletzt aktualisiert: ${date}`,
    terms: {
      title: "Nutzungsbedingungen",
      updated: "20. August 2026",
      sections: [
        {
          heading: "1. Vertragspartner",
          body: `Diese Bedingungen regeln Ihre Nutzung von InvoiceFlow (der „Dienst"), betrieben von InvoiceFlow Inc. („wir"). Mit der Erstellung eines Kontos stimmen Sie diesen Bedingungen und unserer Datenschutzerklärung zu.`,
        },
        {
          heading: "2. Was der Dienst tut",
          body: "InvoiceFlow nimmt von Ihnen hochgeladene Rechnungs-PDFs entgegen, sendet sie zur Extraktion strukturierter Daten an ein KI-Modell eines Drittanbieters und ermöglicht Ihnen den Export der Ergebnisse als Tabelle. Wir überprüfen die Genauigkeit der extrahierten Daten nicht — Sie sind dafür verantwortlich, diese vor der Verwendung für Buchhaltungs-, Steuer- oder Finanzberichtszwecke zu prüfen.",
        },
        {
          heading: "3. Konten",
          body: "Sie müssen bei der Kontoerstellung korrekte Angaben machen und Ihre Zugangsdaten sicher aufbewahren. Sie sind für Aktivitäten unter Ihrem Konto verantwortlich.",
        },
        {
          heading: "4. Tarife, Abrechnung und Kündigung",
          body: "Kostenpflichtige Tarife werden monatlich im Voraus abgerechnet und verlängern sich automatisch bis zur Kündigung. Sie können jederzeit über Ihr Dashboard kündigen; die Kündigung wird zum Ende des laufenden Abrechnungszeitraums wirksam, und wir erstatten anteilige Zeiträume nicht, außer gesetzlich vorgeschrieben. Wir können Preise oder Limits der Tarife ändern; Änderungen gelten für künftige Abrechnungszeiträume, nicht für einen bereits bezahlten.",
        },
        {
          heading: "5. Zulässige Nutzung",
          body: "Nutzen Sie den Dienst nicht, um Dokumente zu verarbeiten, zu deren Verarbeitung Sie nicht berechtigt sind, um den Dienst zu stören oder zu überlasten, oder um Nutzungslimits zu umgehen.",
        },
        {
          heading: "6. Haftungsausschluss",
          body: `Der Dienst wird „wie besehen" bereitgestellt. KI-extrahierte Daten können Fehler enthalten — deshalb trägt jedes Feld einen Konfidenzwert, und Sie sollten Felder mit niedriger Konfidenz vor der Nutzung prüfen. Wir haften nicht für Entscheidungen, die auf Basis extrahierter Daten getroffen wurden.`,
        },
        {
          heading: "7. Kündigung durch uns",
          body: "Wir können Konten sperren oder kündigen, die gegen diese Bedingungen verstoßen. Sie können die Nutzung des Dienstes jederzeit beenden und Ihr Konto löschen.",
        },
        {
          heading: "8. Anwendbares Recht",
          body: "Diese Bedingungen unterliegen dem Recht des US-Bundesstaats Delaware, ohne Berücksichtigung des Kollisionsrechts.",
        },
        {
          heading: "9. Kontakt",
          body: "Fragen zu diesen Bedingungen: legal@invoiceflow.company · +1 (555) 010-0199.",
        },
      ],
    },
    privacy: {
      title: "Datenschutzerklärung",
      updated: "20. August 2026",
      sections: [
        {
          heading: "1. Was wir erheben",
          items: [
            "Kontoinformationen: Name, E-Mail und Authentifizierungsdaten (auch bei Anmeldung über Google, falls genutzt).",
            "Zahlungsinformationen: werden direkt von Stripe verarbeitet — wir sehen oder speichern Ihre Kartennummer nie.",
            "Von Ihnen hochgeladene Rechnungsdateien, nur für die Dauer der Datenextraktion.",
            "Nutzungsdaten: Ihr aktueller Tarif und die Anzahl verarbeiteter Rechnungen, zur Durchsetzung der Tariflimits.",
          ],
        },
        {
          heading: "2. Umgang mit Rechnungsdateien",
          body: "Hochgeladene PDFs werden zur Extraktion an Googles Gemini-API gesendet und danach nicht auf unseren Servern gespeichert — wir halten eine Datei nur so lange im Speicher, wie nötig ist, um sie weiterzuleiten und das Ergebnis zurückzugeben. Wir verwenden Ihre Rechnungsinhalte nicht zum Training von Modellen.",
        },
        {
          heading: "3. Mit wem wir Daten teilen",
          items: [
            "Supabase — hostet unsere Datenbank und übernimmt die Authentifizierung.",
            "Stripe — verarbeitet Zahlungen und speichert Abrechnungsdaten.",
            "Google (Gemini API) — verarbeitet Rechnungsinhalte zur Datenextraktion.",
          ],
          body: "Wir verkaufen Ihre Daten nicht.",
        },
        {
          heading: "4. Datenspeicherung",
          body: "Wir bewahren Konto- und Nutzungsdaten auf, solange Ihr Konto aktiv ist. Sie können die Löschung Ihres Kontos und der zugehörigen Daten jederzeit bei uns beantragen.",
        },
        {
          heading: "5. Ihre Rechte",
          body: "Je nach Wohnort haben Sie möglicherweise das Recht, auf Ihre personenbezogenen Daten zuzugreifen, sie zu berichtigen oder zu löschen, sowie bestimmter Verarbeitung zu widersprechen. Kontaktieren Sie uns, um diese Rechte auszuüben.",
        },
        {
          heading: "6. Sicherheit",
          body: "Daten werden bei der Übertragung verschlüsselt. Der Zugriff auf Produktionsdaten ist auf das für den Betrieb des Dienstes Notwendige beschränkt.",
        },
        {
          heading: "7. Kontakt",
          body: "Fragen zu dieser Richtlinie: legal@invoiceflow.company · +1 (555) 010-0199.",
        },
      ],
    },
  },
};

export default de;
