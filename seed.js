const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

const client = new MongoClient(uri);

async function seed() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Uses the database defined in the URI (test)
    const db = client.db();
    const dataDir = path.join(__dirname, 'data');

    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);

      for (const file of files) {
        if (path.extname(file) === '.csv') {
          const collectionName = path.basename(file, '.csv');
          const collection = db.collection(collectionName);
          const data = parseCSV(fs.readFileSync(path.join(dataDir, file), 'utf-8'));

          if (Array.isArray(data) && data.length > 0) {
            await collection.deleteMany({});
            const result = await collection.insertMany(data);
            console.log(`Seeded ${collectionName} with ${result.insertedCount} documents`);
          }
        }
      }
    } else {
      console.log('No data directory found');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await client.close();
  }
}

function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, i) => {
      let val = values[i] ? values[i].trim().replace(/^"|"$/g, '') : '';
      if (val.toLowerCase() === 'true') val = true;
      else if (val.toLowerCase() === 'false') val = false;
      else if (!isNaN(Number(val)) && val !== '') val = Number(val);
      obj[header] = val;
    });
    return obj;
  });
}

seed();