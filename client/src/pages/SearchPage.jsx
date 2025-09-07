import React, { useEffect, useState } from 'react'
import CardLoading from '../components/CardLoading'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import CardProduct from '../components/CardProduct'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSearchParams } from 'react-router-dom'
import noDataImage from '../assets/nothing here yet.webp'

const SearchPage = () => {
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(true)
  const loadingArrayCard = new Array(10).fill(null)
  const [page,setPage] = useState(1)
  const [totalPage,setTotalPage] = useState(1)
  const [searchParams] = useSearchParams()
  const searchText = searchParams.get('q') || ''

  const fetchData = async() => {
    try {
      setLoading(true)
        const response = await Axios({
            ...SummaryApi.searchProduct,
            data : {
              search : searchText,
              page : page,
            }
        })

        const { data : responseData } = response

        if(responseData.success){
            if(responseData.page == 1){
              setData(responseData.data)
            }else{
              setData((preve)=>{
                return[
                  ...preve,
                  ...responseData.data
                ]
              })
            }
            setTotalPage(responseData.totalPage)
            console.log(responseData)
        }
    } catch (error) {
        AxiosToastError(error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    setPage(1)
    setData([])
  },[searchText])

  useEffect(()=>{
    if(searchText){
      fetchData()
    }
  },[page,searchText])

  console.log("page",page)

  const handleFetchMore = ()=>{
    if(totalPage > page){
      setPage(preve => preve + 1)
    }
  }

  return (
    <section className='bg-white'>
      <div className='container mx-auto p-4'>
        {searchText ? (
          <p className='font-semibold'>Search Results for "{searchText}": {data.length} items found</p>
        ) : (
          <p className='font-semibold'>Enter a search term to find products</p>
        )}

        <InfiniteScroll
              dataLength={data.length}
              hasMore={true}
              next={handleFetchMore}
        >
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-4 gap-4'>
              {
                data.map((p,index)=>{
                  return(
                    <CardProduct data={p} key={p?._id+"searchProduct"+index}/>
                  )
                })
              }

            {/***loading data */}
            {
              loading && (
                loadingArrayCard.map((_,index)=>{
                  return(
                    <CardLoading key={"loadingsearchpage"+index}/>
                  )
                })
              )
            }
        </div>
        </InfiniteScroll>

              {
                //no data 
                !data[0] && !loading && searchText && (
                  <div className='flex flex-col justify-center items-center w-full mx-auto'>
                    <img
                      src={noDataImage} 
                      className='w-full h-full max-w-xs max-h-xs block'
                    />
                    <p className='font-semibold my-2'>No products found for "{searchText}"</p>
                  </div>
                )
              }
      </div>
    </section>
  )
}

export default SearchPage