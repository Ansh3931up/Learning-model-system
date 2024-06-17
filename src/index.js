import app from "./app.js";
import connectdb from "../database/connectdb.js";
const PORT=process.env.PORT||5600

connectdb()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`SUCCESSFully connected ${PORT}`);
    });

})
.catch((error)=>{
    console.log(error);

})