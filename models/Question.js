const mongoose = require('mongoose');

const QuestionSchema = mongoose.Schema({
    question_text: {
        type: String,
        required: true
    },
    technology: {
        type: String,
        required: true
    },
    answer:{
        type:String,
        default:null
    }
});

module.exports = mongoose.model('chatbotquestions', QuestionSchema);