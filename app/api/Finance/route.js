import { NextResponse } from "next/server";

export async function POST(request) {
  const body = await request.json();

  return NextResponse.json({
    message: "Finance data received successfully",
    data: body,
  });
}
export async function GET() {
  return NextResponse.json({
    message: "Finance API is working",
  });
}
