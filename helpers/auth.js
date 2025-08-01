const bcrypt = require('bcryptjs');

const hashpassword = async (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (err, salt) => {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

const comparepassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}

module.exports = {
    hashpassword,
    comparepassword
}
