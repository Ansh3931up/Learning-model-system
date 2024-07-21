import app from "./app.js";
import connectdb from "../database/connectdb.js";
import Razorpay from "razorpay";
const PORT=3000
// console.log(process.env.RAZORPAY_KEY)
export const razorpay= new Razorpay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

connectdb()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`SUCCESSFully connected ${PORT}`);
    });

})
.catch((error)=>{
    console.log(error);

})