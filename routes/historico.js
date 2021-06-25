const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool

router.get('/meusAgendamentos', (req, res, next) => {
    if(req.session.email){
        const email = req.session.email
    
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * from consulta where email = ?', [email], (error, results) => {
            conn.release()
            if (error) { return res.status(500).send({ error: error }) }
            res.status(200).send(results)
        })
    })
    }
    else{
        res.status(401).send('Não autorizado')
    }
})

module.exports = router