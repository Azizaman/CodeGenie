import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import uuid4 from "uuid4";
import { api } from "@/convex/_generated/api";

function SigninDialog({ openDialog, closeDialog }) {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const CreateUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google Token Response:", tokenResponse);

      try {
        const userInfoResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse?.access_token}` },
          }
        );

        const user = userInfoResponse.data;
        console.log("Google User Info:", user);

        await CreateUser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
          uuid: uuid4(),
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }

        setUserDetail(user);
        closeDialog(false); // ✅ Close dialog correctly
      } catch (error) {
        console.error("Error during Google Login:", error);
      }
    },
    onError: (errorResponse) => console.error("Google Login Error:", errorResponse),
  });

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user"); // ✅ Remove user session
    }

    setUserDetail(null);
    window.location.reload(); // ✅ Reload to clear session
  };

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{Lookup.SIGNIN_HEADING}</DialogTitle>
          <DialogDescription>
            <div className="flex flex-col justify-center items-center font-bold gap-3">
              <h2>{Lookup.SIGNIN_HEADING}</h2>
              <div className="mt-2 text-center">{Lookup.SIGNIN_SUBHEADING}</div>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-400 mt-4"
                onClick={googleLogin}
              >
                Sign in with Google
              </Button>
              <div>{Lookup.SIGNIn_AGREEMENT_TEXT}</div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SigninDialog;
