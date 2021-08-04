const User = require('../models/User')
const PasswordToken = require('../models/PasswordToken')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { secret } = require('../.env')

class UserController {
    async index (req, res){
        const users = await User.findAll()
        res.json(users)
    }

    async create (req, res){
        const {email, name, password} = req.body

        if(email == undefined || email.trim() == ''){
            res.status(400)
            res.json({err: 'email inválido'})
            return
        }

        if(await User.findEmail(email)){
            res.status(406)
            res.json({err: 'Email já cadastrado'})
            return
        }

        await User.new(email, password, name)

        res.status(200)
        res.send('Usuário cadastrado')
    }

    async findUser(req, res){
        const id = req.params.id
        const user = await User.findById(id)

        if(user == undefined){
            res.status(404)
            res.json({})
        }else{
            res.status(200)
            res.json(user)
        }
    }

    async edit(req, res){
        const {id, name, role, email} = req.body

        const result = await User.update(id, name, role, email)

        if(result != undefined){
            if(result.status){
                res.status(200)
                res.send('Tudo OK')
            }else{
                res.status(406)
                res.send(result.err)
            }
        }else{
            res.status(406)
            res.send('Ocorreu um erro no servidor.')
        }
    }

    async remove(req, res) {
        const id = req.params.id
        const result = await User.delete(id)

        if(result.status){
            res.status(200)
            res.send('Tudo OK')
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async recoverPassword(req, res){
        const email = req.body.email
        const result = await PasswordToken.create(email)

        if(result.status){
            res.status(200)
            res.send('' + result.token)            
        }else{
            res.status(406)
            res.send(result.err)
        }
    }

    async changePassword(req, res){
        const token = req.body.token
        const password = req.body.password
        const isTokenValid = await PasswordToken.validate(token)

        if(isTokenValid.status){
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send('Senha Alterada')
        }else{
            res.status(406)
            res.send('Token inválido')
        }
    }

    async login(req, res){
        const {email, password} = req.body
        const user = await User.findByEmail(email)
        
        if(user != undefined){
            const result = await bcrypt.compare(password, user.password)
            if(result){
                const token = jwt.sign({email: user.email, role: user.role}, secret)
                res.status(200)
                res.json({token})
            }else{
                res.status(401)
                res.json({err: 'Senha incorreta'})                
            }
        }else{
            res.status(400)
            res.json({status: false, err: 'Usuário não existe'})
        }
    }
}

module.exports = new UserController()