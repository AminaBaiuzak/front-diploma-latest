"use client";

import { updateEmail } from "@/services/auth";
import { IUpdateEmail } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function page() {
  const [current_password, setCurrent_password] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const router = useRouter();

  const changeEmail = useMutation({
    mutationFn: updateEmail,
    onSuccess: () => {
      localStorage.removeItem("duken");
      router.replace("/login");
      toast.success("User email has changed successfully");
    },
    onError: () => {
      toast.error("Email change failed. Please try again.");
    },
  });

  const handleChange = () => {
    if (!current_password || !email) {
      toast.warn("Please fill in all fields");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.warn("Email should be in the correct format");
      return;
    }

    const formData: IUpdateEmail = {
      password: current_password,
      email,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    changeEmail.mutate({ emailData: formData, token: JSON.parse(token).token });
  };

  return (
    <div className="pl-[250px] pr-[216px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex">
      <div className="bg-white w-full h-full rounded-lg px-[170px] border border-[#EBEBEE] shadow-md flex flex-col items-center">
        <h1 className="font-outfit text-[22px] text-main font-medium mt-[56px]">Changing email</h1>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"old"} className="font-outfit font-medium text-[14px] text-main">
            Type your current password
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
          <label htmlFor={"Confirn"} className="font-outfit font-medium text-[14px] text-main">
            Type your new email
          </label>
          <input
            type={"email"}
            id={"Confirn"}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
