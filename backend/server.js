import dotenv from 'dotenv';
dotenv.config(); 
import express from 'express';
import connection from './database/db.js';
import cors from 'cors'
import userRoute from './routes/userRoute.js'
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js'
import orderRoute from './routes/orderRoute.js'


const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/api/users',userRoute)
app.use('/api/products',productRoute)
app.use('/api/cart',cartRoute)
app.use('/api/orders',orderRoute)

app.listen(PORT, async () => {
    await connection();
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
