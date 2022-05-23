const mongoose = require('mongoose');

// Task schema.
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    startDate: {
        type: Date,        
        default: new Date(),
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    // TODO: Figure out how to use ref.
});

// Archive task schema.
const archiveTaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    startDate: {
        type: Date,        
        default: new Date(),
        required: true
    },
    completed: {
        type: Boolean,
        default: false,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    // TODO: Figure out if there's a more efficient way to use multiple schemas.
});

// Creating model for both schemas.
const Task = mongoose.model('Task', taskSchema);
const Archive = mongoose.model('Archive', archiveTaskSchema, 'archive');

// Exporting model schemas.
module.exports = {
    Task, Archive
}