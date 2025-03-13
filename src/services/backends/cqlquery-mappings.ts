export const alias = new Map<string, string>([
	['icd10', 'https://hl7.org/fhir/sid/icd-10'],
	['icd10gm', 'https://fhir.de/CodeSystem/dimdi/icd-10-gm'],
	['loinc', 'https://loinc.org'],
	['SampleMaterialType', 'https://fhir.bbmri.de/CodeSystem/SampleMaterialType'], //specimentype
	['StorageTemperature', 'https://fhir.bbmri.de/CodeSystem/StorageTemperature'],
	['FastingStatus', 'https://terminology.hl7.org/CodeSystem/v2-0916'],
	['SmokingStatus', 'https://hl7.org/fhir/uv/ips/ValueSet/current-smoking-status-uv-ips']
]);

export const cqltemplate = new Map<string, string>([
	['gender', "Patient.gender = '{{C}}'"],
	[
		'conditionSampleDiagnosis',
		"((exists[Condition: Code '{{C}}' from {{A1}}]) or (exists[Condition: Code '{{C}}' from {{A2}}])) or (exists from [Specimen] S where (S.extension.where(url='https://fhir.bbmri.de/StructureDefinition/SampleDiagnosis').value.coding.code contains '{{C}}'))"
	],
	['conditionValue', "exists [Condition: Code '{{C}}' from {{A1}}]"],
	[
		'conditionRangeDate',
		'exists from [Condition] C\nwhere FHIRHelpers.ToDateTime(C.onset) between {{D1}} and {{D2}}'
	],
	[
		'conditionRangeAge',
		'exists from [Condition] C\nwhere AgeInYearsAt(FHIRHelpers.ToDateTime(C.onset)) between Ceiling({{D1}}) and Ceiling({{D2}})'
	],
	[
		'conditionGreaterThanAge',
		'exists from [Condition] C\nwhere AgeInYearsAt(FHIRHelpers.ToDateTime(C.onset)) between Ceiling({{D1}}) and Ceiling({{D2}})'
	],
	['age', 'AgeInYears() between Ceiling({{D1}}) and Ceiling({{D2}})'],
	[
		'observation',
		"exists from [Observation: Code '{{K}}' from {{A1}}] O\nwhere O.value.coding.code contains '{{C}}'"
	],
	[
		'observationRange',
		"exists from [Observation: Code '{{K}}' from {{A1}}] O\nwhere O.value between {{D1}} and {{D2}}"
	],
	[
		'observationBodyWeight',
		"exists from [Observation: Code '{{K}}' from {{A1}}] O\nwhere ((O.value as Quantity) < {{D1}} 'kg' and (O.value as Quantity) > {{D2}} 'kg')"
	],
	[
		'observationBMI',
		"exists from [Observation: Code '{{K}}' from {{A1}}] O\nwhere ((O.value as Quantity) < {{D1}} 'kg/m2' and (O.value as Quantity) > {{D2}} 'kg/m2')"
	],
	['hasSpecimen', 'exists [Specimen]'],
	['specimen', "exists [Specimen: Code '{{C}}' from {{A1}}]"],
	['retrieveSpecimenByType', "(S.type.coding.code contains '{{C}}')"],
	[
		'retrieveSpecimenByTemperature',
		"(S.extension.where(url='https://fhir.bbmri.de/StructureDefinition/StorageTemperature').value.coding.code contains '{{C}}')"
	],
	[
		'retrieveSpecimenBySamplingDate',
		'(FHIRHelpers.ToDateTime(S.collection.collected) between {{D1}} and {{D2}})'
	],
	[
		'retrieveSpecimenByFastingStatus',
		"(S.collection.fastingStatus.coding.code contains '{{C}}')"
	],
	[
		'samplingDate',
		'exists from [Specimen] S\nwhere FHIRHelpers.ToDateTime(S.collection.collected) between {{D1}} and {{D2}}'
	],
	[
		'fastingStatus',
		"exists from [Specimen] S\nwhere S.collection.fastingStatus.coding.code contains '{{C}}'"
	],
	[
		'storageTemperature',
		"exists from [Specimen] S where (S.extension.where(url='https://fhir.bbmri.de/StructureDefinition/StorageTemperature').value.coding contains Code '{{C}}' from {{A1}})"
	],
	//neu
	//Studie works
	[
		'AFFILIATION_TTU_TI',
		"exists from [Observation] O where (O.code.coding.where(system='https://dzif.ti-bbd.de/Observation/CONSENT/AFFILIATION_TTU_TI').code contains '{{C}}')"
	],
	[
		'AFFILATION_STUDY',
		"exists from [Observation] O where (O.code.coding.where(system='https://dzif.ti-bbd.de/Observation/CONSENT/AFFILATION_STUDY').code contains '{{C}}')"
	],
	[
		'ORG_UNIT',
		"exists from [Observation] O where (O.code.coding.where(system='https://dzif.ti-bbd.de/Observation/CONSENT/ORG_UNIT').code contains '{{C}}')"
	],
	[
		'CONSENT_GENERAL',
		"exists from [Observation] O where (O.code.coding.where(system='https://dzif.ti-bbd.de/Observation/CONSENT/CONSENT_GENERAL').code contains '{{C}}')"
	],
	//Person works
	[
		'CONSENT_SIGN',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/CONSENT').value contains '{{C}}')"
	],
	[
		'CONSENT_RESTRICTION',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/CONSENT_RESTRICTION').value contains '{{C}}')"
	],
	[
		'CONSENT_SIGNDATE',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/CONSENT_SIGNDATE').value between {{D1}} and {{D2}})"
	],
	[
		'CONSENT_VERSDATE',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/CONSENT_VERSDATE').value between {{D1}} and {{D2}})"
	],
	[
		'WITHDRAWAL',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/WITHDRAWAL').value contains '{{C}}')"
	],
	[
		'WITHDRAWAL_DATE',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/WITHDRAWAL_DATE').value between {{D1}} and {{D2}})"
	],
	[
		'PARTICIPANT_TYPE',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/PARTICIPANT_TYPE').value contains '{{C}}')"
	],
	[
		'INCLUSION_REASON',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/INCLUSION_REASON').value contains '{{C}}')"
	],
	[
		'STUDY_ENDPOINT',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/STUDY_ENDPOINT').value contains '{{C}}')"
	],
	[
		'DATE_OF_DEATH',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/DATE_OF_DEATH').value as FHIR code.Integer between {{D1}} and {{D2}})"
	],
	[
		'AGE_AT_INCLUSION',
		"exists from [Patient] P where (AgeInYearsAt(FHIRHelpers.ToDateTime(P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/AGE_AT_INCLUSION').value)) between {{D1}} and {{D2}})"
	],
	[
		'SEX',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/SEX').value contains '{{C}}')"
	],
	[
		'SEX_OTHER',
		"exists from [Patient] P where (P.extension.where(url='https://fhir.dzif.ti-bbd.de/consent/SEX_OTHER').value contains '{{C}}')"
	],
	// works
	[
		'VISIT_START',
		"exists from [Observation] O where (O.extension.where(url='https://dzif.ti-bbd.de/Observation/VISITE/VISIT_START').value between {{D1}} and {{D2}})"
	],
	[
		'VISIT_TYPE',
		"exists from [Observation] O where (O.extension.where(url='https://dzif.ti-bbd.de/Observation/VISITE/VISIT_TYPE').value contains '{{C}}')"
	],
	[
		'VISIT_TYPE_OTHER',
		"exists from [Observation] O where (O.extension.where(url='https://dzif.ti-bbd.de/Observation/CONSENT/VISIT_TYPE_OTHER').value contains '{{C}}')"
	],
	[
		'VISIT_TYPE_NUMBER',
		"exists from [Observation] O where (O.extension.where(url='https://dzif.ti-bbd.de/Observation/CONSENT/VISIT_TYPE_NUMBER').value contains '{{C}}')"
	],
	[
		'VISIT_TYPE_UNIT',
		"exists from [Observation] O where (O.extension.where(url='https://dzif.ti-bbd.de/Observation/CONSENT/VISIT_TYPE_UNIT').value contains '{{C}}')"
	],

	//ORGAN_TRANSPLANT_GENERAL works
	[
		'TRANSPLANTATION_EXDATE',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/ORGAN_TRANSPLANT_GENERAL/TRANSPLANTATION_EXDATE').code between {{D1}} and {{D2}})"
	],
	[
		'TRANSPLANTATION',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/ORGAN_TRANSPLANT_GENERAL/TRANSPLANTATION').code contains '{{C}}')"
	],
	[
		'TRANSPLANTATION_AMOUNT_OF_TRANSPLANS',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/ORGAN_TRANSPLANT_GENERAL/TRANSPLANTATION_AMOUNT_OF_TRANSPLANS').code contains '{{C}}')"
	],
	// works
	[
		'TRANSPLANTATION_ORGAN',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/TRANSPLANTET_ORGAN/TRANSPLANTATION_ORGAN').code contains '{{C}}')"
	],
	//Anamnese works
	[
		'SMOKING_STATUS',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/smoker').code contains '{{C}}')"
	],
	[
		'WEIGHT',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/weight').code contains '{{C}}')"
	],
	[
		'HEIGHT',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/height').code contains '{{C}}')"
	],
	[
		'CARDVASC_HT',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CARDVASC-HT').code contains '{{C}}')"
	],
	[
		'CARDVASC_HT_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CARDVASC_HT_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'CARDVASC_CHD',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CARDVASC-CHD').code contains '{{C}}')"
	],
	[
		'CARDVASC_CHD_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CARDVASC_CHD_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'CARDVASC',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CARDVASC').code contains '{{C}}')"
	],
	[
		'CHR_LUNG',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_LUNG').code contains '{{C}}')"
	],
	[
		'CHR_LUNG_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_LUNG_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'CHR_KIDNEYD',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_KIDNEYD').code contains '{{C}}')"
	],
	[
		'CHR_LIVERDIS',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_LIVERDIS').code contains '{{C}}')"
	],
	[
		'RHEU_IMMU',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/RHEU_IMMU').code contains '{{C}}')"
	],
	[
		'CHR_MYOBAKT',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_MYOBAKT').code contains '{{C}}')"
	],
	[
		'CHR_MYOBAKT_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_MYOBAKT_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'MALARIA',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/MALARIA').code contains '{{C}}')"
	],
	[
		'CHR_VIRUS_HIV',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HIV').code contains '{{C}}')"
	],
	[
		'CHR_VIRUS_HIV_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HIV_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'CHR_VIRUS_HBV',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HBV').code contains '{{C}}')"
	],
	[
		'CHR_VIRUS_HBV_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HBV_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'CHR_VIRUS_HCV',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HCV').code contains '{{C}}')"
	],
	[
		'CHR_VIRUS_HCV_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_HCV_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'CHR_VIRUS_OTHER',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_OTHER').code contains '{{C}}')"
	],
	[
		'CHR_VIRUS_OTHER_INFO',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_OTHER_INFO').code contains '{{C}}')"
	],
	[
		'CHR_VIRUS_OTHER_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/CHR_VIRUS_OTHER_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'NEURO',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/NEURO').code contains '{{C}}')"
	],
	[
		'NEURO_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/NEURO_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'DIABETES',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/DIABETES').code contains '{{C}}')"
	],
	[
		'DIABETES_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/DIABETES_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	[
		'TUMOR_ACTIVE',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/TUMOR_ACTIVE').code contains '{{C}}')"
	],
	[
		'TUMOR_MORPHOLOGY',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/TUMOR_MORPHOLOGY').code contains '{{C}}')"
	],
	[
		'TUMOR_DIAG_YEAR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Anamnese/TUMOR_DIAG_YEAR').code between {{D1}} and {{D2}})"
	],
	//Klinisch works
	[
		'CLINICAL_INFECTION',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/CLINICAL_INFECTION/CLINICAL_INFECTION').code contains '{{C}}')"
	],
	[
		'CLINICAL_INFECTION_DATE',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/CLINICAL_INFECTION/CLINICAL_INFECTION_DATE').code between {{D1}} and {{D2}})"
	],
	[
		'PTG_CULT_DATE',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/CLINICAL_INFECTION/PTG_CULT_DATE').code between {{D1}} and {{D2}})"
	],
	//Vitalparameter works
	[
		'VITAL_RR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Vital/VITAL_RR').code contains '{{C}}')"
	],
	[
		'VITAL_TEMP',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/Vital/VITAL_TEMP').code contains '{{C}}')"
	],
	//Medikation works
	[
		'MEDS',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS').code contains '{{C}}')"
	],
	[
		'MEDS_IMMUNSUPPR',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_IMMUNSUPPR').code contains '{{C}}')"
	],
	[
		'MEDS_CORTISONE',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_CORTISONE').code contains '{{C}}')"
	],
	[
		'MEDS_ANTIHYPERTENSIVES',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_ANTIHYPERTENSIVES').code contains '{{C}}')"
	],
	[
		'MEDS_INSULIN',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_INSULIN').code contains '{{C}}')"
	],
	[
		'MEDS_ASTHMA',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_ASTHMA').code contains '{{C}}')"
	],
	[
		'MEDS_ANTIHISTAMINES',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_ANTIHISTAMINES').code contains '{{C}}')"
	],
	[
		'MEDS_ANTICOAGULANT',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_ANTICOAGULANT').code contains '{{C}}')"
	],
	[
		'MEDS_CHEMO',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_CHEMO').code contains '{{C}}')"
	],
	[
		'MEDS_ANTIINFECTIVES',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/MEDICATION/MEDS_ANTIINFECTIVES').code contains '{{C}}')"
	],
	//Bioprobenentnahme works
	[
		'BIOSAMPLE_RETRIEVAL',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/BIOSAMPLECOLLECTION/RETRIEVAL').code contains '{{C}}')"
	],
	[
		'BIOSAMPLE_RETRIEVAL_DATE',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/BIOSAMPLECOLLECTION/RETRIEVAL_DATE').code between {{D1}} and {{D2}})"
	],
	[
		'BIOSAMPLE_RETRIEVAL_TIME',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/BIOSAMPLECOLLECTION/RETRIEVAL_TIME').code contains '{{C}}')"
	],
	[
		'BIOSAMPLE_RETRIEVAL_LOCATION',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/BIOSAMPLECOLLECTION/SITE').code contains '{{C}}')"
	],
	//Bioproben Testdaten broke
	[
		'BIOSAMPLE_TYPE',
		"exists from [Specimen] S where (S.type.coding.where(system='https://fhir.dzif.ti-bbd.de/BIOSAMPLE/TYPE').code contains '{{C}}')"
	],
	[
		'BIOSAMPLE_AMOUNT',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/BIOSAMPLE/AMOUNT').code contains '{{C}}')"
	],
	[
		'BIOSAMPLE_AMOUNT_UNIT',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/BIOSAMPLE/AMOUNT_UNIT').code contains '{{C}}')"
	],
	//Klinisches Labor works
	[
		'BIO_SAMPLING_DATE',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/CLINICAL_LABORATORY/BIO_SAMPLING_DATE').code between {{D1}} and {{D2}})"
	],
	[
		'INFECTION_ACUTE',
		"exists from [Observation] O where (O.code.coding.where(system='https://fhir.dzif.ti-bbd.de/Observation/CLINICAL_LABORATORY/INFECTION_ACUTE').code contains '{{C}}')"
	]
]);

export const criterionMap = new Map<string, { type: string; alias?: string[] }>([
	['gender', { type: 'gender' }],
	['diagnosis', { type: 'conditionSampleDiagnosis', alias: ['icd10', 'icd10gm'] }],
	['29463-7', { type: 'observationBodyWeight', alias: ['loinc'] }], //Body weight
	['39156-5', { type: 'observationBMI', alias: ['loinc'] }], //BMI
	['72166-2', { type: 'observation', alias: ['loinc'] }], //Smoking habit
	['donor_age', { type: 'age' }],
	['date_of_diagnosis', { type: 'conditionRangeDate' }],
	['sample_kind', { type: 'specimen', alias: ['SampleMaterialType'] }],
	['storage_temperature', { type: 'storageTemperature', alias: ['StorageTemperature'] }],
	['pat_with_samples', { type: 'hasSpecimen' }],
	['diagnosis_age_donor', { type: 'conditionRangeAge' }],
	['fasting_status', { type: 'fastingStatus', alias: ['FastingStatus'] }],
	['sampling_date', { type: 'samplingDate' }],
	//neu
	['AFFILIATION_TTU_TI', { type: 'AFFILIATION_TTU_TI' }],
	['AFFILATION_STUDY', { type: 'AFFILATION_STUDY' }],
	['ORG_UNIT', { type: 'ORG_UNIT' }],
	['CONSENT_GENERAL', { type: 'CONSENT_GENERAL' }],
	['CONSENT_SIGN', { type: 'CONSENT_SIGN' }],
	['CONSENT_RESTRICTION', { type: 'CONSENT_RESTRICTION' }],
	['CONSENT_SIGNDATE', { type: 'CONSENT_SIGNDATE' }],
	['CONSENT_VERSDATE', { type: 'CONSENT_VERSDATE' }],
	['WITHDRAWAL', { type: 'WITHDRAWAL' }],
	['WITHDRAWAL_DATE', { type: 'WITHDRAWAL_DATE' }],
	['PARTICIPANT_TYPE', { type: 'PARTICIPANT_TYPE' }],
	['INCLUSION_REASON', { type: 'INCLUSION_REASON' }],
	['STUDY_ENDPOINT', { type: 'STUDY_ENDPOINT' }],
	['DATE_OF_DEATH', { type: 'DATE_OF_DEATH' }],
	['AGE_AT_INCLUSION', { type: 'AGE_AT_INCLUSION' }],
	['SEX', { type: 'SEX' }],
	['SEX_OTHER', { type: 'SEX_OTHER' }],
	['VISIT_START', { type: 'VISIT_START' }],
	['VISIT_TYPE', { type: 'VISIT_TYPE' }],
	['VISIT_TYPE_OTHER', { type: 'VISIT_TYPE_OTHER' }],
	['VISIT_TYPE_NUMBER', { type: 'VISIT_TYPE_NUMBER' }],
	['VISIT_TYPE_UNIT', { type: 'VISIT_TYPE_UNIT' }],
	['TRANSPLANTATION_EXDATE', { type: 'TRANSPLANTATION_EXDATE' }],
	['TRANSPLANTATION', { type: 'TRANSPLANTATION' }],
	[
		'TRANSPLANTATION_AMOUNT_OF_TRANSPLANS',
		{ type: 'TRANSPLANTATION_AMOUNT_OF_TRANSPLANS' }
	],
	['TRANSPLANTATION_ORGAN', { type: 'TRANSPLANTATION_ORGAN' }],
	['SMOKING_STATUS', { type: 'SMOKING_STATUS' }],
	['WEIGHT', { type: 'WEIGHT' }],
	['HEIGHT', { type: 'HEIGHT' }],
	['CARDVASC_HT', { type: 'CARDVASC_HT' }],
	['CARDVASC_HT_DIAG_YEAR', { type: 'CARDVASC_HT_DIAG_YEAR' }],
	['CARDVASC_CHD', { type: 'CARDVASC_CHD' }],
	['CARDVASC_CHD_DIAG_YEAR', { type: 'CARDVASC_CHD_DIAG_YEAR' }],
	['CARDVASC', { type: 'CARDVASC' }],
	['CHR_LUNG', { type: 'CHR_LUNG' }],
	['CHR_LUNG_DIAG_YEAR', { type: 'CHR_LUNG_DIAG_YEAR' }],
	['CHR_KIDNEYD', { type: 'CHR_KIDNEYD' }],
	['CHR_LIVERDIS', { type: 'CHR_LIVERDIS' }],
	['RHEU_IMMU', { type: 'RHEU_IMMU' }],
	['CHR_MYOBAKT', { type: 'CHR_MYOBAKT' }],
	['CHR_MYOBAKT_DIAG_YEAR', { type: 'CHR_MYOBAKT_DIAG_YEAR' }],
	['MALARIA', { type: 'MALARIA' }],
	['CHR_VIRUS_HIV', { type: 'CHR_VIRUS_HIV' }],
	['CHR_VIRUS_HIV_DIAG_YEAR', { type: 'CHR_VIRUS_HIV_DIAG_YEAR' }],
	['CHR_VIRUS_HBV', { type: 'CHR_VIRUS_HBV' }],
	['CHR_VIRUS_HBV_DIAG_YEAR', { type: 'CHR_VIRUS_HBV_DIAG_YEAR' }],
	['CHR_VIRUS_HCV', { type: 'CHR_VIRUS_HCV' }],
	['CHR_VIRUS_HCV_DIAG_YEAR', { type: 'CHR_VIRUS_HCV_DIAG_YEAR' }],
	['CHR_VIRUS_OTHER', { type: 'CHR_VIRUS_OTHER' }],
	['CHR_VIRUS_OTHER_INFO', { type: 'CHR_VIRUS_OTHER_INFO' }],
	['CHR_VIRUS_OTHER_DIAG_YEAR', { type: 'CHR_VIRUS_OTHER_DIAG_YEAR' }],
	['NEURO', { type: 'NEURO' }],
	['NEURO_DIAG_YEAR', { type: 'NEURO_DIAG_YEAR' }],
	['DIABETES', { type: 'DIABETES' }],
	['DIABETES_DIAG_YEAR', { type: 'DIABETES_DIAG_YEAR' }],
	['TUMOR_ACTIVE', { type: 'TUMOR_ACTIVE' }],
	['TUMOR_MORPHOLOGY', { type: 'TUMOR_MORPHOLOGY' }],
	['TUMOR_DIAG_YEAR', { type: 'TUMOR_DIAG_YEAR' }],
	['CLINICAL_INFECTION', { type: 'CLINICAL_INFECTION' }],
	['CLINICAL_INFECTION_DATE', { type: 'CLINICAL_INFECTION_DATE' }],
	['PTG_CULT_DATE', { type: 'PTG_CULT_DATE' }],
	['VITAL_RR', { type: 'VITAL_RR' }],
	['VITAL_TEMP', { type: 'VITAL_TEMP' }],
	['MEDS', { type: 'MEDS' }],
	['MEDS_IMMUNSUPPR', { type: 'MEDS_IMMUNSUPPR' }],
	['MEDS_CORTISONE', { type: 'MEDS_CORTISONE' }],
	['MEDS_ANTIHYPERTENSIVES', { type: 'MEDS_ANTIHYPERTENSIVES' }],
	['MEDS_INSULIN', { type: 'MEDS_INSULIN' }],
	['MEDS_ASTHMA', { type: 'MEDS_ASTHMA' }],
	['MEDS_ANTIHISTAMINES', { type: 'MEDS_ANTIHISTAMINES' }],
	['MEDS_ANTICOAGULANT', { type: 'MEDS_ANTICOAGULANT' }],
	['MEDS_CHEMO', { type: 'MEDS_CHEMO' }],
	['MEDS_ANTIINFECTIVES', { type: 'MEDS_ANTIINFECTIVES' }],
	['BIOSAMPLE_RETRIEVAL', { type: 'BIOSAMPLE_RETRIEVAL' }],
	['BIOSAMPLE_RETRIEVAL_DATE', { type: 'BIOSAMPLE_RETRIEVAL_DATE' }],
	['BIOSAMPLE_RETRIEVAL_TIME', { type: 'BIOSAMPLE_RETRIEVAL_TIME' }],
	['BIOSAMPLE_RETRIEVAL_LOCATION', { type: 'BIOSAMPLE_RETRIEVAL_LOCATION' }],
	['BIOSAMPLE_TYPE', { type: 'BIOSAMPLE_TYPE' }],
	['BIOSAMPLE_AMOUNT', { type: 'BIOSAMPLE_AMOUNT' }],
	['BIOSAMPLE_AMOUNT_UNIT', { type: 'BIOSAMPLE_AMOUNT_UNIT' }],
	['BIO_SAMPLING_DATE', { type: 'BIO_SAMPLING_DATE' }],
	['INFECTION_ACUTE', { type: 'INFECTION_ACUTE' }]
]);
