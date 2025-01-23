<script lang="ts">
  import { onMount } from 'svelte';
  import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
  import ChartDataLabels from 'chartjs-plugin-datalabels';
  import type { LensDataPasser, Site } from '@samply/lens';
  import { backgroundColor } from '../services/tools/chart-style';

  Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels);

	//TODO Hierarchische Datenstruktur


  let dataPasser: LensDataPasser;
  let chart: Chart | null = null;
  let response: Map<string, Site> | null = null;

  window.addEventListener('lens-responses-updated', () => {
    response = dataPasser?.getResponseAPI();
    updateChart();
  });

  const updateChart = () => {
    if (response == null) return;

    let studyGroup = response.get('DKTK')?.data.group.find((group) => group.code.text === 'study');
    if (!studyGroup) return [];

    console.log('Study Group:', studyGroup);

    const chartData = studyGroup.stratifier.map((stratifier) => {
      return stratifier.stratum.map((stratum) => {
        console.log('Stratum:', stratum);

        let site: string | null = null;
        let ttu: string | null = null;
        let studies: string[] = [];

        if (stratum.value?.text) {
          const values = stratum.value.text.split('#');

          if (values.length === 3) {
            site = values[0].trim();
            ttu = values[1].trim();
            studies = values[2].split(',').map(study => study.trim());
          }
        }

        return {
          site,
          ttu,
          studies
        };
      });
    }).flat();

    console.log('Chart Data:', chartData);

    renderChart(chartData);
  };

  const renderChart = (chartData) => {
    const ctx = document.getElementById('multiRingChart2');
    if (chart) chart.destroy();

    const sites = chartData.map(item => item.site).filter(site => site !== null);
    const ttuData = chartData.map(item => item.ttu).filter(ttu => ttu !== null);
    const studyData = chartData.flatMap(item => item.studies).filter(study => study !== null);

    console.log('Sites:', sites);
    console.log('TTUs:', ttuData);
    console.log('Studies:', studyData);

    const uniqueSites = [...new Set(sites)];
    const uniqueTTUs = [...new Set(ttuData)];
    const uniqueStudies = [...new Set(studyData)];

    const siteCounts = uniqueSites.map(site => sites.filter(s => s === site).length);
    const ttuCounts = uniqueTTUs.map(ttu => ttuData.filter(t => t === ttu).length);
    const studyCounts = uniqueStudies.map(study => studyData.filter(s => s === study).length);

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: studyCounts,
            labels: uniqueStudies,
            backgroundColor: backgroundColor.slice(0, uniqueStudies.length)
          },
          {
            data: ttuCounts,
            labels: uniqueTTUs,
            backgroundColor: backgroundColor.slice(0, uniqueTTUs.length)
          },
          {
            data: siteCounts,
            labels: uniqueSites,
            backgroundColor: backgroundColor.slice(0, uniqueSites.length)
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
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

<canvas id="multiRingChart2"></canvas>
<lens-data-passer bind:this={dataPasser}></lens-data-passer>
