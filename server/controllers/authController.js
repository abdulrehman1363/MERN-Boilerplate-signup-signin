const User = require('../models/User')
const validateSignUp = require('../validations/signup')
const validateLogin = require('../validations/login')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const signupTemplate = require('../services/emailTemplates/signup')
const postmark = require('postmark')
const helpers = require('../utils/helpers')

const createUser = async (req, res) => {
    
    const { error } = validateSignUp.validate(req.body)
    if (error) {
        res.status(400).send({message: error.details[0].message})
    }

    const { firstName, lastName, email, password } = req.body

    const user = await User.findOne({ email: email })

    if(user){
        res.status(400).send({message: 'User already exists'})
    }

    try {
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password
        })

        const token = jwt.sign(
            {newUser},
            keys.jwtActivation,
            {expiresIn: '60m'}
        )

        const signup = signupTemplate(token);

        //console.log("postmark = ",  keys.postmarkUser)
        const client = new postmark.ServerClient(keys.postmarkUser)

        client.sendEmail({
            'From': keys.fromEmail,
            "To": email,
            "Subject": "Activate Your Account",
            "HtmlBody": signup,
            "Text": signup,
            "MessageStream": "broadcast"
        })

        res.status(200).send({'message': 'Account created successfully', user: newUser})

    } catch (error) {
        res.status(500).send({'message': error.message})
    }
}

const accountVerification = async (req, res) => {
    const { token } = req.body;

    if(token){
        try {
            const {newUser} = await helpers.verifyJwt(token);
            console.log('user = ', newUser);

            const updatedUser = await User.findByIdAndUpdate(newUser._id,
                {$set: {isActive: true}},
                {new: true}
            )

            res.status(200).send({message: 'Account Successfully verified. Please log in'})


        } catch (error) {
            res.status(401).send({
                error: 'Error Validating your account'
            });
        }
    }
}

const login = async (req, res) => {
    const { error } = validateLogin.validate(req.body);

    if (error){
        res.status(400).send({message: error.details[0].message})
    }

    const { email , password } = req.body

    try {
        const user = await User.findOne({email})

        if(!user){
            res.status(401).send({message: 'Invalid email or password'})
        }

        const isMatch = await user.comparePassword(password)

        if(!isMatch){
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if(!user.isActive){
            return res.status(401).json({ message: 'Account not active' });
        }

        const token = await user.generateAuthToken(user)

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const reSendEmail = async (req, res) => {
    try {
        const newUser = req.body
        const token = jwt.sign(
            {newUser},
            keys.jwtActivation,
            {expiresIn: '60m'}
        )

        const signup = signupTemplate(token);

        //console.log("postmark = ",  keys.postmarkUser)
        const client = new postmark.ServerClient(keys.postmarkUser)

        client.sendEmail({
            'From': keys.fromEmail,
            "To": email,
            "Subject": "Activate Your Account",
            "HtmlBody": signup,
            "Text": signup,
            "MessageStream": "broadcast"
        })

        res.status(200).send({'message': 'Email sent Successfully', user: newUser})

    } catch (error) {
        
    }
}

exports.createUser = createUser;
exports.accountVerification = accountVerification;
exports.login = login;
exports.reSendEmail = reSendEmail;