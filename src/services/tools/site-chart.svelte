<script lang="ts">
  import { onDestroy } from "svelte";
  import { Chart } from "chart.js/auto";
  import { TreemapController, TreemapElement } from "chartjs-chart-treemap";
  import { getHeaders } from "../../config/chart-labels";
  import { language, t } from "../../config/i18n";
  import { backgroundColor } from "./chart-style";

  Chart.register(TreemapController, TreemapElement);

  type Study = { study: string; count: number };
  type Ttu = { ttu: string; count: number; studies: Study[] };
  type Site = { site: string; count: number; ttus: Ttu[] };

  /** What the treemap plugin hangs off each rectangle. */
  type TreemapRaw = { _data?: Row };

  /** Hierarchy built from the `orgout` stratifier: site -> TTU/TI -> study. */
  export let sites: Site[] = [];

  type View = "rings" | "treemap";

  let view: View = "rings";
  /** Drill path: nothing selected = all sites, then one site, then one TTU. */
  let selectedSite: string | null = null;
  let selectedTtu: string | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let chart: Chart | null = null;

  /* Plain functions rather than reactive assignments: they read $language
     when called, and every caller already re-runs on a language change. */
  const siteName = (code: string) =>
    getHeaders($language).orgUnit.get(code) ?? code;
  const ttuName = (code: string) =>
    getHeaders($language).affiliationTtu.get(code) ?? code;
  const studyName = (code: string) =>
    getHeaders($language).affiliationStudy.get(code) ?? code;

  const shade = (color: string, factor: number): string => {
    const value = color.replace("#", "");
    const channel = (offset: number) =>
      parseInt(value.slice(offset, offset + 2), 16);
    const mix = (c: number) =>
      Math.round(factor >= 1 ? c : c + (255 - c) * (1 - factor));
    return `rgb(${mix(channel(0))}, ${mix(channel(2))}, ${mix(channel(4))})`;
  };

  const paletteColor = (index: number): string =>
    backgroundColor[index % backgroundColor.length];

  $: activeSite = selectedSite
    ? (sites.find((s) => s.site === selectedSite) ?? null)
    : null;
  $: activeTtu =
    activeSite && selectedTtu
      ? (activeSite.ttus.find((t) => t.ttu === selectedTtu) ?? null)
      : null;

  /* Breadcrumb entries; clicking one returns to that level. */
  $: trail = [
    { label: $t("sites_chart_all"), level: 0 },
    ...(activeSite ? [{ label: siteName(activeSite.site), level: 1 }] : []),
    ...(activeTtu ? [{ label: ttuName(activeTtu.ttu), level: 2 }] : []),
  ];

  const goToLevel = (level: number) => {
    if (level === 0) {
      selectedSite = null;
      selectedTtu = null;
    } else if (level === 1) {
      selectedTtu = null;
    }
  };

  type Row = { code: string; label: string; value: number; colorIndex: number };

  /** Rows for the current drill level, plus the colour index they inherit. */
  $: rows = activeTtu
    ? activeTtu.studies.map((s, i) => ({
        code: s.study,
        label: studyName(s.study),
        value: s.count,
        colorIndex: i,
      }))
    : activeSite
      ? activeSite.ttus.map((ttu, i) => ({
          code: ttu.ttu,
          label: ttuName(ttu.ttu),
          value: ttu.count,
          colorIndex: i,
        }))
      : sites.map((site, i) => ({
          code: site.site,
          label: siteName(site.site),
          value: site.count,
          colorIndex: i,
        }));

  $: total = rows.reduce((sum, r) => sum + r.value, 0);

  const drillInto = (code: string) => {
    if (activeTtu) return; // studies are the deepest level
    if (activeSite) selectedTtu = code;
    else selectedSite = code;
  };

  /** Concentric rings for the levels below the current one. */
  const buildRings = () => {
    const level0 = rows;
    const datasets = [
      {
        label: $t("sites_chart_level_current"),
        data: level0.map((r) => r.value),
        backgroundColor: level0.map((r) =>
          shade(paletteColor(r.colorIndex), 1),
        ),
        borderWidth: 1,
      },
    ];

    if (!activeSite) {
      // sites -> TTUs -> studies
      const ttus = sites.flatMap((site, i) =>
        site.ttus.map((ttu) => ({ site, ttu, colorIndex: i })),
      );
      datasets.push({
        label: $t("sites_chart_level_ttu"),
        data: ttus.map((x) => x.ttu.count),
        backgroundColor: ttus.map((x) =>
          shade(paletteColor(x.colorIndex), 0.75),
        ),
        borderWidth: 1,
      });
      const studies = sites.flatMap((site, i) =>
        site.ttus.flatMap((ttu) =>
          ttu.studies.map((study) => ({ site, ttu, study, colorIndex: i })),
        ),
      );
      datasets.push({
        label: $t("sites_chart_level_study"),
        data: studies.map((x) => x.study.count),
        backgroundColor: studies.map((x) =>
          shade(paletteColor(x.colorIndex), 0.5),
        ),
        borderWidth: 1,
      });
      return {
        datasets,
        labels: [
          level0.map((r) => r.label),
          ttus.map((x) => `${siteName(x.site.site)} › ${ttuName(x.ttu.ttu)}`),
          studies.map(
            (x) =>
              `${siteName(x.site.site)} › ${ttuName(x.ttu.ttu)} › ${studyName(x.study.study)}`,
          ),
        ],
      };
    }

    if (!activeTtu) {
      // one site: TTUs -> studies
      const studies = activeSite.ttus.flatMap((ttu, i) =>
        ttu.studies.map((study) => ({ ttu, study, colorIndex: i })),
      );
      datasets.push({
        label: $t("sites_chart_level_study"),
        data: studies.map((x) => x.study.count),
        backgroundColor: studies.map((x) =>
          shade(paletteColor(x.colorIndex), 0.6),
        ),
        borderWidth: 1,
      });
      return {
        datasets,
        labels: [
          level0.map((r) => r.label),
          studies.map(
            (x) => `${ttuName(x.ttu.ttu)} › ${studyName(x.study.study)}`,
          ),
        ],
      };
    }

    return { datasets, labels: [level0.map((r) => r.label)] };
  };

  const describe = (label: string, value: number) => {
    const share = total > 0 ? Math.round((value / total) * 100) : 0;
    return `${label}: ${value} ${$t("axis_patients")} (${share}%)`;
  };

  const render = () => {
    if (!canvas) return;
    chart?.destroy();
    chart = null;
    if (rows.length === 0) return;

    const canDrill = !activeTtu;

    if (view === "treemap") {
      chart = new Chart(canvas, {
        type: "treemap",
        data: {
          datasets: [
            {
              type: "treemap" as const,
              data: [],
              tree: rows.map((r) => ({ ...r })),
              key: "value",
              labels: {
                display: true,
                color: "#ffffff",
                font: { size: 11 },
                formatter: (ctx: { raw?: unknown }) => {
                  const item = (ctx.raw as TreemapRaw | undefined)?._data;
                  return item ? [item.label, String(item.value)] : [];
                },
              },
              backgroundColor: (ctx: { raw?: unknown }) =>
                shade(
                  paletteColor(
                    (ctx.raw as TreemapRaw | undefined)?._data?.colorIndex ?? 0,
                  ),
                  1,
                ),
              borderWidth: 1,
              borderColor: "#ffffff",
              spacing: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (_event, elements) => {
            if (!canDrill || elements.length === 0) return;
            const row = rows[elements[0].index];
            if (row) drillInto(row.code);
          },
          plugins: {
            legend: { display: false },
            title: { display: false },
            tooltip: {
              callbacks: {
                title: () => "",
                label: (item: { raw?: unknown }) => {
                  const data = (item.raw as TreemapRaw | undefined)?._data;
                  return data ? describe(data.label, data.value) : "";
                },
              },
            },
          },
        },
      });
      return;
    }

    const { datasets, labels } = buildRings();
    chart = new Chart(canvas, {
      type: "doughnut",
      data: { labels: labels[0], datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "35%",
        onClick: (_event, elements) => {
          if (!canDrill || elements.length === 0) return;
          // Only the innermost ring is the current level, so only it drills.
          const hit = elements.find((e) => e.datasetIndex === 0);
          if (!hit) return;
          const row = rows[hit.index];
          if (row) drillInto(row.code);
        },
        plugins: {
          legend: { display: false },
          title: { display: false },
          tooltip: {
            callbacks: {
              label: (item: {
                datasetIndex: number;
                dataIndex: number;
                dataset: { data: number[] };
              }) => {
                const label = labels[item.datasetIndex]?.[item.dataIndex] ?? "";
                return describe(
                  label,
                  Number(item.dataset.data[item.dataIndex]),
                );
              },
            },
          },
        },
      },
    });
  };

  /* Re-render whenever the data, the drill level, the view or the language
     changes. `$t` is referenced so a language switch retranslates the chart. */
  $: if (canvas && ($t, rows, view, sites)) render();

  onDestroy(() => chart?.destroy());
</script>

<div class="site-chart">
  <div class="site-chart__bar">
    <nav class="site-chart__trail" aria-label={$t("sites_chart_trail")}>
      {#each trail as step, i (step.level)}
        {#if i > 0}<span class="site-chart__sep" aria-hidden="true">›</span
          >{/if}
        {#if i === trail.length - 1}
          <span class="site-chart__crumb is-current">{step.label}</span>
        {:else}
          <button
            class="site-chart__crumb"
            onclick={() => goToLevel(step.level)}>{step.label}</button
          >
        {/if}
      {/each}
    </nav>

    <div
      class="site-chart__views"
      role="group"
      aria-label={$t("sites_chart_view")}
    >
      <button
        class="site-chart__view"
        class:is-active={view === "rings"}
        aria-pressed={view === "rings"}
        onclick={() => (view = "rings")}>{$t("sites_chart_rings")}</button
      >
      <button
        class="site-chart__view"
        class:is-active={view === "treemap"}
        aria-pressed={view === "treemap"}
        onclick={() => (view = "treemap")}>{$t("sites_chart_treemap")}</button
      >
    </div>
  </div>

  <p class="site-chart__hint">
    {activeTtu ? $t("sites_chart_deepest") : $t("sites_chart_drill_hint")}
    {view === "rings"
      ? $t("sites_chart_rings_explainer")
      : $t("sites_chart_treemap_explainer")}
  </p>

  <div class="site-chart__canvas">
    <canvas bind:this={canvas} id="multiRingChart2"></canvas>
  </div>
</div>
