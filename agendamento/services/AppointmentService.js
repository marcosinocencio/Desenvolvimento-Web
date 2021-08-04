const Appointment = require('../models/Appointment')
const mongoose = require('mongoose')
const AppointmentFactory = require('../factories/AppointmentFactory')
const mailer = require('nodemailer')

const Appo = mongoose.model('Appointment', Appointment)
class AppointmentService {

    async create(name, email, description, cpf, date, time){
        const newAppo = new Appo({
            name, 
            email, 
            description, 
            cpf, 
            date, 
            time,
            finished: false,
            notified: false
        })
        try {
            await newAppo.save()   
            return true          
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async getAll(showFinished){
       
        if(showFinished){
            return await Appo.find()
        }else{
            const appos = await Appo.find({'finished': false})
            const appointments = []

            appos.forEach(appointment => {
                if(appointment.date != undefined ){
                    appointments.push(AppointmentFactory.Build(appointment))
                }
            })

            return appointments
        }

    }

    async getById(id){
        try {
            const event = await Appo.findOne({'_id': id})            
            return event
        } catch (error) {
            console.log(error)
        }
    }

    async finish(id){
        try {
            await Appo.findByIdAndUpdate(id, {finished: true})   
            return true         
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async search(query){
        try {
            const appos = await Appo.find().or([{email: query},{ cpf: query}])
            return appos
        } catch (error) {
            console.log(error)
            return []
        }
        
    }

    async sendNotification(){
        
        const transporter = mailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 25,
            auth: {
                user: 'b7f554c1a653ba',
                pass: '6b347693e0f4b8'
            }
        })

        const appos = await this.getAll(false)
        appos.forEach(async app => {

            const date = app.start.getTime()
            const hour = 1000 * 60 * 60
            const gap = date - Date.now()

            if(gap <= hour){
               if(!app.notified){

                  await Appo.findByIdAndUpdate(app.id, {notified: true})

                  transporter.sendMail({
                    from: 'Teste <teste@gmail.com>',
                    to: app.email,
                    subject: 'Sua consulta acontecerá em breve',
                    text: 'Sua consulta vai aconteceer em uma hora'
                  })
                  .then(() => {

                  }).catch(err => {

                  })

               }
            }

        })
    }
}

module.exports = new AppointmentService