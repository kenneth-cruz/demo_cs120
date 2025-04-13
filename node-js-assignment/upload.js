require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  const placeMap = {};

  const fileStream = fs.createReadStream('zips.csv');
  const rl = readline.createInterface({ input: fileStream });

  for await (const line of rl) {
    const [place, zip] = line.trim().split(',');

    if (!placeMap[place]) {
      placeMap[place] = new Set();
      console.log(`New place added: ${place}`);
    }

    if (!placeMap[place].has(zip)) {
      placeMap[place].add(zip);
      console.log(`Updated place: ${place} with zip: ${zip}`);
    }
  }

  const documents = Object.entries(placeMap).map(([place, zips]) => ({
    place,
    zips: Array.from(zips),
  }));

  try {
    await client.connect();
    const db = client.db('CS120db');
    const collection = db.collection('places');

    await collection.deleteMany({});
    const result = await collection.insertMany(documents);

    console.log(`Inserted ${result.insertedCount} documents into MongoDB`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
