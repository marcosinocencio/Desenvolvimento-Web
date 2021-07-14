const sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('../categories/Category')

const Article = connection.define('article',{
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: sequelize.STRING,
        allowNull: false
    },
    body: {
        type: sequelize.TEXT,
        allowNull: false
    }
})

Category.hasMany(Article) // Relacionamento 1 para N
Article.belongsTo(Category) // Relacionamento 1 para 1 

module.exports = Article