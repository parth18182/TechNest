import { CheckCircle } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

function OrderSuccess() {

    const navigate = useNavigate();

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-6'>
            <div className='bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center'>
                {/* Success Icon */}
                <div className='flex justify-center'>
                    <CheckCircle className='h-20 w-20 text-green-500' />
                </div>

                {/* Title */}
                <div className='text-2xl font-bold mt-6 text-gray-800'>
                    Payment Successful🎉
                </div>

                {/* Message*/}
                <div className='text-2xl font-bold mt-6 text-gray-800'>
                    Thank you for your purchase! your order has been placed successfully
                </div>

                {/* Buttons */}
                <div className='mt-6 flex flex-col gap-3'>
                    <button
                    onClick={()=>navigate('/products')}
                    className='w-full bg-pink-600 text-white py-3 rounded-xl hover:bg-pink-700 transition'
                    >
                        Continue Shopping
                    </button>
                    
                    <button
                    onClick={()=>navigate('/orders')}
                    className='w-full border border-pink-600 text-pink-600 rounded-xl py-3 hover:bg-pink-50 transition'
                    >
                      View My Orders
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccess