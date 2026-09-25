import { figure as f, evidence as add, figures, yr } from "./evidence";
import { bce } from "@/lib/dates";

// Brief excerpts are budgeted across the entire work, including shared quotations.
export function eightPhilosophers() {
  const e = (input: Parameters<typeof add>[0]) =>
    add({ checkedOn: "2026-09-24", qualified: true, ...input });
  const life = (
    id: string,
    note: string,
    sourceUrl: string,
    floruit?: ReturnType<typeof yr>,
  ) =>
    Object.assign(
      figures.find((f) => f.id === id)!,
      { lifeDateNote: note, lifeDateSourceUrl: sourceUrl, floruit },
    );
  f(
    "aristotle",
    "Aristotle",
    bce(384),
    bce(322),
    "virtue",
    "#69719c",
    "Classical Greece; Aristotelian ethics and political philosophy.",
    "https://plato.stanford.edu/entries/aristotle/",
    "Foundational account of virtue, flourishing and the political community.",
    "foundational",
  );
  life(
    "aristotle",
    "384–322 BCE; BCE dates are stored using astronomical numbering.",
    "https://plato.stanford.edu/entries/aristotle/",
  );
  const politics = {
    person: "aristotle",
    year: bce(350),
    end: bce(322),
    publication: bce(350),
    publicationEnd: bce(322),
    work: "Politics",
    sourceId: "aristotle-politics",
    url: "https://web.mit.edu/classics/Aristotle/politics.1.one.html",
    language: "Ancient Greek",
    translation: "Benjamin Jowett; Internet Classics Archive transcription.",
    edition:
      "Jowett translation, Book I. The host labels the work Written 350 B.C.E.; that approximate work date is not a securely dated individual passage.",
    datingSourceUrl:
      "https://web.mit.edu/classics/Aristotle/politics.1.one.html",
    dateBasis:
      "Approximate work-period proxy: 350–322 BCE, from the witness’s c.350 BCE dating through Aristotle’s death. Composition and ancient circulation are not independently dated here; the public-date range uses the same proxy. Modern translation is a separate witness.",
  };
  e({
    ...politics,
    id: "aristotle-slavery",
    domain: "slavery",
    milestone: "abolition",
    stance: "opposes",
    title: "Defends natural slavery",
    quote: "some men are by nature free, and others slaves",
    locator: "Book I, chapter 5 (1254b–1255a); compare chapters 3 and 6",
    summary:
      "Argues that slavery is just and beneficial for people he classifies as natural slaves.",
    context:
      "This is Aristotle’s affirmative answer, not the opposing view he reports in chapter 3.",
    match:
      "Defending ownership and compulsory service of natural slaves opposes abolition, despite differences from modern racial chattel slavery.",
    qualifications: [
      "Natural slavery is not coextensive with every historical enslavement; Aristotle distinguishes it from enslavement by convention or conquest.",
    ],
    counter:
      "I.6 acknowledges that legal and natural slave status can diverge and that unjust warfare cannot establish a just title. These limits do not withdraw I.5’s defense of slavery in principle.",
  });
  e({
    ...politics,
    id: "aristotle-women",
    domain: "women",
    milestone: "women-equality",
    stance: "opposes",
    title: "Women’s deliberation without ruling authority",
    quote: "the woman has, but it is without authority",
    locator: "Book I, chapter 13 (1260a); compare chapters 5 and 12",
    summary:
      "Recognizes women’s deliberative capacity while assigning men authority and women a subordinate role.",
    context:
      "The missing noun in the excerpt is the deliberative faculty. The surrounding argument distinguishes the capacities and virtues of rulers and subjects.",
    match:
      "Sex-based subordination conflicts with the benchmark’s equality-of-opportunity principle; this is a qualified cross-context comparison, not a statement about a modern statute.",
    counter:
      "I.12 distinguishes a wife’s status from slavery, and I.13 recognizes female virtue and the importance of education. These concessions retain differentiated authority and the virtue of obedience.",
  });

  f(
    "aquinas",
    "Thomas Aquinas",
    1225,
    1274,
    "christian",
    "#ad5741",
    "Medieval Latin Christianity; Thomist synthesis of Christian theology and Aristotelian philosophy.",
    "https://plato.stanford.edu/entries/aquinas/",
    "Dominican theologian whose moral philosophy explicitly develops Christian virtue, natural law and divine law.",
    "foundational",
    [
      {
        traditionId: "virtue",
        status: "core",
        branch: "Aristotelian / Thomist",
        basis:
          "Substantively develops Aristotle’s ethics and virtue theory within Christian theology, rather than merely citing Aristotle.",
        sourceUrl: "https://plato.stanford.edu/entries/aquinas/",
      },
    ],
  );
  life(
    "aquinas",
    "Birth conventionally dated c.1225; death 1274. The birth year is approximate.",
    "https://plato.stanford.edu/entries/aquinas/",
  );
  const summa = {
    person: "aquinas",
    year: 1271,
    end: 1272,
    publication: 1271,
    publicationEnd: 1272,
    work: "Summa theologiae",
    language: "Latin",
    translation:
      "Fathers of the English Dominican Province; second and revised edition, 1920, as identified by New Advent.",
    witnessPublication: 1920,
    edition:
      "New Advent transcription of the 1920 English edition, Secunda Secundae. Separate question pages belong to the same work and share a quotation budget.",
    datingSourceUrl:
      "https://www.it.dominikanie.pl/tomasz-z-akwinu/katalog-dziel-tomasza/summa-theologiae/",
    dateBasis:
      "The Thomistic Institute’s work chronology dates II-II to Paris, 1271–1272. This section-level composition range also serves as an approximate circulation proxy, not a claimed printing date. Inspected English witness: 1920.",
  };
  e({
    ...summa,
    id: "aquinas-heresy",
    domain: "religion",
    milestone: "religious-freedom",
    stance: "opposes",
    title: "Coercion and execution of persistent heretics",
    url: "https://www.newadvent.org/summa/3011.htm",
    quote: "but even put to death",
    locator: "II-II, question 11, article 3, answer; compare II-II q.10 a.8",
    summary:
      "Approves delivery of persistent heretics to secular authorities for execution after ecclesiastical admonition.",
    context:
      "The quotation is from Aquinas’s answer, not an objection he rejects.",
    qualifications: [
      "The target is baptized heretics; this is not an instruction to force every non-Christian to convert.",
    ],
    counter:
      "II-II q.10 a.8 rejects compelling those who never accepted Christianity to believe, but permits coercing heretics and apostates. Q.11 a.3 calls for admonition before punishment; neither qualification amounts to general religious liberty.",
    match:
      "State punishment for religious dissent directly conflicts with the religious-liberty benchmark.",
  });
  e({
    ...summa,
    id: "aquinas-execution",
    domain: "execution",
    milestone: "execution-abolition",
    stance: "opposes",
    title: "Capital punishment for the common good",
    url: "https://www.newadvent.org/summa/3064.htm",
    quote: "it is praiseworthy and advantageous that he be killed",
    locator: "II-II, question 64, article 2, answer; articles 3 and 6",
    summary:
      "Defends killing a dangerous wrongdoer when necessary to safeguard the community.",
    context:
      "Aquinas compares removing a dangerous individual to removing a diseased part to preserve the whole.",
    qualifications: [
      "Q.64 a.3 reserves such punishment to public authority, excluding private vengeance.",
    ],
    counter:
      "Q.64 a.2 reply 1 counsels restraint where execution endangers innocent people; a.6 prohibits killing the innocent. These restrictions retain capital punishment for the guilty.",
    match:
      "Justification of state execution opposes the abolition benchmark, even with restrictions on who may be executed.",
  });

  const musoniusUrl =
    "https://philocyclevl.wordpress.com/wp-content/uploads/2016/09/yale-classical-studies-10-cora-e-lutz-ed-musonius-rufus_-the-roman-socrates-yale-university-press-1947.pdf";
  f(
    "musonius",
    "Musonius Rufus",
    undefined,
    undefined,
    "stoic",
    "#537564",
    "Roman imperial Stoicism; lectures preserved through later reporting.",
    "https://iep.utm.edu/musonius/",
    "Stoic teacher whose lectures ground practical ethics in shared reason and virtue.",
    "central",
  );
  life(
    "musonius",
    "Broad activity envelope, c.60–102 CE: the IEP documents his activity from around 60 CE and death before 101–102 CE. These are bounds for the teaching-period proxy, not precise life dates.",
    "https://iep.utm.edu/musonius/",
    yr(60, 102),
  );
  e({
    id: "musonius-women",
    person: "musonius",
    domain: "women",
    title: "The same philosophical education for women and men",
    year: 60,
    end: 102,
    publication: 401,
    publicationEnd: 500,
    attribution: "reported-teaching",
    attributionNote:
      "Teaching attributed to Musonius, reported by Lucius and preserved in Stobaeus’s fifth-century anthology. This is not an autograph or an extant treatise authored by Musonius. Lutz discusses the transmission at pp.5–9.",
    textualAttestation: yr(401, 500),
    work: "Lectures",
    author: "Musonius Rufus (reported by Lucius; preserved by Stobaeus)",
    url: musoniusUrl,
    language: "Greek",
    translation:
      "Cora E. Lutz, Musonius Rufus: The Roman Socrates, Yale Classical Studies 10 (1947).",
    witnessPublication: 1947,
    edition:
      "Lutz 1947, Greek text and English translation; lecture IV, printed p.47 (PDF page 51); lecture III, pp.39–43.",
    datingSourceUrl: "https://iep.utm.edu/musonius/",
    dateBasis:
      "60–102 CE is a broad attributed teaching-period proxy, not the date of an authored manuscript. The earliest securely identified textual attestation used here is Stobaeus, 401–500 CE; the public-only calculation conservatively uses that attestation interval. Lutz’s inspected translation appeared in 1947.",
    quote:
      "the same type of training and education must, of necessity, befit both men and women.",
    locator: "Lecture IV, p.47; read alongside lecture III and the rest of IV",
    summary:
      "Argues that women share men’s capacity for virtue and should receive the same philosophical training.",
    context:
      "The lecture makes equal virtue the basis for equal moral education, while discussing differentiated physical work.",
    qualifications: [
      "Unscored: access to philosophical training does not by itself establish the legal equality of opportunity covered by the existing benchmark.",
      "The received wording is a transmitted report; neither the exact teaching year nor Lucius’s recording date is known.",
    ],
    counter:
      "Lecture III frames female virtue around managing a household, husband, children and slaves. IV favors indoor work for women and heavier outdoor work for men, while allowing exceptions and denying absolute exclusivity. No general equal-rights or abolitionist claim is inferred.",
    match:
      "A significant educational claim, but too narrow to assign the existing legal sex-discrimination benchmark without conflating moral education with legal status. Retained in the table without a score.",
  });

  f(
    "nagarjuna",
    "Nāgārjuna",
    undefined,
    undefined,
    "buddhist",
    "#bb871b",
    "Indian Mahāyāna Buddhism; Madhyamaka.",
    "https://plato.stanford.edu/entries/nagarjuna/",
    "Foundational Madhyamaka philosopher; the Precious Garland develops Buddhist ethical counsel to a king.",
    "foundational",
  );
  life(
    "nagarjuna",
    "Activity placed within c.150–250 CE; these endpoints are not asserted birth and death years.",
    "https://plato.stanford.edu/entries/nagarjuna/",
    yr(150, 250),
  );
  const garland = {
    person: "nagarjuna",
    year: 150,
    end: 250,
    publication: 150,
    publicationEnd: 250,
    work: "Precious Garland (Ratnāvalī)",
    sourceId: "nagarjuna-garland",
    url: "https://www.lamayeshe.com/sites/default/files/preciousgarland_eng2.pdf",
    language: "Sanskrit; transmitted also in Tibetan",
    translation:
      "Jeffrey Hopkins, as credited on the inspected PDF title page. The PDF supplies no verified publication year; none is inferred from its upload date.",
    edition:
      "The Precious Garland of Advice for a King, Hopkins translation hosted by Lama Yeshe Wisdom Archive, numbered verses and printed pp.123–125.",
    datingSourceUrl: "https://plato.stanford.edu/entries/nagarjuna/",
    attributionNote:
      "Ratnāvalī is among the works whose attribution to the Madhyamaka Nāgārjuna is largely uncontested in the linked scholarly account; not every work bearing the name has that status.",
    dateBasis:
      "150–250 CE is the documented activity range used as a broad composition/circulation proxy; no exact year for these verses or independently dated first circulation is established. The modern PDF’s issue date is unspecified.",
    quote: "Have them banished Without killing or tormenting them.",
    locator: "Ratnāvalī §§330–337, especially §337; printed p.125",
    context:
      "Even angry murderers are to be banished without killing or torment. §§330–336 require compassion and adequate care for prisoners but retain punishment.",
    counter:
      "§330 accepts fines, binding and punishment; §336 endorses compassionate correction and §337 banishment. This is not abolition of prisons, coercion or all punishment. The same passage supports two distinct domains without adding a second episode within either domain.",
  };
  e({
    ...garland,
    id: "nagarjuna-execution",
    domain: "execution",
    milestone: "execution-abolition",
    title: "Banish murderers instead of executing them",
    summary:
      "Counsels a ruler against killing even murderers, prescribing banishment instead.",
    match:
      "The explicit refusal to kill serious offenders supports ending state execution. This remains a royal ethical prescription, not evidence that a modern abolition law was proposed or enacted.",
  });
  e({
    ...garland,
    id: "nagarjuna-torture",
    domain: "torture",
    milestone: "torture-ban",
    title: "Reject torment and care for prisoners",
    summary:
      "Rejects tormenting offenders and requires humane provision for prisoners.",
    match:
      "The express prohibition of torment matches the cruel-punishment component of the existing benchmark; it is not an articulated modern treaty or detailed ban on every interrogation practice.",
  });

  const umasvatiDating =
    "https://jainpedia.org/wp-content/uploads/2021/06/Sukhlalji_Dixit-final.pdf";
  f(
    "umasvati",
    "Umāsvāti",
    undefined,
    undefined,
    "jain",
    "#78923d",
    "Jain philosophy; also known as Umāsvāmin, with divergent sectarian attributions.",
    umasvatiDating,
    "Systematizes Jain doctrine and the vows of non-injury; the work is authoritative across major Jain traditions.",
    "foundational",
  );
  life(
    "umasvati",
    "Dating remains disputed. The broad possible activity envelope, 57 BCE–500 CE, includes Sukhlalji’s introduction pp.20–22 (first through fourth centuries of the Vikrama era) and this edition’s preface (fourth–fifth centuries CE). It is an uncertainty envelope, not a 556-year life.",
    umasvatiDating,
    yr(bce(57), 500),
  );
  e({
    id: "umasvati-noninjury",
    person: "umasvati",
    domain: "animals",
    title: "Mistreatment violates the minor vow of non-injury",
    year: bce(57),
    end: 500,
    publication: bce(57),
    publicationEnd: 500,
    work: "Tattvārtha Sūtra",
    url: "https://www.wisdomlib.org/jainism/book/tattvartha-sutra-with-commentary/d/doc1084850.html",
    language: "Sanskrit",
    translation:
      "Vijay K. Jain (2018); base sūtra translation explicitly separated on the page from Pūjyapāda’s Sarvārthasiddhi commentary.",
    witnessPublication: 2018,
    edition:
      "Jain 2018, sūtra 7.25; Wisdom Library transcription. Only the base-sūtra translation is quoted.",
    datingSourceUrl: umasvatiDating,
    attributionNote:
      "The sūtra is attributed to Umāsvāti/Umāsvāmin. The English explanation headed Sarvārthasiddhi belongs to the later commentator Pūjyapāda and is not treated as Umāsvāti’s own words.",
    dateBasis:
      "Disputed work-period proxy, 57 BCE–500 CE, derived from the competing chronologies documented in Sukhlalji/Dixit’s introduction and the edition’s preface. Ancient circulation is not independently dated. The inspected translation is 2018, not the date of the ancient position.",
    quote:
      "Binding–bandha, beating–vadha, mutilating limbs–cheda, overloading–atibhārāropaṇa, and withholding food and drink–annapānanirodha",
    locator:
      "Sūtra 7.25, base text and its translation, before the commentary heading",
    summary:
      "Lists binding, beating, mutilation, overloading and deprivation as violations of the householder’s minor vow of non-injury.",
    context:
      "The later commentary explicitly applies overloading to humans and animals and deprivation to animals; that explanatory specificity is not imported into the wording of the base sūtra.",
    qualifications: [
      "Unscored: the checked sūtra states a religious vow; its explicit animal applications on this page are supplied by a later commentator. A legal animal-protection match is not established by this witness alone.",
      "The broad date interval expresses scholarly disagreement and must never be interrupted by an axis break.",
    ],
    counter:
      "The passage concerns the householder’s minor vow, not a prohibition of every incidental injury or a program for animal legislation. The commentator’s elaboration must not be assigned to the earlier author. No slavery or women’s-rights position is inferred from this excerpt.",
    match:
      "Retained as evidence of non-injury but unmatched: the inspected base text alone is insufficient for an author-specific claim equivalent to the selected animal-protection legislation.",
  });

  f(
    "ibn-rushd",
    "Ibn Rushd (Averroes)",
    1126,
    1198,
    "islamic",
    "#447c55",
    "Al-Andalus / Marrakesh; Islamic philosophy and Aristotelian commentary.",
    "https://plato.stanford.edu/entries/ibn-rushd/",
    "Develops philosophical accounts of law, virtue and religion within Islamic intellectual life.",
    "foundational",
    [
      {
        traditionId: "virtue",
        status: "core",
        branch: "Aristotelian",
        basis:
          "His substantive Aristotelian ethical framework and commentary activity justify overlapping affiliation, beyond nominal religious identity.",
        sourceUrl: "https://plato.stanford.edu/entries/ibn-rushd/",
      },
    ],
  );
  e({
    id: "ibn-rushd-women",
    person: "ibn-rushd",
    domain: "women",
    milestone: "women-equality",
    title: "Women can be philosophers, guardians and rulers",
    year: 1177,
    end: 1195,
    publication: 1177,
    publicationEnd: 1195,
    work: "Commentary on Plato’s Republic",
    url: "https://api.pageplace.de/preview/DT0400.9780801471650_A29967506/preview-9780801471650_A29967506.pdf",
    language: "Arabic original lost; surviving Hebrew translation",
    translation:
      "Ralph Lerner (1974), from the Hebrew transmission; primary excerpts reproduced in the translator’s introduction, p.xix.",
    witnessPublication: 1974,
    edition:
      "Averroes on Plato’s Republic, Cornell University Press, 1974; inspected publisher preview, introduction p.xix. Longer primary extracts from Lerner pp.57–59 were cross-checked in University of Rochester Press’s Plato’s Republic in the Islamic Context (2022), pp.125–126, 293.",
    datingSourceUrl: "https://www.asau.ru/files/pdf/3048787.pdf",
    dateBasis:
      "Composition/circulation proxy 1177–1195 covers the competing datings 1177–1180 and 1189–1195 recorded in the linked scholarly volume, chapter 1 note 1. The Arabic original is lost; the surviving Hebrew translation is early fourteenth century. English witness: 1974.",
    attributionNote:
      "An authored commentary, not words attributed to Plato. The first-person argument develops women’s shared capacities. Its Arabic text is lost; the checked English derives through Hebrew. Inspection covers reproduced primary excerpts, not collation of the full Arabic or Hebrew tradition.",
    quote: "that there be philosophers and rulers among them.",
    locator:
      "First treatise, 53.14–54.10 (Hebrew-text numbering); Lerner pp.57–59, excerpt reproduced in introduction p.xix",
    summary:
      "Argues that qualified women can perform the same civic activities as men and criticizes restricting their development to domestic functions.",
    context:
      "The phrase concerns women’s capacity for philosophy and rule, within a discussion of common human ends and the education of the city’s classes.",
    match:
      "Access to public roles on the basis of capacity is a qualified match to equality of opportunity. It is neither universal suffrage nor a complete theory of equal civil rights.",
    qualifications: [
      "Primary wording is verified in reproduced excerpts; a complete edition-level review of the commentary remains open.",
    ],
    counter:
      "The argument retains hierarchical civic classes and claims women are generally weaker in these activities. Criticism of women’s enforced domestic confinement does not establish equality in every sphere, marriage law or political representation.",
  });

  f(
    "sidgwick",
    "Henry Sidgwick",
    1838,
    1900,
    "utilitarian",
    "#2868c7",
    "Britain; classical utilitarian ethics and political theory.",
    "https://plato.stanford.edu/entries/sidgwick/",
    "Systematic utilitarian theorist; evaluates political arrangements by their consequences for general welfare.",
    "central",
  );
  e({
    id: "sidgwick-suffrage",
    verification: "primary-pdf",
    person: "sidgwick",
    domain: "suffrage",
    milestone: "votes-for-women",
    title: "Enfranchise otherwise eligible independent women",
    year: 1897,
    publication: 1897,
    workFirstPublication: 1891,
    witnessPublication: 1897,
    work: "The Elements of Politics",
    sourceId: "sidgwick-suffrage-source",
    url: "https://archive.org/details/elementspolitic01sidggoog",
    edition:
      "Second edition, revised throughout, Macmillan 1897. Inspected passages: IX pp.141–142; XVIII §8 p.326; XX §4 pp.383–387; XXVI §7 p.550. Title/imprint and quoted pages checked against the scan.",
    datingSourceUrl: "https://archive.org/details/elementspolitic01sidggoog",
    dateBasis:
      "1897 is the inspected second-edition passage proxy. The work first appeared in 1891, but this record does not silently backdate revised wording to that edition. The University of Texas transcription derives from the later 1919 edition and is not the dating witness.",
    quote: "her sex alone",
    locator: "XX.4, pp.384–385; essential qualifications pp.383–387",
    summary:
      "Finds no adequate reason to refuse the vote to otherwise eligible self-supporting women on sex alone, especially unmarried women and widows.",
    context:
      "Sidgwick finds no adequate reason to exclude an otherwise eligible, sane, self-supporting adult because of her sex. This excerpt identifies the ground of exclusion he rejects, not a restriction he endorses; the full argument is at pp.384–385.",
    match:
      "Qualified support for extending the franchise to women is comparable to the staged suffrage benchmark; this is not support for universal adult suffrage or equal voting rights for all wives.",
    qualifications: [
      "Retains educational, criminal, economic-independence and other electoral restrictions.",
    ],
    counter:
      "XX.4 pp.386–387 says the case for wives is weaker and objections more serious, invoking husbandly representation, intimidation, domestic harmony and female electoral preponderance. The same section permits racial exclusion on asserted intellectual or moral inferiority. These are substantial contrary positions, not universal egalitarianism.",
  });

  f(
    "james-mill",
    "James Mill",
    1773,
    1836,
    "utilitarian",
    "#2868c7",
    "Scotland / England; Benthamite philosophical radicalism.",
    "https://plato.stanford.edu/entries/james-mill/",
    "Develops utilitarian arguments for representative government; a distinct figure from John Stuart Mill.",
    "central",
  );
  e({
    id: "james-mill-suffrage",
    person: "james-mill",
    domain: "suffrage",
    milestone: "votes-for-women",
    stance: "opposes",
    title: "Exclude women from independent political representation",
    year: 1825,
    publication: 1825,
    workFirstPublication: 1820,
    witnessPublication: 1825,
    work: "Government",
    url: "https://oll.libertyfund.org/quotes/james-mill-on-women-and-representative-government",
    edition:
      "Primary excerpt in the Online Library of Liberty, sourced to Articles in the Supplement to the Encyclopedia Britannica (1825).",
    datingSourceUrl: "https://plato.stanford.edu/entries/james-mill/",
    dateBasis:
      "1825 is the dated collected-edition witness used for the passage. The essay first appeared in 1820; the quotation page labels it 1824. Without collating those earlier witnesses, this record uses the inspected collection’s 1825 proxy, rather than resolving that discrepancy by assumption.",
    quote:
      "the interests of almost all of whom are involved either in that of their fathers or that of their husbands.",
    locator:
      "Government, discussion of the choosing body, paragraph beginning One thing is pretty clear",
    summary:
      "Argues that women may be excluded from the electorate because their interests are represented by fathers or husbands.",
    context:
      "He puts women alongside children when discussing which individuals can be omitted from independent representation.",
    match:
      "Exclusion of women from the electorate directly opposes the women’s-suffrage benchmark, predating the selected legal transition and receiving a negative foresight score at half weight.",
    counter:
      "The argument starts from government serving the whole community, yet treats women’s interests as represented by male relatives. Its almost-all qualification does not establish an affirmative franchise for independent women. His son’s and Bentham’s positions are not substitutes for his own.",
  });
}
