import { LoaderIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/components/redux/userSlice";
import MyOrder from "./MyOrder";

const userLogo = "/userlogo.png";

function Profile() {
    const { user } = useSelector((store) => store.user);

    const params = useParams();
    const userId = params.userId;

    const dispatch = useDispatch();

    const [load, setLoad] = useState(false);

    const [updateUser, setUpdateUser] = useState({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        address: user?.address || "",
        city: user?.city || "",
        zipcode: user?.zipcode || "",
        profilePic: user?.profilePic || "",
        role: user?.role || "",
    });

    const [file, setFile] = useState(null);

    const loading = () => {
        setLoad(true);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken");

        try {
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

            const res = await axios.put(
                `${import.meta.env.VITE_URL}/api/users/updateuser/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);

                setLoad(false);

                dispatch(setUser(res.data.user));
            }
        } catch (error) {
            console.log(error);

            toast.error("Failed to update profile");

            setLoad(false);
        }
    };

    return (
        <div className="pt-20 min-h-screen bg-gray-100">
            <Tabs
                defaultValue="profile"
                className="max-w-7xl mx-auto items-center"
            >
                <TabsList>
                    <TabsTrigger value="profile">profile</TabsTrigger>
                    <TabsTrigger value="orders">orders</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div className="flex flex-col justify-center items-center bg-gray-100">
                        <h1 className="font-bold mb-7 text-2xl text-gray-800">
                            Update Profile
                        </h1>

                        <div className="w-full flex gap-10 justify-between px-7 max-w-2xl">
                            {/* Profile Picture */}
                            <div className="flex flex-col items-center">
                                <img
                                    src={updateUser?.profilePic || userLogo}
                                    alt="profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-pink-800"
                                />

                                <Label className="mt-4 cursor-pointer bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700">
                                    Change Picture

                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </Label>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4 shadow-lg p-5 rounded-lg bg-white"
                            >
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="block text-sm font-medium">
                                            First Name
                                        </Label>

                                        <Input
                                            type="text"
                                            placeholder="Enter first name"
                                            name="firstname"
                                            value={updateUser.firstname}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg px-3 py-2 mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label className="block text-sm font-medium">
                                            Last Name
                                        </Label>

                                        <Input
                                            type="text"
                                            placeholder="Enter last name"
                                            name="lastname"
                                            value={updateUser.lastname}
                                            onChange={handleChange}
                                            className="w-full border rounded-lg px-3 py-2 mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium">
                                        Email
                                    </Label>

                                    <Input
                                        type="email"
                                        name="email"
                                        value={updateUser.email}
                                        disabled
                                        className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium">
                                        Phone Number
                                    </Label>

                                    <Input
                                        type="text"
                                        name="phoneNo"
                                        value={updateUser.phoneNo}
                                        onChange={handleChange}
                                        placeholder="Enter contact number"
                                        className="w-full border rounded-lg px-3 py-2 mt-1"
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium">
                                        Address
                                    </Label>

                                    <Input
                                        type="text"
                                        name="address"
                                        value={updateUser.address}
                                        onChange={handleChange}
                                        placeholder="Enter address"
                                        className="w-full border rounded-lg px-3 py-2 mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="block text-sm font-medium">
                                            City
                                        </Label>

                                        <Input
                                            type="text"
                                            name="city"
                                            value={updateUser.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                            className="w-full border rounded-lg px-3 py-2 mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label className="block text-sm font-medium">
                                            Zip Code
                                        </Label>

                                        <Input
                                            type="text"
                                            name="zipcode"
                                            value={updateUser.zipcode}
                                            onChange={handleChange}
                                            placeholder="Enter zipcode"
                                            className="w-full border rounded-lg px-3 py-2 mt-1"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    onClick={loading}
                                    className="w-full bg-pink-600 mt-4 hover:bg-pink-700 text-white font-semibold cursor-pointer py-2 rounded-lg"
                                >
                                    {load ? (
                                        <LoaderIcon className="mr-2 h-4 w-4 animate-spin inline-block" />
                                    ) : (
                                        "Update Profile"
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="orders">
                    <MyOrder />
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Profile;