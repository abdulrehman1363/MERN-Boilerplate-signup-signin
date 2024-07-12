require('dotenv').config()
module.exports = {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT,
    postmarkUser: process.env.POST_MARK_USER,
    jwtActivation: process.env.JWT_ACCOUNT_ACTIVATION,
    clientURL: process.env.CLIENT_URL,
    fromEmail: process.env.FROM_EMAIL,
}