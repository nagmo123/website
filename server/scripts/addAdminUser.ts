import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });
import User from '../models/User';

async function addAdminUser() {
  await mongoose.connect(process.env.MONGO_URI as string);
  const email = 'kavyanshbagotra15@gmail.com';
  const user = await User.findOne({ email });
  if (!user) {
    console.log(`User with email ${email} not found.`);
    await mongoose.disconnect();
    return;
  }
  user.role = 'admin';
  await user.save();
  console.log(`User ${email} is now an admin.`);
  await mongoose.disconnect();
}

addAdminUser(); 