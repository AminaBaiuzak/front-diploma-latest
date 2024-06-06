import {ReviewData} from "@/types/order";
import axios from "axios";

const createReview = async (items: { formData: ReviewData; token: string }) => {
    const response = await axios.post(
        process.env.NEXT_PUBLIC_URL + "/api/store/reviews", items.formData, {
            headers: {
                Authorization: "Bearer " + items.token,
            },
        });

    console.log(items.formData.rating)
    console.log(items.formData.text)

    return response.data;
};


const getReviewsByStore = async (token: string) => {
    const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/store/reviews`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

const getReviewsByDistributor = async (token: string) => {
    const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/distributor/reviews/`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

const deleteReview = async (reviewId: string, token: string) => {
    const response = await axios.delete(process.env.NEXT_PUBLIC_URL + `/api/store/reviews/${reviewId}`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

const getReviewsByProductId = async (productId: string, token: string) => {
    const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/distributor/reviews/product/${productId}`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

const getAverageRatingByDistributorId = async ( token: string) => {
    const reviews = await getReviewsByDistributor(token);

    if (reviews.length === 0) {
        return 0;
    }

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
};

export
{
    createReview,
    getReviewsByStore,
    getReviewsByDistributor,
    deleteReview,
    getReviewsByProductId,
    getAverageRatingByDistributorId,
}