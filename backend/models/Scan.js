const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        required: true
    },
    reason: {
        type: String,
        default: ''
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner'],
        required: true
    },
    scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Scan', scanSchema);
