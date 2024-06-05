import { ColumnDef, PaginationState, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AiFillPlusSquare } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { IProduct } from "@/types/product";

export default function StockTable({ data, columns }: { data: IProduct[]; columns: ColumnDef<IProduct>[] }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  });

  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  });

  const pathname: string = usePathname();
  const role = pathname.startsWith("/distributor") ? "distributor" : "store";

  const router = useRouter();

  const productDetails = (id: string) => {
    if (role === "store") return router.push(`/store/products/${id}`);
    if (role === "distributor") return router.push(`/distributor/my-stock/${id}`);
  };

  return (
    <div className="w-full bg-white rounded-[30px] py-[22px] pl-[22px] pr-[70px]">
      <div className="flex justify-between w-full mb-[15px]">
        <p className=" font-montserrat font-semibold text-[22px] text-main">My Items</p>
        {role === "distributor" && (
          <div
            className="rounded-[10px] bg-[#00AC4F99] px-[30px] py-2 flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => router.push("/distributor/my-stock/new-item")}
          >
            <span className="font-montserrat font-semibold text-white">Add Item</span>
            <AiFillPlusSquare size={20} color="white" />
          </div>
        )}
      </div>
      {data.length > 0 ? (
        <>
          <table className="w-full">
            <thead className="w-full">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="w-full">
                  {headerGroup.headers.map((header) => {
                    return (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        style={{
                          width: header.id === "product_name" ? "40%" : "15%",
                        }}
                      >
                        <div
                          style={{
                            textAlign: header.id === "ImgURLs[0]" || header.id === "product_name" ? "left" : "right",
                            paddingLeft: header.id === "product_name" ? 10 : 0,
                          }}
                        >
                          <span className="font-outfit text-[16px] font-medium text-[#B5B7C0]">
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
                      return (
                        <td
                          key={cell.id}
                          style={{
                            width: index === 1 ? "40%" : "15%",
                          }}
                          className="py-[10px] border-t border-[#EEEEEE]"
                        >
                          {index === 0 ? (
                            <>
                              {cell.row.original.ImgURLs !== null ? (
                                <img
                                  alt="photo"
                                  src={cell.row.original.ImgURLs.length > 0 ? cell.row.original.ImgURLs[0] : "/3d_1.png"}
                                  className="w-[118px] h-[76px] rounded-[8px] object-contain"
                                />
                              ) : (
                                <img alt="photo" src={"/3d_1.png"} className="w-[118px] h-[76px] rounded-[8px] object-contain" />
                              )}
                            </>
                          ) : (
                            <p
                              className="text-main font-outfit"
                              style={{
                                fontSize: index === 1 ? 18 : 16,
                                fontWeight: index === 1 ? 600 : index === 3 ? 600 : 400,
                                textAlign: index === 0 || index === 1 ? "left" : "right",
                                paddingLeft: index === 1 ? 10 : 0,
                                cursor: index === 1 ? "pointer" : "default",
                              }}
                              onClick={index === 1 ? () => productDetails(cell.row.original.id.toString()) : undefined}
                            >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              {index === 2 && ' \u20B8'}
                              {index === 3 && " in stock"}
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
          <div className="h-2" />
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
        </>
      ) : (
        <p>Products list is empty</p>
      )}
    </div>
  );
}
