// "use server";

// import { backendUrl } from "@/lib";
// import { get_cookies } from "@/lib/get-cookie";
// import axios from "axios";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { email, password, userId } = await req.json();
//   if (!email || !password || !userId) {
//     return { error: "Login data missing" };
//   }

//   const session_cookie = await get_cookies("__session");
//   if (!session_cookie) {
//     return {
//       error: "user not authenticated",
//     };
//   }

//   try {
//     const res = await axios.post(
//       `${backendUrl}/api/admin/login`,
//       { email, password, userId },
//       {
//         withCredentials: true,
//         headers: {
//           Cookie: `__session=${session_cookie}`,
//         },
//       }
//     );
//     const data = await res.data;
//     if (!data) {
//       return NextResponse.json({ error: "failed to login" });
//     }

//     const cookie = res.headers["set-cookie"] || [];
//     const admin_cookie = cookie.find((cookie: string) =>
//       cookie.trim().startsWith("admin_token=")
//     );
//     console.log("this is the admin cookie", admin_cookie);

//     if (!admin_cookie) {
//       return {
//         error: "failed to login",
//       };
//     }

//     const cookie_value = admin_cookie?.split(";")[0];

//     let session_name = cookie_value.split("=")[0];
//     let session_token = cookie_value.slice(session_name.length + 1);

//     const response = NextResponse.json({
//       message: "logged in success",
//       success: true,
//     });
//     const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//     response.cookies.set(session_name, session_token, {
//       httpOnly: true,
//       secure: false, // Cookie is only sent over HTTPS
//       sameSite: "none", // Prevents cross-site requests
//       expires: sevenDaysFromNow, // Expires in 7 days
//       path: "/",
//     });
//     return response;
//   } catch (error) {
//     return NextResponse.json({ error: "failed to login" });
//   }
// }


"use server";

import { backendUrl } from "@/lib";
import { get_cookies } from "@/lib/get-cookie";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, userId } = await req.json();
  if (!email || !password || !userId) {
    return NextResponse.json({ error: "Login data missing" }, { status: 400 });
  }

  const session_cookie = await get_cookies("__session");
  if (!session_cookie) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  try {
    const res = await axios.post(
      `${backendUrl}/api/admin/login`,
      { email, password, userId },
      {
        withCredentials: true,
        headers: {
          Cookie: `__session=${session_cookie}`,
        },
      }
    );

    const data = await res.data;
    if (!data) {
      return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }

    const cookie = res.headers["set-cookie"] || [];
    const admin_cookie = cookie.find((cookie: string) =>
      cookie.trim().startsWith("admin_token=")
    );

    console.log("This is the admin cookie:", admin_cookie);

    if (!admin_cookie) {
      return NextResponse.json({ error: "Failed to login" }, { status: 500 });
    }

    // Parse the cookie value
    const cookie_value = admin_cookie.split(";")[0];
    const  session_name = cookie_value.split("=")[0];
    const  session_token = cookie_value.slice(session_name.length + 1);


    // Create a response
    const response = NextResponse.json({
      message: "Logged in successfully",
      success: true,
    });

    // Set the cookie with appropriate options
    const sevenDaysFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    response.cookies.set(session_name, session_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Set to "none" in production
      expires: sevenDaysFromNow, // Expires in 7 days
      path: "/", // Accessible across the entire site
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}