const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add the user name.']
    },
    email: {
        type: String,
        required: [true, 'Please add the email address.'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please add you Password']
    },
    mmr: { type: Number, default: 1000 },
    wins: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    matchHistory: [
        {
            result: { type: String }, // "WIN", "LOSS", "DRAW"
            score: { type: Number },  // Total score in the match
            wpm: { type: Number },    // Speed (Words/Answers Per Minute)
            accuracy: { type: Number },
            date: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);