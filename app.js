var express = require('express');
var app = express();

var ldapConsultaRouter = require('./routes/consulta');
var ldapCadastroRouter = require('./routes/cadastro');

app.use('/consulta', ldapConsultaRouter);
app.use('/cadastro', ldapCadastroRouter);

// Export your Express configuration so that it can be consumed by the Lambda handler
module.exports = app
