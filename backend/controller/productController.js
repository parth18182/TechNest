import { OrderModel } from "../models/orderModel.js";
import ProductModel from "../models/productModel.js";
import cloudinary from "../utilis/cloudinary.js";
import getDataUri from "../utilis/dataUri.js";

export const addProduct = async (req, res) => {
    try {
        const { productName, productDesc, productPrice, category, brand } = req.body;
        const userId = req.id;
        if (!productName || !productDesc || !productPrice || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        // Handle multiple image uploads
        let productImg = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                let fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mer_products"
                })
                productImg.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            };
        }
        // Create new product
        const newProuduct = await ProductModel.create({
            userId,
            productName,
            productDesc,
            productPrice,
            category,
            brand,
            productImg  //Array of objects  [{url, public_id}, {url, public_id}]
        })
        return res.status(200).json({
            success: true,
            message: "Product added successfully",
            product: newProuduct
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find();

        if (!products) {
            return res.status(404).json({
                success: false,
                message: "No products found",
                products: []
            })
        }
        return res.status(200).json({
            success: true,
            products
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        //delete img from cloudinary
        if (product.productImg && product.productImg.length > 0) {
            for (let img of product.productImg) {
                const result = await cloudinary.uploader.destroy(img.public_id);
            }
        }
        //delete product from mongodb\
        await ProductModel.findByIdAndDelete(productId);
        return res.status(200).json({
            success: true,
            message: "product deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { productName, productDesc, productPrice, category, brand, existingImages } = req.body;

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        let updatedImages = [];
        //keep selected old images
        if (existingImages) {
            const keepIds = JSON.parse(existingImages);
            updatedImages = product.productImg.filter((img) =>
                keepIds.includes(img.public_id)
            )
            //delete only removed images
            const removeImages = product.productImg.filter((img) =>
                !keepIds.includes(img.public_id)
            );
            for (let img of removeImages) {
                await cloudinary.uploader.destroy(img.public_id)
            }
        }
        else {
            updatedImages = product.productImg;
        }
        //upload new images if any 
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const fileUri = getDataUri(file);
                const result = await cloudinary.uploader.upload(fileUri, {
                    folder: "mern_product"
                });
                updatedImages.push({
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        }
        // update Product 
        product.productName = productName || product.productName;
        product.productDesc = productDesc || product.productDesc;
        product.productPrice = productPrice || product.productPrice;
        product.category = category || product.category;
        product.brand = brand || product.brand;
        product.productImg = updatedImages;
        await product.save()

        return res.status(200).json({
            success: true,
            message: "updated product successfully",
            product
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

