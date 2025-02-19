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

	const newStrats = [
		{
			site: 'HD',
			count: 33,
			TTUs: [
				{
					TTU: 'HD-TI_EI',
					count: 10,
					studies: [
						{ study: 'HD-TI_EI-TX', count: 1 },
						{ study: 'HD-TI_EI-HIV', count: 0 },
						{ study: 'HD-TI_EI-FWS', count: 3 },
						{ study: 'HD-TI_EI-FWSC', count: 0 },
						{ study: 'HD-TI_EI-TIARA', count: 0 },
						{ study: 'HD-TI_EI-TBC', count: 0 },
						{ study: 'HD-TI_EI-KS', count: 2 },
						{ study: 'HD-TI_EI-LACHMI', count: 0 },
						{ study: 'HD-TI_EI-HBV', count: 1 },
						{ study: 'HD-TI_EI-COVT', count: 0 },
						{ study: 'HD-TI_EI-CRYO', count: 3 },
						{ study: 'HD-TI_EI-OTHER', count: 0 }
					]
				},
				{
					TTU: 'HD-TI_PI',
					count: 10,
					studies: [
						{ study: 'HD-TI_PI-TX', count: 1 },
						{ study: 'HD-TI_PI-HIV', count: 3 },
						{ study: 'HD-TI_PI-FWS', count: 0 },
						{ study: 'HD-TI_PI-FWSC', count: 0 },
						{ study: 'HD-TI_PI-TIARA', count: 0 },
						{ study: 'HD-TI_PI-TBC', count: 0 },
						{ study: 'HD-TI_PI-KS', count: 0 },
						{ study: 'HD-TI_PI-LACHMI', count: 3 },
						{ study: 'HD-TI_PI-HBV', count: 0 },
						{ study: 'HD-TI_PI-COVT', count: 3 },
						{ study: 'HD-TI_PI-CRYO', count: 0 },
						{ study: 'HD-TI_PI-OTHER', count: 0 }
					]
				},
				{
					TTU: 'HD-TI-AD',
					count: 13,
					studies: [
						{ study: 'HD-TI-AD-TX', count: 3 },
						{ study: 'HD-TI-AD-HIV', count: 0 },
						{ study: 'HD-TI-AD-FWS', count: 0 },
						{ study: 'HD-TI-AD-FWSC', count: 5 },
						{ study: 'HD-TI-AD-TIARA', count: 0 },
						{ study: 'HD-TI-AD-TBC', count: 0 },
						{ study: 'HD-TI-AD-KS', count: 0 },
						{ study: 'HD-TI-AD-LACHMI', count: 0 },
						{ study: 'HD-TI-AD-HBV', count: 5 },
						{ study: 'HD-TI-AD-COVT', count: 0 },
						{ study: 'HD-TI-AD-CRYO', count: 0 },
						{ study: 'HD-TI-AD-OTHER', count: 0 }
					]
				}
			]
		},
		{
			site: 'HH',
			count: 33,
			TTUs: [
				{
					TTU: 'HH-TI_EI',
					count: 10,
					studies: [
						{ study: 'HH-TI_EI-TX', count: 1 },
						{ study: 'HH-TI_EI-HIV', count: 0 },
						{ study: 'HH-TI_EI-FWS', count: 3 },
						{ study: 'HH-TI_EI-FWSC', count: 0 },
						{ study: 'HH-TI_EI-TIARA', count: 0 },
						{ study: 'HH-TI_EI-TBC', count: 0 },
						{ study: 'HH-TI_EI-KS', count: 2 },
						{ study: 'HH-TI_EI-LACHMI', count: 0 },
						{ study: 'HH-TI_EI-HBV', count: 1 },
						{ study: 'HH-TI_EI-COVT', count: 0 },
						{ study: 'HH-TI_EI-CRYO', count: 3 },
						{ study: 'HH-TI_EI-OTHER', count: 0 }
					]
				},
				{
					TTU: 'HH-TI_PI',
					count: 10,
					studies: [
						{ study: 'HH-TI_PI-TX', count: 1 },
						{ study: 'HH-TI_PI-HIV', count: 3 },
						{ study: 'HH-TI_PI-FWS', count: 0 },
						{ study: 'HH-TI_PI-FWSC', count: 0 },
						{ study: 'HH-TI_PI-TIARA', count: 0 },
						{ study: 'HH-TI_PI-TBC', count: 0 },
						{ study: 'HH-TI_PI-KS', count: 0 },
						{ study: 'HH-TI_PI-LACHMI', count: 3 },
						{ study: 'HH-TI_PI-HBV', count: 0 },
						{ study: 'HH-TI_PI-COVT', count: 3 },
						{ study: 'HH-TI_PI-CRYO', count: 0 },
						{ study: 'HH-TI_PI-OTHER', count: 0 }
					]
				},
				{
					TTU: 'HH-TI-AD',
					count: 13,
					studies: [
						{ study: 'HH-TI-AD-TX', count: 3 },
						{ study: 'HH-TI-AD-HIV', count: 0 },
						{ study: 'HH-TI-AD-FWS', count: 0 },
						{ study: 'HH-TI-AD-FWSC', count: 5 },
						{ study: 'HH-TI-AD-TIARA', count: 0 },
						{ study: 'HH-TI-AD-TBC', count: 0 },
						{ study: 'HH-TI-AD-KS', count: 0 },
						{ study: 'HH-TI-AD-LACHMI', count: 0 },
						{ study: 'HH-TI-AD-HBV', count: 5 },
						{ study: 'HH-TI-AD-COVT', count: 0 },
						{ study: 'HH-TI-AD-CRYO', count: 0 },
						{ study: 'HH-TI-AD-OTHER', count: 0 }
					]
				}
			]
		}
	];

	const updateChart = () => {
		if (response == null) return;

		let studyGroup = response.get('DKTK')?.data.group.find((group) => group.code.text === 'study');
		if (!studyGroup) return [];


		/*		const chartData = stratifiers.map(stratifier => {
					const relevantStratifier = studyGroup.stratifier.find(s =>
						s.code.some(c => c.text === stratifier.key)
					);
					if (!relevantStratifier) return { label: stratifier.label, data: [] };

					const data = stratifier.subkeys.map(subkey => {
						const count = relevantStratifier.stratum
							.filter(stratum => stratum.value?.text === subkey.key)
							.reduce((sum, stratum) => sum + (stratum.population?.at(0)?.count ?? 0), 0);
						return { answer: subkey.label, count };
					}).filter(item => item.count > 0);

					console.log(`${stratifier.label} data:`, data);
					return { label: stratifier.label, data };
				});*/

		const chartData = newStrats.map(siteData => {
			const { site, count, TTUs } = siteData;
			return {
				site,
				count,
				TTUs: TTUs.map(ttu => {
					const { TTU, count, studies } = ttu;
					return {
						TTU,
						count,
						studies: studies.map(study => ({
							study: study.study,
							count: study.count
						}))
					};
				})
			};
		});

		renderChart(chartData);
	};


	/*const renderChart = (chartData) => {
		const ctx = document.getElementById('multiRingChart') as HTMLCanvasElement;
		Chart.defaults.font.size = 12;
		if (chart) chart.destroy();
		console.log(chartData);
		chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				/!*				datasets: chartData.map((dataset, index) => ({
									label: dataset.label,
									data: dataset.data.map(item => item.count),




									backgroundColor: backgroundColor.slice(0, chartData.length)
								}))*!/
				datasets: [{
					data: chartData.map(o => o.count),
					labels: chartData.map(o => o.site),
					backgroundColor: backgroundColor.slice(0, chartData.length)
				},
					{
						data: chartData.map(o => o.count),
						labels: chartData.map(o => o.TTUs),
					}]
			},
			options: {
				responsive: true,
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
						text: 'Patienten pro Standort'
					},
					tooltip: {}
				}
			}
		});
	};*/

	const renderChart = (chartData) => {
    const ctx = document.getElementById('multiRingChart');
    if (chart) chart.destroy();

    const sites = chartData.map(site => site.site);
    const siteCounts = chartData.map(site => site.count);

    const ttuData = chartData.flatMap(site =>
      site.TTUs.map(ttu => ({ TTU: ttu.TTU, count: ttu.count, site: site.site }))
    );
    const ttus = [...new Set(ttuData.map(ttu => ttu.TTU))];
    const ttuCounts = ttus.map(ttu =>
      ttuData.filter(data => data.TTU === ttu).reduce((sum, curr) => sum + curr.count, 0)
    );

    const studyData = chartData.flatMap(site =>
      site.TTUs.flatMap(ttu =>
        ttu.studies.map(study => ({
          study: study.study,
          count: study.count,
          TTU: ttu.TTU
        }))
      )
    );

    const studyLabels = [...new Set(studyData.map(item => item.study))];
    const studyCounts = studyLabels.map(study =>
      studyData.filter(item => item.study === study).reduce((sum, curr) => sum + curr.count, 0)
    );

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: studyCounts,
            labels: studyLabels,
            backgroundColor: backgroundColor.slice(0, studyLabels.length)
          },
          {
            data: ttuCounts,
            labels: ttus,
            backgroundColor: backgroundColor.slice(0, ttus.length)
          },

					          {
            data: siteCounts,
            labels: sites,
            backgroundColor: backgroundColor.slice(0, sites.length)
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
																title: {
							font: {
								size: 16
							},
							color: '#000000',
							display: true,
							text: 'Patienten pro Standort (Demo)'
						},
          legend: {
            display: false,
            position: 'right'
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const dataset = chart.data.datasets[tooltipItem.datasetIndex];
                const label = dataset.labels[tooltipItem.dataIndex];
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

<canvas id="multiRingChart"></canvas>
<lens-data-passer bind:this={dataPasser}></lens-data-passer>
