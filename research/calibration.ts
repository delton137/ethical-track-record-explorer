import { evidence as e, figure as f } from "./evidence";

export function calibration() {
  f(
    "bentham",
    "Jeremy Bentham",
    1748,
    1832,
    "utilitarian",
    "#2466c5",
    "England; legal reform and classical utilitarianism",
    "https://plato.stanford.edu/entries/bentham/",
    "A foundational exponent of the principle of utility.",
    "foundational",
  );
  e({
    id: "bentham-animals",
    person: "bentham",
    domain: "animals",
    title: "The capacity to suffer",
    summary:
      "Animal suffering deserves moral consideration independently of language or reasoning.",
    year: 1789,
    milestone: "animal-protection",
    quote:
      "the question is not, Can they reason? nor, Can they talk? but, Can they suffer?",
    locator: "Chapter XVII, §1, IV, footnote",
    work: "An Introduction to the Principles of Morals and Legislation",
    url: "https://constitution.org/2-Authors/jb/pml_17.htm",
    edition: "First publication 1789; chapter transcription.",
    context:
      "Bentham compares exclusions imposed on animals with those imposed on enslaved people, asking which capacities could justify denying protection.",
    qualifications: [
      "He permits killing and eating animals under stated conditions. This is not evidence of vegetarianism or equal rights in every respect.",
      "The work was printed earlier, but this record conservatively uses first publication in 1789.",
    ],
    counter:
      "The same footnote permits killing animals where Bentham thinks their loss is outweighed by human benefit; that qualification is retained.",
  });
  e({
    id: "bentham-gay",
    person: "bentham",
    domain: "gay",
    title: "Against punishing consensual relations",
    summary:
      "Bentham finds no utilitarian justification for criminal punishment of consensual male same-sex relations.",
    year: 1785,
    publication: 1978,
    private: true,
    milestone: "decriminalization",
    quote: "Hitherto we have found no reason for punishing it at all",
    locator:
      "Digital transcription p. 3, “Reasons that have commonly been assigned”",
    work: "Offences Against One’s Self: Paederasty",
    url: "https://www.columbia.edu/cu/lweb/eresources/exhibitions/sw25/bentham/bentham_offences_1785.pdf",
    edition:
      "Louis Crompton, Journal of Homosexuality, 1978; Columbia University Libraries transcription.",
    context:
      "The preceding page expressly distinguishes willing partners from coercion and rape.",
    dateBasis:
      "The scholarly editor dates the manuscript to about 1785; the one-year placement is conventional, not day-level precision.",
    qualifications: [
      "Private manuscript; first published in 1978. Excluded by the public-writings-only filter.",
      "The historical title and language are not modern identity categories.",
    ],
    counter:
      "His disapproving vocabulary coexists with an explicit argument against criminalization; moral approval and decriminalization are distinguished.",
  });
  f(
    "mill",
    "John Stuart Mill",
    1806,
    1873,
    "utilitarian",
    "#3e82d2",
    "Britain; utilitarian liberal reform",
    "https://plato.stanford.edu/entries/mill/",
    "Major systematic utilitarian and liberal philosopher.",
    "foundational",
    [
      {
        traditionId: "liberal",
        status: "core",
        basis:
          "Substantial liberal argument in On Liberty and writings on representation.",
        sourceUrl: "https://plato.stanford.edu/entries/mill/",
      },
    ],
  );
  e({
    id: "mill-women",
    person: "mill",
    domain: "women",
    title: "A principle of perfect equality",
    summary:
      "Mill rejects the legal subordination of women and advocates equal standing.",
    year: 1869,
    milestone: "women-equality",
    quote: "the legal subordination of one sex to the other—is wrong in itself",
    locator: "Chapter I, opening paragraph",
    work: "The Subjection of Women",
    url: "https://www.gutenberg.org/cache/epub/27083/pg27083-images.html",
    context:
      "The opening explicitly calls for equality without male privilege or female disability.",
    qualifications: [
      "The benchmark concerns later anti-discrimination laws; it does not imply that every component of Mill’s proposal was enacted together.",
    ],
  });
  e({
    id: "mill-execution",
    person: "mill",
    domain: "execution",
    title: "Retaining capital punishment",
    summary:
      "Mill identifies his opposition to a motion to abolish capital punishment in his own written autobiography.",
    year: 1873,
    stance: "opposes",
    milestone: "execution-abolition",
    quote: "against the motion for the abolition of capital punishment",
    locator: "Chapter VII; paragraph beginning “Several of my speeches”",
    work: "Autobiography",
    url: "https://www.gutenberg.org/files/10378/10378-h/10378-h.htm",
    context:
      "He describes this position as differing from advanced liberal opinion and then discusses his support for women’s suffrage.",
    qualified: true,
    qualifications: [
      "This is a retrospective written account of his parliamentary position, not the transcript of the speech.",
      "1873 is the publication proxy; the original parliamentary intervention was in 1868.",
      "This writing falls within the selected 1867–1998 adoption interval, so its opposition score spans negative lag and zero.",
    ],
    counter:
      "The same autobiographical passage records progressive positions on suffrage. Those views are kept separate from capital punishment.",
  });
  f(
    "woolman",
    "John Woolman",
    1720,
    1772,
    "christian",
    "#a65540",
    "Colonial New Jersey; Quaker Christianity",
    "https://www.britannica.com/biography/John-Woolman",
    "Quaker religious thinker and author whose antislavery argument expressly invokes Christian duties.",
    "central",
  );
  e({
    id: "woolman-slavery",
    person: "woolman",
    domain: "slavery",
    title: "The natural right of freedom",
    summary:
      "Purchasing an innocent person cannot extinguish their right to freedom or justify enslaving their descendants.",
    year: 1754,
    milestone: "abolition",
    quote:
      "If I purchase a Man who hath never forfeited his Liberty, the natural Right of Freedom is in him",
    locator: "Part I, p. 11 (scan page 16)",
    work: "Some Considerations on the Keeping of Negroes",
    url: "https://en.wikisource.org/wiki/Page:John_Woolman_-_Considerations_on_Keeping_Negroes_Part_1_(1754).djvu/16",
    edition:
      "Philadelphia: James Chattin, 1754; page-linked transcription; long-s normalized.",
    context:
      "The next clause questions keeping the purchased person and their posterity in servitude. The treatise invokes Christian reciprocity.",
    qualifications: [
      "The argument refers to persons who have not forfeited liberty; it should not be expanded into a claim about every form of forced labor.",
      "A later online transcription misdates the edition; the linked 1754 witness controls this record.",
    ],
  });
  f(
    "wollstonecraft",
    "Mary Wollstonecraft",
    1759,
    1797,
    "liberal",
    "#168789",
    "Britain; rights, republicanism and rational dissent",
    "https://plato.stanford.edu/entries/wollstonecraft/",
    "Major rights theorist whose argument extends rational moral and civic standing to women.",
    "central",
  );
  e({
    id: "wollstonecraft-suffrage",
    person: "wollstonecraft",
    domain: "suffrage",
    title: "Women ought to have representatives",
    summary:
      "Wollstonecraft argues for women’s direct participation in political representation.",
    year: 1792,
    milestone: "votes-for-women",
    quote:
      "women ought to have representatives, instead of being arbitrarily governed",
    locator: "Chapter IX",
    work: "A Vindication of the Rights of Woman",
    url: "https://www.gutenberg.org/cache/epub/3420/pg3420.html",
    context:
      "She criticizes government that allows women no direct share in deliberation, alongside the exclusion of working men.",
    qualifications: [
      "This passage supports representation; it does not specify a modern universal-franchise electoral system.",
    ],
  });
  f(
    "kant",
    "Immanuel Kant",
    1724,
    1804,
    "kantian",
    "#7848a0",
    "Prussia; critical philosophy and deontological ethics",
    "https://plato.stanford.edu/entries/kant-moral/",
    "Foundational author of Kantian moral philosophy.",
    "foundational",
  );
  e({
    id: "kant-execution",
    person: "kant",
    domain: "execution",
    title: "Execution as a requirement of justice",
    summary:
      "Kant argues that the murderer must be executed as a requirement of retributive justice.",
    year: 1797,
    stance: "opposes",
    milestone: "execution-abolition",
    quote: "But whoever has committed murder, must die.",
    locator:
      "Doctrine of Right, General Remark E, “The Right of Punishing” (Ak. 6:333)",
    work: "The Metaphysics of Morals: Doctrine of Right",
    url: "https://www.marxists.org/reference/subject/ethics/kant/morals/ch04.htm",
    language: "German",
    translation:
      "English translation of the Science of Right reproduced by Marxists Internet Archive; compare W. Hastie’s translation.",
    context:
      "Kant rejects a substitute penalty as proportionate to murder, while also objecting to degrading mistreatment during execution.",
    sourceId: "kant-right",
    qualifications: [
      "The mirror labels the text 1790 incorrectly. The work was published in 1797 (Cambridge edition bibliographic confirmation).",
      "The selected British benchmark is later than this writing: opposition scores zero under the agreed rule.",
    ],
    counter:
      "The same discussion disallows degrading maltreatment and considers difficult exceptional cases; retention of execution does not imply support for every cruel punishment.",
  });
  e({
    id: "kant-women",
    person: "kant",
    domain: "suffrage",
    title: "Women excluded from active citizenship",
    summary:
      "Kant includes all women among persons lacking the independence required for active citizenship.",
    year: 1797,
    stance: "opposes",
    milestone: "votes-for-women",
    quote: "all women, … are without civil personality",
    locator: "Doctrine of Right, §46 (Ak. 6:314–315)",
    work: "The Metaphysics of Morals: Doctrine of Right",
    url: "https://www.marxists.org/reference/subject/ethics/kant/morals/ch04.htm",
    language: "German",
    translation: "English translation reproduced by Marxists Internet Archive.",
    sourceId: "kant-right",
    context:
      "The passage distinguishes active from passive citizenship and excludes women alongside dependent workers and minors.",
    qualifications: [
      "The ellipsis omits other categories and the general dependency criterion; it does not omit an exception for women.",
      "Passive citizens retain other rights; this is a political-participation exclusion.",
    ],
  });
  f(
    "beccaria",
    "Cesare Beccaria",
    1738,
    1794,
    "utilitarian",
    "#568fce",
    "Milan; Enlightenment penal reform",
    "https://www.britannica.com/biography/Cesare-Beccaria",
    "Penal reform combines arguments from social contract and public utility; a precursor of utilitarian reform.",
    "central",
    [
      {
        traditionId: "liberal",
        status: "contested",
        basis:
          "The work also invokes the social contract and limits on sovereign rights; classification overlaps.",
        sourceUrl:
          "https://constitutioncenter.org/the-constitution/historic-document-library/detail/cesare-bonesana-di-beccariaon-crimes-and-punishments-1764",
      },
    ],
  );
  e({
    id: "beccaria-torture",
    person: "beccaria",
    domain: "torture",
    title: "Torture cannot establish guilt",
    summary:
      "Beccaria rejects torture used to elicit confessions, including its infliction on the legally innocent.",
    year: 1764,
    milestone: "torture-ban",
    quote: "if he be not guilty, you torture the innocent",
    locator: "Chapter XVI, Of Torture",
    work: "On Crimes and Punishments",
    url: "https://www.laits.utexas.edu/poltheory/beccaria/delitti/delitti.c16.html",
    sourceId: "beccaria-crimes",
    language: "Italian",
    translation:
      "Historical English translation in the University of Texas political-theory archive; translator not specified on chapter page.",
    context:
      "He argues that guilt should be proved before punishment and that pain is no test of truth.",
    qualifications: [
      "Comparison is to international codification in 1948–1984; several states curtailed judicial torture much earlier.",
    ],
  });
  e({
    id: "beccaria-execution",
    person: "beccaria",
    domain: "execution",
    title: "Against ordinary use of the death penalty",
    summary:
      "Beccaria argues against execution as a normal criminal penalty, with an exceptional political necessity proviso.",
    year: 1764,
    milestone: "execution-abolition",
    quote: "the punishment of death is not authorised by any right",
    locator: "Chapter XXVIII, Of the Punishment of Death",
    work: "On Crimes and Punishments",
    url: "https://laits.utexas.edu/poltheory/beccaria/delitti/delitti.c28.html",
    sourceId: "beccaria-crimes-death",
    language: "Italian",
    translation:
      "Historical English translation in University of Texas archive.",
    context:
      "The subsequent paragraph considers an imprisoned citizen whose power threatens national security during upheaval.",
    qualified: true,
    qualifications: [
      "Qualified opposition: he permits an exceptional case involving threats to the state.",
      "His preferred alternative includes perpetual penal servitude; this is not a blanket rejection of harsh punishment.",
    ],
    counter:
      "The exception and endorsement of penal servitude are explicit in this chapter, and are retained here.",
  });
  f(
    "russell",
    "Bertrand Russell",
    1872,
    1970,
    "secular-humanist",
    "#647587",
    "Britain; analytic philosophy and secular humanism",
    "https://heritage.humanists.uk/bertrand-russell/",
    "His ethics of love and knowledge and documented work with the British Humanist Association and Cardiff Humanists establish a substantive humanist affiliation.",
    "central",
    [
      {
        traditionId: "utilitarian",
        status: "contested",
        basis:
          "Consequentialist elements in his ethics are substantial but do not by themselves establish an exclusive utilitarian identity.",
        sourceUrl: "https://plato.stanford.edu/entries/russell-moral/",
      },
    ],
  );
  e({
    id: "russell-extinction",
    person: "russell",
    domain: "extinction",
    title: "The survival of the human race",
    summary:
      "The manifesto calls for avoiding nuclear war because it could end the human race.",
    year: 1955,
    milestone: "extinction-concern",
    quote:
      "Shall we put an end to the human race; or shall mankind renounce war?",
    locator: "Paragraph beginning “Here, then, is the problem”",
    work: "Russell–Einstein Manifesto",
    url: "https://www.atomicarchive.com/resources/documents/deterrence/russell-einstein-manifesto.html",
    context:
      "The surrounding paragraphs explicitly discuss possible universal death rather than destruction of individual states.",
    qualifications: [
      "A collective manifesto drafted by Russell; Einstein and the other signatories are not all treated as its authors.",
      "Russell’s own account of drafting appears in The Early History of the Pugwash Movement (1962).",
      "The scientific risk estimate is a historical claim by the authors, not a current estimate endorsed by this explorer.",
    ],
  });
  f(
    "jonas",
    "Hans Jonas",
    1903,
    1993,
    undefined,
    "#596c7a",
    "Germany / United States; philosophical ethics of responsibility",
    "https://www.britannica.com/biography/Hans-Jonas",
    "",
    "central",
    [
      {
        traditionId: "existential",
        status: "contested",
        basis:
          "Phenomenological and existential background; his ethics of responsibility is a distinct development and should not be collapsed into utilitarianism.",
        sourceUrl: "https://www.britannica.com/biography/Hans-Jonas",
      },
    ],
  );
  e({
    id: "jonas-extinction",
    person: "jonas",
    domain: "extinction",
    title: "Responsibility for humanity’s continued existence",
    summary:
      "Jonas argues that technological power creates new ethical responsibilities for humanity’s future existence.",
    year: 1973,
    milestone: "extinction-concern",
    quote:
      "the perishing of the whole through the doings of man … has become a real possibility",
    locator: "Social Research 40(1), p. 42; PDF page 13",
    work: "Technology and Responsibility: Reflections on the New Tasks of Ethics",
    url: "https://www.bhaven.org/uploads/3/4/0/3/34038663/technology_and_responsibility__reflections_on_the_new_tasks_of_ethics.pdf",
    edition: "Social Research 40(1), Spring 1973, pp. 31–54.",
    context:
      "He says public laws must address this possibility so that there will be a world for coming generations.",
    qualified: true,
    qualifications: [
      "The extracted text is incomplete elsewhere in the scan. This excerpt comes from a complete paragraph on p. 42; uncertain nearby lines are not quoted.",
      "Framework classification is contested and receives a neutral author color.",
    ],
  });
  f(
    "parfit",
    "Derek Parfit",
    1942,
    2017,
    "utilitarian",
    "#194f9f",
    "Britain; population ethics and convergence between moral theories",
    "https://www.philosophy.ox.ac.uk/files/obituary-derekparfitpdf",
    "Substantial consequentialist and population-ethical reasoning; his later convergence project includes other traditions.",
    "central",
  );
  e({
    id: "parfit-extinction",
    person: "parfit",
    domain: "extinction",
    title: "The distinctive badness of extinction",
    summary:
      "Parfit argues that extinction is much worse than a catastrophe leaving humanity able to recover.",
    year: 1984,
    milestone: "extinction-concern",
    quote:
      "I believe that if we destroy mankind, as we now can, this outcome will be much worse than most people think.",
    locator: "Reasons and Persons, pp. 453–454; reproduced on PDF p. 1",
    work: "Reasons and Persons",
    url: "https://wmit-pages-prod.s3.amazonaws.com/wp-content/uploads/sites/283/2022/06/12151107/singularity.pdf",
    edition: "1984 book excerpt in a university teaching packet.",
    context:
      "He compares peace, a war killing 99% of humanity, and a war killing 100%, emphasizing the lost future.",
    qualifications: [
      "The passage gives both classical-utilitarian and non-utilitarian ideal-good arguments. It is not an avowal of exclusive classical utilitarianism.",
    ],
  });
  f(
    "leslie",
    "John Leslie",
    1940,
    undefined,
    "utilitarian",
    "#4275b0",
    "Canada / Britain; ideal utilitarianism and philosophy of extinction",
    "https://www.researchgate.net/profile/John-Leslie-3/publication/339055687_The_End_of_the_World_the_science_and_ethics_of_human_extinction/links/5f03db78299bf1881607ce0d/The-End-of-the-World-the-science-and-ethics-of-human-extinction.pdf",
    "The author labels his own position utilitarian, ideal utilitarian and consequentialist on typescript p. 213.",
    "established",
  );
  e({
    id: "leslie-extinction",
    person: "leslie",
    domain: "extinction",
    title: "No right to disregard extinction risks",
    summary:
      "Leslie argues that the stakes of human extinction require attention even when risk estimates are uncertain.",
    year: 1996,
    milestone: "extinction-concern",
    quote:
      "In view of how enormously much is at stake, we have no right to disregard them.",
    locator: "Author’s typescript p. 6 (not printed-book pagination)",
    work: "The End of the World: The Science and Ethics of Human Extinction",
    url: "https://www.researchgate.net/profile/John-Leslie-3/publication/339055687_The_End_of_the_World_the_science_and_ethics_of_human_extinction/links/5f03db78299bf1881607ce0d/The-End-of-the-World-the-science-and-ethics-of-human-extinction.pdf",
    edition: "Author-uploaded typescript of the 1996 book; uploaded in 2020.",
    context:
      "“Them” refers to human-extinction risks; the following discussion calls for risk-reduction efforts.",
    qualifications: [
      "The upload date is not the composition or original publication date.",
      "The book also defends the controversial doomsday argument; accepting that argument is unnecessary to establish the quoted ethical concern.",
    ],
  });
  f(
    "bostrom",
    "Nick Bostrom",
    1973,
    undefined,
    "utilitarian",
    "#2c71b7",
    "Sweden / Britain; consequentialist arguments about the long-term future",
    "https://nickbostrom.com/papers/astronomical-waste/",
    "Explicitly derives existential-risk priority from standard utilitarianism. Inclusion records substantive framework use, not exclusive allegiance.",
    "established",
  );
  e({
    id: "bostrom-extinction",
    person: "bostrom",
    domain: "extinction",
    title: "Reducing existential risk as a priority",
    summary:
      "Bostrom derives priority for existential-risk reduction from maximizing expected aggregate welfare.",
    year: 2003,
    milestone: "extinction-concern",
    quote:
      "For standard utilitarians, priority number one, two, three and four should consequently be to reduce existential risk.",
    locator: "Section III",
    work: "Astronomical Waste",
    url: "https://nickbostrom.com/papers/astronomical-waste/",
    context:
      "The argument considers loss of future lives and contrasts extinction prevention with merely accelerating development.",
    qualifications: [
      "Existential risk includes permanent curtailment as well as extinction. This paper explicitly includes extinction, so it is eligible for that separate domain.",
      "The next section considers different implications of person-affecting views.",
    ],
  });
  e({
    id: "bostrom-ai",
    person: "bostrom",
    author: "Nick Bostrom and Eliezer Yudkowsky",
    domain: "ai",
    title: "Equal moral status across substrates",
    summary:
      "With consciousness and functionality held constant, an artificial mind’s material substrate should not determine its moral status.",
    year: 2011,
    milestone: "ai-welfare",
    quote:
      "it makes no moral difference whether a being is made of silicon or carbon",
    locator: "Draft p. 8, Principle of Substrate Non-Discrimination",
    work: "The Ethics of Artificial Intelligence (with Eliezer Yudkowsky)",
    url: "https://nickbostrom.com/ethics/artificial-intelligence.pdf",
    edition: "Author-hosted 2011 draft for a later Cambridge Handbook chapter.",
    context:
      "The sentence is explicitly conditional on holding sentience and functionality constant.",
    qualifications: [
      "Coauthored with Eliezer Yudkowsky. This is not a claim that current AI systems are conscious.",
      "The date is that of the public draft, not the later handbook edition.",
    ],
  });
  f(
    "ord",
    "Toby Ord",
    1979,
    undefined,
    "utilitarian",
    "#6c95c7",
    "Australia / Britain; global consequentialism and existential risk",
    "https://www.tobyord.com/research",
    "His research page identifies a doctoral defense of global consequentialism.",
    "established",
  );
  e({
    id: "ord-extinction",
    person: "ord",
    domain: "extinction",
    title: "Safeguarding humanity’s future",
    summary:
      "Ord describes safeguarding humanity’s future as the defining challenge of the present era.",
    year: 2020,
    milestone: "extinction-concern",
    quote:
      "This book argues that safeguarding humanity’s future is the defining challenge of our time.",
    locator: "Introduction; author-shared excerpt PDF p. 5",
    work: "The Precipice",
    url: "https://forum.effectivealtruism.org/posts/xgKqRcemzw5L2omZT/the-precipice-introduction-and-chapter-one",
    edition: "2020 book; excerpt shared by Toby Ord in January 2021.",
    context:
      "The next sentences concern our ability to destroy ourselves and sever humanity’s entire future.",
    qualifications: [
      "The 2021 excerpt posting is not the first publication date.",
      "The book draws on several moral perspectives, alongside Ord’s consequentialist research.",
    ],
  });
  for (const [id, name, born, color] of [
    ["macaskill", "William MacAskill", 1987, "#357fac"],
    ["greaves", "Hilary Greaves", 1978, "#5275ac"],
  ] as const) {
    f(
      id,
      name,
      born,
      undefined,
      "utilitarian",
      color,
      "Britain; population ethics and global priorities",
      "https://www.globalprioritiesinstitute.org/wp-content/uploads/The-Case-for-Strong-Longtermism-GPI-Working-Paper-June-2021-2-2.pdf",
      "This coauthored argument explicitly adopts a total-utilitarian axiology before testing alternative assumptions.",
      "established",
    );
    e({
      id: `${id}-extinction`,
      person: id,
      domain: "extinction",
      title: "The expected value of preventing extinction",
      summary:
        "Greaves and MacAskill argue that even small reductions in extinction risk can have high expected value.",
      year: 2021,
      milestone: "extinction-concern",
      quote:
        "Correspondingly, even an extremely small reduction in extinction risk would have very high expected value",
      locator: "Section 4.2, printed p. 11 (PDF p. 12)",
      work: "The Case for Strong Longtermism — Hilary Greaves and William MacAskill",
      url: "https://www.globalprioritiesinstitute.org/wp-content/uploads/The-Case-for-Strong-Longtermism-GPI-Working-Paper-June-2021-2-2.pdf",
      sourceId: "greaves-macaskill-2021",
      author: "Hilary Greaves and William MacAskill",
      edition: "GPI Working Paper 5-2021, June 2021 revision.",
      context:
        "The argument assumes positive expected future welfare and discusses a total-utilitarian axiology; later sections examine other assumptions.",
      qualifications: [
        "An earlier working paper appeared in 2019. This exact wording is verified in the 2021 version and is dated accordingly.",
        "This is a joint-authored position, not two independent intellectual discoveries. Both author records point to the same work.",
        "The argument is conditional on empirical and ethical assumptions stated in the paper.",
      ],
    });
  }
  f(
    "ng",
    "Yew-Kwang Ng",
    1942,
    undefined,
    "utilitarian",
    "#1b6e96",
    "Malaysia / Australia; welfare economics",
    "https://research.monash.edu/en/publications/towards-welfare-biology-evolutionary-economics-of-animal-consciou/",
    "The paper expressly applies extended utilitarian reasoning to animal welfare; prominent originator of welfare biology.",
    "established",
  );
  e({
    id: "ng-wild",
    person: "ng",
    domain: "wild",
    title: "A science of welfare in nature",
    summary:
      "Ng argues for research capable of improving animal welfare, including in natural populations.",
    year: 1995,
    milestone: "wild-welfare",
    quote:
      "The large scale reduction in animal suffering relies on continued scientific advances.",
    locator: "Biology and Philosophy 10, p. 275 (PDF p. 21)",
    work: "Towards Welfare Biology",
    url: "https://niplav.site/doc/bio/welfare/towards_welfare_biology_evolutionary_economics_of_animal_consciousness_and_suffering_ng_1995.pdf",
    edition: "Biology and Philosophy 10 (1995), pp. 255–285.",
    context:
      "The paper considers naturally selected populations and how welfare might be improved; it also discusses animals used by humans.",
    qualifications: [
      "Some empirical arguments in this early paper remain debated. The entry establishes concern and proposed research, not the truth of each model.",
      "He warns against acting without understanding ecological repercussions.",
    ],
  });
  f(
    "tomasik",
    "Brian Tomasik",
    1987,
    undefined,
    "utilitarian",
    "#538bbb",
    "United States; suffering-focused consequentialism",
    "https://reducing-suffering.org/history-of-this-website/",
    "Author working explicitly on reducing suffering, including wild animals and insects; narrower historical role than founders.",
    "established",
  );
  e({
    id: "tomasik-insects",
    person: "tomasik",
    domain: "wild",
    title: "Taking insect suffering seriously",
    summary:
      "Tomasik argues for ethical consideration of possible insect suffering and research on reducing it.",
    year: 2015,
    end: 2016,
    publication: 2015,
    publicationEnd: 2016,
    milestone: "wild-welfare",
    quote:
      "We should encourage concern for wild-insect suffering and research ways in which human environmental policies can reduce it.",
    locator: "Summary, second paragraph",
    work: "The Importance of Insect Suffering",
    url: "https://reducing-suffering.org/the-importance-of-insect-suffering/",
    context:
      "The essay acknowledges uncertainty about insect consciousness while arguing that large numbers make the issue ethically significant.",
    dateBasis:
      "Page first published 3 February 2015; last substantial update 25 April 2016. Exact introduction date of this sentence is unresolved, so the full interval is used.",
    qualifications: [
      "The date range preserves uncertainty about which version first contained this sentence.",
      "A precautionary argument does not establish insect consciousness as certain.",
    ],
  });
  e({
    id: "tomasik-wild",
    person: "tomasik",
    domain: "wild",
    title: "Reducing suffering in the wild",
    summary:
      "Tomasik argues that humans can and should study ways to reduce naturally occurring animal suffering.",
    year: 2015,
    milestone: "wild-welfare",
    quote: "Humans are not helpless to reduce wild-animal suffering.",
    locator: "Abstract, p. 133 (PDF p. 1)",
    work: "The Importance of Wild-Animal Suffering",
    url: "https://longtermrisk.org/files/the-importance-of-wild-animal-suffering.pdf",
    edition: "Relations 3.2, November 2015, pp. 133–152.",
    context:
      "The abstract calls for careful study because ecological interventions are complex and may have unintended consequences.",
    qualifications: [
      "The paper’s claim that suffering plausibly dominates welfare in nature is an argument, not an established fact.",
    ],
  });
  f(
    "beauvoir",
    "Simone de Beauvoir",
    1908,
    1986,
    "existential",
    "#ac4c80",
    "France; existentialist feminism",
    "https://plato.stanford.edu/entries/beauvoir/",
    "The Second Sex explicitly identifies its perspective as existentialist ethics.",
    "foundational",
  );
  e({
    id: "beauvoir-women",
    person: "beauvoir",
    domain: "women",
    title: "Women as free and autonomous beings",
    summary:
      "Beauvoir criticizes the imposed social subordination of women as a denial of their freedom.",
    year: 1949,
    milestone: "women-equality",
    quote: "a free and autonomous being like all human creatures",
    locator: "Introduction, concluding methodological discussion",
    work: "The Second Sex",
    url: "https://www.marxists.org/reference/subject/ethics/de-beauvoir/2nd-sex/introduction.htm",
    language: "French",
    translation:
      "English translation reproduced in Marxists Internet Archive; translation metadata is not supplied on the excerpt page.",
    context:
      "The phrase describes woman, whom men compel to take the status of the Other; the preceding paragraph explicitly invokes existentialist ethics.",
    qualifications: [
      "This is broader social and legal autonomy, not a claim about the first enactment of women’s suffrage.",
    ],
  });
  f(
    "gandhi",
    "M. K. Gandhi",
    1869,
    1948,
    "hindu",
    "#b96524",
    "India; Hindu nonviolence with Jain, Christian and other influences",
    "https://www.cambridge.org/core/books/abs/cambridge-companion-to-gandhi/gandhis-religion-and-its-relation-to-his-politics/A4FB2DF77F0A517F4E0AF998D8F80AF0",
    "Substantive Hindu ethical interpretation, explicitly invoked in these writings; influences remain plural.",
    "central",
  );
  e({
    id: "gandhi-animals",
    person: "gandhi",
    domain: "animals",
    title: "Protection beyond the human species",
    summary:
      "Gandhi interprets cow protection as a duty toward the wider animal world.",
    year: 1921,
    milestone: "animal-protection",
    quote:
      "Protection of the cow means protection of the whole dumb creation of God.",
    locator: "Young India, 6 October 1921; collected under “Cow Protection”",
    work: "Young India: Cow Protection",
    url: "https://www.mkgandhi.org/momgandhi/chap81.php",
    edition: "Dated extracts in The Mind of Mahatma Gandhi.",
    context:
      "“Dumb” means speechless here. Gandhi expressly connects the argument to Hinduism and responsibility beyond humanity.",
    qualifications: [
      "This is not a claim that all animal uses are prohibited.",
      "A global author is compared with a British legal benchmark; local context is retained rather than treating Britain as his own society.",
    ],
  });
}
