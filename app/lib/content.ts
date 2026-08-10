/**
 * Site content.
 *
 * Every factual claim here traces to something the company already publishes
 * (its own site and letterhead) or to a property of biochar that is settled
 * science. Nothing is invented to sound impressive. The numbers an impact
 * section would normally carry, and which only the company can supply, are
 * tracked in docs/DATA-NEEDED.md so they never ship inside the bundle.
 */

export const COMPANY = {
  legalName: "Biochar Solutions Africa Ltd.",
  shortName: "Biochar Solutions Africa",
  address: "27 Ali Baba Crescent, Jabi, Abuja",
  country: "Nigeria",
  // Taken from the company letterhead, which is more current than the old
  // website's obviously-placeholder "+234 123 456 7890".
  phones: ["+234 803 707 3300", "+234 908 242 1111"],
  emails: ["biocharsolutionsafrica@gmail.com", "info@bsafrica.com"],
  site: "www.biocharsolutions.africa",
} as const;

/** Real GPS stamps burned into the company's own field photography, 3 Aug 2026. */
export const FIELD_SITES = [
  {
    place: "Bida",
    state: "Niger State",
    lat: 9.07702,
    lon: 6.014468,
    altitude: "Not recorded",
    time: "09:22 WAT",
    note: "Paddy prepared and puddled ahead of char incorporation.",
    photo: "gps-bida-tilling",
  },
  {
    place: "Jima",
    state: "Niger State",
    lat: 9.032228,
    lon: 5.79644,
    altitude: "44.75 m",
    time: "12:51 WAT",
    note: "Transplanting into treated beds.",
    photo: "gps-jima-transplanting",
  },
  {
    place: "Suntale",
    state: "Niger State",
    lat: 9.032188,
    lon: 5.796477,
    altitude: "75 m",
    time: "11:31 WAT",
    note: "Char spread along the bund before working in.",
    photo: "gps-suntale-char-spread",
  },
] as const;

export const SERVICES = [
  {
    n: "01",
    title: "Biochar Production",
    lede: "Premium-quality char from local biomass feedstock.",
    body: "Rice husk, corn cob and wood residue: waste that would otherwise be burned in the open or left to rot. Pyrolysed under controlled low-oxygen conditions into a stable, carbon-rich amendment.",
  },
  {
    n: "02",
    title: "Biochar Application",
    lede: "Getting it into the ground, correctly.",
    body: "Rate, timing and incorporation method decide whether biochar pays for itself in one season or three. We specify application for the crop and the soil in front of us, then work alongside the farmers who apply it.",
  },
  {
    n: "03",
    title: "Research & Development",
    lede: "Continuous trials on feedstock and process.",
    body: "Pyrolysis temperature and residence time change what comes out of the kiln. We test feedstock combinations and process conditions against the soils and crops of the regions we serve.",
  },
  {
    n: "04",
    title: "Consulting",
    lede: "Systems, and the carbon that comes with them.",
    body: "Designing biochar into an existing agricultural operation: feedstock logistics, production siting, application planning, and the measurement needed to make a carbon claim stand up.",
  },
  {
    n: "05",
    title: "Briquettes Production",
    lede: "Cooking fuel from rice husk and char dust.",
    body: "The same feedstock stream yields a clean-burning briquette: a direct alternative to felled-wood charcoal, and a second product line from a single supply chain.",
  },
  {
    n: "06",
    title: "Training & Education",
    lede: "Capacity that stays after we leave.",
    body: "Knowledge transfer for farmers, cooperatives and institutions: production technique, safe handling, application rates, and why the black material in the bowl is worth carrying into the field.",
  },
] as const;

export const VALUES = [
  {
    title: "Sustainability",
    body: "Every solution has to hold up over decades of soil health, not one harvest.",
  },
  {
    title: "Collaboration",
    body: "Farmers, researchers, environmental organisations and policymakers. The problem is too large for any of them alone.",
  },
  {
    title: "Innovation",
    body: "Continuously seeking better ways to harness biochar for African conditions specifically.",
  },
  {
    title: "Integrity",
    body: "Transparent practice and claims we can show you the coordinates for.",
  },
] as const;
