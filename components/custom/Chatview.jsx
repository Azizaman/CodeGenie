"use client";
import { MessagesContext } from "@/context/MessagesContext";
import { UserDetailContext } from "@/context/UserDetailContext";
import { api } from "@/convex/_generated/api";
import Colors from "@/data/Colors";
import { useConvex, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Loader2Icon } from "lucide-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import Prompt from "@/data/Prompt";

// Token counting function
export const countToken = (inputText) => {
  return inputText.trim().split(/\s+/).filter((word) => word).length * 2; // Example: 2 tokens per word
};

function Chatview() {
  const { id } = useParams();
  const convex = useConvex();
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);

  const UpdateMessages = useMutation(api.workspace.UpdateMessages);
  const UpdateTokens = useMutation(api.users.UpdateToken);

  useEffect(() => {
    // Reload the page once for a new workspace id
    const hasReloaded = sessionStorage.getItem(`reloaded-${id}`);
    if (!hasReloaded) {
      sessionStorage.setItem(`reloaded-${id}`, "true");
      window.location.reload();
    } else {
      GetworkspaceData();
    }
  }, [id]);

  const GetworkspaceData = async () => {
    try {
      const result = await convex.query(api.workspace.GetworkspaceData, {
        workspaceId: id,
      });
      console.log("API Response:", result);
      setMessages(Array.isArray(result.messages) ? result.messages : []);
    } catch (error) {
      console.error("Error fetching workspace data:", error);
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
  
      if (lastMessage.role === "user" && !lastMessage.processed) {
        GetAiResponse();
  
        // Mark the message as processed to prevent infinite loop
        setMessages((prev) =>
          prev.map((msg, index) =>
            index === prev.length - 1 ? { ...msg, processed: true } : msg
          )
        );
      }
    }
  }, [messages]);
  

  const GetAiResponse = async () => {
    setLoading(true);
    const conversation = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));
    const PROMPT = `${Prompt.CHAT_PROMPT}\nUser Input: ${userInput}\nConversation:\n${messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n")}`;
  

    try {
      const result = await axios.post(
        "/api/ai-chat",
        {
          prompt: PROMPT,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const aiResp = {
        role: "ai",
        content: result.data.response,
      };

      setMessages((prev) => [...prev, aiResp]);

      await UpdateMessages({
        messages: [...messages, aiResp],
        workspaceId: id,
      });

      // Fetch latest user details before updating tokens
      const latestUserDetail = await convex.query(api.users.GetUser, {
        email: userDetail.email,
      });

      const tokenUsage = countToken(aiResp.content);
      const remainingTokens = Number(latestUserDetail?.token) - tokenUsage;

      if (remainingTokens >= 0) {
        await UpdateTokens({
          userId: latestUserDetail._id,
          token: remainingTokens,
        });

        // Update user details in the state
        setUserDetail({ ...latestUserDetail, token: remainingTokens });

        console.log("Tokens deducted from the chatview:", tokenUsage, "Remaining:", remainingTokens);
      } else {
        console.error("Insufficient tokens.");
        alert("You have run out of tokens. Please purchase more.");
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = (input) => {
    if (input.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: input,
        },
      ]);
      setUserInput("");
    }
  };

  return (
    <div key={id} className="relative h-[80vh] flex flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7"
              style={{
                backgroundColor: Colors.CHAT_BACKGROUND,
              }}
            >
              {msg?.role === "user" && (
                <Image
                  src={userDetail?.picture}
                  alt="userImage"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              <ReactMarkdown className="flex flex-col overflow-hidden">
                {msg.content}
              </ReactMarkdown>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
        {loading && (
          <div
            className="p-3 rounded-lg mb-2 flex gap-2 items-start"
            style={{
              backgroundColor: Colors.CHAT_BACKGROUND,
            }}
          >
            <Loader2Icon className="animate-spin" />
            <h2>Generating the response...</h2>
          </div>
        )}
      </div>
      <div className="flex gap-1 items-end">
        <div
          className="p-5 border rounded-xl max-w-xl w-full mt-3"
          style={{ backgroundColor: Colors.BACKGROUND }}
        >
          <div className="flex gap-2">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              onChange={(event) => setUserInput(event.target.value)}
              className="outline-none bg-transparent w-full h-24 max-h-56 resize-none"
              value={userInput}
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 h-8 w-8 p-2 rounded-md cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatview;