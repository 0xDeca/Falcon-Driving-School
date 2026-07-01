import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    const res = await fetch(`${API_URL}/auth/complete-signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: json.message || "Failed to complete signup" }, { status: res.status });
    }
    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to complete signup" }, { status: 500 });
  }
}
