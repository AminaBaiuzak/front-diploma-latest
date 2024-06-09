import { useEffect } from 'react';
import {usePathname, useRouter} from "next/navigation";

export default function OrderModal({ order, isOpen, onClose }) {

    const pathname: string = usePathname();
    const role = pathname.startsWith("/distributor") ? "distributor" : "store";

    const router = useRouter();
    const handleProductPage = (product_id) => {
        if (role === 'distributor'){
            router.push(`/distributor/my-stock/${product_id}`)
        } else {
            router.push(`/store/products/${product_id}`)
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        const handleClickOutside = (event) => {
            if (!event.target.closest('.modal-content')) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, onClose]);

    console.log(order)

    function formatDate(timestamp) {
        const date = new Date(timestamp);

        const options = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };

        const formattedDate = date.toLocaleDateString('en-GB', options);
        const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return `${formattedDate}, ${formattedTime}`;
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="modal-content bg-white px-10 pt-8 rounded-lg w-full max-w-md ">
                <h2 className="text-2xl font-bold mb-4 text-center border-b text-[#367193]">Order Details</h2>

                <p className={'mb-1'}><strong>Store:</strong> {order.store_email}</p>
                <p className={'mb-1'}><strong>Distributor:</strong> {order.distributor_email}</p>

                <div className="h-[1px] bg-gradient-to-r from-[#367193] to-white my-3"></div>

                <p className={'mb-1'} onClick={() => handleProductPage(order.product_id)}><strong>Product:</strong> {order.product.product_name}</p>
                <p className={'mb-1'}><strong>Quantity:</strong> {order.quantity}</p>
                <p className={'mb-1'}><strong>Total Price:</strong> {order.total_price} ₸</p>

                <div className="h-[1px] bg-gradient-to-r from-[#367193] to-white my-3"></div>

                <p className={'mb-1'}><strong>City:</strong> {order.city}</p>
                <p className={'mb-1'}><strong>Address:</strong> {order.address}</p>

                <div className="h-[1px] bg-gradient-to-r from-[#367193] to-white my-3"></div>

                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Stage:</strong> {order.stage.stage} - {order.stage.status}</p>
                <p><strong>Date:</strong> {formatDate(order.timestamp)}</p>

                <button className="bg-main text-transparent rounded hover:bg-main-dark text-sm" onClick={onClose}>Close</button>
            </div>
        </div>

    );
}
