import { evidence } from "./evidence";

/** All five Elements excerpts together use 25 words, including the suffrage record. */
export function sidgwickExpansion() {
  const e = (input: Parameters<typeof evidence>[0]) =>
    evidence({
      checkedOn: "2026-09-24",
      qualified: true,
      ...input,
    });
  const edition = {
    person: "sidgwick",
    year: 1897,
    publication: 1897,
    workFirstPublication: 1891,
    witnessPublication: 1897,
    work: "The Elements of Politics",
    sourceId: "sidgwick-suffrage-source",
    url: "https://archive.org/details/elementspolitic01sidggoog",
    verification: "primary-pdf" as const,
    datingSourceUrl: "https://archive.org/details/elementspolitic01sidggoog",
    dateBasis:
      "1897 is the inspected second-edition passage proxy. The work first appeared in 1891; these revised-edition passages have not been collated against the first edition and are not backdated. The later online 1919 transcription is not the dating witness.",
  };
  e({
    ...edition,
    id: "sidgwick-animals",
    domain: "animals",
    milestone: "animal-protection",
    title: "Government should prevent unnecessary animal suffering",
    quote: "prevention of unnecessary pain",
    locator: "Chapter IX, concluding discussion, pp.141–142",
    summary:
      "Accepts government intervention against animal cruelty, justified by the welfare of sentient beings, even though it limits human freedom of action.",
    context:
      "On p.141 he includes animal-cruelty prevention among necessary governmental interventions. Page 142 explains the restraint by reference to the aggregate happiness of sentient beings. This goes beyond reporting that other people favor kindness.",
    match:
      "Explicit governmental prevention of cruelty is a substantive match to the limited animal-protection benchmark; it does not establish animal equality or opposition to all animal use.",
    qualifications: [
      "The passage targets unnecessary suffering and does not specify species coverage, enforcement or the exact content of a statute.",
    ],
    counter:
      "He explicitly distinguishes protection from pain from freedom of action for animals. Chapter V pp.74–75 also accepts ownership of animals. This is not a prohibition of meat, animal ownership or experimentation, and no separate farmed- or wild-animal score is inferred.",
  });
  e({
    ...edition,
    id: "sidgwick-religion",
    domain: "religion",
    milestone: "religious-freedom",
    title: "Do not impose the settlers’ religion by force",
    quote: "not be compulsorily imposed",
    locator: "Chapter XVIII §8, point 5, p.326",
    summary:
      "Opposes forcibly imposing settlers’ religion on Indigenous peoples while encouraging missionary teaching within a colonial project.",
    context:
      "The negative clause applies to compulsory imposition of the colonizers’ religion. The same paragraph endorses missionary instruction as an instrument of what he calls civilization.",
    match:
      "Qualified support for freedom from compulsory religion matches one central component of the religious-liberty benchmark; this is not evidence of full institutional separation or equal political rights.",
    qualifications: [
      "The stated protection concerns Indigenous peoples under colonial government, whose rule he otherwise accepts.",
    ],
    counter:
      "The same paragraph urges encouragement of missionaries and describes the colonized population through a hierarchy of civilizations. It supplies no endorsement of religious neutrality, and this excerpt-level review does not resolve all of his church–state proposals.",
  });
  e({
    ...edition,
    id: "sidgwick-racial",
    domain: "racial",
    milestone: "racial-equality",
    stance: "opposes",
    title: "Permits racial exclusion from the franchise",
    quote: "Exclusion on the ground of race alone",
    locator:
      "Chapter XX §4, p.387, paragraph following the discussion of wives’ votes",
    summary:
      "Allows race alone to determine exclusion from voting when a race’s alleged intellectual or moral inferiority is regarded as sufficiently clear.",
    context:
      "Sidgwick says the quoted exclusion may be expedient under his asserted inferiority condition. This is his own permission, not an opponent’s claim. The racial hierarchy is reported here as his claim, not accepted as fact.",
    match:
      "Explicit race-based denial of voting rights conflicts with the racial legal-equality benchmark. Its conditional formulation is retained; pre-benchmark opposition receives a negative foresight score at half weight.",
    qualifications: [
      "Conditional permission, not a proposal to exclude every racial group in every society.",
    ],
    counter:
      "The surrounding section favors enfranchising some women, and XVIII §8 advocates protections against colonial abuses. These protections do not retract the race-based exclusion expressly permitted here. XXVI §7 p.550 similarly withholds electoral equality on alleged incapacity grounds.",
  });
  e({
    ...edition,
    id: "sidgwick-colonial",
    domain: "colonial",
    milestone: "self-determination",
    stance: "opposes",
    title: "Retain colonial dependency under a racial capacity test",
    quote: "colony should remain a dependency",
    locator: "Chapter XXVI §7, p.550; compare XVIII §8, pp.323–327",
    summary:
      "Recommends continued imperial dependency where he regards settler oligarchy as oppressive but Indigenous electoral equality as unsafe because of alleged incapacity.",
    context:
      "The recommendation lasts while the society presents that dilemma. He invokes the imperial government’s ability to restrain settler oppression, while treating equal electoral participation by the colonized population as an unacceptable remedy.",
    match:
      "Withholding political self-government on a racial or civilizational-capacity test conflicts with the colonial self-determination benchmark. This is a conditional imperial position, not a claim that he rejected independence for every colony.",
    qualifications: [
      "He presents continued dependency as protective and conditional; the record does not attribute unconditional support for permanent empire.",
    ],
    counter:
      "XVIII §8 demands compensation for Indigenous losses, limits interference without consent, opposes forced conversion and favors eventual abolition of slavery. Yet it also allows compulsory land transfers and tutelage. These constraints on colonial rule coexist with the p.550 recommendation to preserve dependency.",
  });
}
