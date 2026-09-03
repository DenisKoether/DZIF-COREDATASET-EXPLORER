/**
 * Application level texts. Catalogue entries are not translated here - they
 * live in `catalogue-de.json` / `catalogue-en.json` and are picked by language.
 * Texts rendered by Lens itself are handled via `lensTexts` at the bottom.
 */

export type Language = "de" | "en";

export type TextEntry = Record<Language, string>;

export const uiTexts = {
  /* Header */
  app_title: {
    de: "DZIF-Kerndatensatz-Explorer (Testdaten)",
    en: "DZIF Core Dataset Explorer (test data)",
  },
  logo_alt: { de: "Logo des DZIF", en: "DZIF logo" },
  language_switch_label: { de: "Sprache wählen", en: "Select language" },

  transplat_number: {
    de: "Anzahl Transplantationen",
    en: "Number of transplants",
  },

  /* Test version notice */
  notice_title: {
    de: "Hinweis zur Testversion",
    en: "Note on the test version",
  },
  notice_body: {
    de: "Diese Webapp befindet sich in einer Testphase und verwendet zufällig generierte Testdaten ohne spezifische Verteilung. Dadurch kann es zu Fehlern oder unerwarteten Ergebnissen kommen.",
    en: "This web app is in a testing phase and uses randomly generated test data without a specific distribution. Errors or unexpected results are therefore possible.",
  },
  notice_feedback: {
    de: "Fehlen Daten oder Suchelemente? Oder sind irrelevante Ergebnisse dabei? Dann freuen wir uns über euer Feedback an",
    en: "Missing data or search criteria? Or are irrelevant results showing up? We would be glad to hear your feedback at",
  },
  notice_close: { de: "Hinweis schließen", en: "Close notice" },

  /* Search bar */
  search_placeholder: {
    de: "Suchbegriff eingeben",
    en: "Type to filter conditions",
  },
  search_no_matches: {
    de: "Keine Ergebnisse gefunden",
    en: "No matches found",
  },
  search_empty_query: {
    de: "Leere Suchanfrage: Sucht nach allen Ergebnissen.",
    en: "Empty query: searches for all results.",
  },
  search_button: { de: "Suchen", en: "Search" },

  /* Catalogue */
  catalogue_heading: { de: "Suchkriterien", en: "Search criteria" },
  catalogue_more_info_before: {
    de: "Weitere Informationen zum Kerndatensatz finden Sie im",
    en: "Further information on the core dataset is available in the",
  },
  catalogue_more_info_between: {
    de: "oder als Formulare im",
    en: "or as forms in the",
  },

  /* Chart filter */
  chart_filter_button: { de: "Diagramme filtern", en: "Filter charts" },
  chart_filter_heading: { de: "Diagramme auswählen", en: "Select charts" },
  chart_filter_all: { de: "Alle", en: "All" },
  chart_filter_none: { de: "Keine", en: "None" },
  chart_filter_count: {
    de: "von {total} Diagrammen angezeigt",
    en: "of {total} charts shown",
  },

  /* Results */
  results_request_data: { de: "Daten beantragen", en: "Request data" },
  results_search_modified: {
    de: "Diagramme repräsentieren nicht mehr die aktuelle Suche!",
    en: "Charts no longer represent the current search!",
  },
  results_empty: {
    de: "Keine Ergebnisse für Ihre Suchanfrage gefunden",
    en: "No results found for your query",
  },
  results_backend_error: {
    de: "Die Suchanfrage konnte nicht ausgeführt werden. Bitte versuchen Sie es in einigen Minuten erneut.",
    en: "The query could not be executed. Please try again in a few minutes.",
  },

  /* Chart titles */
  chart_study_ttu: { de: "Studie - TTU/TI", en: "Study - TTU/TI" },
  chart_study_cohort: { de: "Studie/Kohorte", en: "Study/cohort" },
  chart_gender: { de: "Identifizierendes Geschlecht", en: "Gender identity" },
  chart_diseases: { de: "Erkrankungen", en: "Diseases" },
  chart_smoker: { de: "Raucher", en: "Smoking status" },
  chart_virus: {
    de: "Chron. Viruserkrankungen",
    en: "Chronic viral infections",
  },
  chart_cardiovascular: {
    de: "Herz-Kreislauf-Erkrankungen",
    en: "Cardiovascular diseases",
  },
  chart_diabetes: { de: "Diabetes", en: "Diabetes" },
  chart_rheumatology: {
    de: "Rheumatologische / Immunologische Erkrankungen",
    en: "Rheumatological / immunological diseases",
  },
  chart_liver: { de: "Chron. Lebererkrankungen", en: "Chronic liver diseases" },
  chart_lung: { de: "Chron. Lungenerkrankungen", en: "Chronic lung diseases" },
  chart_neuro: {
    de: "Chron. Neurologische-Erkrankungen",
    en: "Chronic neurological diseases",
  },
  chart_age: { de: "Alter bei Aufnahme", en: "Age at enrolment" },
  chart_transplants: { de: "Transplantationen", en: "Transplants" },
  chart_sites_title: {
    de: "Patienten pro Standort, TTU/TI und Studie",
    en: "Patients by site, TTU/TI and study",
  },
  sites_chart_all: { de: "Alle Standorte", en: "All sites" },
  sites_chart_trail: { de: "Navigationspfad", en: "Breadcrumb" },
  sites_chart_view: { de: "Darstellung", en: "View" },
  sites_chart_rings: { de: "Ringe", en: "Rings" },
  sites_chart_treemap: { de: "Treemap", en: "Treemap" },
  sites_chart_drill_hint: {
    de: "Auf ein Segment klicken, um eine Ebene tiefer zu gehen.",
    en: "Click a segment to drill down one level.",
  },
  sites_chart_deepest: {
    de: "Unterste Ebene - über den Pfad oben zurück.",
    en: "Deepest level - use the breadcrumb above to go back.",
  },
  sites_chart_rings_explainer: {
    de: "Der innere Ring zeigt die aktuelle Ebene, die äußeren Ringe deren Untergliederung.",
    en: "The inner ring is the current level; the outer rings break it down further.",
  },
  sites_chart_treemap_explainer: {
    de: "Die Fläche entspricht der Anzahl der Patienten.",
    en: "Area is proportional to the number of patients.",
  },
  sites_chart_level_current: { de: "Aktuelle Ebene", en: "Current level" },
  sites_chart_level_ttu: { de: "TTU/TI", en: "TTU/TI" },
  sites_chart_level_study: { de: "Studie/Kohorte", en: "Study/cohort" },
  chart_samples_liquid: { de: "Proben LIQUID", en: "Samples - liquid" },
  chart_samples_tissue: { de: "Proben Tissue", en: "Samples - tissue" },

  /* Chart axes */
  axis_affiliation: { de: "Zugehörigkeit", en: "Affiliation" },
  axis_patients: { de: "Patienten", en: "Patients" },
  axis_patient_count: { de: "Anzahl der Patienten", en: "Number of patients" },
  axis_disease_count: { de: "Anzahl Erkrankungen", en: "Number of diseases" },
  axis_sample_count: { de: "Anzahl der Proben", en: "Number of samples" },
  axis_age: { de: "Alter", en: "Age" },
  axis_sample_type: { de: "Probentyp", en: "Sample type" },
  axis_organ: { de: "Transplantiertes Organ", en: "Transplanted organ" },

  /* Data request overlay */
  negotiate_title: { de: "Datenanfrage stellen", en: "Submit a data request" },
  negotiate_close: { de: "Schließen", en: "Close" },
  negotiate_query_url: { de: "Ihre Suchanfrage-URL", en: "Your query URL" },
  negotiate_copy: { de: "Kopieren", en: "Copy" },
  negotiate_copied: {
    de: "URL in Zwischenablage kopiert!",
    en: "URL copied to clipboard!",
  },
  negotiate_qr_hint: {
    de: "Scannen Sie den QR-Code mit Ihrem Smartphone",
    en: "Scan the QR code with your smartphone",
  },
  negotiate_studies_heading: {
    de: "Verfügbare Studien/Kohorten",
    en: "Available studies/cohorts",
  },
  negotiate_studies_description: {
    de: "Kontaktieren Sie die entsprechenden Studien direkt für Ihre Datenanfrage:",
    en: "Contact the relevant studies directly for your data request:",
  },
  negotiate_col_key: { de: "Kürzel", en: "Code" },
  negotiate_col_name: { de: "Name", en: "Name" },
  negotiate_col_link: { de: "Link", en: "Link" },
  negotiate_col_contact: { de: "Kontakt", en: "Contact" },
  negotiate_col_action: { de: "Aktion", en: "Action" },
  negotiate_send_request: { de: "Anfrage senden", en: "Send request" },
  negotiate_mail_subject: { de: "Datenanfrage", en: "Data request" },
  negotiate_mail_body_prefix: { de: "Suchanfrage", en: "Query" },
  negotiate_databases_heading: {
    de: "Externe Datenbanken",
    en: "External databases",
  },
  negotiate_databases_description: {
    de: "Weitere relevante Datenbanken für Ihre Forschung:",
    en: "Further databases relevant to your research:",
  },
  negotiate_hint_label: { de: "Hinweis:", en: "Note:" },
  negotiate_hint_body: {
    de: "Die Datenanfrage wird direkt an die jeweiligen Studienzentren gesendet. Bitte geben Sie in Ihrer Anfrage die oben stehende Suchanfrage-URL an.",
    en: "The data request is sent directly to the respective study centres. Please include the query URL shown above in your request.",
  },

  /* Backend status widget */
  backend_status: { de: "Backend-Status", en: "Backend status" },
  /* Spelled out for the tooltip and screen readers - the dot colour alone
     must not be the only carrier of the state. */
  backend_state_checking: { de: "wird geprüft", en: "checking" },
  backend_state_healthy: { de: "fehlerfrei", en: "healthy" },
  backend_state_unhealthy: { de: "beeinträchtigt", en: "unhealthy" },
  backend_state_unreachable: { de: "nicht erreichbar", en: "unreachable" },
  backend_version: { de: "Version", en: "Version" },
  backend_version_unavailable: { de: "nicht verfügbar", en: "not available" },
  backend_commit: { de: "Commit", en: "Commit" },
  backend_build: { de: "Build", en: "Build" },

  /* Guide page */
  guide_title: { de: "Anleitung", en: "User guide" },
  guide_intro: {
    de: "Der DZIF-Kerndatensatz-Explorer ist eine Machbarkeitssuche (Feasibility Search): Sie stellen Suchkriterien zusammen und sehen, wie viele Patient:innen und Bioproben in den DZIF-Studien dazu passen.",
    en: "The DZIF Core Dataset Explorer is a feasibility search: you assemble search criteria and see how many patients and biosamples across the DZIF studies match them.",
  },
  guide_counts_only: {
    de: "Es werden ausschließlich aggregierte Zahlen angezeigt - keine personenbezogenen Daten und keine Datensätze einzelner Patient:innen.",
    en: "Only aggregated counts are shown - no personal data and no individual patient records.",
  },

  guide_steps_heading: { de: "Schritt für Schritt", en: "Step by step" },

  guide_step_catalogue: {
    de: "Suchkriterien auswählen",
    en: "Pick search criteria",
  },
  guide_step_catalogue_body: {
    de: "Öffnen Sie links unter „Suchkriterien“ eine Gruppe (z. B. Anamnese) und darin eine Kategorie (z. B. Diabetes). Mit dem Plus-Symbol übernehmen Sie einen einzelnen Wert, mit „Alle hinzufügen“ alle Werte der Kategorie.",
    en: 'On the left under "Search criteria", open a group (e.g. Medical history) and then a category (e.g. Diabetes). The plus button adds a single value; "Add all" adds every value of that category.',
  },

  guide_step_search: { de: "Suchleiste nutzen", en: "Use the search bar" },
  guide_step_search_body: {
    de: "Alternativ tippen Sie den Namen eines Kriteriums direkt in die Suchleiste. Die ausgewählten Kriterien erscheinen dort als Chips und lassen sich einzeln wieder entfernen.",
    en: "Alternatively type a criterion's name straight into the search bar. Selected criteria appear there as chips and can be removed individually.",
  },

  guide_step_logic: {
    de: "Wie die Suche verknüpft wird",
    en: "How criteria combine",
  },
  guide_step_logic_body: {
    de: "Mehrere Werte desselben Kriteriums werden mit ODER verknüpft, verschiedene Kriterien mit UND. Über das Plus rechts neben der Suchleiste legen Sie eine weitere Suchgruppe an - Gruppen werden untereinander mit ODER verknüpft. Das Info-Symbol zeigt die aktuelle Verknüpfung im Klartext.",
    en: "Several values of the same criterion are combined with OR, different criteria with AND. The plus button to the right of the search bar adds another search group - groups are combined with OR. The info button spells out the current combination in plain language.",
  },

  guide_step_run: { de: "Suche ausführen", en: "Run the search" },
  guide_step_run_body: {
    de: "Klicken Sie auf „Suchen“. Die Diagramme aktualisieren sich erst nach dem Ausführen der Suche - ändern Sie die Kriterien danach, weist ein Hinweis darauf hin, dass die Anzeige nicht mehr zur Suche passt.",
    en: 'Click "Search". The charts only update once the search has run - if you change the criteria afterwards, a notice points out that the display no longer matches the query.',
  },

  guide_step_results: { de: "Ergebnisse lesen", en: "Read the results" },
  guide_step_results_body: {
    de: "Oben stehen die Gesamtzahlen für Patient:innen und Bioproben. Die Diagramme darunter schlüsseln das Ergebnis auf, etwa nach Studie, Standort, Alter, Erkrankungen oder Probentyp.",
    en: "The totals for patients and biosamples appear at the top. The charts below break the result down - by study, site, age, disease or sample type, for example.",
  },

  guide_step_charts: { de: "Diagramme filtern", en: "Filter the charts" },
  guide_step_charts_body: {
    de: "Über „Diagramme filtern“ blenden Sie einzelne Diagramme ein und aus. Diagramme lassen sich außerdem alphabetisch oder nach Häufigkeit sortieren.",
    en: 'Use "Filter charts" to show or hide individual charts. Charts can also be sorted alphabetically or by frequency.',
  },

  guide_step_share: {
    de: "Suche teilen und speichern",
    en: "Share and save a search",
  },
  guide_step_share_body: {
    de: "Die Adresszeile enthält immer die aktuelle Suchanfrage. Kopieren Sie die URL, um eine Suche zu speichern, weiterzugeben oder später erneut zu öffnen.",
    en: "The address bar always contains the current query. Copy the URL to save a search, pass it on, or reopen it later.",
  },

  guide_step_request: { de: "Daten beantragen", en: "Request data" },
  guide_step_request_body: {
    de: "Mit „Daten beantragen“ öffnen Sie eine Übersicht der beteiligten Studien mit Ansprechpartner:innen, Ihrer Suchanfrage-URL und einem QR-Code. Die Anfrage geht direkt an das jeweilige Studienzentrum - bitte geben Sie die URL darin an.",
    en: '"Request data" opens an overview of the participating studies with their contacts, your query URL and a QR code. The request goes directly to the relevant study centre - please include the URL in it.',
  },

  guide_tips_heading: { de: "Gut zu wissen", en: "Good to know" },
  guide_tip_language: {
    de: "Über DE/EN oben rechts wechseln Sie die Sprache. Suchkriterien, Diagrammbeschriftungen und Oberfläche wechseln gemeinsam; eine bereits ausgewählte Suche bleibt dabei erhalten.",
    en: "Use DE/EN at the top right to switch language. Criteria, chart labels and interface change together, and a search you have already assembled is kept.",
  },
  guide_tip_status: {
    de: "Unten rechts zeigt der Backend-Status, ob die Datenbank erreichbar ist: grün bedeutet erreichbar, gelb eingeschränkt, rot nicht erreichbar. Ein Klick zeigt Version und Build.",
    en: "The backend status at the bottom right shows whether the database is reachable: green means reachable, yellow degraded, red unreachable. Click it for version and build details.",
  },
  guide_tip_empty: {
    de: "Findet eine Suche nichts, ist das ein gültiges Ergebnis: Für diese Kombination von Kriterien liegen keine passenden Fälle vor.",
    en: "If a search returns nothing, that is a valid result: no matching cases exist for that combination of criteria.",
  },
  guide_tip_testdata: {
    de: "Diese Version arbeitet mit zufällig erzeugten Testdaten. Die Zahlen dienen der Erprobung und lassen keine Rückschlüsse auf reale Kohortengrößen zu.",
    en: "This version runs on randomly generated test data. The numbers are for trying the tool out and say nothing about real cohort sizes.",
  },

  guide_links_heading: { de: "Weiterführende Links", en: "Further links" },
  guide_link_dzif: {
    de: "DZIF - Deutsches Zentrum für Infektionsforschung",
    en: "DZIF - German Center for Infection Research",
  },
  guide_link_tibbd: {
    de: "Die TI BBD stellt sich vor",
    en: "Introducing the TI BBD",
  },
  guide_link_mdr: {
    de: "Kerndatensatz im Data&Tools Hub",
    en: "Core dataset in the Data&Tools Hub",
  },
  guide_contact_hint: {
    de: "Fragen oder Feedback? Über die Seite „Kontakt“ erreichen Sie uns direkt.",
    en: 'Questions or feedback? The "Contact" page reaches us directly.',
  },

  /* Footer and legal pages */
  footer_search: { de: "Suche", en: "Search" },
  back_to_search: { de: "Zurück zur Suche", en: "Back to search" },
  footer_guide: { de: "Anleitung", en: "Guide" },
  footer_dzif: { de: "DZIF", en: "DZIF" },
  footer_tibbd: { de: "TI BBD", en: "TI BBD" },
  footer_imprint: { de: "Impressum", en: "Imprint" },
  footer_contact: { de: "Kontakt", en: "Contact" },
  footer_privacy: { de: "Datenschutz", en: "Privacy" },
  back: { de: "Zurück", en: "Back" },
  legal_german_only: {
    de: "",
    en: "This page is only available in German for legal reasons.",
  },
  scroll_to_top: { de: "Nach oben scrollen", en: "Scroll to top" },
} satisfies Record<string, TextEntry>;

export type TextKey = keyof typeof uiTexts;

/**
 * Texts rendered inside Lens components. Lens ships German and English for most
 * of its own strings; these are the ones we override with DZIF wording.
 */
export const lensTexts = {
  query_modified: {
    de: "Die Suchanfrage wurde geändert. Bitte die Suche erneut ausführen.",
    en: "The query has been modified. Please re-run the search.",
  },
};
