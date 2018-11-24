const dbConfig = require('../datasources.production');
const {Pool} = require('pg');
const pool = new Pool(dbConfig);

module.exports.queryTurma = async function queryTurma(pTurma, pAno) {

    try {

        client.connect();
        const text = 'SELECT * FROM aluno WHERE turma_base_aluno = $1 and semestre_turma_base_aluno = $2 limit 3';
        const values = [pTurma, pAno];
        let resQuery = await pool.query(text,values);
        return resQuery;

    } catch (err) {
        console.log(err);
    }

};



