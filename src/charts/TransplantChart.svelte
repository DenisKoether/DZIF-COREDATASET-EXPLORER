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
		transplantOut();
	});

	const transplantOut = () => {
		chartData = [];

		if (response === null) {
			return;
		} else if (response.get('DKTK') === undefined) {
			return
		} else if (response.get('DKTK')?.status !== "succeeded") {
			return
		}

		const transplantGroup = response
			.get('DKTK')
			?.data.group.find((group) => group.code.text === 'transplant');
		if (!transplantGroup) return;

		const stratifiers = [
			{
				key: 'transplant',
				label: '',
				subkeys: [
					{ key: 'BON', label: 'BON' },
					{ key: 'STE', label: 'STE' },
					{ key: 'CLN', label: 'CLN' },
					{ key: 'LUN', label: 'LUN' },
					{ key: 'COR', label: 'COR' },
					{ key: 'KID', label: 'KID' },
					{ key: 'HRT', label: 'HRT' },
					{ key: 'HRTV', label: 'HRTV' },
					{ key: 'AO', label: 'AO' },
					{ key: 'OTHER', label: 'OTHER' },
					{ key: 'BV', label: 'BV' },
					{ key: 'CAR', label: 'CAR' },
					{ key: 'SKN', label: 'SKN' },
					{ key: 'MEN', label: 'MEN' },
					{ key: 'LIV', label: 'LIV' },
					{ key: 'PAN', label: 'PAN' },
					{ key: 'TEN', label: 'TEN' }
				]
			}
		];

		stratifiers.forEach(({ key, label, subkeys = [] }) => {
			const stratifier = transplantGroup.stratifier.find((strat) =>
				strat.code.some((c) => c.text === key)
			);

			if (!stratifier) {
				console.warn(`Stratifier not found for key: ${key}`);
				return;
			}

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

		const totalCount = chartData.reduce((total, item) => total + item.count, 0);
		updateChart(totalCount);
	};

	const updateChart = (totalCount: number) => {
		if (chart) {
			chart.data.labels = chartData.map((d) => d.answer);
			chart.data.datasets[0].data = chartData.map((d) => d.count);
			chart.data.datasets[0].backgroundColor = backgroundColor.slice(0, chartData.length);
			chart.update();
		} else {
			const ctx = document.getElementById('transplantChart') as HTMLCanvasElement;
			if (!ctx) {
				console.error('Canvas element not found');
				return;
			}

			Chart.defaults.font.size = 12;
			chart = new Chart(ctx.getContext('2d'), {
				type: 'pie',
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
							text: 'Transplantierte Organe'
						},
						subtitle: {
							display: true,
							text: 'Anzahl aller Transplantationen: ' + totalCount
						}
					}
				}
			});
		}
	};

	let initialChartData = {
        type: 'pie',
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
		const ctx = document.getElementById('transplantChart') as HTMLCanvasElement;
			Chart.defaults.font.size = 12;
			chart = new Chart(ctx.getContext('2d'), initialChartData);
	});

	import './chart.css';
</script>

<canvas class="lens-chart" id="transplantChart"></canvas>

<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>