require('dotenv').config({ path: 'variaveis.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); 
const routes = require('./router');

const server = express();


server.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: false, 
    cookie: { secure: false } 
}));

server.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(routes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
});
