<script lang="ts">
  import { onMount } from "svelte";

  import {
    cardvascHeaders,
    diabetesHeaders,
    diseasesHeaders,
    genderHeaders,
    immuHeaders,
    liverHeaders,
    lungHeaders,
    neuroHeaders,
    virusHeaders,
  } from "./config/environment";
  import ScrollToTop from "./services/tools/top-anker.svelte";
  import SitesChart from "./charts/SitesChart.svelte";

  import { writable } from "svelte/store";
  // Import Lens CSS and JS bundles
  import "@samply/lens/style.css";

  import "@samply/lens";

  import "./app.css";

  import {
    setOptions,
    setCatalogue,
    type LensOptions,
    type Catalogue,
    markSiteClaimed,
    removeFailedSite,
  } from "@samply/lens";
  import options from "./config/options.json";
  import catalogue from "./config/dzif-such-und-kerndatensatz.json";
  onMount(() => {
    setOptions(options as LensOptions);
    setCatalogue(catalogue as Catalogue);
  });

  //import { buildLibrary, buildMeasure } from './cql-measure';
  import { env } from "$env/dynamic/public";
  import {
    clearSiteResults,
    getAst,
    setSiteResult,
    showToast,
    type LensResult,
  } from "@samply/lens";

  let result: LensResult | null;

  export function combineStratifiers(
    lens: LensResult,
    sourceNames: string[],
    outName: string,
  ): LensResult {
    const combined: Record<string, number> = {};

    // Combine source stratifiers
    for (const name of sourceNames) {
      const strat = lens.stratifiers[name];
      if (!strat) {
        throw new Error(`Stratifier "${name}" does not exist`);
      }

      for (const [bucket, value] of Object.entries(strat)) {
        combined[bucket] = (combined[bucket] ?? 0) + value;
      }
    }

    // Build new stratifiers object
    const newStratifiers: LensResult["stratifiers"] = {};

    for (const [name, strat] of Object.entries(lens.stratifiers)) {
      if (!sourceNames.includes(name)) {
        newStratifiers[name] = strat;
      }
    }

    // Insert combined stratifier
    newStratifiers[outName] = combined;

    return {
      stratifiers: newStratifiers,
      totals: { ...lens.totals },
    };
  }

  const requestBackend = async () => {
    clearSiteResults();
    markSiteClaimed("dzif");

    let backendUrl: string | undefined;

    backendUrl = env.PUBLIC_BACKEND_URL;
    if (backendUrl === undefined) {
      backendUrl = "http://localhost:3001";
    }

    try {
      const response = await fetch(`${backendUrl}/exec`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(getAst()),
        redirect: "manual", // Used to detect redirects
      });

      result = await response.json();
      if (result != null) {
        cardvasc();
        anamneseOut();
        virusout();
        setSiteResult("dzif", result);
        console.log(result);
      }
    } catch (error) {
      showToast(
        "There is an error while quering the backend. Please try it in a few minutes",
        "error",
      );
      removeFailedSite("dzif");
      result = null;
    }
  };

  export function filterStratifierBuckets(
    lens: LensResult,
    stratifierName: string,
    keepBuckets: string[],
    outName: string,
  ): LensResult {
    const strat = lens.stratifiers[stratifierName];
    if (!strat) {
      throw new Error(`Stratifier "${stratifierName}" does not exist`);
    }

    const filtered: Record<string, number> = {};

    for (const bucket of keepBuckets) {
      if (bucket in strat) {
        filtered[bucket] = strat[bucket];
      }
    }

    const newStratifiers: LensResult["stratifiers"] = {};

    // Remove original stratifier
    for (const [name, value] of Object.entries(lens.stratifiers)) {
      if (name !== stratifierName) {
        newStratifiers[name] = value;
      }
    }

    // Insert filtered stratifier
    newStratifiers[outName] = filtered;

    return {
      stratifiers: newStratifiers,
      totals: { ...lens.totals },
    };
  }

  let showHinweis = writable(true);

  function closeHinweis() {
    showHinweis.set(false);
  }

  const barChartBackgroundColors: string[] = ["#011e50", "#1e88e5", "#f9a825"];
  const pieChartBackgroundColors: string[] = [
    "#011e50",
    "#1e88e5",
    "#f9a825",
    "#90a4ae",
  ];
  const pieTransChartBackgroundColors: string[] = [
    "#011e50",
    "#1e88e5",
    "#f9a825",
    "#5e35b1",
    "#00838f",
    "#90a4ae",
  ];

  let catalogueopen = false;

  window.addEventListener("popstate", function () {
    window.location.reload();
  });

  window.addEventListener("lens-search-triggered", () => {
    requestBackend();
  });

  const cardvasc = () => {
    if (result != null) {
      result = combineStratifiers(
        result,
        ["cardvasc", "cardvaschd", "cardvasht"],
        "card",
      );
    }
  };

  const virusout = () => {
    if (result != null) {
      let resulta = [];
      let tmp = filterStratifierBuckets(
        result,
        "chr_virus_hiv",
        ["Y"],
        "chr_virus_hiv",
      );

      if (tmp.stratifiers.chr_virus_hiv.Y !== undefined) {
        tmp = {
          ...tmp,
          stratifiers: {
            ...tmp.stratifiers,
            chr_virus_hiv: {
              chr_virus_hiv: tmp.stratifiers.chr_virus_hiv.Y,
            },
          },
        };

        resulta.push("chr_virus_hiv");
      }

      tmp = filterStratifierBuckets(
        tmp,
        "chr_virus_hbv",
        ["Y"],
        "chr_virus_hbv",
      );

      if (tmp.stratifiers.chr_virus_hbv.Y !== undefined) {
        tmp = {
          ...tmp,
          stratifiers: {
            ...tmp.stratifiers,
            chr_virus_hbv: {
              chr_virus_hbv: tmp.stratifiers.chr_virus_hbv.Y,
            },
          },
        };
        resulta.push("chr_virus_hbv");
      }

      tmp = filterStratifierBuckets(
        tmp,
        "chr_virus_hcv",
        ["Y"],
        "chr_virus_hcv",
      );

      if (tmp.stratifiers.chr_virus_hcv.Y === undefined) {
        tmp = {
          ...tmp,
          stratifiers: {
            ...tmp.stratifiers,
            chr_virus_hcv: {
              chr_virus_hcv: tmp.stratifiers.chr_virus_hcv.Y,
            },
          },
        };
        resulta.push("chr_virus_hcv");
      }

      tmp = filterStratifierBuckets(
        tmp,
        "chr_virus_other",
        ["Y"],
        "chr_virus_other",
      );

      if (tmp.stratifiers.chr_virus_other.Y !== undefined) {
        tmp = {
          ...tmp,
          stratifiers: {
            ...tmp.stratifiers,
            chr_virus_other: {
              chr_virus_other: tmp.stratifiers.chr_virus_other.Y,
            },
          },
        };

        resulta.push("chr_virus_other");
      }

      result = combineStratifiers(
        tmp,
        resulta,
        "virus",
      );
    }
  };

  const anamneseOut = () => {
    if (result != null) {
      result = combineStratifiers(
        result,
        ["malaria", "chr_kidneyd", "chr_myobakt", "tumor_active"],
        "diseases",
      );
    }
  };
</script>

{#if $showHinweis}
  <div class="hinweisBox">
    <button class="closeBtn" on:click={closeHinweis}>&times;</button>
    <p><strong>Hinweis zur Testversion</strong></p>
    <p>
      Diese Webapp befindet sich in einer Testphase und verwendet zufällig
      generierte Testdaten ohne spezifische Verteilung. Dadurch kann es zu
      Fehlern oder unerwarteten Ergebnissen kommen.
    </p>
    <p>
      Fehlen Daten oder Suchelemente? Oder sind irrelevante Ergebnisse dabei?
      Dann freuen wir uns über euer Feedback an <a
        href="mailto:patrick.skowronek@medma.uni-heidelberg.de"
        >patrick.skowronek@medma.uni-heidelberg.de</a
      >.
    </p>
  </div>
{/if}

<div class="page">
  <header>
    <img src="../assets/dzif-Logo.svg" alt="ogo des DZIF" />
    <h1>DZIF-COREDATASET-EXPLORER (TESTDATEN)</h1>
    <div></div>
  </header>
  <main>
    <div class="search">
      <div class="search-wrapper">
        <lens-search-bar-multiple
          noMatchesFoundMessage={"Keine Ergebnisse gefunden"}
        ></lens-search-bar-multiple>
        <lens-query-explain-button
          noQueryMessage="Leere Suchanfrage: Sucht nach allen Ergebnissen."
        ></lens-query-explain-button>
        <lens-search-button title="Suchen"></lens-search-button>
      </div>
    </div>

    <div class="grid">
      <div class="catalogue-wrapper">
        <div class="catalogue">
          <h2>Suchkriterien</h2>
          <lens-info-button message={[`Information hinzufügen(TODO)`]}
          ></lens-info-button>
          <lens-catalogue toggle={{ collapsable: false, open: catalogueopen }}
          ></lens-catalogue>
          <br />
        </div>
      </div>

      <div class="charts">
        <div class="chart-wrapper result-summary">
          <div class="right">
            <lens-query-spinner size="24px"></lens-query-spinner>
          </div>
          <div>
            <lens-result-summary></lens-result-summary>
            <button class="datenBeantragen" id="datenBeantragen"
              >Daten beantragen</button
            >
            <lens-search-modified-display
              >Diagramme repräsentieren nicht mehr die aktuelle Suche!
            </lens-search-modified-display>
          </div>
        </div>

        <div class="chart-wrapper chart-study">
          <lens-chart
            title="Studie - TTU/TI"
            dataKey="study"
            chartType="bar"
            xAxisTitle="Zugehörigkeit"
            yAxisTitle="Patienten"
            backgroundColor={barChartBackgroundColors}
            displayLegends={false}
            enableSorting={true}
          >
          </lens-chart>
        </div>

        <div class="chart-wrapper chart-study">
          <lens-chart
            title="Studie/Kohorte"
            dataKey="studykohorte"
            chartType="bar"
            xAxisTitle="Zugehörigkeit"
            yAxisTitle="Patienten"
            backgroundColor={barChartBackgroundColors}
            displayLegends={false}
            enableSorting={true}
          >
          </lens-chart>
        </div>

        <div class="chart-wrapper chart-gender">
          <lens-chart
            title="Identifizierendes Geschlecht"
            dataKey="gender"
            chartType="pie"
            displayLegends={true}
            headers={genderHeaders}
            backgroundColor={pieChartBackgroundColors}
          ></lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Erkrankungen"
            dataKey="diseases"
            chartType="bar"
            yAxisTitle="Anzahl Erkanungen"
            backgroundColor={barChartBackgroundColors}
            headers={diseasesHeaders}
            enableSorting={true}
          >
          </lens-chart>
        </div>

        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Raucher"
            dataKey="smoker"
            chartType="pie"
            displayLegends={true}
            backgroundColor={pieChartBackgroundColors}
          >
          </lens-chart>
        </div>

        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Chron. Viruserkrankungen"
            dataKey="virus"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={virusHeaders}
            enableSorting={true}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Herz-Kreislauf-Erkrankungen"
            dataKey="card"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={cardvascHeaders}
            enableSorting={true}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Diabetes"
            dataKey="diabetes"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={diabetesHeaders}
            enableSorting={true}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Rheumatologische / Immunologische Erkrankungen"
            dataKey="rheu_immu"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={immuHeaders}
            enableSorting={true}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Chron. Lebererkrankungen"
            dataKey="chr_liverdis"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={liverHeaders}
            enableSorting={true}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Chron. Lungenerkrankungen"
            dataKey="chr_lung"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={lungHeaders}
            enableSorting={true}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Chron. Neurologische-Erkrankungen"
            dataKey="neuro"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={neuroHeaders}
            enableSorting={true}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-alter">
          <lens-chart
            title="Alter bei Aufnahme"
            dataKey="inclusionage"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            groupRange={10}
            filterRegex="^(1*[12]*[0-9])"
            xAxisTitle="Alter"
            yAxisTitle="Anzahl der Patienten"
            enableSorting={true}
          >
          </lens-chart>
        </div>

        <div class="chart-wrapper chart-samples-liquid">
          <lens-chart
            title="Proben LIQUID"
            dataKey="type"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            filterRegex="^[LIQUID|X].*"
            displayLegends={false}
            xAxisTitle="Probentyp"
            yAxisTitle="Anzahl der Proben"
            enableSorting={true}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-samples-tissue">
          <lens-chart
            title="Proben Tissue"
            dataKey="type"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            filterRegex="^[TISSUE].*"
            displayLegends={false}
            xAxisTitle="Probentyp"
            yAxisTitle="Anzahl der Proben"
            enableSorting={true}
          >
          </lens-chart>
        </div>

        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Transplantationen"
            dataKey="transplantout"
            chartType="pie"
            backgroundColor={pieTransChartBackgroundColors}
          >
          </lens-chart>
          Anzahl Transplantationen: {result?.totals.transplat}
        </div>

        <!-- <div class="chart-wrapper chart-sites-multi">
          <SitesChart></SitesChart>
        </div> -->
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer__left-section">
      <div class="footer__made-with">
        Made with ♥ and <a href="https://github.com/samply/lens"
          >samply/lens-core</a
        >
      </div>
      <div class="footer__logo">
        <img src="../assets/dzg-logo-2022.svg" alt="Logo des DZG" />
      </div>
    </div>
    <div class="footer__links">
      <a href="/impressum">Impressum</a>
      <a href="/kontakt">Kontakt</a>
      <!--<a href="/datenschutz">Datenschutz</a>-->
    </div>
  </footer>
</div>
<ScrollToTop />

<lens-toast></lens-toast>
