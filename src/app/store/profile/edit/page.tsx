"use client";

import { useRouter } from "next/navigation";
import { FaDownload } from "react-icons/fa6";
import { RiCloseCircleLine } from "react-icons/ri";
import { IoCloseCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import ReactModal from "react-modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Loader from "react-spinners/PuffLoader";
import { getStoreProfile, updateStoreProfile } from "@/services/auth";
import { IUpdateProfile } from "@/types/auth";
import { deleteUser } from "@/services/auth";
import { uploadImage } from "@/services/product";
import { toast } from "react-toastify";
import InputMask from "@mona-health/react-input-mask";

export default function EditPage() {
  const router = useRouter();

  const [modal, setModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [bin, setBin] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [details, setDetails] = useState("");
  const [imgURL, setImgURL] = useState("");

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["profile_store"],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getStoreProfile(JSON.parse(token).token);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setCompanyName(data.store.company_name);
      setName(data.store.name);
      setBin(data.store.bin);
      setPhone(data.store.phone_number);
      setCity(data.store.city);
      setDetails(data.store.details);
      setImgURL(data.store.img_url);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("duken");
      toast.error("An error occurred. Please log in.");
      router.replace("/login");
    }
  }, [isError]);

  const cities = useQuery({
    queryKey: ["cities"],
    queryFn: () => {
      return axios.get("https://countriesnow.space/api/v0.1/countries/cities/q?country=Kazakhstan");
    },
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: updateStoreProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile_store"], refetchType: "all" });
      toast.success("Profile updated successfully");
      router.replace("/store/profile");
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const handleSave = () => {
    if (!companyName || !name || !bin || !phone || !city) {
      alert("Please fill in all fields");
      return;
    }

    if (bin.length !== 12 || !/^\d+$/.test(bin)) {
      toast.warn("BIN should be exactly 12 digits and consist only of numbers");
      return;
    }

    if (phone.includes("_")) {
      toast.warn("Phone number should be exactly 16 digits long and in the correct format");
      return;
    }

    const formData: IUpdateProfile = {
      company_name: companyName,
      name,
      bin,
      phone_number: phone,
      city,
      details,
      img_url: imgURL,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    update.mutate({ profileData: formData, token: JSON.parse(token).token });
  };

  const deleteUserAcc = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      localStorage.removeItem("duken");
      toast.success("User account has been deleted successfully");
      router.replace("/login");
    },
  });

  const deleteAcc = () => {
    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }
    deleteUserAcc.mutate({ token: JSON.parse(token).token });
  };

  const upload = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImgURL(data.image_url);
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const uploadImageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const formData = new FormData();

      const token = localStorage.getItem("duken");
      if (!token) {
        return router.replace("/login");
      }

      formData.append("image", event.target.files[0]);

      upload.mutate({ formData, token: JSON.parse(token).token });
    }
  };

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

  return (
    <div className="pl-[250px] pr-[216px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex">
      <div className="bg-white w-full h-full rounded-lg px-[170px] border border-[#EBEBEE] shadow-md flex flex-col items-center">
        <div className=" rounded-full w-[104px] h-[104px] flex justify-center items-center overflow-hidden mt-[17px]">
          <img src={imgURL ? imgURL : "/profile_avatar.png"} alt="" className="w-[100px] h-[100px] object-cover" />
        </div>
        <div className="bg-[#FFC350] rounded-xl text-center px-[8px] flex items-center py-[3px] mt-[-10px] relative">
          <span className=" uppercase font-montserrat text-[10px] font-bold text-white">Shop representative</span>
        </div>
        <div className="mt-3 flex gap-[30px]">
          <div className="rounded-[70px] bg-[#F0EFFA] px-[8px] py-1 flex justify-center items-center gap-1">
            <label className=" font-outfit text-[14px] font-medium text-main cursor-pointer" htmlFor="fileInput">
              Upload Photo
            </label>
            <FaDownload size={15} color="#535356" />
            <input
              type="file"
              style={{ display: "none" }}
              id="fileInput"
              onChange={(event) => {
                uploadImageHandler(event);
              }}
            />
          </div>
          <div className="rounded-[70px] bg-[#F0EFFA] px-[8px] py-1 flex justify-center items-center gap-1 cursor-pointer" onClick={() => setImgURL("")}>
            <span className=" font-outfit text-[14px] font-medium text-main">Remove Photo</span>
            <RiCloseCircleLine size={18} color="#535356" />
          </div>
        </div>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"company_name"} className="font-outfit font-medium text-[14px] text-main">
            Your company name
          </label>
          <input
            type={"text"}
            id={"company_name"}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"name"} className="font-outfit font-medium text-[14px] text-main">
            Your name
          </label>
          <input
            type={"text"}
            id={"name"}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"BIN"} className="font-outfit font-medium text-[14px] text-main">
            BIN
          </label>
          <input
            type={"text"}
            id={"BIN"}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={bin}
            onChange={(e) => setBin(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"Phone"} className="font-outfit font-medium text-[14px] text-main">
            Phone
          </label>
          <InputMask
            mask="+7 999 999 99 99"
            type={"text"}
            id={"Phone"}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={phone}
            onChange={(e: any) => setPhone(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor="mySelect" className="font-outfit font-medium text-[14px] text-main">
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
          >
            <option value="" disabled></option>
            {cities.data?.data.data.map((city: string) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="rounded-lg border border-[#0000004D] flex flex-col w-[100%] overflow-hidden px-[17px] py-1 mt-[15px] shadow-sm">
          <label htmlFor={"Details"} className="font-outfit font-medium text-[14px] text-main">
            Professional Details
          </label>
          <textarea
            id={"Details"}
            rows={4}
            className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC]"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div className="mt-[20px] flex justify-between w-full mb-[70px]">
          <div className="flex flex-col">
            <button
              className="rounded-[20px] bg-[#438DB873] text-white font-outfit text-[14px] mb-[6px] py-1 px-3"
              onClick={() => router.push("/store/profile/edit/password")}
            >
              Change password
            </button>
            <button
              className="rounded-[20px] bg-[#438DB873] text-white font-outfit text-[14px] mb-[6px] py-1 px-3"
              onClick={() => router.push("/distributor/profile/edit/email")}
            >
              Change email
            </button>
            <button className="rounded-[20px] bg-[#FE131399] text-white font-outfit text-[14px] mb-[6px] py-1 px-3" onClick={() => setModal(true)}>
              Delete account
            </button>
          </div>
          <button className="rounded-[20px] bg-[#438DB8] text-white font-outfit text-[16px] py-1 px-4 h-fit" onClick={handleSave}>
            Save
          </button>
        </div>
        <ReactModal
          isOpen={modal}
          onRequestClose={() => setModal(false)}
          ariaHideApp={false}
          style={{
            content: {
              width: "60%",
              height: "fit-content",
              borderRadius: "20px",
              border: "1px solid #00000073",
              backgroundColor: "white",
              top: "25%",
              left: "25%",
            },
          }}
        >
          <div className="w-full flex justify-end mb-[10px]" onClick={() => setModal(false)}>
            <IoCloseCircle size={25} color="#FE131399" />
          </div>
          <div className="w-fit border border-[#00000073] rounded-[10px] px-[10px] mb-[16px] mx-auto">
            {/* <span className="font-outfit font-medium text-[14px] text-main border-b border-[#00000080] pb-1">
              Type your company name to delete account (My company)
            </span> */}
            {/* <input
              type="text"
              className="bg-transparent text-[14px] font-outfit w-full outline-none text-[#49454FCC] pb-1"
            /> */}
            <span className="font-outfit font-medium text-[14px] text-main">Are you sure you want to delete your account?</span>
          </div>
          <div className="w-full flex justify-center mb-[30px]">
            <button className="rounded-[20px] bg-[#438DB8] text-white font-outfit text-[16px] py-1 px-5 h-fit" onClick={deleteAcc}>
              Confirm
            </button>
          </div>
        </ReactModal>
      </div>
    </div>
  );
}
