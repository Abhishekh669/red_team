import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.BACKEND_URL!;
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("__session"); // Corrected typo

  if (!sessionCookie) {
    return NextResponse.json({ error: "No session cookie found" }, { status: 400 }); // Return a response with an error message
  }


  try {
    
    const res = await fetch(`${backendUrl}/api/auth/session`, {
      method: "GET",
      credentials: "include", // Ensure cookies are included in the request
      headers: {
        Cookie : `__session=${sessionCookie.value}`
      },
    });


    if (!res.ok) {
      throw new Error("Failed to fetch session data");
    }

    const session = await res.json(); // Await and parse the response body
    if (!session) {
      return NextResponse.json({ error: "Failed to get session data" }, { status: 400 });
    }

    return NextResponse.json({ user: session }, { status: 200 }); // Return session data if successful
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: error }, { status: 500 }); // Proper error message
  }
}
