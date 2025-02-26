"use client";

import React, { useContext, useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Colors from "@/data/Colors";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useRouter } from "next/navigation";
import SigninDialog from "./SigninDialog"; // Import Sign-in Dialog

function Header() {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user"); // Remove user data
    }
    window.location.reload(); // Refresh page to clear state
    router.push("/"); // Redirect to home page
   
  };

  return (
    <div className="p-1 flex justify-between items-center w-full">
      {/* Logo */}
      <Image
        src={"/logo.png"}
        alt="Logo"
        width={60}
        height={60}
        className="w-12 h-12 md:w-16 md:h-16 cursor-pointer"
        onClick={() => router.push("/")}
      />

      {/* Subscription Button */}
      <Button
        className="text-sm md:text-base"
        onClick={() => router.push("/pricing")}
        style={{ backgroundColor: Colors.BLUE }}
      >
        Subscription
      </Button>

      {/* Sign In / Logout Buttons */}
      <div className="flex gap-4">
        {!userDetail?.name ? (
          <Button
            className="bg-blue-500 text-white hover:bg-blue-400"
            onClick={() => setOpenDialog(true)}
          >
            Sign In
          </Button>
        ) : (
          <Button
            className="bg-red-500 mr-4 text-white hover:bg-red-400"
            onClick={handleLogout} // Call logout function
          >
            Logout
          </Button>
        )}
      </div>

      {/* Sign In Dialog */}
      <SigninDialog openDialog={openDialog} closeDialog={setOpenDialog} />
    </div>
  );
}

export default Header;
