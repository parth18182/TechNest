import { count } from "console";
import razorpayInstance from "../config/razorpay.js";
import { CartModel } from "../models/cartModel.js";
import { OrderModel } from "../models/OrderModel.js";
import crypto from "crypto";
import UserModel from "../models/user.js";
import ProductModel from "../models/productModel.js";

export const createOrder = async (req, res) => {
    try {
        const { products, amount, tax, shipping, currency } = req.body;

        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        const newOrder = new OrderModel({
            user: req.user._id,
            products,
            amount,
            tax,
            shipping,
            currency,
            status: "Pending",
            razorpayOrderId: razorpayOrder.id
        });

        await newOrder.save();

        res.json({
            success: true,
            order: razorpayOrder,
            dbOrder: newOrder
        });

    } catch (error) {
        console.error("❌ Create Order Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentFailed
        } = req.body;

        const userId = req.id;

        if (paymentFailed) {
            const order = await OrderModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" },
                { new: true }
            );
            return res.status(400).json({ success: false, message: "Payment Failed", order });
        }

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign)
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            const order = await OrderModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    status: "Paid",
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature
                },
                { new: true }
            );

            await CartModel.findOneAndUpdate(
                { user: userId },
                { $set: { items: [], totalPrice: 0 } }
            );

            return res.json({ success: true, message: "Payment Successful", order });
        } else {
            await OrderModel.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: "Failed" }
            );
            return res.status(400).json({ success: false, message: "Invalid signature" });
        }

    } catch (error) {
        console.error("❌Verify Payment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyOrder = async (req, res) => {
    try {
        const userId = req.id
        const orders = await OrderModel.find({ user: userId })
            .populate({ path: "products.productId", select: "productName productPrice productImg" })
            .populate("user", "firstname lastname email")

        res.status(200).json({ success: true, count: orders.length, orders })

    } catch (error) {
        console.log("Error fetching user orders:", error)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const getUserOrders = async (req, res) => {
    //admin only

    try {
        const { userId } = req.params;

        const orders = await OrderModel.find({ user: userId })
            .populate({
                path: "products.productId",
                select: "productName productPrice productImg"
            }) // fetch product details
            .populate("user", "firstName lastName email") //fetch user info

        res.status(200).json({ success: true, count: orders.length, orders })

    } catch (error) {
        console.log("error fetching user order", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

export const getAllOrdersAdmin = async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate("user", "firstname email")
            .populate("products.productId", "productName productPrice")

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch all orders", error: error.message })

    }
}

export const getSalesData = async (req, res) => {
    try {
        const totalUsers = await UserModel.countDocuments({})
        const totalProducts = await ProductModel.countDocuments({})
        const totalOrders = await OrderModel.countDocuments({ status: "Paid" })

        // total sales amount
        const totalSalesAgg = await OrderModel.aggregate([
            { $match: { status: "Paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])

        const totalSales = totalSalesAgg[0]?.total || 0;

        // Sales Grouped by date 

        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const salesByDate = await OrderModel.aggregate([
            { $match: { status: "Paid", createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    amount: { $sum: "$amount" },
                }
            },
            {
                $sort: { _id: 1 }
            }
        ])

        console.log(salesByDate);
        

        const formattedSales = salesByDate.map((item)=>({
            date: item._id,
            amount: item.amount
        }))

        console.log(formattedSales);
        
        res.status(200).json({
            success:true,
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            sales:formattedSales
        })
        
    } catch (error) {
        console.log("Error Fetching sales data",error)
        res.status(500).json({success:false, message:error.message})
    }
}
