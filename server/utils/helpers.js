const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const verifyJwt = token => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, keys.jwtActivation, (err, decode) => {
            if (err) {
                console.log("Error verifying JWT token:", err);
                return reject(err);
            }
    
            const user = jwt.decode(token)
    
            return resolve(user);
        })
    })

    
}

exports.verifyJwt = verifyJwt;