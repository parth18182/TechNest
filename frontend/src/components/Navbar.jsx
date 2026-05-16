import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from './redux/userSlice'
 
function Navbar() {
  const {user} = useSelector(store=>store.user)
  const {cart} = useSelector(store=>store.product)
  const accessToken = localStorage.getItem('accessToken');
  const admin = user?.role === 'admin' ? true : false
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const logoutHandler = async()=>{
    try {
      const res = await axios.post('http://localhost:5000/api/users/logout',{},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      })
      if(res.data.success){
      dispatch(setUser(null))
        toast.success(res.data.message)
      }
    } catch (error) {    
      console.log(error)
    }
  }
  console.log(cart)
  return (
    <header className='bg-pink-50 fixed w-full z-20 border-b border-pink-200'>
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        {/* logo section */}
        <div className='flex gap-x-3 items-center'>
          <img src="./public/ekart.png" alt="" className='w-12.5' />
          <h1 className='text-3xl font-bold text-pink-600'>TechNest</h1>
        </div>
        {/* nav section */}
        <nav className="flex gap-10 justify-between items-center">
          <ul className='flex gap-7 items-center text-xl font-semibold'>
            <Link to={'/'}><li>Home</li></Link>
            <Link to={'/products'}><li>Products</li></Link>
            {
                user && <Link to={`/profile/${user._id}`}><li>Hello {user.firstname}</li></Link>
            }
            {
                admin && <Link to={`/Dashboard/sales`}><li>Dashboard</li></Link>
            }
          </ul>
          <Link to={'/cart'} className='relative'><ShoppingCart/>
          <span className="rouded-full bg-pink-500 absolute text-white -top-3 -right-5 rounded-full size-6 px-2">{cart?.items?.length}</span>
          </Link>
          {
            user ? <Button onClick={logoutHandler}  className={'bg-pink-600 text-white cursor-pointer '}>Logout</Button>:
            <Button  onClick={()=>navigate('/login')} className={'bg-pink-600 text-white cursor-pointer '}>Login</Button>
          }
        </nav>
      </div>
    </header>
  )
}

export default Navbar