const mongoose = require('mongoose');

const { toJSON } = require('../plugins');

// -------------------------------------

const faqSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
  },
});

faqSchema.plugin(toJSON);

const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;
