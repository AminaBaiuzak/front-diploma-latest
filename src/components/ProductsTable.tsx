import { ColumnDef, PaginationState, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import { IProductSell } from "@/types/product";
import { usePathname } from "next/navigation";

export default function ProductsTable({ data, columns, openProduct  }: { data: IProductSell[]; columns: ColumnDef<IProductSell>[]; openProduct: (product_id: number) => void }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  });

  // Group the data by product_id
  const groupedData = data.reduce((acc, curr) => {
    const existingProductIndex = acc.findIndex((item) => item.product_id === curr.product_id);
    if (existingProductIndex !== -1) {
      acc[existingProductIndex].quantity += curr.quantity;
      acc[existingProductIndex].total_price += curr.total_price;
    } else {
      acc.push({ ...curr });
    }
    return acc;
  }, []);

  const table = useReactTable({
    columns,
    data: groupedData,
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

  return (
      <div className="w-full bg-white rounded-[30px] py-[22px] pl-[22px] pr-[70px]">
        <p className=" font-montserrat font-semibold text-[22px] text-main mb-[15px]">{role === "distributor" ? "Product Sell" : "My purchases"}</p>
        {groupedData.length > 0 ? (
            <>
              <table className="w-full">
                <thead className="w-full">
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="w-full">
                      {headerGroup.headers.map((header) => {
                        return (
                            <th key={header.id} colSpan={header.colSpan} style={{ width: header.id === "product_product_name" ? "40%" : "15%" }}>
                              <div
                                  style={{
                                    textAlign: header.id === "product_ImgURLs" || header.id === "product_product_name" ? "left" : "right",
                                    paddingLeft: header.id === "product_product_name" ? 10 : 0,
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
                      <tr key={row.id} className="w-full" onClick={() => openProduct(row.original.product_id)}>
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
                                    <img
                                        alt=""
                                        src={
                                          cell.row.original.product.ImgURLs !== null && cell.row.original.product.ImgURLs.length > 0
                                              ? cell.row.original.product.ImgURLs[0]
                                              : "/3d_1.png"
                                        }
                                        className="w-[118px] h-[56px] object-contain rounded-[8px]"
                                    />
                                ) : (
                                    <p
                                        className="text-main font-outfit"
                                        style={{
                                          fontSize: index === 1 ? 18 : 16,
                                          fontWeight: index === 1 ? 600 : index === 3 ? 600 : 400,
                                          textAlign: index === 0 || index === 1 ? "left" : "right",
                                          paddingLeft: index === 1 ? 10 : 0,
                                        }}
                                    >
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      {index === 3 && " ₸"}
                                      {role === "distributor" && index === 2 && " in stock"}
                                      {role === "store" && index === 4 && " ₸"}
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
            <p className="text-main font-outfit text-[16px]">Products list is empty</p>
        )}
      </div>
  );
}
