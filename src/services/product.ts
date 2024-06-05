import {IProductUpdate} from "@/types/product";
///////////////////////For reviews/////////////////////////////////
import axios from "axios";

const createProduct = async (items: { formData: IProductUpdate; token: string }) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_URL + "/api/distributor/products", items.formData, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};

const getProducts = async (token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + "/api/distributor/products", {
    headers: {
      Authorization: "Bearer " + token,
    },
    params: {
      page: 100,
      pageSize: 10,
    },
  });
  return response.data;
};

const getProductById = async (items: { id: string; token: string }) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/distributor/products/${items.id}`, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};

const updateProduct = async (items: { formData: IProductUpdate; token: string; id: string }) => {
  const response = await axios.put(process.env.NEXT_PUBLIC_URL + `/api/distributor/products/${items.id}`, items.formData, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};

const deleteProduct = async (items: { id: string; token: string }) => {
  const response = await axios.delete(process.env.NEXT_PUBLIC_URL + `/api/distributor/products/${items.id}`, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};

const uploadImage = async (items: { formData: any; token: string }) => {
  const response = await axios.post(process.env.NEXT_PUBLIC_URL + "/api/upload/image", items.formData, {
    headers: {
      Authorization: "Bearer " + items.token,
    },
  });
  return response.data;
};




const createReview = async (items: { distributorId: string; productId: string; rating: number; text: string; token: string }) => {
  // const response = await axios.post(
  //     process.env.NEXT_PUBLIC_URL + "/api/reviews",
  //     {
  //       distributorId: items.distributorId,
  //       productId: items.productId,
  //       rating: items.rating,
  //       text: items.text,
  //     },
  //     {
  //       headers: {
  //         Authorization: "Bearer " + items.token,
  //       },
  //     }
  // );
  // return response.data;
  console.log(items.rating)
  console.log(items.text)
};




const getReviewsByStoreId = async (storeId: string, token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/reviews/store/${storeId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

const getReviewsByDistributorId = async (distributorId: string, token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/reviews/distributor/${distributorId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

const deleteReview = async (reviewId: string, token: string) => {
  const response = await axios.delete(process.env.NEXT_PUBLIC_URL + `/api/reviews/${reviewId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

const getReviewsByProductId = async (productId: string, token: string) => {
  const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/reviews/product/${productId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  return response.data;
};

const getAverageRatingByDistributorId = async (distributorId: string, token: string) => {
  const reviews = await getReviewsByDistributorId(distributorId, token);

  if (reviews.length === 0) {
    return 0;
  }

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};


export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadImage,

  createReview,
  getReviewsByStoreId,
  getReviewsByDistributorId,
  deleteReview,
  getReviewsByProductId,
  getAverageRatingByDistributorId,

};
