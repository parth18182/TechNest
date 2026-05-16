import React from 'react'

function Verify() {
  return (
    <div className='bg-pink-100 h-screen flex justify-center items-center '>
        <div className='bg-white w-[500px] h-[250px] flex flex-col p-8 gap-4 justify-center items-center shadow-lg rounded-2xl'>
            <h2 className='text-green-500 text-2xl font-semibold '>✅ check your email</h2>
            <p className='text-center text-gray-400'>we have sent you an email for verification. please check your inbox and click on the verification link</p>
        </div>
    </div>
)
}

export default Verify