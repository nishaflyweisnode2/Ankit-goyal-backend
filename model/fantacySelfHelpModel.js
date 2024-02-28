const mongoose = require('mongoose');
const staticContent = mongoose.Schema({
    title: {
        type: String,
    },

}, { timestamps: true })
module.exports = mongoose.model('FantacySelfHelp', staticContent);