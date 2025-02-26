"use client";

import Lookup from "@/data/Lookup";
import { ArrowRight, Link } from "lucide-react";
import React, { useContext, useState } from "react";
import Colors from "@/data/Colors";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import SigninDialog from "./SigninDialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function Hero() {
  const [userInput, setUserInput] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail } = useContext(UserDetailContext);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    console.log("User Detail:", userDetail);

    if (!userDetail?.name) {
      setOpenDialog(true);
      return;
    }

    // Normalize the user ID:
    let userIdString = "";
    if (typeof userDetail._id === "string") {
      userIdString = userDetail._id;
    } else if (typeof userDetail._id === "object" && userDetail._id !== null) {
      userIdString = userDetail._id._id || userDetail._id.id || "";
    }

    if (!userIdString) {
      console.error("User ID is missing or invalid", userDetail);
      alert("Your session may have expired. Please log in again.");
      return;
    }

    const msg = { role: "user", content: input };
    setMessages((prev) => (Array.isArray(prev) ? [...prev, msg] : [msg]));

    try {
      console.log("Full user detail:", userDetail);
      // Pass only the normalized user ID to the mutation.
      const response = await CreateWorkspace({
        user: userIdString,
        messages: [msg],
      });

      console.log("CreateWorkspace Response:", response);

      if (!response || typeof response !== "string") {
        console.error("Error: Invalid workspace response", response);
        alert("Workspace creation failed. Please try again.");
        return;
      }

      console.log("Workspace Created:", response);
      router.push(`/workspace/${response}`);
    } catch (error) {
      console.error("Error creating workspace:", error);
      alert("An error occurred while creating the workspace.");
    }
  };

  return (
    <div className="flex flex-col items-center mt-16 md:mt-32 gap-4 mx-4 md:ml-72">
      <h2 className="font-bold text-4xl md:text-5xl text-center">{Lookup.HERO_HEADING}</h2>
      <p className="text-gray-400 text-base md:text-lg text-center">{Lookup.HERO_DESC}</p>
      <div
        className="p-6 border rounded-xl max-w-xl w-full mt-6 shadow-md"
        style={{ backgroundColor: Colors.BACKGROUND }}
      >
        <div className="flex gap-2">
          <textarea
            placeholder={Lookup.INPUT_PLACEHOLDER}
            onChange={(e) => setUserInput(e.target.value)}
            className="outline-none bg-transparent w-full h-32 max-h-56 resize-none text-sm"
            value={userInput}
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-blue-500 text-white h-10 w-10 p-2 rounded-full cursor-pointer hover:bg-blue-400 transition-colors"
            />
          )}
        </div>
      </div>
      {/* Dark-themed Suggestions Container */}
      <div className="w-full max-w-xl ml-2 rounded-lg p-4 flex flex-wrap gap-2">
        {Lookup.SUGGSTIONS.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onGenerate(suggestion)}
            className="bg-gray-700 text-white px-3 py-1 rounded-full hover:bg-gray-600 transition-colors text-sm ml-8"
          >
            {suggestion}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {!userDetail ? (
          <Button
            className="bg-blue-500 text-white hover:bg-blue-400"
            onClick={() => setOpenDialog(true)}
          >
            Sign In
          </Button>
        ) : (
          <Button
            className="bg-red-500 text-white hover:bg-red-400"
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("user");
              }
              window.location.reload();
            }}
          >
            Logout
          </Button>
        )}
      </div>
      <SigninDialog openDialog={openDialog} closeDialog={setOpenDialog} />
    </div>
  );
}

export default Hero;
