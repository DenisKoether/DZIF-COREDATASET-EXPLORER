import { describe, expect, it } from "vitest";
import { getHeaders } from "./chart-labels";
import { SUPPORTED_LANGUAGES } from "./i18n";

/**
 * The bucket names each chart can receive, after `requestBackend` has filtered
 * and combined the raw stratifiers. Keep in sync with the transforms in
 * App.svelte - an unlabelled bucket renders as a raw code like "YOTHER".
 */
const chartBuckets: Record<string, string[]> = {
  gender: ["M", "F", "OTHER", "UNKOWN"],
  neuro: ["YMP", "YDM", "YMS", "YNE", "YOTH"],
  lung: ["YA", "YCOP", "YPF", "YPH", "YOHS", "YSA", "YOSAS", "YCF", "YOTHER"],
  diabetes: ["1", "2A", "2B", "3", "4"],
  liver: ["YAL", "YCIH", "YFL", "YLZ", "YOTHER"],
  immu: ["YCIBD", "YRA", "YCG", "YVT", "YCGID", "YOTHER"],
  // cardvasc() merges the CARDVASC options with the two yes/no categories
  cardvasc: [
    "YHA",
    "YCA",
    "YHF",
    "YPAVK",
    "YRV",
    "YCS",
    "YOTHER",
    "cardvaschd",
    "cardvasht",
  ],
  // anamneseOut() merges kidney, mycobacteriosis, tumour and malaria
  diseases: ["YH", "YWOH", "YT", "YOTHER", "A", "IR", "malaria"],
  // virusout() produces one bucket per virus, named after the stratifier
  virus: ["chr_virus_hiv", "chr_virus_hbv", "chr_virus_hcv", "chr_virus_other"],
  transplantOrgan: [
    "BV",
    "CLN",
    "AO",
    "SKN",
    "HRT",
    "HRTV",
    "MEN",
    "COR",
    "BON",
    "CAR",
    "LIV",
    "LUN",
    "KID",
    "PAN",
    "TEN",
    "STE",
    "OTHER",
  ],
  sampleType: [
    "LIQUID-EDTA",
    "LIQUID-HEP",
    "LIQUID-CIT",
    "LIQUID-SER",
    "LIQUID-URI",
    "LIQUID-PBMC",
    "LIQUID-DNA",
    "LIQUID-RNA",
    "TISSUE-FF",
    "TISSUE-FFPE",
    "TISSUE-PATH",
    "LIQUID-OTH",
    "TISSUE-OTH",
  ],
};

describe("chart labels", () => {
  for (const language of SUPPORTED_LANGUAGES) {
    describe(language, () => {
      const headers = getHeaders(language);

      for (const [chart, buckets] of Object.entries(chartBuckets)) {
        it(`labels every ${chart} bucket`, () => {
          const map = headers[chart as keyof typeof headers];
          const unlabelled = buckets.filter((b) => !map.has(b));
          expect(unlabelled).toEqual([]);
        });

        it(`has no blank ${chart} label`, () => {
          const map = headers[chart as keyof typeof headers];
          const blank = buckets.filter((b) => (map.get(b) ?? "").trim() === "");
          expect(blank).toEqual([]);
        });
      }
    });
  }

  it("uses the catalogue wording rather than a private copy", () => {
    // "M. Parkinson" is the catalogue's spelling; the old hand-written map
    // shortened it to "Parkinson".
    expect(getHeaders("de").neuro.get("YMP")).toBe("M. Parkinson");
    expect(getHeaders("en").neuro.get("YMP")).toBe("Parkinson's disease");
  });
});
