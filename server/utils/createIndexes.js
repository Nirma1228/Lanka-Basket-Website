import ProductModel from '../models/product.model.js'

export const createTextIndexes = async () => {
  try {
    console.log('Creating text indexes for product search...')
    
    // Create text indexes on name and description fields
    await ProductModel.createIndexes()
    
    console.log('✅ Text indexes created successfully!')
    return true
  } catch (error) {
    console.log('❌ Error creating text indexes:', error.message)
    return false
  }
}

export const ensureSearchIndexes = async () => {
  try {
    // Check if text indexes exist
    const indexes = await ProductModel.collection.getIndexes()
    const hasTextIndex = Object.keys(indexes).some(key => 
      indexes[key].some(index => index.weights)
    )
    
    if (!hasTextIndex) {
      console.log('Text indexes not found, creating them...')
      await createTextIndexes()
    } else {
      console.log('✅ Text indexes already exist')
    }
    
    return true
  } catch (error) {
    console.log('Warning: Could not verify text indexes:', error.message)
    return false
  }
}
