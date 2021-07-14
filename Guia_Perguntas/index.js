const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const connection = require('./database/database')
const Pergunta = require('./database/Pergunta')
const Resposta = require('./database/Resposta')

connection.authenticate()
    .then(() => {
        console.log('Conexão feita com o banco de dados')
    })
    .catch(e => {
        console.log(e)
    })
    

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.get('/', (req, res) => {   
    Pergunta.findAll({ 
        raw: true,
        order: [
            ['createdAt', 'DESC']
        ] 
    })
    .then(perguntas => res.render("index", { perguntas }) )    
})

app.get('/perguntar', (req, res) => {   
    res.render("perguntar")
})

app.post('/salvarpergunta', (req, res) => {   
    var dados = {
        titulo: req.body.titulo,
        descricao: req.body.descricao
    }
    
    Pergunta.create({
        titulo: dados.titulo,
        descricao: dados.descricao
    }).then(() => {
        res.redirect('/')
    })
})

app.get('/pergunta/:id', (req, res) => {
    const id = req.params.id
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined ){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta,
                    respostas
                })
            })
           
        }else {
            res.redirect('/')
        }
    })
})

app.post('/responder', (req, res) => {
    const dados = {
        corpo: req.body.corpo,
        perguntaId: req.body.pergunta
    }

    Resposta.create({
        corpo: dados.corpo,
        perguntaId: dados.perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${dados.perguntaId}`)        
    })
})

app.listen(3000, () => {
    console.log('Servidor rodando...')
})