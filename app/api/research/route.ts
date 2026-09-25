import { data } from "@/research/corpus";
import { buildTimelineAxis } from "@/lib/geometry";
export const dynamic = "force-static";
export function GET() {
  return Response.json(
    { ...data, axis: buildTimelineAxis(data) },
    {
      headers: {
        "Content-Disposition":
          'attachment; filename="ethical-track-record-corpus.json"',
      },
    },
  );
}
