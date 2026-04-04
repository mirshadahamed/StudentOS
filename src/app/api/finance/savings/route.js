import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Saving from "../../../models/Saving";

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
    const savings = await Saving.find(query).sort({ date: -1 }).lean();
    return NextResponse.json(savings.map(serialize));
  } catch (error) {
    console.error("GET FINANCE SAVINGS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch savings" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    await connectMongoDB();
    const saving = await Saving.create({
      userId: body.userId || "",
      name: body.name,
      target: Number(body.target),
      current: Number(body.current || 0),
      color: body.color || "#a855f7",
      deadline: body.deadline || "",
    });
    return NextResponse.json(serialize(saving), { status: 201 });
  } catch (error) {
    console.error("POST FINANCE SAVINGS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create savings goal" },
      { status: 400 }
    );
  }
}
