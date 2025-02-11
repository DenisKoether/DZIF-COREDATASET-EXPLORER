<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
	import type { LensDataPasser, Site } from '@samply/lens';
	import { backgroundColor } from '../services/tools/chart-style';

	Chart.register(ArcElement, Tooltip, Legend);

	let dataPasser: LensDataPasser;
	let chart: Chart | null = null;
	let response: Map<string, Site> | null = null;

	window.addEventListener('lens-responses-updated', () => {
		response = dataPasser?.getResponseAPI();
		updateChart();
	});

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

	const updateChart = () => {
		if (response == null) return;

		let studyGroup = response.get('DKTK')?.data.group.find((group) => group.code.text === 'study');
		if (!studyGroup) return;

		let sites: Site[] = [];
		studyGroup.stratifier.forEach((stratifier) => {
			stratifier.stratum.forEach((stratum) => {
				if (stratum.value?.text) {
					const values = stratum.value.text.split('#');

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
			});
		});
		renderChart(sites);
	};

	const renderChart = (sites: Site[]) => {
		const ctx = document.getElementById('multiRingChart2');
		if (chart) chart.destroy();

		const siteColorMap = new Map<string, string>();
		sites.forEach((site, index) => {
			siteColorMap.set(site.site, backgroundColor[index % backgroundColor.length]);
		});

		const siteLabels = sites.map((site) => site.site);
		const siteData = sites.map((site) => site.count);
		const siteColors = sites.map((site) => siteColorMap.get(site.site));

		const ttuLabels = sites.flatMap((site) =>
			site.ttus.map((ttu) => `${site.site}-${ttu.ttu}`)
		);
		const ttuData = sites.flatMap((site) => site.ttus.map((ttu) => ttu.count));
		const ttuColors = sites.flatMap((site) =>
			site.ttus.map(() => siteColorMap.get(site.site))
		);

		const studyLabels = sites.flatMap((site) =>
			site.ttus.flatMap((ttu) =>
				ttu.studies.map((study) => `${site.site}-${ttu.ttu}-${study.study}`)
			)
		);
		const studyData = sites.flatMap((site) =>
			site.ttus.flatMap((ttu) => ttu.studies.map((study) => study.count))
		);
		const studyColors = sites.flatMap((site) =>
			site.ttus.flatMap((ttu) =>
				ttu.studies.map(() => siteColorMap.get(site.site))
			)
		);

		chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: siteLabels,
				datasets: [
					{
						label: 'Studies',
						data: studyData,
						backgroundColor: studyColors,
						borderWidth: 1
					},
					{
						label: 'TTUs',
						data: ttuData,
						backgroundColor: ttuColors,
						borderWidth: 1
					},
					{
						label: 'Sites',
						data: siteData,
						backgroundColor: siteColors,
						borderWidth: 1
					}
				]
			},
			options: {
				responsive: true,
				cutout: '50%',
				plugins: {
					title: {
						font: {
							size: 16
						},
						color: '#000000',
						display: true,
						text: 'Patienten pro Standort'
					},
					legend: {
						display: false,
					},
					tooltip: {
						callbacks: {
							label: (tooltipItem) => {
								const dataset = chart.data.datasets[tooltipItem.datasetIndex];
								let label = '';
								if (tooltipItem.datasetIndex === 0) {
									label = studyLabels[tooltipItem.dataIndex];
								} else if (tooltipItem.datasetIndex === 1) {
									label = ttuLabels[tooltipItem.dataIndex];
								} else if (tooltipItem.datasetIndex === 2) {
									label = siteLabels[tooltipItem.dataIndex];
								}

								const value = dataset.data[tooltipItem.dataIndex];
								return `${label}: ${value}`;
							}
						}
					}
				}
			}
		});
	};

	onMount(() => {
		updateChart();
	});
</script>

<canvas id="multiRingChart2"></canvas>
<lens-data-passer bind:this={dataPasser}></lens-data-passer>