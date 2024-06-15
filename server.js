const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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
});

// Create a model from the schema
const Garbage = mongoose.model('Garbage', GarbageSchema);

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// POST route to add new garbage data
app.post('/garbage', async (req, res) => {
    try {
        const garbage = new Garbage(req.body);
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

