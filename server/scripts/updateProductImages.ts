import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });
import Product from '../models/Product';
import fs from 'fs';

async function updateProductImages() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const imagesDir = path.join(__dirname, '../images');
  const imageFiles = fs.readdirSync(imagesDir);
  const exts = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

  const products = await Product.find();
  let updatedCount = 0;

  for (const product of products) {
    const matches = imageFiles.filter(file =>
      exts.some(ext => file.toLowerCase() === `${product.skuId}${ext}`.toLowerCase())
    );
    if (matches.length > 0) {
      // Store as /images/filename.ext for frontend access
      product.images = matches.map(filename => `/images/${filename}`);
      await product.save();
      updatedCount++;
      console.log(`Updated ${product.skuId} with images: ${product.images}`);
    } else {
      // Optionally clear images if not found
      // product.images = [];
      // await product.save();
      console.log(`No image found for ${product.skuId}`);
    }
  }

  console.log(`Updated ${updatedCount} products with image paths.`);
  await mongoose.disconnect();
}

updateProductImages(); 