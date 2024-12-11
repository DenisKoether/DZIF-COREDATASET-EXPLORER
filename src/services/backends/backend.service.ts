import type { MeasureItem, Measure, AstTopLayer, Site, MeasureGroup } from '@samply/lens';

import { buildLibrary, buildMeasure } from './cql-measure';
import { translateAstToCql } from './ast-to-cql-translator';
import { Blaze } from './blaze';

export const requestBackend = (
	ast: AstTopLayer,
	updateResponse: (response: Map<string, Site>) => void,
	abortController: AbortController,
	measureGroups: MeasureGroup[],
	criteria: string[]
) => {
	const measures: Measure[] = measureGroups[0].measures.map(
		(measureItem: MeasureItem) => measureItem.measure
	);

	let query = {};

	const cql = translateAstToCql(
		ast,
		false,
		'define InInitialPopulation:',
		measureGroups[0].measures,
		criteria
	);

	console.log(cql);

	const library = buildLibrary(`${cql}`);
	const measure = buildMeasure(library.url, measures);
	query = { lang: 'cql', lib: library, measure: measure };

	console.debug(query);

	let backendUrl: string = '';

	/**
	 * TODO: add different backend URLs for different environments
	 */

	// if (import.meta.env.VITE_TARGET_ENVIRONMENT === "production") {
	//     backendUrl = "https://locator-dev.bbmri-eric.eu/backend";
	// } else if (import.meta.env.VITE_TARGET_ENVIRONMENT === "staging") {
	backendUrl = 'http://localhost:8082/fhir';
	console.debug(backendUrl);
	// } else {
	//     backendUrl = "http://localhost:8055";
	// }

	// const backend = new Spot(new URL(backendUrl), [
	//     "aachen",
	//     "berlin",
	//     "brno",
	//     "brno-recetox",
	//     "cyprus",
	//     "dresden",
	//     "frankfurt",
	//     "goettingen",
	//     "hannover",
	//     "heidelberg",
	//     "luebeck",
	//     "mannheim",
	//     "marburg",
	//     "muenchen-hmgu",
	//     "olomouc",
	//     "pilsen",
	//     "prague-ffm",
	//     "prague-ior",
	//     "regensburg",
	//     "rome",
	//     "wuerzburg",
	// ]);

	const backend = new Blaze(new URL(backendUrl), 'DKTK', '');

	backend.send(cql, updateResponse, abortController, measures);
};
