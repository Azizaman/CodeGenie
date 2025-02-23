"use client";
import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Lookup from "@/data/Lookup";
import Colors from "@/data/Colors";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";

function Pricing() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const latestUserDetail =
    useQuery(api.users.GetUser, { email: userDetail?.email || "" }, { enabled: !!userDetail?.email }) || {};
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load the Razorpay script and set the state when it's loaded.
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        console.error("Failed to load Razorpay SDK");
      };
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  const handlePayment = async (plan) => {
    if (!userDetail?._id) {
      alert("Please login to purchase a plan.");
      return;
    }

    if (!razorpayLoaded) {
      alert("Razorpay SDK not loaded. Please try again.");
      return;
    }

    setLoadingPlan(plan.name);

    try {
      // Step 1: Create Order (Backend)
      const orderResponse = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: plan.price * 100, currency: "INR" }),
      });
      const { orderId } = await orderResponse.json();
      if (!orderId) {
        alert("Payment failed. Try again.");
        setLoadingPlan(null);
        return;
      }

      // Step 2: Open Razorpay Payment Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: plan.price * 100,
        currency: "INR",
        name: "Your SaaS App",
        description: plan.name,
        order_id: orderId,
        handler: async (response) => {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

          // Step 3: Verify Payment & Update Tokens
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              userEmail: userDetail.email, // use email from context
              tokens: plan.tokens,
            }),
          });
          const data = await verifyResponse.json();
          if (data.success) {
            alert(`Tokens Added! New Balance: ${data.newTokens}`);
            setUserDetail({ ...userDetail, token: data.newTokens });
          } else {
            alert("Payment verification failed. Contact support.");
          }
        },
        prefill: {
          name: userDetail.name || "User",
          email: userDetail.email || "user@example.com",
          contact: "9999999999",
        },
        theme: { color: Colors.PRIMARY },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error processing payment.");
    }

    setLoadingPlan(null);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: Colors.BACKGROUND }}>
      <div>
        <div>Remaining Tokens: {latestUserDetail.token || 0}</div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simple, transparent pricing</h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">{Lookup.PRICING_DESC}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Lookup.PRICING_OPTIONS.map((plan, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl shadow-lg"
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="mb-6 text-gray-600">{plan.desc}</p>
              <Button
                className="w-full"
                style={{ backgroundColor: Colors.PRIMARY }}
                onClick={() => handlePayment(plan)}
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name ? "Processing..." : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
