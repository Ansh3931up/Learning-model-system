import { Router } from "express";
import { buyScription,getRazorpayApiKey,verifySubscription,allPayments,cancelSubscription} from "../controllers/payment.controllers.js"
import { verifyjwt,authorizedRoles } from "../middleware/auth.middleware.js";
const router=Router();

router.route('/razorpay-key').get(verifyjwt,getRazorpayApiKey);
router.route('/subscribe').post(verifyjwt,buyScription);
router.route('/verify').post(verifyjwt,verifySubscription);
router.route('/unsubscribe').post(verifyjwt,cancelSubscription);
router.route('/').get(verifyjwt,authorizedRoles('ADMIN'),allPayments);
export default router;