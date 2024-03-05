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
        enum: ['active', 'completed', 'cancelled'],
        default: 'active'
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
