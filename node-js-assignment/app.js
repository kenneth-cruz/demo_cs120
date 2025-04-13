
// Kenneth Cruz - CS120

// environment variables and mongo settings below
require('dotenv').config();
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

// setting up the express backend/port
const app = express();
const port = process.env.PORT || 3000;
const client = new MongoClient(process.env.MONGO_URI);

app.use(express.static('views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/home.html'));
});

// query with user input
app.get('/process', async (req, res) => {
  const userInput = req.query.query.trim();
  console.log(`Received input: ${userInput}`);

  // mongo db and collection
  try {
    await client.connect();
    const db = client.db('CS120db');
    const collection = db.collection('places');

    //regex if statement to differentiate input
    let result;
    if (/^\d/.test(userInput)) {
      //  starts with number = zip code
      result = await collection.findOne({ zips: userInput });
    } else {
      // else, a place name 
      result = await collection.findOne({ place: userInput });
    }

    // displaying result in the front end
    if (result) {
      console.log('Lookup Result:', result);
      res.send(`
        <h1>Search Result</h1>
        <p><strong>Place:</strong> ${result.place}</p>
        <p><strong>Zip Code(s):</strong> ${result.zips.join(', ')}</p>
        <a href="/">Back</a>
      `);
    } else {
      res.send(`<h1> No results available for "${userInput}"</h1><a href="/">Home</a>`);
    }
  } catch (err) {
    console.error('Database Error:', err);
    res.status(500).send('Server error');
  }
});

// print out localhost port to see
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
