// VITE_TARGET_ENVIRONMENT should be set by the ci pipeline

import {
	anamneseMeasure,
	patientsMeasure,
	specimenMeasure,
	studyMeasure,
	transplantMeasure
} from '../measures';

export const genderHeaders: Map<string, string> = new Map<string, string>()
	.set('male', 'männlich')
	.set('female', 'weiblich')
	.set('other', 'Divers, Intersexuell')
	.set('unknown', 'unbekannt');

	export const neuroHeaders: Map<string, string> = new Map<string, string>()
	.set('YMP', 'Parkinson')
	.set('YDM', 'Demenz')
	.set('YMS', 'Multiple Sklerose')
	.set('YOTH', 'andere')
	.set('YNE', 'Neuromuskuläre Erkrankungen');


	export const lungHeaders: Map<string, string> = new Map<string, string>()
	.set('YA', 'Asthma')
	.set('YCOP', 'COPD')
	.set('YPF', 'Lungenfibrose')
	.set('YPH', 'Lungenhochdruck/pulmonale Hypertonie')
	.set('YOHS', 'Obesitas-Hyperventilationssyndrom (OHS)')
	.set('YSA', 'Schlafapnoe')
	.set('YOSAS', 'chlafapnoesyndrom (OSAS)')
	.set('YCF', 'Cystische Fibrose')
	.set('YOTHER', 'andere')

export const cardvascHeaders: Map<string,string> = new Map<string, string>()
.set('cardvasht', 'Bluthochdruck')
.set('cardvashd', 'Koronare Herzerkrankung')
.set('YHA', 'Zustand nach Herzinfarkt')
.set('YPAVK', 'arterielle Verschlusskrankheit (pAVK)')
.set('YCA', 'Herzrhythmusstörungen')
.set('YHF', 'pAVK (Periphere Arterielle Verschlusskrankheit)')
.set('YRV', 'Zustand nach Revaskularisation')
.set('YCS', 'Carotisstenose')
.set('YOTHER', 'Andere Herz-Kreislauf-Erkrankungen');

export const diabetesHeaders:Map<string, string> = new Map<string, string>()
.set('1', 'Typ 1')
.set('2A',  'Typ 2 ohne Insulin')
.set('2B', 'Typ 2 mit Insulin')
.set('3', 'Typ 3')
.set('4', 'Typ 4');

export const liverHeaders:Map<string, string> = new Map<string, string>()
.set('YFL', 'Fettleber')
.set('YLZ',  'Leberzirrhose')
.set('YCIH', 'chronisch infektiöse Hepatitis')
.set('YAL', 'Autoimmune Lebererkrankungen')
.set('YOTHER', 'andere')

export const immuHeaders:Map<string, string> = new Map<string, string>()
.set('YOTHER', 'andere')
.set('YCIBD',  'chronisch entzündliche Darmerkrankung')
.set('YRA', 'Rheumatoide Arthritis')
.set('YCG', 'Kollagenosen')
.set('YVT', 'Vaskulitiden')
.set('YCGID', 'angeborene Immundefekte');

export const diseasesHeaders: Map<string, string> = new Map<string, string>()
.set('YH', 'Nierenerkrankung - mit Hämodialyse')
.set('YWOH', 'Nierenerkrankung - ohne Hämodialyse')
.set('malaria', 'Malaria')
.set('YT', 'Mykobakteriose - Tuberkulose')
.set('YOTHER', 'Mykobakteriose - andere')
.set('A', 'Tumor - aktiv')
.set('IR', 'Tumor - in Remission');

export const virusHeaders: Map<string,string>= new Map<string,string>()
.set('chr_virus_hiv', 'Chronische Virusinfektion (HIV)')
.set('chr_virus_hbv', 'Chronische Virusinfektion (HBV)')
.set('chr_virus_hcv', 'Chronische Virusinfektion (HCV)')
.set('chr_virus_other', 'Chronische Virusinfektion (Andere)');


export const barChartBackgroundColors: string[] = ['#4dc9f6', '#3da4c7'];


export const backendMeasures = `define InInitialPopulation:\n`;
