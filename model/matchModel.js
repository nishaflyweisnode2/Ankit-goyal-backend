const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    team1: {
        type: String,
    },
    team2: {
        type: String,
    },
    team1Image: {
        type: String
    },
    team2Image: {
        type: String
    },
    date: {
        type: Date,
    },
    venue: {
        type: String,
    },
    mega: {
        type: String,
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    }
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
