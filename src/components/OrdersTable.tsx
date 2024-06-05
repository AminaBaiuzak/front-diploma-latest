import { updateStatus } from "@/services/orders";
import { updateStatusStore } from "@/services/orders_store";
import { Order } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingFn,
  SortingState,
  Updater,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { IoCheckmark, IoCloseOutline, IoSearch } from "react-icons/io5";
import { toast } from "react-toastify";

export default function OrdersTable({ data, columns }: { data: Order[]; columns: ColumnDef<Order>[] }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  console.log(data);

  const router = useRouter();

  const [newStatus, setNewStatus] = useState(undefined);
  const [confirmedStatus, setConfirmedStatus] = useState(undefined);
  const [processingStatus, setProcessingStatus] = useState(undefined);
  const [shippedStatus, setShippedStatus] = useState(undefined);
  const [successStatus, setSuccessStatus] = useState(undefined);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      columnFilters,
      sorting,
      pagination,
    },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  const statusHandler = (id: any, name: string) => {
    if (name === "New") setNewStatus(id);
    if (name === "Confirmed") setConfirmedStatus(id);
    if (name === "Processing") setProcessingStatus(id);
    if (name === "Shipped") setShippedStatus(id);
    if (name === "Success") setSuccessStatus(id);
  };

  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      setNewStatus(undefined);
      setConfirmedStatus(undefined);
      setProcessingStatus(undefined);
      setShippedStatus(undefined);
      setSuccessStatus(undefined);
      queryClient.invalidateQueries({ queryKey: ["orders"], refetchType: "all" });
      setPagination((prev) => {
        return prev;
      });
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const updateStatusFn = (id: number, stage_status: "success" | "warning" | "error") => {
    const formData = {
      stage_status,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }
    update.mutate({ formData, token: JSON.parse(token).token, id: id.toString() });
  };

  const updateStore = useMutation({
    mutationFn: updateStatusStore,
    onSuccess: () => {
      setNewStatus(undefined);
      setConfirmedStatus(undefined);
      setProcessingStatus(undefined);
      setShippedStatus(undefined);
      setSuccessStatus(undefined);
      queryClient.invalidateQueries({ queryKey: ["orders_store"], refetchType: "all" });
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const updateStatusStoreFn = (id: number) => {
    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
      toast.error("An error occurred. Please log in.");
    }
    updateStore.mutate({ token: JSON.parse(token).token, id: id.toString() });
  };

  const pathname: string = usePathname();
  const role = pathname.startsWith("/distributor") ? "distributor" : "store";

  return (
    <div className="w-full bg-white rounded-[30px] py-[22px] pl-[22px] pr-[70px]">
      <div className="flex justify-between w-full mb-[15px]">
        <p className=" font-montserrat font-semibold text-[22px] text-main ">Product Sell</p>
        <div className="flex gap-[8px]">
          <div className="w-[280px] h-[38px] bg-[#F9FBFF] rounded-[10px] px-[20px] flex items-center">
            <IoSearch size={24} color="#7E7E7E" />
            <input
              type="text"
              placeholder="Search"
              className="placeholder-[#B5B7C0] bg-transparent text-[14px] font-outfit w-full outline-none ml-[8px]"
              onChange={(e) => {
                table.setColumnFilters(() => [
                  {
                    id: "product[product_name]",
                    value: e.target.value,
                  },
                ]);
              }}
            />
          </div>
          <div className="w-[280px] h-[38px] bg-[#F9FBFF] rounded-[10px] px-[20px] flex items-center">
            <span className="placeholder-[#B5B7C0] text-[14px] font-outfit mr-2">Sort by :</span>
            <select
              name="select"
              className="flex-1 bg-[#F9FBFF] h-full text-[14px] font-outfit"
              onChange={(e) => {
                if (e.target.value === "active") table.setSorting(() => [{ desc: true, id: "status" }]);
                if (e.target.value === "closed") table.setSorting(() => [{ desc: false, id: "status" }]);
                if (e.target.value === "") table.resetSorting();
              }}
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>
      {data.length > 0 ? (
        <table className="w-full">
          <thead className="w-full">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="w-full">
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} colSpan={header.colSpan}>
                      <div
                        style={{
                          textAlign: header.id === "status" ? "center" : "left",
                          paddingRight: header.id === "status" ? 0 : 20,
                        }}
                      >
                        <span className="font-outfit text-[14px] font-medium text-[#B5B7C0]">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="w-full pt-5">
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="w-full ">
                  {row.getVisibleCells().map((cell, index) => {
                    const stage = cell.row.original.stage.stage;
                    const status = cell.row.original.stage.status;
                    const order_id = cell.row.original.order_id;
                    const mainStatus = cell.row.original.status;
                    return (
                      <td key={cell.id} className="py-[10px] border-t border-[#EEEEEE]">
                        {index === 7 ? (
                          <div className="w-full  flex items-center justify-center pb-[10px]">
                            <div className="flex items-center">
                              <div
                                className="w-[20px] h-[20px] rounded-full flex justify-center items-center relative border"
                                style={{
                                  backgroundColor:
                                    stage === "new"
                                      ? status === "success"
                                        ? "#198038"
                                        : status === "warning"
                                        ? "#F1C21B"
                                        : status === "error"
                                        ? "#DA1E28"
                                        : undefined
                                      : stage === "confirmed" || stage === "processing" || stage === "shipped" || stage === "success"
                                      ? "#198038"
                                      : undefined,
                                  cursor: newStatus === cell.id ? "default" : "pointer",
                                  borderColor: stage === "new" ? "transparent" : "lightgray",
                                }}
                                onClick={() => statusHandler(cell.id, "New")}
                                onBlur={() => setNewStatus(undefined)}
                                tabIndex={1}
                              >
                                {stage === "new" &&
                                  (status === "success" ? (
                                    <IoCheckmark size={15} color="white" />
                                  ) : status === "warning" ? (
                                    <span className="text-[16px] text-bold">!</span>
                                  ) : (
                                    status === "error" && <IoCloseOutline size={14} color="white" />
                                  ))}
                                {(stage === "confirmed" || stage === "processing" || stage === "shipped" || stage === "success") && (
                                  <IoCheckmark size={15} color="white" />
                                )}
                                <p className="font-outfit font-medium text-[#6F6F6F] text-[12px] absolute bottom-[-15px]">New</p>
                                <div
                                  className="absolute top-1/2 left-1/2 z-20 bg-white p-2 border border-[#00000080] rounded-bl-[20px] rounded-r-[20px]"
                                  style={{ display: "none" }}
                                >
                                  <div className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-green-200">
                                    <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#198038]">
                                      <IoCheckmark size={15} color="white" />
                                    </div>
                                    <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Success</p>
                                  </div>
                                  <div className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-yellow-200">
                                    <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#F1C21B]">
                                      <span className="text-[16px] text-bold">!</span>
                                    </div>
                                    <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Warning</p>
                                  </div>
                                  <div className="flex gap-1 items-center py-[3px] cursor-pointer hover:bg-red-200">
                                    <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#DA1E28]">
                                      <IoCloseOutline size={14} color="white" />
                                    </div>
                                    <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Error</p>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="w-[58px] border-t"
                                style={{
                                  borderColor:
                                    stage === "confirmed" || stage === "processing" || stage === "shipped" || stage === "success" ? "#438DB8" : "lightgray",
                                }}
                              />
                            </div>
                            <div className="flex items-center">
                              <div
                                className="w-[20px] h-[20px] rounded-full flex justify-center items-center relative border"
                                style={{
                                  backgroundColor:
                                    stage === "confirmed"
                                      ? status === "success"
                                        ? "#198038"
                                        : status === "warning"
                                        ? "#F1C21B"
                                        : status === "error"
                                        ? "#DA1E28"
                                        : undefined
                                      : stage === "processing" || stage === "shipped" || stage === "success"
                                      ? "#198038"
                                      : undefined,
                                  cursor: confirmedStatus === cell.id ? "default" : "pointer",
                                  borderColor: stage === "confirmed" ? "transparent" : "lightgray",
                                }}
                                onClick={() => statusHandler(cell.id, "Confirmed")}
                                onBlur={() => setConfirmedStatus(undefined)}
                                tabIndex={1}
                              >
                                {stage === "confirmed" &&
                                  (status === "success" ? (
                                    <IoCheckmark size={15} color="white" />
                                  ) : status === "warning" ? (
                                    <span className="text-[16px] text-bold">!</span>
                                  ) : (
                                    status === "error" && <IoCloseOutline size={14} color="white" />
                                  ))}
                                {(stage === "processing" || stage === "shipped" || stage === "success") && <IoCheckmark size={15} color="white" />}
                                <p className="font-outfit font-medium text-[#6F6F6F] text-[12px] absolute bottom-[-15px]">Confirmed</p>
                                {mainStatus === "active" && (
                                  <div
                                    className="absolute top-1/2 left-1/2 z-20 bg-white p-2 border border-[#00000080] rounded-bl-[20px] rounded-r-[20px]"
                                    style={{
                                      display:
                                        confirmedStatus === cell.id && (stage === "new" || (stage === "confirmed" && status === "warning")) ? "block" : "none",
                                    }}
                                  >
                                    {role === "distributor" && (
                                      <>
                                        <div
                                          onClick={() => updateStatusFn(order_id, "success")}
                                          className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-green-200"
                                        >
                                          <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#198038]">
                                            <IoCheckmark size={15} color="white" />
                                          </div>
                                          <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Success</p>
                                        </div>
                                        <div
                                          onClick={() => updateStatusFn(order_id, "warning")}
                                          className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-yellow-200"
                                        >
                                          <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#F1C21B]">
                                            <span className="text-[16px] text-bold">!</span>
                                          </div>
                                          <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Warning</p>
                                        </div>
                                      </>
                                    )}
                                    <div
                                      onClick={() => {
                                        if (role === "distributor") updateStatusFn(order_id, "error");
                                        if (role === "store") updateStatusStoreFn(order_id);
                                      }}
                                      className="flex gap-1 items-center py-[3px] cursor-pointer hover:bg-red-200"
                                    >
                                      <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#DA1E28]">
                                        <IoCloseOutline size={14} color="white" />
                                      </div>
                                      <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Error</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div
                                className="w-[58px] border-t"
                                style={{
                                  borderColor: stage === "processing" || stage === "shipped" || stage === "success" ? "#438DB8" : "lightgray",
                                }}
                              />
                            </div>
                            <div className="flex items-center">
                              <div
                                className="w-[20px] h-[20px] rounded-full flex justify-center items-center relative border"
                                style={{
                                  backgroundColor:
                                    stage === "processing"
                                      ? status === "success"
                                        ? "#198038"
                                        : status === "warning"
                                        ? "#F1C21B"
                                        : status === "error"
                                        ? "#DA1E28"
                                        : undefined
                                      : stage === "shipped" || stage === "success"
                                      ? "#198038"
                                      : undefined,
                                  cursor: newStatus === cell.id ? "default" : "pointer",
                                  borderColor: stage === "processing" ? "transparent" : "lightgray",
                                }}
                                onClick={() => statusHandler(cell.id, "Processing")}
                                onBlur={() => setProcessingStatus(undefined)}
                                tabIndex={1}
                              >
                                {stage === "processing" &&
                                  (status === "success" ? (
                                    <IoCheckmark size={15} color="white" />
                                  ) : status === "warning" ? (
                                    <span className="text-[16px] text-bold">!</span>
                                  ) : (
                                    status === "error" && <IoCloseOutline size={14} color="white" />
                                  ))}
                                {(stage === "shipped" || stage === "success") && <IoCheckmark size={15} color="white" />}
                                <p className="font-outfit font-medium text-[#6F6F6F] text-[12px] absolute bottom-[-15px]">Processing</p>
                                {mainStatus === "active" && (
                                  <div
                                    className="absolute top-1/2 left-1/2 z-20 bg-white p-2 border border-[#00000080] rounded-bl-[20px] rounded-r-[20px]"
                                    style={{
                                      display:
                                        processingStatus === cell.id &&
                                        ((stage === "confirmed" && status === "success") || (stage === "processing" && status === "warning"))
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {role === "distributor" && (
                                      <>
                                        <div
                                          onClick={() => updateStatusFn(order_id, "success")}
                                          className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-green-200"
                                        >
                                          <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#198038]">
                                            <IoCheckmark size={15} color="white" />
                                          </div>
                                          <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Success</p>
                                        </div>
                                        <div
                                          onClick={() => updateStatusFn(order_id, "warning")}
                                          className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-yellow-200"
                                        >
                                          <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#F1C21B]">
                                            <span className="text-[16px] text-bold">!</span>
                                          </div>
                                          <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Warning</p>
                                        </div>
                                      </>
                                    )}
                                    <div
                                      onClick={() => {
                                        if (role === "distributor") updateStatusFn(order_id, "error");
                                        if (role === "store") updateStatusStoreFn(order_id);
                                      }}
                                      className="flex gap-1 items-center py-[3px] cursor-pointer hover:bg-red-200"
                                    >
                                      <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#DA1E28]">
                                        <IoCloseOutline size={14} color="white" />
                                      </div>
                                      <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Error</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div
                                className="w-[58px] border-t"
                                style={{
                                  borderColor: stage === "shipped" || stage === "success" ? "#438DB8" : "lightgray",
                                }}
                              />
                            </div>
                            <div className="flex items-center">
                              <div
                                className="w-[20px] h-[20px] rounded-full flex justify-center items-center relative border"
                                style={{
                                  backgroundColor:
                                    stage === "shipped"
                                      ? status === "success"
                                        ? "#198038"
                                        : status === "warning"
                                        ? "#F1C21B"
                                        : status === "error"
                                        ? "#DA1E28"
                                        : undefined
                                      : stage === "success"
                                      ? "#198038"
                                      : undefined,
                                  cursor: newStatus === cell.id ? "default" : "pointer",
                                  borderColor: stage === "shipped" ? "transparent" : "lightgray",
                                }}
                                onClick={() => statusHandler(cell.id, "Shipped")}
                                onBlur={() => setShippedStatus(undefined)}
                                tabIndex={1}
                              >
                                {stage === "shipped" &&
                                  (status === "success" ? (
                                    <IoCheckmark size={15} color="white" />
                                  ) : status === "warning" ? (
                                    <span className="text-[16px] text-bold">!</span>
                                  ) : (
                                    status === "error" && <IoCloseOutline size={14} color="white" />
                                  ))}
                                {stage === "success" && <IoCheckmark size={15} color="white" />}
                                <p className="font-outfit font-medium text-[#6F6F6F] text-[12px] absolute bottom-[-15px]">Shipped</p>
                                {mainStatus === "active" && (
                                  <div
                                    className="absolute top-1/2 left-1/2 z-20 bg-white p-2 border border-[#00000080] rounded-bl-[20px] rounded-r-[20px]"
                                    style={{
                                      display:
                                        shippedStatus === cell.id &&
                                        ((stage === "processing" && status === "success") || (stage === "shipped" && status === "warning"))
                                          ? "block"
                                          : "none",
                                    }}
                                  >
                                    {role === "distributor" && (
                                      <>
                                        <div
                                          onClick={() => updateStatusFn(order_id, "success")}
                                          className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-green-200"
                                        >
                                          <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#198038]">
                                            <IoCheckmark size={15} color="white" />
                                          </div>
                                          <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Success</p>
                                        </div>
                                        <div
                                          onClick={() => updateStatusFn(order_id, "warning")}
                                          className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-yellow-200"
                                        >
                                          <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#F1C21B]">
                                            <span className="text-[16px] text-bold">!</span>
                                          </div>
                                          <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Warning</p>
                                        </div>
                                      </>
                                    )}
                                    <div
                                      onClick={() => {
                                        if (role === "distributor") updateStatusFn(order_id, "error");
                                        if (role === "store") updateStatusStoreFn(order_id);
                                      }}
                                      className="flex gap-1 items-center py-[3px] cursor-pointer hover:bg-red-200"
                                    >
                                      <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#DA1E28]">
                                        <IoCloseOutline size={14} color="white" />
                                      </div>
                                      <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Error</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div
                                className="w-[58px] border-t"
                                style={{
                                  borderColor: stage === "success" ? "#438DB8" : "lightgray",
                                }}
                              />
                            </div>
                            <div className="">
                              <div
                                className="w-[20px] h-[20px] rounded-full flex justify-center items-center relative border"
                                style={{
                                  backgroundColor:
                                    stage === "success"
                                      ? status === "success"
                                        ? "#198038"
                                        : status === "warning"
                                        ? "#F1C21B"
                                        : status === "error"
                                        ? "#DA1E28"
                                        : undefined
                                      : undefined,
                                  cursor: newStatus === cell.id ? "default" : "pointer",
                                  borderColor: stage === "success" ? "transparent" : "lightgray",
                                }}
                                onClick={() => statusHandler(cell.id, "Success")}
                                onBlur={() => setSuccessStatus(undefined)}
                                tabIndex={1}
                              >
                                {stage === "success" &&
                                  (status === "success" ? (
                                    <IoCheckmark size={15} color="white" />
                                  ) : status === "warning" ? (
                                    <span className="text-[16px] text-bold">!</span>
                                  ) : (
                                    status === "error" && <IoCloseOutline size={14} color="white" />
                                  ))}
                                <p className="font-outfit font-medium text-[#6F6F6F] text-[12px] absolute bottom-[-15px]">Success</p>
                                {/* {mainStatus === "active" && (
                                  <div
                                    className="absolute top-1/2 left-1/2 z-20 bg-white p-2 border border-[#00000080] rounded-bl-[20px] rounded-r-[20px]"
                                    style={{ display: successStatus === cell.id && stage === "shipped" ? "block" : "none" }}
                                  >
                                    <div className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-green-200">
                                      <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#198038]">
                                        <IoCheckmark size={15} color="white" />
                                      </div>
                                      <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Success</p>
                                    </div>
                                    <div className="flex gap-1 items-center border-b border-[#00000080] py-[3px] cursor-pointer hover:bg-yellow-200">
                                      <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#F1C21B]">
                                        <span className="text-[16px] text-bold">!</span>
                                      </div>
                                      <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Warning</p>
                                    </div>
                                    <div className="flex gap-1 items-center py-[3px] cursor-pointer hover:bg-red-200">
                                      <div className="w-[20px] h-[20px] rounded-full flex justify-center items-center bg-[#DA1E28]">
                                        <IoCloseOutline size={14} color="white" />
                                      </div>
                                      <p className="font-outfit font-medium text-[#6F6F6F] text-[12px]">Error</p>
                                    </div>
                                  </div>
                                )} */}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-main font-outfit text-sm font-semibold text-left pr-5">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className=" font-montserrat">Order list is empty</p>
      )}
      <div className="h-2" />
      {data.length > 0 && (
        <div className="flex items-center gap-2 justify-end">
          <button
            className="border rounded w-[26px] h-[24px] bg-[#EEEEEE] flex justify-center items-center"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <span className="flex items-center gap-1 font-outfit text-main">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount().toLocaleString()}
            </strong>
          </span>
          <button
            className="border rounded w-[26px] h-[24px] bg-[#EEEEEE] flex justify-center items-center"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
        </div>
      )}
    </div>
  );
}
