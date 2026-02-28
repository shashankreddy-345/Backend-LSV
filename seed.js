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

    if (process.env.NODE_ENV === 'production') {
      console.error('Error: Seeding is disabled in production to prevent data loss.');
      return;
    }

    // Uses the database defined in the URI (test)
    const db = client.db();
    const dataDir = path.join(__dirname, 'data');

    if (fs.existsSync(dataDir)) {
      const files = fs.readdirSync(dataDir);

      let bookingsData = [];
      for (const file of files) {
        if (file === 'bookings_new.csv' || file === 'bookings.csv') {
          const data = parseCSV(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
          if (Array.isArray(data)) {
            bookingsData = bookingsData.concat(data);
          }
        } else if (path.extname(file) === '.csv') {
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

      if (bookingsData.length > 0) {
        const collectionName = 'bookings';
        const collection = db.collection(collectionName);
        await collection.deleteMany({});
        const result = await collection.insertMany(bookingsData);
        console.log(`Seeded ${collectionName} with ${result.insertedCount} documents`);
      }
    } else {
      console.log('No data directory found');
    }
  } catch (err) {
    if (err.name === 'MongoServerSelectionError' && err.message.includes('SSL')) {
      console.error('\n❌ Connection Failed: This is likely due to MongoDB Atlas IP Whitelist restrictions.');
      console.error('👉 Go to MongoDB Atlas > Network Access > Add IP Address > Allow Access from Anywhere (0.0.0.0/0).\n');
    }
    console.error('Error seeding data:', err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  // Helper to split CSV line respecting quotes
  const splitLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { result.push(current); current = ''; }
      else { current += char; }
    }
    result.push(current);
    return result;
  };

  const headers = splitLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));

  return lines.slice(1).map(line => {
    const values = splitLine(line);
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

if (require.main === module) {
  seed();
}

module.exports = seed;