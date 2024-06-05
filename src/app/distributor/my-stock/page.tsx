"use client"

import StockTable from "@/components/StockTable";
import { getProducts } from "@/services/product";
import { IProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { AiFillPlusSquare } from "react-icons/ai";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";

export default function MyStockPage() {
  const router = useRouter();

  const columns = useMemo<ColumnDef<IProduct>[]>(
    () => [
      {
        accessorKey: "ImgURLs[0]",
        header: () => <span>Product Photo</span>,
      },
      {
        accessorKey: "product_name",
        header: () => <span>Product Name</span>,
      },
      {
        accessorKey: "price",
        header: () => <span>Price</span>,
      },
      {
        accessorKey: "stock",
        header: () => <span>Stock</span>,
      },
    ],
    []
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my_items"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getProducts(JSON.parse(token).token);
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("An error occurred. Please try again.");
      localStorage.removeItem("duken");
      router.replace("/login");
    }
  }, [isError]);

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  return (
    <div className="pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex min-h-[400px]">
      {data.products ? <StockTable data={data.products ? data.products : []} columns={columns} /> : (
        <div className="w-full bg-white rounded-[30px] py-[22px] pl-[22px] pr-[70px]">
          <div className="flex justify-between w-full mb-[15px]">
            <p className=" font-montserrat font-semibold text-[22px] text-main">My Items</p>
            <div
              className="rounded-[10px] bg-[#00AC4F99] px-[30px] py-2 flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => router.push("/distributor/my-stock/new-item")}
            >
              <span className="font-montserrat font-semibold text-white">Add Item</span>
              <AiFillPlusSquare size={20} color="white" />
            </div>
          </div>
          <p className=" font-outfit">Your stock is empty.</p>
        </div>
      )}
    </div>
  );
}
