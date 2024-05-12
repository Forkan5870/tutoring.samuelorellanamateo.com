const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Payment', paymentSchema);