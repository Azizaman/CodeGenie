"use client";
import React, { useState, useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Lookup from "@/data/Lookup";
import Colors from "@/data/Colors";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContext";

const Pricing = () => {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const latestUserDetail = useQuery(api.users.GetUser, { email: userDetail?.email || "" }, { enabled: !!userDetail?.email }) || {};
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      script.onerror = () => console.error("Failed to load Razorpay SDK");
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

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: plan.price * 100,
        currency: "INR",
        name: "CodeCraft AI",
        description: plan.name,
        order_id: orderId,
        handler: async (response) => {
          const verifyResponse = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              tokens: plan.value,
              userId: userDetail._id,
              userEmail: userDetail.email,
            }),
          });
          const data = await verifyResponse.json();
          if (data.success) {
            setUserDetail({ ...userDetail, token: data.newTokens });
          }
        },
        prefill: {
          name: userDetail.name || "User",
          email: userDetail.email || "user@example.com",
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
    <div className="min-h-screen py-8 md:py-12 px-2 md:px-6 lg:px-8" style={{ backgroundColor: Colors.BACKGROUND }}>
      <div className="mb-6 text-center">
        <div className="text-base md:text-lg font-medium">Remaining Tokens: {latestUserDetail.token || 0}</div>
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto">{Lookup.PRICING_DESC}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {Lookup.PRICING_OPTIONS.map((plan, index) => (
            <div
              key={index}
              className="p-4 md:p-6 rounded-xl shadow-lg flex flex-col justify-between bg-gray-800 text-white"
            >
              <div>
                <h3 className="text-lg md:text-xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm md:text-base mb-1">Tokens: {plan.tokens}</p>
                <p className="text-xs md:text-sm mb-4 text-gray-300">{plan.desc}</p>
                <p className="text-base md:text-lg font-semibold">Price:RS {plan.price}</p>
              </div>
              <Button
                className="w-full mt-4 text-sm md:text-base"
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
};

export default Pricing;