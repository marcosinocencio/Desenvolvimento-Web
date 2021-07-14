const express = require('express')
const app = express()
const bodyparser = require('body-parser')
const connection = require('./database/database')
const session = require('express-session')
const { secret } = require('./.env')

const categoriesController = require('./categories/CategoriesController')
const articlesController = require('./articles/articlesController')
const usersController = require('./users/usersController')

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

app.set('view engine', 'ejs')

//Sessions
app.use(session({
    secret,
    cookie: {
        maxAge: 1000000000
    }
}))


//Static
app.use(express.static('public'))

//BodyParser
app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())

//Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com o Banco de Dados')
    })
    .catch(e => console.log(e))

app.use('/', categoriesController)
app.use('/', articlesController)
app.use('/', usersController)

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    })
    .then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles, categories })
        })
    })
})

app.get('/:slug', (req, res) => {
    const slug = req.params.slug

    Article.findOne({
        where: {
            slug
        }
    }).then(article => {
        article != undefined 
        ? Category.findAll().then(categories => {
            res.render('article', { article, categories })
        })
        : res.redirect('/')
    }).catch(err => res.redirect('/'))
})

app.get('/category/:slug', (req, res) => {
    const slug = req.params.slug

    Category.findOne({
        where: {
            slug
        },
        include: [{model: Article}]
    }).then( category => {
        category 
        ? Category.findAll()
            .then( categories => {
            res.render('index', {articles: category.articles, categories} )
        })
        : res.redirect('/')
    }).catch( err => res.redirect('/'))
})

app.listen(8080, () => {
    console.log('Servidor rodando')
})