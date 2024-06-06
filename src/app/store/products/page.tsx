"use client";

import StockTable from "@/components/StockTable";
import { getStoreProducts } from "@/services/product_store";
import { IProduct } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const router = useRouter();

  const columns = useMemo<ColumnDef<IProduct>[]>(
    () => [
      {
        accessorKey: "ImgURLs[0]",
        header: () => <span>Product Photo</span>,
          enableSorting: false,
      },
      {
        accessorKey: "product_name",
        header: () => <span>Product Name</span>,
          enableSorting: false,
          filterFn: "includesString",
      },
      {
        accessorKey: "price",
        header: () => <span>Price</span>,
          sortingFn: (rowA, rowB) => rowA.original.price - rowB.original.price,

      },
      {
        accessorKey: "stock",
        header: () => <span>Available quantity</span>,
          enableSorting: false,

      },
    ],
    []
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my_items_store"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getStoreProducts(JSON.parse(token).token);
    },
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("duken");
      router.replace("/login");
      toast.error("An error occurred. Please log in.");
    }
  }, [isError]);

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  return (
    <div className="pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex min-h-[400px]">
      <StockTable data={data.products ? data.products : []} columns={columns} />
    </div>
  );
}
