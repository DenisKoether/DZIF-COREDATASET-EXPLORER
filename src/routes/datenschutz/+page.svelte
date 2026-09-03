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
    <h1>Datenschutz</h1>
  </header>

  <div class="datenschutz">
    <a class="button-back" href={resolve("/")}>{$t("back_to_search")}</a>
  </div>

  <SiteFooter />
</div>
<ScrollToTop />
