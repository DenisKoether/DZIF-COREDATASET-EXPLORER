<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart } from 'chart.js/auto';

	import type { LensDataPasser } from '@samply/lens';

	let dataPasser: LensDataPasser;

	interface ChartDataItem {
		answer: string;
		count: number;
	}

	let chart: Chart | null = null;
	let chartData: ChartDataItem[] = [];

	const getResponse = (): void => {
		console.log('getResponse()', dataPasser.getResponseAPI());
		//let data = dataPasser.getResponseAPI();
	};

	const anamneseOut = () => {
		chartData = [];

		let data = dataPasser.getResponseAPI();
		let anamneseGroup = data
			.get('DKTK')
			?.data.group.find((group) => group.code.text === 'anamnese');

		if (anamneseGroup) {
			let cardvascHTStratifier = anamneseGroup.stratifier.find((strat) =>
				strat.code.some((c) => c.text === 'cardvascHT')
			);
			let cardvascCHDStratifier = anamneseGroup.stratifier.find((strat) =>
				strat.code.some((c) => c.text === 'cardvascCHD')
			);
			let cardvascStratifier = anamneseGroup.stratifier.find((strat) =>
				strat.code.some((c) => c.text === 'cardvasc')
			);
            let chrLungStratifier = anamneseGroup.stratifier.find((strat) =>
				strat.code.some((c) => c.text === 'chrLung')
			);

			if (cardvascHTStratifier) {
				let resultHT = cardvascHTStratifier.stratum
					.map((stratum) => {
						const answer = 'CardvascHT-' + stratum.value?.text;
						const count = stratum.population?.at(0)?.count ?? 0;

						return answer && !answer.includes('null') ? { answer, count } : null;
					})
					.filter((item) => item !== null);

				chartData.push(...resultHT);
			}

			if (cardvascCHDStratifier) {
				let resultCHD = cardvascCHDStratifier.stratum
					.map((stratum) => {
						const answer = 'CardvascCHD-' + stratum.value?.text;
						const count = stratum.population?.at(0)?.count ?? 0;

						return answer && !answer.includes('null') ? { answer, count } : null;
					})
					.filter((item) => item !== null);

				chartData.push(...resultCHD);
			}

			if (cardvascStratifier) {
				let resultCardvasc = cardvascStratifier.stratum
					.map((stratum) => {
						const answer = 'Cardvasc-' + stratum.value?.text;
						const count = stratum.population?.at(0)?.count ?? 0;

						return answer && !answer.includes('null') ? { answer, count } : null;
					})
					.filter((item) => item !== null);

				chartData.push(...resultCardvasc);
			}

            if (chrLungStratifier) {
				let resultChrLung= chrLungStratifier.stratum
					.map((stratum) => {
						const answer = 'chrLung-' + stratum.value?.text;
						const count = stratum.population?.at(0)?.count ?? 0;

						return answer && !answer.includes('null') ? { answer, count } : null;
					})
					.filter((item) => item !== null)

				chartData.push(...resultChrLung);
			}
			updateChart();
		}
	};

	const updateChart = () => {
		if (chart) {
			chart.data.labels = chartData.map((d) => d.answer);
			chart.data.datasets[0].data = chartData.map((d) => d.count);
			chart.update();
		} else {
			const ctx = document.getElementById('diseasesChart') as HTMLCanvasElement;
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
							text: 'Krankheiten'
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

<canvas id="diseasesChart"></canvas>

<button on:click="{getResponse}"> getResponse </button>

<button on:click="{anamneseOut}"> testOut </button>

<lens-data-passer bind:this="{dataPasser}"></lens-data-passer>
