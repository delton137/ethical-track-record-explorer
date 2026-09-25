import type { ResearchData } from "@/lib/types";
import { traditions, domains, milestones } from "./catalog";
import { figures, sources, quotations, positions } from "./evidence";
import { calibration } from "./calibration";
import { recordFocusAudit } from "./focus-audit";
import { additions } from "./additions";
import { expanded } from "./expanded";

import { eightPhilosophers } from "./eight-philosophers";
import { sidgwickExpansion } from "./sidgwick-expansion";
import { ancientStoics } from "./ancient-stoics";
import { scriptures } from "./scriptures";
import { DATE_CONVENTION } from "@/lib/dates";

calibration();
expanded();
additions();
eightPhilosophers();
sidgwickExpansion();
ancientStoics();
scriptures();
recordFocusAudit();
export const data: ResearchData = {
  version: "2026.09.25-1",
  asOf: "2026-09-25",
  dateConvention: DATE_CONVENTION,
  traditions,
  domains,
  milestones,
  figures,
  sources,
  quotations,
  positions,
};
