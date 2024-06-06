"use client";

import { useState } from "react";
import { GoStarFill } from "react-icons/go";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/services/reviews";
import { toast } from "react-toastify";
import {ReviewData} from "@/types/order";
import {useRouter} from "next/navigation";

export default function ReviewForm({ data }) {
    const router = useRouter();
    const [rating, setRating] = useState<number>(0);
    const [text, setText] = useState<string>("");

    const distributor_id = data.product.distributor_id
    const product_id = data.product.id

    const queryClient = useQueryClient();

    const addReview = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.invalidateQueries("reviews");
            toast.success("Than you for your review");
        },
        onError: () => {
            toast.error("An error occurred while creating the review.");
        },
    });

    const handleCreateReview = () => {
        if (rating === 0 || text.trim() === "") {
            toast.warn("Please provide a rating and a review text.");
            return;
        }

        const formData: ReviewData = {
            distributor_id,
            rating,
            text,
            product_id
        }

        const token = localStorage.getItem("duken");
        if (!token) {
            toast.error("No token found");
            return router.replace("/login");
        }

        addReview.mutate({ formData, token: JSON.parse(token).token });
        setRating(0);
        setText("");
    };

    return (
        <div className="w-full rounded-[20px] border border-[#EBEBEE] p-4">
            <h3 className="text-xl font-medium mb-2">Write a Review</h3>
            <div className="flex items-center mb-2">
                <span className="mr-2">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                    <GoStarFill
                        key={star}
                        size={24}
                        color={star <= rating ? "#FFB525" : "#B9BBBF"}
                        className="cursor-pointer"
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your review..."
                className="w-full h-32 border border-[#EBEBEE] rounded-[10px] p-2 mb-2"
            >

            </textarea>
            <button
                onClick={handleCreateReview}
                className="bg-[#66CD88] text-white font-medium px-4 py-2 rounded-md"
            >
                Submit Review
            </button>
        </div>
    );
}
