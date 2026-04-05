/**
 * migrateToAtlas.js
 * Copies all documents from local MongoDB → remote Atlas in one shot.
 * Run once: node backend/src/migrateToAtlas.js
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

const LOCAL_URI  = 'mongodb://localhost:27017/orderease';
const REMOTE_URI = process.env.MONGODB_URI; // your Atlas URI from .env

// Collections to migrate
const COLLECTIONS = ['dishes', 'orders', 'deliverypartners', 'chatsessions', 'whatsapporders'];

async function migrate() {
  if (!REMOTE_URI) {
    console.error('❌  MONGODB_URI not found in backend/.env');
    process.exit(1);
  }

  console.log('🔌  Connecting to local MongoDB...');
  const local = await mongoose.createConnection(LOCAL_URI).asPromise();

  console.log('🔌  Connecting to Atlas...');
  const remote = await mongoose.createConnection(REMOTE_URI, {
    serverSelectionTimeoutMS: 15000,
  }).asPromise();

  console.log('✅  Both connections established\n');

  for (const col of COLLECTIONS) {
    try {
      const docs = await local.db.collection(col).find({}).toArray();

      if (docs.length === 0) {
        console.log(`⏭️   ${col}: empty — skipping`);
        continue;
      }

      // Wipe the remote collection first so we don't get duplicates
      await remote.db.collection(col).deleteMany({});

      // Re-insert with original _id values preserved
      await remote.db.collection(col).insertMany(docs, { ordered: false });

      console.log(`✅  ${col}: migrated ${docs.length} documents`);
    } catch (err) {
      console.error(`❌  ${col}: ${err.message}`);
    }
  }

  await local.close();
  await remote.close();
  console.log('\n🎉  Migration complete!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
