<!-- @migration-task Error while migrating Svelte code: Event attribute must be a JavaScript expression, not a string
https://svelte.dev/e/attribute_invalid_event_handler -->
<script>
  import { resolve } from "$app/paths";
  import { t } from "../../config/i18n";
  import ScrollToTop from "../../services/tools/top-anker.svelte";
  import SiteFooter from "../../services/tools/site-footer.svelte";
</script>

<div class="page">
  <header>
    <img src="../assets/dzif-Logo.svg" alt="Logo des DZIF" />
    <h1>Impressum</h1>
  </header>

  <div class="impressum-outline">
    <a class="button-back" href={resolve("/")}>{$t("back_to_search")}</a>
    <div class="impressum">
      <h2>Impressum</h2>
      <p><strong>Angaben gemäß § 5 TMG</strong></p>
      <p>
        <strong>Helmholtz-Zentrum für Infektionsforschung GmbH</strong><br />
        Inhoffenstraße 7, 38124 Braunschweig, Deutschland
      </p>

      <p>
        <strong>Vertreten durch:</strong><br />
        Geschäftsführung: Prof. Dr. Dirk Heinz, Dr. Rolf Apweiler
      </p>

      <p>
        <strong>Kontakt:</strong><br />
        E-Mail: <a href="mailto:tibbd@dzif.de">tibbd@dzif.de</a><br />
        Telefon: +49 (0)531 6181-0
      </p>

      <p>
        <strong>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:</strong><br
        />
        Dr. Berit Lange<br />
        Helmholtz-Zentrum für Infektionsforschung<br />
        Koordinatorin Bioressourcen, Biodaten und Digitale Gesundheit<br />
        Inhoffenstraße 7, 38124 Braunschweig, Deutschland
      </p>

      <p>
        <strong>Verweise und Links:</strong><br />
        <a
          href="https://www.dzif.de/de/infrastruktur/bioressourcen-biodaten-und-digitale-gesundheit"
          target="_blank"
        >
          Bioressourcen, Biodaten und Digitale Gesundheit
        </a>
      </p>
    </div>
  </div>

  <SiteFooter />
</div>
<ScrollToTop />
