import { connectDB } from '../src/config/db.js';
import { env } from '../src/config/env.js';
import Owner from '../src/models/Owner.js';
import Cat from '../src/models/Cat.js';
import Swipe from '../src/models/Swipe.js';
import Match from '../src/models/Match.js';
import Message from '../src/models/Message.js';
import mongoose from 'mongoose';

await connectDB(env.mongo);

// ลบข้อมูลเก่าทั้งหมด
await Owner.deleteMany({});
await Cat.deleteMany({});
await Swipe.deleteMany({});
await Match.deleteMany({});
await Message.deleteMany({});

console.log('🗑️  Deleted all existing data');

// สร้างข้อมูล Owner
const owner1 = await Owner.create({
  email: 'demo@cat.io',
  passwordHash: 'demo', // TODO: bcrypt hash ภายหลัง
  displayName: 'Demo User',
});

const owner2 = await Owner.create({
  email: 'alice@cat.io',
  passwordHash: 'demo',
  displayName: 'Alice',
});

console.log('✅ Created 2 owners');

// สร้างข้อมูล Cat
const cat1 = await Cat.create({
  ownerId: owner1._id,
  name: 'Milo',
  gender: 'male',
  ageMonths: 18,
  breed: 'Persian',
  purpose: ['mate'],
  active: true
});

const cat2 = await Cat.create({
  ownerId: owner1._id,
  name: 'Luna',
  gender: 'female',
  ageMonths: 14,
  breed: 'Siamese',
  purpose: ['friend'],
  active: true
});

const cat3 = await Cat.create({
  ownerId: owner2._id,
  name: 'Max',
  gender: 'male',
  ageMonths: 20,
  breed: 'Maine Coon',
  purpose: ['mate', 'friend'],
  active: true
});

const cat4 = await Cat.create({
  ownerId: owner2._id,
  name: 'Bella',
  gender: 'female',
  ageMonths: 16,
  breed: 'British Shorthair',
  purpose: ['mate'],
  active: true
});

console.log('✅ Created 4 cats');
console.log('');
console.log('📝 Test Data Summary:');
console.log(`   Owner 1: ${owner1.displayName} (${owner1.email})`);
console.log(`   - Cat: ${cat1.name} (${cat1.gender}) - ID: ${cat1._id}`);
console.log(`   - Cat: ${cat2.name} (${cat2.gender}) - ID: ${cat2._id}`);
console.log('');
console.log(`   Owner 2: ${owner2.displayName} (${owner2.email})`);
console.log(`   - Cat: ${cat3.name} (${cat3.gender}) - ID: ${cat3._id}`);
console.log(`   - Cat: ${cat4.name} (${cat4.gender}) - ID: ${cat4._id}`);
console.log('');
console.log('💡 For testing API, use these Owner IDs:');
console.log(`   Owner 1 ID: ${owner1._id}`);
console.log(`   Owner 2 ID: ${owner2._id}`);

process.exit(0);
