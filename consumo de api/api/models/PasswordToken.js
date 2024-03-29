const knex = require('../database/connection')
const User = require('../models/User')

class PasswordToken {

    async create(email){
        const user = await User.findByEmail(email)

        if(user != undefined){
            try {
                const token = Date.now()
                await knex.insert({
                    user_id: user.id,
                    used: 0,
                    token
                })
                .table('passwordtokens')
                return {status: true, token}  

            } catch (error) {
                console.log(err)
                return {status: false, err}  
            }
        }else{
            return {status: false, err: 'Email não existe'}
        }
    }

    async validate(token){
        try {
            const result = await knex.select().where({token}).table('passwordtokens')  
            
            if(result.length > 0){
                const tk = result[0]

                if(tk.used){
                    return {status: false}
                }else{
                    return {status: true, token: tk}
                }

            }else{
                return {status: false}
            }
        } catch (err) {
            console.log(err)
            return {status: false}
        }
    }

    async setUsed(token){
        await knex.update({used: 1}).where({token}).table('passwordtokens')
    }
}

module.exports = new PasswordToken()