
// Kenneth Cruz - CS120

// environment variables for file stystem and 
// for mongo client below.
require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const { MongoClient } = require('mongodb');

async function main() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);
  const location = {};

  // create read stream for the csv file
  // line reader for the stream
  const fileStream = fs.createReadStream('zips.csv');
  const rl = readline.createInterface({ input: fileStream });

  // split and loop through the lines in the CSV
  // adding places, and updating zip codes
  for await (const line of rl) {
    const [place, zip] = line.trim().split(',');

    if (!location[place]) {
      location[place] = new Set();
      console.log(`New place added: ${place}`);
    }

    if (!location[place].has(zip)) {
      location[place].add(zip);
      console.log(`Updated place: ${place} with zip: ${zip}`);
    }
  }

  // conversion: object to array of MongoDB documents
  const documents = Object.entries(location).map(([place, zips]) => ({
    place,
    zips: Array.from(zips),
  }));

  // connecting to DB, collection, clear existing and insert new documents
  try {
    await client.connect();
    const db = client.db('CS120db');
    const collection = db.collection('places');

    await collection.deleteMany({});
    const result = await collection.insertMany(documents);

    // console log results
    // error handling and close before exiting program
    console.log(`Inserted ${result.insertedCount} documents into MongoDB`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();
