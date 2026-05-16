import { Button } from '@/components/ui/button'
import { ArrowLeft, LoaderIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import userLogo from '../../assets/user.png'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'
import { setUser } from '@/components/redux/userSlice'

function UserInfo() {
  const navigate = useNavigate()
  const [updateUser, setUpdateUser] = useState();
  const [file, setFile] = useState(null)
  // const { user } = useSelector(store => store.user)
  const dispatch = useDispatch()
  const params = useParams()
  const userId = params.id
  const [load, setLoad] = useState(false)


  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({
      ...updateUser,
      profilePic: URL.createObjectURL(selectedFile),
    });
  };

  const loading = () => {
    setLoad(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(updateUser);

    const accessToken = localStorage.getItem("accessToken");
    try {
      // Create form data
      const formData = new FormData();
      formData.append("firstname", updateUser.firstname);
      formData.append("lastname", updateUser.lastname);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipcode", updateUser.zipcode);
      formData.append("role", updateUser.role);
      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(`http://localhost:5000/api/users/updateuser/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        }
      })

      if (res.data.success) {
        toast.success(res.data.message);
        setLoad(false);
        navigate(-1); // back to admin users list
      }

    } catch (error) {
      console.log(error);
      toast.error("Failed to update profile");
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/getuser/${userId}`)
      if (res.data.success) {
        setUpdateUser(res.data.user)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserDetails();
  }, [])

  return (
    <div className='pt-5 min-h-screen  '>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col justify-center items-center min-h-screen '>
          <div className='flex justify-between gap-10 '>
            <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
            <h1 className='font-bold mb-7 text-2xl text-gray-800'>Update Profile</h1>
          </div>
          <div className="w-full flex gap-10 justify-between   px-7 max-w-2xl">
            {/* profile picture */}
            <div className="flex flex-col items-center">
              <img
                src={updateUser?.profilePic || userLogo}
                alt="profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
              />
              <Label
                className={
                  "mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                }
              >
                change picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </div>
            {/* Profile Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={"block text-sm font-medium"}>
                    First Name
                  </Label>
                  <Input
                    type={"text"}
                    placeholder="enter your first name"
                    name="firstname"
                    value={updateUser?.firstname}
                    onChange={handleChange}
                    className={"w-full border rounded-lg px-3 py-2 mt-1"}
                  />
                </div>
                <div>
                  <Label className={"block text-sm font-medium"}>
                    Last Name
                  </Label>
                  <Input
                    type={"text"}
                    placeholder="enter your last name"
                    name="lastname"
                    value={updateUser?.lastname}
                    onChange={handleChange}
                    className={"w-full border rounded-lg px-3 py-2 mt-1"}
                  />
                </div>
              </div>
              <div>
                <Label className={"block text-sm font-medium"}>Email</Label>
                <Input
                  type={"email"}
                  name="email"
                  value={updateUser?.email}
                  disabled
                  className={
                    "w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                  }
                />
              </div>
              <div>
                <Label className={"block text-sm font-medium"}>
                  Phone numher
                </Label>
                <Input
                  type={"text"}
                  name="phoneNo"
                  value={updateUser?.phoneNo}
                  onChange={handleChange}
                  placeholder="Enter Your Contact No.."
                  className={"w-full border rounded-lg px-3 py-2 mt-1"}
                />
              </div>
              <div>
                <Label className={"block text-sm font-medium"}>
                  Address
                </Label>
                <Input
                  type={"text"}
                  name="address"
                  value={updateUser?.address}
                  onChange={handleChange}
                  placeholder="Enter Your Address"
                  className={"w-full border rounded-lg px-3 py-2 mt-1"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">

                <div>
                  <Label className={"block text-sm font-medium"}>city</Label>
                  <Input
                    type={"text"}
                    name="city"
                    value={updateUser?.city}
                    onChange={handleChange}
                    placeholder="Enter Your city"
                    className={"w-full border rounded-lg px-3 py-2 mt-1"}
                  />
                </div>

                <div>
                  <Label className={"block text-sm font-medium"}>
                    zip code
                  </Label>
                  <Input
                    type={"text"}
                    name="zipcode"
                    value={updateUser?.zipcode}
                    onChange={handleChange}
                    placeholder="Enter Your zipcode"
                    className={"w-full border rounded-lg px-3 py-2 mt-1"}
                  />
                </div>
              </div>
              <div className='flex gap-3 items-center'>
                <Label className={'block text-sm font-medium '}>Role: </Label>
                <RadioGroup value={updateUser?.role}
                  onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })}
                  className={'flex items-center'}>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value={'user'} id="user" />
                    <Label htmlFor="user">Uses</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value={'admin'} id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type='submit' className={'w-full mt-4 bg-pink-400 hover:bg-pink-700 text-white font-semibold'}>
                Update Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo