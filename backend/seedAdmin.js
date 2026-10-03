import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/User.js';

await mongoose.connect(process.env.MONGODB_URI);
const email = process.env.ADMIN_EMAIL || 'admin@restaurant.com';
const password = process.env.ADMIN_PASSWORD || 'Admin@123';
const existing = await User.findOne({ email });
if (existing) { existing.role = 'admin'; await existing.save(); } else { await User.create({ name: 'Restaurant Admin', email, password: await bcrypt.hash(password, 10), role: 'admin' }); }
console.log(`Admin ready: ${email}`);
await mongoose.disconnect();
