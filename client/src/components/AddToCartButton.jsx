import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../provider/GlobalProvider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from './Loading'
import { useSelector } from 'react-redux'
import { FaMinus, FaPlus } from "react-icons/fa6";
import { BsCart4 } from "react-icons/bs";
import { useNavigate } from 'react-router-dom'

const AddToCartButton = ({ data }) => {
    const { fetchCartItem, updateCartItem, deleteCartItem } = useGlobalContext()
    const [loading, setLoading] = useState(false)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const [isAvailableCart, setIsAvailableCart] = useState(false)
    const [qty, setQty] = useState(0)
    const [cartItemDetails,setCartItemsDetails] = useState()

    const handleADDTocart = async (e) => {
        e.preventDefault()
        e.stopPropagation()

        // Check if user is logged in
        if (!user?._id) {
            toast.error("Please login to add items to cart")
            navigate("/login")
            return
        }

        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.addTocart,
                data: {
                    productId: data?._id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                toast.success(responseData.message)
                if (fetchCartItem) {
                    fetchCartItem()
                }
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }

    }

    //checking this item in cart or not
    useEffect(() => {
        const checkingitem = cartItem.some(item => item.productId._id === data._id)
        setIsAvailableCart(checkingitem)

        const product = cartItem.find(item => item.productId._id === data._id)
        setQty(product?.quantity)
        setCartItemsDetails(product)
    }, [data, cartItem])


    const increaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()
    
        // Check if user is logged in
        if (!user?._id) {
            toast.error("Please login to update cart")
            navigate("/login")
            return
        }

       const response = await  updateCartItem(cartItemDetails?._id,qty+1)
        
       if(response.success){
        toast.success("Item added")
       }
    }

    const decreaseQty = async(e) => {
        e.preventDefault()
        e.stopPropagation()

        // Check if user is logged in
        if (!user?._id) {
            toast.error("Please login to update cart")
            navigate("/login")
            return
        }

        if(qty === 1){
            deleteCartItem(cartItemDetails?._id)
        }else{
            const response = await updateCartItem(cartItemDetails?._id,qty-1)

            if(response.success){
                toast.success("Item remove")
            }
        }
    }
    
    return (
        <div className='w-full max-w-[140px]'>
            {
                isAvailableCart ? (
                    <div className='flex items-center bg-white border border-green-500 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300'>
                        <button 
                            onClick={decreaseQty} 
                            className='bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-2 flex items-center justify-center transform hover:scale-110 transition-all duration-200 active:scale-95'
                        >
                            <FaMinus className="text-xs" />
                        </button>

                        <div className='flex-1 bg-green-50 py-2 px-3 text-center'>
                            <span className='font-bold text-green-800 text-sm'>{qty}</span>
                        </div>

                        <button 
                            onClick={increaseQty} 
                            className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-2 flex items-center justify-center transform hover:scale-110 transition-all duration-200 active:scale-95'
                        >
                            <FaPlus className="text-xs" />
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleADDTocart} 
                        disabled={loading}
                        className='group w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <Loading />
                                <span className="text-xs">Adding...</span>
                            </div>
                        ) : (
                            <>
                                <BsCart4 className="group-hover:animate-bounce text-sm" />
                                <span className="text-sm">Add to Cart</span>
                            </>
                        )}
                    </button>
                )
            }
        </div>
    )
}

export default AddToCartButton