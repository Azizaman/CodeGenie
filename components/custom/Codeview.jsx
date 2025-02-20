"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2, Loader2Icon } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";


function Codeview() {
  const {id}=useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages } = useContext(MessagesContext);
  const UpdateFiles=useMutation(api.workspace.UpdateFiles)
  const convex=useConvex();
  const [loading,setLoading]=useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const UpdateTokens = useMutation(api.users.UpdateToken); // ✅ Fix: Correct way to call the mutation

  




  useEffect(()=>{
    id&&GetFiles();

  },[id])
  const GetFiles = async () => {
    setLoading(true);
    try {
      const result = await convex.query(api.workspace.GetworkspaceData, {
        workspaceId: id,
      });
  
      const mergeFiles = {
        ...Lookup.DEFAULT_FILE,
        ...(result?.fileData || {}),
      };
      setFiles(mergeFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
    setLoading(false)
  };
  
  useEffect(() => {
    if (messages.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role === "user") {
        GenrateAiCode();
      }
    }
  }, [messages]);

  const GenrateAiCode = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + " " + Prompt.CODE_GEN_PROMPT;
  
    try {
      const result = await axios.post("/api/gen-ai-code", { prompt: PROMPT });
  
      console.log("AI Response:", result.data);
  
      const aiResp = result.data;
      const mergeFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
      setFiles(mergeFiles);
  
      await UpdateFiles({ workspaceId: id, files: aiResp?.files });
  
      // 🔥 Fetch latest user details
      const latestUserDetail = await convex.query(api.users.GetUser, {
        email: userDetail.email,
      });
  
      if (!latestUserDetail?._id) {
        console.error("Error: User ID is missing or invalid", latestUserDetail);
        alert("User ID is invalid. Please re-login.");
        return;
      }
  
      // 🔥 Deduct tokens based on generated code size
      const tokenUsage = JSON.stringify(aiResp?.files).length / 10; // Example: 1 token per 10 characters
      const remainingTokens = Number(latestUserDetail?.token) - tokenUsage;
  
      if (remainingTokens >= 0) {
        await UpdateTokens({
          userId: latestUserDetail._id, // ✅ Ensure this is correct
          token: remainingTokens,
        });
  
        setUserDetail({ ...latestUserDetail, token: remainingTokens });
  
        console.log("Tokens deducted from codeview:", tokenUsage, "Remaining:", remainingTokens);
      } else {
        console.error("Insufficient tokens.");
        alert("You have run out of tokens. Please purchase more.");
      }
    } catch (error) {
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  return (
    <div className="relative">
      <div className="bg-[#181818] w-full p-2 border rounded-full">
        <div className="flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${
              activeTab === "code" && "text-blue-500 bg-blue-500 bg-opacity-25 px-2 rounded-full"
            }`}
          >
            code
          </h2>
          <h2
            onClick={() => setActiveTab("preview")}
            className={`text-sm cursor-pointer ${
              activeTab === "preview" && "text-blue-500 bg-blue-500 bg-opacity-25 px-2 rounded-full"
            }`}
          >
            preview
          </h2>
        </div>
      </div>
      <SandpackProvider
        key={JSON.stringify(files)}
        files={files}
        template="react"
        theme="dark"
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
          },
        }}
        options={{
          externalResources: ["https://unpkg.com/@tailwindcss/browser@4"],
        }}
      >
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <SandpackPreview style={{ height: "80vh" }} showNavigator={true} />
          )}
        </SandpackLayout>
      </SandpackProvider>
      {loading &&<div className="p-10 bg-gray-900 opacity-80 absolute top-0  rounded-lg w-full h-full flex items-center justify-center">
        <Loader2Icon className="animate-spin h-10 w-10 text-white"/> 
        <h2 className="text-white ">Generating your files...</h2>

      </div>}
    </div>
  );
}

export default Codeview;
