"use client";
import React from "react";
import Chatview from "@/components/custom/Chatview";
import Codeview from "@/components/custom/Codeview";

export default function Workspace() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      <Chatview />
      <div className="col-span-2">
        <Codeview />
      </div>
    </div>
  );
}
