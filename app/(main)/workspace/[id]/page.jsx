"use client";
import React from "react";
import AppSideBar from "@/components/custom/AppSideBar";
import Chatview from "@/components/custom/Chatview";
import Codeview from "@/components/custom/Codeview";

function Workspace() {
  return (
    <div className="flex">
      <AppSideBar />
      <div className="flex-1 pl-8 pt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Chatview />
        <div className="col-span-2">
          <Codeview />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
