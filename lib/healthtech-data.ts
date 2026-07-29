export const retrieved = "29 Jul 2026";

export const opportunities = [
  "The next India pharmacy",
  "Diagnostics-first health membership",
  "Women’s health, expanded beyond PCOS",
  "The IVF and fertility chain, reimagined",
  "Pediatric primary care, redesigned",
  "Mental health for kids and teens",
  "AI-driven home healthcare",
  "Vision and dental for Bharat",
  "Teledermatology with AI triage",
  "AI radiologist for tier 2 and 3",
  "AI pathologist for cancer screening",
  "The doctor copilot for OPD",
  "AI for hospital revenue cycle and operations",
  "PBM and corporate health benefits",
  "Precision oncology and genomic testing",
  "Cancer care navigation",
  "The asset-light hospital chain",
  "Senior and assisted living",
  "Respiratory and allergy care",
  "Wearables and remote patient monitoring",
] as const;

export type Candidate = {
  slug: string;
  name: string;
  domain: string;
  location: string;
  opportunity: typeof opportunities[number];
  category: string;
  stage: string;
  status: "Needs review" | "Screened" | "Incomplete";
  recommendation: "Review" | "Watch" | "Further diligence";
  score: number;
  owner: string;
  reviewed: string;
  claim: string;
  sourceTitle: string;
  publisher: string;
  sourceUrl: string;
  published: string;
  excerpt: string;
};

export const candidates: Candidate[] = [
  {
    slug: "tata-1mg", name: "Tata 1mg", domain: "1mg.com", location: "India",
    opportunity: "The next India pharmacy", category: "Health commerce", stage: "Not assessed",
    status: "Needs review", recommendation: "Further diligence", score: 68, owner: "Demo analyst", reviewed: retrieved,
    claim: "Tata 1mg offers online pharmacy, lab-test booking and online consultations.",
    sourceTitle: "About Tata 1mg", publisher: "Tata 1mg", sourceUrl: "https://www.1mg.com/aboutus",
    published: "Not stated", excerpt: "Order medicines and health products online and get it delivered at home from licensed pharmacies.",
  },
  {
    slug: "healthians", name: "Healthians", domain: "healthians.com", location: "India",
    opportunity: "Diagnostics-first health membership", category: "Diagnostics", stage: "Not assessed",
    status: "Incomplete", recommendation: "Review", score: 54, owner: "Demo analyst", reviewed: retrieved,
    claim: "Healthians presents itself as an at-home diagnostic testing provider.",
    sourceTitle: "Healthians — Health tests at home", publisher: "Healthians", sourceUrl: "https://www.healthians.com/",
    published: "Not stated", excerpt: "Health tests at home.",
  },
  {
    slug: "portea", name: "Portea Medical", domain: "portea.com", location: "India",
    opportunity: "AI-driven home healthcare", category: "Care delivery", stage: "Not assessed",
    status: "Needs review", recommendation: "Further diligence", score: 66, owner: "Demo analyst", reviewed: retrieved,
    claim: "Portea lists nursing, physiotherapy, elder care and other medical services delivered at home.",
    sourceTitle: "Healthcare at Home", publisher: "Portea Medical", sourceUrl: "https://www.portea.com/",
    published: "Not stated", excerpt: "Medical Services Offered At Home.",
  },
  {
    slug: "cureskin", name: "CureSkin", domain: "cureskin.com", location: "India",
    opportunity: "Teledermatology with AI triage", category: "Dermatology", stage: "Not assessed",
    status: "Needs review", recommendation: "Review", score: 63, owner: "Demo analyst", reviewed: retrieved,
    claim: "CureSkin describes an AI-assisted service in which a dermatologist reviews a personalised skin-treatment regimen.",
    sourceTitle: "Why CureSkin?", publisher: "CureSkin", sourceUrl: "https://cureskin.com/why-cureskin/",
    published: "Not stated", excerpt: "An expert dermatologist is then assigned to treat your skin and track your progress.",
  },
  {
    slug: "qure-ai", name: "Qure.ai", domain: "qure.ai", location: "India",
    opportunity: "AI radiologist for tier 2 and 3", category: "Clinical AI", stage: "Not assessed",
    status: "Screened", recommendation: "Further diligence", score: 76, owner: "Demo analyst", reviewed: retrieved,
    claim: "Qure.ai documents software that supports CT and X-ray viewing with AI-powered imaging products including qXR and qER.",
    sourceTitle: "Qure.ai App User’s Manual", publisher: "Qure.ai", sourceUrl: "https://documentation.qure.ai/",
    published: "Not stated", excerpt: "Qure.ai app is an on-cloud image viewing software that supports multi-modality imaging on mobile and desktop devices.",
  },
  {
    slug: "niramai", name: "NIRAMAI", domain: "niramai.com", location: "India",
    opportunity: "AI pathologist for cancer screening", category: "Cancer screening", stage: "Not assessed",
    status: "Screened", recommendation: "Further diligence", score: 78, owner: "Demo analyst", reviewed: retrieved,
    claim: "NIRAMAI describes Thermalytix as an AI-based breast-screening tool intended to assist healthcare providers.",
    sourceTitle: "Thermalytix for Health Care Providers", publisher: "NIRAMAI", sourceUrl: "https://niramai.com/thermalytix-for-health-care-providers/",
    published: "Not stated", excerpt: "Thermalytix® is Niramai’s patented, AI-based breast cancer screening solution designed to assist healthcare providers.",
  },
  {
    slug: "eka-care", name: "Eka Care", domain: "eka.care", location: "India",
    opportunity: "The doctor copilot for OPD", category: "Clinical workflow", stage: "Not assessed",
    status: "Needs review", recommendation: "Review", score: 67, owner: "Demo analyst", reviewed: retrieved,
    claim: "Eka Care says EkaScribe listens to consultations and generates structured clinical notes.",
    sourceTitle: "The EkaScribe Advantage", publisher: "Eka Care", sourceUrl: "https://www.eka.care/services/from-manual-notes-to-scribe-ai-documentation-the-ekascribe-advantage",
    published: "13 Jan 2026", excerpt: "The ability to listen to consultations. The ability to create structured clinical notes.",
  },
  {
    slug: "onsurity", name: "Onsurity", domain: "onsurity.com", location: "India",
    opportunity: "PBM and corporate health benefits", category: "Employee health", stage: "Not assessed",
    status: "Needs review", recommendation: "Review", score: 64, owner: "Demo analyst", reviewed: retrieved,
    claim: "Onsurity describes monthly employee healthcare products for SMEs, MSMEs, startups and growing businesses.",
    sourceTitle: "About Us", publisher: "Onsurity", sourceUrl: "https://www.onsurity.com/about-us/",
    published: "Not stated", excerpt: "Providing monthly, comprehensive employee healthcare to SMEs, MSMEs, Startups and growing businesses.",
  },
  {
    slug: "nephroplus", name: "NephroPlus", domain: "nephroplus.com", location: "India",
    opportunity: "The asset-light hospital chain", category: "Specialty care", stage: "Not assessed",
    status: "Screened", recommendation: "Further diligence", score: 74, owner: "Demo analyst", reviewed: retrieved,
    claim: "NephroPlus describes a network delivering dialysis treatment using standardised protocols.",
    sourceTitle: "About Us", publisher: "NephroPlus", sourceUrl: "https://nephroplus.com/about-us",
    published: "Not stated", excerpt: "To provide quality dialysis at affordable prices by using standardised protocols, continuous training and focused innovation.",
  },
  {
    slug: "dozee", name: "Dozee", domain: "dozee.app", location: "India",
    opportunity: "Wearables and remote patient monitoring", category: "Remote monitoring", stage: "Not assessed",
    status: "Screened", recommendation: "Further diligence", score: 75, owner: "Demo analyst", reviewed: retrieved,
    claim: "Dozee describes a contactless remote patient monitoring system using ballistocardiography and software.",
    sourceTitle: "Dozee Remote Patient Monitoring", publisher: "Dozee", sourceUrl: "https://www.dozee.app/",
    published: "Not stated", excerpt: "Contactless Sensing using Ballistocardiography, Artificial Intelligence based algorithms and Remote Patient Monitoring Softwares.",
  },
];

export const articleSource = {
  title: "What To Build: Healthtech",
  publisher: "Kae Capital",
  url: "https://kae-capital.com/blog/what-to-build-healthtech/",
  published: "01 Jul 2026",
  retrieved,
  excerpt: "A note on intent: this is a thought piece, not an investment thesis.",
};
