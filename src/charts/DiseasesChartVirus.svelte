<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js/auto';

	import type { LensDataPasser, Site } from '@samply/lens';

	let dataPasser: LensDataPasser;

	interface ChartDataItem {
		answer: string;
		count: number;
	}

	let chart: Chart | null = null;
	let chartData: ChartDataItem[] = [];
	let response: Map<string, Site> | null = null;

	window.addEventListener('lens-responses-updated', () => {
		response = dataPasser?.getResponseAPI();
		anamneseOut();
	});

	const anamneseOut = () => {
		chartData = [];

		if (response == null) {
			return;
		}
		const anamneseGroup = response
			.get('DKTK')
			?.data.group.find((group) => group.code.text === 'anamnese');

		if (!anamneseGroup) return;

		const stratifiers = [
			{
				key: 'chrVirusHIV',
				label: 'Chronische Virusinfektion (HIV)',
				includeAsYes: [
					'Y'
				]
			},
			{
				key: 'chrVirusHBV',
				label: 'Chronische Virusinfektion (HBV)',
				includeAsYes: [
					'Y'
				]
			},
			{
				key: 'chrVirusHCV',
				label: 'Chronische Virusinfektion (HCV)',
				includeAsYes: [
					'Y'
				]
			},
			{
				key: 'chrVirusOTHER',
				label: 'Chronische Virusinfektion (Andere)',
				includeAsYes: [
					'Y'
				]
			}
		];

		stratifiers.forEach(({ key, label, includeAsYes = [] }) => {
			const stratifier = anamneseGroup.stratifier.find((strat) =>
				strat.code.some((c) => c.text === key)
			);

			if (!stratifier) return;

			const results = stratifier.stratum
				.map((stratum) => {
					const value = stratum.value?.text || '';
					const count = stratum.population?.at(0)?.count ?? 0;

					if (includeAsYes.some((yesValue) => value.includes(yesValue))) {
						return { answer: label, count };
					}
					if (['X', 'N', 'null'].some((excluded) => value.includes(excluded))) {
						return null;
					}
					return { answer: label, count };
				})
				.filter((item) => item !== null)
				.reduce((acc, curr) => {
					const existing = acc.find((item) => item.answer === curr.answer);
					if (existing) {
						existing.count += curr.count;
					} else {
						acc.push(curr);
					}
					return acc;
				}, []);

			chartData.push(...results);
		});

		updateChart();
	};

	const updateChart = () => {
		if (chart) {
			chart.data.labels = chartData.map((d) => d.answer);
			chart.data.datasets[0].data = chartData.map((d) => d.count);
			chart.update();
		} else {
			const ctx = document.getElementById('diseasesChartVirus') as HTMLCanvasElement;
			chart = new Chart(ctx.getContext('2d'), {
				type: 'bar',
				data: {
					labels: chartData.map((d) => d.answer),
					datasets: [
						{
							label: 'Count',
							data: chartData.map((d) => d.count),
							backgroundColor: 'rgba(75, 192, 192, 0.2)',
							borderColor: 'rgba(75, 192, 192, 1)',
							borderWidth: 1
						}
					]
				},
				options: {
					plugins: {
						title: {
							display: true,
							text: 'Viruserkrankungen'
						}
					}
				}
			});
		}
	};

	onMount(() => {
		anamneseOut();
	});
</script>

<canvas id="diseasesChartVirus"></canvas>

<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>
