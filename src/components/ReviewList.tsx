// components/ReviewList.tsx
import { useQuery } from "@tanstack/react-query";
import Loader from "react-spinners/PuffLoader";
import { GoStarFill } from "react-icons/go";
import { getReviewsByProductId } from "@/services/reviews";
import {getStoreProfile} from "@/services/auth";

interface ReviewListProps {
    productId: string;
    // onUpdateReviewCount: (count: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ productId }) => {

    const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError } = useQuery({
        queryKey: ["reviews", productId],
        queryFn: () => {
            const token = localStorage.getItem("duken");
            if (!token) {
                throw new Error("No token found");
            }
            return getReviewsByProductId({ id: productId, token: JSON.parse(token).token });
        },
        // onSuccess: (data) => {
        //     onUpdateReviewCount(data.reviews.length);
        // },
    });

    const { data: storeData, isLoading: storeLoading, isError: storeError } = useQuery({
        queryKey: ["profile_store"],
        queryFn: () => {
            const token = localStorage.getItem("duken");
            if (!token) {
                throw new Error("No token found");
            }
            return getStoreProfile(JSON.parse(token).token);
        },
    });

    if (reviewsLoading) return <Loader color={"#367193"} loading={true} size={50} className="m-auto mt-7" />;
    if (reviewsError) return <p>An error occurred while loading reviews.</p>;

    return (
        <div className="mt-[20px]">
            {reviewsData?.reviews.map((review: any) => (
                <div key={review.id} className="border-b border-[#EBEBEE] py-[10px]">
                    <p className="font-bold">{storeData.store.company_name}</p>
                    <p>{review.text}</p>
                    <div className="flex gap-[5px]">
                        {[...Array(review.rating)].map((_, index) => (
                            <GoStarFill key={index} size={18} color="#FFC350CC" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
