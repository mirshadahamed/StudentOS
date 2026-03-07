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

    console.log("SMS TOKEN:", process.env.SMSLENZ_TOKEN);
console.log("SMS SENDER:", process.env.SMSLENZ_SENDER);
console.log("PHONE:", phone);
console.log("MESSAGE:", smsMessage);

   const sms = await fetch("https://smslenz.lk/api/v1/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.SMSLENZ_TOKEN}`,
      },
      body: JSON.stringify({
  sender: process.env.SMSLENZ_SENDER,
  numbers: phone,
  message: smsMessage,
})
    });

    const smsText = await sms.text();

console.log("SMS Response:", smsText);

    // console.log("SMS Response:", smsData);

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