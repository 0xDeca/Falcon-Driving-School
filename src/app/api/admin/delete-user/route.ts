import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!res.ok) {
      const json = await res.json();
      return NextResponse.json({ error: json.message || "Failed to delete user" }, { status: res.status });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Delete user proxy error:", err);
    return NextResponse.json({ error: err.message || "Failed to delete user" }, { status: 500 });
  }
}
