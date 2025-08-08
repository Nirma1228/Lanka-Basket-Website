
import React, { useEffect, useState, useCallback } from 'react'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'

const Product = () => {
  const [productData,setProductData] = useState([])
  const [page] = useState(1)
  
  const fetchProductData = useCallback(async()=>{
    try {
        const response = await Axios({
           ...SummaryApi.getProduct,
           data : {
              page : page,
           }
        })

        const { data : responseData } = response 

        console.log("product page ",responseData)
        if(responseData.success){
          
          setProductData(responseData.data)
        }

    } catch (error) {
      AxiosToastError(error)
    }
  }, [page])
  
  console.log("product page")
  useEffect(()=>{
    fetchProductData()
  },[fetchProductData])

  return (
    <div>
      Product
    </div>
  )
}

export default Product
