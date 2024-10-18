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
		extension: [
			{
				url: 'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis',
				valueCode: 'Observation'
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
			},
			{
				code: {
					text: 'diagnosis'
				},
				criteria: {
					language: 'text/cql',
					expression: 'DiagnosisCode'
				}
			},
			{
				code: {
					text: 'cardvascHT'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CardvascHT'
				}
			},
			{
				code: {
					text: 'cardvascCHD'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CardvascCHD'
				}
			},
			{
				code: {
					text: 'cardvasc'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_Cardvasc'
				}
			},
			{
				code: {
					text: 'chrLung'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_LUNG'
				}
			},
			{
				code: {
					text: 'chrKidneydSeverity'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_KIDNEYD_SEVERITY'
				}
			},
			{
				code: {
					text: 'chrKidneyd'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_KIDNEYD'
				}
			},
			{
				code: {
					text: 'chrLiverdis'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_LIVERDIS'
				}
			},
			{
				code: {
					text: 'rheuImmu'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_RHEU_IMMU'
				}
			},
			{
				code: {
					text: 'chrMyobakt'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_MYOBAKT'
				}
			},
			{
				code: {
					text: 'malaria'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_MALARIA'
				}
			},
			{
				code: {
					text: 'chrVirusHIV'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_VIRUS_HIV'
				}
			},
			{
				code: {
					text: 'chrVirusHBV'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_VIRUS_HBV'
				}
			},
			{
				code: {
					text: 'chrVirusHCV'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_VIRUS_HCV'
				}
			},
			{
				code: {
					text: 'chrVirusOTHER'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_CHR_VIRUS_OTHER'
				}
			},
			{
				code: {
					text: 'neuro'
				},
				criteria: {
					language: 'text/cql',
					expression: 'Anamnese_NEURO'
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

define function DiagnosisCode(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'http://fhir.de/CodeSystem/bfarm/icd-10-gm').code.first()

define function Anamnese_CardvascHT(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CARDVASC-HT').code.first()

define function Anamnese_CardvascCHD(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CARDVASC-CHD').code.first()

define function Anamnese_Cardvasc(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CARDVASC').code.first()

define function Anamnese_CHR_LUNG(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_LUNG').code.first()

define function Anamnese_CHR_KIDNEYD_SEVERITY(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_KIDNEYD_SEVERITY').code.first()

define function Anamnese_CHR_KIDNEYD(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_KIDNEYD').code.first()

define function Anamnese_CHR_LIVERDIS(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_LIVERDIS').code.first()

define function Anamnese_RHEU_IMMU(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/RHEU_IMMU').code.first()

define function Anamnese_CHR_MYOBAKT(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_MYOBAKT').code.first()

define function Anamnese_MALARIA(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/MALARIA').code.first()

define function Anamnese_CHR_VIRUS_HIV(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HIV').code.first()

define function Anamnese_CHR_VIRUS_HBV(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HBV').code.first()

define function Anamnese_CHR_VIRUS_HCV(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HCV').code.first()

define function Anamnese_CHR_VIRUS_OTHER(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_OTHER').code.first()

define function Anamnese_NEURO(anamnese FHIR.Observation):
anamnese.code.coding.where(system = 'https://fhir.dzif.ti-bbd.de/Observation/Anamnese/NEURO').code.first()
`
};

export const specimenMeasure = {
	key: 'specimen',
	measure: {
		code: {
			text: 'specimen'
		},
		extension: [
			{
				url: 'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis',
				valueCode: 'Specimen'
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
					expression: 'Specimen'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'sample_kind'
				},
				criteria: {
					language: 'text/cql',
					expression: 'SampleType'
				}
			}
		]
	},
	cql: `
define Specimen:
if InInitialPopulation then [Specimen] else {} as List<Specimen>

define function SampleType(specimen FHIR.Specimen):
specimen.type.coding.where(system = 'https://fhir.dzif.ti-bbd.de/BIOSAMPLE/TYPE').code.first()
`
};


export const studyMeasure = {
	key: 'study',
	measure: {
		code: {
			text: 'study'
		},
		extension: [
			{
				url: 'http://hl7.org/fhir/us/cqfmeasures/StructureDefinition/cqfm-populationBasis',
				valueCode: 'Observation'
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
					expression: 'Study'
				}
			}
		],
		stratifier: [
			{
				code: {
					text: 'study'
				},
				criteria: {
					language: 'text/cql',
					expression: 'StudyOut'
				}
			},
			{
				code: {
					text: 'Orgs'
				},
				criteria: {
					language: 'text/cql',
					expression: 'OrgOut'
				}
			}
		]
	},
	cql: `
define Study:
if InInitialPopulation then [Observation] else {} as List<Observation>

define function StudyOut(study FHIR.Observation):
study.code.coding.where(system = 'http://dzif.ti-bbd.de/Observation/CONSENT/AFFILIATION_TTU_TI').code.first()

define function OrgOut(study FHIR.Observation):
study.code.coding.where(system = 'http://dzif.ti-bbd.de/Observation/CONSENT/ORG_UNIT').code.first() 
+ '#' + study.code.coding.where(system = 'http://dzif.ti-bbd.de/Observation/CONSENT/AFFILIATION_TTU_TI').code.first() 
+ '#' + study.code.coding.where(system = 'http://dzif.ti-bbd.de/Observation/CONSENT/AFFILATION_STUDY').code.first()
`
};
