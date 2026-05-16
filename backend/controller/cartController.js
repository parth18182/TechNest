import { CartModel } from '../models/cartModel.js';
import ProductModel from '../models/productModel.js';

export const getCart = async (req, res) => {
    try {
        const userId = req.id;
        const cart = await CartModel.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.json({ success: true, cart: [] });
        }

        return res.status(200).json({
            success: true,
            cart
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const addToCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;
        // check if product exist
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        // find the user cart exist

        let cart = await CartModel.findOne({ userId });

        // if cart not exist create new cart
        if (!cart) {
            cart = new CartModel({
                userId,
                items: [{ productId, quantity: 1, price: product.productPrice }],
                totalPrice: product.productPrice
            });
        }
        else {
            // find if product already in cart
            const itemIndex = cart.items.findIndex(
                (item) => item.productId.toString() === productId
            );
            if (itemIndex > -1) {
                // product exist in cart, increase quantity
                cart.items[itemIndex].quantity += 1;

            }
            else {
                //if new product, add to cart
                cart.items.push({ productId, quantity: 1, price: product.productPrice });
            }

            // recalculate total price
            cart.totalPrice = cart.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
        }

        // save cart
        await cart.save();

        // populate product details
        const populatedCart = await CartModel.findById(cart._id).populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            cart: populatedCart
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        let cart = await CartModel.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }

        const item = cart.items.find((item) => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: "item not found in cart"
            })
        }
        if (type === "increase") {
            item.quantity += 1;
        }
        else if (type === "decrease" && item.quantity > 1) {

            item.quantity -= 1;
        }

        // recalculate total price
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        // save cart
        await cart.save();
        cart = await cart.populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        let cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            })
        }
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

        await cart.save();
        cart = await cart.populate("items.productId")
        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}