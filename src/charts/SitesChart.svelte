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

const adjustColor = (color: string, factor: number) => {
    let r, g, b;
    if (color.startsWith("#")) {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
    } else if (color.startsWith("rgb")) {
        [r, g, b] = color.match(/\d+/g).map(Number);
    } else {
        return color;
    }

    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
        else if (max === g) h = (b - r) / d + 2;
        else h = (r - g) / d + 4;
        h /= 6;
    }

    s = Math.min(1, Math.max(0, s * factor));

    if (factor < 1) {
        l = l + (1 - factor) * 0.15;
    } else {
        l = l - (factor - 1) * 0.10;
    }
    l = Math.min(1, Math.max(0, l));

    let hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
};



	const updateChart = () => {

		if (response === null) {
			return;
		} else if (response.get('DKTK') === undefined) {
			return
		} else if (response.get('DKTK')?.status !== "succeeded") {
			return
		}

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
		const siteColors = sites.map((site) => adjustColor(siteColorMap.get(site.site), 2));


		const ttuLabels = sites.flatMap((site) =>
			site.ttus.map((ttu) => `${site.site}-${ttu.ttu}`)
		);
		const ttuData = sites.flatMap((site) => site.ttus.map((ttu) => ttu.count));
        const ttuColors = sites.flatMap((site) =>
            site.ttus.map(() => adjustColor(siteColorMap.get(site.site), 1))
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
        ttu.studies.map(() => adjustColor(siteColorMap.get(site.site), 0.6))
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
		const ctx = document.getElementById('multiRingChart2') as HTMLCanvasElement;
			Chart.defaults.font.size = 12;
			chart = new Chart(ctx.getContext('2d'), initialChartData);
	});

	import './chart.css';
</script>

<canvas id="multiRingChart2"></canvas>

<div class="siteschart-subtitle"><hr>Das Diagramm zeigt im innersten Ring die Gesamtzahl der gefundenen Patienten pro Standort. Der mittlere Ring
    untergliedert diese Patienten weiter in TTU/TI, während der äußere Ring eine weitere Unterteilung nach den
    jeweiligen Studien vornimmt.</div>
<lens-data-passer bind:this={dataPasser}></lens-data-passer>