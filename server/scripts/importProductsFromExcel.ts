import mongoose from 'mongoose';
import XLSX from 'xlsx';
import dotenv from 'dotenv';
dotenv.config();
import Product from '../models/Product';

async function importProducts() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const workbook = XLSX.readFile('data_doc.xlsx');
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const products = XLSX.utils.sheet_to_json<any>(sheet);

  // Map Excel columns to Product model fields as best as possible
  const mappedProducts = products.map((row) => ({
    name: row.name || row.Name || row.title || row.Title,
    description: row.description || row.Description || '',
    price: Number(row.price || row.Price || 0),
    originalPrice: row.originalPrice || row.OriginalPrice || undefined,
    images: row.images ? String(row.images).split(',').map((s: string) => s.trim()) : [],
    category: row.category || row.Category || undefined,
    colors: row.colors ? String(row.colors).split(',').map((s: string) => s.trim()) : [],
    materials: row.materials ? String(row.materials).split(',').map((s: string) => s.trim()) : [],
    dimensions: {
      width: Number(row.width || row.Width || 0),
      height: Number(row.height || row.Height || 0),
    },
    tags: row.tags ? String(row.tags).split(',').map((s: string) => s.trim()) : [],
    bestseller: Boolean(row.bestseller || row.Bestseller),
    rating: Number(row.rating || row.Rating || 0),
    reviews: Number(row.reviews || row.Reviews || 0),
    inStock: row.inStock !== undefined ? Boolean(row.inStock) : true,
    roomTypes: row.roomTypes ? String(row.roomTypes).split(',').map((s: string) => s.trim()) : [],
  }));

  try {
    const result = await Product.insertMany(mappedProducts);
    console.log(`Imported ${result.length} products.`);
  } catch (err) {
    console.error('Error importing products:', err);
  }
  await mongoose.disconnect();
}

importProducts(); 