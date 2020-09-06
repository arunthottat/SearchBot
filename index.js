const Joi = require('joi');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv/config');

app.use(express.json());

const questions = [
    {questionId:1,question_text:'How can Lamda accessed ?',technology:'Java',answer:'Lamda can be accessed using Functional interface '}
    // {questionId:2,question_text:'What is functional interface ?',technology:'Java',answer:'AN interface with only one abstract method'},
    // {questionId:3,question_text:'What is Lamda ?',technology:'Java',answer:'Lamda is anonymous function.'},
    // {questionId:4,question_text:'What is Lamda ?',technology:'Python',answer:'Python allows you to create anonymous function i.e function having no names using a facility called lambda function. Lambda functions are small functions usually not more than a line.'},
    // {questionId:5,question_text:'What is Lamda ?',technology:'AWS',answer:'AWS Lambda is a compute service that makes it easy for you to build applications that respond quickly to new information.'}
];



app.get('/api/FAQquestions/',async (req,res) => {
     const questions = await Question.find();
    if(questions){
        res.send(questions);
    }else{
        res.send("No Questions found ");
    } 
});


// app.get('/api/questions/:id', async (req,res) => {
//     // const question = questions.find(q => q.questionId === parseInt(req.params.id));
//     // if(!question)res.status(404).send("Question with given id is not available");
//     // res.send(question);
//     const questions = await Question.findById(req.params.id);
//     if(questions){
//         res.send(questions);
//     }else{
//         res.status(404).send("Question with given id is not available");
//     }
// });

app.get('/api/FAQquestions/:ques/:tech',async (req,res) => {
    // const question = questions.find(q => (q.question_text.toLowerCase().includes(req.params.ques.toLowerCase()) && q.technology.toLowerCase().includes(req.params.tech.toLowerCase())));
    // if(!question)res.status(404).send("Question is not available");
    // res.send(question);
    const questions = await Question.find({
        "question_text":{"$regex":req.params.ques, "$options": "i" }, 
        "technology":req.params.tech
    });
   
    if(questions && questions.length != 0){
        res.send(questions);
    }else{
        res.status(404).send("Question is not available");
    }
});

app.post('/api/FAQquestions/create', async (req,res) =>{
    console.log('In create operation');
const question = new Question( {
    question_text: req.body.question_text,
    technology: req.body.technology,
    answer: req.body.answer
});
// questions.push(question);
try{
    const savedQuestion = await question.save();
    (res.json(savedQuestion));    
    }catch(err){
        res.status(403).json( {message:err.message});
    }
});

app.put('/api/questions/update/:id',async(req,res) =>{
    console.log('In update operation');
    // const question = questions.find(q => q.questionId === parseInt(req.params.id));
    // if(!question)res.status(404).send("Question with given id is not available");

    // const {error} = validateQuestion(req.body);
    // if(error){
    //     res.status(400).send(error.details[0].message);
    //     return;
    // }   
    // question.question_text = req.body.question_text;
    // question.technology = req.body.technology;
    // question.answer = req.body.answer;
    // res.send(question);
    try{
        const updatedQuestion = await Question.updateOne({_id:req.params.id},{$set : {
            question_text : req.body.question_text,
            technology : req.body.technology,
            answer : req.body.answer
        }});
        res.json(updatedQuestion);
    }catch(err){
        res.send(err.message);
    }
});

app.delete('/api/questions/delete/:id',async (req,res) => {
    console.log('In delete operation');
    // const question = questions.find(q => q.questionId === parseInt(req.params.id));
    // if(!question)res.status(404).send("Question with given id is not available");

    // const index = questions.indexOf(question);
    // questions.splice(index,1);
    // res.send(question);
    try{
        const removedQuestion = await Question.deleteOne({_id:req.params.id});
        res.send(removedQuestion);
    }catch(err){
        res.status(404).send("Question with given id is not available");
    }
});

// Connect to Mongo DB
mongoose.connect(process.env.DB_CONNECTION,
{ useNewUrlParser: true,useUnifiedTopology: true },
 () =>{
    console.log('connected to mLab db chatbot');
}); 

const port = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening on port ${port}....`));

function validateQuestion(question){
    const schema = Joi.object({
        question_text: Joi.string().required(),
        technology: Joi.string().required(),
        answer:Joi.string().required()
    });
return schema.validate(question);
    
}
