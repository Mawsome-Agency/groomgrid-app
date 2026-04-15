import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/next-auth-options";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Set cache control headers
    const headers = {
      "Cache-Control": "no-store",
    };

    // Get the current session
    const session = await getServerSession(authOptions);
    
    // If no session, return 401 Unauthorized
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401, headers }
      );
    }

    // Simply return success - NextAuth will automatically extend the JWT
    // when a new request is made to a protected route
    return NextResponse.json(
      { success: true },
      { headers }
    );
  } catch (error) {
    console.error("Session extension error:", error);
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
