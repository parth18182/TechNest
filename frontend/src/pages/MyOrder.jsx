import Ordercard from '@/components/Ordercard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function MyOrder() {

    const [userOrder, setUserOrder] = useState(null)
    const getUserOrders = async () => {
        const accessToken = localStorage.getItem("accessToken")
        const res = await axios.get(`${import.meta.env.VITE_URL}/api/orders/myorder`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        if (res.data.success) {
            setUserOrder(res.data.orders)
        }
    }

    useEffect(() => {
        getUserOrders()
    }, [])
    return (
        <>
            <Ordercard userOrder={userOrder}/>
        </>
    )
}

export default MyOrder