import type { Domain, Milestone, Tradition } from "@/lib/types";

export const traditions: Tradition[] = [
  [
    "utilitarian",
    "Utilitarian & consequentialist ethics",
    "Utilitarian",
    "#2868c7",
    "Includes substantial, documented use of consequentialist reasoning; branches and non-exclusive allegiances remain visible.",
  ],
  [
    "christian",
    "Christian ethical traditions",
    "Christian",
    "#ad5741",
    "Quaker, Catholic, Protestant and other Christian moral arguments are distinguished in affiliations.",
  ],
  [
    "kantian",
    "Kantian ethics",
    "Kantian",
    "#8252a4",
    "Kant and later writers working substantially with Kantian moral ideas.",
  ],
  [
    "buddhist",
    "Buddhist ethical traditions",
    "Buddhist",
    "#bb871b",
    "Distinct Buddhist lineages and their interpretations of compassion and liberation.",
  ],
  [
    "stoic",
    "Stoic & Neo-Stoic ethics",
    "Stoic",
    "#537564",
    "The historical window chiefly captures early modern revivals and later exponents.",
  ],
  [
    "hindu",
    "Hindu ethical traditions",
    "Hindu",
    "#c16825",
    "Distinct Hindu traditions; affiliation requires substantive ethical argument rather than nominal membership.",
  ],
  [
    "jain",
    "Jain ethics",
    "Jain",
    "#78923d",
    "Jain arguments concerning nonviolence and the moral status of living beings.",
  ],
  [
    "existential",
    "Existentialist ethics",
    "Existentialist",
    "#aa4c7d",
    "A younger tradition included explicitly in the comparison.",
  ],
  [
    "virtue",
    "Aristotelian & virtue ethics",
    "Virtue ethics",
    "#69719c",
    "Virtue, flourishing and capabilities approaches; modern developments are identified.",
  ],
  [
    "liberal",
    "Liberal & rights-based ethics",
    "Rights-based",
    "#258b8a",
    "Natural rights, liberalism and republican rights arguments; not a claim of uniform doctrine.",
  ],
  [
    "socialist",
    "Marxist & socialist ethics",
    "Socialist",
    "#b44c5b",
    "Marxist and socialist moral and political reasoning, including debates over the language of morality.",
  ],
  [
    "confucian",
    "Confucian ethical traditions",
    "Confucian",
    "#857343",
    "Classical continuity and later reinterpretations; local contexts are retained.",
  ],
  [
    "islamic",
    "Islamic ethical traditions",
    "Islamic",
    "#447c55",
    "Distinct Islamic reformist, theological and legal-ethical traditions.",
  ],
].map(([id, name, shortName, color, description]) => ({
  id,
  name,
  shortName,
  color,
  description,
}));

export const domains: Domain[] = [
  [
    "slavery",
    "Slavery and abolition",
    "Slavery",
    "Opposition to chattel enslavement. Voluntary contracts and penal labor require separate interpretation.",
  ],
  [
    "racial",
    "Racial legal equality",
    "Racial equality",
    "Equal legal protection and civic rights without racial exclusion.",
  ],
  [
    "colonial",
    "Colonial self-determination",
    "Self-determination",
    "Rights of colonized peoples to govern themselves.",
  ],
  [
    "women",
    "Women’s legal and social equality",
    "Women’s equality",
    "Legal independence and equal opportunities; not automatically interchangeable with suffrage.",
  ],
  [
    "suffrage",
    "Women’s suffrage",
    "Women’s suffrage",
    "Women’s entitlement to political representation and voting.",
  ],
  [
    "religion",
    "Religious toleration",
    "Religious liberty",
    "Civil freedom of conscience and religion. Restrictions and exceptions matter.",
  ],
  [
    "gay",
    "Same-sex decriminalization",
    "Same-sex decriminalization",
    "Removing criminal penalties for consensual adult same-sex relations.",
  ],
  [
    "marriage",
    "Same-sex marriage equality",
    "Marriage equality",
    "Equal legal access to marriage; distinct from decriminalization.",
  ],
  [
    "torture",
    "Torture and cruel punishment",
    "Torture",
    "Rejection of torture or deliberately cruel punishment.",
  ],
  [
    "execution",
    "Abolition of capital punishment",
    "Capital punishment",
    "Ending state executions; qualified retention remains separate.",
  ],
  [
    "children",
    "Protection of children",
    "Children’s protection",
    "Legal protection from exploitation and abuse.",
  ],
  [
    "animals",
    "Animal welfare",
    "Animal welfare",
    "Moral concern for animals and opposition to unnecessary cruelty; not necessarily animal rights or vegetarianism.",
  ],
  [
    "farmed",
    "Farmed-animal welfare",
    "Farmed animals",
    "Welfare of animals raised for human use; dietary claims need distinct qualification.",
  ],
  [
    "extinction",
    "Human extinction risk",
    "Extinction risk",
    "Explicit concern with the possible end of humanity, distinct from generic duties to future generations.",
  ],
  [
    "wild",
    "Wild-animal welfare",
    "Wild animals",
    "Concern for the welfare of individual wild animals, including naturally occurring suffering.",
  ],
  [
    "insects",
    "Insect welfare",
    "Insect welfare",
    "Explicit ethical consideration of insects; biological sentience claims are distinguished from nonviolence.",
  ],
  [
    "ai",
    "AI welfare",
    "AI welfare",
    "Possible welfare and moral status of artificial minds; concern can be conditional on sentience.",
  ],
].map(([id, name, shortName, description]) => ({
  id,
  name,
  shortName,
  description,
}));

export const milestones: Milestone[] = [
  {
    id: "abolition",
    domainId: "slavery",
    name: "Abolition in British colonies",
    shortName: "Slavery abolished",
    window: { start: 1833, end: 1838 },
    jurisdiction: "British colonies covered by the 1833 Act",
    measure: "law",
    kind: "historical",
    description:
      "1833 legislation followed by the end of apprenticeship in 1838. The Act had territorial exceptions; this is not a date for worldwide abolition.",
    sources: [
      {
        title: "UK Parliament: abolition of slavery",
        url: "https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/abolition/",
      },
    ],
    alternatives: [
      {
        id: "us1865",
        name: "United States: Thirteenth Amendment",
        window: { start: 1865, end: 1865 },
        jurisdiction: "United States",
        sourceUrl:
          "https://www.archives.gov/milestone-documents/13th-amendment",
      },
    ],
  },
  {
    id: "racial-equality",
    domainId: "racial",
    name: "US civil and voting rights protections",
    shortName: "Civil rights",
    window: { start: 1964, end: 1965 },
    jurisdiction: "United States",
    measure: "law",
    kind: "historical",
    description:
      "Civil Rights Act and Voting Rights Act. Formal legal milestones do not imply the disappearance of racism.",
    sources: [
      {
        title: "Civil Rights Act (1964)",
        url: "https://www.archives.gov/milestone-documents/civil-rights-act",
      },
      {
        title: "Voting Rights Act (1965)",
        url: "https://www.archives.gov/milestone-documents/voting-rights-act",
      },
    ],
  },
  {
    id: "self-determination",
    domainId: "colonial",
    name: "UN declaration on colonial independence",
    shortName: "Self-determination",
    window: { start: 1960, end: 1960 },
    jurisdiction: "United Nations; international normative benchmark",
    measure: "institutions",
    kind: "historical",
    description:
      "UN General Assembly Resolution 1514 is an institutional statement, not a claim that decolonization was completed in 1960.",
    sources: [
      {
        title: "UN Declaration, 14 December 1960",
        url: "https://digitallibrary.un.org/record/247990/files/A%28092%29_IN4-EN.pdf",
      },
    ],
  },
  {
    id: "women-equality",
    domainId: "women",
    name: "Legal prohibition of sex discrimination",
    shortName: "Women’s equality",
    window: { start: 1964, end: 1975 },
    jurisdiction: "United States (employment, 1964); Great Britain (1975 Act)",
    measure: "law",
    kind: "historical",
    description:
      "A selected legal transition for equality of opportunity, not a claim that all forms of women’s subordination ended.",
    sources: [
      {
        title: "Civil Rights Act, Title VII",
        url: "https://www.archives.gov/milestone-documents/civil-rights-act",
      },
      {
        title: "Sex Discrimination Act 1975",
        url: "https://www.legislation.gov.uk/ukpga/1975/65/enacted",
      },
    ],
  },
  {
    id: "votes-for-women",
    domainId: "suffrage",
    name: "Women’s parliamentary enfranchisement",
    shortName: "Women’s suffrage",
    window: { start: 1918, end: 1928 },
    jurisdiction: "United Kingdom",
    measure: "law",
    kind: "historical",
    description:
      "Partial enfranchisement in 1918; equal voting age in 1928. Other jurisdictions followed different paths.",
    sources: [
      {
        title: "UK Parliament: women get the vote",
        url: "https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote/",
      },
    ],
    alternatives: [
      {
        id: "us1920",
        name: "United States: Nineteenth Amendment",
        window: { start: 1920, end: 1920 },
        jurisdiction: "United States; racial barriers persisted",
        sourceUrl:
          "https://www.archives.gov/milestone-documents/19th-amendment",
      },
    ],
  },
  {
    id: "religious-freedom",
    domainId: "religion",
    name: "Virginia Statute for Religious Freedom",
    shortName: "Religious liberty",
    window: { start: 1786, end: 1786 },
    jurisdiction: "Virginia, United States",
    measure: "law",
    kind: "historical",
    description:
      "A named freedom-of-conscience benchmark. Not a date of universal Western religious equality.",
    sources: [
      {
        title: "Virginia Statute for Religious Freedom",
        url: "https://www.monticello.org/research-education/thomas-jefferson-encyclopedia/virginia-statute-religious-freedom/",
      },
    ],
    alternatives: [
      {
        id: "us1791",
        name: "United States: First Amendment",
        window: { start: 1791, end: 1791 },
        jurisdiction: "United States federal government",
        sourceUrl:
          "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
      },
    ],
  },
  {
    id: "decriminalization",
    domainId: "gay",
    name: "Partial decriminalization of male same-sex relations",
    shortName: "Same-sex decriminalization",
    window: { start: 1967, end: 1967 },
    jurisdiction: "England and Wales",
    measure: "law",
    kind: "historical",
    description:
      "The 1967 Act applied only in private and to men aged 21 or over, with further exclusions. It did not establish full equality.",
    sources: [
      {
        title: "Sexual Offences Act 1967",
        url: "https://www.legislation.gov.uk/ukpga/1967/60/enacted",
      },
    ],
    alternatives: [
      {
        id: "us2003",
        name: "United States: Lawrence v. Texas",
        window: { start: 2003, end: 2003 },
        jurisdiction: "United States",
        sourceUrl: "https://www.supremecourt.gov/opinions/02pdf/02-102.pdf",
      },
    ],
  },
  {
    id: "marriage-equality",
    domainId: "marriage",
    name: "Civil marriage equality in selected jurisdictions",
    shortName: "Marriage equality",
    window: { start: 2001, end: 2015 },
    jurisdiction: "Netherlands (2001) to United States (2015)",
    measure: "law",
    kind: "historical",
    description:
      "Two named milestones delimit this reference window, not every Western country’s adoption.",
    sources: [
      {
        title: "Obergefell v. Hodges (2015)",
        url: "https://www.law.cornell.edu/supremecourt/text/14-556",
      },
      {
        title: "Dutch government: same-sex marriage",
        url: "https://www.government.nl/topics/marriage-cohabitation-agreement-civil-partnership/marriage-civil-partnership-and-cohabitation-agreements/same-sex-marriage",
      },
    ],
  },
  {
    id: "torture-ban",
    domainId: "torture",
    name: "International prohibition of torture",
    shortName: "Torture prohibited",
    window: { start: 1948, end: 1984 },
    jurisdiction: "UN human-rights framework",
    measure: "institutions",
    kind: "historical",
    description:
      "UDHR Article 5 through the Convention Against Torture. This measures international codification, not the first abolition or actual elimination of torture.",
    sources: [
      {
        title: "Universal Declaration of Human Rights",
        url: "https://www.un.org/en/about-us/universal-declaration-of-human-rights",
      },
      {
        title: "Convention against Torture (1984)",
        url: "https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-against-torture-and-other-cruel-inhuman-or-degrading",
      },
    ],
  },
  {
    id: "execution-abolition",
    domainId: "execution",
    name: "Abolition of the death penalty in Britain",
    shortName: "Capital punishment",
    window: { start: 1965, end: 1998 },
    jurisdiction: "Great Britain / United Kingdom; offense-specific dates",
    measure: "law",
    kind: "historical",
    description:
      "Murder abolition in Great Britain in 1965; remaining offenses abolished in the UK in 1998. This is not a Western consensus date.",
    sources: [
      {
        title: "House of Lords Library: abolition timeline",
        url: "https://lordslibrary.parliament.uk/research-briefings/lif-2015-0044/",
      },
    ],
    alternatives: [
      {
        id: "france1981",
        name: "France: abolition in 1981",
        window: { start: 1981, end: 1981 },
        jurisdiction: "France",
        sourceUrl:
          "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000880486",
      },
    ],
  },
  {
    id: "child-protection",
    domainId: "children",
    name: "Early factory protections for children",
    shortName: "Child protection",
    window: { start: 1833, end: 1847 },
    jurisdiction: "United Kingdom; covered textile factories",
    measure: "law",
    kind: "historical",
    description:
      "Factory legislation limiting children’s employment and hours. Narrower than universal children’s rights.",
    sources: [
      {
        title: "UK Parliament: factories and children",
        url: "https://www.parliament.uk/about/living-heritage/transformingsociety/livinglearning/19thcentury/overview/factoryact/",
      },
    ],
  },
  {
    id: "animal-protection",
    domainId: "animals",
    name: "Statutory animal protection",
    shortName: "Animal protection",
    window: { start: 1822, end: 1911 },
    jurisdiction: "United Kingdom; progressively broader covered animals",
    measure: "law",
    kind: "historical",
    description:
      "From Martin’s Act protecting cattle to the Protection of Animals Act. These laws do not prohibit all animal use or establish equal rights.",
    sources: [
      {
        title: "Protection of Animals Act 1911",
        url: "https://www.legislation.gov.uk/ukpga/Geo5/1-2/27/enacted",
      },
      {
        title: "UK Parliament: protecting animals",
        url: "https://publications.parliament.uk/pa/ld200102/ldselect/ldanimal/150/15004.htm",
      },
    ],
  },
  {
    id: "farm-welfare",
    domainId: "farmed",
    name: "Farmed-animal welfare legislation",
    shortName: "Farmed animals",
    window: { start: 1968, end: 1968 },
    jurisdiction: "United Kingdom",
    measure: "law",
    kind: "historical",
    description:
      "Agriculture (Miscellaneous Provisions) Act, Part I: welfare of livestock. Vegetarianism and complete abolition of farming are stronger, unmatched claims.",
    sources: [
      {
        title: "Agriculture (Miscellaneous Provisions) Act 1968",
        url: "https://www.legislation.gov.uk/ukpga/1968/34/pdfs/ukpga_19680034_en.pdf",
      },
    ],
  },
  {
    id: "extinction-concern",
    domainId: "extinction",
    name: "Wider concern about human extinction risk",
    shortName: "Extinction risk",
    window: { start: 2000, end: 2030 },
    jurisdiction: "Western reference scenario stipulated for this project",
    measure: "interpretation",
    kind: "stipulated",
    description:
      "User-specified period of wider concern, not the first expression of the idea. The window is interpretive and its future portion is assumed. All scores are provisional.",
    sources: [],
  },
  {
    id: "wild-welfare",
    domainId: "wild",
    name: "Wider concern for wild-animal welfare",
    shortName: "Wild-animal welfare",
    window: { start: 2024, end: 2050 },
    jurisdiction: "Western reference scenario stipulated for this project",
    measure: "scenario",
    kind: "stipulated",
    description:
      "User-specified 2024–2050 transition; does not assert completed adoption or that concern began in 2024.",
    sources: [],
  },
  {
    id: "insect-welfare",
    domainId: "insects",
    name: "Wider concern for insect welfare",
    shortName: "Insect welfare",
    window: { start: 2020, end: 2050 },
    jurisdiction: "Western reference scenario stipulated for this project",
    measure: "scenario",
    kind: "stipulated",
    description:
      "User-specified 2020–2050 transition; distinct from general animal welfare and wild-animal welfare.",
    sources: [],
  },
  {
    id: "ai-welfare",
    domainId: "ai",
    name: "Possible adoption of AI welfare",
    shortName: "AI welfare",
    window: { start: 2100, end: 2100 },
    jurisdiction: "Illustrative future scenario",
    measure: "scenario",
    kind: "projected",
    description:
      "Editable illustrative date. Neither AI sentience nor future social acceptance is presented as established.",
    sources: [],
  },
];
