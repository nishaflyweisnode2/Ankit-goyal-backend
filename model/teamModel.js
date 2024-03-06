const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    contest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contest'
    },
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match'
    },
    players: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }],
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    viceCaptain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
