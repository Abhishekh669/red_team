import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface decodeType extends JwtPayload{
  _id : string,
  email : string,
  name : string, 
  image : string
}

export async function GET(request: Request) {
  const backendAuthCallback =
    process.env.BACKEND_AUTH_CALLBACK! ??
    "http://127.0.0.1:8000/api/auth/google/callback";

  const url = new URL(request.url);
  const state = url.searchParams.get("state")?.toString();
  const code = url.searchParams.get("code");


  if (!state || !code) {
    return NextResponse.json(
      { error: "State or code missing" },
      { status: 400 }
    );
  }

  try {

    const response = await fetch(
      `${backendAuthCallback}?state=${state}&code=${code}`,
      {
        method: "GET",
        credentials: "include", // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Error from backend" },
        { status: 500 }
      );
    }


    const {user, chat_token} = await response.json();



    if(!user || !chat_token) {
      return NextResponse.json({error : "failed to get data"},{status : 404})
    }

    const token_data : decodeType = {
      _id : user._id as string,
      name : user.name as string,
      email : user.email as string,
      image : user.image as string
    }

    const  token_session = jwt.sign(token_data, process.env.JWT_SECRET!,{
      expiresIn : '7d'
    });

    const setCookieHeader = response.headers.get("set-cookie");




    if (!setCookieHeader) {
      return NextResponse.json({ error: "No cookie found" }, { status: 500 });
    }

    const cookie_value = setCookieHeader.split(";")[0];

    const  session_name = cookie_value.split("=")[0]
    const session_token = cookie_value.slice(session_name.length + 1)

    const nextResponse = NextResponse.redirect(new URL("/dashboard", request.url));

    // Set the session cookie in the Next.js response
    nextResponse.cookies.set(session_name, session_token, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" for cross-site cookies in production
    });

    nextResponse.cookies.set("chat_session", chat_token, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" for cross-site cookies in production
    });

    nextResponse.cookies.set("user_session", token_session, {
      path: "/",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use "none" for cross-site cookies in production
    });

    return nextResponse;
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}







