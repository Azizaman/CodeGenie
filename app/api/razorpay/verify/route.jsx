import { NextResponse } from "next/server";
import crypto from "crypto";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function POST(req) {
  try {
    const { paymentId, orderId, signature, tokens, userId, userEmail } = await req.json();

    // Step 1: Verify Razorpay signature.
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");
    if (generatedSignature !== signature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 }
      );
    }

    // Step 2: Determine the effective user ID.
    let effectiveUserId = userId;
    if (!effectiveUserId) {
      if (userEmail) {
        const user = await fetchQuery(api.users.GetUser, { email: userEmail });
        if (!user || !user._id) {
          return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
          );
        }
        effectiveUserId = user._id;
      } else {
        return NextResponse.json(
          { success: false, error: "User not logged in" },
          { status: 403 }
        );
      }
    }

    // Step 3: Convert tokens value to a number.
    let tokensToAdd;
    if (typeof tokens === "string") {
      const tokensLower = tokens.toLowerCase();
      tokensToAdd =
        tokensLower === "unlimited" || tokensLower === "unmited"
          ? 1000000
          : parseInt(tokens, 10);
    } else if (typeof tokens === "number") {
      tokensToAdd = tokens;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid token format" },
        { status: 400 }
      );
    }
    if (isNaN(tokensToAdd) || tokensToAdd <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid token amount" },
        { status: 400 }
      );
    }

    // Step 4: Update the user's token balance via Convex using fetchMutation.
    const updatedUser = await fetchMutation(api.users.AddTokens, {
      userId: effectiveUserId,
      tokensToAdd,
    });
    console.log("Updated user:", updatedUser);

    return NextResponse.json({ success: true, newTokens: updatedUser.token });
  } catch (error) {
    console.error("Error updating tokens:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tokens" },
      { status: 500 }
    );
  }
}
