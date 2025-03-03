import { NextResponse } from "next/server";




export async function GET(){
    const backendUrl = process.env.BACKEND_AUTH_URL!;
    return NextResponse.redirect(backendUrl);
}