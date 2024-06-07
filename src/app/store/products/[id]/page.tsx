"use client";

import { useParams, useRouter } from "next/navigation";
import { IoChevronBackOutline, IoChevronForwardOutline, IoCloseCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import { RiMapPinLine } from "react-icons/ri";
import { FaRegStar } from "react-icons/fa";
import { TiMessageTyping } from "react-icons/ti";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "react-spinners/PuffLoader";
import { getStoreProductById, addToCart } from "@/services/product_store";
import { PiPlusCircleThin, PiMinusCircleThin } from "react-icons/pi";
import { PiShoppingCart } from "react-icons/pi";
import ReactModal from "react-modal";
import { toast } from "react-toastify";
import ReviewForm from "@/components/ReviewForm";
import {getReviewsByProductIdForStore} from "@/services/reviews";
import {getStoreStatistics} from "@/services/orders_store";
import Review from "@/components/Review";

export default function page() {
  const [selectedImage, setSelectedImage] = useState("");
  const [modal, setModal] = useState(false);
  const [count, setCount] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [productReviews, setProductReviews] = useState([])

  const router = useRouter();

  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading: productLoading, isError: productError } = useQuery({
    queryKey: ["product_store", id],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getStoreProductById({ id, token: JSON.parse(token).token });
    },
  });

  const { data: statistics, isLoading: statisticsLoading, isError: statisticsError } = useQuery({
    queryKey: ["statistics_store"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getStoreStatistics(JSON.parse(token).token);
    },
  });

  const {data: reviewData, isLoading: reviewDataLoading, isError: reviewDataError } = useQuery({
    queryKey: ["reviewData_for_product_store"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getReviewsByProductIdForStore(id, JSON.parse(token).token);
    },
    enabled: !!product,
  });

  useEffect(() => {
    if (productError) {
      localStorage.removeItem("duken");
      router.replace("/login");
      toast.error("An error occurred. Please log in.");
    }
  }, [productError]);

  const dec = () => {
    if (count > 0) {
      setCount(count - 1);
    }
    if (count > product.product.stock) {
      setCount(product.product.stock);
    }
  };

  const inc = () => {
    if (count < product.product.stock) {
      setCount(count + 1);
    }
    if (count > product.product.stock) {
      setCount(product.product.stock);
    }
  };

  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"], refetchType: "all" });
      setModal(true);
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const addToCartHandler = () => {
    const formData = {
      quantity: count,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    add.mutate({ formData: formData, token: JSON.parse(token).token, id: id });
  };

  useEffect(() => {
    const needed_store_id = id
    if (statistics) {
      const array = statistics.orders
      console.log(array)
      const orderWithProductId = array.find(order => order.product_id === Number(needed_store_id));
      const hasProduct = orderWithProductId !== undefined;
      setShowReviewForm(hasProduct)
    }
  }, [statistics, id]);

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
                  style={{ objectPosition: "center", height: "100%", width: "100%" }}
                  className={'object-contain'}
                />
              ) : (
                <img alt="product photo" src={"/3d_1.png"} style={{ objectFit: "cover", objectPosition: "center", height: "100%", width: "100%" }} />
              )}
            </div>
            <div className="flex gap-[15px] w-full mt-[28px] items-center justify-center">
              <button
                onClick={() => {
                  if (product.product.ImgURLs !== null) {
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
                  if (product.product.ImgURLs !== null) {
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
              <span className="font-outfit text-[18px] mr-2">{product.product.distributor.city}</span>
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
            <div className="h-[42px] w-full flex gap-[16px] mt-[27px] justify-center">
              <div className="flex gap-[8px] items-center">
                <button onClick={dec}>
                  <PiMinusCircleThin color="black" style={{ width: 42, height: 42 }} />
                </button>
                <input
                  type="number"
                  className="pl-[15px] font-outfit text-[20px] h-full w-[100px] border border-black rounded-[10px] text-center"
                  max={product.product.stock.toString()}
                  min="0"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                />
                <button onClick={inc}>
                  <PiPlusCircleThin style={{ width: 42, height: 42 }} color="black" />
                </button>
              </div>
              <div
                onClick={() => {
                  if (count > product.product.stock) {
                    return toast.warn("You can't add more than the available stock");
                  }
                  if (count <= 0) {
                    return toast.warn("Please add at least one item");
                  }
                  addToCartHandler();
                }}
                className=" cursor-pointer h-full w-[250px] uppercase font-montserrat font-semibold rounded-[10px] text-white bg-[#66CD88] text-[20px] flex justify-center items-center gap-[8px]"
              >
                <span>ADD TO CART</span>
                <PiShoppingCart size={22} color="white" />
              </div>
            </div>
          </div>
        </div>
        <div>

          {showReviewForm && <ReviewForm data={product} />}

          <p className=" font-medium text-[18px] font-outfit">Customer Reviews</p>
          {/*<div className="flex flex-col gap-[8px] my-[8px]">*/}
          {/*  <div className="mt-[20px]">*/}
          {/*    {productReviews ?*/}
          {/*        productReviews.slice().reverse().map((review: any) => (*/}
          {/*            <Review key={review.id} review={review} />*/}
          {/*        )) :*/}
          {/*        <p>There are no reviews yet</p>*/}
          {/*    }*/}
          {/*  </div>*/}
          {/*</div>*/}

        </div>


        <ReactModal
          isOpen={modal}
          onRequestClose={() => setModal(false)}
          ariaHideApp={false}
          style={{
            content: {
              width: "60%",
              height: "fit-content",
              borderRadius: "20px",
              border: "1px solid #00000073",
              backgroundColor: "white",
              top: "25%",
              left: "25%",
            },
          }}
        >
          <div className="w-full h-full flex flex-col items-center">
            <div className=" w-fit py-[11px] px-[47px] mb-[26px] font-montserrat font-semibold rounded-[10px] text-white bg-[#66CD88] text-[20px] flex justify-center items-center">
              <span>This product was added to your cart</span>
            </div>
            <div className=" w-[60%] rounded-[10px] border-[0.5px] border-[#00000080] flex">
              <img
                src={product.product.ImgURLs !== null && product.product.ImgURLs.length > 0 ? product.product.ImgURLs[0] : "/3d_1.png"}
                alt="image"
                style={{objectPosition: "center", height: "100%", width: "50%" }}
                className={'object-contain'}
              />
              <div className="flex flex-col pap-[10px] justify-center">
                <span className="text-[26px] font-semibold font-montserrat ">{product.product.product_name}</span>
                <span className="text-[20px] font-outfit text-[#B9BBBF]">{product.product.distributor.company_name}</span>
                <span className="text-[20px] font-outfit">Quantity: {count}</span>
                <span className="text-[20px] font-outfit">Total price: ${parseFloat((count * product.product.price).toFixed(2))}</span>
              </div>
            </div>
            <div className="w-[60%] flex justify-center gap-[12px] mb-[40px] mt-[26px]">
              <button
                onClick={() => setModal(false)}
                className="rounded-[10px] bg-[#FFC350] text-white font-outfit text-[24px] py-1 px-5 h-fit uppercase flex flex-1 justify-center items-center"
              >
                OK
              </button>
              <button
                onClick={() => router.push("/store/my-cart")}
                className="rounded-[10px] bg-[#438DB8] text-white font-outfit text-[24px] py-1 px-5 h-fit flex flex-1 gap-[8px] justify-center items-center"
              >
                <span>Go to my cart</span>
                <PiShoppingCart size={24} color="white" />
              </button>
            </div>
          </div>
        </ReactModal>
      </div>
    </div>
  );
}
