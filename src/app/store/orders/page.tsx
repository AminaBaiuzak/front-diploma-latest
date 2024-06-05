"use client";

import OrdersTable from "@/components/OrdersTable";
import { getStoreOrders } from "@/services/orders_store";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingFn } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders_store"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getStoreOrders(JSON.parse(token).token);
    },
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("duken");
      router.replace("/login");
      toast.error("An error occurred. Please log in.");
    }
  }, [isError]);

  const sortStatusFn: SortingFn<Order> = (rowA, rowB, _columnId) => {
    const statusA = rowA.original.status;
    const statusB = rowB.original.status;
    const statusOrder = ["active", "closed"];
    return statusOrder.indexOf(statusB) - statusOrder.indexOf(statusA);
  };

  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      {
        accessorKey: "order_id",
        header: () => <span>Order ID</span>,
        enableSorting: false,
      },
      {
        accessorKey: "product.distributor.company_name",
        header: () => <span>Company Name</span>,
        enableSorting: false,
      },
      {
        accessorKey: "product.distributor.phone_number",
        header: () => <span>Phone Number</span>,
        enableSorting: false,
      },
      {
        accessorKey: "distributor_email",
        header: () => <span>Email</span>,
        enableSorting: false,
      },
      {
        accessorKey: "city",
        header: () => <span>City</span>,
        enableSorting: false,
      },
      {
        accessorKey: "product.product_name",
        header: () => <span>Product Name</span>,
        enableSorting: false,
        filterFn: "includesString",
      },
      {
        accessorKey: "total_price",
        header: () => <span>Total Price</span>,
        enableSorting: false,
      },
      {
        accessorKey: "status",
        header: () => <span>Status</span>,
        sortingFn: sortStatusFn,
      },
    ],
    []
  );

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  return (
    <div className="pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex min-h-[400px]">
      <OrdersTable data={data.orders} columns={columns} />
    </div>
  );
}
