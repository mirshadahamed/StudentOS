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

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 0);

  if (!user || !pass) return null;

  if (host && port) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  // Default to Gmail when custom SMTP settings are not provided.
  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

function buildSplitEmail({ title, payer, memberName, amount, totalAmount }) {
  const safeTitle = title || "Shared bill";
  const safePayer = payer || "Your friend";
  const safeName = memberName || "there";
  const normalizedAmount = Number(amount || 0);
  const normalizedTotal = Number(totalAmount || 0);
  const amountLabel = `LKR ${normalizedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const totalLabel = `LKR ${normalizedTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return {
    subject: `Split Bill Alert: ${safeTitle}`,
    text: `Hi ${safeName},\n\n${safePayer} added you to a split bill for "${safeTitle}".\nYour share: ${amountLabel}\nTotal bill: ${totalLabel}\n\nPlease settle it soon.\n\n- StudentOS`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2 style="margin: 0 0 12px;">Split Bill Alert</h2>
        <p>Hi ${safeName},</p>
        <p><strong>${safePayer}</strong> added you to a split bill for <strong>"${safeTitle}"</strong>.</p>
        <p><strong>Your share:</strong> ${amountLabel}<br/><strong>Total bill:</strong> ${totalLabel}</p>
        <p>Please settle it soon.</p>
        <p style="margin-top: 18px;">- StudentOS</p>
      </div>
    `,
  };
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

    const members = Array.isArray(body.members) ? body.members : [];
    const transporter = createTransporter();
    let emailSummary = { attempted: 0, sent: 0, failed: 0, errors: [] };

    if (transporter && members.length > 0) {
      const sender = process.env.EMAIL_FROM || process.env.EMAIL_USER;
      const emailTargets = members.filter((member) => String(member?.email || "").trim());
      emailSummary.attempted = emailTargets.length;

      const results = await Promise.allSettled(
        emailTargets.map((member) => {
          const mail = buildSplitEmail({
            title: body.title,
            payer: body.payer || "Me",
            memberName: member.name,
            amount: member.amount,
            totalAmount: body.total_amount,
          });

          return transporter.sendMail({
            from: sender,
            to: member.email,
            subject: mail.subject,
            text: mail.text,
            html: mail.html,
          });
        })
      );

      emailSummary.sent = results.filter((result) => result.status === "fulfilled").length;
      emailSummary.failed = results.length - emailSummary.sent;
      emailSummary.errors = results
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason?.message || "Unknown email error");
    } else if (!transporter && members.length > 0) {
      emailSummary = {
        attempted: members.length,
        sent: 0,
        failed: members.length,
        errors: ["Email is not configured. Set EMAIL_USER and EMAIL_PASS (or SMTP_HOST/SMTP_PORT)."],
      };
    }

    return NextResponse.json({ ...serialize(split), emailSummary }, { status: 201 });
  } catch (error) {
    console.error("POST FINANCE SPLITS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create split bill" },
      { status: 400 }
    );
  }
}
