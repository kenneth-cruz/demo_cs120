require('dotenv').config();
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGO_URI);

app.use(express.static('views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home.html'));
});

app.get('/process', async (req, res) => {
  const userQuery = req.query.query.trim();
  console.log(`Received input: ${userQuery}`);

  try {
    await client.connect();
    const db = client.db('CS120db');
    const collection = db.collection('places');

    let result;
    if (/^\d/.test(userQuery)) {
      // Input starts with number => zip code
      result = await collection.findOne({ zips: userQuery });
    } else {
      // Input is place name
      result = await collection.findOne({ place: userQuery });
    }

    if (result) {
      console.log('Lookup Result:', result);
      res.send(`
        <h1>Search Results</h1>
        <p><strong>Place:</strong> ${result.place}</p>
        <p><strong>Zip Codes:</strong> ${result.zips.join(', ')}</p>
        <a href="/">Back</a>
      `);
    } else {
      res.send(`<h1>No results found for "${userQuery}"</h1><a href="/">Back</a>`);
    }
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
