import ProductModel from "../models/product.model.js";

export const createProductController = async(request,response)=>{
    try {
        const { 
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        } = request.body 

        if(!name || !image[0] || !category[0] || !subCategory[0] || !unit || !price || !description ){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const product = new ProductModel({
            name ,
            image ,
            category,
            subCategory,
            unit,
            stock,
            price,
            discount,
            description,
            more_details,
        })
        const saveProduct = await product.save()

        return response.json({
            message : "Product Created Successfully",
            data : saveProduct,
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

export const getProductController = async(request,response)=>{
    try {
        
        let { page, limit, search } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data,totalCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.find({ 
            category : { $in : id }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
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

export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { categoryId,subCategoryId,page,limit } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = {
            category : { $in :categoryId  },
            subCategory : { $in : subCategoryId }
        }

        const skip = (page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product list",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        const product = await ProductModel.findOne({ _id : productId })


        return response.json({
            message : "product details",
            data : product,
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

//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide product _id",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ _id : _id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
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

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id } = request.body 

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async(request,response)=>{
    try {
        let { search, page , limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit  = 10
        }

        let query = {}
        
        if(search && search.trim().length > 0){
            const searchTerm = search.trim()
            
            // Enhanced regex search with word boundary and partial matching
            const regexOptions = {
                $regex: searchTerm,
                $options: 'i' // case insensitive
            }
            
            // Also search for individual words in the search term
            const words = searchTerm.split(/\s+/).filter(word => word.length > 0)
            const wordQueries = words.map(word => ({
                $or: [
                    { name: { $regex: word, $options: 'i' } },
                    { description: { $regex: word, $options: 'i' } }
                ]
            }))
            
            query = {
                $or: [
                    // Exact phrase match (higher priority)
                    { name: regexOptions },
                    { description: regexOptions },
                    // Individual word matches
                    ...wordQueries
                ]
            }
        }

        const skip = ( page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt  : -1 }).skip(skip).limit(limit).populate('category subCategory'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            data : data,
            totalCount :dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page : page,
            limit : limit 
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Bulk stock update
export const bulkUpdateStock = async(request, response) => {
    try {
        const { updates } = request.body // Array of {productId, stock}
        
        if (!updates || !Array.isArray(updates)) {
            return response.status(400).json({
                message: "Updates array is required",
                error: true,
                success: false
            })
        }

        const bulkOperations = updates.map(update => ({
            updateOne: {
                filter: { _id: update.productId },
                update: { stock: parseInt(update.stock) }
            }
        }))

        const result = await ProductModel.bulkWrite(bulkOperations)

        return response.json({
            message: "Bulk stock update completed",
            data: result,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Get low stock products
export const getLowStockProducts = async(request, response) => {
    try {
        const { threshold = 10 } = request.body
        
        const lowStockProducts = await ProductModel.find({
            stock: { $lte: threshold, $gt: 0 }
        }).populate('category').populate('subCategory')

        const outOfStockProducts = await ProductModel.find({
            stock: 0
        }).populate('category').populate('subCategory')

        return response.json({
            message: "Low stock products retrieved",
            data: {
                lowStock: lowStockProducts,
                outOfStock: outOfStockProducts,
                threshold: threshold
            },
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

// Get stock analytics
export const getStockAnalytics = async(request, response) => {
    try {
        const totalProducts = await ProductModel.countDocuments()
        
        const stockAnalytics = await ProductModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: "$stock" },
                    averageStock: { $avg: "$stock" },
                    minStock: { $min: "$stock" },
                    maxStock: { $max: "$stock" }
                }
            }
        ])

        const lowStockCount = await ProductModel.countDocuments({
            stock: { $lte: 10, $gt: 0 }
        })

        const outOfStockCount = await ProductModel.countDocuments({
            stock: 0
        })

        const inStockCount = await ProductModel.countDocuments({
            stock: { $gt: 10 }
        })

        return response.json({
            message: "Stock analytics retrieved",
            data: {
                totalProducts,
                stockSummary: stockAnalytics[0] || {
                    totalStock: 0,
                    averageStock: 0,
                    minStock: 0,
                    maxStock: 0
                },
                stockDistribution: {
                    inStock: inStockCount,
                    lowStock: lowStockCount,
                    outOfStock: outOfStockCount
                }
            },
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}