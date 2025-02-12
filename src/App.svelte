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
	import TestChart from './charts/TestChart.svelte';
	import TransplantChart from './charts/TransplantChart.svelte';
	import { requestBackend } from './services/backends/backend.service';
	import { browser } from '$app/environment';
	import { genderHeaders, measures } from './config/environment';
	import type { LensDataPasser } from '@samply/lens';
	import { fetchData, catalogueText } from './services/catalogue.service';
	import ScrollToTop from './services/tools/top-anker.svelte';

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
</script>
<div class="page">
	<header>
		<img src="../assets/dzif-Logo.svg" alt="Logo des DZIF" />
		<h1>DZIF-COREDATASET-EXPLORER (TESTDATEN)</h1>
	</header>
	<main>
		<div class="search">
			<div class="search-wrapper">
				<lens-search-bar-multiple noMatchesFoundMessage="{'keine Ergebnisse gefunden'}"
				></lens-search-bar-multiple>
				<lens-info-button
					noQueryMessage="Leere Suchanfrage: Sucht nach allen Ergebnissen."
					showQuery="{true}"
				></lens-info-button>
				<lens-search-button title="Suchen"></lens-search-button>
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
						title="Geschlecht"
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


<!--				<div class="chart-wrapper chart-diabetes">
					<lens-chart
						title="Diabetes"
						catalogueGroupCode="diabetes"
						chartType="pie"
						displayLegends="{true}"
					>
					</lens-chart>
				</div>-->

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
