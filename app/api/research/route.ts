import { data } from "@/research/corpus";
export const dynamic = "force-static";
export function GET() {
  return Response.json(data, {
    headers: {
      "Content-Disposition":
        'attachment; filename="ethical-track-record-corpus.json"',
    },
  });
}
