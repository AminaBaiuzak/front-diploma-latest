"use client";

import Image from "next/image";
import { IoArrowUpOutline, IoArrowDownOutline } from "react-icons/io5";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import ProductsTable from "@/components/ProductsTable";
import Loader from "react-spinners/PuffLoader";
import { getStatistics } from "@/services/orders";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IProductSell } from "@/types/product";
import { toast } from "react-toastify";
import BarChart from "@/components/BarChart";
import PieChart from "@/components/DoughnutChart";
import DoughnutChart from "@/components/DoughnutChart";

export default function StatisticsPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["statistics_store"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getStatistics(JSON.parse(token).token);
    },
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("duken");
      router.replace("/login");
      toast.error("An error occurred. Please log in.");
    }
  }, [isError]);

  const columns = useMemo<ColumnDef<IProductSell>[]>(
    () => [
      {
        accessorKey: "product.ImgURLs",
        header: () => <span>Product Photo</span>,
      },
      {
        accessorKey: "product.product_name",
        header: () => <span>Product Name</span>,
      },
      {
        accessorKey: "product.stock",
        header: () => <span>In stock</span>,
      },
      {
        accessorKey: "product.price",
        header: () => <span>Price</span>,
      },
      {
        accessorKey: "quantity",
        header: () => <span>Total Sales</span>,
      },
    ],
    []
  );

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  return (
    <div className="pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex flex-col gap-[24px]">
      <div className="h-[151px] w-[100%] bg-white rounded-[30px] flex">
        <div className="w-[60%] h-full flex gap-3 justify-center items-center">
          <div className="w-[84px] h-[84px] rounded-full bg-[#EFFFF6] flex justify-center items-center">
            <Image src="/overall.png" alt="" width={42} height={42} className="w-[42px] h-[42px]" quality={100} />
          </div>
          <div>
            <p className=" font-montserrat text-sm text-[#ACACAC]">Sold (overall)</p>
            <p className=" font-outfit font-semibold text-[32px] text-main">${data.sold_overall}</p>
            <div className="flex items-center gap-1">
              <IoArrowUpOutline size={15} color="#00AC4F" />
              <span className=" text-xs text-[#00AC4F] font-outfit font-bold">37.8%</span>
              <span className=" text-xs text-main font-outfit ">this year</span>
            </div>
          </div>
        </div>
        <div className="w-[40%] h-full flex justify-center items-center">
          <div className="w-full border-l border-[#F0F0F0] flex gap-3 justify-center items-center">
            <div className="w-[84px] h-[84px] rounded-full bg-[#CDF4FF] flex justify-center items-center">
              <Image src="/month.png" alt="" width={42} height={42} className="w-[42px] h-[42px]" quality={100} />
            </div>
            <div>
              <p className=" font-montserrat text-sm text-[#ACACAC]">Sold in month</p>
              <p className=" font-outfit font-semibold text-[32px] text-main">${data.sold_in_month}</p>
              <div className="flex items-center gap-1">
                <IoArrowDownOutline size={15} color="#D0004B" />
                <span className=" text-xs text-[#D0004B] font-outfit font-bold">2%</span>
                <span className=" text-xs text-main font-outfit ">this month</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-around gap-[15px]">
        <div className="w-[880px]">
          <BarChart />
        </div>
        <div className="w-[400]">
          <DoughnutChart rating={90} />
        </div>
      </div>


      <ProductsTable data={data.orders} columns={columns} />
    </div>
  );
}
