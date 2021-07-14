const sequelize = require('sequelize')
const { senha } = require('../.env')

const connection = new sequelize('guiapress', 'root', senha, {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
})

module.exports = connection