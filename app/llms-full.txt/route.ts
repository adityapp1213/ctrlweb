import { createLlmIndex } from "@/lib/llms";

export const dynamic = "force-static";

export function GET() {
  return new Response(createLlmIndex(true), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
