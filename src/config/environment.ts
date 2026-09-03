// VITE_TARGET_ENVIRONMENT should be set by the ci pipeline

/* Chart legend labels now live in `chart-labels.ts`, derived from the
   catalogue, so the charts and the search criteria cannot drift apart. */
export { getHeaders, type HeaderMaps } from "./chart-labels";

export const barChartBackgroundColors: string[] = ["#4dc9f6", "#3da4c7"];

export const backendMeasures = `define InInitialPopulation:\n`;
