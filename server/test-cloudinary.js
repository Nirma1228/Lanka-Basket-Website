import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadImageClodinary from './utils/uploadImageClodinary.js';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

async function testCloudinaryUpload() {
    try {
        // Create a simple test buffer
        const testImageBuffer = Buffer.from('test image data');
        const testFile = {
            buffer: testImageBuffer,
            originalname: 'test.jpg',
            mimetype: 'image/jpeg'
        };

        console.log('Testing Cloudinary upload...');
        const result = await uploadImageClodinary(testFile);
        console.log('Upload successful:', result);
    } catch (error) {
        console.error('Upload failed:', error.message);
    }
}

testCloudinaryUpload();
