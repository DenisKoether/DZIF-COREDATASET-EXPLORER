/* This defines a measure 'patients' for creating a population of all patients with additional stratifier Gender, Age and Deceased */
export const patientsMeasure = {
	key: 'patients',
	measure: {
		code: {
			text: 'patients'
		},
		population: [
			{
				code: {
					coding: [
						{
							system: 'http://terminology.hl7.org/CodeSystem/measure-population',
							code: 'initial-population'
						}
					]
				},
				criteria: {
					language: 'text/cql-identifier',
					expression: 'InInitialPopulation'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'Gender'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Gender'
				}
			},
			{
				code: {
					text: 'Age'
				},
				criteria: {
					language: 'text/cql',
					expression: 'AgeClass'
				}
			}
		]
	},
	cql: `
define Gender:
if (Patient.gender is null) then 'unknown' else Patient.gender

define AgeClass:
if (Patient.birthDate is null) then 'unknown' else ToString((AgeInYears() div 10) * 10)
`
};

