<script lang="ts">
  import { resolve } from "$app/paths";
  import { t } from "../../config/i18n";
  import BackendStatus from "./backend-status.svelte";

  /* One footer for every page - the explorer and all subpages - so links
	   cannot drift apart between them. */
  const DZIF_URL = "https://www.dzif.de/de";
  const TIBBD_URL = "https://www.dzif.de/de/event/die-ti-bbd-stellt-sich-vor";
</script>

<footer class="footer">
  <div class="footer__left-section">
    <div class="footer__made-with">
      Made with ♥ and <a
        href="https://github.com/samply/lens"
        target="_blank"
        rel="external noopener noreferrer">samply/lens-core</a
      >
    </div>
    <div class="footer__logo">
      <img src="/assets/dzg-logo-2022.svg" alt="Logo des DZG" />
    </div>
  </div>

  <div class="footer__links">
    <a href={resolve("/")}>{$t("footer_search")}</a>
    <a href={resolve("/anleitung")}>{$t("footer_guide")}</a>
    <a href={resolve("/impressum")}>{$t("footer_imprint")}</a>
    <a href={resolve("/kontakt")}>{$t("footer_contact")}</a>
    <a href={DZIF_URL} target="_blank" rel="external noopener noreferrer"
      >{$t("footer_dzif")}</a
    >
    <a href={TIBBD_URL} target="_blank" rel="external noopener noreferrer"
      >{$t("footer_tibbd")}</a
    >
  </div>

  <BackendStatus />
</footer>
