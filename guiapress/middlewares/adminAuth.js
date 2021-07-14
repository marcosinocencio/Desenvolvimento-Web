function adminAuth (req, res, next){
    req.session.user != undefined  ? next() : res.redirect('/login')
}

module.exports = adminAuth