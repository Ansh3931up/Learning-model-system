import ApiError from "../utilities/ApiError.js";
import ApiResponse from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { User } from "../module/user.model.js";
import { razorpay } from "../src/index.js";

const getRazorpayApiKey = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, process.env.RAZORPAY_KEY));
});

const buyScription = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return new ApiError(404, 'Unauthorized error');
    }

    // if (user.role === "ADMIN") {
    //     throw new ApiError(404, "Admin can't purchase the course");
    // }

    try {
        const subscription = await razorpay.subscriptions.create({
            // plan_id: process.env.RAZORPAY_PLAN,
            customer_notify: 1
        });

        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;
        await user.save();

        return res.status(200).json(new ApiResponse(200, subscription.id, 'Subscribed successfully'));
    } catch (error) {
        console.error("Error creating subscription:", error);
        throw new ApiError(500, "Failed to create subscription");
    }
});

const verifySubscription = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);
    const { razorpay_payment_id, razorpay_signature, razorpay_subscription_id } = req.body;

    if (!user) {
        return new ApiError(404, 'Unauthorized error');
    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_payment_id}|${subscriptionId}`)
        .digest('hex');

    if (generatedSignature !== razorpay_signature) {
        throw new ApiError(500, "Payment failed");
    }

    try {
        // Assuming `Payment` model or similar is defined elsewhere
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        });

        user.subscription.status = 'active';
        await user.save();

        return res.status(200).json(new ApiResponse(200, user, "Verified"));
    } catch (error) {
        console.error("Error verifying subscription:", error);
        throw new ApiError(500, "Failed to verify subscription");
    }
});

const cancelSubscription = asyncHandler(async (req, res) => {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
        return new ApiError(404, 'Unauthorized error');
    }

    if (user.role === "ADMIN") {
        throw new ApiError(404, "Admin can't cancel the subscription");
    }

    const subscriptionId = user.subscription.id;

    try {
        const subscription = await razorpay.subscriptions.cancel(subscriptionId);

        user.subscription.status = subscription.status;
        await user.save();

        return res.status(200).json(new ApiResponse(200, "Cancelled subscription"));
    } catch (error) {
        console.error("Error cancelling subscription:", error);
        throw new ApiError(500, "Failed to cancel subscription");
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
    buyScription,
    getRazorpayApiKey,
    verifySubscription,
    allPayments,
    cancelSubscription
};
