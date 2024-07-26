import { Router } from "express";
import { getRazorpayApiKey,verifyPayment,allPayments,buySubscription} from "../controllers/payment.controllers.js"
import { verifyjwt,authorizedRoles } from "../middleware/auth.middleware.js";
const router=Router();

router.route('/razorpay-key').get(verifyjwt,getRazorpayApiKey);
router.route('/order-payment').post(verifyjwt,buySubscription);
router.route('/verify').post(verifyjwt,verifyPayment);
// router.route('/unsubscribe').post(verifyjwt,cancelSubscription);
router.route('/').get(verifyjwt,authorizedRoles('ADMIN'),allPayments);
export default router;