// ChatGPT backend

const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const { Configuration, OpenAIApi } = require("openai"); 
require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    message: "Too many requests, please try again later."
});

app.use('/ask', limiter);



app.get('/', (req, res) => {
    res.send('<h1>Hey</h1>');
});


app.post('/ask', async (req, res) => {
    try {
        const userInput = req.body.message;
        const response = await callChatGPTAPI(userInput);
        res.json({ message: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const callChatGPTAPI = async (input) => {

    const openaiResponse = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: "You are a helpful assistant."}, { role: "user", content: input }],
      temperature: 0.5,
      max_tokens: 1024,
    });

    return openaiResponse.data.choices[0].message.content;
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});