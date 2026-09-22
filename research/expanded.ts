import { figure as f, evidence as e } from "./evidence";

/** Short primary excerpts; interpretive limits belong to the position, not the quotation. */
export function expanded() {
  f(
    "marx",
    "Karl Marx",
    1818,
    1883,
    "socialist",
    "#ad3e50",
    "Germany / Britain; historical materialism and communism",
    "https://plato.stanford.edu/entries/marx/",
    "Foundational theorist of Marxism; these texts explicitly connect emancipation to working-class politics.",
    "foundational",
  );
  e({
    id: "marx-slavery",
    person: "marx",
    domain: "slavery",
    title: "Death to slavery",
    summary:
      "Marx endorses the abolitionist direction of the American Civil War.",
    year: 1864,
    publication: 1864,
    publicationEnd: 1865,
    milestone: "abolition",
    quote: "the triumphant war cry of your re-election is Death to Slavery.",
    locator: "Opening paragraph; letter drafted 22–29 November 1864",
    work: "Address of the International Working Men’s Association to Abraham Lincoln",
    url: "https://www.marxists.org/archive/marx/iwma/documents/1864/lincoln-letter.htm",
    edition:
      "The General Council of the First International 1864–1866, Progress Publishers; MIA transcription.",
    dateBasis:
      "Editorial dating: drafted by Marx 22–29 November 1864; German publication 30 December 1864, English 7 January 1865.",
    context:
      "Written by Marx on behalf of the association, congratulating Lincoln on re-election and connecting abolition to workers’ emancipation.",
    qualifications: [
      "Against the default British benchmark this earns zero lead. The US 1865 alternative gives one year.",
      "The letter was formally presented in January 1865; that is not its composition date.",
    ],
  });
  f(
    "luxemburg",
    "Rosa Luxemburg",
    1871,
    1919,
    "socialist",
    "#c45d6d",
    "Poland / Germany; revolutionary Marxism",
    "https://www.britannica.com/biography/Rosa-Luxemburg",
    "Major Marxist theorist; explicitly grounds this demand in socialist emancipation.",
    "central",
  );
  e({
    id: "luxemburg-execution",
    person: "luxemburg",
    domain: "execution",
    title: "Remove capital punishment from the penal code",
    summary:
      "Luxemburg demands the abolition of capital punishment during the German Revolution.",
    year: 1918,
    milestone: "execution-abolition",
    quote:
      "We demand the excision of capital punishment from the German penal code!",
    locator: "Concluding demand, Die Rote Fahne no. 3, 18 November 1918",
    work: "Against Capital Punishment (Eine Ehrenpflicht)",
    url: "https://www.marxists.org/archive/luxemburg/1918/11/18c-alt.htm",
    sourceId: "luxemburg-duty",
    language: "German",
    translation:
      "William L. McPherson, via a French translation; reproduced in International Socialist Review 30(1), 1969, pp. 5–6.",
    context:
      "She argues that a revolutionary government must protect ordinary prisoners as well as political prisoners.",
    qualifications: [
      "The English witness is an indirect translation.",
      "Germany is her immediate target; the scored reference is the stated British abolition window.",
    ],
  });
  e({
    id: "luxemburg-torture",
    person: "luxemburg",
    domain: "torture",
    title: "End barbarous prison punishments",
    summary:
      "Luxemburg calls for an end to whipping and oppressive restraints in prisons.",
    year: 1918,
    milestone: "torture-ban",
    quote: "abolish barbarous punishments – the use of manacles and whippings",
    locator: "Paragraph beginning “The existing system of punishment”",
    work: "Against Capital Punishment (Eine Ehrenpflicht)",
    url: "https://www.marxists.org/archive/luxemburg/1918/11/18c-alt.htm",
    sourceId: "luxemburg-duty",
    language: "German",
    translation:
      "William L. McPherson, via French; International Socialist Review 30(1), 1969.",
    context:
      "A demand for reform of the penal system, alongside improvement of food, medical care and working conditions.",
    qualifications: [
      "Matched to later international codification against cruel punishment, not to the first local abolition of whipping.",
    ],
  });
  f(
    "kollontai",
    "Alexandra Kollontai",
    1872,
    1952,
    "socialist",
    "#914556",
    "Russia; Marxist feminism",
    "https://www.britannica.com/biography/Aleksandra-Mikhaylovna-Kollontay",
    "Major socialist theorist of women’s emancipation and the family.",
    "central",
  );
  e({
    id: "kollontai-women",
    person: "kollontai",
    domain: "women",
    title: "Equality within the family",
    summary: "Kollontai argues that women’s domestic subordination must end.",
    year: 1920,
    milestone: "women-equality",
    quote:
      "No more domestic bondage for women. No more inequality within the family.",
    locator:
      "Concluding section, paragraph beginning “The workers’ state needs”",
    work: "Communism and the Family",
    url: "https://www.marxists.org/archive/kollonta/1920/communism-family.htm",
    language: "Russian",
    translation:
      "Alix Holt, Selected Writings of Alexandra Kollontai, Allison & Busby, 1977.",
    edition:
      "Originally Komunistka no. 2, 1920; also published in English in The Worker, 1920.",
    context:
      "She connects equality to social provision of domestic work, economic independence and a transformed communist family.",
    qualifications: [
      "The benchmark concerns legal sex equality; her proposal extends to economic and domestic institutions.",
    ],
  });
  f(
    "rousseau",
    "Jean-Jacques Rousseau",
    1712,
    1778,
    "liberal",
    "#257c83",
    "Geneva / France; republican freedom and the social contract",
    "https://plato.stanford.edu/entries/rousseau/",
    "A central social-contract and republican theorist. The broad rights-based family includes republican branches; it does not imply modern liberalism in every respect.",
    "central",
  );
  e({
    id: "rousseau-slavery",
    person: "rousseau",
    domain: "slavery",
    title: "Slavery cannot create a legitimate right",
    summary: "Rousseau denies the legitimacy of a right of slavery.",
    year: 1762,
    milestone: "abolition",
    quote:
      "The words slave and right contradict each other, and are mutually exclusive.",
    locator: "Book I, chapter IV, “Slavery”",
    work: "The Social Contract",
    sourceId: "rousseau-contract",
    url: "https://www.gutenberg.org/files/46333/46333-h/46333-h.htm",
    edition: "The Social Contract & Discourses, J. M. Dent, 1920.",
    language: "French",
    translation: "G. D. H. Cole, 1920 edition.",
    context:
      "He considers both individual enslavement and a people’s alienation of liberty to a ruler.",
    qualified: true,
    qualifications: [
      "This is a theory of legitimate right, not a detailed legislative programme for ending colonial slavery.",
    ],
  });
  e({
    id: "rousseau-religion",
    person: "rousseau",
    domain: "religion",
    title: "Exclusion for rejecting the civil creed",
    summary:
      "Rousseau permits a state to banish people who reject its required civil religion.",
    year: 1762,
    milestone: "religious-freedom",
    stance: "opposes",
    quote: "it can banish from the State whoever does not believe them",
    locator: "Book IV, chapter VIII, “Civil Religion”",
    work: "The Social Contract",
    sourceId: "rousseau-contract",
    url: "https://www.gutenberg.org/files/46333/46333-h/46333-h.htm",
    language: "French",
    translation: "G. D. H. Cole, 1920 edition.",
    context:
      "“Them” refers to dogmas of civil faith designated by the sovereign as necessary social sentiments.",
    qualifications: [
      "He also endorses toleration of religions that tolerate others. The exclusion concerns the required civil creed.",
      "Opposition before the Virginia benchmark receives zero, not positive credit.",
    ],
  });
  f(
    "voltaire",
    "Voltaire",
    1694,
    1778,
    "liberal",
    "#40968c",
    "France; Enlightenment toleration and natural law",
    "https://plato.stanford.edu/entries/voltaire/",
    "Major Enlightenment advocate of toleration, placed in the natural-rights branch on the basis of the argument itself.",
    "central",
  );
  e({
    id: "voltaire-religion",
    person: "voltaire",
    domain: "religion",
    title: "Rejecting a right of religious intolerance",
    summary: "Voltaire rejects persecution in the name of religious belief.",
    year: 1763,
    milestone: "religious-freedom",
    quote: "The supposed right of intolerance is absurd and barbaric.",
    locator: "“Whether Intolerance Is of Natural and Human Law”, p. 31",
    work: "Treatise on Toleration",
    url: "https://www.gutenberg.org/files/64858/64858-h/64858-h.htm",
    edition:
      "Toleration and Other Essays, G. P. Putnam’s Sons, 1912; selected and abridged translation.",
    language: "French",
    translation: "Joseph McCabe, 1912.",
    context:
      "The section argues that human law must accord with natural law and reciprocal restraint.",
    qualifications: [
      "The translator discloses omissions elsewhere in this edition.",
      "Toleration here does not establish an egalitarian view on every other issue.",
    ],
  });
  f(
    "paine",
    "Thomas Paine",
    1737,
    1809,
    "liberal",
    "#3e9d9c",
    "Britain / America / France; natural rights and deism",
    "https://plato.stanford.edu/entries/paine/",
    "A major natural-rights writer, with explicit arguments for freedom of conscience.",
    "central",
  );
  e({
    id: "paine-religion",
    person: "paine",
    domain: "religion",
    title: "An equal right to religious belief",
    summary: "Paine asserts others’ equal right to beliefs he rejects.",
    year: 1794,
    milestone: "religious-freedom",
    quote: "they have the same right to their belief as I have to mine.",
    locator: "Part I, chapter I, “The Author’s Profession of Faith”",
    work: "The Age of Reason",
    url: "https://www.gutenberg.org/cache/epub/3743/pg3743-images.html",
    edition:
      "The Writings of Thomas Paine, Volume IV, edited by Moncure Daniel Conway.",
    context:
      "Immediately after criticizing churches, Paine distinguishes his criticism from a denial of believers’ rights.",
    qualifications: [
      "Later than the Virginia 1786 benchmark; support therefore earns zero lead years.",
    ],
  });
  f(
    "locke",
    "John Locke",
    1632,
    1704,
    "liberal",
    "#166b70",
    "England / Netherlands; natural rights and Protestant toleration",
    "https://plato.stanford.edu/entries/locke-political/",
    "Foundational liberal and natural-rights theorist; theological commitments are substantial but not treated as a second core membership without a separate classification review.",
    "foundational",
  );
  e({
    id: "locke-atheists",
    person: "locke",
    domain: "religion",
    title: "Withholding toleration from atheists",
    summary:
      "Locke excludes atheists from the toleration he otherwise defends.",
    year: 1689,
    milestone: "religious-freedom",
    stance: "opposes",
    quote: "those are not at all to be tolerated who deny the being of a God",
    locator: "Concluding exceptions to toleration, “Lastly” paragraph",
    work: "A Letter Concerning Toleration",
    url: "https://press-pubs.uchicago.edu/founders/print_documents/amendI_religions10.html",
    language: "Latin",
    translation:
      "English translation in The Founders’ Constitution, citing the Montuori edition; translator not identified on this excerpt.",
    context:
      "He argues that promises and oaths cannot bind an atheist. Other parts oppose coercion of religious belief.",
    dateBasis:
      "1689 publication proxy; the earlier composition of the Letter is not used as an exact date for this witness.",
    qualifications: [
      "This is one explicit exclusion, not a claim that Locke opposed all religious freedom.",
      "The matched benchmark prohibits civil disadvantage on account of religious opinion.",
    ],
    counter:
      "In the same letter Locke says people should not lose civil enjoyments because of religion, and rejects coercive conversion; the atheist exception limits that principle.",
  });
  f(
    "salt",
    "Henry S. Salt",
    1851,
    1939,
    "socialist",
    "#b56d79",
    "Britain; ethical socialism and humanitarian animal rights",
    "https://henrysalt.com/reformer/socialism/",
    "A committed ethical socialist and founder of the Humanitarian League; the rights argument also warrants mixed affiliation.",
    "established",
    [
      {
        traditionId: "liberal",
        status: "core",
        basis:
          "The primary text explicitly grounds animal protection in rights and justice.",
        sourceUrl: "https://www.gutenberg.org/files/64498/64498-h/64498-h.htm",
        branch: "Animal rights",
      },
    ],
  );
  e({
    id: "salt-animals",
    person: "salt",
    domain: "animals",
    title: "Extending rights to animals",
    summary:
      "Salt argues that animal interests cannot consistently be excluded from a system of rights.",
    year: 1922,
    milestone: "animal-protection",
    quote: "they cannot be consistently awarded to men and denied to animals",
    locator: "Chapter I, “The Principle of Animals’ Rights”, p. 19",
    work: "Animals’ Rights Considered in Relation to Social Progress",
    url: "https://www.gutenberg.org/files/64498/64498-h/64498-h.htm",
    edition: "Revised edition, G. Bell & Sons, 1922.",
    context:
      "“They” refers to rights; Salt appeals to the same justice and compassion in human and animal cases.",
    dateBasis:
      "Conservative date of the checked revised edition. The book first appeared in 1892; the exact earlier wording has not been collated.",
    qualifications: [
      "This is a documented 1922 reaffirmation, not a claim that Salt first held the view in 1922.",
      "A stronger animal-rights programme is matched only to the minimal animal-protection component.",
    ],
  });
  f(
    "singer",
    "Peter Singer",
    1946,
    undefined,
    "utilitarian",
    "#124ea2",
    "Australia / United States; preference and later hedonistic utilitarianism",
    "https://faculty.princeton.edu/people/peter-singer",
    "Major modern utilitarian and animal-ethics exponent.",
    "central",
  );
  e({
    id: "singer-animals",
    person: "singer",
    domain: "animals",
    title: "Suffering warrants consideration",
    summary:
      "Singer argues that a being’s suffering must count regardless of species.",
    year: 1976,
    milestone: "animal-protection",
    quote:
      "If a being suffers, there can be no moral justification for refusing to take that suffering into consideration.",
    locator:
      "“All Animals Are Equal”, PDF p. 4, paragraph discussing a stone and a mouse",
    work: "All Animals Are Equal — anthology version",
    url: "https://cafepublicintellectual.wordpress.com/wp-content/uploads/2018/03/singer.pdf",
    edition:
      "Excerpt associated with Animal Rights and Human Obligations, edited by Tom Regan and Peter Singer, 1976; the witness cites Animal Liberation (1975).",
    context:
      "Equal consideration of comparable interests does not mean identical treatment of beings with different interests.",
    dateBasis:
      "1976 anthology-version proxy. An article with this title appeared in Philosophic Exchange in 1974; this later witness is not backdated to that article.",
    qualified: true,
    qualifications: [
      "The linked teaching excerpt omits its title page; version metadata should be checked against a complete anthology before a critical edition.",
      "No lead credit depends on the difference between 1974 and 1976 for the selected benchmark.",
    ],
  });
  f(
    "korsgaard",
    "Christine Korsgaard",
    1952,
    undefined,
    "kantian",
    "#945aaa",
    "United States; Kantian constructivism",
    "https://philosophy.fas.harvard.edu/people/christine-korsgaard",
    "Major Kantian moral philosopher; the primary essay explicitly develops Kant’s Formula of Humanity.",
    "central",
  );
  e({
    id: "korsgaard-animals",
    person: "korsgaard",
    domain: "animals",
    title: "Direct obligations to other animals",
    summary:
      "Korsgaard argues that Kantian moral reasoning can ground obligations directly to animals.",
    year: 2004,
    milestone: "animal-protection",
    quote:
      "reflection on the argument for the Formula of Humanity can show us why we have obligations to the other animals.",
    locator:
      "Section 5, final paragraph before “The Natural Good and the Grounds of Legislation”",
    work: "Fellow Creatures: Kantian Ethics and Our Duties to Animals",
    url: "https://dash.harvard.edu/entities/publication/73120378-83c7-6bd4-e053-0100007fdf3b",
    edition:
      "Tanner Lectures on Human Values 24, pp. 77–110; Harvard DASH dates the publication 2004 and provides the PDF.",
    context:
      "She distinguishes direct duties from Kant’s indirect-duty argument, in which cruelty damages one’s duties to humans.",
    qualifications: [
      "This records the 2004 written lecture text, not the date of her later 2018 book.",
      "Her view intentionally revises a familiar exclusion in Kant’s own account.",
    ],
  });
  f(
    "nussbaum",
    "Martha Nussbaum",
    1947,
    undefined,
    "virtue",
    "#6d79a4",
    "United States; Aristotelian capabilities and political liberalism",
    "https://holbergprize.org/en/holberg-prize/laureates/martha-c-nussbaum",
    "The capabilities approach draws substantially on Aristotelian flourishing. This branch is not an assertion that Nussbaum endorses all versions of virtue ethics.",
    "central",
    [
      {
        traditionId: "liberal",
        status: "core",
        basis:
          "Her capabilities approach is also explicitly a liberal political theory of entitlements.",
        sourceUrl:
          "https://www.law.uchicago.edu/news/justice-animals-practical-progress-through-philosophical-theory",
        branch: "Capabilities / political liberalism",
      },
    ],
  );
  e({
    id: "nussbaum-farmed",
    person: "nussbaum",
    domain: "farmed",
    title: "Factory farming as an injustice",
    summary:
      "Nussbaum treats the suffering imposed by factory farming as an issue of justice.",
    year: 2021,
    milestone: "farm-welfare",
    quote:
      "Animals suffer injustice at our hands: the cruelties of the factory farming industry",
    locator:
      "Opening paragraph of the author’s Holberg Lecture text, posted 29 June 2021",
    work: "Justice for Animals: Practical Progress through Philosophical Theory",
    url: "https://www.law.uchicago.edu/news/justice-animals-practical-progress-through-philosophical-theory",
    context:
      "The university reproduces her written lecture, developing capabilities as the normative basis for protection.",
    qualifications: [
      "This is a securely dated later expression; her earlier animal-justice writing requires separate collation.",
      "Her view demands more than the minimal statutory farm-welfare benchmark; only the common protection component is scored.",
    ],
  });
  f(
    "paul-iii",
    "Pope Paul III",
    1468,
    1549,
    "christian",
    "#9f6656",
    "Rome; Catholic magisterial teaching",
    "https://www.britannica.com/biography/Paul-III",
    "An influential Counter-Reformation pope; this is an authoritative ethical teaching issued under his name, not merely nominal membership.",
    "central",
  );
  e({
    id: "paul-iii-slavery",
    person: "paul-iii",
    domain: "slavery",
    title: "Rejecting enslavement of Indigenous peoples",
    summary:
      "Paul III declares that the peoples described in the bull must not be enslaved.",
    year: 1537,
    quote:
      "nor should they be in any way enslaved; should the contrary happen, it shall be null and have no effect.",
    locator: "Sublimis Deus, final substantive paragraph",
    work: "Sublimis Deus",
    url: "https://catholiclibrary.org/library/view?chunk.id=0000001&docId=Magisterium-EN%2F755ece29-57aa-4508-9a09-772c0d7d4a16.html",
    language: "Latin",
    translation:
      "English translation in Catholic Library; translator not specified.",
    context:
      "The bull concerns Indigenous peoples and other peoples who may come to the knowledge of Christians, alongside evangelization.",
    qualified: true,
    qualifications: [
      "No universal abolition benchmark is assigned: this prohibition has a specified scope and does not establish opposition to every form of slavery.",
      "A papal document issued under his authority is not proof of sole personal drafting.",
    ],
    match:
      "Unscored because a prohibition covering named peoples is not equivalent to the benchmark’s general legal abolition.",
  });
  f(
    "wesley",
    "John Wesley",
    1703,
    1791,
    "christian",
    "#c07959",
    "Britain; Methodist Christian ethics",
    "https://www.britannica.com/biography/John-Wesley",
    "Founder of Methodism; the tract connects liberty and mercy to the revealed law of God.",
    "foundational",
  );
  e({
    id: "wesley-slavery",
    person: "wesley",
    domain: "slavery",
    title: "Liberty belongs to every human being",
    summary: "Wesley condemns hereditary slavery and urges emancipation.",
    year: 1774,
    milestone: "abolition",
    quote:
      "Liberty is the right of every human creature, as soon as he breathes the vital air",
    locator: "Section V, paragraph 6",
    work: "Thoughts Upon Slavery",
    url: "https://msa.maryland.gov/megafile/msa/speccol/sc5300/sc5339/000091/000000/000001/restricted/2002_09_10/wesley/thoughtsuponslavery.html",
    edition:
      "The Works of John Wesley, edited by Thomas Jackson, 1872, vol. XI, pp. 59–79; Maryland State Archives transcription.",
    context:
      "Wesley addresses inherited slaveholders and argues that neither purchase nor birth can justify human ownership.",
    qualifications: [
      "The tract substantially adapts Anthony Benezet. Authored endorsement is evidence of Wesley’s position, not a claim of independent invention.",
    ],
  });
  f(
    "tolstoy",
    "Leo Tolstoy",
    1828,
    1910,
    "christian",
    "#89513e",
    "Russia; dissident Christian nonviolence",
    "https://www.britannica.com/biography/Leo-Tolstoy",
    "Influential interpreter of Christian nonviolence and moral self-discipline; a dissident, not an Orthodox doctrinal representative.",
    "established",
  );
  e({
    id: "tolstoy-farmed",
    person: "tolstoy",
    domain: "farmed",
    title: "The moral objection to eating animals",
    summary:
      "Tolstoy argues that a sincere moral life should begin by abstaining from animal food.",
    year: 1892,
    milestone: "farm-welfare",
    quote:
      "its use is directly immoral, since it demands an act which is contrary to our moral sense, — murder",
    locator: "Section X, PDF p. 24",
    work: "The First Step",
    url: "https://tolstoyarchive.org/Non-fiction/files/The%20First%20Step.pdf",
    language: "Russian",
    translation: "Leo Wiener; digital text identifies the essay as 1892.",
    context:
      "“Its” refers to animal food. The essay describes slaughter and frames abstinence as Christian moral discipline.",
    qualified: true,
    qualifications: [
      "The position is more demanding than welfare regulation: the score matches its opposition to suffering in food production, not the entire demand for abstention.",
      "The 1892 date follows the witness; an earlier composition date has not been established here.",
    ],
  });
  f(
    "luther",
    "Martin Luther",
    1483,
    1546,
    "christian",
    "#a24632",
    "German lands; Lutheran Reformation",
    "https://www.britannica.com/biography/Martin-Luther",
    "Foundational Protestant theologian whose argument explicitly invokes Christian authority.",
    "foundational",
  );
  e({
    id: "luther-religion",
    revisionOf: "luther-religion-early",
    person: "luther",
    domain: "religion",
    title: "Persecution of Jewish religious life",
    summary:
      "Luther urges the destruction of Jewish places of worship and learning.",
    year: 1543,
    milestone: "religious-freedom",
    stance: "opposes",
    quote: "First, to set fire to their synagogues or schools",
    locator: "Part 11, first recommended measure",
    work: "On the Jews and Their Lies",
    url: "https://www.ccjr.us/dialogika-resources/primary-texts-from-the-history-of-the-relationship/luther-1543",
    language: "German",
    translation:
      "Martin H. Bertram, Luther’s Works, Fortress Press, 1971; excerpt reproduced by the Council of Centers on Jewish-Christian Relations.",
    context:
      "The passage is an explicit recommendation of religious persecution, framed as a Christian duty.",
    qualifications: [
      "Historical antisemitic writing is quoted for evidence of the position.",
      "Opposition before the selected benchmark scores zero under the agreed timing rule; zero is not moral approval.",
    ],
    counter:
      "His 1523 writing That Jesus Christ Was Born a Jew advocated different treatment while retaining conversion as its goal. The separate 1523 record supplies that earlier passage.",
  });
  f(
    "fell",
    "Margaret Fell",
    1614,
    1702,
    "christian",
    "#ce8b6c",
    "England; Quaker theology and women’s ministry",
    "https://plato.stanford.edu/entries/margaret-fell/",
    "A major early Quaker theologian who argues directly from scripture for women’s religious speech.",
    "central",
  );
  e({
    id: "fell-women",
    person: "fell",
    domain: "women",
    title: "Women may speak in the church",
    summary:
      "Fell defends women’s authority to preach when moved by the Spirit.",
    year: 1666,
    quote: "Christ is the Head of the Male and Female, who may speak",
    locator:
      "Concluding portion, paragraph beginning “But Christ, who is the Head of the Church”",
    work: "Womens Speaking Justified",
    url: "https://digital.library.upenn.edu/women/fell/speaking/speaking.html",
    edition:
      "London, 1666; University of Pennsylvania, A Celebration of Women Writers transcription.",
    context:
      "Her argument disputes readings of Pauline prohibitions on women’s speech through other scriptural passages.",
    qualified: true,
    qualifications: [
      "Women’s preaching is not the same reform as suffrage or general civil sex equality. This record is deliberately unscored.",
    ],
  });
  f(
    "king",
    "Martin Luther King Jr.",
    1929,
    1968,
    "christian",
    "#b17b64",
    "United States; Christian personalism and nonviolent civil rights",
    "https://kinginstitute.stanford.edu/personalism",
    "Christian personalism substantively shaped his moral reasoning; the letter explicitly draws on Augustine, Aquinas and the gospel.",
    "central",
  );
  e({
    id: "king-racial",
    person: "king",
    domain: "racial",
    title: "Segregation laws degrade personality",
    summary:
      "King argues that segregation statutes are unjust and should be resisted.",
    year: 1963,
    end: 1964,
    publication: 1963,
    publicationEnd: 1964,
    milestone: "racial-equality",
    quote:
      "All segregation statutes are unjust because segregation distorts the soul and damages the personality.",
    locator: "Paragraph 16 in the numbered Hanover excerpt",
    work: "Letter from Birmingham Jail",
    url: "https://history.hanover.edu/courses/excerpts/111mlk2.html",
    context:
      "He distinguishes just from unjust laws through human personality and natural law, explaining why nonviolent disobedience is warranted.",
    dateBasis:
      "Letter dated 16 April 1963; this witness includes the author’s note on polishing the text for publication. The 1963–1964 interval preserves uncertainty between the letter and its book version.",
    qualified: true,
    qualifications: [
      "This is a later documented expression, not the origin of King’s opposition to segregation.",
      "The interval includes revision and publication uncertainty rather than pretending this witness is an autograph.",
    ],
  });
  f(
    "prabhupada",
    "A. C. Bhaktivedanta Swami Prabhupada",
    1896,
    1977,
    "hindu",
    "#ce8847",
    "India / United States; Gaudiya Vaishnava ethics",
    "https://www.britannica.com/biography/A-C-Bhaktivedanta",
    "Founder of ISKCON and influential commentator in the Gaudiya Vaishnava tradition.",
    "central",
  );
  e({
    id: "prabhupada-execution",
    person: "prabhupada",
    domain: "execution",
    title: "Capital punishment as beneficial to the offender",
    summary:
      "Prabhupada defends execution of a murderer through a karmic account of justice.",
    year: 1972,
    milestone: "execution-abolition",
    stance: "opposes",
    quote:
      "the king’s punishment of hanging a murderer is actually beneficial.",
    locator: "Bhagavad-gītā As It Is, 2.21, author’s purport",
    work: "Bhagavad-gītā As It Is — commentary",
    url: "https://www.vanisource.org/wiki/BG_2.21_%281972%29",
    edition:
      "1972 complete edition; Vanisource transcription of the author’s English purport.",
    context:
      "This is the modern commentator’s prose, not a quotation attributed to the ancient author of the Gītā.",
    qualifications: [
      "The British abolition window was still in progress in 1972, producing a lag range that includes zero.",
      "A global comparison against a British reference does not describe the law in India.",
    ],
  });
  f(
    "pigliucci",
    "Massimo Pigliucci",
    1964,
    undefined,
    "stoic",
    "#4a7f68",
    "Italy / United States; modern secular Stoicism",
    "https://massimopigliucci.net/stoicism/",
    "A recognized modern Stoic writer who explicitly reconstructs Stoic practical ethics from contemporary evidence.",
    "established",
  );
  e({
    id: "pigliucci-farmed",
    person: "pigliucci",
    domain: "farmed",
    title: "A modern Stoic case for vegetarianism",
    summary:
      "Pigliucci argues that modern Stoic reasoning favors vegetarianism to reduce suffering.",
    year: 2018,
    milestone: "farm-welfare",
    quote: "we, as Stoics, ought to be vegetarians.",
    locator: "Conclusion, posted 14 July 2018",
    work: "Should a Modern Stoic Be Vegetarian?",
    url: "https://modernstoicism.com/should-a-modern-stoic-be-vegetarian-by-massimo-pigliucci/",
    context:
      "He explicitly acknowledges that ancient Stoic teachings did not generally prohibit eating animals, then uses reason and contemporary evidence to revise the practical conclusion.",
    qualified: true,
    qualifications: [
      "The argument is a modern revision, not evidence that ancient Stoics endorsed this conclusion.",
      "Only the common concern for suffering in food production is matched to the welfare benchmark.",
    ],
  });
  f(
    "mahapragya",
    "Acharya Mahapragya",
    1920,
    2010,
    "jain",
    "#82983e",
    "India; Jain Terapanth ethics and nonviolence",
    "https://jainworld.com/philosophy/ahimsa-non-violence/non-violence-and-its-many-facets-introduction/",
    "Leader and prolific ethical teacher of the Terapanth Jain tradition; substantive nonviolence reasoning is explicit in the authored work.",
    "central",
  );
  e({
    id: "mahapragya-animals",
    person: "mahapragya",
    domain: "animals",
    title: "Nonviolence beyond social convenience",
    summary:
      "Mahapragya argues that each living being’s experience of pain creates duties of nonviolence.",
    year: 1994,
    milestone: "animal-protection",
    quote:
      "we must never inflict any pain on them, never oppress and exploit them, never rob them of their rights",
    locator:
      "Chapter 1, “Our Life Style and Non-violence”, spiritual nonviolence discussion",
    work: "Non-Violence and Its Many Facets",
    url: "https://jainworld.jainworld.com/phil/ahimsa/nonvilncchp1.htm",
    edition:
      "Jain Vishva Bharati, second edition, January 1994; title-page metadata available in Jainworld’s introduction.",
    language: "Hindi",
    translation: "R. P. Bhatnagar.",
    context:
      "“Them” refers to every living being, recognized as subject to pleasure and pain as we are.",
    dateBasis:
      "1994 checked-edition proxy. The underlying lectures and first edition have not yet been dated in this corpus.",
    qualifications: [
      "His religious argument includes living beings more broadly than the sentient animals covered by the British statutes.",
      "No claim is made that he first adopted this view in 1994.",
    ],
  });
  f(
    "wang",
    "Wang Yangming",
    1472,
    1529,
    "confucian",
    "#968553",
    "Ming China; Neo-Confucian learning of the mind",
    "https://plato.stanford.edu/entries/wang-yangming/",
    "A defining Neo-Confucian philosopher; this text develops humanity as forming one body with other beings.",
    "foundational",
  );
  e({
    id: "wang-animals",
    person: "wang",
    domain: "animals",
    title: "Compassion across species",
    summary:
      "Wang describes distress at animals’ slaughter as an expression of shared humanity.",
    year: 1527,
    publication: 1527,
    publicationEnd: 1572,
    quote: "his humanity forms one body with birds and animals.",
    locator:
      "Inquiry on the Great Learning, opening question; Source Book pp. 659–660",
    work: "Inquiry on the Great Learning",
    url: "https://faculty.washington.edu/qing/yang-ming_dynamic_idealism_in_wang_yang-ming%5B1%5D.pdf",
    edition:
      "Wing-tsit Chan, A Source Book in Chinese Philosophy, section “Dynamic Idealism in Wang Yang-ming”; university-hosted extract.",
    language: "Classical Chinese",
    translation: "Wing-tsit Chan, Princeton University Press, 1963.",
    dateBasis:
      "Chan’s introduction dates the written Inquiry to about 1527. Publication/circulation is bounded conservatively by composition and the 1572 collected edition listed in SEP; the exact first printing is unresolved.",
    context:
      "The preceding sentence describes hearing the cries and seeing the fear of animals about to be slaughtered.",
    qualified: true,
    qualifications: [
      "Compassion does not by itself establish opposition to slaughter or a proposal for statutory welfare protection. The passage is retained unscored.",
      "The text also extends one-body concern to plants, tiles and stones; it is not simply a sentience-based theory.",
    ],
  });
  f(
    "dalai-lama",
    "Tenzin Gyatso, 14th Dalai Lama",
    1935,
    undefined,
    "buddhist",
    "#b58b2a",
    "Tibet / India; Tibetan Buddhist compassion and nonviolence",
    "https://www.dalailama.com/the-dalai-lama/biography-and-daily-life/brief-biography",
    "Major Tibetan Buddhist ethical teacher; the statement explicitly invokes compassion and nonviolence.",
    "central",
  );
  e({
    id: "dalai-autonomy",
    person: "dalai-lama",
    domain: "colonial",
    title: "Rights and autonomy for Tibetans",
    summary:
      "The Dalai Lama advocates a negotiated political solution securing Tibetan rights within China.",
    year: 1999,
    quote:
      "a political solution that ensures the basic rights and freedoms of the Tibetan people",
    locator:
      "Statement dated 10 March 1999, paragraph on the “Middle Way Approach”",
    work: "Statement on the Fortieth Anniversary of the Tibetan National Uprising Day",
    url: "https://www.dalailama.com/messages/tibet/10th-march-archive/1999",
    language:
      "Official English version; original drafting language not identified",
    translation:
      "English statement published by the Office of His Holiness; translator not identified.",
    context:
      "He explicitly disclaims a demand for separation from China and connects preservation of Tibetan spiritual heritage to compassion and nonviolence.",
    qualified: true,
    qualifications: [
      "Autonomy within an existing state is not identical to the selected decolonization benchmark. This position remains unscored.",
      "This is a public written statement issued under his name, not evidence of sole personal drafting.",
    ],
  });
  f(
    "maududi",
    "Abul A‘la Maududi",
    1903,
    1979,
    "islamic",
    "#397751",
    "British India / Pakistan; Islamic political and moral thought",
    "https://www.britannica.com/biography/Abu-al-Ala-al-Mawdudi",
    "An influential theorist of modern political Islam. These claims are derived explicitly from divine authority and Islamic ethics.",
    "central",
  );
  e({
    id: "maududi-racial",
    person: "maududi",
    domain: "racial",
    title: "Rejecting distinctions of race and nationality",
    summary:
      "Maududi argues for equality regardless of colour, race or nationality.",
    year: 1976,
    milestone: "racial-equality",
    quote:
      "Islam not only recognizes absolute equality between men irrespective of any distinction of colour, race or nationality",
    locator: "Chapter 2, “Equality of Human Beings”, opening sentence",
    work: "Human Rights in Islam",
    url: "https://al-islam.org/al-tawhid/vol-4-n-3/human-rights-islam-syed-abul-ala-mawdudi/chapter-2-basic-human-rights",
    edition:
      "Book first published by the Islamic Foundation, 1976; this text reproduced in al-Tawhid IV(3), 1407 AH / 1987.",
    language: "Urdu addresses; published in English translation",
    translation:
      "English text in al-Tawhid; translator not named on this online witness.",
    context:
      "The author distinguishes piety from inherited racial superiority and argues that even greater piety does not confer privileged rights.",
    qualified: true,
    qualifications: [
      "1976 is the publication-year proxy for the work; the linked witness is a later reprint.",
      "His claims about the histories of Islam, the West and Judaism elsewhere in the chapter are polemical assertions and are not adopted as historical facts here.",
    ],
    counter:
      "The same chapter defends particular religiously authorized punishments and historical rules for war captives. Universal racial equality must not be read as endorsement of every modern right.",
  });
  f(
    "engels",
    "Friedrich Engels",
    1820,
    1895,
    "socialist",
    "#844451",
    "Germany / Britain; Marxist theory",
    "https://www.britannica.com/biography/Friedrich-Engels",
    "Co-founder of Marxist theory and coauthor of the Manifesto.",
    "foundational",
  );
  for (const person of ["marx", "engels"])
    e({
      id: `${person}-children`,
      person,
      domain: "children",
      title: "Ending exploitative factory labour by children",
      summary:
        "Marx and Engels demand an end to the contemporary form of child factory labour, together with public education.",
      year: 1848,
      milestone: "child-protection",
      quote: "Abolition of children’s factory labour in its present form.",
      locator: "Chapter II, programme point 10",
      work: "Manifesto of the Communist Party",
      author: "Karl Marx and Friedrich Engels",
      sourceId: "communist-manifesto",
      url: "https://www.marxists.org/archive/marx/works/1848/communist-manifesto/ch02.htm",
      language: "German",
      translation:
        "Samuel Moore, in cooperation with Engels, 1888 English edition; MIA transcription.",
      context:
        "The same programme combines education with industrial production, so this is not a prohibition of every kind of work by minors.",
      qualifications: [
        "The existing British Factory Acts benchmark precedes this writing; the default lead is zero.",
        "Both authors share one quotation and source; this is joint authorship, not two independent discoveries.",
      ],
    });
  e({
    id: "nussbaum-marriage",
    person: "nussbaum",
    domain: "marriage",
    title: "An equal right to marry",
    summary:
      "Nussbaum argues for extending civil marriage to same-sex couples.",
    year: 2009,
    milestone: "marriage-equality",
    quote:
      "if two people want to make a commitment of the marital sort, they should be permitted to do so",
    locator:
      "Paragraph immediately before “What Is the Right to Marry?”; Summer 2009",
    work: "A Right to Marry? Same-Sex Marriage and Constitutional Law",
    url: "https://dissentmagazine.org/article/a-right-to-marry-same-sex-marriage-and-constitutional-law/",
    context:
      "The sentence expressly states the argument for same-sex marriage, after examining objections and the analogy to interracial marriage.",
    qualifications: [
      "The 2001–2015 reference spans two named jurisdictions, not a claim of simultaneous adoption throughout the West.",
      "This essay preceded her 2010 book From Disgust to Humanity.",
    ],
  });
  e({
    id: "luther-religion-early",
    person: "luther",
    domain: "religion",
    title: "Kindness as a means of religious conversion",
    summary:
      "In 1523 Luther favors brotherly treatment of Jews while explicitly aiming at their conversion.",
    year: 1523,
    quote:
      "we in our turn ought to treat the Jews in a brotherly manner in order that we might convert some of them.",
    locator: "Section 2 of the CCJR excerpt",
    work: "That Jesus Christ Was Born a Jew",
    url: "https://www.ccjr.us/dialogika-resources/primary-texts-from-the-history-of-the-relationship/luther-1523",
    language: "German",
    translation:
      "English translation reproduced by CCJR; translator and print edition not supplied on this excerpt page.",
    context:
      "He criticizes seizure of property and restrictions on work and fellowship; the kindness he advocates remains conversion-oriented.",
    qualified: true,
    qualifications: [
      "Unscored: this tactical and religious appeal does not establish a general right to religious liberty.",
      "Compare his explicit programme of persecution in 1543. The two records preserve the change without presenting early Luther as a modern pluralist.",
    ],
  });
}
