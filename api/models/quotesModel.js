const { Schema, model } = require('mongoose')

const schema = {
    createdBy: { type: String, required: true },
    quote: { type: String },
    artist: { type: String, required: false },
    isImage: { type: Boolean, required: false },
    url: { type: String },
}

const options = {
    timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' }
}

module.exports = model('quotes', new Schema(schema, options)) 