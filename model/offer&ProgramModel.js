const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    image: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    },
});


const Offer = mongoose.model('Offer&Program', offerSchema);

module.exports = Offer;
