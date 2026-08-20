import type { Dictionary } from "../dictionary-type";

const fr: Dictionary = {
  nav: {
    convert: "Convertir",
    convertHint: "Importez des factures et exportez",
    dashboard: "Tableau de bord",
    dashboardHint: "Totaux de vos lots",
    history: "Historique",
    historyHint: "Retéléchargez vos exports",
    backToHome: "Retour à l'accueil",
    menu: "Menu",
    language: "Langue",
    terms: "Conditions",
    privacy: "Confidentialité",
    admin: "Admin",
    signOut: "Se déconnecter",
  },
  landing: {
    nav: {
      tryFree: "Essayer gratuitement",
    },
    hero: {
      kicker: "Conçu pour la dernière semaine du mois",
      headline1: "Cinquante factures PDF en entrée.",
      headlineAccent: "Un tableau propre",
      headlineEnd: " en sortie.",
      sub: "Déposez un lot de factures et récupérez chaque fournisseur, date, montant de taxe et total extrait dans Excel — avec un score de confiance sur chaque champ pour savoir exactement quoi vérifier.",
      ctaPrimary: "Convertir votre premier lot",
      ctaSecondary: "Voir en action",
      note: "Sans inscription · Sans carte bancaire · Un lot complet de 50 en environ 3 minutes",
    },
    preview: {
      url: "InvoiceFlow",
      extracting: "Extraction des données de facture…",
      extracted: (n) => `${n} factures extraites`,
      note: "Les champs peu fiables sont signalés, pas devinés — la ligne à 72% est une facture sans date d'échéance imprimée.",
      columns: { file: "Fichier", supplier: "Fournisseur", number: "N° facture", date: "Date", total: "Total" },
    },
    howItWorks: {
      kicker: "Comment ça marche",
      titleStart: "Quatre étapes du dossier au",
      titleAccent: "tableau",
      steps: [
        { title: "Importer", body: "Glissez de 1 à 50 factures PDF à la fois. Aucun modèle à configurer, aucun mappage à définir." },
        { title: "Extraire", body: "Chaque facture est lue pour le fournisseur, les numéros, les dates, la devise, la taxe et les totaux — en parallèle." },
        { title: "Vérifier", body: "Chaque champ porte un score de confiance. Cliquez sur une valeur pour la corriger avant l'export." },
        { title: "Exporter", body: "Un clic produit un .xlsx formaté avec des totaux par colonne, prêt pour votre comptabilité." },
      ],
    },
    features: {
      kicker: "Pourquoi les équipes l'adoptent",
      titleStart: "Conçu autour de la partie qui prend vraiment",
      titleAccent: "du temps",
      sub: "Lire une facture est rapide. En saisir quarante dans un tableur ne l'est pas. C'est le seul problème que ceci résout, et il le résout correctement.",
      cards: [
        { title: "Confiance sur chaque champ", body: "L'extracteur indique son degré de certitude champ par champ. Tout ce qui est incertain est signalé en ambre pour que vous vérifiiez les trois valeurs qui comptent plutôt que les quarante." },
        { title: "Des lots, pas des cas isolés", body: "Jusqu'à 50 factures par exécution, traitées en parallèle avec une progression en temps réel." },
        { title: "Un Excel vraiment exploitable", body: "Colonnes numériques typées, en-têtes figés, filtres et une ligne de totaux avec formules actives." },
        { title: "Rien n'est stocké", body: "Les factures restent en mémoire juste le temps d'être lues. Aucune base de données, aucun fichier conservé." },
        { title: "Devises multiples", body: "Lit EUR, GBP, USD, JOD, AED et plus — déduites du symbole quand elles ne sont pas indiquées." },
      ],
    },
    pricing: {
      kicker: "Tarifs",
      titleStart: "Commencez gratuitement.",
      titleAccent: "Évoluez",
      titleEnd: "quand ça le mérite.",
      sub: "Chaque forfait offre la même qualité d'extraction — la différence est le nombre de factures traitées chaque mois.",
      featureInvoices: (n: number) => `${n.toLocaleString()} factures / mois`,
      featureConfidence: "Extraction avec score de confiance",
      featureExcel: "Export Excel avec totaux",
      mostPopular: "Le plus choisi",
      startFree: "Commencer gratuitement",
      choose: (name: string) => `Choisir ${name}`,
      perMonth: "/mois",
      note: "Prix affichés en USD. Annulez à tout moment depuis votre tableau de bord.",
    },
    closingCta: {
      titleStart: "Arrêtez de ressaisir les factures dans des",
      titleAccent: "tableurs",
      sub: "Importez un lot et regardez le tableau se remplir tout seul. Ça prend à peu près le temps de lire cette page.",
      cta: "Convertir votre premier lot",
    },
    footer: {
      rights: (year) => `© ${year} InvoiceFlow`,
    },
  },
  workspace: {
    title: "Convertir des factures",
    subtitle: "Importez, extrayez, vérifiez et exportez — tout au même endroit.",
    startOver: "Recommencer",
    steps: { upload: "Import", extraction: "Extraction IA", review: "Vérification et export" },
    unavailable: {
      title: "L'extraction est temporairement indisponible",
      body: "Vous pouvez toujours importer des fichiers. Réessayez l'extraction sous peu.",
    },
    filesReady: (n) => `${n} fichier${n === 1 ? "" : "s"} prêt${n === 1 ? "" : "s"}`,
    extractButton: (n) => `Extraire ${n} facture${n === 1 ? "" : "s"}`,
    extracting: "Extraction des données de facture…",
    extracted: (n) => `${n} extraites`,
    failed: (n) => `${n} échouées`,
    download: "Télécharger Excel (.xlsx)",
    exporting: "Export en cours…",
    retryingExtraction: "Nouvelle tentative d'extraction…",
    toasts: {
      duplicatesSkipped: (n) => `${n} fichier${n === 1 ? "" : "s"} déjà dans la file ignoré${n === 1 ? "" : "s"}.`,
      overflowKept: (n) => `Seuls les 50 premiers fichiers ont été conservés — ${n} n'ont pas été ajoutés.`,
      exportSuccessTitle: "Fichier Excel exporté",
      exportSuccessDesc: (n) => `${n} factures incluses.`,
      exportError: "Échec de l'export. Réessayez.",
    },
    errors: {
      fileGone: "Le fichier d'origine n'est plus disponible.",
      extractionFailed: "L'extraction a échoué.",
    },
  },
  dashboard: {
    title: "Tableau de bord",
    subtitle: "Un aperçu de votre activité de traitement des factures.",
    newBatch: "Nouveau lot",
    stats: {
      totalInvoices: "Total des factures traitées",
      batchesRun: "Lots exécutés",
      successRate: "Taux de réussite",
      avgConfidence: "Confiance moyenne",
    },
    recentBatches: "Lots récents",
    viewAll: "Tout voir",
    empty: {
      title: "Aucune activité pour l'instant",
      body: "Exécutez votre premier lot pour voir les statistiques et l'historique ici.",
      cta: "Convertir des factures",
    },
    batchLabel: (id) => `Lot #${id}`,
    invoicesCount: (n) => `${n} factures`,
    ok: (n) => `${n} ok`,
    failedCount: (n) => `${n} échouées`,
  },
  history: {
    title: "Historique",
    subtitle: "Chaque lot que vous avez traité, stocké dans ce navigateur.",
    clearHistory: "Effacer l'historique",
    empty: {
      title: "Aucun lot pour l'instant",
      body: "Les lots que vous exportez depuis la page Convertir apparaîtront ici.",
    },
    table: { batch: "Lot", date: "Date", invoices: "Factures", status: "Statut" },
    toasts: { downloaded: "Fichier Excel téléchargé", cleared: "Historique effacé" },
  },
  dropzone: {
    dragActive: "Déposez pour les ajouter",
    dragIdle: "Glissez-déposez des factures PDF",
    hint: (max) => `ou cliquez pour parcourir — jusqu'à ${max} fichiers, 15 Mo chacun`,
    errors: {
      tooMany: (max) => `Vous pouvez importer jusqu'à ${max} fichiers à la fois.`,
      tooBig: "Chaque fichier doit faire moins de 15 Mo.",
      wrongType: "Seuls les fichiers PDF sont pris en charge.",
      generic: "Certains fichiers n'ont pas pu être ajoutés.",
    },
  },
  reviewTable: {
    columns: {
      supplier: "Fournisseur",
      invoiceNumber: "N° facture",
      invoiceDate: "Date de facture",
      dueDate: "Date d'échéance",
      currency: "Devise",
      subtotal: "Sous-total",
      tax: "TVA / Taxe",
      total: "Total",
    },
    retrying: "Nouvelle tentative d'extraction…",
    file: "Fichier",
    retry: "Réessayer l'extraction",
    remove: "Supprimer",
    confidenceTooltip: "Confiance de l'IA — cliquez sur la valeur pour la corriger",
    extractionFailedFallback: "L'extraction a échoué.",
  },
  legal: {
    backToHome: "Retour à l'accueil",
    lastUpdated: (date: string) => `Dernière mise à jour : ${date}`,
    terms: {
      title: "Conditions d'utilisation",
      updated: "20 août 2026",
      sections: [
        {
          heading: "1. Avec qui est cet accord",
          body: `Les présentes Conditions régissent votre utilisation d'InvoiceFlow (le « Service »), exploité par InvoiceFlow Inc. (« nous »). En créant un compte, vous acceptez ces Conditions ainsi que notre Politique de confidentialité.`,
        },
        {
          heading: "2. Ce que fait le Service",
          body: "InvoiceFlow reçoit les factures PDF que vous téléversez, les envoie à un modèle d'IA tiers pour en extraire des données structurées, et vous permet d'exporter les résultats sous forme de tableur. Nous ne vérifions pas l'exactitude des données extraites — il vous appartient de les vérifier avant de vous en servir à des fins comptables, fiscales ou de reporting financier.",
        },
        {
          heading: "3. Comptes",
          body: "Vous devez fournir des informations exactes lors de la création d'un compte et protéger vos identifiants. Vous êtes responsable de l'activité effectuée sous votre compte.",
        },
        {
          heading: "4. Forfaits, facturation et résiliation",
          body: "Les forfaits payants sont facturés mensuellement à l'avance et se renouvellent automatiquement jusqu'à résiliation. Vous pouvez résilier à tout moment depuis votre tableau de bord ; la résiliation prend effet à la fin de la période de facturation en cours, et nous n'accordons pas de remboursement au prorata sauf obligation légale. Nous pouvons modifier les prix ou limites des forfaits ; les changements s'appliquent aux prochaines périodes de facturation, pas à une période déjà payée.",
        },
        {
          heading: "5. Utilisation acceptable",
          body: "N'utilisez pas le Service pour traiter des documents que vous n'avez pas le droit de traiter, pour tenter de perturber ou surcharger le Service, ou pour contourner les limites d'utilisation.",
        },
        {
          heading: "6. Avertissements",
          body: `Le Service est fourni « en l'état ». Les données extraites par IA peuvent contenir des erreurs — c'est pourquoi chaque champ porte un score de confiance, et il vous incombe de vérifier les champs à faible confiance avant utilisation. Nous ne sommes pas responsables des décisions prises sur la base de données extraites.`,
        },
        {
          heading: "7. Résiliation",
          body: "Nous pouvons suspendre ou résilier les comptes qui enfreignent ces Conditions. Vous pouvez cesser d'utiliser le Service et supprimer votre compte à tout moment.",
        },
        {
          heading: "8. Loi applicable",
          body: "Les présentes Conditions sont régies par les lois de l'État du Delaware, États-Unis, sans égard aux principes de conflit de lois.",
        },
        {
          heading: "9. Contact",
          body: "Questions sur ces Conditions : legal@invoiceflow.app · +1 (555) 010-0199.",
        },
      ],
    },
    privacy: {
      title: "Politique de confidentialité",
      updated: "20 août 2026",
      sections: [
        {
          heading: "1. Ce que nous collectons",
          items: [
            "Informations de compte : nom, e-mail et données d'authentification (y compris via la connexion Google, si vous l'utilisez).",
            "Informations de facturation : gérées directement par Stripe — nous ne voyons ni ne stockons jamais votre numéro de carte.",
            "Les fichiers de factures que vous téléversez, le temps nécessaire pour en extraire les données.",
            "Données d'utilisation : votre forfait actuel et le nombre de factures traitées, pour faire respecter les limites du forfait.",
          ],
        },
        {
          heading: "2. Comment les fichiers de factures sont traités",
          body: "Les PDF téléversés sont envoyés à l'API Gemini de Google pour l'extraction et ne sont pas stockés ensuite sur nos serveurs — nous conservons un fichier en mémoire seulement le temps de le transmettre et de renvoyer le résultat. Nous n'utilisons pas le contenu de vos factures pour entraîner un quelconque modèle.",
        },
        {
          heading: "3. Avec qui nous partageons les données",
          items: [
            "Supabase — héberge notre base de données et gère l'authentification.",
            "Stripe — traite les paiements et stocke les informations de facturation.",
            "Google (API Gemini) — traite le contenu des factures pour en extraire les données.",
          ],
          body: "Nous ne vendons pas vos données.",
        },
        {
          heading: "4. Conservation des données",
          body: "Nous conservons les données de compte et d'utilisation tant que votre compte est actif. Vous pouvez demander la suppression de votre compte et des données associées à tout moment en nous contactant.",
        },
        {
          heading: "5. Vos droits",
          body: "Selon votre lieu de résidence, vous pouvez avoir le droit d'accéder à vos données personnelles, de les corriger ou de les supprimer, et de vous opposer à certains traitements. Contactez-nous pour exercer ces droits.",
        },
        {
          heading: "6. Sécurité",
          body: "Les données sont chiffrées en transit. L'accès aux données de production est limité à ce qui est nécessaire pour exploiter le Service.",
        },
        {
          heading: "7. Contact",
          body: "Questions sur cette politique : legal@invoiceflow.app · +1 (555) 010-0199.",
        },
      ],
    },
  },
};

export default fr;
