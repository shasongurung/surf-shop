const User = require ('../models/user');
module.exports ={
    postRegister(req, res, next){
        const newUser = new User ({
            username : req.body.username,
            email : req.body.email,
            image: req.body.image
        });
        User.register(newUser, req.body.password,(err) => {
            if (err){
                console.log('error while user register');
                return next(err);
            }
            else{
                console.log('user registered');
                res.redirect('/');
            }
        });
    }
}