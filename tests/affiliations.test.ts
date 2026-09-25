import test from "node:test";
import assert from "node:assert/strict";
import { affiliationColor } from "../lib/affiliations";
import { DEFAULT_FILTERS } from "../lib/state";
import { data } from "../research/corpus";

test("contested colors respect the toggle and selected affiliations take priority", () => {
  const nietzsche = data.figures.find((f) => f.id === "nietzsche")!;
  const camus = data.figures.find((f) => f.id === "camus")!;
  const russell = data.figures.find((f) => f.id === "russell")!;
  const kierkegaard = data.figures.find((f) => f.id === "kierkegaard")!;
  const color = (id: string) => data.traditions.find((t) => t.id === id)!.color;
  assert.equal(
    affiliationColor(nietzsche, data.traditions, DEFAULT_FILTERS),
    color("existential"),
  );
  assert.equal(
    affiliationColor(camus, data.traditions, {
      ...DEFAULT_FILTERS,
      includeContested: false,
    }),
    camus.color,
  );
  assert.equal(
    affiliationColor(camus, data.traditions, {
      ...DEFAULT_FILTERS,
      includeContested: true,
    }),
    color("existential"),
  );
  assert.equal(
    affiliationColor(russell, data.traditions, {
      ...DEFAULT_FILTERS,
      includeContested: true,
    }),
    russell.color,
  );
  assert.equal(
    affiliationColor(russell, data.traditions, {
      ...DEFAULT_FILTERS,
      traditionIds: ["utilitarian"],
    }),
    color("utilitarian"),
  );
  assert.equal(
    affiliationColor(russell, data.traditions, {
      ...DEFAULT_FILTERS,
      traditionIds: ["utilitarian"],
      includeContested: true,
    }),
    color("utilitarian"),
  );
  assert.equal(
    affiliationColor(kierkegaard, data.traditions, {
      ...DEFAULT_FILTERS,
      traditionIds: ["existential"],
    }),
    color("existential"),
  );
  assert.equal(
    kierkegaard.affiliations.find((a) => a.traditionId === "existential")!
      .status,
    "core",
  );
  assert.equal(nietzsche.primaryTraditionId, "existential");
  for (const figure of [nietzsche, kierkegaard]) {
    const affiliation = figure.affiliations.find(
      (a) => a.traditionId === "existential",
    )!;
    assert.equal(affiliation.status, "core");
    assert.match(affiliation.basis, /precursor/i);
  }
  assert.equal(
    kierkegaard.affiliations.find((a) => a.traditionId === "christian")!.status,
    "core",
  );
  for (const traditionId of ["secular-humanist", "utilitarian"])
    assert.equal(
      russell.affiliations.find((a) => a.traditionId === traditionId)!.status,
      "core",
    );
});

test("Mill's utilitarian liberalism does not admit him to rights-based comparisons", async () => {
  const { filterPositions, traditionCounts } = await import("../lib/scoring");
  const mill = data.figures.find((f) => f.id === "mill")!;
  assert.equal(mill.primaryTraditionId, "utilitarian");
  assert.deepEqual(
    mill.affiliations.map((a) => a.traditionId),
    ["utilitarian"],
  );
  for (const includeContested of [false, true]) {
    const filters = {
      ...DEFAULT_FILTERS,
      query: "John Stuart Mill",
      includeContested,
      showPostdictions: true,
    };
    assert.equal(
      filterPositions(data, { ...filters, traditionIds: ["liberal"] }).length,
      0,
    );
    assert(
      filterPositions(data, { ...filters, traditionIds: ["utilitarian"] })
        .length > 0,
    );
    assert.equal(traditionCounts(data, filters).liberal, 0);
  }
});

test("capabilities is distinct from virtue ethics and all affiliations resolve", () => {
  const nussbaum = data.figures.find((f) => f.id === "nussbaum")!;
  assert.equal(nussbaum.primaryTraditionId, "capabilities");
  assert(!nussbaum.affiliations.some((a) => a.traditionId === "virtue"));
  assert(nussbaum.affiliations.some((a) => a.traditionId === "liberal"));
  const ids = new Set(data.traditions.map((t) => t.id));
  for (const figure of data.figures) {
    assert.equal(
      new Set(figure.affiliations.map((a) => a.traditionId)).size,
      figure.affiliations.length,
      figure.id,
    );
    if (figure.primaryTraditionId)
      assert(
        figure.affiliations.some(
          (a) => a.traditionId === figure.primaryTraditionId,
        ),
        figure.id,
      );
    for (const affiliation of figure.affiliations) {
      assert(ids.has(affiliation.traditionId), figure.id);
      assert(affiliation.basis && affiliation.sourceUrl, figure.id);
    }
  }
});
