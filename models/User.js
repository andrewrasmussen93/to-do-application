const mongoose = require('mongoose');

// User schema.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){0,18}[a-zA-Z0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid username.`
        },
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'User', 'Pending'],
        default: 'Pending'
    }
});

module.exports = mongoose.model('User', userSchema);