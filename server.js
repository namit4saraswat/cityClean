const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
let upload = multer({ dest: 'uploads/' }); 
const aws = require('aws-sdk');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const env = require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
// Middleware
app.use(cors());
app.use(bodyParser.json());


// Initialize the S3 client with AWS SDK version 3
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});
upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket: process.env.BUCKET_NAME,
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        },
    }),
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/garbageData', { useNewUrlParser: true, useUnifiedTopology: true });

// Define a schema for the garbage data
const GarbageSchema = new mongoose.Schema({
    location: {
        lat: Number,
        lng: Number,
    },
    intensity: Number,
    description: String,
    photoUrls: [String] // Updated to store an array of strings (URLs)
});

// Create a model from the schema
const Garbage = mongoose.model('Garbage', GarbageSchema);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// POST route to add new garbage data
app.post('/garbage', upload.array('images'), async (req, res) => {
    // debugger;
    try {
        const { intensity, description, lat, lng } = req.body;
        const imagesUrls = req.files.map(file => file.location); // Assuming you'll store the path or generate a URL

        const garbage = new Garbage({
            location: { lat, lng },
            intensity,
            description,
            photoUrls: imagesUrls // Assuming your schema supports storing multiple image URLs
        });
        await garbage.save();
        res.status(201).send(garbage);
    } catch (error) {
        res.status(400).send(error);
    }
});


// GET route to fetch all garbage data
app.get('/garbage', async (req, res) => {
    try {
        const garbageData = await Garbage.find({});
        res.status(200).send(garbageData);
    } catch (error) {
        res.status(500).send(error);
    }
});

