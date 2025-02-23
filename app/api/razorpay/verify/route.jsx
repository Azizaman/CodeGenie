import { NextResponse } from "next/server";
import crypto from "crypto";
import { api } from "@/convex/_generated/api";
import { mutation } from "@/convex/_generated/server";

export async function POST(req) {
  try {
    const { paymentId, orderId, signature, userEmail, tokens } = await req.json();

    // ✅ Verify payment signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // ✅ Fetch user by email
    const user = await mutation(api.users.GetUser, { email: userEmail });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // ✅ Add tokens to user's balance
    const updatedUser = await mutation(api.users.UpdateToken, {
      userId: user._id,
      tokensToAdd: tokens,
    });

    return NextResponse.json({ success: true, newTokens: updatedUser.newTokens });
  } catch (error) {
    console.error("Error updating tokens:", error);
    return NextResponse.json({ success: false, error: "Failed to update tokens" }, { status: 500 });
  }
}
