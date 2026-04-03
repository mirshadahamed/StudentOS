import { NextResponse } from "next/server";
import connectMongoDB from "../../../libs/mongodb";
import Saving from "../../../models/Saving";
import {
  buildScopedFilter,
  getUserIdFromBody,
  getUserIdFromSearchParams,
  serializeDocument,
} from "../lib";

export async function GET(req) {
  try {
    await connectMongoDB();

    const userId = getUserIdFromSearchParams(req);
    const savings = await Saving.find(buildScopedFilter(userId))
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(savings.map(serializeDocument));
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
    const userId = getUserIdFromBody(body);

    await connectMongoDB();

    const saving = await Saving.create({
      userId,
      name: body.name,
      target: Number(body.target),
      current: Number(body.current || 0),
      color: body.color || "#a855f7",
      deadline: body.deadline || "",
    });

    return NextResponse.json(serializeDocument(saving), { status: 201 });
  } catch (error) {
    console.error("POST FINANCE SAVINGS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create savings goal" },
      { status: 400 }
    );
  }
}
