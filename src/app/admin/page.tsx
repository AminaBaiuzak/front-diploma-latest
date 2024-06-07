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
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('');

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

  console.log(data);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    console.log(user);
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
      toast.success("User account has been deactivated successfully");
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
    console.log("Id of user that I try to activate is ", id)
    const token = localStorage.getItem("duken");
    console.log(token)
    if (!token) {
      toast.error("An error occurred. Please log in.");
      return router.replace("/login");
    }
    activateUserAcc.mutate({ token: JSON.parse(token).token, id: id.toString() });
  };

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSort(event.target.value);
  };

  const filteredUsers = data.users.filter((user) => {
    if (filter === 'all') return true;
    if (filter === 'active') return user.is_active;
    if (filter === 'inactive') return !user.is_active;
    return user.role === filter;
  });

  const filteredAndSortedUsers = filteredUsers.sort((a, b) => {
    if (sort === 'latest') {
      return new Date(b.created) - new Date(a.created);
    } else {
      return new Date(a.created) - new Date(b.created);
    }
  });

  const searchedUsers = filteredAndSortedUsers.filter((user) => {
    return user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.company_name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
      <>
        <div className="pl-[110px] pr-[30px] py-[30px] bg-[#36719314] flex-1">
          <div className="bg-white rounded-xl w-full min-h-[700px] px-[103px] py-[37px]">
            <div className="flex justify-between">
              <h1 className="font-montserrat font-semibold text-[22px] text-main">Admin Panel</h1>
              <div className="flex gap-[8px]">
                <div className="w-[280px] h-[38px] bg-[#fcfcfc] rounded-[10px] px-[20px] flex items-center border">
                  <IoSearch size={24} color="#7E7E7E" />
                  <input
                      type="text"
                      placeholder="Search"
                      className="placeholder-[#B5B7C0] bg-transparent text-[14px] font-outfit w-full outline-none ml-[8px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="w-[200px] h-[38px] bg-[#fcfcfc] rounded-[10px] px-[20px] flex items-center border">
                  <span className="placeholder-[#B5B7C0] text-[14px] font-outfit mr-2">Filter :</span>
                  <select
                      name="select"
                      className="flex-1 bg-[#fcfcfc] h-full text-[14px] font-outfit"
                      value={filter}
                      onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="distributor">Distributors</option>
                    <option value="store">Stores</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div className="w-[180px] h-[38px] bg-[#fcfcfc] rounded-[10px] px-[20px] flex items-center border">
                  <span className="placeholder-[#B5B7C0] text-[14px] font-outfit mr-2">Sort :</span>
                  <select
                      name="select1"
                      className="flex-1 bg-[#fcfcfc] h-full text-[14px] font-outfit"
                      value={sort}
                      onChange={handleSortChange}
                  >
                    <option value="oldest">Oldest first</option>
                    <option value="latest">Latest first</option>
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
              {searchedUsers.map((item) => (
                  <tr key={item.email} className={'border border-grey-300'}>
                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]">
                      <FaRegStar size={15} color="#D9D9D9" />
                    </td>

                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]" onClick={() => handleOpenModal(item)}>
                      {item.company_name}
                    </td>

                    <td className="py-[4px] pl-3 gap-2 flex items-center" onClick={() => handleOpenModal(item)}>
                      <img src={item.img_url ? item.img_url : "/profile_avatar.png"} alt="avatar" className="w-[30px] h-[30px] rounded-full object-contain" />
                      <span className="text-[#2F65DD]"> {item.name} </span>
                    </td>

                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]" onClick={() => handleOpenModal(item)}>
                      <div
                          className={`py-[2px] px-2 rounded w-fit ${item.is_active ? 'bg-[#ECFFEE]' : 'bg-[#FFF7F1]'}`}
                      >
                        <span className="font-montserrat font-bold text-sm uppercase" style={{ color: item.is_active ? "#00B112" : "red" }}>
                        {item.is_active ? "active" : "not active"}
                      </span>
                      </div>
                    </td>

                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]" onClick={() => handleOpenModal(item)}>
                      <div className="py-[2px] px-2 rounded w-fit" style={{ backgroundColor: item.role === "distributor" ? "#367193" : "#FFC350" }}>
                        <span className="font-montserrat font-bold text-sm text-white uppercase">{item.role}</span>
                      </div>
                    </td>
                    <td className="py-[4px] pl-3 border-x-[2px] border-[#DFE1E6]">
                      <div className="flex items-center gap-2 my-2">
                        <button
                            className={`bg-[#77DD77] hover:bg-[#5ACE5A] p-2 space-x-2 rounded flex justify-center text-white ${item.is_active ? 'hidden' : ''}`}
                            onClick={() => activateAcc(item.id)}
                        >
                          <p>Activate</p>
                          <AiOutlineCheck size={20} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 my-2">
                        <button
                            className={`bg-red-500 hover:bg-red-600 p-2 space-x-2 rounded flex justify-center text-white ${!item.is_active ? 'hidden' : ''}`}
                            onClick={() => deactivateAcc(item.id)}
                        >
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

        <UserModal showModal={showModal} setShowModal={setShowModal} user={selectedUser} deactivateUserAccount={deactivateAcc} activateUserAccount={activateAcc}/>

      </>
  );
}