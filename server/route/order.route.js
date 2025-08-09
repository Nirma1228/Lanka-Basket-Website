import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, getAllOrdersController, paymentController, webhookStripe } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)

// Admin routes
orderRouter.post("/admin/get-all-orders",auth,admin,getAllOrdersController)

export default orderRouter