#!/usr/bin/env node

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') })

import mongoose from 'mongoose'
import ProductModel from './models/product.model.js'

const createSearchIndexes = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...')
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGODB_URL)
    console.log('✅ Connected to MongoDB')
    
    console.log('🔍 Creating text indexes for product search...')
    
    // Drop existing text indexes if any
    try {
      await ProductModel.collection.dropIndex('name_text_description_text')
      console.log('📝 Dropped existing text indexes')
    } catch (error) {
      console.log('📝 No existing text indexes to drop')
    }
    
    // Create new text indexes
    await ProductModel.collection.createIndex(
      { 
        name: 'text', 
        description: 'text' 
      },
      { 
        weights: { name: 10, description: 5 },
        name: 'product_search_text'
      }
    )
    
    console.log('✅ Text indexes created successfully!')
    
    // Verify indexes
    const indexes = await ProductModel.collection.listIndexes().toArray()
    console.log('📋 Current indexes:')
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`)
    })
    
  } catch (error) {
    console.error('❌ Error creating text indexes:', error)
  } finally {
    await mongoose.connection.close()
    console.log('🔌 MongoDB connection closed')
    process.exit(0)
  }
}

console.log('🚀 Starting text index creation...')
createSearchIndexes()
