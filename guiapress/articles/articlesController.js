const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/articles', adminAuth, (req, res) => {
    Article.findAll({
        include: [{ model: Category }]
    })
        .then(articles => {
            res.render('admin/articles/index', { articles })
        })
})

router.get('/admin/articles/new', adminAuth, (req, res) => {
    Category.findAll().then(categories => res.render('admin/articles/new', { categories }))
})

router.post('/articles/save', adminAuth, (req, res) => {
    const data = {
        title: req.body.title,
        body: req.body.body,
        category: req.body.category
    }

    Article.create({
        title: data.title,
        slug: slugify(data.title),
        body: data.body,
        categoryId: data.category
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.post('/articles/delete', adminAuth, (req, res) => {
    const id = req.body.id

    if (id !== undefined) {
        if (!isNaN(id)) {

            Article.destroy({
                where: {
                    id
                }
            }).then(() => {
                res.redirect('/admin/articles')
            })

        } else {
            res.redirect('/admin/articles')
        }
    } else {
        res.redirect('/admin/articles')
    }
})

router.get('/admin/articles/edit/:slug', adminAuth, (req, res) => {

    const slug = req.params.slug

    Article.findOne({
        where: { slug }
    })
        .then(article => {
            if (article != undefined) {
                Category.findAll().then(categories => res.render('admin/articles/edit', { article, categories }))

            } else {
                res.redirect('/admin/articles')
            }
        })
        .catch(err => {
            res.redirect('/admin/articles')
        })
})

router.post('/articles/update', adminAuth, (req, res) => {
    const data = {
        id: req.body.id,
        title: req.body.title,
        body: req.body.body,
        categoryId: req.body.category
    }    

    Article.update({ title: data.title, slug: slugify(data.title), body: data.body, categoryId: data.categoryId }, {
        where: {
            id: data.id
        }
    }).then(() => {
        res.redirect('/admin/articles')
    })
})

router.get('/articles/page/:num', (req, res) => {
    const page = req.params.num
    let offset = 0

    if( isNaN(page) || page == 1) {
        offset = 0
    }else {
        offset = (parseInt(page)-1) * 4
    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    })
    .then(articles => {
        let next
        offset + 4 >= articles.count ? next = false : next = true 

        const result = {
            page: parseInt(page),
            articles,
            next
        }

        Category.findAll().then(categories => {
            res.render('admin/articles/page', {result, categories})
        })       
    })
})

module.exports = router