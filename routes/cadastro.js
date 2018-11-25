const express = require('express');
const AD = require('ad');
const util = require('../controller/util');
const dbConfig = require('../datasources.production');
const adConfig = require('../ldap.production');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool(dbConfig);
const ad = new AD(adConfig);

/* Cadastrar um Usuario */
router.get('/turma', async (req, res) => {

    let finalResult = {

        "usuAdd": [],
        "usuExist": []

    };

    const text = 'SELECT * FROM aluno WHERE turma_base_aluno = $1 and semestre_turma_base_aluno = $2 AND cd_situacao_aluno = 2 limit 10';
    const values = [req.query.turma,req.query.ano];

    console.log(values);
    await pool.connect();

    const resposta = await pool.query(text,values);

    for (let i = 0; i < resposta.rows.length; i++) {

        let info = new Object();
        let row = resposta.rows[i];
        row.nome_aluno = util.titleCase(row.nome_aluno);
        splited = row.nome_aluno.split(' ');
        info.givenName = splited.shift() + '.' + splited.pop();
        if (await ad.user(info.givenName).exists() === false) {

            info.sAMAccountName = info.givenName;
            info.mail = info.givenName.toLowerCase() + '@al.celsolisboa.edu.br';
            row.nome_aluno = row.nome_aluno.split(' ');
            splited = row.nome_aluno.shift();
            info.sn = row.nome_aluno.join(' ');
            info.cn = row.nome_aluno = splited + ' ' + info.sn;
            info.displayName = row.nome_aluno;
            info.department = 'Alunos,OU=Academico';

            try {

                await ad.user().add({

                    firstName: splited,
                    lastname: info.sn,
                    commonName: info.cn,
                    userName: info.sAMAccountName,
                    password: row.cpf_aluno,
                    email: info.mail,
                    title: 'Aluno',
                    location: info.department

                });

                finalResult.usuAdd[i] = info.givenName;

            } catch (err) {

                res.status(503).send(err.message);

            }

        } else {

            finalResult.usuExist[i] = info.givenName;

        }

    }

    res.status(200).send(finalResult);
    await pool.end();

});

/* Desabilitar Usuario */
router.put('/usuario/:user/desabilitar', async (req, res) => {

    const user = req.params.user;
    ad.user(user).disable().then(respond => {

        res.status(200).send(respond);

    }).catch(err => {

        res.status(502).send(respond, err);

    });

});

/* Habilitar Usuario */
router.put('/usuario/:user/habilitar', async (req, res) => {

    const user = req.params.user;
    await ad.user(user).enable().then(respond => {

        res.status(200).send(respond);

    }).catch(err => {

        res.status(502).send(respond, err);

    });

});

/* Mudar senha de Usuario */
router.put('/usuario/:user/senha', async (req, res) => {

    const user = req.params.user;
    const pass = req.body.pass;

    try {

        await ad.user(user).password(pass)

    } catch (err) {
        console.log(err)
    }

});

module.exports = router;