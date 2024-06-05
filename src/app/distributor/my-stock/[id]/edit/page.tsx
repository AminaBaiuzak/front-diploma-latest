"use client";
import { deleteProduct, getProductById, updateProduct, uploadImage } from "@/services/product";
import { IProductUpdate } from "@/types/product";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa6";
import Loader from "react-spinners/PuffLoader";
import { IoMdCloseCircle } from "react-icons/io";
import axios from "axios";
import { toast } from "react-toastify";

export default function NewItemPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [product_name, setProduct_name] = useState("");
  const [product_description, setProduct_description] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [imgURL, setImgURL] = useState<string[] | []>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => {
      const token = localStorage.getItem("duken");
      if (!token) {
        throw new Error("No token found");
      }
      return getProductById({ id, token: JSON.parse(token).token });
    },
  });

  const cities = useQuery({
    queryKey: ["cities"],
    queryFn: () => {
      return axios.get("https://countriesnow.space/api/v0.1/countries/cities/q?country=Kazakhstan");
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isError) {
      localStorage.removeItem("duken");
      toast.error("An error occurred. Please log in.");
      router.replace("/login");
    }
  }, [isError]);

  useEffect(() => {
    if (data) {
      setProduct_name(data.product.product_name);
      setProduct_description(data.product.product_description);
      setPrice(data.product.price);
      setStock(data.product.stock);
      setSelectedCity(data.product.city);
      data.product.ImgURLs && setImgURL(data.product.ImgURLs);
    }
  }, [data]);

  const queryClient = useQueryClient();

  const update = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_items"], refetchType: "all" });
      toast.success("Product updated successfully");
      router.push("/distributor/my-stock");
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const deleteFn = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my_items"], refetchType: "all" });
      toast.success("Product deleted successfully");
      router.push("/distributor/my-stock");
    },
    onError: () => {
      toast.error("An error occurred. Please try again.");
    },
  });

  const handleSubmit = () => {
    if (!product_name || !product_description || !price || !stock) {
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
      return router.replace("/login");
    }

    update.mutate({ formData, token: JSON.parse(token).token, id });
  };

  const handleDelete = () => {
    const token = localStorage.getItem("duken");
    if (!token) {
      return router.replace("/login");
    }

    deleteFn.mutate({
      token: JSON.parse(token).token,
      id,
    });
  };

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

  if (isLoading) return <Loader color={"#367193"} loading={true} size={150} className="m-auto mt-7" />;
  if (isError) return null;

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
          <input
            type="file"
            style={{ display: "none" }}
            id="fileInput"
            onChange={(event) => {
              uploadImageHandler(event);
            }}
          />
        </div>
        <div className="w-full flex gap-3 flex-wrap">
          {imgURL !== null && imgURL.map((url, index) => (
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
            {cities.data?.data.data.map((city: any) => (
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
        <div className="flex w-full justify-between">
          <button
            type="submit"
            className="bg-[#FA5252] rounded-[8px] flex justify-center items-center gap-[10px] text-white font-outfit mb-[30px] w-fit pl-[30px] pr-[15px] py-[18px]"
            onClick={handleDelete}
          >
            Delete
            <IoMdCloseCircle size={19} color="white" />
          </button>
          <button
            type="submit"
            className="bg-[#136AF3] rounded-[8px] flex justify-center items-center text-white font-outfit mb-[30px] w-fit px-[30px] py-[18px]"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
