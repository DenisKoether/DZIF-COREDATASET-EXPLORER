<script lang="ts">
    import type { LensDataPasser } from '@samply/lens';
    import { onMount } from 'svelte';
    import { Chart } from 'chart.js/auto';
    
    let dataPasser: LensDataPasser;
    
    const getResponse = (): void => {
        console.log('getResponse()', dataPasser.getResponseAPI());
    };
    
    interface ChartDataItem {
        answer: string;
        count: number;
    }
    
    let chart: Chart | null = null;
    let chartData: ChartDataItem[] = [];
    
    const sitesOut = () => {
        chartData = [];
    
        let data = dataPasser.getResponseAPI();
        let studyGroup = data
            .get('DKTK')
            ?.data.group.find((group) => group.code.text === 'study');
    
        if (studyGroup) {
            let orgsStratifier = studyGroup.stratifier.find((strat) =>
                strat.code.some((c) => c.text === 'Orgs')
            );
    
            if (orgsStratifier) {
                const value1CountMap = {};
                const value2CountMap = {};
                const value3CountMap = {};
    
                let result = orgsStratifier.stratum
                    .map((stratum) => {
                        const answer = stratum.value?.text;
                        const count = stratum.population?.at(0)?.count ?? 0;
    
                        if (answer && !answer.includes('null')) {
                            const [value1, value2, value3] = answer.split('#');
    
                            if (value1) {
                                value1CountMap[value1] = (value1CountMap[value1] || 0) + count;
                            }
                            if (value2) {
                                value2CountMap[value2] = (value2CountMap[value2] || 0) + count;
                            }
                            if (value3) {
                                value3CountMap[value3] = (value3CountMap[value3] || 0) + count;
                            }
    
                            return { answer: `${value1}, ${value2}, ${value3}`, count };
                        }
                    })
                    .filter((item) => item !== null);
    
                chartData.push(...(result as ChartDataItem[]));
                console.log(result);
                console.log("Value 1 Häufigkeiten:", value1CountMap);
                console.log("Value 2 Häufigkeiten:", value2CountMap);
                console.log("Value 3 Häufigkeiten:", value3CountMap);
                updateChart(value1CountMap, value2CountMap, value3CountMap);
            }
        }
    };
    
    const updateChart = (value1CountMap, value2CountMap, value3CountMap) => {
        const value1Labels = Object.keys(value1CountMap);
        const value1Data = Object.values(value1CountMap);
    
        const value2Labels = Object.keys(value2CountMap);
        const value2Data = Object.values(value2CountMap);
    
        const value3Labels = Object.keys(value3CountMap);
        const value3Data = Object.values(value3CountMap);
    
        if (chart) {
            chart.data.labels = value1Labels.concat(value2Labels).concat(value3Labels);
            chart.data.datasets[0].data = value1Data;
            chart.data.datasets[1].data = value2Data;
            chart.data.datasets[2].data = value3Data;
            chart.update();
        } else {
            const ctx = document.getElementById('multiSeriesChart') as HTMLCanvasElement;
            chart = new Chart(ctx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: value1Labels.concat(value2Labels).concat(value3Labels),
                    datasets: [
                        {
                            label: 'Value 1',
                            data: value1Data,
                            backgroundColor: 'rgba(75, 192, 192, 0.5)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Value 2',
                            data: value2Data,
                            backgroundColor: 'rgba(153, 102, 255, 0.5)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Value 3',
                            data: value3Data,
                            backgroundColor: 'rgba(255, 159, 64, 0.5)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                        }
                    ]
                },
                options: {
                    cutout: '50%',
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Multi-Series Pie Chart'
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value}`;
                                }
                            }
                        }
                    }
                }
            });
        }
    };
    
    onMount(() => {
        sitesOut();
    });
    </script>
    
    <canvas id="multiSeriesChart"></canvas>
    
    <button on:click="{getResponse}">getResponse</button>
    <button on:click="{sitesOut}">testOut</button>
    <lens-data-passer bind:this="{dataPasser}"></lens-data-passer>
    