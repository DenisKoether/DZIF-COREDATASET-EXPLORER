<script lang="ts">
  import {
    language,
    setLanguage,
    SUPPORTED_LANGUAGES,
    t,
    type Language,
  } from "../../config/i18n";

  const labels: Record<Language, string> = { de: "DE", en: "EN" };
  const names: Record<Language, string> = { de: "Deutsch", en: "English" };
</script>

<div
  class="language-switch"
  role="group"
  aria-label={$t("language_switch_label")}
>
  {#each SUPPORTED_LANGUAGES as option (option)}
    <button
      class="language-switch__option"
      class:is-active={$language === option}
      aria-pressed={$language === option}
      lang={option}
      title={names[option]}
      onclick={() => setLanguage(option)}
    >
      {labels[option]}
    </button>
  {/each}
</div>
