"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  OpenInCodeSandboxButton,
} from "@codesandbox/sandpack-react";
import Lookup from "@/data/Lookup";
import axios from "axios";
import { MessagesContext } from "@/context/MessagesContext";
import Prompt from "@/data/Prompt";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { UserDetailContext } from "@/context/UserDetailContext";

function Codeview() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("code");
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages } = useContext(MessagesContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const UpdateTokens = useMutation(api.users.UpdateToken);

  useEffect(() => {
    if (id) GetFiles();
  }, [id]);

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
    setLoading(false);
  };

  useEffect(() => {
    if (messages.length > 0) {
      if (activeTab !== "code") {
        setActiveTab("code");
      }
      const role = messages[messages.length - 1].role;
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
      const aiResp = result.data;
      const mergeFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files };
      setFiles(mergeFiles);
      await UpdateFiles({ workspaceId: id, files: aiResp?.files });

      const latestUserDetail = await convex.query(api.users.GetUser, {
        email: userDetail.email,
      });

      if (!latestUserDetail?._id) {
        alert("User ID is invalid. Please re-login.");
        return;
      }

      const tokenUsage = JSON.stringify(aiResp?.files).length / 100;
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
      console.error("Error generating AI code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col p-2 md:p-4 mb-7">
      {/* Navigation Bar */}
      <div className="bg-[#181818] w-full p-1 md:p-2 border rounded-full mb-2 md:mb-4">
        <div className="flex items-center flex-wrap bg-black p-1 w-full gap-2 md:gap-3 justify-center rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-xs md:text-sm cursor-pointer px-2 py-1 rounded-full ${
              activeTab === "code" ? "text-blue-500 bg-blue-500 bg-opacity-25" : ""
            }`}
          >
            Code Editor
          </h2>
          <h2
            onClick={() => {
              setActiveTab("preview");
              setTimeout(() => {
                document.querySelector("iframe")?.contentWindow?.location.reload();
              }, 500); // Ensure preview refreshes after switching tabs
            }}
            className={`text-xs md:text-sm cursor-pointer px-2 py-1 rounded-full ${
              activeTab === "preview" ? "text-blue-500 bg-blue-500 bg-opacity-25" : ""
            }`}
          >
            Live Preview
          </h2>
        </div>
      </div>

      {/* Sandpack Code Editor & Preview */}
      
      <SandpackProvider
        files={files}
        template="react"
        theme="dark"
        customSetup={{
          dependencies: {
            ...Lookup.DEPENDANCY,
            "react": "latest",
            "react-dom": "latest",
            "tailwindcss": "latest",
          },
        }}
        options={{
          externalResources: ["https://unpkg.com/@tailwindcss/browser@4"],
          showNavigator: true, // ✅ Ensures the "Run" button appears
          showLineNumbers: true, // Shows line numbers in the editor
          showInlineErrors: true, // Shows real-time errors
          autoReload: true, // ✅ Ensures preview reloads properly
          editorWidthPercentage: 60, // Adjust layout to speed up loading
          classes: {
            "sp-preview": "h-full",
            "sp-preview-container": "h-full",
          },
        }}
      >
        
          
        
        <SandpackLayout className="flex-1">
          {activeTab === "code" ? (
            <div className="flex flex-col md:flex-row w-full h-full">
              <SandpackFileExplorer className="h-full md:h-full w-full md:w-1/3 lg:h-full" />
              <SandpackCodeEditor className="h-full md:h-full w-full md:w-2/3 lg:h-full" />
            </div>
          ) : (
            <div className="w-full h-[calc(100vh-140px)]">
              <SandpackPreview
                className="h-full w-full"
                showNavigator={true}
                showRefreshButton={true} 
                style={{ minHeight: "400px" }}
                actionsChildren={
                  <button
                    className="sp-icon-rotate"
                    title="Refresh Preview"
                    onClick={() => document.querySelector("iframe")?.contentWindow?.location.reload()}
                  />
                }
              />
            </div>
          )}
          <OpenInCodeSandboxButton className={'items-center '}/>
        </SandpackLayout>
        
      </SandpackProvider>

      {/* Loader */}
      {loading && (
        <div className="p-10 bg-gray-900 bg-opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center">
          <Loader2Icon className="animate-spin h-8 w-8 md:h-10 md:w-10 text-white" />
          <h2 className="text-white ml-4 text-sm md:text-base">Generating your files...</h2>
        </div>
      )}
    </div>
  );
}

export default Codeview;
