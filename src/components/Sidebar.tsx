"use client";

import { IoPersonOutline, IoListSharp, IoBarChartOutline, IoCubeOutline } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { CiShop } from "react-icons/ci";
import { PiShoppingCart } from "react-icons/pi";

export default function Sidebar() {
  const [pageName, setPageName] = useState<
    "Profile" | "Statistics" | "Orders" | "My Stock" | "Products" | "My cart" | ""
  >("");
  const [isUser, setIsUser] = useState(false)

  const router = useRouter();
  const pathname: string = usePathname();
  const role = pathname.startsWith("/distributor") ? "distributor" : "store";


  useEffect(() => {
    if (pathname.startsWith(`/${role}/profile`) || pathname === `/admin`) setPageName("Profile");
    if (pathname.startsWith(`/${role}/statistics`)) setPageName("Statistics");
    if (pathname.startsWith(`/${role}/orders`)) setPageName("Orders");
    if (pathname.startsWith(`/distributor/my-stock`)) setPageName("My Stock");
    if (pathname.startsWith(`/store/products`)) setPageName("Products");
    if (pathname.startsWith(`/store/my-cart`)) setPageName("My cart");
  }, [pathname]);

  useEffect(() => {
    const userToken = localStorage.getItem("duken");

    if (userToken) {
      setIsUser(true)
    }
  }, []);


  return (
    <div
      className="w-[81px] h-full bg-white hover:w-[300px] *:hover:w-[250px] transition-all duration-500 absolute overflow-hidden pl-5 pr-4 py-8 z-20"
      style={pathname === "/login" || pathname === "/registration" || (pathname === "/about" && !isUser) || (pathname === "/contact" && !isUser) ? { display: "none" } : undefined}
    >
      <div
        className="w-[46px] h-[46px] pl-[10px] pr-2 rounded-lg cursor-pointer transition-all duration-500 flex items-center mb-2 overflow-hidden"
        style={{ backgroundColor: pageName === "Profile" ? "#367193" : "transparent" }}
        onClick={() => {
          setPageName("Profile");
          if (role === "store") router.push("/store/profile");
          else if (role === "distributor") router.push("/distributor/profile");
          else if (role === "admin") router.push("/admin");
        }}
      >
        <IoPersonOutline size={26} color={pageName === "Profile" ? "white" : "#9197B3"} className="overflow-visible" />
        <span
          className="ml-4 font-montserrat font-medium text-sm overflow-hidden flex-1"
          style={{ color: pageName === "Profile" ? "white" : "#9197B3" }}
        >
          Profile
        </span>
        {pageName === "Profile" ? <></> : <FaAngleRight size={13} color="#9197B3" />}
      </div>
      <div
        className="w-[46px] h-[46px] pl-[10px] pr-2 rounded-lg cursor-pointer transition-all duration-500 flex items-center mb-2 overflow-hidden"
        style={{
          backgroundColor: pageName === "Statistics" ? "#367193" : "transparent",
          display: pathname === "/admin" ? "none" : "flex",
        }}
        onClick={() => {
          setPageName("Statistics");
          router.push(`/${role}/statistics`);
        }}
      >
        <IoBarChartOutline
          size={26}
          color={pageName === "Statistics" ? "white" : "#9197B3"}
          className="overflow-visible"
        />
        <span
          className="ml-4 font-montserrat font-medium text-sm overflow-hidden flex-1"
          style={{ color: pageName === "Statistics" ? "white" : "#9197B3" }}
        >
          Statistics
        </span>
        {pageName === "Statistics" ? <></> : <FaAngleRight size={13} color="#9197B3" />}
      </div>
      <div
        className="w-[46px] h-[46px] pl-[10px] pr-2 rounded-lg cursor-pointer transition-all duration-500 flex items-center mb-2 overflow-hidden"
        style={{
          backgroundColor: pageName === "Orders" ? "#367193" : "transparent",
          display: pathname === "/admin" ? "none" : "flex",
        }}
        onClick={() => {
          setPageName("Orders");
          router.push(`/${role}/orders`);
        }}
      >
        <IoListSharp size={26} color={pageName === "Orders" ? "white" : "#9197B3"} className="overflow-visible" />
        <span
          className="ml-4 font-montserrat font-medium text-sm overflow-hidden flex-1"
          style={{ color: pageName === "Orders" ? "white" : "#9197B3" }}
        >
          Orders
        </span>
        {pageName === "Orders" ? <></> : <FaAngleRight size={13} color="#9197B3" />}
      </div>
      <div
        className="w-[46px] h-[46px] pl-[10px] pr-2 rounded-lg cursor-pointer transition-all duration-500 flex items-center mb-2 overflow-hidden"
        style={{
          backgroundColor: pageName === "My Stock" ? "#367193" : "transparent",
          display: pathname === "/admin" || role === "store" ? "none" : "flex",
        }}
        onClick={() => {
          setPageName("My Stock");
          router.push("/distributor/my-stock");
        }}
      >
        <IoCubeOutline size={26} color={pageName === "My Stock" ? "white" : "#9197B3"} className="overflow-visible" />
        <span
          className="ml-4 font-montserrat font-medium text-sm text-nowrap overflow-hidden flex-1"
          style={{ color: pageName === "My Stock" ? "white" : "#9197B3" }}
        >
          My Stock
        </span>
        {pageName === "My Stock" ? <></> : <FaAngleRight size={13} color="#9197B3" />}
      </div>
      <div
        className="w-[46px] h-[46px] pl-[10px] pr-2 rounded-lg cursor-pointer transition-all duration-500 flex items-center mb-2 overflow-hidden"
        style={{
          backgroundColor: pageName === "Products" ? "#367193" : "transparent",
          display: pathname === "/admin" || role === "distributor" ? "none" : "flex",
        }}
        onClick={() => {
          setPageName("Products");
          router.push("/store/products");
        }}
      >
        <CiShop size={26} color={pageName === "Products" ? "white" : "#9197B3"} className="overflow-visible" />
        <span
          className="ml-4 font-montserrat font-medium text-sm text-nowrap overflow-hidden flex-1"
          style={{ color: pageName === "Products" ? "white" : "#9197B3" }}
        >
          Products
        </span>
        {pageName === "Products" ? <></> : <FaAngleRight size={13} color="#9197B3" />}
      </div>
      <div
        className="w-[46px] h-[46px] pl-[10px] pr-2 rounded-lg cursor-pointer transition-all duration-500 flex items-center mb-2 overflow-hidden"
        style={{
          backgroundColor: pageName === "My cart" ? "#367193" : "transparent",
          display: pathname === "/admin" || role === "distributor" ? "none" : "flex",
        }}
        onClick={() => {
          setPageName("My cart");
          router.push("/store/my-cart");
        }}
      >
        <PiShoppingCart size={26} color={pageName === "My cart" ? "white" : "#9197B3"} className="overflow-visible" />
        <span
          className="ml-4 font-montserrat font-medium text-sm text-nowrap overflow-hidden flex-1"
          style={{ color: pageName === "My cart" ? "white" : "#9197B3" }}
        >
          My cart
        </span>
        {pageName === "My cart" ? <></> : <FaAngleRight size={13} color="#9197B3" />}
      </div>
    </div>
  );
}
