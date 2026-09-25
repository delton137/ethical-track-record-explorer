import { figure, evidence, figures, yr } from "./evidence";
import { bce } from "@/lib/dates";

export function ancientStoics() {
  const e = (input: Parameters<typeof evidence>[0]) =>
    evidence({ checkedOn: "2026-09-24", qualified: true, ...input });
  const senecaProfile = "https://plato.stanford.edu/entries/seneca/";
  figure(
    "seneca",
    "Seneca",
    bce(1),
    65,
    "stoic",
    "#537564",
    "Roman imperial Stoicism; philosophical essays and literary letters.",
    senecaProfile,
    "A central Roman Stoic whose philosophical writings develop Stoic virtue, moral psychology and obligations to other people.",
    "central",
  );
  Object.assign(
    figures.find((f) => f.id === "seneca")!,
    {
      lifeDateNote:
        "Approximate birth c.1 BCE and death 65 CE follow the linked SEP biography. The birth year is an approximate display endpoint, not a securely dated event.",
      lifeDateSourceUrl: senecaProfile,
    },
  );
  e({
    id: "seneca-execution",
    person: "seneca",
    domain: "execution",
    milestone: "execution-abolition",
    stance: "opposes",
    title: "Permits execution when required by public advantage",
    year: 55,
    end: 56,
    publication: 55,
    publicationEnd: 56,
    witnessPublication: 1889,
    work: "Of Clemency (De clementia)",
    url: "https://www.gutenberg.org/files/64576/64576-h/64576-h.htm",
    language: "Latin",
    translation:
      "Aubrey Stewart, Minor Dialogues Together with the Dialogue on Clemency (1889).",
    edition:
      "George Bell and Sons, 1889, transcribed by Project Gutenberg; Of Clemency, Book I §12. Title page and surrounding sections inspected in the transcription.",
    datingSourceUrl: senecaProfile,
    dateBasis:
      "Work-period proxy of 55–56 CE follows the dating of the address to Nero in the linked scholarly biography. Public circulation uses the same explicitly uncertain proxy; no independently dated first publication is claimed. The inspected English witness is 1889.",
    quote:
      "They do, but only when that measure is recommended by the public advantage",
    locator: "Book I §12; compare §§11, 14, 17–18",
    summary:
      "Distinguishes the restrained king from the cruel tyrant, but expressly permits rulers to put people to death for public benefit.",
    context:
      "The sentence answers the question whether kings also execute people. Seneca answers affirmatively and supplies a condition, rather than advocating abolition.",
    match:
      "An explicit permission for state executions conflicts with abolition of capital punishment. Opposition before the benchmark receives a negative foresight score at half weight.",
    qualifications: [
      "Permission is conditional and accompanies a sustained argument for clemency.",
    ],
    counter:
      "I.14 demands attempts at reform before execution; I.17 condemns cruel punishment; I.18 condemns a master who kills enslaved people brutally. These restrictions do not cancel the permission in I.12. Neither gentleness nor criticism of a particular atrocity establishes a general ban on judicial torture.",
  });
  e({
    id: "seneca-slavery",
    person: "seneca",
    domain: "slavery",
    title: "Treat enslaved people with respect rather than fear",
    year: 62,
    end: 65,
    publication: 62,
    publicationEnd: 65,
    witnessPublication: 1925,
    work: "Moral Letters to Lucilius",
    url: "https://en.wikisource.org/wiki/Moral_letters_to_Lucilius/Letter_47",
    language: "Latin",
    translation:
      "Richard M. Gummere, Loeb Classical Library; the linked collection’s inspected title/imprint presents the 1925 reprint.",
    edition:
      "Letter 47 §§17–19; title/imprint of the linked Wikisource collection inspected separately. Modern translation/reprint dating is distinct from the ancient work period.",
    datingSourceUrl: senecaProfile,
    dateBasis:
      "The scholarly biography dates the literary Letters to 62–65 CE. This is a work-period envelope, not a precise date for Letter 47. Their intended literary readership is distinguished from private correspondence; public circulation uses the same declared work-period proxy, not a securely dated first edition.",
    quote: "they ought to respect you rather than fear you.",
    locator: "Letter 47 §17; compare §§1, 10–19",
    summary:
      "Urges a master to recognize enslaved people’s humanity, cultivate respect and refrain from whipping them, while continuing to address the relationship as one of master and slave.",
    context:
      "This is advice to Lucilius about his treatment of enslaved household members. The surrounding argument contests contempt and brutality, not the legal existence of slavery.",
    match:
      "Unscored: humane treatment and shared humanity do not establish the existing legal-abolition benchmark. No opposition to abolition is inferred merely from the absence of such a proposal.",
    qualifications: [
      "The record concerns treatment within slavery, not an abolition program.",
    ],
    counter:
      "Sections 14–19 retain masters, household duties and differences of station. Section 19 rejects whipping human slaves while allowing the whip for animals. Of Clemency I.18 likewise limits cruelty within the institution rather than requiring its abolition.",
  });
  const epictetusProfile = "https://plato.stanford.edu/entries/epictetus/";
  figure(
    "epictetus",
    "Epictetus",
    undefined,
    undefined,
    "stoic",
    "#537564",
    "Roman imperial Stoicism; teachings transmitted by Arrian.",
    epictetusProfile,
    "A major systematic exponent of Stoic ethics, especially volition, moral responsibility and kinship among human beings.",
    "central",
  );
  Object.assign(
    figures.find((f) => f.id === "epictetus")!,
    {
      floruit: yr(89, 135),
      lifeDateNote:
        "Later teaching/floruit envelope, c.89–135 CE: the linked biography places departure from Rome around 89 and death around 135. Born sometime in the 50s CE; no exact birth or death endpoint is asserted here.",
      lifeDateSourceUrl: epictetusProfile,
    },
  );
  e({
    id: "epictetus-slavery",
    person: "epictetus",
    domain: "slavery",
    title: "An enslaved person is a brother, not a license for tyranny",
    attribution: "reported-teaching",
    attributionNote:
      "Attributed to Epictetus and transmitted in Arrian’s Discourses. Arrian’s prologue describes notes of oral teaching; the degree of literary shaping remains debated. This is not an autograph or a verified verbatim lecture transcript.",
    year: 89,
    end: 135,
    publication: 101,
    publicationEnd: 200,
    textualAttestation: yr(101, 200),
    witnessPublication: 1877,
    work: "Discourses of Epictetus",
    author: "Epictetus, as reported by Arrian",
    url: "https://en.wikisource.org/wiki/The_Discourses_of_Epictetus;_with_the_Encheiridion_and_Fragments/Book_1/Chapter_13",
    language: "Ancient Greek",
    translation:
      "George Long, The Discourses of Epictetus; with the Encheiridion and Fragments (1877).",
    edition:
      "George Bell and Sons, 1877; Book I chapter 13, pp.45–46. The chapter, Arrian’s prologue and the collection’s title page were inspected in the Wikisource transcription.",
    datingSourceUrl: epictetusProfile,
    dateBasis:
      "The teaching is commonly placed around 108 CE, but no individual lecture date is established. The conservative 89–135 CE envelope spans his later teaching career. Arrian’s second-century compilation is recorded separately as a broad 101–200 CE textual-attestation/public-circulation proxy, not the date of an extant manuscript. The inspected translation dates to 1877.",
    quote: "will you not bear with your own brother",
    locator:
      "Discourses I.13, pp.45–46; attribution qualified by Arrian’s prologue",
    summary:
      "Rebukes a master’s anger at an enslaved servant by appealing to their common divine parentage and rejects purchase as sufficient justification for tyranny.",
    context:
      "A master objects that he bought the servant. The response contrasts human property law with divine kinship; the purchased-person objection is the interlocutor’s, not Epictetus’s endorsed conclusion.",
    match:
      "Unscored: moral brotherhood and a rebuke to cruel mastery are relevant evidence, but this passage does not propose legal emancipation or abolition. Its scope cannot be converted into a modern racial-equality position either.",
    qualifications: [
      "Reported teaching with uncertain lecture and circulation dates.",
    ],
    counter:
      "The exchange still addresses a person exercising authority over a servant. It supplies no emancipatory policy. A full review of the Discourses and Encheiridion for institutional slavery, women and punishment remains open; general inner freedom is not evidence of legal abolition.",
  });
}
