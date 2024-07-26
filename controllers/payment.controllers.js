import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { User } from "../module/user.model.js";
import { razorpay } from "../src/index.js";
import crypto from "crypto";
import Payment from "../module/payment.model.js";

const getRazorpayApiKey = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, process.env.RAZORPAY_KEY));
});

const buySubscription = asyncHandler(async (req, res) => {
    const { id } = req.user;
    console.log(id)
    const user = await User.findById(id);
    console.log(user)

    if (!user) {
        throw new ApiError(404, 'Unauthorized error');
    }

    try {
        console.log("body",req.body)
        const { amount, currency, receipt, notes } = req.body;
        const options = {
            amount: 50000, // amount in the smallest currency unit
            currency:"INR",
            receipt:"hjfvghfthfhg"
        };
        console.log("options",options)
        const order = await razorpay.orders.create(options);
        console.log(order)
        return res.status(200).json(new ApiResponse(200, order, 'Order created successfully'));
    } catch (error) {
        console.error("Error creating order:", error);
        throw new ApiError(500, "Failed to create order");
    }
});

const verifyPayment = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);
    const { razorpay_payment_id, razorpay_signature, razorpay_order_id } = req.body;

    if (!user) {
        throw new ApiError(404, 'Unauthorized error');
    }

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        throw new ApiError(500, "Payment verification failed");
    }

    try {
        // Assuming `Payment` model or similar is defined elsewhere
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_order_id
        });

        return res.status(200).json(new ApiResponse(200, "Payment verified successfully"));
    } catch (error) {
        console.error("Error verifying payment:", error);
        throw new ApiError(500, "Failed to verify payment");
    }
});

const allPayments = asyncHandler(async (req, res) => {
    const { count } = req.query;

    try {
        const subscriptions = await razorpay.subscriptions.all({
            count: count || 10, // Use the provided count or default to 10
        });

        return res.status(200).json(new ApiResponse(200, subscriptions));
    } catch (error) {
        console.error("Error fetching subscriptions:", error.response ? error.response.data : error);
        throw new ApiError(500, "Failed to fetch subscriptions");
    }
});

export {
    buySubscription,
    getRazorpayApiKey,
    verifyPayment,
    allPayments,
};
