const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
    User.findAll().then(users => res.render('admin/users/index', { users }))
})

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create')
})

router.post('/user/create', (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne({
        where: {
            email: data.email
        }
    }).then(user => {
        if (user == undefined) {
            const salt = bcrypt.genSaltSync(10)
            const hash = bcrypt.hashSync(data.password, salt)

            User.create({
                email: data.email,
                password: hash
            }).then(() => {
                res.redirect('/')
            }).catch(e => {
                res.redirect('/')
            })
        } else {
            res.redirect('/admin/users/create')
        }
    })
})

router.get('/login', (req, res) => {
    res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    User.findOne({where: {email: data.email} }).then(user => {
        if(user != undefined ){
            const pass = bcrypt.compareSync(data.password, user.password)

            pass 
            ? req.session.user = {id: user.id, email: user.email}
            : res.redirect('/login')
            res.redirect('/admin/articles')
        }else{
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.user = undefined
    res.redirect('/')
})

module.exports = router