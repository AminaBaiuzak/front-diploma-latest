"use client";

import FormInput from "@/components/FormInput";
import { RegistrationData } from "@/types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import { registerUser } from "@/services/auth";
import { toast } from "react-toastify";

export default function Registration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");

  const [name, setName] = useState("");
  const [bin, setBin] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(initialRole);
  const [city, setCity] = useState("");

  console.log("Helooooooooooooooooooo", initialRole)

  const cities = useQuery({
    queryKey: ["cities"],
    queryFn: () => {
      return axios.get("https://countriesnow.space/api/v0.1/countries/cities/q?country=Kazakhstan");
    },
    staleTime: Infinity,
  });

  const registration = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.replace("/login");
      toast.success("Registration successful. Please log in.");
    },
    onError: () => {
      toast.error("Registration failed. Please try again.");
    },
  });

  const handleSubmit = async () => {
    if (role !== "store" && role !== "distributor") {
      toast.warn("Please select a role");
      return;
    }
    if (!name || !bin || !companyName || !phoneNumber || !email || !password || !confirmPassword || !city) {
      toast.warn("Please fill in all fields");
      return;
    }

    if (bin.length !== 12 || !/^\d+$/.test(bin)) {
      toast.warn("BIN should be exactly 12 digits and consist only of numbers");
      return;
    }

    if (phoneNumber.includes("_")) {
      toast.warn("Phone number should be exactly 16 digits long and in the correct format");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.warn("Email should be in the correct format");
      return;
    }

    if (password.length < 8) {
      toast.warn("Password must be at least 8 characters long");
      return;
    }
    if (!/\d/.test(password)) {
      toast.warn("Password must contain at least one number");
      return;
    }
    if (!/[a-z]/.test(password)) {
      toast.warn("Password must contain at least one lowercase letter");
      return;
    }
    if (password !== confirmPassword) {
      toast.warn("Passwords do not match");
      return;
    }

    const formData: RegistrationData = {
      name,
      bin,
      company_name: companyName,
      phone_number: phoneNumber,
      email,
      password,
      role,
      city,
    };

    registration.mutate(formData);
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
  }, [name, bin, companyName, phoneNumber, email, password, confirmPassword, role, city]);

  return (
    <div className="flex-1 flex">
      <div className="hidden md:flex w-[45%] h-[100%] bg-[url('/auth_back.png')] bg-cover bg-center pl-11 pr-14 flex flex-col gap-[15px] pt-[10%] pb-[15%] justify-center">
        <p className="font-outfit font-semibold text-[22px] text-white">Register today and start enjoying the benefits</p>
        <div className="border-b-[3px] border-[#367193]"></div>
        <p className="font-outfit font-semibold text-[22px] text-white">
          Registration is free and gives you access to personalized offers and updates tailored to your business needs.
        </p>
        <div className="border-b-[3px] border-[#367193]"></div>
        <p className="font-outfit font-semibold text-[26px] text-white">Join our community today!</p>
      </div>
      <div className="h-[100%] flex-1 flex-col gap-[15px] pt-[60px] pb-[15%] flex items-center  shadow-md">
        <div>
          <p className="text-main font-outfit text-[24px] uppercase w-fit">Welcome to Duken</p>
          <p className="text-main font-outfit w-fit text-[16x]">
            Already have an account?{" "}
            <a href="/login" className="text-[#367193] underline text-[20px]">
              Log in
            </a>
          </p>
        </div>
        <div className="bg-[#36719314] rounded-lg flex flex-col w-[50%] overflow-hidden px-[17px] py-1">
          <label htmlFor="mySelect" className="font-outfit text-[12px] text-[#403A4B99]">
            Role
          </label>
          <select
            id="mySelect"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-transparent px-0 text-[14px] font-outfit w-full outline-none text-main"
          >
            <option value=""></option>
            <option value="store">Store</option>
            <option value="distributor">Distributor</option>
          </select>
        </div>
        <FormInput label="Name" id="name" type="text" onChange={(e) => setName(e.target.value)} />
        <FormInput label="BIN" id="bin" type="text" onChange={(e) => setBin(e.target.value)} />
        <FormInput label="Company name" id="company_name" type="text" onChange={(e) => setCompanyName(e.target.value)} />
        <FormInput label="Phone number" id="phone_number" type="tel" onChange={(e) => setPhoneNumber(e.target.value)} />
        <FormInput label="E-mail" id="e_mail" type="email" onChange={(e) => setEmail(e.target.value)} />
        <FormInput label="Password" id="password" type="password" onChange={(e) => setPassword(e.target.value)} />
        <FormInput label="Confirm password" id="confirm_password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
        <div className="bg-[#36719314] rounded-lg flex flex-col w-[50%] overflow-hidden px-[17px] py-1">
          <label htmlFor="mySelect" className="font-outfit text-[12px] text-[#403A4B99]">
            City
          </label>
          <select value={city} onChange={(e) => setCity(e.target.value)} className="bg-transparent px-0 text-[14px] font-outfit w-full outline-none text-main">
            <option value="" disabled></option>
            {cities.data?.data.data.map((city: any) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="border-b border-black w-[50%]"></div>
        <button type="submit" onClick={handleSubmit} className="bg-[#367193] uppercase w-[50%] rounded-lg text-white font-montserrat font-semibold px-5 py-3">
          Register
        </button>
      </div>
    </div>
  );
}
