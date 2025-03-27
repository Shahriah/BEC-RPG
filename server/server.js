require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Atlas Connection String (replace with your connection string)
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Successfully connected to MongoDB Atlas!'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Create User Schema
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  totalPoints: { 
    type: Number, 
    default: 0 
  },
  rank: { 
    type: String, 
    default: 'Rookie' 
  },
  missions: [{
    missionId: String,
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    bestTime: Number,
    completedAt: Date
  }],
  achievements: [{
    name: String,
    unlockedAt: Date
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Routes
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is connected!" });
});

// Create or get user
app.post('/api/users', async (req, res) => {
  try {
    const { username } = req.body;
    let user = await User.findOne({ username });
    
    if (!user) {
      user = new User({ username });
      await user.save();
    }
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user data
app.get('/api/users/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Complete mission
app.post('/api/missions/complete', async (req, res) => {
  try {
    const { username, missionId, score, timeSpent } = req.body;
    
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({ username });
    }

    // Calculate points
    const pointsEarned = Math.floor(score + (1000 / timeSpent));

    // Update mission progress
    const missionIndex = user.missions.findIndex(m => m.missionId === missionId);
    if (missionIndex === -1) {
      user.missions.push({
        missionId,
        completed: true,
        score,
        attempts: 1,
        bestTime: timeSpent,
        completedAt: new Date()
      });
    } else {
      const mission = user.missions[missionIndex];
      mission.attempts += 1;
      if (score > mission.score) {
        mission.score = score;
      }
      if (!mission.bestTime || timeSpent < mission.bestTime) {
        mission.bestTime = timeSpent;
      }
    }

    // Update total points
    user.totalPoints += pointsEarned;

    // Update rank based on total points
    if (user.totalPoints >= 5000) user.rank = 'Cyber Master';
    else if (user.totalPoints >= 3000) user.rank = 'Security Expert';
    else if (user.totalPoints >= 1500) user.rank = 'Defender';
    else if (user.totalPoints >= 500) user.rank = 'Trainee';

    await user.save();
    
    res.json({
      pointsEarned,
      totalPoints: user.totalPoints,
      rank: user.rank,
      missions: user.missions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users/reset', async (req, res) => {
  try {
    // Reset user data to initial state
    await User.updateMany({}, {
      $set: {
        totalPoints: 0,
        rank: 'Rookie',
        missions: [],
        achievements: []
      }
    });
    
    res.json({ message: 'All user data has been reset' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(cors({
    origin: "*", // Allow all domains for testing, but restrict this in production
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));