import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const payload = list_items.map(el => {
            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'lkr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const productList = []

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await Stripe.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                } ,
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
            }

            productList.push(paylod)
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event",event)

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })
    
      const order = await OrderModel.insertMany(orderProduct)

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
        }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Admin: Get all orders with filtering
export async function getAllOrdersController(request,response){
    try {
        const { page = 1, limit = 20, date = 'today', status = 'all', search = '' } = request.body

        const pageNumber = parseInt(page)
        const limitNumber = parseInt(limit)
        const skip = (pageNumber - 1) * limitNumber

        // Date filtering
        let dateQuery = {}
        const today = new Date()
        
        switch(date) {
            case 'today':
                const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
                dateQuery = {
                    createdAt: {
                        $gte: startOfDay,
                        $lt: endOfDay
                    }
                }
                break;
            case 'yesterday':
                const yesterday = new Date(today)
                yesterday.setDate(today.getDate() - 1)
                const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
                const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1)
                dateQuery = {
                    createdAt: {
                        $gte: startOfYesterday,
                        $lt: endOfYesterday
                    }
                }
                break;
            case 'week':
                const weekAgo = new Date(today)
                weekAgo.setDate(today.getDate() - 7)
                dateQuery = {
                    createdAt: {
                        $gte: weekAgo
                    }
                }
                break;
            case 'month':
                const monthAgo = new Date(today)
                monthAgo.setMonth(today.getMonth() - 1)
                dateQuery = {
                    createdAt: {
                        $gte: monthAgo
                    }
                }
                break;
            default:
                // All time
                break;
        }

        // Status filtering
        let statusQuery = {}
        if (status && status !== 'all') {
            statusQuery = { payment_status: status }
        }

        // Search filtering
        let searchQuery = {}
        if (search) {
            searchQuery = {
                $or: [
                    { orderId: { $regex: search, $options: 'i' } },
                    { 'product_details.name': { $regex: search, $options: 'i' } }
                ]
            }
        }

        // Combine all queries
        const finalQuery = {
            ...dateQuery,
            ...statusQuery,
            ...searchQuery
        }

        // Get orders and group them by user and order session (based on timestamp proximity)
        const allOrders = await OrderModel.find(finalQuery)
            .populate('userId', 'name email mobile')
            .populate('delivery_address')
            .populate('productId', 'name price discount stock')
            .sort({ createdAt : -1 })

        // Group orders by user and order session (orders placed within 5 minutes of each other)
        const groupedOrders = []
        const processedOrders = new Set()

        for (const order of allOrders) {
            if (processedOrders.has(order._id.toString())) continue

            // Find all orders from the same user within 5 minutes
            const orderTime = new Date(order.createdAt)
            const relatedOrders = allOrders.filter(o => {
                if (processedOrders.has(o._id.toString())) return false
                if (o.userId._id.toString() !== order.userId._id.toString()) return false
                
                const oTime = new Date(o.createdAt)
                const timeDiff = Math.abs(orderTime - oTime) / (1000 * 60) // minutes
                return timeDiff <= 5 // Group orders within 5 minutes
            })

            // Create grouped order
            const groupedOrder = {
                _id: order._id,
                orderId: order.orderId,
                userId: order.userId,
                createdAt: order.createdAt,
                payment_status: order.payment_status,
                paymentId: order.paymentId,
                delivery_address: order.delivery_address,
                items: relatedOrders.map(o => ({
                    _id: o._id,
                    productId: o.productId,
                    product_details: o.product_details,
                    quantity: 1, // Each order represents 1 item
                    subTotalAmt: o.subTotalAmt,
                    totalAmt: o.totalAmt
                })),
                totalItems: relatedOrders.length,
                orderValue: relatedOrders.reduce((sum, o) => sum + o.totalAmt, 0),
                subTotalValue: relatedOrders.reduce((sum, o) => sum + o.subTotalAmt, 0)
            }

            groupedOrders.push(groupedOrder)
            
            // Mark all related orders as processed
            relatedOrders.forEach(o => processedOrders.add(o._id.toString()))
        }

        // Apply pagination to grouped orders
        const totalOrders = groupedOrders.length
        const orders = groupedOrders.slice(skip, skip + limitNumber)

        const totalPages = Math.ceil(totalOrders / limitNumber)

        // Calculate summary statistics
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        
        const [todayOrders, todayRevenue, totalRevenue] = await Promise.all([
            OrderModel.countDocuments({
                createdAt: { $gte: todayStart, $lt: todayEnd }
            }),
            OrderModel.aggregate([
                {
                    $match: {
                        createdAt: { $gte: todayStart, $lt: todayEnd }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmt' }
                    }
                }
            ]),
            OrderModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$totalAmt' }
                    }
                }
            ])
        ])

        return response.json({
            message : "All orders retrieved successfully",
            data : {
                orders,
                pagination: {
                    totalOrders,
                    totalPages,
                    currentPage: pageNumber,
                    hasNextPage: pageNumber < totalPages,
                    hasPrevPage: pageNumber > 1
                },
                summary: {
                    todayOrders,
                    todayRevenue: todayRevenue[0]?.total || 0,
                    totalRevenue: totalRevenue[0]?.total || 0
                }
            },
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}