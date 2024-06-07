"use client";

import { getStoreProfile, registerUser } from "@/services/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import ReviewInProfile from "@/components/ReviewInProfile";
import { deleteReview, getReviewsByStore } from "@/services/reviews";

export default function ProfilePage() {
  const router = useRouter();

  const { data: profileData, isLoading: profileDataLoading, isError: profileDataError } = useQuery({
    queryKey: ["profile_store"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getStoreProfile(JSON.parse(token).token);
    },
  });

  const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError } = useQuery({
    queryKey: ["reviews_store"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getReviewsByStore(JSON.parse(token).token);
    },
    enabled: !!profileData,
  });

  console.log("Reviews received: ", reviewsData);
  console.log(reviewsData?.reviews.length);

  useEffect(() => {
    if (profileDataError) {
      localStorage.removeItem("duken");
      toast.error("An error occurred. Please log in.");
      router.replace("/login");
    }
  }, [profileDataError]);

  const deleteReviewByStore = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success("Your review has been deleted");
    },
    onError: () => {
      toast.error("Deletion of review failed");
    },
  });

  const handleDelete = async (review_id) => {
    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    deleteReviewByStore.mutate({ review_id, token: JSON.parse(token).token });
  };

  if (profileDataLoading || reviewsLoading)
    return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (profileDataError || reviewsError) return null;

  return (
      <div className="pl-[110px] pr-[76px] pt-[30px] pb-[80px] bg-[#36719314] w-full flex gap-[7px]">
        <div className="bg-white w-[50%] h-full rounded-lg pl-[30px] pr-[50px] border border-[#EBEBEE] shadow-md  py-[13px]">
          <div className="flex flex-col items-start">
            <div className="w-fit flex flex-col items-center mb-[10px]">
              <div className=" rounded-full w-[104px] h-[104px] flex justify-center items-center overflow-hidden">
                <img
                    src={profileData.store.img_url ? profileData.store.img_url : "/profile_avatar.png"}
                    alt=""
                    className="w-[100px] h-[100px] object-cover"
                />
              </div>
              <div className="bg-[#FFC350] w-fit rounded-xl text-center px-[8px] flex items-center py-[3px] mt-[-10px] relative">
              <span className=" uppercase font-montserrat text-[10px] font-bold text-white ">
                shop representative
              </span>
              </div>
            </div>
          </div>

          <div className=" border border-[#00000026] rounded-[4px] shadow-sm pr-[8px] mt-[9px] font-outfit font-medium text-sm relative">
            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Your company name</p>
              <p className="text-main">{profileData.store.company_name}</p>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>

            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Your name</p>
              <p className="text-main">{profileData.store.name}</p>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>

            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Email</p>
              <p className="text-main">{profileData.email}</p>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>

            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Company BIN</p>
              <p className="text-main">{profileData.store.bin}</p>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-[#D9D9D9] to-white"></div>

            <div className="py-[10px] flex flex-col justify-center pl-[8px] my-[10px]">
              <p className="text-[#1F1F1FB2]">Phone</p>
              <p className="text-main">{profileData.store.phone_number}</p>
            </div>

            <button
                className="text-[#1F1F1FCC] bg-[#F0EFFA] rounded-[50px] px-[20px] py-[3px] absolute top-[10px] right-[8px]"
                onClick={() => router.push("/store/profile/edit")}
            >
              Edit
            </button>
          </div>
        </div>

        <div className="w-[50%] rounded-lg overflow-hidden shadow-md py-[17px] px-[12px] bg-white border border-[#EBEBEE]">
          <div className="rounded-[7px] py-[8px] px-[9px] font-outfit">
            <p className=" font-medium text-[14px]">Professional Details</p>
            <p className="text-[#49454FCC] text-[14px]">
              These are the professional details shown to users in the app. These are the professional details shown to users in the app.
            </p>
            <p className="text-[15px] mt-5 break-words border p-3 rounded-[7px]">
              {profileData.store.details && profileData.store.details !== " " ? profileData.store.details : "Please add company details"}
            </p>
          </div>

          <div className={'bg-[#FFC350] bg-opacity-10 py-1 rounded-lg px-4'}>
            <p className="font-medium text-[14px] mt-2 px-[9px]">My Reviews</p>

            <div className="flex flex-col gap-[8px] my-[8px]">
              {reviewsData?.reviews.length ? (
                  reviewsData.reviews.slice().reverse().map((review) => (
                      <ReviewInProfile key={review.id} review={review} role={'store'} onDelete={() => handleDelete(review.id)} />
                  ))
              ) : (
                  <p>You have not written any reviews yet</p>
              )}
            </div>
          </div>

        </div>
      </div>
  );
}
