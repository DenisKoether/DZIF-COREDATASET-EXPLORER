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
    <h1>Kontakt</h1>
  </header>

  <div class="kontakt-outline">
    <a class="button-back" href={resolve("/")}>{$t("back_to_search")}</a>
    <div class="kontakt">
      <h2>Kontakt</h2>
      <p>
        <strong>Inhaltliche Anfragen:</strong><br />
        Dr. Berit Lange<br />
        Helmholtz-Zentrum für Infektionsforschung<br />
        Koordinatorin Bioressourcen, Biodaten und Digitale Gesundheit<br />
        E-Mail: <a href="mailto:tibbd@dzif.de">tibbd@dzif.de</a>
      </p>

      <p>
        <strong>Technische Anfragen:</strong><br />
        Patrick Skowronek<br />
        E-Mail:
        <a href="mailto:patrick.skowronek@medma.uni-heidelberg.de"
          >patrick.skowronek@medma.uni-heidelberg.de</a
        >
      </p>
    </div>
  </div>

  <SiteFooter />
</div>
<ScrollToTop />
