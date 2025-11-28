const { MongoClient } = require('mongodb');

const uri = 'mongodb://distrochess:blimey@mongodb-1650-0.cloudclusters.net:10005/distrochess?authSource=admin';

async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log('✓ MongoDB instance is alive!');
  } catch (err) {
    console.log('✗ Connection failed:', err.message);
  } finally {
    await client.close();
  }
}

test();
