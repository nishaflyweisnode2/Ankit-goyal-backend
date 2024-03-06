const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Match"
    },
    name: {
        type: String,
        unique: true
    },
    entryFee: {
        type: Number,
    },
    prizePool: {
        type: Number,
    },
    startTime: {
        type: Date,
    },
    endTime: {
        type: Date,
    },
    maxParticipants: {
        type: Number,
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    winners: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    type: {
        type: String,
        enum: ['private', 'all'],
    },
    rules: {
        type: String
    },
    code: {
        type: String
    }
}, { timestamps: true });

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
