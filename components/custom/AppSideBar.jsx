"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { MessageCircleCode } from "lucide-react";
import WorkspaceHistory from "./WorkspaceHistory";
import { useRouter, usePathname } from "next/navigation";

function AppSideBar() {
  const router = useRouter();
  const pathname = usePathname(); // Get current route

  // ✅ Prevent sidebar from unmounting when clicking a conversation
  const handleConversationClick = (workspaceId) => {
    if (pathname !== `/workspace/${workspaceId}`) {
      router.push(`/workspace/${workspaceId}`);
    }
  };

  // ✅ Keep sidebar state persistent across navigation
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsSidebarOpen(true); // Ensure sidebar stays open after navigation
  }, [pathname]);

  return (
    <div className={`h-screen bg-black text-white transition-all duration-300 overflow-auto ${isSidebarOpen ? "w-64" : "w-0 hidden"}`}>
      <SidebarHeader className="p-2">
       
      </SidebarHeader>
      <SidebarContent className="p-5">
        <Button onClick={() => router.push('/')}>
          <MessageCircleCode /> Start New Chat
        </Button>
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={()=>router.push('/pricing')}>Subscription</Button>
      </SidebarFooter>
    </div>
  );
}

export default AppSideBar;
