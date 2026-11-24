import { NextResponse } from "next/server";

import { submissionRequestSchema } from "@/features/submissions/schema";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Something got a little jumbled while sending your list. Please try once more!" }, { status: 400 });
  }

  const parsed = submissionRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Check your wishlist details and try again." }, { status: 422 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("submit_wishlist", { p_payload: parsed.data });
  if (error) {
    console.error("Wishlist submission failed", { code: error.code, message: error.message });
    return NextResponse.json({ error: error.message || "Your list couldn't go through just now. Give it one more try!" }, { status: 422 });
  }

  const result = Array.isArray(data) ? data[0] : data;
  if (!result?.submission_id || !result?.public_reference) {
    return NextResponse.json({ error: "Your list was saved, though the keepsake note didn't load—let me know and I'll check it right away!" }, { status: 500 });
  }

  return NextResponse.json({ id: result.submission_id, reference: result.public_reference }, { status: 201 });
}
