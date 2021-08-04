const bodyParser = require('body-parser')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const AppointmentService = require('./services/AppointmentService')
const appointmentService = require('./services/AppointmentService')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/agendamento', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.set('useFindAndModify', false)

app.set('view engine','ejs')


//GET
app.get('/', (req, res) => {
    res.render('index')
})

app.get('/cadastro', (req, res) => {
    res.render('create')
})

app.get('/getcalendar', async (req, res) => {    
    const appointments = await appointmentService.getAll(false)
    res.json(appointments)
})

app.get('/event/:id', async (req, res) => {
    const appointment = await AppointmentService.getById(req.params.id)   
    res.render('event', {appo: appointment})
})

app.get('/list', async (req, res) => {
    const appos = await AppointmentService.getAll(true)
    res.render('list', {appos})    
})

app.get('/searchresult', async (req, res)=> {
    const appos = await AppointmentService.search(req.query.search)
    res.render('list', {appos}) 
})



//POST
app.post('/create', async (req, res) => {
    const status = await appointmentService.create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.cpf,
        req.body.date,
        req.body.time
    )

    status ? res.redirect('/') : res.send('Ocorreu um erro')
})

app.post('/finish', async (req, res) => {
    const id = req.body.id
    const result = await AppointmentService.finish(id)

    res.redirect('/')
})

const pollTime = 5 * 60000

setInterval(async () => {
    await AppointmentService.sendNotification()
}, pollTime)

app.listen(8000, () => {
    console.log('Servidor rodando...')
})