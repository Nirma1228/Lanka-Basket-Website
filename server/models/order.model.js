import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    },
    orderId : {
        type : String,
        required : [true, "Provide orderId"],
        unique : true
    },
    productId : {
        type : mongoose.Schema.ObjectId,
        ref : "product"
    },
    product_details : {
        name : String,
        image : Array,
    },
    paymentId : {
        type : String,
        default : ""
    },
    payment_status : {
        type : String,
        default : ""
    },
    packing_status : {
        type : String,
        enum : ["pending", "packed", "shipped", "delivered"],
        default : "pending"
    },
    packing_completed_at : {
        type : Date,
        default : null
    },
    shipping_details : {
        courier_name : {
            type : String,
            default : ""
        },
        tracking_number : {
            type : String,
            default : ""
        },
        handover_date : {
            type : Date,
            default : null
        },
        expected_delivery_date : {
            type : Date,
            default : null
        },
        shipped_at : {
            type : Date,
            default : null
        },
        delivered_at : {
            type : Date,
            default : null
        },
        confirmed_by_customer : {
            type : Boolean,
            default : false
        }
    },
    delivery_address : {
        type : mongoose.Schema.ObjectId,
        ref : 'address'
    },
    subTotalAmt : {
        type : Number,
        default : 0
    },
    totalAmt : {
        type : Number,
        default : 0
    },
    invoice_receipt : {
        type : String,
        default : ""
    }
},{
    timestamps : true
})

const OrderModel = mongoose.model('order',orderSchema)

export default OrderModel