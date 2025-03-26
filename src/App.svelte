<script lang="ts">
	import DiseasesChart from './charts/DiseasesChart.svelte';
	import DiseasesChartVirus from './charts/DiseasesChartVirus.svelte';
	import DiseasesChartCardvasc from './charts/DiseasesChartCardvasc.svelte';
	import DiseasesChartLung from './charts/DiseasesChartLung.svelte';
	import DiseasesChartLiverDis from './charts/DiseasesChartLiverDis.svelte';
	import DiseasesChartImmu from './charts/DiseasesChartImmu.svelte';
	import DiseasesChartNeuro from './charts/DiseasesChartNeuro.svelte';
	import DiseasesChartDiabetes from './charts/DiseasesChartDiabetes.svelte';
	import SitesChart from './charts/SitesChart.svelte';
	import TransplantChart from './charts/TransplantChart.svelte';
	import { requestBackend } from './services/backends/backend.service';
	import { browser } from '$app/environment';
	import { genderHeaders, measures } from './config/environment';
	import type { LensDataPasser } from '@samply/lens';
	import { fetchData, catalogueText } from './services/catalogue.service';
	import ScrollToTop from './services/tools/top-anker.svelte';
	import { onMount } from 'svelte';

	import { writable } from 'svelte/store';

	let showHinweis = writable(true);

	function closeHinweis() {
		showHinweis.set(false);
	}

	let catalogueopen = false;

	let dataPasser: LensDataPasser;

	if (browser) {
		window.addEventListener('emit-lens-query', (e) => {
			if (!dataPasser) return;

			const event = e as CustomEvent;
			const { ast, updateResponse, abortController } = event.detail;
			const criteria: string[] = dataPasser.getCriteriaAPI('diagnosis');

			requestBackend(ast, updateResponse, abortController, measures, criteria);
		});
	}

	const catalogueUrl = 'catalogues/dzif-such-und-kerndatensatz.json';
	const optionsFilePath = 'config/options.json';

	const jsonPromises: Promise<{
		catalogueJSON: string;
		optionsJSON: string;
	}> = fetchData(catalogueUrl, optionsFilePath);


/*Query History START*/
  const saveQueryToHistory = (queryData) => {
    if (!queryData) {
      console.error('Abfragedaten sind undefined!');
      return;
    }
    const history = JSON.parse(localStorage.getItem('queryHistory')) || [];
    history.push({ queryData, timestamp: new Date().toISOString() });
    localStorage.setItem('queryHistory', JSON.stringify(history));
    queryHistory = history;
  };

  const handleSearch = (event) => {
    const currentQuery = dataPasser?.getQueryAPI();
    if (currentQuery) {
      saveQueryToHistory(currentQuery);
    }
  };

   let expandedQueries = new Map<number, boolean>();

  const toggleQuery = (index: number) => {
    expandedQueries.set(index, !expandedQueries.get(index));
    expandedQueries = new Map(expandedQueries);
  };

  const clearQueryHistory = () => {
    localStorage.removeItem('queryHistory');
    queryHistory = [];
    console.log('Query-History wurde geleert.');
  };

  let queryHistory = [];

  onMount(() => {
    const history = JSON.parse(localStorage.getItem('queryHistory')) || [];
    queryHistory = history;
  });

  const openQuery = (queryData) => {
    if (!queryData) {
      alert('Keine Abfragedaten verfügbar!');
      return;
    }
    const url = window.location.href;
    const query = btoa(JSON.stringify(queryData));
    const fullUrl = `${url}?query=${query}`;
    window.open(fullUrl, '_blank');
  };
  /*Query History END*/

	/**
	 * The following functions are the API to the library stores (state)
	 * here you get information to use in your application
	 * or manipulate the stores
	 * use if needed and import types from @samply/lens
	 */

	// const getQuery = (): void => {
	// 	console.log('getQuery()', dataPasser.getQueryAPI());
	// };

	// const getResponse = (): void => {
	// 	console.log('getResponse()', dataPasser.getResponseAPI());
	// };

	// const getAST = (): void => {
	// 	console.log('getAst()', dataPasser.getAstAPI());
	// };

	// const removeItem = (queryObject: QueryItem): void => {
	// 	console.log('removeItem()', queryObject);
	// 	dataPasser.removeItemFromQuyeryAPI({ queryObject });
	// 	getQuery();
	// };

	// const removeValue = (queryItem: QueryItem, value: QueryValue): void => {
	// 	console.log('removeValue()', queryItem, value);
	// 	dataPasser.removeValueFromQueryAPI({ queryItem, value });
	// 	getQuery();
	// };

	window.addEventListener("popstate", function () {
    window.location.reload();
});
</script>

{#if $showHinweis}
	<div class="hinweisBox">
		<button class="closeBtn" on:click="{closeHinweis}">&times;</button>
		<p><strong>Hinweis zur Testversion</strong></p>
		<p>
			Diese Webapp befindet sich in einer Testphase und verwendet zufällig generierte
			Testdaten ohne spezifische Verteilung. Dadurch kann es zu Fehlern oder unerwarteten
			Ergebnissen kommen.
		</p>
		<p>
			Fehlen Daten oder Suchelemente? Oder sind irrelevante Ergebnisse dabei? Dann freuen
			wir uns über euer Feedback an <a
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
				<lens-search-bar-multiple noMatchesFoundMessage="{'Keine Ergebnisse gefunden'}"
				></lens-search-bar-multiple>
				<lens-info-button
					noQueryMessage="Leere Suchanfrage: Sucht nach allen Ergebnissen."
					showQuery="{true}"
				></lens-info-button>
				<lens-search-button title="Suchen" on:click={handleSearch}></lens-search-button>
			</div>
		</div>

		<div class="grid">
			<div class="catalogue-wrapper">
				<div class="catalogue">
					<h2>Suchkriterien</h2>
					<lens-info-button message="{[`Information hinzufügen(TODO)`]}"
					></lens-info-button>
					<lens-catalogue
						toggleIconUrl="right-arrow-svgrepo-com.svg"
						addIconUrl="long-right-arrow-svgrepo-com.svg"
						infoIconUrl="info-circle-svgrepo-com.svg"
						texts="{catalogueText}"
						toggle="{{ collapsable: false, open: catalogueopen }}"
					></lens-catalogue>
                    <br>
<div>
  <h2><b>Query History</b></h2>
<div id="query-history">
  {#if queryHistory.length > 0}
    {#each queryHistory as entry, index}
      <div class="history-item">
        <div class="history-header" on:click={() => toggleQuery(index)}>
          <strong>Query {index + 1}</strong>
          <span class="timestamp">{new Date(entry.timestamp).toLocaleString()}</span>
          <span class="toggle-icon">
            {expandedQueries.get(index) ? '▼' : '►'}
          </span>
        </div>

        {#if expandedQueries.get(index)}
          <div class="history-content">
            {#if entry.queryData}
              <pre>{JSON.stringify(entry.queryData, null, 2)}</pre>
            {:else}
              <p>Keine Abfragedaten verfügbar.</p>
            {/if}
            <button on:click={() => openQuery(entry.queryData)}>Diese Suche öffnen</button>
          </div>
        {/if}
      </div>
    {/each}
  {:else}
    <p>No queries saved yet.</p>
  {/if}
</div>
	  <button class="clear-button" on:click={clearQueryHistory}>Clear History</button>
</div>
				</div>
			</div>

			<div class="charts">
				<div class="chart-wrapper result-summary">
					<lens-result-summary></lens-result-summary>
					<button class="datenBeantragen" id="datenBeantragen">Daten beantragen</button>
					<lens-search-modified-display
						>Diagramme repräsentieren nicht mehr die aktuelle Suche!
					</lens-search-modified-display>
				</div>

				<div class="chart-wrapper chart-study">
					<lens-chart
						title="Studie - TTU/TI"
						catalogueGroupCode="study"
						chartType="bar"
						xAxisTitle="Zugehörigkeit"
						yAxisTitle="Anzahl"
						displayLegends="{false}"
					>
					</lens-chart>
				</div>

				<div class="chart-wrapper chart-study">
					<lens-chart
						title="Studie/Kohorte"
						catalogueGroupCode="studyKohorte"
						chartType="bar"
						xAxisTitle="Zugehörigkeit"
						yAxisTitle="Anzahl"
						displayLegends="{false}"
					>
					</lens-chart>
				</div>

				<div class="chart-wrapper chart-gender">
					<lens-chart
						title="Identifizierendes Geschlecht"
						catalogueGroupCode="gender"
						chartType="pie"
						displayLegends="{true}"
						headers="{genderHeaders}"
					></lens-chart>
				</div>

				<div class="chart-wrapper chart-smoker">
					<lens-chart
						title="Raucher"
						catalogueGroupCode="smoker"
						chartType="pie"
						displayLegends="{true}"
					>
					</lens-chart>
				</div>

				<div class="chart-wrapper chart-diseases">
					<DiseasesChart />
				</div>
				<div class="chart-wrapper chart-diseases">
					<DiseasesChartVirus />
				</div>
				<div class="chart-wrapper chart-diseases">
					<DiseasesChartCardvasc />
				</div>
				<div class="chart-wrapper chart-diseases">
					<DiseasesChartLung />
				</div>
				<div class="chart-wrapper chart-diseases">
					<DiseasesChartLiverDis />
				</div>
				<div class="chart-wrapper chart-diseases">
					<DiseasesChartImmu />
				</div>
				<div class="chart-wrapper chart-diseases">
					<DiseasesChartNeuro />
				</div>
				<div class="chart-wrapper chart-diseases">
					<DiseasesChartDiabetes />
				</div>

				<div class="chart-wrapper chart-alter">
					<lens-chart
						title="Alter bei Aufnahme"
						catalogueGroupCode="age"
						chartType="bar"
						groupRange="{10}"
						filterRegex="^(1*[12]*[0-9])"
						xAxisTitle="Alter"
						yAxisTitle="Anzahl der Patienten"
					>
					</lens-chart>
				</div>

				<div class="chart-wrapper chart-samples-liquid">
					<lens-chart
						title="Proben LIQUID"
						catalogueGroupCode="sample_kind"
						chartType="bar"
						filterRegex="^[LIQUID|X].*"
						displayLegends="{false}"
						xAxisTitle="Typ"
						yAxisTitle="Anzahl der Proben"
					>
					</lens-chart>
				</div>
				<div class="chart-wrapper chart-samples-tissue">
					<lens-chart
						title="Proben Tissue"
						catalogueGroupCode="sample_kind"
						chartType="bar"
						filterRegex="^[TISSUE].*"
						displayLegends="{false}"
						xAxisTitle="Typ"
						yAxisTitle="Anzahl der Proben"
					>
					</lens-chart>
				</div>
				<div class="chart-wrapper chart-diseases">
					<TransplantChart></TransplantChart>
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
				Made with ♥ and <a href="https://github.com/samply/lens">samply/lens-core</a>
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

<!-- here it waits on all promises to resolve and fills in the parameters -->
{#await jsonPromises}
	Loading data...
{:then { optionsJSON, catalogueJSON }}
	<lens-options {catalogueJSON} {optionsJSON} {measures}></lens-options>
{:catch someError}
	System error: {someError.message}
{/await}

<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>
