"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import { getProfile } from "@/services/auth";
import {getReviewsByDistributor} from "@/services/reviews";
import ReviewInProfile from "@/components/ReviewInProfile";

export default function ProfilePage() {
  const router = useRouter();

  const { data: profileData, isLoading: profileDataLoading, isError: profileDataError } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getProfile(JSON.parse(token).token);
    },
  });

  const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError } = useQuery({
    queryKey: ["reviews"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getReviewsByDistributor(JSON.parse(token).token);
    },
    enabled: !!profileData,
  });

  console.log("Reviews in distributor profile: ", reviewsData)
  console.log("Distributor data: ", profileData)

  useEffect(() => {
    if (profileDataError) {
      toast.error("Session expired. Please log in again.");
      localStorage.removeItem("duken");
      router.replace("/login");
    }
  }, [profileDataError]);

  if (profileDataLoading || reviewsLoading)
    return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;

  if (profileDataError || reviewsError) return null;

  return (
      <div className="pl-[110px] pr-[76px] pt-[30px] pb-[80px] bg-[#36719314] w-full flex gap-[7px]">
        <div className="bg-white w-[50%] h-full rounded-lg pl-[30px] pr-[50px] border border-[#EBEBEE] shadow-md pt-[13px]"
             style={{"padding-bottom": "20px"}}>
          <div className=" rounded-full w-[104px] h-[104px] flex justify-center items-center overflow-hidden">
            <img src={profileData.distributor.img_url ? profileData.distributor.img_url : "/profile_avatar.png"} alt="" className="w-[100px] h-[100px] object-cover" />
          </div>

          <div className="bg-[#367193] w-[104px] rounded-xl text-center px-[8px] flex items-center py-[3px] mt-[-10px] relative mb-[15px]">
            <span className=" uppercase font-montserrat text-xs font-bold text-white ">distributor</span>
          </div>

          <div className=" border border-[#00000026] rounded-[4px] shadow-sm pr-[8px] mt-[9px] font-outfit font-medium text-sm relative">
            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Your company name</p>
              <p className="text-main">{profileData.distributor.company_name}</p>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>
            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Your name</p>
              <p className="text-main">{profileData.distributor.name}</p>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>
            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Email</p>
              <p className="text-main">{profileData.email}</p>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>
            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Company BIN</p>
              <p className="text-main">{profileData.distributor.bin}</p>
            </div>
            <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>
            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Phone</p>
              <p className="text-main">{profileData.distributor.phone_number}</p>
            </div>
            <button className="text-[#1F1F1FCC] bg-[#F0EFFA] rounded-[50px] px-[20px] py-[3px] absolute top-[10px] right-[8px]" onClick={() => router.push("/distributor/profile/edit")}>
              Edit
            </button>
          </div>
        </div>

        <div className="w-[50%] rounded-lg overflow-hidden shadow-md py-[17px] px-[12px] bg-white border border-[#EBEBEE]">
          <div className="rounded-[7px] py-[8px] px-[9px] font-outfit">
            <p className=" font-medium text-[14px]">Professional Details</p>
            <p className="text-[#49454FCC] text-[14px]">These are the professional details shown to users in the app.</p>
            <p className="text-[15px] mt-3 break-words border p-3 rounded-[7px]">{(profileData.distributor.details && profileData.distributor.details !== " ") ? profileData.distributor.details : "Please add company details"}</p>
          </div>

          <p className="font-medium text-[14px] mt-5 px-[9px]">Customer Reviews</p>
          <div className="flex flex-col gap-[8px] my-[8px]">
            {reviewsData?.reviews.length ?
                reviewsData.reviews.map(review => (
                <ReviewInProfile key={review.id} review={review} role={'distributor'}/>
            )) : (<p> You have not received any reviews yet</p>)}
          </div>
        </div>
      </div>
  );
}
