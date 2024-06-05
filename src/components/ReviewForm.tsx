import { useState } from "react";
import { GoStarFill } from "react-icons/go";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview } from "@/services/product";
import { toast } from "react-toastify";

export default function ReviewForm({ distributorId, productId, token }) {
    const [rating, setRating] = useState<number>(0);
    const [text, setText] = useState<string>("");

    const queryClient = useQueryClient();

    const addReview = useMutation({
        mutationFn: createReview,
        onSuccess: () => {
            queryClient.invalidateQueries("reviews");
            toast.success("Review created successfully.");
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

        addReview.mutate({ distributorId, productId, rating, text, token });
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
