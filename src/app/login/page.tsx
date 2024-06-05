"use client";

import FormInput from "@/components/FormInput";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginUser } from "@/services/auth";
import { LoginData } from "@/types/auth";
import { toast } from "react-toastify";

export default function Login() {
  const router = useRouter();

  const [role, setRole] = useState<LoginData["role"]>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("duken");

    if (userToken) {
      if (JSON.parse(userToken).role === "store") return router.replace("/store/profile");
      if (JSON.parse(userToken).role === "distributor") return router.replace("/distributor/profile");
      if (JSON.parse(userToken).role === "admin") return router.replace("/admin");
    }
  }, []);

  const login = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      localStorage.setItem("duken", JSON.stringify({ token: data.token, role: role }));
      if (role === "store") {
        router.replace("/store/profile");
      } else if (role === "distributor") {
        router.replace("/distributor/profile");
      } else if (email === "admin@duken.kz" && role === "") {
        router.replace("/admin");
      }
    },
    onError: () => {
      toast.error("Invalid email or password. Please try again.");
    },
  });

  const handleSubmit = async () => {
    if (role !== "store" && role !== "distributor" && !(email === "admin@duken.kz")) {
      toast.warn("Please select a role");
      return;
    }
    if (!email || !password) {
      toast.warn("Please fill in all fields");
      return;
    }

    const formData: LoginData = {
      email,
      password,
      role: email === "admin@duken.kz" ? "admin" : role,
    };

    login.mutate(formData);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [email, password]);

  return (
    <div className="flex-1 flex">
      <div className="w-[45%] h-[100%] bg-[url('/auth_back.png')] bg-cover bg-center pl-11 pr-14 flex flex-col gap-[15px] pt-[10%] pb-[15%] justify-center">
        <p className="font-outfit font-semibold text-[22px] text-white">
          Our platform is designed to be intuitive and easy to use, ensuring a smooth experience for all users.
        </p>
        <div className="border-b-[3px] border-[#367193]"></div>
        <p className="font-outfit font-semibold text-[22px] text-white">
          Our platform is designed to be intuitive and easy to use, ensuring a smooth experience for all users.
        </p>
        <div className="border-b-[3px] border-[#367193]"></div>
        <p className="font-outfit font-semibold text-[26px] text-white">Follow us on social media and subscribe to our newsletter to stay updated</p>
      </div>
      <div className="h-[100%] flex-1 flex-col gap-[15px] pt-[10%] pb-[15%] flex items-center  shadow-md">
        <div>
          <p className="text-main font-outfit text-[24px] uppercase w-fit">Welcome to Duken</p>
          <p className="text-main font-outfit w-fit">
            Don't have an account yet?{" "}
            <a href="/registration" className="text-[#367193] underline">
              Sign up
            </a>
          </p>
        </div>
        {login.isPending ? (
          <div>is Loading</div>
        ) : (
          <>
            <div className="bg-[#36719314] rounded-lg flex flex-col w-[50%] overflow-hidden px-[17px] py-1">
              <label htmlFor="mySelect" className="font-outfit text-[12px] text-[#403A4B99]">
                Role
              </label>
              <select
                id="mySelect"
                value={role}
                onChange={(e) => setRole(e.target.value as LoginData["role"])}
                className="bg-transparent px-0 text-[14px] font-outfit w-full outline-none text-main"
              >
                <option value=""></option>
                <option value="store">Store</option>
                <option value="distributor">Distributor</option>
              </select>
            </div>
            <FormInput label="E-mail" id="text" type="text" onChange={(e) => setEmail(e.target.value)} />
            <FormInput label="Password" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
            <div className="border-b border-black w-[50%]"></div>
            <button onClick={handleSubmit} className="bg-[#367193] uppercase w-[50%] rounded-lg text-white font-montserrat font-semibold px-5 py-3">
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
