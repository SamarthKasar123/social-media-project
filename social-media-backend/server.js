const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://socialmediain.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

app.options('*', cors());
app.use(express.json());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create tables if they don't exist
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        social_handle VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS images (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initDB();

// Routes
app.post('/api/submit', upload.array('images', 5), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { name, socialHandle } = req.body;
    
    // Insert user
    const userResult = await client.query(
      'INSERT INTO users (name, social_handle) VALUES ($1, $2) RETURNING id',
      [name, socialHandle]
    );
    const userId = userResult.rows[0].id;

    // Upload images to Cloudinary and store URLs
    const imagePromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'social-media-app' },
          async (error, result) => {
            if (error) reject(error);
            else {
              await client.query(
                'INSERT INTO images (user_id, image_url) VALUES ($1, $2)',
                [userId, result.secure_url]
              );
              resolve(result.secure_url);
            }
          }
        );

        uploadStream.end(file.buffer);
      });
    });

    await Promise.all(imagePromises);
    await client.query('COMMIT');
    
    res.json({ success: true, userId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error in submission:', err);
    res.status(500).json({ error: 'Submission failed' });
  } finally {
    client.release();
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.name,
        u.social_handle,
        json_agg(i.image_url) as images
      FROM users u
      LEFT JOIN images i ON u.id = i.user_id
      GROUP BY u.id, u.name, u.social_handle
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching submissions:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});