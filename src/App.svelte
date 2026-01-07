<script lang="ts">
  import { onMount } from "svelte";

  import { requestBackend } from "./services/backends/backend.service";
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
  import "./app.css";

  import "@samply/lens";

  import {
    setOptions,
    setCatalogue,
    type LensOptions,
    type Catalogue,
  } from "@samply/lens";
  import options from "./config/options.json";
  import catalogue from "./config/dzif-such-und-kerndatensatz.json";
  onMount(() => {
    setOptions(options as LensOptions);
    setCatalogue(catalogue as Catalogue);
  });

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

  const catalogueUrl = "catalogues/dzif-such-und-kerndatensatz.json";
  const optionsFilePath = "config/options.json";

  window.addEventListener("popstate", function () {
    window.location.reload();
  });

  window.addEventListener("lens-search-triggered", () => {
    requestBackend();
  });

  window.addEventListener("lens-responses-updated", () => {
    response = dataPasser?.getResponseAPI();
    anamneseOut();
    virusout();
    cardvasc();
    diabetes();
    immu();
    liver();
    lung();
    neuro();
    trans();
  });

  type Subkey = { key: string; label: string };

  type StratifierDefinition = {
    key: string;
    label: string;
    subkeys?: Subkey[];
    includeAsYes?: string[];
  };

  type AnamneseGroup = {
    stratifier: {
      code: { text: string }[];
      stratum?: {
        population?: {
          count: number;
          code: { coding: { code: string; system: string }[] };
        }[];
        value: { text: string };
      }[];
    }[];
  };

  function getMergedStratifier(
    text: string,
    anamneseGroup: AnamneseGroup,
    stratifiers: StratifierDefinition[],
  ) {
    const mergedStratifier = {
      code: [{ text: text }],
      stratum: [] as NonNullable<AnamneseGroup["stratifier"][0]["stratum"]>,
    };

    stratifiers.forEach(({ key, subkeys = [] }) => {
      const stratifier = anamneseGroup.stratifier.find((strat) =>
        strat.code.some((c) => c.text === key),
      );

      if (!stratifier || !stratifier.stratum) {
        console.warn(`Stratifier not found or empty for key: ${key}`);
        return;
      }

      if (!subkeys.length) {
        const filtered = stratifier.stratum
          .filter((stratum) => {
            const value = stratum.value?.text || "";
            return !["X", "N", "null"].includes(value);
          })
          .map((stratum) => {
            const value = stratum.value?.text || "";

            // Replace 'Y' with the stratifier label (for display)
            if (value === "Y") {
              return {
                ...stratum,
                value: {
                  ...stratum.value,
                  text: stratifier.code[0].text, // stratifier's label replaces 'Y'
                },
              };
            }

            return stratum;
          });

        mergedStratifier.stratum.push(...filtered);
      } else {
        const filtered = stratifier.stratum.filter((stratum) => {
          const value = stratum.value?.text;
          const subkey = subkeys.find((s) => s.key === value);
          const count = stratum.population?.[0]?.count ?? 0;
          return subkey && count > 0;
        });
        mergedStratifier.stratum.push(...filtered);
      }
    });

    return mergedStratifier;
  }

  const cardvasc = () => {
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const anamneseGroup = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "anamnese");

    if (!anamneseGroup) return;

    const stratifiers = [
      {
        key: "rheuImmu",
        label: "",
        subkeys: [
          { key: "YOTHER", label: "andere" },
          { key: "YCIBD", label: "chronisch entzündliche Darmerkrankung" },
          { key: "YRA", label: "Rheumatoide Arthritis" },
          { key: "YCG", label: "Kollagenosen" },
          { key: "YVT", label: "Vaskulitiden" },
          { key: "YCGID", label: "angeborene Immundefekte" },
        ],
      },
    ];

    response.get("DKTK")?.data.group.push({
      code: { text: "cardvasc" },
      stratifier: [getMergedStratifier("cardvasc", anamneseGroup, stratifiers)],
    });
  };

  const immu = () => {
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const anamneseGroup = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "anamnese");

    if (!anamneseGroup) return;

    const stratifiers = [
      {
        key: "rheuImmu",
        label: "",
        subkeys: [
          { key: "YOTHER", label: "andere" },
          { key: "YCIBD", label: "chronisch entzündliche Darmerkrankung" },
          { key: "YRA", label: "Rheumatoide Arthritis" },
          { key: "YCG", label: "Kollagenosen" },
          { key: "YVT", label: "Vaskulitiden" },
          { key: "YCGID", label: "angeborene Immundefekte" },
        ],
      },
    ];

    response.get("DKTK")?.data.group.push({
      code: { text: "immu" },
      stratifier: [getMergedStratifier("immu", anamneseGroup, stratifiers)],
    });
  };

  let transplantCounter = 0;

  const trans = () => {
    transplantCounter = 0;
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const transplatngroupe = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "transplant");

    if (!transplatngroupe) return;

    let total = 0;

    for (const stratifier of transplatngroupe.stratifier) {
      for (const stratum of stratifier.stratum) {
        if (stratum.value.text !== "null") {
          for (const pop of stratum.population) {
            total += pop.count;
          }
        }
      }
    }

    transplantCounter = total;
  };

  const neuro = () => {
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const anamneseGroup = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "anamnese");

    if (!anamneseGroup) return;

    const stratifiers = [
      {
        key: "neuro",
        label: "",
        subkeys: [
          { key: "YMP", label: "Parkinson" },
          { key: "YDM", label: "Demenz" },
          { key: "YMS", label: "Multiple Sklerose" },
          { key: "YNE", label: "Neuromuskuläre Erkrankungen" },
          { key: "YOTH", label: "andere" },
        ],
      },
    ];

    response.get("DKTK")?.data.group.push({
      code: { text: "neuro" },
      stratifier: [getMergedStratifier("neuro", anamneseGroup, stratifiers)],
    });
  };

  const lung = () => {
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const anamneseGroup = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "anamnese");

    if (!anamneseGroup) return;

    const stratifiers = [
      {
        key: "chrLung",
        label: "",
        subkeys: [
          { key: "YA", label: "Asthma" },
          { key: "YCOP", label: "COPD" },
          { key: "YPF", label: "Lungenfibrose" },
          { key: "YPH", label: "Lungenhochdruck/pulmonale Hypertonie" },
          { key: "YOHS", label: "Obesitas-Hyperventilationssyndrom (OHS)" },
          { key: "YSA", label: "Schlafapnoe" },
          { key: "YOSAS", label: "Schlafapnoesyndrom (OSAS)" },
          { key: "YCF", label: "Cystische Fibrose" },
          { key: "YOTHER", label: "andere" },
        ],
      },
    ];

    response.get("DKTK")?.data.group.push({
      code: { text: "lung" },
      stratifier: [getMergedStratifier("lung", anamneseGroup, stratifiers)],
    });
  };

  const liver = () => {
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const anamneseGroup = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "anamnese");

    if (!anamneseGroup) return;

    const stratifiers = [
      {
        key: "chrLiverdis",
        label: "",
        subkeys: [
          { key: "YFL", label: "Fettleber" },
          { key: "YLZ", label: "Leberzirrhose" },
          { key: "YCIH", label: "chronisch infektiöse Hepatitis" },
          { key: "YAL", label: "Autoimmune Lebererkrankungen" },
          { key: "YOTHER", label: "andere" },
        ],
      },
    ];

    response.get("DKTK")?.data.group.push({
      code: { text: "liver" },
      stratifier: [getMergedStratifier("liver", anamneseGroup, stratifiers)],
    });
  };

  const diabetes = () => {
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const anamneseGroup = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "anamnese");

    if (!anamneseGroup) return;

    const stratifiers = [
      {
        key: "Diabetes",
        label: "",
        subkeys: [
          { key: "1", label: "Typ 1" },
          { key: "2A", label: "Typ 2 ohne Insulin" },
          { key: "2B", label: "Typ 2 mit Insulin" },
          { key: "3", label: "Typ 3" },
          { key: "4", label: "Typ 4/Gestationsdiabetes" },
        ],
      },
    ];

    response.get("DKTK")?.data.group.push({
      code: { text: "diabites" },
      stratifier: [getMergedStratifier("diabites", anamneseGroup, stratifiers)],
    });
  };

  const virusout = () => {
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const anamneseGroup = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "anamnese");

    if (!anamneseGroup) return;

    const stratifiers: StratifierDefinition[] = [
      {
        key: "chrVirusHIV",
        label: "Chronische Virusinfektion (HIV)",
        includeAsYes: ["Y"],
      },
      {
        key: "chrVirusHBV",
        label: "Chronische Virusinfektion (HBV)",
        includeAsYes: ["Y"],
      },
      {
        key: "chrVirusHCV",
        label: "Chronische Virusinfektion (HCV)",
        includeAsYes: ["Y"],
      },
      {
        key: "chrVirusOTHER",
        label: "Chronische Virusinfektion (Andere)",
        includeAsYes: ["Y"],
      },
    ];

    response.get("DKTK")?.data.group.push({
      code: { text: "virus" },
      stratifier: [getMergedStratifier("virus", anamneseGroup, stratifiers)],
    });
  };

  const anamneseOut = () => {
    if (response === null) {
      return;
    } else if (response.get("DKTK") === undefined) {
      return;
    } else if (response.get("DKTK")?.status !== "succeeded") {
      return;
    }

    const anamneseGroup = response
      .get("DKTK")
      ?.data.group.find((group) => group.code.text === "anamnese");
    if (anamneseGroup === undefined) return;

    const stratifiers: StratifierDefinition[] = [
      { key: "malaria", label: "Malaria" },
      {
        key: "chrKidneyd",
        label: "",
        subkeys: [
          { key: "YH", label: "Nierenerkrankung - mit Hämodialyse" },
          { key: "YWOH", label: "Nierenerkrankung - ohne Hämodialyse" },
        ],
      },
      {
        key: "chrMyobakt",
        label: "",
        subkeys: [
          { key: "YT", label: "Mykobakteriose - Tuberkulose" },
          { key: "YOTHER", label: "Mykobakteriose - andere" },
        ],
      },
      {
        key: "tumorActive",
        label: "",
        subkeys: [
          { key: "A", label: "Tumor - aktiv" },
          { key: "IR", label: "Tumor - in Remission" },
        ],
      },
    ];

    response.get("DKTK")?.data.group.push({
      code: { text: "diseases" },
      stratifier: [getMergedStratifier("diseases", anamneseGroup, stratifiers)],
    });
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
            <lens-query-spinner></lens-query-spinner>
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
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Herz-Kreislauf-Erkrankungen"
            dataKey="cardvasc"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={cardvascHeaders}
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
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Rheumatologische / Immunologische Erkrankungen"
            dataKey="immu"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={immuHeaders}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Chron. Lebererkrankungen"
            dataKey="liver"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={liverHeaders}
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Chron. Lungenerkrankungen"
            dataKey="lung"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            yAxisTitle="Anzahl Erkanungen"
            headers={lungHeaders}
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
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-alter">
          <lens-chart
            title="Alter bei Aufnahme"
            dataKey="age"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            groupRange={10}
            filterRegex="^(1*[12]*[0-9])"
            xAxisTitle="Alter"
            yAxisTitle="Anzahl der Patienten"
          >
          </lens-chart>
        </div>

        <div class="chart-wrapper chart-samples-liquid">
          <lens-chart
            title="Proben LIQUID"
            dataKey="sample_kind"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            filterRegex="^[LIQUID|X].*"
            displayLegends={false}
            xAxisTitle="Probentyp"
            yAxisTitle="Anzahl der Proben"
          >
          </lens-chart>
        </div>
        <div class="chart-wrapper chart-samples-tissue">
          <lens-chart
            title="Proben Tissue"
            dataKey="sample_kind"
            chartType="bar"
            backgroundColor={barChartBackgroundColors}
            filterRegex="^[TISSUE].*"
            displayLegends={false}
            xAxisTitle="Probentyp"
            yAxisTitle="Anzahl der Proben"
          >
          </lens-chart>
        </div>

        <div class="chart-wrapper chart-smoker">
          <lens-chart
            title="Transplantationen"
            dataKey="transplant"
            chartType="pie"
            backgroundColor={pieTransChartBackgroundColors}
          >
          </lens-chart>
          Anzahl Transplantationen: {transplantCounter}
        </div>

        <div class="chart-wrapper chart-sites-multi">
          <SitesChart></SitesChart>
        </div>
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
