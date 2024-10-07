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

export const anamneseMeasure = {
	key: 'anamnese',
	measure: {
		code: {
			text: 'anamnese'
		},
		"extension": [
			{
				"url": "http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis",
				"valueCode": "Observation"
			}
		],
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
					expression: 'Anamnese'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'Smoker'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_SmokerStatus'
				}
			},
			{
				code: {
					text: 'Diabetes'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_Diabetes'
				}
			}
		]
	},
	cql: `
define Anamnese:
if InInitialPopulation then [Observation] else {} as List <Observation>

define function Anamnese_SmokerStatus(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/smoker').code.first()

define function Anamnese_Diabetes(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/DIABETES').code.first()
`
};