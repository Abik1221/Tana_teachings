const mongoose = require('mongoose');
const FamilySchema = new mongoose.Schema({
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    contactEmail: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Family', FamilySchema);