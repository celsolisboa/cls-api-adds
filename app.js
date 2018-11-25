var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var ldapConsultaRouter = require('./routes/consulta');
var ldapCadastroRouter = require('./routes/cadastro');

app.use('/consulta', ldapConsultaRouter);
app.use('/cadastro', ldapCadastroRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;
