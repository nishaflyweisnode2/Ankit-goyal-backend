const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    team: {
        type: String,
    },
    position: {
        type: String,
        enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicketkeeper'],
    },
    country: {
        type: String,
    },
    age: {
        type: Number,
    },
    price: {
        type: Number,
    },
    captain: {
        type: Boolean,
        default: false
    },
    viceCaptain: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
