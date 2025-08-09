import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast';
import { useEffect, useCallback } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';
import { ThemeProvider } from './provider/ThemeProvider';
import CartMobileLink from './components/CartMobile';

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  

  const fetchUser = useCallback(async()=>{
      const userData = await fetchUserDetails()
      dispatch(setUserDetails(userData.data))
  }, [dispatch])

  const fetchCategory = useCallback(async()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...SummaryApi.getCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        console.error('Error fetching categories:', error)
    }finally{
      dispatch(setLoadingCategory(false))
    }
  }, [dispatch])

  const fetchSubCategory = useCallback(async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.getSubCategory
        })
        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name)))) 
        }
    } catch (error) {
        console.error('Error fetching subcategories:', error)
    }
  }, [dispatch])

  

  useEffect(()=>{
    fetchUser()
    fetchCategory()
    fetchSubCategory()
    // fetchCartItem()
  },[fetchUser, fetchCategory, fetchSubCategory])

  return (
    <ThemeProvider>
      <GlobalProvider> 
        <Header/>
        <main className='min-h-[78vh]'>
            <Outlet/>
        </main>
        <Footer/>
        <Toaster/>
        {
          location.pathname !== '/checkout' && (
            <CartMobileLink/>
          )
        }
      </GlobalProvider>
    </ThemeProvider>
  )
}

export default App