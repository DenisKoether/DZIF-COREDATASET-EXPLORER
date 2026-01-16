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
  import { writable } from "svelte/store";
  // Import Lens CSS and JS bundles
  import "@samply/lens/style.css";

  import "@samply/lens";

  import "./app.css";

  	import { Chart } from 'chart.js/auto';
	import { ArcElement, Tooltip, Legend } from 'chart.js';
	import { backgroundColor } from './services/tools/chart-style';

	Chart.register(ArcElement, Tooltip, Legend);

	let chart: Chart | null = null;

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
    const ctx = document.getElementById("multiRingChart2") as HTMLCanvasElement;
    Chart.defaults.font.size = 12;
    chart = new Chart(ctx.getContext("2d"), initialChartData);
  });

  	const updateChart = () => {

		if (result === null) {
			return;
		} 


		let sites: Site[] = [];

for (const [bucket, count] of Object.entries(result.stratifiers.orgout)) {
					const values = bucket.split('#');

					if (values.length === 3) {
						let site = sites.find((s) => s.site === values[0]);
						if (!site) {
							site = {
								site: values[0],
								count: 0,
								ttus: []
							};
							sites.push(site);
						}
						site.count += 1;

						let ttu = site.ttus.find((t) => t.ttu === values[1]);
						if (!ttu) {
							ttu = {
								ttu: values[1],
								count: 0,
								studies: []
							};
							site.ttus.push(ttu);
						}
						ttu.count += 1;

						let study = ttu.studies.find((s) => s.study === values[2]);
						if (!study) {
							study = {
								study: values[2],
								count: 0
							};
							ttu.studies.push(study);
						}
						study.count += 1;
					}
				}
		renderChart(sites);
	};

  const adjustColor = (color: string, factor: number) => {
    let r, g, b;
    if (color.startsWith("#")) {
      r = parseInt(color.slice(1, 3), 16);
      g = parseInt(color.slice(3, 5), 16);
      b = parseInt(color.slice(5, 7), 16);
    } else if (color.startsWith("rgb")) {
      [r, g, b] = color.match(/\d+/g).map(Number);
    } else {
      return color;
    }

    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }

    s = Math.min(1, Math.max(0, s * factor));

    if (factor < 1) {
      l = l + (1 - factor) * 0.15;
    } else {
      l = l - (factor - 1) * 0.1;
    }
    l = Math.min(1, Math.max(0, l));

    let hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  const renderChart = (sites: Site[]) => {
    const ctx = document.getElementById("multiRingChart2");
    if (chart) chart.destroy();

    const siteColorMap = new Map<string, string>();
    sites.forEach((site, index) => {
      siteColorMap.set(
        site.site,
        backgroundColor[index % backgroundColor.length],
      );
    });

    const siteLabels = sites.map((site) => site.site);
    const siteData = sites.map((site) => site.count);
    const siteColors = sites.map((site) =>
      adjustColor(siteColorMap.get(site.site), 2),
    );

    const ttuLabels = sites.flatMap((site) =>
      site.ttus.map((ttu) => `${site.site}-${ttu.ttu}`),
    );
    const ttuData = sites.flatMap((site) => site.ttus.map((ttu) => ttu.count));
    const ttuColors = sites.flatMap((site) =>
      site.ttus.map(() => adjustColor(siteColorMap.get(site.site), 1)),
    );

    const studyLabels = sites.flatMap((site) =>
      site.ttus.flatMap((ttu) =>
        ttu.studies.map((study) => `${site.site}-${ttu.ttu}-${study.study}`),
      ),
    );
    const studyData = sites.flatMap((site) =>
      site.ttus.flatMap((ttu) => ttu.studies.map((study) => study.count)),
    );
    const studyColors = sites.flatMap((site) =>
      site.ttus.flatMap((ttu) =>
        ttu.studies.map(() => adjustColor(siteColorMap.get(site.site), 0.6)),
      ),
    );

    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: siteLabels,
        datasets: [
          {
            label: "Studies",
            data: studyData,
            backgroundColor: studyColors,
            borderWidth: 1,
          },
          {
            label: "TTUs",
            data: ttuData,
            backgroundColor: ttuColors,
            borderWidth: 1,
          },
          {
            label: "Sites",
            data: siteData,
            backgroundColor: siteColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: "50%",
        plugins: {
          title: {
            font: {
              size: 16,
            },
            color: "#000000",
            display: true,
            text: "Patienten pro Standort",
          },
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const dataset = chart.data.datasets[tooltipItem.datasetIndex];
                let label = "";
                if (tooltipItem.datasetIndex === 0) {
                  label = studyLabels[tooltipItem.dataIndex];
                } else if (tooltipItem.datasetIndex === 1) {
                  label = ttuLabels[tooltipItem.dataIndex];
                } else if (tooltipItem.datasetIndex === 2) {
                  label = siteLabels[tooltipItem.dataIndex];
                }

                const value = dataset.data[tooltipItem.dataIndex];
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    });
  };

  //import { buildLibrary, buildMeasure } from './cql-measure';
  import { env } from "$env/dynamic/public";
  import {
    clearSiteResults,
    getAst,
    setSiteResult,
    showToast,
    type LensResult,
  } from "@samply/lens";

  type Site = {
    site: string;
    count: number;
    ttus: Ttu[];
  };

  type Ttu = {
    ttu: string;
    count: number;
    studies: Study[];
  };

  type Study = {
    study: string;
    count: number;
  };

  let initialChartData = {
    type: "pie",
    data: {
      labels: ["", "", "", ""],
      datasets: [
        {
          data: [1, 1, 1, 1],
          backgroundColor: ["#E6E6E6"],
          backgroundHoverColor: ["#E6E6E6"],
        },
      ],
    },
  };

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

        result = filterStratifierBuckets(
          result,
          "diabetes",
          ["1", "2A", "2B", "3", "4"],
          "diabetes",
        );

        result = filterStratifierBuckets(
          result,
          "neuro",
          ["YMP", "YDM", "YMS", "YNE", "YOTH"],
          "neuro",
        );

        result = filterStratifierBuckets(
          result,
          "chr_liverdis",
          ["YAL", "YCIH", "YFL", "YLZ", "YOTHER"],
          "chr_liverdis",
        );

        result = filterStratifierBuckets(
          result,
          "chr_lung",
          ["YA", "YCOP", "YPF", "YPH", "YOHS", "YSA", "YOSAS", "YCF", "YOTHER"],
          "chr_lung",
        );

        result = filterStratifierBuckets(
          result,
          "rheu_immu",
          ["YCIBD", "YRA", "YCG", "YVT", "YCGID", "YOTHER"],
          "rheu_immu",
        );

        setSiteResult("dzif", result);
        updateChart()
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
      let resulta = ["cardvasc"];

      let tmp = filterStratifierBuckets(
        result,
        "cardvaschd",
        ["Y"],
        "cardvaschd",
      );

      if (tmp.stratifiers.cardvaschd.Y !== undefined) {
        result = {
          ...tmp,
          stratifiers: {
            ...tmp.stratifiers,
            cardvaschd: {
              cardvaschd: tmp.stratifiers.cardvaschd.Y,
            },
          },
        };

        resulta.push("cardvaschd");
      }

      tmp = filterStratifierBuckets(result, "cardvasht", ["Y"], "cardvasht");

      if (tmp.stratifiers.cardvasht.Y !== undefined) {
        result = {
          ...tmp,
          stratifiers: {
            ...tmp.stratifiers,
            cardvasht: {
              cardvasht: tmp.stratifiers.cardvasht.Y,
            },
          },
        };

        resulta.push("cardvasht");
      }

      result = combineStratifiers(result, resulta, "card");
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

      result = combineStratifiers(tmp, resulta, "virus");
    }
  };

  const anamneseOut = () => {
    if (result != null) {
      let resulta = ["chr_kidneyd", "chr_myobakt", "tumor_active"];

      let tmp = filterStratifierBuckets(
        result,
        "chr_myobakt",
        ["YT", "YOTHER"],
        "chr_myobakt",
      );

      tmp = filterStratifierBuckets(
        tmp,
        "chr_kidneyd",
        ["YH", "YWOH"],
        "chr_kidneyd",
      );

      tmp = filterStratifierBuckets(
        tmp,
        "tumor_active",
        ["A", "IR"],
        "tumor_active",
      );

      tmp = filterStratifierBuckets(tmp, "malaria", ["Y"], "malaria");

      if (tmp.stratifiers.malaria.Y !== undefined) {
        tmp = {
          ...tmp,
          stratifiers: {
            ...tmp.stratifiers,
            malaria: {
              malaria: tmp.stratifiers.malaria.Y,
            },
          },
        };

        resulta.push("malaria");
      }
      result = tmp;

      result = combineStratifiers(result, resulta, "diseases");
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

        <div class="chart-wrapper chart-sites-multi">
          <canvas id="multiRingChart2"></canvas>

          <div class="siteschart-subtitle">
            <hr />
            Das Diagramm zeigt im innersten Ring die Gesamtzahl der gefundenen Patienten
            pro Standort. Der mittlere Ring untergliedert diese Patienten weiter
            in TTU/TI, während der äußere Ring eine weitere Unterteilung nach den
            jeweiligen Studien vornimmt.
          </div>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    <div class="footer__left-section">
      <div class="footer__made-with">
        <lens-about></lens-about>
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
