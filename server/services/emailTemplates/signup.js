const keys = require('../../config/keys')

module.exports = token => {
    return `
        <h1>Please use the following link to activate your account</h1>
        <p>${keys.clientURL}/auth/activate/${token}</p>
        <hr/>
        <p>This email may contain sensitive information.</p>
        <p>${keys.clientURL}</p>
        `
}