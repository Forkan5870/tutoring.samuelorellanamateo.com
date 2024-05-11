const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    sessionId: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
});


module.exports = mongoose.model('Request', requestSchema);