const User = require('../models/User');
const jwt = require('jsonwebtoken');

//handle errors
const handleErrors = (err) => {
    let errors = {email: '', password: ''};

    if(err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
    }
    if(err.message === 'incorrect password'){
        errors.password = 'that password is incorrect';
    }
    if(err.code === 11000){
        errors.email = 'that email is already registered';
        return errors;
    }
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }
    console.log(err);
    return errors;
}

//create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, 'secret', {
        expiresIn: maxAge
    })
}

module.exports.signup_get = (req, res) => {
    res.render('auth/signup', { title: 'Signup' });
}

module.exports.signup_post = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.create({email, password});
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json({user: user._id});
    }catch(err){
        console.log(email, password);
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.login_get = (req, res) => {
    res.render('auth/login', {title: 'Login'});
}

module.exports.login_post = async (req, res) =>{
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    }catch(err){
        console.log(email, password);
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
}

module.exports.logout_get = (req, res) =>{
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}