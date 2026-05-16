import { Input } from "@/components/ui/input";
import { Edit, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/ImageUpload";
import axios from "axios";
import { toast } from "sonner";
import { setProducts } from "@/components/redux/productSlice";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function AdminProduct() {
    const { products } = useSelector((store) => store.product);
    const [editProduct, setEditProduct] = useState(null);
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [sortOrder, setSortOrder] = useState("")
    const accessToken = localStorage.getItem("accessToken");
    const dispatch = useDispatch();

    let filteredProducts = products.filter((product, index) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) 
    )

    if(sortOrder === 'lowToHigh'){
        filteredProducts = [...filteredProducts].sort((a,b)=> a.productPrice - b.productPrice)

    }

    if(sortOrder === 'highToLow'){
        filteredProducts = [...filteredProducts].sort((a,b)=> b.productPrice - a.productPrice)

    }

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditProduct((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append("productName", editProduct.productName);
        formData.append("productDesc", editProduct.productDesc);
        formData.append("productPrice", editProduct.productPrice);
        formData.append("category", editProduct.category);
        formData.append("brand", editProduct.brand);

        // add existing images public_ids

        const existingImages = editProduct.productImg
            .filter((img) => !(img instanceof File) && img.public_id)
            .map((img) => img.public_id);

        formData.append("existingImages", JSON.stringify(existingImages));

        //add new file


        editProduct.productImg
            .filter((img) => img instanceof File)
            .forEach((file) => {
                formData.append("files", file);
            });

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_URL}/api/products/update/${editProduct._id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            if (res.data.success) {
                toast.success("Product update successfully");
                const updateProducts = products.map((p) =>
                    p._id === editProduct._id ? res.data.product : p
                );
                dispatch(setProducts(updateProducts));
                setOpen(false)
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deleteProductHandler = async (productId) => {
        try {
            const remainingProducts = products.filter((product) => product._id !== productId)
            const res = await axios.delete(`http://localhost:5000/api/products/delete/${productId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                dispatch(setProducts(remainingProducts))
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="pl-87.5 py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
            <div className="flex justify-between">
                <div className="relative bg-white rounded-lg">
                    <Input
                        type={"text"}
                        placeholder="search product..."
                        value={searchTerm}
                        onChange={(e)=>setSearchTerm(e.target.value)}
                        className={"w-100 items-center "}
                    />
                    <Search  className="absolute right-3 top-1.5 text-gray-500" />
                </div>
                <Select onValueChange={(value)=>setSortOrder(value)}>
                    <SelectTrigger className="w-50">
                        <SelectValue placeholder="sort by price" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="lowToHigh">Price: Low To High</SelectItem>
                        <SelectItem value="highToLow">Price: High To Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {filteredProducts.map((product, index) => {
                return (
                    <Card key={index} className={"px-4"}>
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2 items-center">
                                <img
                                    src={product.productImg[0].url}
                                    alt=""
                                    className="w-25 h-25"
                                />
                                <h1 className="font-bold w-96 text-gray-700">
                                    {product.productName}
                                </h1>
                            </div>
                            <h1 className="font-semibold text-gray-800">
                                ₹{product.productPrice}
                            </h1>
                            <div className="flex gap-3">
                                <Dialog open={open} onOpenChange={setOpen}>
                                    <DialogTrigger asChild>
                                        <Edit onClick={() => { setOpen(true), setEditProduct(product) }} className="text-green-500 cursor-pointer " />
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-156.25 max-h-185 overflow-y-scroll">
                                        <DialogHeader>
                                            <DialogTitle>Edit Product</DialogTitle>
                                            <DialogDescription>
                                                Make changes to your Product here. Click save when
                                                you&apos;re done.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name-1">Product Name:</Label>
                                                <Input
                                                    type={"text"}
                                                    value={editProduct?.productName}
                                                    onChange={handleChange}
                                                    name="productName"
                                                    placeholder="ex-Iphone"
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="username-1">Price:</Label>
                                                <Input
                                                    type={"number"}
                                                    value={editProduct?.productPrice}
                                                    onChange={handleChange}
                                                    name="productPrice"
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="username-1">Brand:</Label>
                                                    <Input
                                                        type={"text"}
                                                        value={editProduct?.brand}
                                                        onChange={handleChange}
                                                        name="brand"
                                                        placeholder="Ex-apple"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="username-1">Category:</Label>
                                                    <Input
                                                        type={"text"}
                                                        name="category"
                                                        value={editProduct?.category}
                                                        onChange={handleChange}
                                                        placeholder="Ex-Mobile"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label>Description</Label>
                                                </div>
                                                <Textarea
                                                    name="productDesc"
                                                    value={editProduct?.productDesc}
                                                    onChange={handleChange}
                                                    placeholder="enter brief description of product"
                                                />
                                            </div>
                                            <ImageUpload productData={editProduct} setProductData={setEditProduct} />
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleSave} type="submit">Save changes</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                    <AlertDialogTrigger><Trash2 className="text-red-500 cursor-pointer" /></AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle><b>Delete Item</b></AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this item?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
export default AdminProduct;
