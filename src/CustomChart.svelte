<!-- CustomChart.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';

	export let title = '';
	export let chartType = 'doughnut';
	export let labels = [];
	export let datasets = [];

	let chart;

	onMount(() => {
		const ctx = document.getElementById(`chart-${title}`).getContext('2d');

		if (ctx) {
			chart = new Chart(ctx, {
				type: chartType,
				data: {
					labels: labels,
					datasets: datasets
				},
				options: {
					responsive: true,
					plugins: {
						tooltip: {
							callbacks: {
								label: function (tooltipItem) {
									let dataset = tooltipItem.dataset;
									let currentValue = dataset.data[tooltipItem.dataIndex];
									return dataset.label + ': ' + currentValue + ' Patienten';
								}
							}
						}
					}
				}
			});
		} else {
			console.error('Canvas element not found.');
		}
	});

	onDestroy(() => {
		if (chart) {
			chart.destroy();
		}
	});
</script>

<h2>{title}</h2>
<canvas id="{`chart-${title}`}" width="400" height="400"></canvas>

<style>
	canvas {
		max-width: 100%;
		max-height: 400px;
	}
</style>
