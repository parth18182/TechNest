import Ordercard from '@/components/Ordercard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function ShowUserOrders() {
  const [userOrder, setUserOrder] = useState(null)
  const params = useParams()
  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken")
    const res = await axios.get(`${import.meta.env.VITE_URL}/api/orders/user-order/${params.userId}`, {
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
    <div className='pl-87.5 py-20'>

      <Ordercard userOrder={userOrder} />
    </div>
  )
}

export default ShowUserOrders