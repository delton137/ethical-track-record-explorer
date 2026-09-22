import type { ResearchData } from "@/lib/types";
import { traditions, domains, milestones } from "./catalog";
import { figures, sources, quotations, positions } from "./evidence";
import { calibration } from "./calibration";
import { expanded } from "./expanded";

calibration();
expanded();
export const data: ResearchData = {
  version: "2026.09.22-1",
  asOf: "2026-09-22",
  traditions,
  domains,
  milestones,
  figures,
  sources,
  quotations,
  positions,
};
