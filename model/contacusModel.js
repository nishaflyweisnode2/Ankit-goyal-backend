const mongoose = require('mongoose');

const contactUsSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
    },
    email: {
        type: String,
    },
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;
