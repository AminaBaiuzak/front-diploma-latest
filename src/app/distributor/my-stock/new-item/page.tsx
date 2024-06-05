"use client";
import { createProduct, uploadImage } from "@/services/product";
import { IProductUpdate } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import {  useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { toast } from "react-toastify";

export default function NewItemPage() {
  const router = useRouter();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [product_name, setProduct_name] = useState("");
  const [product_description, setProduct_description] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imgURL, setImgURL] = useState<string[] | []>([]);

  const cities = useQuery({
    queryKey: ["cities"],
    queryFn: () => {
      return axios.get("https://countriesnow.space/api/v0.1/countries/cities/q?country=Kazakhstan");
    },
    staleTime: Infinity,
  });

  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_items"], refetchType: "all" });
      router.push("/distributor/my-stock");
      toast.success("Product created successfully");
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const upload = useMutation({
    mutationFn: uploadImage,
    onSuccess: (data) => {
      setImgURL((prev) => [...prev, data.image_url]);
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

  const handleSubmit = () => {
    if (!product_name || !product_description || !price || !stock || !selectedCity || !selectedCategory) {
      toast.warn("Please fill in all fields");
      return;
    }

    let priceNumber = parseFloat(price)
    if (isNaN(priceNumber)) {
      toast.warn("Price must be a number");
      return
    }

    let stockNumber = parseFloat(stock)
    if (isNaN(stockNumber)) {
      toast.warn("Stock must be a number");
      return
    } else if (!Number.isInteger(stockNumber)) {
      toast.warn("Stock must be an integer");
      return
    }

    const formData: IProductUpdate = {
      product_name,
      product_description,
      price: +priceNumber.toFixed(2),
      stock: stockNumber,
      city: selectedCity,
      ImgURLs: imgURL,
    };

    const token = localStorage.getItem("duken");
    if (!token) {
      toast.error("No token found");
      return router.replace("/login");
    }

    create.mutate({ formData, token: JSON.parse(token).token });
  };

  return (
    <div className="pl-[103px] pr-[37px] pt-[30px] pb-[80px] bg-[#36719314] flex-1 flex font-outfit">
      <div className="bg-white w-full h-full rounded-lg px-[50px] border border-[#EBEBEE] shadow-md flex flex-col gap-[16px] pt-[50px]">
        <div className="w-full">
          <p className="text-main text-lg">Item title</p>
          <input
            type="text"
            className="placeholder:text-[#42506666] placeholder:text-lg text-main text-lg p-[14px] border border-[#42506666] rounded-[8px] w-full"
            placeholder="Text"
            value={product_name}
            onChange={(e) => setProduct_name(e.target.value)}
          />
        </div>
        <div className="w-full">
          <p className="text-main text-lg">Description</p>
          <textarea
            rows={4}
            className="placeholder:text-[#42506666] placeholder:text-lg text-main text-lg p-[14px] border border-[#42506666] rounded-[8px] w-full"
            placeholder="Tell us about your product..."
            value={product_description}
            onChange={(e) => setProduct_description(e.target.value)}
          />
        </div>
        <p className="text-main text-lg">Photos (The first one will be main)</p>
        <div className="rounded-[70px] bg-[#F0EFFA] px-[8px] py-1 flex justify-center items-center gap-1 w-fit">
          <FaDownload size={15} color="#535356" />
          <label className=" font-outfit text-[14px] font-medium text-main" htmlFor="fileInput">
            Upload Photo
          </label>
          <input type="file" style={{ display: "none" }} id="fileInput" onChange={(event) => uploadImageHandler(event)} />
        </div>
        <div className="w-full flex gap-3 flex-wrap">
          {imgURL.map((url, index) => (
            <div key={index} className="w-[118px]">
              <img alt="not found" src={url} className="rounded-[8px] object-cover h-[90px] w-full" />
              <br />
              <button
                className="rounded-[70px] bg-[#F0EFFA] px-[8px] py-1 flex justify-center items-center gap-1 w-fit"
                onClick={() =>
                  setImgURL((prev) => {
                    return prev.filter((item) => item !== url);
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="w-full">
          <p className="text-main text-lg">Location</p>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="text-main text-lg p-[14px] border border-[#42506666] rounded-[8px] w-full"
          >
            <option value=""></option>
            {cities.data?.data.data.map((city: string) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <p className="text-main text-lg">Category</p>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-main text-lg p-[14px] border border-[#42506666] rounded-[8px] w-[50%]"
          >
            <option value={""}></option>
            <option value={"Category-1"}>Category-1</option>
            <option value={"Category-2"}>Category-2</option>
            <option value={"Category-3"}>Category-3</option>
          </select>
        </div>
        <div className="w-full flex gap-[60px]">
          <div className="w-full">
            <p className="text-main text-lg">Price</p>
            <input
              type="text"
              className="placeholder:text-[#42506666] placeholder:text-lg text-main text-lg p-[14px] border border-[#42506666] rounded-[8px] w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="w-full">
            <p className="text-main text-lg">Stock</p>
            <input
              type="text"
              className="placeholder:text-[#42506666] placeholder:text-lg text-main text-lg p-[14px] border border-[#42506666] rounded-[8px] w-full"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-[#136AF3] rounded-[8px] flex justify-center items-center text-white font-outfit mb-[30px] w-fit px-[30px] py-[18px]"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
