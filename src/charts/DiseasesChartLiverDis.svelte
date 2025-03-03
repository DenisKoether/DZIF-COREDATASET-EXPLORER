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

		if (response === null) {
			return;
		} else if (response.get('DKTK') === undefined) {
			return
		} else if (response.get('DKTK')?.status !== "succeeded") {
			return
		}

		const anamneseGroup = response
			.get('DKTK')
			?.data.group.find((group) => group.code.text === 'anamnese');

		if (!anamneseGroup) return;

		const stratifiers = [
			{
				key: 'chrLiverdis',
				label: '',
				subkeys: [
					{ key: 'YFL', label: 'Fettleber' },
					{ key: 'YLZ', label: 'Leberzirrhose' },
					{ key: 'YCIH', label: 'chronisch infektiöse Hepatitis' },
					{ key: 'YAL', label: 'Autoimmune Lebererkrankungen' },
					{ key: 'YOTHER', label: 'andere' }
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
			const ctx = document.getElementById('diseasesChartLiverDis') as HTMLCanvasElement;
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
							text: 'Lebererkrankungen'
						}
					}
				}
			});
		}
	};

	let initialChartData = {
        type: 'bar',
        data: {
            labels: ["", "", "", ""],
            datasets: [
                {
                    data: [1, 1, 1, 1],
                    backgroundColor: ["#E6E6E6"],
                    backgroundHoverColor: ["#E6E6E6"],
                },
            ],
        }
    };

	onMount(() => {
		const ctx = document.getElementById('diseasesChartLiverDis') as HTMLCanvasElement;
			Chart.defaults.font.size = 12;
			chart = new Chart(ctx.getContext('2d'), initialChartData);
	});

	import './chart.css';
</script>

<canvas class="lens-chart" id="diseasesChartLiverDis"></canvas>

<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>
