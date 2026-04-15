import { NextResponse } from "next/server";
import twilio from "twilio";
import connectMongoDB from "../../libs/mongodb";
import Transaction from "../../models/Transaction";
import User from "../../models/User";

export const runtime = "nodejs";

function digitsOnly(value) {
  return String(value || "").replace(/\D/g, "");
}

function getPhoneVariants(value) {
  const digits = digitsOnly(value);
  if (!digits) return [];

  const variants = new Set([digits]);

  if (digits.startsWith("94")) {
    variants.add(`0${digits.slice(2)}`);
    variants.add(`+${digits}`);
  }

  if (digits.startsWith("0")) {
    variants.add(`94${digits.slice(1)}`);
    variants.add(`+94${digits.slice(1)}`);
  }

  return [...variants];
}

function parseExpenseMessage(message) {
  const text = String(message || "").trim();
  if (!text) return null;

  const match = text.match(/^(.*?)(\d[\d,]*(?:\.\d{1,2})?)\s*$/);
  if (!match) return null;

  const title = match[1].trim().replace(/[-:]+$/, "").trim();
  const amount = Number(match[2].replace(/,/g, ""));

  if (!title || Number.isNaN(amount) || amount <= 0) return null;

  return { title, amount };
}

function parseLinkCommand(message) {
  const text = String(message || "").trim();
  const match = text.match(/^link\s+([a-f0-9]{24})$/i);
  return match ? match[1] : "";
}

function categorizeExpense(title) {
  const text = title.toLowerCase();

  if (/(rent|house|electricity|water|wifi|internet|utility)/.test(text)) return "Housing";
  if (/(food|grocery|groceries|dinner|lunch|breakfast|meal|cafe|coffee|restaurant)/.test(text)) return "Food";
  if (/(uber|pickme|bus|train|fuel|petrol|diesel|taxi|transport)/.test(text)) return "Transport";
  if (/(netflix|spotify|subscription|membership|icloud|google one)/.test(text)) return "Subscriptions";
  if (/(doctor|medical|medicine|hospital|repair|emergency|unexpected)/.test(text)) return "Unexpected / Emergency";
  return "Other";
}

function buildReply(message) {
  const response = new twilio.twiml.MessagingResponse();
  response.message(message);
  return new NextResponse(response.toString(), {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const body = String(form.get("Body") || "");
    const from = String(form.get("From") || "");
    const senderPhone = from.replace(/^whatsapp:/i, "");
    const senderVariants = getPhoneVariants(senderPhone);

    const userIdToLink = parseLinkCommand(body);
    if (userIdToLink) {
      await connectMongoDB();

      const linkedUser = await User.findByIdAndUpdate(
        userIdToLink,
        { whatsappPhone: senderVariants[0] || senderPhone },
        { new: true }
      ).lean();

      if (!linkedUser) {
        return buildReply("We could not find that StudentOS account. Copy your account link code again and resend it.");
      }

      return buildReply("WhatsApp connected successfully. Now send expenses like \"Uber 500\" and they will appear in your Expense Tracker.");
    }

    const parsed = parseExpenseMessage(body);
    if (!parsed) {
      return buildReply('Send "link YOUR_USER_ID" once to connect your account, then send expenses like "Uber 500" or "Groceries 1250".');
    }

    await connectMongoDB();

    const user = await User.findOne({
      $or: [
        { whatsappPhone: { $in: senderVariants } },
        { phone: { $in: senderVariants } },
      ],
    }).lean();

    if (!user) {
      return buildReply("This WhatsApp number is not linked to a StudentOS account yet. Send \"link YOUR_USER_ID\" first, then resend your expense.");
    }

    const transaction = await Transaction.create({
      userId: String(user._id),
      title: parsed.title,
      amount: parsed.amount,
      type: "expense",
      category: categorizeExpense(parsed.title),
      status: "completed",
      isRecurring: false,
    });

    return buildReply(`Logged ${transaction.title} for LKR ${parsed.amount.toLocaleString()}. Check your Expense Tracker.`);
  } catch (error) {
    console.error("POST WHATSAPP EXPENSE ERROR:", error);
    return buildReply("Sorry, something went wrong while logging that expense.");
  }
}
