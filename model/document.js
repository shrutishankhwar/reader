const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    user:
    {
        type:
            mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    filename: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['complete', 'incomplete'], default: 'incomplete'
    },
    missingFields: { type: [String] },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Document", DocumentSchema);
