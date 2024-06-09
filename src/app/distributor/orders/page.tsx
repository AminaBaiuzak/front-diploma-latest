"use client";

import OrdersTable from "@/components/OrdersTable";
import { getOrders } from "@/services/orders";
import { Order } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, SortingFn } from "@tanstack/react-table";
import {usePathname, useRouter} from "next/navigation";
import { useEffect, useMemo } from "react";
import Loader from "react-spinners/PuffLoader";
import { toast } from "react-toastify";
import { FilterFn } from '@tanstack/react-table';


export default function OrdersPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getOrders(JSON.parse(token).token);
    },
  });

    console.log('Data is', data)

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("duken");
      router.replace("/login");
      toast.error("An error occurred. Please log in.");
    }
  }, [isError]);

  const sortStatusFn: SortingFn<Order> = (rowA, rowB, _columnId) => {
    const statusA = rowA.original.status
    const statusB = rowB.original.status
    const statusOrder = ['active', 'closed']
    return statusOrder.indexOf(statusB) - statusOrder.indexOf(statusA)
  }

    const sortDateFn: SortingFn<Order> = (rowA, rowB, _columnId) => {
        return new Date(rowA.original.timestamp).getTime() - new Date(rowB.original.timestamp).getTime();
    };

    const includesStringNested: FilterFn<Order> = (row, columnId, filterValue) => {
        const columnPaths = columnId.split('.');
        let rowValue = row.original;

        for (const path of columnPaths) {
            rowValue = rowValue[path];
            if (rowValue === null || rowValue === undefined) {
                return false;
            }
        }

        return String(rowValue).toLowerCase().includes(filterValue.toLowerCase());
    };


    const pathname: string = usePathname();
    const role = pathname.startsWith("/distributor") ? "distributor" : "store";

  const columns = useMemo<ColumnDef <Order> [] > (
      () => [
          {
              accessorKey: "order_id",
              header: () => <span>Order ID</span>,
              enableSorting: false,
          },
          {
              accessorKey: "product.distributor.company_name",
              header: () => <span>Company Name</span>,
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
              filterFn: includesStringNested
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
              filterFn: "includesString"
          },
          {
              accessorKey: "timestamp",
              header: () => <span>Date</span>,
              sortingFn: sortDateFn,
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
