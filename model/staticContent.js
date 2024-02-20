const mongoose = require('mongoose');
const staticContent = mongoose.Schema({
    terms: {
        type: String,
    },
    privacy: {
        type: String,
    },
    aboutUs: {
        type: String,
    },
    legality: {
        type: String,
    },
    type: {
        type: String,
        enum: ["ABOUTUS", "TERMS", "PRIVACY", "LEGALITY"],
    },
}, { timestamps: true })
module.exports = mongoose.model('staticContent', staticContent);