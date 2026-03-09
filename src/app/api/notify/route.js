import connectMongoDB from "../../libs/mongodb";
import User from "../../models/User";
import mongoose from "mongoose";

export async function POST(req) {

  try {

    const { userId, message } = await req.json();

    if (!userId) {
      return Response.json({ success: false, error: "userId required" }, { status: 400 });
    }

    await connectMongoDB();

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return Response.json({ success: false, error: "Invalid userId" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return Response.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const phone = user.phone;

    if (!phone) {
      return Response.json({ success: false, error: "Phone not found" }, { status: 400 });
    }

    const smsMessage =
      message || "⚠️ Alert: The student may be emotionally distressed. Please check on them.";

    // console.log("Sending SMS to:", phone);

    console.log("SMS API_KEY:", process.env.SMSLENZ_API_KEY);
console.log("SMS SENDER_ID:", process.env.SMSLENZ_SENDER_ID);
console.log("SMS USER_ID:", process.env.SMSLENZ_USER_ID);
console.log("PHONE:", phone);
console.log("MESSAGE:", smsMessage);

   // SMSlenz correct endpoint: https://www.smslenz.lk/api/send-sms
    const smsUrl = process.env.SMSLENZ_URL || "https://www.smslenz.lk/api/send-sms";

    // build request body with correct parameter names per SMSlenz docs
    const smsBody = {
      user_id: process.env.SMSLENZ_USER_ID,
      api_key: process.env.SMSLENZ_API_KEY,
      sender_id: process.env.SMSLENZ_SENDER_ID,
      contact: phone,
      message: smsMessage,
    };

    // log request details for debugging
    console.log("SMS request", smsUrl, smsBody);

    const sms = await fetch(smsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(smsBody),
    });

    const smsText = await sms.text();

    // if the third‑party service returns a non‑2xx code we should treat it as a failure
    if (!sms.ok) {
      console.error("SMS API returned non‑ok status", sms.status, smsText);
      return Response.json(
        {
          success: false,
          status: sms.status,
          error: "SMS service error",
          sms: smsText,
        },
        { status: 502 }
      );
    }

    console.log("SMS Response:", smsText);

    return Response.json({
      success: true,
      sms: smsText,
    });

  } catch (error) {

    console.error("Notify Error:", error);

    return Response.json({
      success: false,
      error: "SMS sending failed",
    });

  }

}