import {ReviewData} from "@/types/order";
import axios from "axios";

const createReview = async (items: { formData: ReviewData; token: string }) => {
    const response = await axios.post(
        process.env.NEXT_PUBLIC_URL + "/api/store/reviews", items.formData, {
            headers: {
                Authorization: "Bearer " + items.token,
            },
        });

    // console.log(items.formData.rating)
    // console.log(items.formData.text)

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
    const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/distributor/reviews`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

const deleteReview = async (items: {id: string, token: string}) => {

    console.log("Inside deleteReview function", items.id)

    const response = await axios.delete(process.env.NEXT_PUBLIC_URL + `/api/store/reviews/${items.id}`,
        {
        headers: {
            Authorization: "Bearer " + items.token,
        },
    });
    console.log("Deletion function", items.id)
    return response.data;
};

const getReviewsByProductIdForStore = async (productId: string, token: string) => {
    const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/store/reviews/product/${productId}`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

const getReviewsByProductIdForDistributor = async (productId: string, token: string) => {
    const response = await axios.get(process.env.NEXT_PUBLIC_URL + `/api/distributor/reviews/product/${productId}`, {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return response.data;
};

const getAverageRatingByDistributorId = async (token: string) => {
    const reviewsData = await getReviewsByDistributor(token);

    console.log("from getAverageRatingByDistributorId", reviewsData.reviews);

    const totalRating = reviewsData.reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviewsData.reviews.length;

    console.log(averageRating)

    return averageRating;
};

export
{
    createReview,
    getReviewsByStore,
    getReviewsByDistributor,
    deleteReview,
    getReviewsByProductIdForStore,
    getReviewsByProductIdForDistributor,
    getAverageRatingByDistributorId,
}