import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoute from './routes/auth.route.js'
import salesmanRoute from './routes/salesman.route.js'
import productRoute from './routes/product.route.js'
import areaRoute from './routes/area.route.js'
import customerRoute from './routes/customer.route.js'
import visitRoute from './routes/visit.route.js'
import uploadRoute from './routes/upload.route.js'

dotenv.config();

const app = express();

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoute)
app.use('/api/salesmen', salesmanRoute)
app.use('/api/products', productRoute)
app.use('/api/areas', areaRoute)
app.use('/api/customers', customerRoute)
app.use('/api/visits', visitRoute)
app.use('/api/upload', uploadRoute)

app.listen(5000, () => {
  console.log("Server started on port 5000");
});