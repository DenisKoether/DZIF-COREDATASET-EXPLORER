<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js/auto';
	import type { LensDataPasser, Site } from '@samply/lens';
	import { backgroundColor, backgroundHoverColor } from '../services/tools/chart-style';

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
				key: 'neuro',
				label: '',
				subkeys: [
					{ key: 'YMP', label: 'Parkinson' },
					{ key: 'YDM', label: 'Demenz' },
					{ key: 'YMS', label: 'Multiple Sklerose' },
					{ key: 'YNE', label: 'Neuromuskuläre Erkrankungen' },
					{ key: 'YOTH', label: 'andere' }
				]
			}
		];


		stratifiers.forEach(({ key, label, subkeys = [] }) => {
			const stratifier = anamneseGroup.stratifier.find((strat) =>
				strat.code.some((c) => c.text === key)
			);

			if (!stratifier) return;

			if (!subkeys.length) {
				const results = stratifier.stratum
					.map((stratum) => {
						const value = stratum.value?.text || '';
						const count = stratum.population?.at(0)?.count ?? 0;

						if (['X', 'N', 'null'].some((excluded) => value.includes(excluded))) {
							return null;
						}
						return { answer: label, count };
					})
					.filter((item) => item !== null);

				chartData.push(...results);
			}

			subkeys.forEach(({ key: subkey, label: subLabel }) => {
				const subStratum = stratifier.stratum.find((stratum) =>
					stratum.value?.text === subkey
				);

				if (subStratum) {
					const count = subStratum.population?.at(0)?.count ?? 0;
					if (count > 0) {
						chartData.push({ answer: subLabel, count });
					}
				}
			});
		});

		updateChart();
	};


	const updateChart = () => {
		if (chart) {
			chart.data.labels = chartData.map((d) => d.answer);
			chart.data.datasets[0].data = chartData.map((d) => d.count);
			chart.data.datasets[0].backgroundColor = backgroundColor.slice(0, chartData.length);
			chart.update();
		} else {
			const ctx = document.getElementById('diseasesChartNeuro') as HTMLCanvasElement;
			Chart.defaults.font.size = 12;
			chart = new Chart(ctx.getContext('2d'), {
				type: 'bar',
				data: {
					labels: chartData.map((d) => d.answer),
					datasets: [
						{
							label: 'Count',
							data: chartData.map((d) => d.count),
							backgroundColor: backgroundColor.slice(0, chartData.length),
							backgroundHoverColor,
							borderWidth: 1
						}
					]
				},
				options: {
					scales:{
						y:{
							title: {
								display: true,
							text: "Anzahl der Patienten"
						}
						}
					},
					plugins: {
						legend: {
							display: false
						},
						title: {
							font: {
								size: 16
							},
							color: '#000000',
							display: true,
							text: 'Neurologische-Erkrankungen'
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

<canvas id="diseasesChartNeuro"></canvas>

<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>
