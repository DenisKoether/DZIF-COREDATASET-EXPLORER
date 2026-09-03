<script lang="ts">
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { language, t } from "../../config/i18n";
  import type { TextKey } from "../../config/i18n";

  type Health = { status: string };
  type Version = {
    version: string;
    commit: string;
    built_at: string;
    code_name: string;
  };

  type State = "checking" | "healthy" | "unhealthy" | "unreachable";

  const POLL_INTERVAL_MS = 60_000;
  const REQUEST_TIMEOUT_MS = 5_000;

  let state: State = "checking";
  let version: Version | null = null;
  let expanded = false;

  const backendUrl = (): string =>
    env.PUBLIC_BACKEND_URL ?? "http://localhost:3001";

  /* Deliberately without `credentials: 'include'`: the status endpoints are
	   unauthenticated, and sending credentials would make the browser reject the
	   backend's wildcard CORS response. */
  const fetchJson = async <T,>(path: string): Promise<T | null> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(`${backendUrl()}${path}`, {
        signal: controller.signal,
      });
      if (!response.ok) return null;
      return (await response.json()) as T;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  };

  const check = async () => {
    const [nextHealth, nextVersion] = await Promise.all([
      fetchJson<Health>("/health"),
      fetchJson<Version>("/version"),
    ]);

    version = nextVersion;

    if (nextHealth === null) {
      state = "unreachable";
    } else {
      state = nextHealth.status === "healthy" ? "healthy" : "unhealthy";
    }
  };

  onMount(() => {
    check();
    const interval = setInterval(check, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  });

  const stateTextKeys: Record<State, TextKey> = {
    checking: "backend_state_checking",
    healthy: "backend_state_healthy",
    unhealthy: "backend_state_unhealthy",
    unreachable: "backend_state_unreachable",
  };

  $: locale = $language === "de" ? "de-DE" : "en-GB";

  const formatDateTime = (value: string, activeLocale: string): string => {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString(activeLocale, {
          dateStyle: "medium",
          timeStyle: "short",
        });
  };

  $: stateText = $t(stateTextKeys[state]);
</script>

<div class="backend-status" role="status" aria-live="polite">
  <button
    class="backend-status__toggle"
    onclick={() => (expanded = !expanded)}
    aria-expanded={expanded}
    title={`${$t("backend_status")}: ${stateText}`}
  >
    <span class="backend-status__label">{$t("backend_status")}</span>
    <span class="backend-status__state-text">: {stateText}</span>
        <span
      class="backend-status__dot backend-status__dot--{state}"
      aria-hidden="true"
    ></span>
    <span
      class="backend-status__chevron"
      class:is-open={expanded}
      aria-hidden="true">▾</span
    >
  </button>

  {#if expanded}
    <dl class="backend-status__details">
      {#if version}
        <div>
          <dt>{$t("backend_version")}</dt>
          <dd>{version.version} · {version.code_name}</dd>
        </div>
        <div>
          <dt>{$t("backend_commit")}</dt>
          <dd><code>{version.commit}</code></dd>
        </div>
        <div>
          <dt>{$t("backend_build")}</dt>
          <dd>{formatDateTime(version.built_at, locale)}</dd>
        </div>
      {:else}
        <div>
          <dt>{$t("backend_version")}</dt>
          <dd>{$t("backend_version_unavailable")}</dd>
        </div>
      {/if}
    </dl>
  {/if}
</div>
