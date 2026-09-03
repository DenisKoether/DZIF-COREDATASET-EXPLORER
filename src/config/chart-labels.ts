/**
 * Chart legend labels, derived from the catalogue.
 *
 * The charts and the catalogue must agree on both the codes and the wording -
 * hand-maintaining a second copy of them is how `cardvaschd` ended up spelled
 * `cardvashd` and how the gender legend drifted to `male`/`female`. Everything
 * here is read out of `catalogue-de.json` / `catalogue-en.json`, so a catalogue
 * edit reaches the charts automatically.
 */

import catalogueDe from "./catalogue-de.json";
import catalogueEn from "./catalogue-en.json";
import type { Language } from "./translations";

type CatalogueCriterion = { key: string; name: string };
type CatalogueNode = {
  key: string;
  name: string;
  fieldType?: string;
  childCategories?: CatalogueNode[];
  criteria?: CatalogueCriterion[];
};

type Category = { name: string; options: Map<string, string> };

/** Maps the codes returned by the backend to the labels shown in the charts. */
export type HeaderMaps = {
  gender: Map<string, string>;
  neuro: Map<string, string>;
  lung: Map<string, string>;
  cardvasc: Map<string, string>;
  diabetes: Map<string, string>;
  liver: Map<string, string>;
  immu: Map<string, string>;
  diseases: Map<string, string>;
  virus: Map<string, string>;
  transplantOrgan: Map<string, string>;
  sampleType: Map<string, string>;
};

/** category key -> its display name and its code/label options */
const indexCatalogue = (nodes: CatalogueNode[]): Map<string, Category> => {
  const index = new Map<string, Category>();

  const walk = (items: CatalogueNode[]) => {
    for (const item of items) {
      if (item.criteria?.length) {
        index.set(item.key, {
          name: item.name,
          options: new Map(item.criteria.map((c) => [c.key, c.name])),
        });
      }
      if (item.childCategories?.length) walk(item.childCategories);
    }
  };

  walk(nodes);
  return index;
};

const emptyCategory: Category = { name: "", options: new Map() };

const buildHeaders = (index: Map<string, Category>): HeaderMaps => {
  const category = (key: string): Category => index.get(key) ?? emptyCategory;
  const options = (key: string): Map<string, string> =>
    new Map(category(key).options);
  const label = (key: string, code: string): string =>
    category(key).options.get(code) ?? code;

  /* The combined "diseases" chart merges four categories, so a bare option name
     ("Aktiv", "Mit Hämodialyse") would not say which disease it belongs to. */
  const qualified = (key: string, codes: string[]): [string, string][] =>
    codes.map((code) => [code, `${category(key).name} - ${label(key, code)}`]);

  return {
    gender: options("gender"),
    neuro: options("NEURO"),
    lung: options("CHR_LUNG"),
    diabetes: options("DIABETES"),
    liver: options("CHR_LIVERDIS"),
    immu: options("RHEU_IMMU"),

    // `cardvasc()` merges the CARDVASC options with one bucket per yes/no
    // category, named after the stratifier it came from.
    cardvasc: new Map<string, string>([
      ...options("CARDVASC"),
      ["cardvasht", category("CARDVASC_HT").name],
      ["cardvaschd", category("CARDVASC_CHD").name],
    ]),

    // `anamneseOut()` merges kidney/mycobacteriosis/tumour options plus a single
    // "malaria" bucket.
    diseases: new Map<string, string>([
      ...qualified("CHR_KIDNEYD", ["YH", "YWOH"]),
      ...qualified("CHR_MYOBAKT", ["YT", "YOTHER"]),
      ...qualified("TUMOR_ACTIVE", ["A", "IR"]),
      ["malaria", category("MALARIA").name],
    ]),

    // `virusout()` produces one bucket per virus, named after the stratifier.
    virus: new Map<string, string>([
      ["chr_virus_hiv", category("CHR_VIRUS_HIV").name],
      ["chr_virus_hbv", category("CHR_VIRUS_HBV").name],
      ["chr_virus_hcv", category("CHR_VIRUS_HCV").name],
      ["chr_virus_other", category("CHR_VIRUS_OTHER").name],
    ]),

    transplantOrgan: options("TRANSPLANTATION_ORGAN"),

    /* The biosample charts key on the "type" stratifier. The legendMapping in
       the options files is filed under "sample_kind", which Lens never matches
       against that dataKey, so these charts rendered raw codes. */
    sampleType: options("BIOSAMPLE_TYPE"),
  };
};

const headersByLanguage: Record<Language, HeaderMaps> = {
  de: buildHeaders(indexCatalogue(catalogueDe as CatalogueNode[])),
  en: buildHeaders(indexCatalogue(catalogueEn as CatalogueNode[])),
};

export const getHeaders = (language: Language): HeaderMaps =>
  headersByLanguage[language];
