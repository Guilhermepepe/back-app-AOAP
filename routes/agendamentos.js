const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool



router.post('/consulta', (req, res, next) => {
    if(req.session.email){
        const email = req.session.email
    console.log(req.body)
    const { value, valueEspec, date, valuehora} = req.body
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT nome_medico from especialidade where tipo_espec = ? and nome_hosp = ?', [valueEspec, value], (error, results) => {
            conn.release()
            if (error) { return res.status(500).send({ error: error }) }
            response = {
                mensagem: "O médico é esse",
                nome_medico: results
            }
            res.status(200).send(response)
        
        conn.query('INSERT INTO consulta (nome_medico, nome_hosp , tipo_espec, dia_consulta, hora_consulta,email) values (?,?,?,?,?,?)', [response.nome_medico[0].nome_medico, value, valueEspec, date, valuehora,email], (error, results) => {
            conn.release()
            if (error) { return res.status(500).send({ error: error }) }
            
        })
    })
    })
    }
    else{
        res.status(401).send('Não autorizado')
    }
})

router.post('/teste', (req,res,next) => {
    const { value, valueEspec, valuehora, date } = req.body
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT nome_medico from especialidade where tipo_espec = ? and nome_hosp = ?', [valueEspec, value], (error, results) => {
            conn.release()
            if (error) { return res.status(500).send({ error: error }) }
            response = {
                mensagem: "O médico é esse",
                nome_medico: results
            }
            res.status(200).send(response.nome_medico[0].nome_medico)
        })
    })
})

module.exports = router