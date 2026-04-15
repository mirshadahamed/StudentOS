import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
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
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await Promise.allSettled(
        body.members
          .filter((member) => member?.email)
          .map((member) =>
            transporter.sendMail({
              from: `"StudentOS Finance" <${process.env.EMAIL_USER}>`,
              to: member.email,
              subject: `You owe LKR ${member.amount} for ${body.title}`,
              html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border-radius: 10px; background: #f3f4f6;">
                  <h2 style="color: #e11d48;">Split Bill Alert</h2>
                  <p>Hi <b>${member.name || "there"}</b>,</p>
                  <p><b>${body.payer || "Someone"}</b> just paid <b>LKR ${Number(body.total_amount).toLocaleString()}</b> for <b>${body.title}</b>.</p>
                  <h3 style="color: #be123c;">Your share to pay: LKR ${member.amount}</h3>
                </div>
              `,
            })
          )
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
