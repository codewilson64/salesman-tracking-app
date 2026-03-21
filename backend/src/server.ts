import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoute from './routes/auth.route.js'
import salesmanRoute from './routes/salesman.route.js'
import productRoute from './routes/product.route.js'

dotenv.config();

const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoute)
app.use('/api/salesmen', salesmanRoute)
app.use('/api/products', productRoute)

app.listen(5000, () => {
  console.log("Server started on port 5000");
});