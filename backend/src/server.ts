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
import transactionRoute from './routes/transaction.route.js'
import profileRoute from './routes/profile.route.js'
import accountRoute from './routes/account.route.js'
import notificationRoute from './routes/notification.route.js'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

app.use('/api/auth', authRoute)
app.use('/api/salesmen', salesmanRoute)
app.use('/api/products', productRoute)
app.use('/api/areas', areaRoute)
app.use('/api/customers', customerRoute)
app.use('/api/visits', visitRoute)
app.use('/api/upload', uploadRoute)
app.use('/api/transactions', transactionRoute)
app.use('/api/profile', profileRoute)
app.use('/api/delete-account', accountRoute)
app.use('/api/notifications', notificationRoute)

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});