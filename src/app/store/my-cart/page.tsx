"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loader from "react-spinners/PuffLoader";
import { getCarts, updateCartItem, deleteCartItem } from "@/services/product_store";
import { FaAngleLeft } from "react-icons/fa6";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { TfiTrash } from "react-icons/tfi";
import { BsArrowRight } from "react-icons/bs";
import { createOrder } from "@/services/orders_store";
import axios from "axios";
import { toast } from "react-toastify";

export default function page() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("");
  const [address, setAddress] = useState("");

  const cities = useQuery({
    queryKey: ["cities"],
    queryFn: () => {
      return axios.get("https://countriesnow.space/api/v0.1/countries/cities/q?country=Kazakhstan");
    },
    staleTime: Infinity,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["carts"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getCarts(JSON.parse(token).token);
    },
  });

  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carts"],
        refetchType: "all",
      });
    },
    onError: () => {
      toast.warn("An error occurred. Please try again.");
    }
  });

  const inc = (id: number, count: number, stock: number) => {
    if (count + 1 > stock) return toast.warn("You can't add more than available stock");

    const formData = {
      quantity: count + 1,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    update.mutate({
      formData: formData,
      token: JSON.parse(token).token,
      id: id.toString(),
    });
  };

  const dec = (id: number, count: number, stock: number) => {
    if (count - 1 <= 0) return toast.warn("You can't decrease less than 1");

    const formData = {
      quantity: count - 1,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    update.mutate({
      formData: formData,
      token: JSON.parse(token).token,
      id: id.toString(),
    });
  };

  const deleteItem = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carts"],
        refetchType: "all",
      });
    },
    onError: () => {
      toast.warn("An error occurred. Please try again.");
    }
  });

  const deleteHandler = (id: number) => {
    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    deleteItem.mutate({ token: JSON.parse(token).token, id: id.toString() });
  };

  const createOrderFn = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["carts"],
        refetchType: "all",
      });
      router.push("/store/orders");
      toast.success("Order created successfully");
    },
  });

  const createOrderHandler = () => {
    if (!data.cart) return toast.warn("Cart is empty");

    if (!selectedCity) return toast.warn("Please select a city");
    if (!address) return toast.warn("Please enter an address");

    const formData = {
      city: selectedCity,
      address: address,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      toast.warn("Token not found. Please log in");
      return router.replace("/login");
    }

    createOrderFn.mutate({
      formData: formData,
      token: JSON.parse(token).token,
    });
  };

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  return (
    <div className="pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex font-outfit">
      <div className="bg-white w-full h-full rounded-lg px-[50px] border border-[#EBEBEE] shadow-md flex flex-col gap-[16px] py-[50px] relative">
        <div onClick={() => router.push("/store/products")} className=" cursor-pointer flex gap-[8px] w-full pb-[10px] border-b border-[#D0CFCF] items-center">
          <FaAngleLeft size={15} color="black" />
          <span className="text-[18px] font-semibold font-montserrat">Continue Shopping</span>
        </div>
        <div>
          <p className="text-[18px] font-mudium font-montserrat">Shopping cart</p>
          <p className="text-[14px] font-outfit">You have {data.cart ? data.cart.items.length : "0"} item in your cart</p>
        </div>
        <div className="flex gap-[34px] items-end w-full h-full">
          <div className="w-[65%] h-full">
            {data.cart &&
              data.cart.items
                .slice()
                .sort((a: any, b: any) => b.id - a.id)
                .map((item: any) => (
                  <div key={item.id} className="w-full rounded-[15px] shadow-md flex justify-between pl-[15px] pr-[28px] items-center py-[15px]">
                    <div className="flex gap-[22px]">
                      <img
                        src={item.product.ImgURLs !== null && item.product.ImgURLs.length > 0 ? item.product.ImgURLs[0] : "/3d_1.png"}
                        alt="abstract"
                        className="w-[90px] h-[65px] rounded-[8px] overflow-hidden object-cover"
                      />
                      <div className="flex flex-col justify-center gap-[10px]">
                        <p className="text-[18px] font-semibold font-montserrat">{item.product.product_name}</p>
                        <p className="text-[14px] font-medium font-outfit">Distributor: {item.product.distributor.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-[40px] items-center">
                      <div className="flex">
                        <span className="text-[22px] font-outfit font-semibold mr-1">{item.quantity}</span>
                        <div className="flex flex-col justify-center">
                          <FaCaretUp
                            size={15}
                            color="black"
                            className=" cursor-pointer"
                            onClick={() => inc(item.product_id, item.quantity, item.product.stock)}
                          />
                          <FaCaretDown
                            size={15}
                            color="black"
                            className=" cursor-pointer"
                            onClick={() => dec(item.product_id, item.quantity, item.product.stock)}
                          />
                        </div>
                      </div>
                      <p className="font-medium text-[20px] font-outfit">{parseFloat((item.quantity * item.product.price).toFixed(2))} {'\u20B8'}</p>
                      <TfiTrash size={25} color="black" className=" cursor-pointer" onClick={() => deleteHandler(item.product_id)} />
                    </div>
                  </div>
                ))}
            {data.cart && data.cart.items.length > 0 && (
              <div className="w-full ">
                <div className="w-full border-b border-[#D0CFCFB2] mt-[15px]">
                  <p className=" font-montserrat text-[18px] font-medium">Address of delivery</p>
                </div>
                <div className="w-full mt-[15px]">
                  <p className="text-main font-outfit text-lg">Location</p>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="text-main text-lg px-[14px] py-2 border border-[#42506666] rounded-[8px] w-full"
                  >

                    <option value="">
                    </option>

                    {cities.data?.data.data.map((city: any) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-[15px]">
                  <label htmlFor={"name"} className="font-outfit text-lg text-main">
                    Address
                  </label>
                  <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 shadow-sm">
                    <input
                      type={"text"}
                      id={"name"}
                      className="bg-transparent text-lg font-outfit w-full outline-none"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 flex h-full">
            <div className="w-full rounded-[20px] py-[14px] px-[19px] bg-[#438DB8BF] text-white font-montserrat font-medium">
              <p className="font-semibold text-[22px] mb-[24px]">Card Details</p>
              <p className="">Card type</p>
              <div className="flex gap-[17px] justify-between mb-[27px]">
                <div className="w-[85px] h-[65px] rounded-[5px] bg-[#D9D9D933] overflow-hidden">
                  <img src="/mastercard.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="w-[85px] h-[65px] rounded-[5px] bg-[#D9D9D933] overflow-hidden">
                  <img src="/visa.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="w-[85px] h-[65px] rounded-[5px] bg-[#D9D9D933] overflow-hidden">
                  <img src="/rupay.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="w-[85px] h-[65px] rounded-[5px] bg-[#D9D9D933] overflow-hidden flex justify-center items-center">
                  <p className="font-semibold">See all</p>
                </div>
              </div>
              <p className="mb-[8px]">Name on card</p>
              <input type="text" className="h-[40px] w-full bg-white rounded-[6px] text-main px-2 mb-[11px]" />
              <p className="mb-[8px]">Card Number</p>
              <input type="text" className="h-[40px] w-full bg-white rounded-[6px] text-main px-2 mb-[11px]" />
              <div className="flex gap-[8px] pb-[22px] border-b border-white">
                <div className="flex flex-1 mb-[8px] flex-col">
                  <p className="">Expiration date</p>
                  <input type="text" className="h-[40px] w-full bg-white rounded-[6px] text-main px-2" />
                </div>
                <div className="flex flex-1 flex-col mb-[22px]">
                  <p className="">CVV</p>
                  <input type="text" className="h-[40px] w-full bg-white rounded-[6px] text-main px-2" />
                </div>
              </div>
              <div className="flex justify-between mb-[6px] mt-[14px]">
                <p>Subtotal</p>
                <p>{data.cart ? parseFloat(data.cart.total_price.toFixed(2)) : "0"} {'₸'}</p>
              </div>
              <div className="flex justify-between mb-[6px]">
                <p>Shipping</p>
                <p>0 {'₸'}</p>
              </div>
              <div
                onClick={createOrderHandler}
                className="bg-[#66CD88] rounded-[12px] w-full h-[60px] flex justify-between px-[24px] items-center mt-3 cursor-pointer"
              >
                <p className="">{data.cart && parseFloat(data.cart.total_price.toFixed(2))} {'₸'}</p>
                <button className="flex items-center">
                  <span className="mr-[6px]">Checkout</span>
                  <BsArrowRight size={16} color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
