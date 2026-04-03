import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import connectMongoDB from "../../../libs/mongodb";
import Split from "../../../models/Split";
import {
  buildScopedFilter,
  getUserIdFromBody,
  getUserIdFromSearchParams,
  serializeDocument,
} from "../lib";

async function notifySplitMembers({ title, totalAmount, payer, members }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (const member of members) {
    if (!member.email) {
      continue;
    }

    try {
      await transporter.sendMail({
        from: `"StudentOS Finance" <${process.env.EMAIL_USER}>`,
        to: member.email,
        subject: `💸 You owe LKR ${member.amount} for ${title}`,
        html: `
          <div style="font-family: Arial; padding: 20px; border-radius: 10px; background: #f3f4f6;">
            <h2 style="color: #e11d48;">Split Bill Alert! 🚨</h2>
            <p>Hi <b>${member.name}</b>,</p>
            <p><b>${payer}</b> just paid <b>LKR ${totalAmount}</b> for <b>${title}</b>.</p>
            <h3 style="color: #be123c;">Your share to pay: LKR ${member.amount}</h3>
          </div>
        `,
      });
    } catch (error) {
      console.error(`SPLIT EMAIL FAILED for ${member.email}:`, error);
    }
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();

    const userId = getUserIdFromSearchParams(req);
    const splits = await Split.find(buildScopedFilter(userId))
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(splits.map(serializeDocument));
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
    const userId = getUserIdFromBody(body);
    const members = (body.members || []).map((member) => ({
      name: member.name,
      email: member.email || "",
      amount: Number(member.amount),
    }));

    await connectMongoDB();

    const split = await Split.create({
      userId,
      title: body.title,
      total_amount: Number(body.total_amount),
      payer: body.payer || "Me",
      members,
    });

    await notifySplitMembers({
      title: body.title,
      totalAmount: Number(body.total_amount),
      payer: body.payer || "Me",
      members,
    });

    return NextResponse.json(serializeDocument(split), { status: 201 });
  } catch (error) {
    console.error("POST FINANCE SPLITS ERROR:", error);

    return NextResponse.json(
      { error: "Failed to create split bill" },
      { status: 400 }
    );
  }
}
