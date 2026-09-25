import type { Domain, Milestone, Tradition } from "@/lib/types";

export const traditions: Tradition[] = [
  [
    "secular-humanist",
    "Secular humanist ethics",
    "Secular humanist",
    "#647587",
    "Documented humanist ethics grounded in reason, compassion and human welfare without religious authority.",
  ],
  [
    "utilitarian",
    "Utilitarian & consequentialist ethics",
    "Utilitarian / consequentialist",
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
    "Imperial Roman Stoicism alongside early modern revivals and later exponents.",
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
    "Existentialist ethics, including foundational nineteenth-century precursors Kierkegaard and Nietzsche. Retrospective classification is not a claim of self-identification. Disputed affiliations remain available through Include contested.",
  ],
  [
    "virtue",
    "Aristotelian & virtue ethics",
    "Aristotelian / virtue",
    "#69719c",
    "Aristotelian flourishing and virtue-centered ethics. Intellectual influence alone does not establish membership; capabilities theories are listed separately.",
  ],
  [
    "capabilities",
    "Capabilities approach",
    "Capabilities",
    "#927345",
    "Justice grounded in substantive opportunities to function and flourish; distinct from virtue ethics despite its Aristotelian influences.",
  ],
  [
    "liberal",
    "Rights & social-contract ethics",
    "Rights / contract",
    "#258b8a",
    "Natural-rights, rights-grounded and social-contract arguments, including republican branches. Supporting liberal policies or defending rights on utilitarian grounds does not by itself qualify.",
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
    "Homosexuality decriminalization",
    "Homosexuality decriminalization",
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
    "Humanity starts to take extinction risks seriously",
    "Explicit concern with the possible end of humanity, distinct from generic duties to future generations.",
  ],
  [
    "wild",
    "Wild-animal welfare",
    "Wild animals",
    "Concern for individual wild animals, including insects and naturally occurring suffering. Claims about insect sentience remain qualified.",
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
    name: "Abolition of slavery in selected countries and colonies",
    shortName: "Abolition of slavery",
    window: { start: 1833, end: 1888 },
    jurisdiction:
      "British colonies (1833–1838), French colonies (1848), US (1865), Brazil (1888)",
    measure: "law",
    kind: "historical",
    description:
      "From Britain’s 1833 Slavery Abolition Act to Brazil’s 1888 Lei Áurea, with the end of British colonial apprenticeship in 1838, French colonial abolition in 1848, and US abolition in 1865. These selected reforms define the comparison interval, not the end of slavery worldwide.",
    sources: [
      {
        title: "UK Parliament: abolition of slavery",
        url: "https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/abolition/",
      },
    ],
    reforms: [
      {
        year: 1833,
        jurisdiction: "British colonies",
        chartLabel: "British colonies: abolition law",
        change:
          "Slavery Abolition Act passed; territorial exceptions and compulsory apprenticeship remained.",
        sourceUrl:
          "https://www.parliament.uk/about/living-heritage/transformingsociety/tradeindustry/slavetrade/overview/abolition/",
      },
      {
        year: 1838,
        jurisdiction: "British colonies",
        chartLabel: "British colonies: apprenticeship ended",
        change: "Compulsory apprenticeship ended in the covered colonies.",
        sourceUrl:
          "https://www.parliament.uk/about/living-heritage/evolutionofparliament/legislativescrutiny/parliament-and-empire/parliament-and-the-american-colonies-before-1765/the-west-indian-colonies-and-emancipation/",
      },
      {
        year: 1848,
        jurisdiction: "French colonies",
        chartLabel: "French colonies: slavery abolished",
        change: "Decree abolished slavery in French colonies and possessions.",
        sourceUrl:
          "https://www.culture.gouv.fr/actualites/Archives-pleins-feux-sur-le-decret-de-1848-portant-abolition-de-l-esclavage",
      },
      {
        year: 1865,
        jurisdiction: "US",
        chartLabel: "US: slavery abolished",
        change:
          "Thirteenth Amendment abolished slavery, retaining an exception for punishment after criminal conviction.",
        sourceUrl:
          "https://www.archives.gov/milestone-documents/13th-amendment",
      },
      {
        year: 1888,
        jurisdiction: "Brazil",
        chartLabel: "Brazil: slavery abolished",
        change: "Lei Áurea abolished slavery nationwide.",
        sourceUrl:
          "https://www.gov.br/arquivonacional/pt-br/canais_atendimento/imprensa/noticias/lei-aurea-faz-parte-do-acervo-do-arquivo-nacional",
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
    name: "Racial equality under the law in selected countries",
    shortName: "Racial equality under the law",
    window: { start: 1949, end: 1996 },
    jurisdiction:
      "United States, India, Great Britain, France, Australia, Brazil, and South Africa",
    measure: "law",
    kind: "historical",
    description:
      "Selected modern statutory and constitutional protections from India’s Constitution, adopted in 1949, to South Africa’s final Constitution, signed in 1996. The US entries are the Civil Rights Act of 1964 and Voting Rights Act of 1965; Reconstruction-era guarantees are excluded because they did not establish the desegregation and enforceable civil-rights protections represented by this benchmark. Dates mark enactment, constitutional adoption or ratification, rather than commencement where those differ: India’s Constitution was adopted in 1949 and took effect in 1950; South Africa’s final Constitution took effect in 1997. These countries are illustrative, not a comprehensive or ranked set. The protections differ in scope; exclusions, weak enforcement, segregation and reversals persisted. The endpoints do not mark the first protection anywhere or the achievement of worldwide racial equality. The former US-only 1964–1965 benchmark remains available as an alternative.",
    sources: [
      {
        title: "India: Constitution adopted November 26, 1949",
        url: "https://sansad.in/ls/about/introduction",
      },
      {
        title:
          "India: constitutional Articles 14–16, equality and non-discrimination",
        url: "https://ncbc.nic.in/User_Panel/UserView.aspx?TypeID=1114",
      },
      {
        title: "Civil Rights Act (1964)",
        url: "https://www.archives.gov/milestone-documents/civil-rights-act",
      },
      {
        title: "Voting Rights Act (1965)",
        url: "https://www.archives.gov/milestone-documents/voting-rights-act",
      },
      {
        title: "UK Parliament: Race Relations Acts of 1965 and 1968",
        url: "https://commonslibrary.parliament.uk/research-briefings/cbp-8360/",
      },
      {
        title: "France: Law 72-546 of July 1, 1972 against racism",
        url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000864827",
      },
      {
        title: "Australia: Racial Discrimination Act 1975",
        url: "https://humanrights.gov.au/know-your-rights/rights-of-individuals/race-discrimination/racial-discrimination-the-law",
      },
      {
        title: "Brazil: Constitution of October 5, 1988, Articles 3 and 5",
        url: "https://legis.senado.leg.br/norma/579494/publicacao/33296461",
      },
      {
        title: "South Africa: 1996 Constitution, section 9 (Equality)",
        url: "https://www.gov.za/documents/constitution/chapter-2-bill-rights",
      },
      {
        title: "South Africa: final Constitution signed December 10, 1996",
        url: "https://www.gov.za/documents/constitution-republic-south-africa-1996-explanatory-memorandum",
      },
    ],
    reforms: [
      {
        year: 1949,
        jurisdiction: "India",
        chartLabel: "India: Constitution adopted",
        change:
          "The Constitution adopted on November 26 included equality before the law and protections against discrimination on grounds including race and caste in Articles 14–16. These provisions took effect on January 26, 1950.",
        sourceUrl: "https://ncbc.nic.in/User_Panel/UserView.aspx?TypeID=1114",
      },
      {
        year: 1964,
        jurisdiction: "United States",
        chartLabel: "US: Civil Rights Act",
        change:
          "The Civil Rights Act prohibited racial discrimination in covered public accommodations, federally assisted programs and employment, strengthening protections after decades of segregation.",
        sourceUrl:
          "https://www.archives.gov/milestone-documents/civil-rights-act",
      },
      {
        year: 1965,
        jurisdiction: "United States",
        chartLabel: "US: Voting Rights Act",
        change:
          "The Voting Rights Act established federal protections and enforcement against racial discrimination in voting.",
        sourceUrl:
          "https://www.archives.gov/milestone-documents/voting-rights-act",
      },
      {
        year: 1965,
        jurisdiction: "Great Britain",
        chartLabel: "Britain: Race Relations Act",
        change:
          "The Race Relations Act prohibited racial discrimination in specified public places and established the Race Relations Board. It did not yet provide general employment or housing protection.",
        sourceUrl:
          "https://commonslibrary.parliament.uk/research-briefings/cbp-8360/",
      },
      {
        year: 1968,
        jurisdiction: "Great Britain",
        chartLabel: "Britain: employment and housing",
        change:
          "The Race Relations Act extended racial-discrimination protections to employment, housing and other areas. Later legislation strengthened enforcement and addressed indirect discrimination.",
        sourceUrl:
          "https://commonslibrary.parliament.uk/research-briefings/cbp-8360/",
      },
      {
        year: 1972,
        jurisdiction: "France",
        chartLabel: "France: anti-racism law",
        change:
          "Law 72-546 of July 1 strengthened legal protection against racial discrimination, including discriminatory refusal of goods, services or employment, and incitement to racial hatred.",
        sourceUrl:
          "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000000864827",
      },
      {
        year: 1975,
        jurisdiction: "Australia",
        chartLabel: "Australia: Racial Discrimination Act",
        change:
          "The federal Racial Discrimination Act prohibited discrimination based on race, colour, descent and national or ethnic origin in covered areas of public life.",
        sourceUrl:
          "https://humanrights.gov.au/know-your-rights/rights-of-individuals/race-discrimination/racial-discrimination-the-law",
      },
      {
        year: 1988,
        jurisdiction: "Brazil",
        chartLabel: "Brazil: constitutional guarantees",
        change:
          "The Constitution promulgated on October 5 guaranteed equality before the law, set an objective of eliminating prejudice including race and colour, and made racism a non-bailable offence without a limitation period, subject to implementing law.",
        sourceUrl:
          "https://legis.senado.leg.br/norma/579494/publicacao/33296461",
      },
      {
        year: 1996,
        jurisdiction: "South Africa",
        chartLabel: "South Africa: final Constitution",
        change:
          "The final Constitution signed on December 10 entrenched equal protection and prohibited unfair racial discrimination in section 9, building on the interim Constitution. It took effect on February 4, 1997.",
        sourceUrl:
          "https://www.gov.za/documents/constitution/chapter-2-bill-rights",
      },
    ],
    alternatives: [
      {
        id: "us1964-1965",
        name: "United States: Civil Rights Act and Voting Rights Act",
        window: { start: 1964, end: 1965 },
        jurisdiction: "United States",
        sourceUrl:
          "https://www.archives.gov/milestone-documents/voting-rights-act",
      },
    ],
  },
  {
    id: "self-determination",
    domainId: "colonial",
    name: "Recognition of colonial self-determination",
    shortName: "Colonial self-determination",
    window: { start: 1945, end: 1960 },
    jurisdiction: "United Nations; international normative benchmark",
    measure: "institutions",
    kind: "historical",
    description:
      "From the UN Charter’s recognition of self-determination in 1945 to the declaration on colonial independence (Resolution 1514) in 1960. This interval tracks international recognition of the principle, not the completion of decolonization.",
    sources: [
      {
        title: "United Nations: decolonization and the 1945 Charter",
        url: "https://www.un.org/en/global-issues/decolonization",
      },
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
    shortName: "Women’s legal equality",
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
    name: "Women’s suffrage in selected major countries",
    shortName: "Women’s suffrage",
    window: { start: 1918, end: 1950 },
    jurisdiction: "UK, Germany, US, Brazil, France, Japan, China, and India",
    measure: "law",
    kind: "historical",
    description:
      "Selected national reforms from 1918 in the UK and Germany to India’s 1950 universal adult suffrage. Dates mark legal changes rather than the first election or the end of all exclusions. The UK’s 1918 reform was partial; racial, literacy, citizenship, and other barriers persisted in several countries. Formal suffrage does not by itself establish competitive democratic elections.",
    sources: [
      {
        title: "UK Parliament: women get the vote",
        url: "https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote/",
      },
    ],
    reforms: [
      {
        year: 1918,
        jurisdiction: "UK",
        chartLabel: "UK: partial suffrage, age 30+",
        change:
          "Women aged 30 or over meeting specified qualifications gained the parliamentary vote.",
        sourceUrl:
          "https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote/",
      },
      {
        year: 1918,
        jurisdiction: "Germany",
        chartLabel: "Germany: equal voting rights",
        change:
          "Women gained equal voting rights under the November 1918 reforms; they first voted nationally in January 1919.",
        sourceUrl:
          "https://www.bundestag.de/besuche/ausstellungen/pol_parl/frauenwahlrecht",
      },
      {
        year: 1920,
        jurisdiction: "US",
        chartLabel: "US: Nineteenth Amendment",
        change:
          "The Nineteenth Amendment prohibited denying voting rights on the basis of sex; racial and other barriers remained.",
        sourceUrl:
          "https://www.archives.gov/milestone-documents/19th-amendment",
      },
      {
        year: 1928,
        jurisdiction: "UK",
        chartLabel: "UK: equal voting age, 21+",
        change:
          "The Equal Franchise Act gave women the same voting qualifications as men.",
        sourceUrl:
          "https://www.parliament.uk/about/living-heritage/transformingsociety/electionsvoting/womenvote/overview/thevote/",
      },
      {
        year: 1932,
        jurisdiction: "Brazil",
        chartLabel: "Brazil: Electoral Code enfranchisement",
        change:
          "The 1932 Electoral Code recognized women’s voting rights; literacy and other exclusions limited the electorate.",
        sourceUrl:
          "https://www.tse.jus.br/servicos-eleitorais/glossario/termos/voto-da-mulher",
      },
      {
        year: 1944,
        jurisdiction: "France",
        chartLabel: "France: equal voting rights",
        change:
          "The ordinance of 21 April 1944 recognized women as voters and candidates on the same terms as men; first voting followed in 1945.",
        sourceUrl:
          "https://www.assemblee-nationale.fr/dyn/histoire-et-patrimoine/deuxieme-guerre-mondiale/l-accession-des-femmes-au-droit-de-vote",
      },
      {
        year: 1945,
        jurisdiction: "Japan",
        chartLabel: "Japan: election-law reform",
        change:
          "The December 1945 election-law reform granted voting rights to women aged 20 or over; the first election followed in 1946.",
        sourceUrl: "https://www.ndl.go.jp/modern/e/cha5/description05.html",
      },
      {
        year: 1949,
        jurisdiction: "China",
        chartLabel: "China: formal women’s suffrage",
        change:
          "The IPU dates women’s suffrage in China to 1949. This marks formal rights, not a finding of competitive democratic elections.",
        sourceUrl: "https://archive.ipu.org/wmn-e/suffrage.htm",
      },
      {
        year: 1950,
        jurisdiction: "India",
        chartLabel: "India: universal adult suffrage",
        change:
          "The Constitution established universal adult suffrage, including women regardless of caste, race, or income; the first general election followed in 1951–1952.",
        sourceUrl:
          "https://sansad.in/getFile/lsscommittee/Empowerment%20of%20Women/16_Empowerment_of_Women_2.pdf?source=loksabhadocs",
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
    name: "Religious liberty in selected Western countries",
    shortName: "Religious liberty",
    window: { start: 1689, end: 1919 },
    jurisdiction:
      "England (1689), Virginia / US (1786–1791), France (1905), Germany (1919)",
    measure: "law",
    kind: "historical",
    description:
      "Selected steps from England’s limited toleration of Protestant dissenters in 1689 to the Weimar Constitution’s guarantee of freedom of faith and conscience in 1919. The interval includes Virginia’s 1786 statute, the US First Amendment in 1791, and France’s 1905 protection of conscience and worship. These reforms had different scopes, exclusions, and later reversals; they do not establish a date of universal or permanent religious equality.",
    sources: [
      {
        title: "UK Parliament: the Toleration Act of 1689",
        url: "https://www.parliament.uk/about/living-heritage/transformingsociety/private-lives/religion/overview/catholicsnonconformists-/",
      },
      {
        title: "Virginia Statute for Religious Freedom",
        url: "https://www.monticello.org/research-education/thomas-jefferson-encyclopedia/virginia-statute-religious-freedom/",
      },
      {
        title: "US Bill of Rights: First Amendment",
        url: "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
      },
      {
        title: "France: Law of 9 December 1905, Article 1",
        url: "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000508749/1905-12-11",
      },
      {
        title: "Bundestag: Weimar Constitution, Article 135 (1919)",
        url: "https://www.bundestag.de/parlament/grundgesetz/1919-religionsfreiheit-641282",
      },
    ],
    reforms: [
      {
        year: 1689,
        jurisdiction: "England",
        chartLabel: "England: limited Protestant toleration",
        change:
          "The Toleration Act permitted public worship for most Protestant dissenters under conditions. Catholics and some other groups remained excluded, and civil restrictions persisted.",
        sourceUrl:
          "https://www.parliament.uk/about/living-heritage/transformingsociety/private-lives/religion/overview/catholicsnonconformists-/",
      },
      {
        year: 1786,
        jurisdiction: "Virginia, US",
        chartLabel: "Virginia: freedom of religious belief",
        change:
          "The Virginia Statute protected religious belief and rejected compulsory support for religious worship.",
        sourceUrl:
          "https://www.monticello.org/research-education/thomas-jefferson-encyclopedia/virginia-statute-religious-freedom/",
      },
      {
        year: 1791,
        jurisdiction: "US federal government",
        chartLabel: "US: First Amendment",
        change:
          "The First Amendment prohibited federal establishment of religion and protected free exercise. Its original scope did not immediately remove state-level establishments or restrictions.",
        sourceUrl:
          "https://www.archives.gov/founding-docs/bill-of-rights-transcript",
      },
      {
        year: 1905,
        jurisdiction: "France",
        chartLabel: "France: conscience and worship protected",
        change:
          "Article 1 guaranteed freedom of conscience and religious worship subject to public-order restrictions. Territorial exceptions mean this was not uniform across all French jurisdictions.",
        sourceUrl:
          "https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000508749/1905-12-11",
      },
      {
        year: 1919,
        jurisdiction: "Germany",
        chartLabel: "Germany: faith and conscience protected",
        change:
          "Article 135 of the Weimar Constitution guaranteed freedom of faith and conscience to residents. The constitutional guarantee was not an assurance against later persecution.",
        sourceUrl:
          "https://www.bundestag.de/parlament/grundgesetz/1919-religionsfreiheit-641282",
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
    name: "Decriminalization of same-sex relations in selected jurisdictions",
    shortName: "Homosexuality decriminalization",
    window: { start: 1967, end: 2003 },
    jurisdiction: "England and Wales (1967) to United States (2003)",
    measure: "law",
    kind: "historical",
    description:
      "From partial decriminalization in England and Wales in 1967 to Lawrence v. Texas in the United States in 2003. The 1967 Act covered only private acts between men aged 21 or over, with further exclusions. These selected endpoints do not mark worldwide decriminalization or full equality.",
    sources: [
      {
        title: "Lawrence v. Texas (2003)",
        url: "https://www.supremecourt.gov/opinions/02pdf/02-102.pdf",
      },
      {
        title: "Sexual Offences Act 1967",
        url: "https://www.legislation.gov.uk/ukpga/1967/60/enacted",
      },
    ],
    reforms: [
      {
        year: 1967,
        jurisdiction: "UK / England & Wales",
        chartLabel: "England & Wales: partial decriminalization",
        change:
          "Partial decriminalization of private consensual sex between men aged 21 or over; exclusions remained.",
        sourceUrl: "https://www.legislation.gov.uk/ukpga/1967/60/enacted",
      },
      {
        year: 1969,
        jurisdiction: "Canada",
        chartLabel: "Canada: partial decriminalization",
        change:
          "Partial decriminalization of private consensual sexual acts between two adults aged 21 or over.",
        sourceUrl:
          "https://www.canada.ca/en/canadian-heritage/services/rights-lgbti-persons.html",
      },
      {
        year: 1994,
        jurisdiction: "Germany",
        chartLabel: "Germany: Paragraph 175 repealed",
        change:
          "Paragraph 175 repealed, removing the remaining special criminal restrictions on male same-sex activity.",
        sourceUrl:
          "https://www.bpb.de/kurz-knapp/hintergrund-aktuell/180263/1994-homosexualitaet-nicht-mehr-strafbar/",
      },
      {
        year: 1997,
        jurisdiction: "Australia / Tasmania",
        chartLabel: "Australia: last state decriminalized",
        change:
          "Tasmania became the last Australian state to decriminalize consensual same-sex activity.",
        sourceUrl: "https://www.ehos.tas.gov.au/",
      },
      {
        year: 2003,
        jurisdiction: "US",
        chartLabel: "US: same-sex criminal bans struck down",
        change:
          "Lawrence v. Texas invalidated laws criminalizing private consensual adult same-sex intimacy.",
        sourceUrl:
          "https://www.govinfo.gov/app/details/USREPORTS-539/USREPORTS-539-558",
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
    shortName: "Prohibition of torture",
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
    name: "Death penalty abolition for all crimes in selected Western countries",
    shortName: "Ending capital punishment",
    window: { start: 1949, end: 1998 },
    jurisdiction:
      "West Germany, France, United Kingdom, and Canada; abolition for all crimes",
    measure: "law",
    kind: "historical",
    description:
      "Abolition for all crimes under national law: West Germany in 1949, France in 1981, and the United Kingdom and Canada in 1998. Portugal is excluded from this selected set. Earlier reforms limited to murder, civilian or ordinary crimes do not qualify; the UK’s 1965 and Canada’s 1976 partial reforms are therefore excluded. West Germany’s 1949 date refers to the Federal Republic, not East Germany or occupation-authority jurisdiction. This is a selected-country window, not a claim of universal abolition.",
    sources: [
      {
        title: "House of Lords Library: abolition timeline",
        url: "https://lordslibrary.parliament.uk/research-briefings/lif-2015-0044/",
      },
      {
        title: "West Germany: Basic Law, Article 102 (1949)",
        url: "https://www.gesetze-im-internet.de/englisch_gg/englisch_gg.html",
      },
      {
        title: "France: law of October 9, 1981 abolishing the death penalty",
        url: "https://www.senat.fr/dossier-legislatif/a80810310.html",
      },
      {
        title: "Canada: complete abolition including military offences (1998)",
        url: "https://www.canada.ca/en/global-affairs/news/2017/10/statement_by_ministerofforeignaffairsonworlddayagainstthedeathpe.html",
      },
    ],
    reforms: [
      {
        year: 1949,
        jurisdiction: "West Germany",
        chartLabel: "West Germany: all crimes",
        change:
          "Article 102 of the Basic Law abolished the death penalty for all crimes under the law of the Federal Republic. This is West Germany’s date, not East Germany’s, and does not cover occupation-authority jurisdiction.",
        sourceUrl:
          "https://www.bundestag.de/dokumente/textarchiv/1952-10-02-todesstrafe-209552",
      },
      {
        year: 1981,
        jurisdiction: "France",
        chartLabel: "France: all crimes",
        change: "The law of 9 October 1981 abolished the death penalty.",
        sourceUrl: "https://www.senat.fr/dossier-legislatif/a80810310.html",
      },
      {
        year: 1998,
        jurisdiction: "UK",
        chartLabel: "UK: all crimes",
        change:
          "Abolition of the remaining civilian and military capital offences completed abolition for all crimes in the United Kingdom.",
        sourceUrl:
          "https://lordslibrary.parliament.uk/research-briefings/lif-2015-0044/",
      },
      {
        year: 1998,
        jurisdiction: "Canada",
        chartLabel: "Canada: all crimes",
        change:
          "The death penalty was removed from the National Defence Act, completing abolition.",
        sourceUrl:
          "https://www.canada.ca/en/global-affairs/news/2017/10/statement_by_ministerofforeignaffairsonworlddayagainstthedeathpe.html",
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
    name: "Legal reforms toward ending child labor",
    shortName: "Ending child labor",
    window: { start: 1833, end: 1938 },
    jurisdiction: "Selected reforms in the UK, France, and United States",
    measure: "law",
    kind: "historical",
    description:
      "Selected legal restrictions on child labor, from early factory laws to broader minimum-age protections. These dates mark legislation, not the elimination of child labor. Coverage, exceptions, and enforcement differ by country.",
    sources: [
      {
        title: "UK Parliament: the 1833 Factory Act",
        url: "https://www.parliament.uk/about/living-heritage/transformingsociety/livinglearning/19thcentury/overview/factoryact/",
      },
      {
        title: "French Ministry of Labour: law of 22 March 1841",
        url: "https://travail-emploi.gouv.fr/IMG/pdf/loi_22_mars_1841-2.pdf",
      },
      {
        title: "US Department of Labor: child labor rules under the FLSA",
        url: "https://webapps.dol.gov/elaws/whd/flsa/cl/background.htm",
      },
    ],
    reforms: [
      {
        year: 1833,
        jurisdiction: "United Kingdom",
        chartLabel: "UK: textile-factory restrictions",
        change:
          "The Factory Act barred children under nine from most covered textile factories, limited older children's hours, and introduced factory inspectors; it was not a universal employment ban.",
        sourceUrl:
          "https://www.parliament.uk/about/living-heritage/transformingsociety/livinglearning/19thcentury/overview/factoryact/",
      },
      {
        year: 1841,
        jurisdiction: "France",
        chartLabel: "France: factory age and hour limits",
        change:
          "The 1841 law set a minimum age of eight and limited working hours in covered industrial establishments; its scope and enforcement were limited.",
        sourceUrl:
          "https://travail-emploi.gouv.fr/IMG/pdf/loi_22_mars_1841-2.pdf",
      },
      {
        year: 1938,
        jurisdiction: "United States",
        chartLabel: "US: federal child-labor restrictions",
        change:
          "The Fair Labor Standards Act established federal child-labor protections for covered work. Agricultural and other exemptions meant it did not prohibit every form of children's employment.",
        sourceUrl: "https://webapps.dol.gov/elaws/whd/flsa/cl/background.htm",
      },
    ],
  },
  {
    id: "animal-protection",
    domainId: "animals",
    name: "Statutory animal protection",
    shortName: "Animal legal protection",
    window: { start: 1911, end: 1966 },
    jurisdiction:
      "England, Wales and Ireland (1911; Scotland excluded); United States federal law (1966)",
    measure: "law",
    kind: "historical",
    description:
      "The Protection of Animals Act was enacted in 1911 and commenced on 1 January 1912. Section 16 excludes Scotland. This benchmark uses enactment, not commencement. It consolidated earlier protections, including livestock protections dating to 1822; it is not the first recognition of animal welfare. It does not prohibit all animal use or establish equal rights. The US Laboratory Animal Welfare Act of 1966 added federal protections for specified animals supplied to or held by research facilities, initially covering dogs, cats, nonhuman primates, guinea pigs, hamsters, and rabbits. This is a selected federal milestone, not the first US animal-protection law or universal protection for animals. The alternative benchmark tests sensitivity to the earlier, narrower British 1822 reform.",
    sources: [
      {
        title: "Protection of Animals Act 1911",
        url: "https://www.legislation.gov.uk/ukpga/Geo5/1-2/27/enacted",
      },
      {
        title: "UK Parliament: protecting animals",
        url: "https://publications.parliament.uk/pa/ld200102/ldselect/ldanimal/150/15004.htm",
      },
      {
        title: "USDA: Animal Welfare Act timeline (1966 enactment)",
        url: "https://www.nal.usda.gov/collections/exhibits/awahistory/list",
      },
    ],
    reforms: [
      {
        year: 1911,
        jurisdiction: "England, Wales and Ireland",
        chartLabel: "Protection of Animals Act",
        change:
          "The Protection of Animals Act consolidated anti-cruelty protections; enacted in 1911 and effective January 1912. Scotland was excluded. Earlier protections already existed.",
        sourceUrl: "https://www.legislation.gov.uk/ukpga/Geo5/1-2/27/enacted",
      },
      {
        year: 1966,
        jurisdiction: "United States",
        chartLabel: "Federal Laboratory Animal Welfare Act",
        change:
          "The Laboratory Animal Welfare Act established federal licensing and humane-care requirements for specified animals in the research supply chain and at research facilities. Its initial coverage was limited to dogs, cats, nonhuman primates, guinea pigs, hamsters, and rabbits; it was not universal animal protection.",
        sourceUrl:
          "https://www.nal.usda.gov/collections/exhibits/awahistory/list",
      },
    ],
    alternatives: [
      {
        id: "livestock1822",
        name: "Earlier livestock protection: 1822 Act (narrower scope)",
        window: { start: 1822, end: 1822 },
        jurisdiction:
          "British livestock protection; specified animals and acts of cruelty",
        sourceUrl:
          "https://publications.parliament.uk/pa/ld200102/ldselect/ldanimal/150/15004.htm",
      },
    ],
  },
  {
    id: "farm-welfare",
    domainId: "farmed",
    name: "Farmed-animal welfare legislation",
    shortName: "Farmed-animal welfare laws",
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
    id: "factory-farming-transition",
    domainId: "farmed",
    name: "Abolishing factory farming / veganism",
    shortName: "Ending factory farming / veganism",
    window: { start: 2000, end: 2100 },
    jurisdiction: "Hypothetical future adoption scenario",
    measure: "scenario",
    kind: "projected",
    description:
      "This hypothetical 2000–2100 scenario assumes that factory farming is abolished and veganism becomes the social norm by 2100. The dates are an illustrative adoption window, not a prediction or a claim that this transition has happened. Animal legal protection is a separate historical benchmark. Earlier vegetarian arguments can support part of this transition without establishing advocacy of its full vegan endpoint; each evidence record states that distinction. This future scenario is excluded from historical rankings.",
    sources: [],
  },
  {
    id: "extinction-concern",
    domainId: "extinction",
    name: "Humanity starts to take extinction risks seriously",
    shortName: "Humanity starts to take extinction risks seriously",
    window: { start: 2000, end: 2030 },
    jurisdiction: "Western reference scenario stipulated for this project",
    measure: "interpretation",
    kind: "stipulated",
    description:
      "User-specified period of wider concern, not the first expression of the idea. The window is interpretive and its future portion is assumed. All scores are provisional. The founding dates below document growth of the research field; they do not establish broad social adoption.",
    sources: [
      {
        title: "FHI founding history",
        url: "https://ora.ox.ac.uk/objects/uuid%3A8c1ab46a-061c-479d-b587-8909989e4f51/files/s707959314",
      },
      { title: "GCRI founding history", url: "https://gcri.org/about/" },
      {
        title: "CSER founding history",
        url: "https://www.phil.cam.ac.uk/system/files/documents/philosophy-at-cambridge-16-newsletter-2020.pdf",
      },
      {
        title: "FLI founding history",
        url: "https://futureoflife.org/about-us/our-history/",
      },
    ],
    reforms: [
      {
        year: 2005,
        jurisdiction: "Oxford, UK",
        chartLabel: "FHI founded",
        change:
          "Future of Humanity Institute founded at Oxford in 2005; the institute operated until 2024.",
        sourceUrl:
          "https://ora.ox.ac.uk/objects/uuid%3A8c1ab46a-061c-479d-b587-8909989e4f51/files/s707959314",
      },
      {
        year: 2011,
        jurisdiction: "US / international",
        chartLabel: "GCRI founded",
        change:
          "Global Catastrophic Risk Institute founded by Seth Baum and Tony Barrett in 2011.",
        sourceUrl: "https://gcri.org/about/",
      },
      {
        year: 2012,
        jurisdiction: "Cambridge, UK",
        chartLabel: "CSER founded",
        change:
          "Centre for the Study of Existential Risk established in 2012 by Huw Price, Martin Rees, and Jaan Tallinn.",
        sourceUrl:
          "https://www.phil.cam.ac.uk/system/files/documents/philosophy-at-cambridge-16-newsletter-2020.pdf",
      },
      {
        year: 2014,
        jurisdiction: "US",
        chartLabel: "FLI founded",
        change:
          "Future of Life Institute founded in 2014, with its launch event at MIT.",
        sourceUrl: "https://futureoflife.org/about-us/our-history/",
      },
    ],
  },
  {
    id: "wild-welfare",
    domainId: "wild",
    name: "Wild-animal welfare statutes",
    shortName: "Wild-animal welfare statutes",
    window: { start: 2060, end: 2100 },
    jurisdiction: "Western reference scenario stipulated for this project",
    measure: "scenario",
    kind: "stipulated",
    description:
      "User-stipulated hypothetical adoption of wild-animal welfare statutes during 2060–2100, including insects. These dates are a future scenario, not enacted laws or the first appearance of moral concern. Historical concern does not necessarily imply support for a specific statute.",
    sources: [],
  },
  {
    id: "ai-welfare",
    domainId: "ai",
    name: "AI welfare statutes",
    shortName: "AI welfare statutes",
    window: { start: 2040, end: 2100 },
    jurisdiction: "Hypothetical future scenario",
    measure: "scenario",
    kind: "projected",
    description:
      "Editable hypothetical adoption of AI welfare statutes during 2040–2100. Neither AI sentience nor future legislation is presented as established. Moral concern does not necessarily imply support for a specific statute.",
    sources: [],
  },
];
