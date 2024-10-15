require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const multer = require('multer');

const app = express();
const BASE_PORT = 5001;
const MAX_PORT = 65535;

// Middleware
const corsOptions = {
  origin: 'http://localhost:3001', // Make sure this matches your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Add this line
};
app.use(cors(corsOptions));
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}); 

let db;

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
    db = client.db("snagit"); // Make sure "snagit" is your actual database name
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

app.get('/', (req, res) => {
  res.send('Snagit Backend is running!');
});

// Add this new route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Snagit API' });
});

const upload = multer({ dest: 'uploads/' });

app.post('/api/snags', upload.single('image'), async (req, res) => {
  try {
    const snags = db.collection('snags');
    
    const newSnag = {
      title: req.body.title,
      description: req.body.description,
      createdAt: new Date(),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    };
    
    const result = await snags.insertOne(newSnag);
    
    res.status(201).json({
      message: 'Snag created successfully',
      snag: { ...newSnag, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error creating snag:', error);
    res.status(500).json({ message: 'Error creating snag', error: error.message });
  }
});

app.get('/api/snags', async (req, res) => {
  try {
    const snags = db.collection('snags');
    
    const allSnags = await snags.find({}).toArray();
    
    res.status(200).json(allSnags);
  } catch (error) {
    console.error('Error fetching snags:', error);
    res.status(500).json({ message: 'Error fetching snags', error: error.message });
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

async function startServer(port) {
  if (port > MAX_PORT) {
    console.error('No available ports found');
    process.exit(1);
  }

  try {
    await connectToMongo(); // Make sure this is called
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is busy, trying ${port + 1}`);
        startServer(port + 1);
      } else {
        console.error(err);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer(BASE_PORT);
