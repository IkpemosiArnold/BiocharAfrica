/**
 * Site content.
 *
 * Sources, in order of authority:
 *   1. docs/Document (14).docx, supplied by management. This is the current
 *      positioning and supersedes the live site wherever they disagree. It
 *      moves the company from "we sell biochar" to an integrated carbon-removal
 *      and climate-finance proposition, which is a materially different pitch.
 *   2. biocharsolutions.africa, for team credentials and contact details.
 *   3. The company letterhead, for the address and phone numbers.
 *
 * Nothing is invented. The numbers an impact section would normally carry are
 * tracked in docs/DATA-NEEDED.md so they never ship inside the bundle.
 */

export const COMPANY = {
  legalName: "Biochar Solutions Africa Ltd.",
  shortName: "Biochar Solutions Africa",
  /* From the closing line of management's document. */
  tagline: "Carbon solutions rooted in African soil.",
  /* The document's own subtitle, and the clearest statement of the pitch. */
  positioning:
    "Regenerating African soils. Removing carbon. Creating rural prosperity.",
  address: "27 Ali Baba Crescent, Jabi, Abuja",
  country: "Nigeria",
  // Letterhead numbers; the live site lists the second of these.
  phones: ["+234 803 707 3300", "+234 908 242 1111"],
  /* The only real mailbox for public contact. The site previously published
     biocharsolutionsafrica@gmail.com and info@bsafrica.com, taken from the old
     site and the letterhead. Neither exists: the first is a personal Gmail, the
     second is on a different domain entirely. Confirmed against the live cPanel
     account list, where the domain mailboxes are aisha@, akanimo@, alamin@,
     ibrahim@, info@, muhammad@ and usman@. */
  emails: ["info@biocharsolutions.africa"],
  site: "www.biocharsolutions.africa",
} as const;

/** One-paragraph description, close to management's own wording. */
export const OVERVIEW =
  "An integrated climate-smart agriculture and carbon-removal enterprise, turning agricultural residues into high-quality biochar, regenerative soil products, renewable process energy and measurable climate value.";

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

/**
 * The four integrated solutions from management's document.
 *
 * These replace the six operational services the old site listed. The six were
 * a menu of tasks; these are the business. The old items have not been thrown
 * away, they map into these four, recorded in `covers` so that nothing which
 * was previously advertised silently disappears.
 */
export const SOLUTIONS = [
  {
    n: "01",
    slug: "soil",
    title: "Agricultural Biochar and Soil Products",
    lede: "Fit-for-purpose biochar and biochar-based soil amendments.",
    body: "Designed to improve soil structure, water retention, nutrient-use efficiency, microbial activity and long-term soil health, particularly in the degraded, acidic, sandy and drought-prone soils that limit yield across much of the continent.",
    covers: ["Biochar production", "Biochar application"],
  },
  {
    n: "02",
    slug: "carbon",
    title: "Carbon Removal and Climate Finance",
    lede: "Carbon-removal projects that can be audited, not asserted.",
    body: "Structured on feedstock traceability, lifecycle assessment, and digital monitoring, reporting and verification, aligned with recognised international carbon-crediting methodologies.",
    covers: ["Carbon project structuring", "MRV", "Consulting"],
  },
  {
    n: "03",
    slug: "infrastructure",
    title: "Waste-to-Value Infrastructure",
    lede: "Decentralised and industrial-scale biomass conversion.",
    body: "Productive alternatives to residue burning that reduce waste-management pressure and recover useful thermal energy and other valuable co-products, including clean-burning briquettes drawn from the same feedstock stream.",
    covers: ["Pyrolysis systems", "Briquettes production", "Process energy"],
  },
  {
    n: "04",
    slug: "community",
    title: "Farmer and Community Partnerships",
    lede: "Inclusive feedstock supply chains, built with the people in them.",
    body: "Work alongside farmers, cooperatives, aggregators, processors, research institutions and public agencies to run field demonstrations, transfer technique, and expand adoption of regenerative practice. Capacity that stays after we leave.",
    covers: ["Training and education", "Field demonstration", "R&D trials"],
  },
] as const;

/** Feedstocks management names explicitly. */
export const FEEDSTOCKS = [
  "Rice husks and straw",
  "Maize cobs and stalks",
  "Other responsibly sourced biomass residues",
] as const;

/** The impact proposition, verbatim in substance from the document. */
export const IMPACT_POINTS = [
  "Restore degraded soils and enhance agricultural productivity",
  "Improve soil water retention and resilience to drought",
  "Reduce residue burning, smoke pollution and greenhouse-gas emissions",
  "Secure durable atmospheric carbon removal and storage",
  "Create green employment and additional income for rural communities",
  "Support climate-smart agriculture, circular economy and food security",
  "Advance Africa's contribution to the Paris Agreement and the Sustainable Development Goals",
] as const;

/**
 * Leadership, taken from the /our-team page of the live site.
 *
 * This is the company's strongest credential and the old site buried it behind
 * a nav link. Six people, with a Wageningen soil-science PhD, a Lancaster
 * environmental-management PhD holding Cambridge, Stanford and MIT
 * fellowships, and a founder who has actually raised climate finance.
 *
 * Portraits were downloaded from the same page at full resolution rather than
 * the cropped Elementor thumbnails, and run through the normal image pipeline.
 */
export const TEAM = [
  {
    /* Supplied verbatim by management, 13 Aug 2026, replacing the shorter
       version taken from the old site. Note the correction: the old site
       described him as a doctoral researcher; management states he holds the
       PhD and refers to him as Dr. Al-Amin, so the title is applied here.

       Their text used em dashes around the residue list. Those are commas here
       to match the rest of the site's punctuation; no wording is changed. A
       stray capital in "Africa, He holds" is also corrected. */
    name: "Dr. Al Amin Ibrahim",
    role: "Founder and Chief Executive",
    photo: "team-al-amin-ibrahim",
    bio: [
      "As Founder and CEO of Biochar Solutions Africa, he holds a PhD in Sustainable Development from the University of Abuja, with doctoral research centred on the relationship between climate finance, ESG and sustainable energy development in Nigeria. Dr. Al-Amin is developing a specialised platform around biochar production, regenerative agriculture, soil restoration, carbon sequestration and agricultural-waste valorisation.",
      "The Biochar Solutions Africa platform identifies biochar's role in soil improvement, nutrient retention, waste management, circular economy and agricultural productivity.",
      "His vision for the sector is considerably broader than biochar production alone. It involves developing an integrated African circular bioeconomy in which agricultural residues, including rice husks and straw, maize cobs and stalks and other biomass residues, can be converted through controlled thermochemical processes into biochar and associated value streams.",
    ],
  },
  {
    name: "Prof. Aisha Abdulkadir",
    role: "Co-Founder and Chief Soil Scientist",
    photo: "team-aisha-abdulkadir",
    bio: [
      "B.Agric and MSc in Soil Science from Ahmadu Bello University, Zaria, and a PhD from Wageningen University in the Netherlands, where she worked on modelling nutrient flows and balances in agroecosystems with the Plant Production Systems Group. On the faculty of ABU's Department of Soil Science since 2002, specialising in soil physics.",
    ],
  },
  {
    name: "Dr. Akanimo Odon",
    role: "Co-Founder and Head of R&D",
    photo: "team-akanimo-odon",
    bio: [
      "Master's in environmental rehabilitation and a PhD in Environmental Management from Lancaster University, with business and enterprise fellowships from Cambridge, Stanford and MIT. Consultant at the Lancaster Environment Centre and Chair for Africa of the Scientific Research and Innovation Council UK.",
    ],
  },
  {
    name: "Muhammad Musa",
    role: "Co-Founder and Head of Operations",
    photo: "team-muhammad-musa",
    bio: [
      "MSc in Environmental Management from Bayero University Kano and a BSc in Geography from Yobe State University. Previously project manager and chief executive at Sahel Humanity Centre, an environmental management and sustainability company in Damaturu, Yobe State. Responsible for staffing and operational process.",
    ],
  },
  {
    name: "Dr. Ibrahim Yarima",
    role: "Project Coordinator",
    photo: "team-ibrahim-yarima",
    bio: [
      "BSc Botany from the University of Maiduguri, a specialist diploma in biological technology from the Nigeria Institute of Science and Technology, an MSc in Land Resources from Bayero University Kano, and a PhD in Geography and Environmental Management from Maiduguri. Research fellow at the Centre for Arid Zone Studies.",
    ],
  },
  {
    name: "Dr. Usman Aliyu",
    role: "Head of Business Development",
    photo: "team-usman-aliyu",
    bio: [
      "PhD and MSc in Environmental Management from the University of Maiduguri, a first degree in Geology and a postgraduate diploma in environmental management. Fifteen years helping start-ups in northern Nigeria scale, concentrated on eco-innovation, product management and business development.",
    ],
  },
] as const;

/**
 * The document's own closing sections, kept close to its wording. Management
 * asked for their write-up to be used obviously, so these carry their headings
 * rather than paraphrases of them.
 */
export const REGENERATIVE_VALUE =
  "Biochar Solutions Africa connects agriculture, industrial innovation and climate finance through a balanced multi-product business model. Our ambition is to establish a trusted African platform for technically sound biochar production, commercially viable soil solutions and high-integrity carbon removal, beginning in Nigeria and expanding across the continent.";

export const PARTNER_INVITE =
  "We welcome collaboration with farmers, agro-processors, governments, research institutions, development-finance organisations, carbon-market participants, technology providers and impact investors.";

export const CLOSING_LINE =
  "Let us transform Africa's agricultural residues into healthier soils, stronger communities and permanent climate value.";

/** Who the document explicitly invites. Used as a qualifier on Contact. */
export const PARTNER_AUDIENCES = [
  "Farmers and cooperatives",
  "Agro-processors and aggregators",
  "Governments and public agencies",
  "Research institutions",
  "Development-finance organisations",
  "Carbon-market participants",
  "Technology providers",
  "Impact investors",
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

/**
 * The company's 2024 report, supplied by management for publication.
 * Size is recorded here so the download button can state it: at 6.6MB this is
 * by far the heaviest thing on the site, and on a metered Nigerian mobile plan
 * that is a real cost to disclose before the tap rather than after.
 */
export const REPORT = {
  year: "2024",
  title: "Biochar Africa Report",
  summary:
    "The company's full 2024 report: the production model, the feedstock economics, the field programme in Niger State and the carbon case, set out at length.",
  file: "/reports/biochar-solutions-africa-report-2024.pdf",
  pages: 41,
  size: "6.6 MB",
} as const;
