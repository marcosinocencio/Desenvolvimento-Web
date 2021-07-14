const sequelize = require('sequelize')
const { senha } = require('../.env')

const connection = new sequelize('guiaperguntas', 'root', senha, {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection