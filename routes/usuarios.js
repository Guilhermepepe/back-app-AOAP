const express = require('express')
const router = express.Router()
const mysql = require('../mysql').pool
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/cadastro', (req, res, next) => {
    const { nome, bairro, cidade, ruanum, cep, datanasc, email, senha } = req.body
    mysql.getConnection((err, conn) => {
        if (err) { return res.status(500).send({ error: error }) }
        conn.query('SELECT * FROM usuario WHERE email = ?', [email], (error, results) => {
            if (error) { return res.status(500).send({ error: error }) }
            if (results.length > 0) {
                res.status(401).send({ mensagem: "Usuário já cadastrado" })
            }
            else {
                bcrypt.hash(senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) { return res.status(500).send({ error: errBcrypt }) }
                    conn.query(
                        `INSERT INTO usuario (nome_usu,bairro,cidade,rua_num,cep,data_nasc,email,senha) VALUES (?,?,?,?,?,?,?,?)`,
                        [nome, bairro, cidade, ruanum, cep, datanasc, email, hash],
                        (error, results) => {
                            conn.release()
                            if (error) { return res.status(500).send({ error: error }) }
                            response = {
                                mensagem: "Usuário criado com sucesso",
                                usuarioCriado: {
                                    id_usuario: results.insertId,
                                    email
                                }
                            }
                            return res.status(201).send(response)
                        })
                })
            }
        })

    })
})

router.post('/login', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error }) }
        const query = 'SELECT * FROM usuario WHERE email = ?'
        conn.query(query, [req.body.email], (error, results, fields) => {
            conn.release()
            if(error) { return res.status(500).send({ error: error }) }
            if(results.length < 1) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            }
            bcrypt.compare(req.body.senha, results[0].senha, (err, result) => {
                if (err) {
                    return res.status(401).send({ mensagem: 'Falha na autenticação' })
                }
                if(result) {
                    req.session.email=req.body.email
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    }, 
                    process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    })
                    return res.status(200).send({ 
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    })
                }
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            })
        })
    })
})

router.post('/logout', (req, res, next) => {
    req.session.destroy()
})


router.post('/emergencia', (req, res, next) => {

})

router.get('/admin', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query('select count(id) as dados from consulta where dia_consulta between current_date()-7 and current_date()', (error, results, fields) => {
            conn.release()
            if (error) { return res.status(500).send({ error: error }) }
            console.log(results)
            res.status(200).send(results)
        })
    })
})

module.exports = router


