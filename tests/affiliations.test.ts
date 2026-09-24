import test from "node:test";
import assert from "node:assert/strict";
import { affiliationColor } from "../lib/affiliations";
import { DEFAULT_FILTERS } from "../lib/state";
import { data } from "../research/corpus";

test("contested colors require opt-in and selected affiliations take priority", () => {
  const nietzsche = data.figures.find((f) => f.id === "nietzsche")!;
  const russell = data.figures.find((f) => f.id === "russell")!;
  const kierkegaard = data.figures.find((f) => f.id === "kierkegaard")!;
  const color = (id: string) => data.traditions.find((t) => t.id === id)!.color;
  assert.equal(
    affiliationColor(nietzsche, data.traditions, DEFAULT_FILTERS),
    nietzsche.color,
  );
  assert.equal(
    affiliationColor(nietzsche, data.traditions, {
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
    russell.color,
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
      includeContested: true,
    }),
    color("existential"),
  );
  assert.equal(
    kierkegaard.affiliations.find((a) => a.traditionId === "existential")!
      .status,
    "contested",
  );
  assert.equal(
    kierkegaard.affiliations.find((a) => a.traditionId === "christian")!.status,
    "core",
  );
});
