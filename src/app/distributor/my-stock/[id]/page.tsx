"use client";

import { useParams, useRouter } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { RiMapPinLine } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import { TiMessageTyping } from "react-icons/ti";
import { FaPen } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/services/product";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import {getReviewsByProductIdForDistributor} from "@/services/reviews";
import Review from "@/components/Review";

export default function page() {
  const [selectedImage, setSelectedImage] = useState("");
  const [productReviews, setProductReviews] = useState([])


  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading: productLoading, isError: productError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getProductById({ id, token: JSON.parse(token).token });
    },
  });

  const {data: reviewData, isLoading: reviewDataLoading, isError: reviewDataError } = useQuery({
    queryKey: ["reviewData_for_product_distributor", id],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getReviewsByProductIdForDistributor(id, JSON.parse(token).token);
    },
    enabled: !!product,
  });

  useEffect(() => {
    if (productError) {
      toast.error("An error occurred. Please log in.");
      localStorage.removeItem("duken");
      router.replace("/login");
    }
  }, [productError]);

  useEffect(() => {
    if (reviewData !== undefined){
      setProductReviews(reviewData.reviews)
    }
  }, [reviewData])

  if (productLoading || reviewDataLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (productError || reviewDataError) return null;

  return (
    <div className="pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex font-outfit">
      <div className="bg-white w-full h-full rounded-lg px-[50px] border border-[#EBEBEE] shadow-md flex flex-col gap-[16px] py-[50px] relative">
        <div className="flex pt-[25px] px-[30px] pb-[30px] border-b border-[#21212180]">
          <div className="flex flex-col flex-1 pr-[20px]">
            <div className="w-full aspect-square rounded-[8px] overflow-hidden">
              {product.product.ImgURLs !== null && product.product.ImgURLs.length > 0 ? (
                <img
                  alt="product photo"
                  src={selectedImage ? selectedImage : product.product.ImgURLs[0]}
                  style={{objectPosition: "center", height: "100%", width: "100%" }}
                  className={'object-contain'}
                />
              ) : (
                <img alt="product photo" src={"/3d_1.png"} style={{ objectFit: "cover", objectPosition: "center", height: "100%", width: "100%" }} />
              )}
            </div>
            <div className="flex gap-[15px] w-full mt-[28px] items-center justify-center">
              <button
                onClick={() => {
                  if (product.product.ImgURLs !== null && product.product.ImgURLs.length > 0) {
                    const currentIndex = selectedImage ? product.product.ImgURLs.indexOf(selectedImage) : 0;
                    setSelectedImage(product.product.ImgURLs[(currentIndex - 1 + product.product.ImgURLs.length) % product.product.ImgURLs.length]);
                  }
                }}
              >
                <IoChevronBackOutline size={18} color="black" />
              </button>
              {product.product.ImgURLs !== null && product.product.ImgURLs.length > 0 ? (
                product.product.ImgURLs.map((url: string, index: any) => (
                  <div
                    key={index}
                    className="w-[87px] h-[87px] rounded-[10px] overflow-hidden"
                    onClick={() => setSelectedImage(url)}
                    style={{
                      borderWidth: selectedImage === url ? 2 : 0,
                      borderColor: "black",
                    }}
                  >
                    <img
                      alt="product photo"
                      src={url}
                      style={{
                        objectPosition: "center",
                        height: "100%",
                        width: "100%",
                      }}
                      className={'object-contain'}
                    />
                  </div>
                ))
              ) : (
                <div
                  className="w-[87px] h-[87px] rounded-[10px] overflow-hidden"
                  style={{
                    borderWidth: 0,
                    borderColor: "black",
                  }}
                >
                  <img
                    alt="product photo"
                    src={"/3d_1.png"}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center",
                      height: "100%",
                      width: "100%",
                    }}
                  />
                </div>
              )}
              <button
                onClick={() => {
                  if (product.product.ImgURLs !== null && product.product.ImgURLs.length > 0) {
                    const currentIndex = selectedImage ? product.product.ImgURLs.indexOf(selectedImage) : 0;
                    setSelectedImage(product.product.ImgURLs[(currentIndex + 1) % product.product.ImgURLs.length]);
                  }
                }}
              >
                <IoChevronForwardOutline size={18} color="black" />
              </button>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center pl-[20px]">
            <div className="flex items-center gap-3">
              <span className=" font-montserrat font-semibold text-[26px]">{product.product.product_name}</span>
              <span className="text-[#3A4980] text-[20px] border-[#00000080] border rounded-xl px-[12px] font-bold">In stock: {product.product.stock}</span>
            </div>
            <p className="text-[#B9BBBF] font-outfit text-[20px] mr-2">{product.product.distributor.company_name}</p>
            <div className="flex items-center mt-2">
              <span className="font-outfit text-[18px] mr-2">{product.product.city}</span>
              <RiMapPinLine size={15} color="black" />
            </div>
            <div className="rounded-[20px] bg-[#FFC350CC] w-ful py-1 flex justify-center my-[19px]">
              <span className=" uppercase text-white">{product.product.category}</span>
            </div>
            <div className="pt-[21px] px-[15px] pb-[32px] mb-[38px] border rounded-[10px] border-black">
              <p className=" font-outfit text-[18px]">{product.product.product_description}</p>
            </div>
            <div className="border rounded-[10px] border-black py-[9px] flex items-center">
              <span className=" font-montserrat font-bold text-[26px] text-[#3A4980] ml-4 mr-5">{product.product.price} {'\u20B8'}</span>
              <div>
                <div className="flex gap-[9px]">
                  <div className="rounded-[20px] bg-[#FBF3EA] py-[8px] px-[10px] flex items-center justify-center gap-[5px]">
                    <FaRegStar size={9} color="#D48D3B" />
                    <span className=" font-outfit text-[14px] font-semibold text-[#D48D3B]">4.8</span>
                  </div>
                  <div className="rounded-[20px] bg-[#FBF3EA] py-[8px] px-[10px] flex items-center justify-center gap-[5px]">
                    <TiMessageTyping size={9} color="#3A4980" />
                    <span className=" font-outfit text-[14px] font-semibold text-[#3A4980]">67 Reviews</span>
                  </div>
                </div>
                <span className="text-[#3E9242] text-[12px] font-semibold font-outfit">93%</span>
                <span className="text-[#B9BBBF] text-[12px] font-semibold font-outfit"> of buyers have recommended this.</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className=" font-medium text-[18px] font-outfit mt-2">Customer Reviews</p>
          <div className="flex flex-col gap-[8px] my-[8px]">
            <div className="mt-[1px]">
              {productReviews ?
                  productReviews.slice().reverse().map((review: any) => (
                      <Review key={review.id} review={review} />
                  )) :
                  <p>There are no reviews yet</p>
              }
            </div>
          </div>
        </div>

        <div
          className="absolute w-[50px] h-[50px] top-[20px] right-[20px] rounded-full bg-[#367193] flex justify-center items-center cursor-pointer"
          onClick={() => router.push(`/distributor/my-stock/${id}/edit`)}
        >
          <FaPen size={25} color="white" />
        </div>
      </div>
    </div>
  );
}
