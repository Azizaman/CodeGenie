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
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const desktopSidebar = (
    <div className="hidden md:block h-screen bg-black text-white transition-all duration-300 overflow-auto w-64">
      <SidebarHeader className="p-2"></SidebarHeader>
      <SidebarContent className="p-5">
        <Button onClick={() => router.push('/')} className="text-sm md:text-base">
          <MessageCircleCode className="w-4 h-4 md:w-5 md:h-5" /> 
          <span className="ml-2">Start New Chat</span>
        </Button>
        <SidebarGroup>
          <WorkspaceHistory />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button onClick={() => router.push('/pricing')} className="text-sm md:text-base">
          Subscription
        </Button>
      </SidebarFooter>
    </div>
  );

  const mobileHeader = (
    <div className="md:hidden flex items-center justify-between p-4 bg-black text-white w-full fixed top-0 z-40">
      <div className="text-lg font-semibold">Menu</div>
      <button onClick={() => setIsMobileSidebarOpen((prev) => !prev)} className="p-1">
        {isMobileSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </div>
  );

  const mobileSidebar = (
    isMobileSidebarOpen && (
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileSidebarOpen(false)}></div>
        <div className="relative bg-black text-white w-full sm:w-64 h-full p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold">Menu</div>
            <button onClick={() => setIsMobileSidebarOpen(false)} className="p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mb-4">
            <Button 
              onClick={() => { setIsMobileSidebarOpen(false); router.push('/'); }}
              className="w-full text-sm md:text-base"
            >
              <MessageCircleCode className="w-4 h-4 md:w-5 md:h-5" />
              <span className="ml-2">Start New Chat</span>
            </Button>
          </div>
          <div className="mb-4">
            <WorkspaceHistory />
          </div>
          <div>
            <Button 
              onClick={() => { setIsMobileSidebarOpen(false); router.push('/pricing'); }}
              className="w-full text-sm md:text-base"
            >
              Subscription
            </Button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <>
      {mobileHeader}
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
}

export default AppSideBar;