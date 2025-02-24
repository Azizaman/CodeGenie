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

export const countToken = (inputText) => {
  return inputText.trim().split(/\s+/).filter((word) => word).length * 2;
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
      const result = await axios.post("/api/ai-chat", { prompt: PROMPT });
      const aiResp = { role: "ai", content: result.data.response };
      
      setMessages((prev) => [...prev, aiResp]);
      await UpdateMessages({ messages: [...messages, aiResp], workspaceId: id });

      const latestUserDetail = await convex.query(api.users.GetUser, {
        email: userDetail.email,
      });

      const tokenUsage = countToken(aiResp.content);
      if (Number(latestUserDetail.token) >= tokenUsage) {
        const deductionResult = await UpdateTokens({
          userId: latestUserDetail._id,
          token: tokenUsage,
        });
        setUserDetail({ ...latestUserDetail, token: deductionResult.token });
      } else {
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
      setMessages((prev) => [...prev, { role: "user", content: input }]);
      setUserInput("");
    }
  };

  return (
    <div className="relative h-screen md:h-[80vh] flex flex-col">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className="p-3 rounded-lg mb-2 flex gap-2 items-start leading-7 text-sm md:text-base"
              style={{ backgroundColor: Colors.CHAT_BACKGROUND }}
            >
              {msg?.role === "user" && (
                <Image
                  src={userDetail?.picture}
                  alt="userImage"
                  width={30}
                  height={30}
                  className="rounded-full w-8 h-8 md:w-10 md:h-10"
                />
              )}
              <ReactMarkdown className="flex flex-col overflow-hidden">
                {msg.content}
              </ReactMarkdown>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-4">No messages yet. Start a conversation!</p>
        )}
        {loading && (
          <div className="p-3 rounded-lg mb-2 flex gap-2 items-start" style={{ backgroundColor: Colors.CHAT_BACKGROUND }}>
            <Loader2Icon className="animate-spin w-4 h-4 md:w-6 md:h-6" />
            <h2 className="text-sm md:text-base">Generating response...</h2>
          </div>
        )}
      </div>
      
      <div className="px-2 md:px-0 mt-4">
        <div className="p-3 md:p-5 border rounded-xl w-full" style={{ backgroundColor: Colors.BACKGROUND }}>
          <div className="flex gap-2 items-end">
            <textarea
              placeholder={Lookup.INPUT_PLACEHOLDER}
              onChange={(e) => setUserInput(e.target.value)}
              value={userInput}
              className="outline-none bg-transparent w-full h-16 md:h-24 resize-none text-sm md:text-base"
            />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className="bg-blue-500 h-7 w-7 md:h-9 md:w-9 p-1.5 md:p-2 rounded-md cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatview;