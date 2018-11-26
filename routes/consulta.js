const express = require('express');
const AD = require('ad');
const router = express.Router();
const adConfig = require('../ldap.production');

/* String de conexão */

const ad = new AD(adConfig);

/* Consulta ao Usuario */
router.get('/usuario/:user', async (req, res) => {
    const user = req.params.user;
    await ad.user(user).get().then(respond => {
        res.status(200).send(respond);
    }).catch(err => {
        res.status(502).send(respond, err);
    });
});

/* Checa se usuario existe */
router.get('/usuario/:user/existe', async (req, res) => {
    const user = req.params.user;
    await ad.user(user).exists().then(respond => {
        res.status(200).send(respond);
    }).catch(err => {
        res.status(502).send(respond, err);
    });
});

/* Checa se usuario existe */
router.get('/', async (req, res) => {
    const user = 'LDAP';
    await ad.user(user).exists().then(respond => {
        res.status(200).send(respond);
    }).catch(err => {
        res.status(502).send(respond, err);
    });
});

/* Autentica Usuario */
router.get('/usuario/:user/autenticar', async (req, res) => {
    const user = req.params.user;
    const pass = req.body.password;
    await ad.user(user).authenticate(pass).then(respond => {
        res.status(200).send(respond);
    }).catch(err => {
        res.status(502).send(respond, err);
    });
});

/* Autentica Usuario */
router.get('/usuario/:user/deleta', async (req, res) => {
    const user = req.params.user;
    await ad.user(user).delete().then(respond => {
        res.status(200).send(respond);
    }).catch(err => {
        res.status(502).send(respond, err);
    });
});

/*res.render('ldap', { title: 'Executando!' });*/

module.exports = router;
