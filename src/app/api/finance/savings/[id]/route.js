import { NextResponse } from "next/server";
import connectMongoDB from "../../../../libs/mongodb";
import Saving from "../../../../models/Saving";
import {
  buildScopedFilter,
  getUserIdFromBody,
  getUserIdFromSearchParams,
  serializeDocument,
} from "../../lib";

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const userId = getUserIdFromBody(body) || getUserIdFromSearchParams(req);

    await connectMongoDB();

    const saving = await Saving.findOneAndUpdate(
      buildScopedFilter(userId, { _id: id }),
      { $inc: { current: Number(body.amountToAdd || 0) } },
      { new: true, runValidators: true }
    ).lean();

    if (!saving) {
      return NextResponse.json(
        { error: "Savings goal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeDocument(saving));
  } catch (error) {
    console.error("PUT FINANCE SAVINGS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update savings goal" },
      { status: 400 }
    );
  }
}
