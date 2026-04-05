/**
 * seedDemoData.js
 * Seeds realistic Indian dummy orders + delivery partners into Atlas.
 * Uses actual dish names/prices from the dishes collection.
 * Run: node backend/src/seedDemoData.js
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

const ATLAS_DB = 'orderease';

// ── Real dishes from Atlas (name + price) ──────────────────
const DISHES = [
  { name: 'Paneer Butter Masala',      price: 199 },
  { name: 'Chicken Biryani',           price: 249 },
  { name: 'Butter Chicken',            price: 229 },
  { name: 'Masala Dosa',               price: 129 },
  { name: 'Chole Bhature',             price: 149 },
  { name: 'Veg Thali',                 price: 229 },
  { name: 'Rajma Chawal',              price: 179 },
  { name: 'Pav Bhaji',                 price: 149 },
  { name: 'Vada Pav',                  price: 79  },
  { name: 'Idli Sambar',               price: 119 },
  { name: 'Dal Tadka with Jeera Rice', price: 189 },
  { name: 'Palak Paneer',              price: 199 },
  { name: 'Kadai Paneer',              price: 209 },
  { name: 'Tandoori Chicken',          price: 279 },
  { name: 'Hyderabadi Dum Biryani',    price: 259 },
  { name: 'Veg Biryani',               price: 199 },
  { name: 'Paneer Tikka',              price: 219 },
  { name: 'Garlic Naan',               price: 49  },
  { name: 'Mango Lassi',               price: 79  },
  { name: 'Gulab Jamun',               price: 79  },
];

// ── Delivery partners ──────────────────────────────────────
const PARTNERS = [
  { name: 'Rajesh Kumar',    phone: '+91 98765 43210', status: 'available' },
  { name: 'Amit Sharma',     phone: '+91 87654 32109', status: 'available' },
  { name: 'Sarthak Desai',   phone: '+91 76543 21098', status: 'busy'      },
  { name: 'Vikram Patil',    phone: '+91 91234 56789', status: 'available' },
  { name: 'Rohit Verma',     phone: '+91 99887 76655', status: 'busy'      },
];

// ── Indian customer names + addresses ─────────────────────
const CUSTOMERS = [
  { name: 'Priya Sharma',      phone: '9876543210', address: 'Flat 4B, Shivaji Nagar, Pune' },
  { name: 'Rahul Mehta',       phone: '9765432109', address: '12, MG Road, Bengaluru' },
  { name: 'Ananya Iyer',       phone: '9654321098', address: '7, Anna Salai, Chennai' },
  { name: 'Suresh Patel',      phone: '9543210987', address: '23, Satellite Road, Ahmedabad' },
  { name: 'Kavita Joshi',      phone: '9432109876', address: '5, Lajpat Nagar, New Delhi' },
  { name: 'Arjun Nair',        phone: '9321098765', address: '88, Marine Drive, Mumbai' },
  { name: 'Deepika Reddy',     phone: '9210987654', address: '14, Banjara Hills, Hyderabad' },
  { name: 'Manish Gupta',      phone: '9109876543', address: '3, Civil Lines, Jaipur' },
  { name: 'Sneha Kulkarni',    phone: '9098765432', address: '9, FC Road, Pune' },
  { name: 'Aditya Singh',      phone: '8987654321', address: '6, Hazratganj, Lucknow' },
  { name: 'Pooja Agarwal',     phone: '8876543210', address: '21, Park Street, Kolkata' },
  { name: 'Kiran Bhat',        phone: '8765432109', address: '11, Indiranagar, Bengaluru' },
];

const STATUSES = ['queued', 'preparing', 'ready', 'picked', 'out_for_delivery'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function makeOrder(index, now) {
  const customer = CUSTOMERS[index % CUSTOMERS.length];
  const status   = STATUSES[index % STATUSES.length];

  // 1–3 random dishes per order
  const itemCount = rand(1, 3);
  const usedDishes = new Set();
  const items = [];
  while (items.length < itemCount) {
    const dish = pick(DISHES);
    if (usedDishes.has(dish.name)) continue;
    usedDishes.add(dish.name);
    items.push({ name: dish.name, quantity: rand(1, 3), price: dish.price });
  }

  // Stagger createdAt across last 7 days
  const createdAt = new Date(now - index * 6 * 60 * 60 * 1000); // every 6 hours back

  // Unique displayOrderId per order
  const dateStr = createdAt.toISOString().slice(0, 10).replace(/-/g, '');
  const displayOrderId = `${dateStr}-${String(index + 1).padStart(3, '0')}`;

  return {
    items,
    customer,
    status,
    displayOrderId,
    timeRequired: pick([15, 20, 25, 30]),
    preparationStartedAt: status !== 'queued' ? new Date(createdAt.getTime() + 2 * 60 * 1000) : null,
    paymentDetails: {
      payment_status: 'completed',
      amount: items.reduce((s, i) => s + i.price * i.quantity, 0),
      currency: 'INR',
    },
    source: pick(['website', 'website', 'whatsapp']),
    createdAt,
    updatedAt: createdAt,
  };
}

async function seed() {
  console.log('🔌  Connecting to Atlas...');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  const db = mongoose.connection.useDb(ATLAS_DB);
  const now = Date.now();

  // ── Delivery Partners ──────────────────────────────────
  await db.collection('deliverypartners').deleteMany({});
  const partnerDocs = PARTNERS.map(p => ({
    ...p,
    createdAt: new Date(now - rand(1, 10) * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    __v: 0,
  }));
  await db.collection('deliverypartners').insertMany(partnerDocs);
  console.log(`✅  Delivery partners: ${partnerDocs.length} inserted`);

  // ── Orders ─────────────────────────────────────────────
  // Keep existing real orders, just add 12 demo ones
  const existingCount = await db.collection('orders').countDocuments();
  const orders = Array.from({ length: 12 }, (_, i) => makeOrder(i, now));
  await db.collection('orders').insertMany(orders, { ordered: false });
  console.log(`✅  Orders: 12 demo orders added (${existingCount} already existed)`);

  await mongoose.disconnect();
  console.log('\n🎉  Demo data seeded on Atlas!');
  process.exit(0);
}

seed().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
