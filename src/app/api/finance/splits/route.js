import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Split from "../../../models/Split";

export const runtime = "nodejs";

function serialize(item) {
  const plain = typeof item.toObject === "function" ? item.toObject() : item;
  const { _id, __v, ...rest } = plain;
  return { ...rest, id: _id.toString() };
}

function getUserId(req, body = null) {
  if (body?.userId) return body.userId;
  const { searchParams } = new URL(req.url);
  return searchParams.get("userId") || "";
}

export async function GET(req) {
  try {
    await connectMongoDB();
    const userId = getUserId(req);
    const query = userId ? { userId } : {};
    const splits = await Split.find(query).sort({ date: -1 }).lean();
    return NextResponse.json(splits.map(serialize));
  } catch (error) {
    console.error("GET FINANCE SPLITS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch split bills" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectMongoDB();
    const split = await Split.create({
      userId: body.userId || "",
      title: body.title,
      total_amount: Number(body.total_amount),
      payer: body.payer || "Me",
      members: body.members || [],
    });

    const canSendEmail = process.env.EMAIL_USER && process.env.EMAIL_PASS;
    if (canSendEmail && Array.isArray(body.members) && body.members.length > 0) {
      console.warn(
        "Split bill emails are disabled in this workspace because nodemailer is not installed."
      );
    }

    return NextResponse.json(serialize(split), { status: 201 });
  } catch (error) {
    console.error("POST FINANCE SPLITS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create split bill" },
      { status: 400 }
    );
  }
}
