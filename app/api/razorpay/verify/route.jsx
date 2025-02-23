import { NextResponse } from "next/server";
import crypto from "crypto";
import { internal } from "@/convex/_generated/api"; 
import { mutation, query } from "@/convex/_generated/server";

export async function POST(req) {
  try {
    const { paymentId, orderId, signature, userEmail, tokens } = await req.json();

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(orderId + "|" + paymentId)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Fetch user from Convex by email
    const user = await query(internal.users.GetUser, { email: userEmail });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Convert tokens to a number if needed (e.g., "50K" becomes 50000)
    const tokensToAdd =
      typeof tokens === "string"
        ? parseInt(tokens.replace(/[^\d]/g, ""), 10)
        : Number(tokens);

    // Use 0 as default if user.token is missing
    const currentTokens = Number(user.token) || 0;
    const newTokenCount = currentTokens + tokensToAdd;

    // Update user's token balance via AddTokens mutation
    await mutation(internal.users.AddTokens, { userId: user._id, tokensToAdd });

    return NextResponse.json({ success: true, newTokens: newTokenCount });
  } catch (error) {
    console.error("Error updating tokens:", error);
    return NextResponse.json({ success: false, error: "Failed to update tokens" }, { status: 500 });
  }
}
