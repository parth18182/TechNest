import FilterSidebar from '@/components/FilterSidebar'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProductCard from '@/components/ProductCard'
import { toast } from 'sonner'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/components/redux/productSlice'

function Products() {
    const [allProducts, setAllProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [category, setCategory] = useState("All")
    const [brand, setBrand] = useState("All")
    const [priceRange, setPriceRange] = useState([0, 999999])
    const [sortOrder, setSortOrder] = useState("")
    const { products } = useSelector(store => store.product)
    const dispatch = useDispatch();

    const getAllProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/products/getallproducts`);
            if (res.data.success) {
                setAllProducts(res.data.products)
                dispatch(setProducts(res.data.products))
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)

        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (allProducts.length === 0) return;

        let filtered = [...allProducts];
        // search filter
        if (search.trim() !== "") {
            filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()));
        }
        // category filter
        if (category !== "All") {
            filtered = filtered.filter(p => p.category === category);
        }
        // brand filter
        if (brand !== "All") {
            filtered = filtered.filter(p => p.brand === brand);
        }
        // price filter
        filtered = filtered.filter(
            p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1]
        );

        // sort filter
        if (sortOrder === "lowtohigh") {
            filtered = filtered.sort((a, b) => a.productPrice - b.productPrice);
        }
        else if (sortOrder === "hightolow") {
            filtered = filtered.sort((a, b) => b.productPrice - a.productPrice);
        }

        dispatch(setProducts(filtered));
    }, [search, category, brand, priceRange, sortOrder, allProducts, dispatch])

    useEffect(() => {
        getAllProducts()
    }, [])
    console.log(allProducts)

    return (
        <div className='pt-25 pb-10'>
            <div className="flex max-w-7xl mx-auto gap-7">
                {/* Sidebar */}
                <FilterSidebar
                    search={search}
                    setSearch={setSearch}
                    brand={brand}
                    setBrand={setBrand}
                    category={category}
                    setCategory={setCategory}
                    allProducts={allProducts}
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                />
                {/* main product section */}
                <div className="flex flex-col flex-1">
                    <div className="flex justify-end mb-4">
                        <Select onValueChange={(value) => setSortOrder(value)}>
                            <SelectTrigger className="w-50 ">
                                <SelectValue placeholder="Sort By Price" />
                            </SelectTrigger>
                            <SelectContent  >
                                <SelectGroup >
                                    <SelectItem className={'text-black hover:text-pink-200'} value="lowtohigh">Price : Low to High</SelectItem>
                                    <SelectItem className={'text-black hover:text-pink-200'} value="hightolow">Price : High to Low</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    {/* product grid */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-7">
                        {
                            products?.map((product) => (
                                <ProductCard key={product._id} product={product} loading={loading} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Products