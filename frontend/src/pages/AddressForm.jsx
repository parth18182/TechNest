import { addAddress, deleteAddress, setCart, setSelectedAddress } from '@/components/redux/productSlice'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function AddressForm() {
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: ""
    })
    const dispatch = useDispatch()
    const { cart, addresses, selectedAddress } = useSelector((store) => store.product)
    const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true)
    const navigate = useNavigate()
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handlSave = () => {
        dispatch(addAddress(formData))
        setShowForm(false)
    }

    const handlePayment = async () => {
        const accessToken = localStorage.getItem("accessToken")
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_URL}/api/orders/create-order`, {
                products: cart?.items?.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                tax,
                shipping,
                amount: total,
                currency: "INR"
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            },)

            if (!data.success) return toast.error("something went wrong")

            console.log("Razorpay data", data)

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                order_id: data.order.id,
                name: "E-Kart",
                description: "Order Payment",
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post(`${import.meta.env.VITE_URL}/api/orders/verify-payment`, response, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })

                        if (verifyRes.data.success) {
                            toast.success("✅ Payment Successfull!")
                            dispatch(setCart({ items: [], totalPrice: 0 }))
                            navigate('/order-success')
                        }
                        else {
                            toast.error("❌ Payment Verification Failed")
                        }
                    } catch (error) {
                        toast.error("Error verifying payment")
                    }
                },
                modal: {
                    onDismiss: async function () {
                        //handle user closing the popup
                        await axios.post(`${import.meta.env.VITE_URL}/api/orders/verify-payment`, {
                            razorpay_order_id: data.order.id,
                            paymentFailed: true,
                        }, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`
                            }
                        })
                        toast.error("❌Payment Cancelled or Failed")
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: {
                    color: "#F472B6"
                }
            }

            const rzp = new window.Razorpay(options)

            // Listen for payments failure

            rzp.on("payment.failed", async function (response) {
                await axios.post(`${import.meta.env.VITE_URL}/api/orders/verify-payment`, {
                    razorpay_order_id: data.order.id,
                    paymentFailed: true
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
                toast.error("Payment Failed Please try again")
            })
            rzp.open()
        } catch (error) {
             toast.error("something went wrong while processing the payment")
             console.log(error)
        }
    }

    console.log(window.Razorpay)

    const subtotal = cart.totalPrice
    const shipping = subtotal > 50 ? 0 : 10;
    const tax = parseFloat((subtotal * 0.05).toFixed(2))
    const total = subtotal + shipping + tax;
    return (
        <div className='max-w-7xl mx-auto grid place-items-center p-10 '>
            <div className='grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto'>
                <div className='space-y-4 p-6 bg-white '>
                    {
                        showForm ? (
                            <>
                                <div>
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input id="fullName"
                                        name="fullName"
                                        required
                                        placeholder="John doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone"
                                        name="phone"
                                        required
                                        placeholder="+914181856"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email"
                                        name="email"
                                        required
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="address">address</Label>
                                    <Input id="address"
                                        name="address"
                                        required
                                        placeholder="112 hiton socity"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <Label htmlFor="city">city</Label>
                                        <Input id="city"
                                            name="city"
                                            required
                                            placeholder="gandhinagar"
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">state</Label>
                                        <Input id="state"
                                            name="state"
                                            required
                                            placeholder="hydrabad"
                                            value={formData.state}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    <div>
                                        <Label htmlFor="zip">Zip Code</Label>
                                        <Input id="zip"
                                            name="zip"
                                            required
                                            placeholder="393568"
                                            value={formData.zip}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="country">country</Label>
                                        <Input id="country"
                                            name="country"
                                            required
                                            placeholder="india"
                                            value={formData.country}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <Button onClick={handlSave} className={'w-full cursor-pointer'}>Save & Continue</Button>
                            </>
                        ) : (
                            <div className='space-y-4 '>
                                <h2 className='text-lg font-semibold'>Saved Addresses</h2>
                                {
                                    addresses.map((add, index) => {
                                        return <div onClick={() => dispatch(setSelectedAddress(index))} key={index} className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}>
                                            <p className='font-medium '>{add.fullName}</p>
                                            <p>{add.phone}</p>
                                            <p>{add.email}</p>
                                            <p>{add.address}, {add.city}, {add.state}, {add.zip}, {add.country}</p>
                                            <button onClick={(e) => dispatch(deleteAddress(index))} className='absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm cursor-pointer'>Delete</button>
                                        </div>
                                    })
                                }
                                <Button variant='outline' className={'w-full'} onClick={() => setShowForm(true)}>+ Add New Address</Button>
                                <Button
                                    onClick={handlePayment}
                                    disabled={selectedAddress === null}
                                    className={'w-full bg-pink-600 '}>
                                    Proceed to checkout
                                </Button>
                            </div>

                        )
                    }
                </div>
                {/* Right Side Order Summary */}
                <div>
                    <Card className={'w-100'}>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className={'space-y-4 '}>
                            <div className='flex justify-between'>
                                <span>SubTotal ({cart.items.length}) </span>
                                <span> {subtotal.toLocaleString("en-IN")}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>shipping </span>
                                <span> {shipping.toLocaleString("en-IN")}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span>Tax </span>
                                <span> {tax}</span>
                            </div>
                            <Separator />
                            <div className='flex justify-between  font-bold text-lg'>
                                <span>Total </span>
                                <span> {total.toLocaleString("en-IN")}</span>
                            </div>
                            <div className='text-sm text-muted-foreground pt-4'>
                                <p>* Free Shipping on orders over 299</p>
                                <p>* 30-days return plicy</p>
                                <p>* Secure checkout with SSL encryption</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
export default AddressForm