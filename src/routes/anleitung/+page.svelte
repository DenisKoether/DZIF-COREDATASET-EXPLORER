<script lang="ts">
  import { resolve } from "$app/paths";
  import { t } from "../../config/i18n";
  import ScrollToTop from "../../services/tools/top-anker.svelte";
  import SiteFooter from "../../services/tools/site-footer.svelte";
  import LanguageSwitch from "../../services/tools/language-switch.svelte";

  const DZIF_URL = "https://www.dzif.de/de";
  const TIBBD_URL = "https://www.dzif.de/de/event/die-ti-bbd-stellt-sich-vor";
  const MDR_URL =
    "https://mdr.dzif.de/#/details?concept=http:%2F%2Fdata.custom.de%2Font%2Fdwh%23Core_Dataset";

  /* Ordered walkthrough - each entry is a heading key plus its body key. */
  const steps = [
    ["guide_step_catalogue", "guide_step_catalogue_body"],
    ["guide_step_search", "guide_step_search_body"],
    ["guide_step_logic", "guide_step_logic_body"],
    ["guide_step_run", "guide_step_run_body"],
    ["guide_step_results", "guide_step_results_body"],
    ["guide_step_charts", "guide_step_charts_body"],
    ["guide_step_share", "guide_step_share_body"],
    ["guide_step_request", "guide_step_request_body"],
  ] as const;

  const tips = [
    "guide_tip_language",
    "guide_tip_status",
    "guide_tip_empty",
    "guide_tip_testdata",
  ] as const;
</script>

<svelte:head>
  <title>{$t("guide_title")} - {$t("app_title")}</title>
</svelte:head>

<div class="page">
  <header>
    <img src="../assets/dzif-Logo.svg" alt={$t("logo_alt")} />
    <h1>{$t("guide_title")}</h1>
    <LanguageSwitch />
  </header>

  <div class="guide-outline">
    <a class="button-back" href={resolve("/")}>{$t("back_to_search")}</a>

    <div class="guide">
      <p class="guide__intro">{$t("guide_intro")}</p>
      <p class="guide__note">{$t("guide_counts_only")}</p>

      <h2>{$t("guide_steps_heading")}</h2>
      <ol class="guide__steps">
        {#each steps as [heading, body] (heading)}
          <li>
            <h3>{$t(heading)}</h3>
            <p>{$t(body)}</p>
          </li>
        {/each}
      </ol>

      <h2>{$t("guide_tips_heading")}</h2>
      <ul class="guide__tips">
        {#each tips as tip (tip)}
          <li>{$t(tip)}</li>
        {/each}
      </ul>

      <h2>{$t("guide_links_heading")}</h2>
      <ul class="guide__links">
        <li>
          <a href={DZIF_URL} target="_blank" rel="external noopener noreferrer">
            {$t("guide_link_dzif")}
          </a>
        </li>
        <li>
          <a
            href={TIBBD_URL}
            target="_blank"
            rel="external noopener noreferrer"
          >
            {$t("guide_link_tibbd")}
          </a>
        </li>
        <li>
          <a href={MDR_URL} target="_blank" rel="external noopener noreferrer">
            {$t("guide_link_mdr")}
          </a>
        </li>
      </ul>

      <p class="guide__note">{$t("guide_contact_hint")}</p>
    </div>
  </div>

  <SiteFooter />
</div>
<ScrollToTop />
