import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount, currency } = await req.json();

    // Retrieve keys from environment variables
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;
    const key_secret = process.env.RAZORPAY_SECRET;

    if (!key_id || !key_secret) {
      throw new Error("Razorpay API keys are missing in environment variables");
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount, // in smallest currency unit (e.g., paise for INR)
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
