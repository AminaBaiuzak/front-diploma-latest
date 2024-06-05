"use client"

import { updatePassword } from "@/services/auth";
import { IUpdatePassword } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function page() {
  const [current_password, setCurrent_password] = useState<string>("")
  const [new_password, setNew_password] = useState<string>("")
  const [confirm_password, setConfirm_password] = useState<string>("")

  const router = useRouter();

  const changePassword = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      localStorage.removeItem("duken");
      router.replace("/login");
      toast.success("User password has changed successfully");
    },
    onError: () => {
      toast.error("Password change failed. Please try again.");
    },
  });

  const handleChange = () => {
    if (!current_password || !new_password || !confirm_password) {
      toast.warn("Please fill in all fields");
      return;
    }
    if (new_password.length < 8) {
      toast.warn("Password must be at least 8 characters long");
      return;
    }
    if (!/\d/.test(new_password)) {
      toast.warn("Password must contain at least one number");
      return;
    }
    if (!/[a-z]/.test(new_password)) {
      toast.warn("Password must contain at least one lowercase letter");
      return;
    }
    if (new_password !== confirm_password) {
      toast.warn("Passwords do not match");
      return;
    }
    const formData: IUpdatePassword = {
      current_password,
      new_password,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    changePassword.mutate({ passwordData: formData, token: JSON.parse(token).token });
  };

  return (
    <div className="pl-[250px] pr-[216px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex">
      <div className="bg-white w-full h-full rounded-lg px-[170px] border border-[#EBEBEE] shadow-md flex flex-col items-center">
        <h1 className="font-outfit text-[22px] text-main font-medium mt-[56px]">Changing password</h1>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"old"} className="font-outfit font-medium text-[14px] text-main">
            Type your old password
          </label>
          <input
            type={"password"}
            id={"old"}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={current_password}
            onChange={(e) => setCurrent_password(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"new"} className="font-outfit font-medium text-[14px] text-main">
            Type your new password
          </label>
          <input
            type={"password"}
            id={"new"}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={new_password}
            onChange={(e) => setNew_password(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"Confirn"} className="font-outfit font-medium text-[14px] text-main">
            Confirn your new password
          </label>
          <input
            type={"password"}
            id={"Confirn"}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={confirm_password}
            onChange={(e) => setConfirm_password(e.target.value)}
          />
        </div>
        <div className="w-full flex justify-end mt-[15px] mb-[30px]">
          <button className="rounded-[20px] bg-[#438DB8] text-white font-outfit text-[16px] py-1 px-4 h-fit" onClick={handleChange}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
