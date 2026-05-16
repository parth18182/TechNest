import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import axios from 'axios'
import { Car, Import } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function AdminSales() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalSales: 0,
        salesByDate: []
    })

    const fetchStats = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken")
            const res = await axios.get(`${import.meta.env.VITE_URL}/api/orders/sales`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            console.log("API DATA 👉", res.data)

            if (res.data.success) {
                setStats(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    console.log("STATS STATE 👉", stats)

    return (
        <div className='pl-87.5 bg-gray-100 py-20 h-screen pr-20 mx-auto px-4'>
            <div className='p-6 grid gap-6 lg:grid-cols-4 '>
                {/* Stats card */}
                <Card className={'bg-pink-500 text-white'}>
                    <CardHeader>
                        <CardTitle>
                            Total Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={'text-2xl font-bold'}>
                        {stats.totalUsers}
                    </CardContent>
                </Card>
                <Card className={'bg-pink-500 text-white'}>
                    <CardHeader>
                        <CardTitle>
                            Total Products
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={'text-2xl font-bold'}>
                        {stats.totalProducts}
                    </CardContent>
                </Card>
                <Card className={'bg-pink-500 text-white'}>
                    <CardHeader>
                        <CardTitle>
                            Total Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={'text-2xl font-bold'}>
                        {stats.totalOrders}
                    </CardContent>
                </Card>
                <Card className={'bg-pink-500 text-white'}>
                    <CardHeader>
                        <CardTitle>
                            Total Sales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className={'text-2xl font-bold'}>
                        {stats.totalSales}
                    </CardContent>
                </Card>

                {/* Sales Chart */}

                <Card className={'lg:col-span-4'}>
                    <CardHeader>
                        <CardTitle>Sales (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent style={{height:300}}>
                        <ResponsiveContainer width={'100%'} height={'100%'}>
                            <AreaChart data={stats.sales}>
                                <XAxis dataKey="date"/>
                                <YAxis/>
                                <Tooltip/>
                                <Area type={'monotone'} dataKey={'amount'} stroke='#F472B6' fill='#F472B6'/>
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminSales