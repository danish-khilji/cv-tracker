import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    contact: {
        type: String,
    },
    techstack: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ['On-Hold', 'Scheduled', 'Done'],
        default: null
    },
    selected: {
        type: String,
        enum: ['Yes', 'No'],
        default: null
    },
    remarks: {
        type: String,
    },
    pdfIpfsHash: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Candidate = mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);

export default Candidate;
