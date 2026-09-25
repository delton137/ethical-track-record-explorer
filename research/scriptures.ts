import { figure, figures, evidence, yr } from "./evidence";
import { bce } from "@/lib/dates";

type Entry = Parameters<typeof evidence>[0];
const KJV =
  "https://www.biblegateway.com/versions/King-James-Version-KJV-Bible/";
const PICKTHALL =
  "https://commons.wikimedia.org/wiki/File:The_Meaning_of_the_Glorious_Koran_(1930).pdf";
const QURAN_DATING = "https://corpuscoranicum.de/de/about/research";
const CODEX_DATING =
  "https://www.metmuseum.org/essays/early-qurans-8thearly-13th-centuries";
const bibleUrl = (passage: string) =>
  `https://www.biblegateway.com/passage/?search=${encodeURIComponent(passage)}&version=KJV`;

/** Texts use the figure/connection model, but never imply one human author. */
export function scriptures() {
  figure(
    "bible",
    "Bible",
    undefined,
    undefined,
    "christian",
    "#ad5741",
    "Scriptural collection; Hebrew Bible / Old Testament and New Testament.",
    KJV,
    "Foundational Christian scripture; the Hebrew Bible is also Jewish scripture. This display affiliation does not make its ancient authors Christian or represent every Christian interpretation.",
    "foundational",
  );
  Object.assign(
    figures.find((f) => f.id === "bible")!,
    {
      kind: "scripture",
      aliases: ["The Bible", "Holy Bible", "Old Testament", "New Testament"],
      compositionPeriod: yr(bce(800), 100),
      lifeDateNote:
        "Range covers the selected passages’ approximate composition/redaction, not a lifetime or a single date for the whole Bible. Book-level dating and disputed authorship are documented per passage.",
      lifeDateSourceUrl:
        "https://oyc.yale.edu/religious-studies/rlst-145/lecture-11",
      importance: {
        level: "foundational",
        rationale:
          "Foundational scriptural collection in Christian ethical traditions; not a person or one internally uniform ethical voice.",
        sourceUrl: KJV,
      },
    },
  );
  figure(
    "quran",
    "Quran",
    undefined,
    undefined,
    "islamic",
    "#447c55",
    "Islamic scripture; proclamations associated with Muhammad, transmitted and collected in Arabic.",
    QURAN_DATING,
    "Foundational Islamic scripture. Its inclusion does not identify the text with every later school of Islamic law, hadith collection, or Muslim’s beliefs.",
    "foundational",
  );
  Object.assign(
    figures.find((f) => f.id === "quran")!,
    {
      kind: "scripture",
      aliases: ["Qur’an", "Qur'an", "Koran", "Quoran"],
      compositionPeriod: yr(610, 632),
      lifeDateNote:
        "Approximate proclamation/composition period 610–632 CE; conventional written standardization in Uthman’s reign, 644–656 CE. These are dating proxies, not dated autographs of individual verses.",
      lifeDateSourceUrl: QURAN_DATING,
      importance: {
        level: "foundational",
        rationale:
          "Foundational scripture in Islamic ethical traditions; treated as a text rather than a human author.",
        sourceUrl: QURAN_DATING,
      },
    },
  );

  const add = (input: Entry) =>
    evidence({
      checkedOn: "2026-09-24",
      qualified: true,
      attribution: "scriptural-text",
      ...input,
    });
  const bible = (
    book: string,
    start: number,
    end: number,
    datingSourceUrl: string,
    dateBasis: string,
  ) => ({
    person: "bible",
    author: `Biblical authors and redactors (${book})`,
    work: `Bible — ${book}`,
    year: start,
    end,
    publication: start,
    publicationEnd: end,
    language: ["Leviticus", "Deuteronomy"].includes(book)
      ? "Biblical Hebrew"
      : "Koine Greek",
    translation:
      "King James Version (1611), in the linked digital transcription with later standardized spelling; not a facsimile of the first edition.",
    edition:
      "KJV digital witness. Chapter and verse locate the passage; 1611 is the translation’s original publication, not the date of the ancient text or this web transcription.",
    publicDomainUrl: KJV,
    datingSourceUrl,
    dateBasis: `${dateBasis} The same range is used as an approximate ancient circulation proxy; no exact first-publication date is known. English translation first published in 1611.`,
    attributionNote:
      "Passage of a composite scriptural collection, not a position authored by a person named Bible. The date refers to the text’s composition/redaction, not the narrated event or later translation.",
  });
  const lev = bible(
    "Leviticus",
    bce(600),
    bce(400),
    "https://oyc.yale.edu/religious-studies/rlst-145/lecture-9",
    "Editorial envelope c.600–400 BCE for exilic/post-exilic priestly and Holiness material, following Hayes’s account. Older traditions and alternative datings exist; the individual laws are not precisely dated.",
  );
  const deut = bible(
    "Deuteronomy",
    bce(800),
    bce(500),
    "https://oyc.yale.edu/religious-studies/rlst-145/lecture-11",
    "Broad c.800–500 BCE composition/redaction envelope: Hayes describes eighth-century legal roots, seventh-century development, and exilic revision. This is not a claim that each law was written in 800 BCE or by Moses.",
  );
  const eph = bible(
    "Ephesians",
    60,
    100,
    "https://bible.usccb.org/bible/ephesians/0",
    "c.60–100 CE envelope retains the disputed alternatives of Pauline composition in the early 60s or a later disciple around 80–100, discussed in the USCCB introduction.",
  );
  add({
    ...lev,
    id: "bible-execution",
    domain: "execution",
    milestone: "execution-abolition",
    stance: "opposes",
    title: "Death penalty for homicide",
    quote: "he that killeth any man shall surely be put to death",
    locator: "Leviticus 24:17; context 24:16–22",
    url: "https://ebible.org/kjv/LEV24.htm",
    summary:
      "Prescribes death for killing a human being within a legal code that also specifies other capital offenses.",
    context:
      "The command is part of the law, not merely a report that an execution occurred.",
    match:
      "Prescribing judicial execution conflicts with abolition of capital punishment; this does not imply identical ancient and modern legal institutions.",
    counter:
      "24:22 applies one law to resident and stranger; limits and equal application do not remove the death penalty. Later biblical calls for mercy do not erase this prescription.",
  });
  add({
    ...lev,
    id: "bible-slavery",
    domain: "slavery",
    milestone: "abolition",
    stance: "opposes",
    title: "Foreign slaves as inheritable property",
    quote: "they shall be your bondmen for ever",
    locator: "Leviticus 25:44–46, quotation 25:46",
    url: "https://ebible.org/kjv/LEV25.htm",
    summary:
      "Allows buying foreigners as slaves and transmitting them as inherited property, while distinguishing the treatment of fellow Israelites.",
    context:
      "Verses 44–46 specify purchase, possession and inheritance; this is not merely the language of hired work.",
    match:
      "Authorization of permanent, inheritable human ownership conflicts with abolition.",
    counter:
      "25:39–43 limits the enslavement and harsh treatment of fellow Israelites. Deuteronomy 23:15–16 protects an escaped slave. Those provisions coexist with this permission for foreign slavery.",
  });
  add({
    ...lev,
    id: "bible-gay",
    domain: "gay",
    milestone: "decriminalization",
    stance: "opposes",
    title: "Capital penalty for male same-sex intercourse",
    quote: "they shall surely be put to death",
    locator: "Leviticus 20:13",
    url: "https://ebible.org/kjv/LEV20.htm",
    summary:
      "Prescribes execution for a man lying with a male as with a woman. The verse does not formulate a modern category of sexual orientation.",
    context:
      "The quoted penalty applies to both participants in the act described at the beginning of the verse.",
    match:
      "The ordinary reading criminalizes male same-sex intercourse and conflicts with decriminalization. Its ancient scope and later application are debated.",
    qualifications: [
      "This is a Levitical prescription, not a statement that all contemporary Jews or Christians apply it as civil law.",
    ],
    counter:
      "Interpretations of the prohibited act and the continuing legal authority of Leviticus differ. This record is confined to the explicit penalty in this passage, not an inference about all same-sex relationships.",
  });
  add({
    ...deut,
    id: "bible-children-rest",
    domain: "children",
    stance: "supports",
    title: "Sabbath rest includes sons and daughters",
    quote: "thou shalt not do any work, thou, nor thy son, nor thy daughter",
    locator: "Deuteronomy 5:14",
    url: bibleUrl("Deuteronomy 5:14"),
    summary:
      "Includes sons and daughters, servants and animals in a weekly rest command. It does not prohibit child labor on other days or set a minimum working age.",
    context:
      "The work restriction is specifically for the Sabbath; the preceding verse permits six days of labor.",
    match:
      "Weekly household rest is narrower than modern child-protection or child-labor legislation, so no benchmark is assigned.",
    counter:
      "The text assumes household labor and gives no age, schooling or hazardous-work rule. Son and daughter do not necessarily mean young children in every instance.",
  });
  add({
    ...deut,
    id: "bible-fugitive-slave",
    domain: "slavery",
    stance: "supports",
    title: "Protect an escaped slave from return",
    quote:
      "Thou shalt not deliver unto his master the servant which is escaped from his master unto thee",
    locator: "Deuteronomy 23:15–16",
    url: bibleUrl("Deuteronomy 23:15-16"),
    summary:
      "Prohibits returning an escaped slave to the master and allows residence without oppression; the provision’s territorial scope is disputed.",
    context: "The following verse lets the fugitive choose a place to live.",
    match:
      "Protection for fugitives is not a general abolition command; retained as unscored counterevidence to slavery-permitting passages.",
    counter:
      "Leviticus 25:44–46 permits foreign slavery. This asylum provision may concern foreign escapees rather than abolishing slavery within Israel.",
  });
  add({
    ...eph,
    id: "bible-women",
    domain: "women",
    milestone: "women-equality",
    stance: "opposes",
    title: "Wives’ submission to husbands",
    quote: "Wives, submit yourselves unto your own husbands, as unto the Lord.",
    locator: "Ephesians 5:22; context 5:21–25",
    url: bibleUrl("Ephesians 5:21-25"),
    summary:
      "Assigns wives submission and husbands headship within a household code, alongside duties of love and self-sacrifice for husbands.",
    context:
      "Verse 21 speaks of mutual submission; verses 23–24 specify husbandly headship and wives’ submission.",
    match:
      "Sex-differentiated household authority conflicts with equal social authority, with qualifications concerning ancient context and disputed interpretation.",
    counter:
      "5:21’s mutual submission, 5:25’s self-sacrificial love, and Galatians 3:28 support egalitarian readings. They are retained alongside the passage’s explicit gendered instruction.",
  });
  add({
    ...eph,
    id: "bible-slave-obedience",
    domain: "slavery",
    milestone: "abolition",
    stance: "opposes",
    title: "Obedience to earthly slave masters",
    quote:
      "Servants, be obedient to them that are your masters according to the flesh",
    locator: "Ephesians 6:5–9, quotation 6:5",
    url: bibleUrl("Ephesians 6:5-9"),
    summary:
      "Directs enslaved people to obey earthly masters and instructs masters to stop threatening them, maintaining the master–slave relationship.",
    context:
      "KJV’s servants here renders Greek douloi in an ancient slaveholding household code; verse 8 contrasts slave and free.",
    match:
      "Qualified opposition to abolition: endorses obedience within slavery rather than explicitly arguing for its creation or expansion.",
    counter:
      "6:9 makes masters answerable to the same heavenly master and rejects threatening; Galatians 3:28 denies spiritual distinctions between slave and free. No emancipation requirement appears here.",
  });
  add({
    ...bible(
      "Galatians",
      54,
      55,
      "https://bible.usccb.org/bible/galatians/0",
      "c.54–55 CE follows the north-Galatian dating in the USCCB introduction; earlier south-Galatian datings are acknowledged alternatives, not settled here.",
    ),
    id: "bible-spiritual-equality",
    domain: "women",
    stance: "supports",
    title: "Male and female are one in Christ",
    quote:
      "there is neither male nor female: for ye are all one in Christ Jesus.",
    locator: "Galatians 3:28",
    url: bibleUrl("Galatians 3:28"),
    summary:
      "Affirms unity in Christ across distinctions of sex, ethnicity and enslavement. This is relevant to women’s equality without explicitly legislating equal civil rights.",
    context:
      "The argument concerns faith, baptism and inheritance of the promise; political and household institutions are not specified.",
    match:
      "Spiritual equality alone does not establish the modern legal-equality benchmark.",
    counter:
      "Ephesians 5:22–24 retains sex-differentiated household roles. The implications of Galatians 3:28 for those roles are disputed.",
  });
  add({
    ...bible(
      "John",
      90,
      100,
      "https://bible.usccb.org/bible/john/0",
      "c.90–100 CE is the USCCB introduction’s final-editing range for the Gospel, not the first-century date of the narrated conversation.",
    ),
    id: "bible-eternal-life",
    domain: "extinction",
    stance: "ambiguous",
    title: "Everlasting life for believers",
    quote:
      "whosoever believeth in him should not perish, but have everlasting life",
    locator: "John 3:16; context 3:16–21",
    url: bibleUrl("John 3:16"),
    summary:
      "Promises everlasting life to believers. It speaks to enduring human life beyond death, but does not assert that the biological human species can never go extinct on Earth.",
    context:
      "The promise is conditional on belief; it is not a statement that every human being goes to heaven.",
    match:
      "Afterlife assurance is relevant context for extinction beliefs, but neither concern about nor opposition to preventing biological human extinction follows from this verse. Unscored.",
    counter:
      "The surrounding passage distinguishes salvation and condemnation. Revelation 21 describes a new heaven and earth, rather than guaranteeing the permanence of present earthly conditions.",
  });
  add({
    ...bible(
      "Revelation",
      90,
      96,
      "https://bible.usccb.org/bible/revelation/0",
      "Editorial c.90–96 CE envelope for the common late-Domitian dating described by the USCCB introduction; earlier datings remain disputed alternatives.",
    ),
    id: "bible-no-more-death",
    domain: "extinction",
    stance: "ambiguous",
    title: "No more death in the renewed creation",
    quote: "there shall be no more death",
    locator: "Revelation 21:4; context 21:1–8",
    url: bibleUrl("Revelation 21:1-8"),
    summary:
      "Envisions God dwelling with people and the end of death in a new heaven and new earth. This is an eschatological survival promise, not a biological extinction-risk assessment.",
    context:
      "21:1 says the first heaven and earth have passed away; 21:8 also describes a second death.",
    match:
      "Does not address preventing the extinction of Homo sapiens. Its promise of future life is displayed without an extinction-policy score.",
    counter:
      "The renewed creation replaces the former order, and the text differentiates destinies. Neither universal admission to heaven nor indefinite survival on the present Earth is stated.",
  });

  const quran = (
    chapter: number,
    verse: number,
    period: "Meccan" | "Medinan" | "mixed",
  ) => ({
    person: "quran",
    author: "Quran (Islamic scripture)",
    work: "Quran",
    year: period === "Medinan" ? 622 : 610,
    end: period === "Meccan" ? 622 : 632,
    publication: 644,
    publicationEnd: 656,
    textualAttestation: yr(644, 656),
    url: `https://corpus.quran.com/translation.jsp?chapter=${chapter}&verse=${verse}`,
    locator: `Quran ${chapter}:${verse}`,
    language: "Classical Arabic",
    translation:
      "Marmaduke Pickthall, The Meaning of the Glorious Koran (1930); the Pickthall line in the Quranic Arabic Corpus parallel translation display.",
    witnessPublication: 1930,
    publicDomainUrl: PICKTHALL,
    edition:
      "Digital transcription of Pickthall’s 1930 translation; other translations and site commentary are not quoted. The translation year is separate from the Arabic passage dates.",
    datingSourceUrl: `https://quran.com/${chapter}/info`,
    dateBasis: `${period === "mixed" ? "Broad 610–632 CE envelope for a surah with disputed Meccan/Medinan material" : `${period} surah-level proxy, ${period === "Meccan" ? "610–622" : "622–632"} CE`}. The chapter information supplies the traditional classification, not an exact verse date. Corpus Coranicum (${QURAN_DATING}) places the proclamations c.610–632. Public-only dating uses Uthman’s reign, 644–656, as a conventional written-codification proxy (${CODEX_DATING}), not an extant autograph or a claim that recitation began then.`,
    attributionNote:
      "Scriptural passage, believed by Muslims to be divine revelation to Muhammad. Historical dates describe proclamation and transmission, without adjudicating divine authorship. Hadith and later jurisprudence are separate sources.",
  });
  add({
    ...quran(2, 178, "Medinan"),
    id: "quran-execution",
    domain: "execution",
    milestone: "execution-abolition",
    stance: "opposes",
    title: "Retaliation for murder, with pardon",
    quote: "Retaliation is prescribed for you in the matter of the murdered",
    summary:
      "Prescribes retaliatory punishment for homicide while allowing forgiveness and compensation.",
    context:
      "The rest of the verse provides for remission by the injured party and payment in kindness.",
    match:
      "Retention of lethal retaliation conflicts with complete abolition, even though pardon is permitted.",
    counter:
      "The same verse allows forgiveness and compensation. That mercy qualification is integral to the passage, but does not abolish capital punishment.",
  });
  add({
    ...quran(4, 24, "Medinan"),
    id: "quran-slavery",
    domain: "slavery",
    milestone: "abolition",
    stance: "opposes",
    title: "Recognizes possession of female captives",
    quote: "save those (captives) whom your right hands possess",
    summary:
      "Makes an exception for possessed captives in a rule concerning married women, presupposing and permitting a slaveholding institution.",
    context:
      "The parenthetical captives is Pickthall’s explanatory wording; the Arabic idiom is traditionally read as slave ownership.",
    match:
      "Qualified opposition to abolition: legal recognition of ownership of captives is incompatible with a universal prohibition of slavery.",
    counter:
      "90:13 praises freeing a slave and 4:92 uses manumission as expiation. These provisions encourage release without explicitly ending all ownership in this verse.",
  });
  add({
    ...quran(90, 13, "Meccan"),
    id: "quran-manumission",
    domain: "slavery",
    stance: "supports",
    title: "Freeing a slave as a virtuous act",
    quote: "to free a slave",
    summary:
      "Names emancipation among the acts of the difficult moral path, alongside feeding the hungry.",
    context:
      "90:12–17 explains the difficult ascent through freeing a slave, feeding the vulnerable, faith and mutual mercy.",
    match:
      "Voluntary manumission supports liberation in particular cases but is not an explicit general abolition rule. Unscored.",
    counter:
      "4:24 recognizes possessed captives. Encouragement of manumission must be considered alongside continued legal recognition of slavery.",
  });
  add({
    ...quran(4, 11, "Medinan"),
    id: "quran-women-inheritance",
    domain: "women",
    milestone: "women-equality",
    stance: "opposes",
    title: "Unequal shares for sons and daughters",
    quote: "to the male the equivalent of the portion of two females",
    summary:
      "Assigns a son twice a daughter’s inheritance share in the stated configuration. The verse also gives women legally defined shares.",
    context:
      "This ratio concerns children inheriting together, not every male/female relationship in every inheritance scenario.",
    match:
      "Sex-differentiated shares conflict with sex-neutral legal entitlements; the comparison does not deny that recognizing women’s inheritance could itself be protective.",
    counter:
      "4:7 explicitly secures a share for women. Other configurations in 4:11 give each parent a sixth; the two-to-one rule is not universal across heirs.",
  });
  add({
    ...quran(4, 7, "Medinan"),
    id: "quran-women-property",
    domain: "women",
    stance: "supports",
    title: "Women have a legal inheritance share",
    quote: "and unto the women a share",
    summary:
      "Expressly recognizes women’s entitlement to inherit from parents and close relatives.",
    context:
      "The verse assigns both men and women a legal share regardless of the estate’s size.",
    match:
      "A protected inheritance entitlement is narrower than equal shares or comprehensive legal equality; unscored alongside 4:11.",
    counter:
      "4:11 differentiates sons’ and daughters’ shares. Recognition of property rights and equality of entitlement are distinct claims.",
  });
  add({
    ...quran(6, 38, "Meccan"),
    id: "quran-animals",
    domain: "animals",
    stance: "ambiguous",
    title: "Animals are communities like humans",
    quote: "they are peoples like unto you",
    summary:
      "Describes animals and birds as communities like humans and gathered to their Lord; relevant to animal moral standing without prescribing a specific welfare law.",
    context:
      "Pickthall’s peoples translates the communal comparison; the verse does not formulate equal legal animal rights.",
    match:
      "Recognition of animal communities does not itself establish an anti-cruelty prohibition, animal rights, or an intervention in wild-animal suffering. Unscored.",
    counter:
      "22:36 permits sacrificial slaughter and eating animals. Familiar Islamic injunctions about humane slaughter and particular acts of cruelty also occur in hadith, which are not silently attributed to the Quran here.",
  });
  add({
    ...quran(22, 36, "mixed"),
    id: "quran-farmed",
    domain: "farmed",
    stance: "ambiguous",
    title: "Sacrificial animals and feeding the poor",
    quote: "eat thereof and feed the beggar and the suppliant",
    summary:
      "Permits sacrificial slaughter of camels and consumption of the meat, with food shared with people in need.",
    context:
      "The quoted instruction follows the animals falling dead after sacrifice. 22:37 emphasizes piety rather than flesh or blood reaching God.",
    match:
      "Permission to eat meat does not determine a position on farmed-animal welfare or industrial factory farming. No welfare or veganism-transition score is inferred.",
    counter:
      "6:38 recognizes animal communities. Neither a universal animal-rights position nor permission for unlimited cruelty follows from these verses.",
  });
  add({
    ...quran(17, 31, "Meccan"),
    id: "quran-children",
    domain: "children",
    stance: "supports",
    title: "Do not kill children out of poverty",
    quote: "Slay not your children, fearing a fall to poverty",
    summary:
      "Prohibits killing children because of feared poverty. This is child protection, but does not specify child-labor ages, working conditions or schooling.",
    context: "The verse promises provision and calls the killing a grave sin.",
    match:
      "The existing benchmark concerns particular child-protection statutes and factory regulation. An anti-infanticide command is retained without claiming equivalence to those reforms.",
    counter:
      "No child-labor prohibition has been established from this passage; protection against killing cannot stand in for rules on exploitation at work.",
  });
  add({
    ...quran(7, 81, "Meccan"),
    id: "quran-gay",
    domain: "gay",
    stance: "opposes",
    title: "Lot condemns lust toward men",
    quote: "ye come with lust unto men instead of women",
    summary:
      "In the Lot narrative, condemns approaching men with lust. Its relation to consensual same-sex relationships is disputed, and this verse states no human criminal penalty.",
    context:
      "The surrounding narrative concerns Lot’s people and divine punishment; moral condemnation and civil sentencing must be distinguished.",
    match:
      "Unscored: opposition to the conduct is not enough to establish a specific decriminalization position. No death penalty from hadith or later jurisprudence is imported into this verse.",
    counter:
      "Interpretations dispute the roles of coercion, inhospitality and same-sex desire in the narrative. Modern sexual orientation and consensual adult partnerships are not the text’s categories.",
  });
  add({
    ...quran(4, 57, "Medinan"),
    id: "quran-eternal-life",
    domain: "extinction",
    stance: "ambiguous",
    title: "Believers dwell in Paradise forever",
    quote: "to dwell therein for ever",
    summary:
      "Promises everlasting residence in the Gardens to those who believe and do good works. This is an afterlife promise, not an explicit guarantee against biological human extinction on Earth.",
    context:
      "The promise specifies believers who do good works; the adjacent verse distinguishes the fate of unbelievers.",
    match:
      "Eternal afterlife is relevant to questions about human survival, but neither extinction-risk policy nor universal admission to heaven follows. Unscored.",
    counter:
      "The Quran also describes earthly death, judgment and differentiated destinies. The claim that all humanity will simply live forever in heaven overstates this verse.",
  });
  add({
    ...quran(2, 256, "Medinan"),
    id: "quran-religion",
    domain: "religion",
    stance: "supports",
    title: "No compulsion in religion",
    quote: "There is no compulsion in religion.",
    summary:
      "States a prohibition on religious compulsion, relevant to freedom of belief; the scope and historical legal application are contested.",
    context:
      "The verse contrasts right direction with error and invites belief rather than presenting a complete civil-rights code.",
    match:
      "Unscored: the statement alone does not settle equal citizenship, apostasy law or every dimension of the religious-liberty benchmark.",
    counter:
      "This passage does not specify treatment of apostasy or all relations between religious communities. Later legal interpretations and debates over scope cannot be collapsed into one Quranic verse.",
  });
}
