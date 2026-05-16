import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Edit, EditIcon, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import userlogo from '../../assets/user.png'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

function AdminUsers() {

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  const filteredUsers = users.filter(user=>
    `${user.firstname} ${user.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken")
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/api/users/allUsers`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (res.data.success) {
        setUsers(res.data.users)
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllUsers();
  }, [])

  console.log("users--->", users)

  return (
    <div className='pl-87.5 py-20 pr-20 mx-auto px-4'>
      <h1 className='font-bold text-2xl '>User Management</h1>
      <p>View and Manage Registered User</p>

      <div className='flex relative w-75 mt-6'>
        <Search className='absolute left-2 top-1 text-gray-600 w-5' />
        <Input value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} className={'pl-10'} placeholder={"Search Users..."} />
      </div>

      <div className='grid grid-cols-3 gap-7 mt-7 '>
        {
          filteredUsers.map((user, index) => {
            return <div key={index} className='bg-pink-100 p-5 rounded-lg'>
              <div className='flex items-center gap-2'>
                <img src={user?.profilePic || userlogo} className='rounded-full w-16 aspect-square object-cover border-pink-600' alt="" />
                <div>
                  <h1 className='font-semibold'>{user?.firstname} {user?.lastname}</h1>
                  <h3>{user?.email}</h3>
                </div>
              </div>
              <div className='flex gap-3 mt-3'>
                  <Button variant='outline' onClick={()=>navigate(`/dashboard/users/${user?._id}`)}><Edit/>Edit</Button>
                  <Button onClick={()=>navigate(`/dashboard/users/ordres/${user?._id}`)}><Eye/>Show Order</Button>
              </div>
            </div>
          })
        }
      </div>
    </div>
  )
}

export default AdminUsers