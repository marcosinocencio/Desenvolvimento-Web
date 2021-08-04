const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const { key } = require('./.env')
const jwt = require('jsonwebtoken')

function auth (req, res, next) {
    const authToken = req.headers['authorization']

    if(authToken != undefined){
        const bearer = authToken.split(' ')
        
        jwt.verify(bearer[1], key, (err, data) => {
            if(err){
                res.status(401)
                res.json({err: 'Token inválido'})
            }else{
                req.token = bearer[1]
                req.loggedUser = {id: data.id, email: data.email}
                next()
            }
        })
    }else{
        res.status(401)
        res.json({err: 'Token inválido'})
    }     
}

var DB = {
    games: [
        {
            id: 21,
            title: 'Call of Duty MW',
            year: 2019,
            price: 60
        },
        {
            id: 65,
            title: 'Sea of Thieves',
            year: 2018,
            price: 40
        },
        {
            id: 2,
            title: 'Minecraft',
            year: 2012,
            price: 20
        }
    ],
    users: [
        {
            id: 1,
            name: 'Pedro',
            email: 'pedro@gmail.com',
            password: 'fkasdjklsdalk'
        },
        {
            id: 2,
            name: 'Ana',
            email: 'ana@gmail.com',
            password: 'fhgdgrehjre54d'
        }
    ]
}


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.get('/games', auth, (req, res) => {
    res.statusCode = 200
    res.json( DB.games)
})

app.get('/game/:id', auth, (req, res) => {

    const id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400)
    } else {

        let game = DB.games.find(game => game.id == parseInt(id))

        if (game != undefined) {
            res.statusCode = 200
            res.json(game)
        } else {
            res.sendStatus(404)
        }
    }

})

app.post('/game', auth, (req, res) => {
    const { title, price, year } = req.body

    DB.games.push({
        id: 123,
        title,
        price,
        year
    })

    res.sendStatus(200)
})

app.delete("/game/:id", auth, (req, res) => {
    const id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400)
    } else {

        let index = DB.games.findIndex(game => game.id == parseInt(id))

        if (index == -1) {
            res.sendStatus(404)
        } else {
            DB.games.splice(index, 1)
            res.sendStatus(200)
        }
    }
})

app.put('/game/:id', auth, (req, res) => {

    const id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400)
    } else {

        let game = DB.games.find(game => game.id == parseInt(id))

        if (game != undefined) {

            const { title, price, year } = req.body

            if (title != undefined) {
                game.title = title
            }

            if (price != undefined) {
                game.price = price
            }

            if (year != undefined) {
                game.year = year
            }

            res.sendStatus(200)


        } else {
            res.sendStatus(404)
        }
    }

})

app.post('/auth', (req, res) => {
    const { email, password } = req.body

    if (email != undefined) {
        const user = DB.users.find(user => user.email == email)

        if (user != undefined) {
            if (user.password == password) {

                jwt.sign({ id: user.id, email: user.email }, key, { expiresIn: '10h' }, (err, token) => {
                    if (err) {
                        res.status(400)
                        res.json({ err: "Falha interna" })
                    } else {
                        res.status(200)
                        res.json({ token })
                    }
                })

            } else {
                res.status(401)
                res.json({ err: 'Credenciais inválidas' })
            }
        } else {
            res.status(404)
            res.json({ err: 'Usuário não existe' })
        }
    } else {
        res.status(400)
        res.json({ err: 'Email inválido' })
    }
})

app.listen(3000, () => {
    console.log("API rodando...")
})