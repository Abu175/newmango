import { NextResponse } from "next/server";
import getFirebaseAdmin from "../../../lib/firebaseAdmin";

export async function GET() {
  try {
    const admin = getFirebaseAdmin();
    const db = admin.database();
    const ref = db.ref("/test/healthcheck");
    await ref.set({ ok: true, time: Date.now() });
    const snapshot = await ref.once("value");
    return NextResponse.json({ data: snapshot.val() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
