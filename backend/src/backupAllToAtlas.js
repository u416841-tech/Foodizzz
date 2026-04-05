/**
 * backupAllToAtlas.js
 * Backs up only the 5 collections defined in backend/src/models/ to Atlas.
 * Collection names are derived from Mongoose model names (auto-pluralised).
 *
 * Run: node backend/src/backupAllToAtlas.js
 */

require('dotenv').config({ path: './backend/.env' });
const mongoose = require('mongoose');

const REMOTE_URI = process.env.MONGODB_URI;

// ── Exact mapping: where each collection lives locally ──────
// Mongoose model  →  local DB that actually has the data
const COLLECTIONS = [
  { model: 'Dish',            col: 'dishes',           localDb: 'orderease' },
  { model: 'Order',           col: 'orders',           localDb: 'test'      },
  { model: 'DeliveryPartner', col: 'deliverypartners', localDb: 'test'      },
  { model: 'ChatSession',     col: 'chatsessions',     localDb: 'test'      },
  { model: 'WhatsAppOrder',   col: 'whatsapporders',   localDb: 'test'      },
];

// Target Atlas database
const ATLAS_DB = 'orderease';

async function backup() {
  if (!REMOTE_URI) {
    console.error('❌  MONGODB_URI not set in backend/.env');
    process.exit(1);
  }

  console.log('🔌  Connecting to local MongoDB (localhost:27017)...');
  const local = await mongoose.createConnection('mongodb://localhost:27017').asPromise();

  console.log('🔌  Connecting to Atlas...');
  const remote = await mongoose.createConnection(REMOTE_URI, {
    serverSelectionTimeoutMS: 15000,
  }).asPromise();

  console.log('✅  Both connections ready\n');
  console.log(`${'Model'.padEnd(20)} ${'Local DB'.padEnd(12)} ${'Docs'.padEnd(6)} Status`);
  console.log('─'.repeat(60));

  for (const { model, col, localDb } of COLLECTIONS) {
    try {
      // Read from local
      const docs = await local.useDb(localDb).collection(col).find({}).toArray();

      if (docs.length === 0) {
        console.log(`${model.padEnd(20)} ${localDb.padEnd(12)} ${'0'.padEnd(6)} ⏭️  empty — skipped`);
        continue;
      }

      // Wipe Atlas collection then insert fresh
      const atlasCol = remote.useDb(ATLAS_DB).collection(col);
      await atlasCol.deleteMany({});
      await atlasCol.insertMany(docs, { ordered: false });

      console.log(`${model.padEnd(20)} ${localDb.padEnd(12)} ${String(docs.length).padEnd(6)} ✅  migrated`);
    } catch (err) {
      console.log(`${model.padEnd(20)} ${localDb.padEnd(12)} ${'?'.padEnd(6)} ❌  ${err.message}`);
    }
  }

  await local.close();
  await remote.close();
  console.log('\n🎉  Backup complete — all schema collections are now on Atlas.');
  process.exit(0);
}

backup().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
