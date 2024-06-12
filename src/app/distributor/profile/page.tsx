"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import { getProfile } from "@/services/auth";
import {getReviewsByDistributor} from "@/services/reviews";
import ReviewInProfile from "@/components/ReviewInProfile";

export default function ProfilePage() {
  const router = useRouter();
  const [showAllReviews, setShowAllReviews] = useState(false);

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

  const handleShowAllReviews = () => {
    setShowAllReviews(true);
  };

  const topReviews = reviewsData?.reviews.slice(0, 5) || [];
  const remainingReviews = reviewsData?.reviews.slice(5) || [];

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
      <div className="pl-[90px] md:pl-[110px] pr-[12px] md:pr-[60px] pt-[10px] md:pt-[20px] pb-[9px] md:pb-[30px] pb-[80px] bg-[#36719314] w-full md:flex md:gap-[7px]">
        <div className="bg-white md:w-[50%] md:h-full rounded-lg pl-[30px] pr-[50px] border border-[#EBEBEE] shadow-md pt-[13px]">

            <div className="rounded-full md:w-[104px] md:h-[104px] flex justify-center items-center overflow-hidden ">
              <img src={profileData.distributor.img_url ? profileData.distributor.img_url : "/profile_avatar.png"} alt="" className="w-[100px] h-[100px] object-cover" />
            </div>

            <div className="bg-[#367193] md:w-[104px] rounded-xl justify-center text-center px-[8px] flex items-center py-[3px] mt-[-10px] relative mb-[15px]">
              <span className=" uppercase font-montserrat text-xs font-bold text-white">distributor</span>
            </div>


          <div className=" border border-[#00000026] rounded-[4px] shadow-sm md:pr-[8px] md:mt-[9px] font-outfit font-medium text-sm relative">
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
            <button className="text-[#1F1F1FCC] bg-[#F0EFFA] rounded-[50px] px-[5px] md:px-[20px] py-[0] md:py-[3px] absolute top-[5px] right-[2px] md:top-[10px] md:right-[8px]" onClick={() => router.push("/distributor/profile/edit")}>
              Edit
            </button>
          </div>
        </div>

        <div className="md:w-[50%] rounded-lg overflow-hidden shadow-md py-[17px] px-[12px] bg-white border border-[#EBEBEE]">
          <div className="rounded-[7px] py-[8px] px-[9px] font-outfit">
            <p className=" font-medium text-[14px]">Professional Details</p>
            <p className="text-[#49454FCC] text-[14px]">These are the professional details shown to users in the app.</p>
            <p className="text-[15px] mt-3 break-words border p-3 rounded-[7px]">{(profileData.distributor.details && profileData.distributor.details !== " ") ? profileData.distributor.details : "Please add company details"}</p>
          </div>

          <div className={'bg-[#AEDEFC] bg-opacity-10 py-1 rounded-lg px-4'}>
            <p className="font-medium text-[14px] mt-2 px-[9px]">Customer Reviews</p>
            <div className="flex flex-col gap-[8px] my-[8px]">
              {topReviews.length ? (
                  topReviews.slice().reverse().map(review => (
                      <ReviewInProfile key={review.id} review={review} role={'distributor'}/>
                  ))
              ) : (
                  <p>You have not received any reviews yet</p>
              )}
              {remainingReviews.length > 0 && !showAllReviews && (
                  <div className="flex justify-start mt-2">
                    <button
                        className="text-[#367193] underline"
                        onClick={handleShowAllReviews}
                    >
                      Show all reviews &rarr;
                    </button>
                  </div>
              )}
              {showAllReviews && remainingReviews.slice().reverse().map(review => (
                  <ReviewInProfile key={review.id} review={review} role={'distributor'} />
              ))}
            </div>
          </div>

        </div>
      </div>
  );
}
