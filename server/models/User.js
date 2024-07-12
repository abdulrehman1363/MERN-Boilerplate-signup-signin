const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const keys = require('../config/keys')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    firstName: {type: 'string', required: true},
    lastName: {type: 'string', required: true},
    email: {type: 'string', required: true, unique: true},
    password: {type: 'string', required: true},
    isActive: {type: 'boolean', required: true, default: false},
})


userSchema.pre('save', async function(next){
    if (this.isModified('password')){
        this.password = await this.constructor.hashPassword(this.password)
    }
    next()
})

userSchema.statics.hashPassword = function(password){
    return bcrypt.hash(password,10)
}

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password, this.password)
}

userSchema.methods.generateAuthToken = async function(){
    return jwt.sign({ _id: this._id }, keys.jwtActivation, { expiresIn: '1h' });
}


module.exports = mongoose.model('User', userSchema)