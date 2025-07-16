import mongoose from 'mongoose';
import XLSX from 'xlsx';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });
import Product from '../models/Product';

async function importProducts() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const excelPath = path.join(__dirname, '../data_doc.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const products = XLSX.utils.sheet_to_json<any>(sheet);

  // Map Excel columns to Product model fields
  const mappedProducts = products
    .map((row) => ({
      name: row['Wallpaper Name'] || null,
      price: row['Price'] ? parseFloat(String(row['Price']).replace(/[^\d.]/g, '')) : null,
      skuId: row['SKU ID'] || null,
      colors: row['Colour'] ? String(row['Colour']).split(',').map((s: string) => s.trim()) : null,
      tags: row['Theme'] ? String(row['Theme']).split(',').map((s: string) => s.trim()) : null,
      description: row['Description'] || 'No description provided',
      originalPrice: null,
      images: [],
      category: null,
      materials: null,
      dimensions: null,
      bestseller: null,
      rating: null,
      reviews: null,
      inStock: null,
      roomTypes: null,
    }))
    .filter(
      (p) =>
        typeof p.name === 'string' &&
        p.name.trim() !== '' &&
        typeof p.price === 'number' &&
        !isNaN(p.price) &&
        p.price > 0
    );

  try {
    const result = await Product.insertMany(mappedProducts);
    console.log(`Imported ${result.length} products.`);
  } catch (err) {
    console.error('Error importing products:', err);
  }
  await mongoose.disconnect();
}

importProducts(); 