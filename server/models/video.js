const mongoose = require('mongoose');
const { Schema } = mongoose;

const Video = new Schema ({
    name: String,
    path: String,
    date: { type: Date, default: Date.now },
    publish: {type: Boolean, default: false}
});

module.exports = mongoose.model('Video', Video);