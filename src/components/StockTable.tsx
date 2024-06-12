import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { AiFillPlusSquare } from "react-icons/ai";
import { usePathname, useRouter } from "next/navigation";
import { IProduct } from "@/types/product";
import { IoSearch } from "react-icons/io5";

export default function StockTable({ data, columns }: { data: IProduct[]; columns: ColumnDef<IProduct>[] }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 4,
  });

  const [columnVisibility, setColumnVisibility] = useState({
    category: false,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  console.log(data)

  const table = useReactTable({
    columns,
    data,
    initialState: { columnVisibility },
    filterFns: {},
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
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
          <p className=" font-montserrat font-semibold text-[22px] text-main">{role === 'distributor' ? 'My Items' : 'Products' }</p>
          {role === "distributor" && (
              <>
                <div className="w-[300px] h-[38px] bg-[#F9FBFF] rounded-[10px] px-[20px] flex items-center border">
                  <IoSearch size={24} color="#7E7E7E" />
                  <input
                      type="text"
                      placeholder="Search"
                      className="placeholder-[#B5B7C0] bg-transparent text-[14px] font-outfit w-full outline-none ml-[8px]"
                      onChange={(e) => {
                        const value = e.target.value;
                        table.setColumnFilters((filters) => {
                          if (!Array.isArray(filters)) {
                            filters = [];
                          }
                          const updatedFilters = filters.filter((f) => f.id !== "product_name");
                          if (value !== "") {
                            updatedFilters.push({
                              id: "product_name",
                              value: value,
                            });
                          }
                          return updatedFilters;
                        });
                      }}
                  />

                </div>
                <div
                    className="rounded-[10px] bg-[#00AC4F99] px-[30px] py-2 flex items-center justify-center gap-2 cursor-pointer"
                    onClick={() => router.push("/distributor/my-stock/new-item")}
                >
                  <span className="font-montserrat font-semibold text-white">Add Item</span>
                  <AiFillPlusSquare size={20} color="white" />
                </div>
              </>

          )}
          {role === "store" && (
              <div className="flex gap-[8px]">
                <div className="w-[300px] h-[38px] bg-[#F9FBFF] rounded-[10px] px-[20px] flex items-center border">
                  <IoSearch size={24} color="#7E7E7E" />
                  <input
                      type="text"
                      placeholder="Search"
                      className="placeholder-[#B5B7C0] bg-transparent text-[14px] font-outfit w-full outline-none ml-[8px]"
                      onChange={(e) => {
                        const value = e.target.value;
                        table.setColumnFilters((filters) => {
                          if (!Array.isArray(filters)) {
                            filters = [];
                          }
                          const updatedFilters = filters.filter((f) => f.id !== "product_name");
                          if (value !== "") {
                            updatedFilters.push({
                              id: "product_name",
                              value: value,
                            });
                          }
                          return updatedFilters;
                        });
                      }}
                  />

                </div>
                <div className="w-[240px] h-[38px] bg-[#F9FBFF] rounded-[10px] px-[20px] flex items-center border">
                  <span className="placeholder-[#B5B7C0] text-[14px] font-outfit mr-2">Sort by Price:</span>
                  <select
                      name="select"
                      className="flex-1 bg-[#F9FBFF] h-full text-[14px] font-outfit"
                      onChange={(e) => {
                        if (e.target.value === "low_to_high") table.setSorting(() => [{ desc: false, id: "price" }]);
                        if (e.target.value === "high_to_low") table.setSorting(() => [{ desc: true, id: "price" }]);
                        if (e.target.value === "") table.resetSorting();
                      }}
                  >
                    <option value="">All</option>
                    <option value="low_to_high">Low to high</option>
                    <option value="high_to_low">High to low</option>
                  </select>
                </div>

                <div className="w-[240px] h-[38px] bg-[#F9FBFF] rounded-[10px] px-[20px] flex items-center border">
                  <span className="placeholder-[#B5B7C0] text-[14px] font-outfit mr-2">Category:</span>
                  <select
                      name="selectCategory"
                      className="flex-1 bg-[#F9FBFF] h-full text-[14px] font-outfit"
                      onChange={(e) => {
                          const value = e.target.value;
                          table.setColumnFilters((filters) => {
                            if (!Array.isArray(filters)) {
                              filters = [];
                            }
                            const updatedFilters = filters.filter((f) => f.id !== "category");
                            if (value !== "") {
                              updatedFilters.push({
                                id: "category",
                                value: value,
                              });
                            }
                            return updatedFilters;
                          });

                      }}
                  >
                    <option value="">All</option>
                    <option value={"drinks"}>Drinks</option>
                    <option value={"vegetables"}>Vegetables</option>
                    <option value={"fruits"}>Fruits</option>
                    <option value={"meat"}>Meat</option>
                    <option value={"dairy"}>Dairy</option>
                    <option value={"snacks"}>Snacks</option>
                    <option value={"sauces"}>Sauces</option>
                    <option value={"tea"}>Tea</option>
                    <option value={"canned food"}>Canned food</option>
                  </select>
                </div>
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
                                    textAlign: header.id === "ImgURLs[0]" || header.id === "product_name" || header.id === "price" ? "left" : "right",
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
                                          <img alt="photo" src={"/3d_1.png"} className="w-[118px] h-[76px] rounded-[8px] object-cover" />
                                      )}
                                    </>
                                ) : (
                                    <p
                                        className="text-main font-outfit"
                                        style={{
                                          fontSize: index === 1 ? 18 : 16,
                                          fontWeight: index === 1 ? 600 : index === 3 ? 600 : 400,
                                          textAlign: index === 0 || index === 1 || index === 2 ? "left" : "right",
                                          paddingLeft: index === 1 ? 10 : 0,
                                          cursor: index === 1 ? "pointer" : "default",
                                        }}
                                        onClick={index === 1 ? () => productDetails(cell.row.original.id.toString()) : undefined}
                                    >
                                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                      {index === 3 && " ₸"}
                                      {index === 4 && " in stock"}
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
