const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')

const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')
const rotaUsuarios = require('./routes/usuarios')
const rotaAgendamento = require('./routes/agendamentos')
const rotaHistorico = require('./routes/historico')


app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false})) // apenas aceitar dados simples
app.use(bodyParser.json()) // json de entrada no body
app.use(cors());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 3600000 }})) 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') // se fosse um servidor específico, teria que colocar o endereço no lugar do '*', ex: http://servidorespecifico.com.br
    res.header(
        'Access-Control-Allow-Header', 
        'Origin, X-RequestedWith, Content-Type, Accept, Authorization'
    )

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }

    next()
    
})

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)
app.use('/usuarios', rotaUsuarios)
app.use('/agendamentos', rotaAgendamento)
app.use('/historico', rotaHistorico)

// Quando não encontra rota, entra aqui:
app.use((req, res, next) =>{
    const erro = new Error('Não encontrado')
    erro.status = 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})


module.exports = app

