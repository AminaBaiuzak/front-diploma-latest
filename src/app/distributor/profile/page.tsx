"use client";

import { getProfile } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CiCircleMinus } from "react-icons/ci";
import { GoStarFill } from "react-icons/go";
import { MdOutlinePeopleAlt } from "react-icons/md";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getProfile(JSON.parse(token).token);
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("duken");
      router.replace("/login");
    }
  }, [isError]);

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  return (
    <div className="pl-[110px] pr-[76px] pt-[30px] pb-[80px] bg-[#36719314] w-full flex gap-[7px]">
      <div className="bg-white w-[50%] h-full rounded-lg pl-[30px] pr-[50px] border border-[#EBEBEE] shadow-md  pt-[13px]">

        <div className=" rounded-full w-[104px] h-[104px] flex justify-center items-center overflow-hidden">
          <img src={data.distributor.img_url ? data.distributor.img_url : "/profile_avatar.png"} alt="" className="w-[100px] h-[100px] object-cover"  />
        </div>

        <div className="bg-[#367193] w-[104px] rounded-xl text-center px-[8px] flex items-center py-[3px] mt-[-10px] relative mb-[15px]">
          <span className=" uppercase font-montserrat text-xs font-bold text-white ">distributor</span>
        </div>

        <div className=" border border-[#00000026] rounded-[4px] shadow-sm pr-[8px] mt-[9px] font-outfit font-medium text-sm relative">
          <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
            <p className="text-[#1F1F1FB2]">Your company name</p>
            <p className="text-main">{data.distributor.company_name}</p>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>
          <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
            <p className="text-[#1F1F1FB2]">Your name</p>
            <p className="text-main">{data.distributor.name}</p>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>
          <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
            <p className="text-[#1F1F1FB2]">Email</p>
            <p className="text-main">{data.email}</p>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>
          <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
            <p className="text-[#1F1F1FB2]">Company BIN</p>
            <p className="text-main">{data.distributor.bin}</p>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>
          <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
            <p className="text-[#1F1F1FB2]">Phone</p>
            <p className="text-main">{data.distributor.phone_number}</p>
          </div>
          <button
            className="text-[#1F1F1FCC] bg-[#F0EFFA] rounded-[50px] px-[20px] py-[3px] absolute top-[10px] right-[8px]"
            onClick={() => router.push("/distributor/profile/edit")}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="w-[50%] rounded-lg overflow-hidden shadow-md py-[17px] px-[12px] bg-white border border-[#EBEBEE]">

        <div className="rounded-[7px] py-[8px] px-[9px] font-outfit">
          <p className=" font-medium text-[14px]">Professional Details</p>
          <p className="text-[#49454FCC] text-[14px]">This are the professional details shown to users in the app.
            This are the professional details shown to users in the app.</p>
          <p className="text-[15px] mt-5 break-words">{(data.distributor.details && data.distributor.details !== " ") ? data.distributor.details : "Please add company details"}</p>
        </div>

        <p className="font-medium text-[14px] mt-5 px-[9px]">Customer Reviews</p>

        <div className="flex flex-col gap-[8px] my-[8px]">

          <div className=" w-full rounded-[7px] border border-[#CECECE] pt-[5px] pb-[20px] px-[10px]">
            <p className="text-[#413B89] text-[14px] font-outfit font-medium">Ankit Srivastava</p>
            <div className="flex gap-[4px] mt-1">
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#49454FCC" />
            </div>
            <p className=" font-outfit text-[#49454FCC] mt-1 text-[14px]">
              "Wow! I'm blown away by the quality and functionality of this product. I've been using it for a few
              weeks now, and it has exceeded my expectations."
            </p>
          </div>
          <div className=" w-full rounded-[7px] border border-[#CECECE] pt-[5px] pb-[20px] px-[10px]">
            <p className="text-[#413B89] text-[14px] font-outfit font-medium">Ankit Srivastava</p>
            <div className="flex gap-[4px] mt-1">
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#49454FCC" />
            </div>
            <p className=" font-outfit text-[#49454FCC] mt-1 text-[14px]">
              "Wow! I'm blown away by the quality and functionality of this product. I've been using it for a few
              weeks now, and it has exceeded my expectations."
            </p>
          </div>
          <div className=" w-full rounded-[7px] border border-[#CECECE] pt-[5px] pb-[20px] px-[10px]">
            <p className="text-[#413B89] text-[14px] font-outfit font-medium">Ankit Srivastava</p>
            <div className="flex gap-[4px] mt-1">
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#49454FCC" />
            </div>
            <p className=" font-outfit text-[#49454FCC] mt-1 text-[14px]">
              "Wow! I'm blown away by the quality and functionality of this product. I've been using it for a few
              weeks now, and it has exceeded my expectations."
            </p>
          </div>
          <div className=" w-full rounded-[7px] border border-[#CECECE] pt-[5px] pb-[20px] px-[10px]">
            <p className="text-[#413B89] text-[14px] font-outfit font-medium">Ankit Srivastava</p>
            <div className="flex gap-[4px] mt-1">
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#49454FCC" />
            </div>
            <p className=" font-outfit text-[#49454FCC] mt-1 text-[14px]">
              "Wow! I'm blown away by the quality and functionality of this product. I've been using it for a few
              weeks now, and it has exceeded my expectations."
            </p>
          </div>
          <div className=" w-full rounded-[7px] border border-[#CECECE] pt-[5px] pb-[20px] px-[10px]">
            <p className="text-[#413B89] text-[14px] font-outfit font-medium">Ankit Srivastava</p>
            <div className="flex gap-[4px] mt-1">
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#49454FCC" />
            </div>
            <p className=" font-outfit text-[#49454FCC] mt-1 text-[14px]">
              "Wow! I'm blown away by the quality and functionality of this product. I've been using it for a few
              weeks now, and it has exceeded my expectations."
            </p>
          </div>
          <div className=" w-full rounded-[7px] border border-[#CECECE] pt-[5px] pb-[20px] px-[10px]">
            <p className="text-[#413B89] text-[14px] font-outfit font-medium">Ankit Srivastava</p>
            <div className="flex gap-[4px] mt-1">
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#FFB525" />
              <GoStarFill size={20} color="#49454FCC" />
            </div>
            <p className=" font-outfit text-[#49454FCC] mt-1 text-[14px]">
              "Wow! I'm blown away by the quality and functionality of this product. I've been using it for a few
              weeks now, and it has exceeded my expectations."
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
