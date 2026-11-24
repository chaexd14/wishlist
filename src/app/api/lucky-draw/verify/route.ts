import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { serverEnvironment } from "@/lib/env/server";

const FALLBACK_CODE = "WISHFORYOU";

function digest(value: string) {
  return createHash("sha256").update(value.trim().toUpperCase()).digest();
}

export async function POST(request: Request) {
  let body: { code?: unknown };
  try {
    body = (await request.json()) as { code?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: "Type the secret code I sent you to claim your ticket!" }, { status: 400 });
  }

  const received = typeof body.code === "string" ? body.code.trim() : "";
  if (!received) {
    return NextResponse.json({ ok: false, error: "Enter the secret code I sent you first!" }, { status: 400 });
  }

  const expected = serverEnvironment.LUCKY_DRAW_CODE || FALLBACK_CODE;
  const isMatch = timingSafeEqual(digest(received), digest(expected));

  if (!isMatch) {
    return NextResponse.json(
      { ok: false, error: "Hmm, that code didn't unlock the ticket—double-check my message and try again!" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
