import React, { useEffect, useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowLeft } from "react-icons/fa";
import useMobile from '../hooks/useMobile';


const Search = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [searchParams] = useSearchParams()
    const [isSearchPage,setIsSearchPage] = useState(false)
    const [ isMobile ] = useMobile()
    const searchText = searchParams.get('q') || ''

    useEffect(()=>{
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    },[location])


    const redirectToSearchPage = ()=>{
        navigate("/search")
    }

    const handleOnChange = (e)=>{
        const value = e.target.value
        const url = `/search?q=${value}`
        navigate(url)
    }

  return (
    <div className='w-full min-w-[300px] lg:min-w-[420px] h-11 lg:h-12 rounded-xl border-2 border-gray-200 overflow-hidden flex items-center text-gray-500 bg-gray-50 hover:bg-white focus-within:bg-white focus-within:border-green-500 focus-within:shadow-lg transition-all duration-300'>
        <div>
            {
                (isMobile && isSearchPage ) ? (
                    <Link to={"/"} className='flex justify-center items-center h-full p-2 m-1 hover:text-green-600 bg-white rounded-full shadow-md transition-colors'>
                        <FaArrowLeft size={20}/>
                    </Link>
                ) :(
                    <button className='flex justify-center items-center h-full p-3 text-gray-400 hover:text-green-600 focus-within:text-green-600 transition-colors'>
                        <IoSearch size={22}/>
                    </button>
                )
            }
        </div>
        <div className='w-full h-full'>
            {
                !isSearchPage ? (
                     //not in search page
                     <div onClick={redirectToSearchPage} className='w-full h-full flex items-center cursor-pointer px-2'>
                        <TypeAnimation
                                sequence={[
                                    'Search "fresh milk"',
                                    1500,
                                    'Search "organic vegetables"',
                                    1500,
                                    'Search "bakery items"',
                                    1500,
                                    'Search "spices & seasonings"',
                                    1500,
                                    'Search "dairy products"',
                                    1500,
                                    'Search "snacks & beverages"',
                                    1500,
                                    'Search "household essentials"',
                                    1500,
                                ]}
                                wrapper="span"
                                speed={50}
                                className='text-gray-500'
                                repeat={Infinity}
                            />
                     </div>
                ) : (
                    //when i was search page
                    <div className='w-full h-full'>
                        <input
                            type='text'
                            placeholder='Search for groceries, vegetables, fruits & more...'
                            autoFocus
                            defaultValue={searchText}
                            className='bg-transparent w-full h-full outline-none px-2 text-gray-700 placeholder-gray-400'
                            onChange={handleOnChange}
                        />
                    </div>
                )
            }
        </div>
        
    </div>
  )
}

export default Search