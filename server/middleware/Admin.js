import UserModel from "../models/user.model.js"

export const admin = async(request,response,next)=>{
    try {
       const  userId = request.userId

       if (!userId) {
           return response.status(400).json({
               message : "User ID not found",
               error : true,
               success : false
           })
       }

       const user = await UserModel.findById(userId)

       if(!user) {
           return response.status(400).json({
               message : "User not found",
               error : true,
               success : false
           })
       }

       if(user.role !== 'ADMIN'){
            return response.status(400).json({
                message : "Permission denial",
                error : true,
                success : false
            })
       }

       next()

    } catch (error) {
        console.error('Admin middleware error:', error)
        return response.status(500).json({
            message : "Permission denial",
            error : true,
            success : false
        })
    }
}