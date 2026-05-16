import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function VerifyEmail() {

    const {token} = useParams();
    const [status, setStatus] = useState("verifying...")
    const navigate = useNavigate();

    const verifyingEmail = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/api/users/verify`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                setStatus("✅ verified Successfully")
                setTimeout(()=>{
                    navigate('/login')
                },2000)
            }
        } catch (error) {
            setStatus("❌ verification is unsuccessfull")
            console.log(error)
        }
    }
    useEffect(()=>{
        verifyingEmail();
    },[token])

    return (
        <div className='bg-pink-100 h-screen flex justify-center items-center '>
            <div className='bg-white w-125 h-62.5 flex flex-col p-8 gap-4 justify-center items-center shadow-lg rounded-2xl'>
                <h2 className=' text-2xl font-semibold '>{status}</h2>
            </div>
        </div>
    )
}

export default VerifyEmail