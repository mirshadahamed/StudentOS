import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Saving from "../../../../models/Saving";

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

export async function PUT(req, { params }) {
  try {
    const body = await req.json();
    await connectMongoDB();
    const { id } = await params;
    const userId = getUserId(req, body);
    const query = userId ? { _id: id, userId } : { _id: id };
    const saving = await Saving.findOneAndUpdate(
      query,
      { $inc: { current: Number(body.amountToAdd || 0) } },
      { new: true, runValidators: true }
    );

    if (!saving) {
      return NextResponse.json({ error: "Savings goal not found" }, { status: 404 });
    }

    return NextResponse.json(serialize(saving));
  } catch (error) {
    console.error("PUT FINANCE SAVINGS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update savings goal" },
      { status: 400 }
    );
  }
}
