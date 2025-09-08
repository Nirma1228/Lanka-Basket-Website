import React, { useState, useEffect } from 'react'
import { MdWarning, MdClose, MdInventory } from 'react-icons/md'
import { FaExclamationTriangle, FaBox } from 'react-icons/fa'
import { IoAlertCircle } from 'react-icons/io5'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link } from 'react-router-dom'

const StockAlert = ({ className = '' }) => {
  const [stockData, setStockData] = useState(null)
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStockData()
  }, [])

  const fetchStockData = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getLowStockProducts,
        data: { threshold: 10 }
      })

      if (response.data.success) {
        setStockData(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching stock data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stockData || !isVisible) {
    return null
  }

  const { lowStock, outOfStock } = stockData
  const totalAlerts = lowStock.length + outOfStock.length

  // Don't show if no alerts
  if (totalAlerts === 0) {
    return null
  }

  return (
    <div className={`bg-gradient-to-r from-yellow-50 to-red-50 border border-yellow-200 rounded-xl p-4 shadow-lg ${className}`}>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0'>
            <MdWarning className='text-yellow-600 text-xl' />
          </div>
          
          <div className='flex-1'>
            <div className='flex items-center gap-2 mb-2'>
              <h4 className='font-semibold text-gray-900'>Stock Alert</h4>
              <span className='bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full'>
                {totalAlerts} items need attention
              </span>
            </div>
            
            <div className='space-y-2 text-sm'>
              {outOfStock.length > 0 && (
                <div className='flex items-center gap-2'>
                  <IoAlertCircle className='text-red-500 flex-shrink-0' />
                  <span className='text-red-700'>
                    <span className='font-medium'>{outOfStock.length}</span> products are completely out of stock
                  </span>
                </div>
              )}
              
              {lowStock.length > 0 && (
                <div className='flex items-center gap-2'>
                  <FaExclamationTriangle className='text-yellow-500 flex-shrink-0' />
                  <span className='text-yellow-700'>
                    <span className='font-medium'>{lowStock.length}</span> products have low stock levels
                  </span>
                </div>
              )}
              
              <p className='text-gray-600 mt-2'>
                Review these items to prevent sales disruption
              </p>
            </div>

            {/* Quick Actions */}
            <div className='flex items-center gap-3 mt-3'>
              <Link
                to="/dashboard/stock-management"
                className='inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors'
              >
                <MdInventory className='text-sm' />
                Manage Stock
              </Link>
              
              {outOfStock.length > 0 && (
                <Link
                  to="/dashboard/stock-management?filter=out-of-stock"
                  className='inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors'
                >
                  <IoAlertCircle className='text-sm' />
                  View Out of Stock
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className='p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0'
          title='Dismiss alert'
        >
          <MdClose className='text-gray-400 hover:text-gray-600' />
        </button>
      </div>

      {/* Quick Preview of Items */}
      {(outOfStock.length > 0 || lowStock.length > 0) && (
        <div className='mt-4 pt-3 border-t border-yellow-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {outOfStock.length > 0 && (
              <div>
                <h5 className='text-xs font-medium text-red-800 mb-2 flex items-center gap-1'>
                  <IoAlertCircle className='text-xs' />
                  Out of Stock ({outOfStock.length})
                </h5>
                <div className='space-y-1 max-h-20 overflow-y-auto'>
                  {outOfStock.slice(0, 3).map((product, index) => (
                    <div key={index} className='text-xs text-red-700 flex items-center gap-2'>
                      <FaBox className='text-red-400 flex-shrink-0' />
                      <span className='truncate'>{product.name}</span>
                    </div>
                  ))}
                  {outOfStock.length > 3 && (
                    <p className='text-xs text-red-600 italic'>
                      +{outOfStock.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            {lowStock.length > 0 && (
              <div>
                <h5 className='text-xs font-medium text-yellow-800 mb-2 flex items-center gap-1'>
                  <FaExclamationTriangle className='text-xs' />
                  Low Stock ({lowStock.length})
                </h5>
                <div className='space-y-1 max-h-20 overflow-y-auto'>
                  {lowStock.slice(0, 3).map((product, index) => (
                    <div key={index} className='text-xs text-yellow-700 flex items-center gap-2'>
                      <FaBox className='text-yellow-400 flex-shrink-0' />
                      <span className='truncate'>{product.name}</span>
                      <span className='text-yellow-600'>({product.stock} left)</span>
                    </div>
                  ))}
                  {lowStock.length > 3 && (
                    <p className='text-xs text-yellow-600 italic'>
                      +{lowStock.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StockAlert
