"use client";

import { IoSearch } from "react-icons/io5";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { IoCloseSharp } from "react-icons/io5";
import { AiOutlineCheck } from 'react-icons/ai';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deactivateUserByAdmin, getUsers, activateUserByAdmin } from "@/services/auth";
import Loader from "react-spinners/PuffLoader";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import UserModal from "@/components/UserModal";

export default function Admin() {
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getUsers(JSON.parse(token).token);
    },
  });

  console.log(data)

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    console.log(user)
  };

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("duken");
      router.replace("/login");
      toast.error("An error occurred. Please log in.");
    }
  }, [isError]);

  const queryClient = useQueryClient();

  const deactivateUserAcc = useMutation({
    mutationFn: deactivateUserByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin"],
        refetchType: "all",
      });
      toast.success("User account has been blocked successfully");
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const activateUserAcc = useMutation({
    mutationFn: activateUserByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin"],
        refetchType: "all",
      });
      toast.success("User account has been activated successfully");
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const deactivateAcc = (id) => {
    const token = localStorage.getItem("duken");
    if (!token) {
      toast.error("An error occurred. Please log in.");
      return router.replace("/login");
    }
    deactivateUserAcc.mutate({ token: JSON.parse(token).token, id: id.toString() });
  };

  const activateAcc = (id) => {
    const token = localStorage.getItem("duken");
    if (!token) {
      toast.error("An error occurred. Please log in.");
      return router.replace("/login");
    }
    activateUserAcc.mutate({ token: JSON.parse(token).token, id: id.toString() });
  };

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  return (
      <>
        <div className="pl-[110px] pr-[30px] py-[30px] bg-[#36719314] flex-1">
          <div className="bg-white rounded-xl w-full min-h-[700px] px-[103px] py-[37px]">
            <div className="flex justify-between">
              <h1 className=" font-montserrat font-semibold text-[22px] text-main">Admin Panel</h1>
              <div className="flex gap-[8px]">
                <div className="w-[280px] h-[38px] bg-[#fcfcfc] rounded-[10px] px-[20px] flex items-center border">
                  <IoSearch size={24} color="#7E7E7E" />
                  <input type="text" placeholder="Search" className="placeholder-[#B5B7C0] bg-transparent text-[14px] font-outfit w-full outline-none ml-[8px]" />
                </div>
                <div className="w-[280px] h-[38px] bg-[#fcfcfc] rounded-[10px] px-[20px] flex items-center border">
                  <span className="placeholder-[#B5B7C0] text-[14px] font-outfit mr-2">Sort by :</span>
                  <select name="select" className="flex-1 bg-[#fcfcfc] h-full text-[14px] font-outfit">
                    <option value="value1">Newest</option>
                    <option value="value2">Oldest</option>
                  </select>
                </div>
              </div>
            </div>
            <table className="w-full mt-8 font-outfit text-main border border-grey-500">
              <thead>
              <tr className="h-[48px] bg-[#FBFBFB] text-left">
                <th className="px-3 w-[3%]">
                  <FaStar size={15} color="#D9D9D9" />
                </th>
                <th className=" pl-3 w-[18%]">Company Name</th>
                <th className=" pl-3 w-[23%]">User</th>
                <th className=" pl-3 w-[13%]">Status</th>
                <th className=" pl-3 w-[23%]">Role</th>
                <th className=" pl-3 w-[13%]">Actions</th>
              </tr>
              </thead>

              <tbody className="border-[2px] border-[#DFE1E6] font-montserrat text-sm">
              {data.users.map((item) => (
                  <tr key={item.email}  className={'border border-grey-300'}>
                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]">
                      <FaRegStar size={15} color="#D9D9D9" />
                    </td>


                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]"
                        onClick={() => handleOpenModal(item)}>{item.company_name}</td>

                    <td className="py-[4px] pl-3 gap-2 flex items-center">
                      <img src={item.img_url ? item.img_url : "/profile_avatar.png"} alt="avatar" className="w-[30px] h-[30px] rounded-full object-contain" />
                      <span className="text-[#2F65DD]"> {item.name} </span>
                    </td>

                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]">
                      <div className="py-[2px] px-2 bg-[#ECFFEE] rounded w-fit">
                      <span className="font-montserrat font-bold text-sm uppercase" style={{ color: item.is_active ? "#00B112" : "red" }}>
                        {item.is_active ? "active" : "not active"}
                      </span>
                      </div>
                    </td>

                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]">
                      <div className="py-[2px] px-2 rounded w-fit" style={{ backgroundColor: item.role === "distributor" ? "#367193" : "#FFC350" }}>
                        <span className="font-montserrat font-bold text-sm text-white uppercase">{item.role}</span>
                      </div>
                    </td>
                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]">

                      <div className="flex items-center gap-2 my-2">
                        <button className={`bg-[#77DD77] hover:bg-[#5ACE5A] p-2 space-x-2 rounded flex justify-center text-white ${item.is_active ? 'hidden' : ''}`}
                                onClick={() => activateAcc(item.id)}>
                          <p>Activate</p>
                          <AiOutlineCheck size={20} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 my-2">
                        <button className={`bg-[#FF7272] hover:bg-[#e66060] p-2 rounded space-x-2 text-white flex justify-center ${item.is_active ? '' : 'hidden'}`}
                                onClick={() => deactivateAcc(item.id)}>
                          <p>Deactivate</p>
                          <IoCloseSharp size={20} />
                        </button>
                      </div>

                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        <UserModal showModal={showModal} setShowModal={setShowModal} user={selectedUser} blockUserAccount={deactivateAcc} activateUserAccount={activateAcc}/>
      </>
  );
}
